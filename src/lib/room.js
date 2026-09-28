import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { leatherNormal } from './leather'

// ─────────────────────────────────────────────────────────────────────────────
//  "The Room": a cube sewn from six leather panels, strapped shut like luggage.
//  Its doorway is a stencil portal onto a corridor far deeper than the cube.
//  It casts the shadow of whatever its hide was made into.
//
//  Render order each frame:
//   1. the room itself            (colour + depth)
//   2. the doorway mask           (stencil only, depth-tested against the room)
//   3. clear depth
//   4. the corridor               (drawn only where the stencil was marked)
// ─────────────────────────────────────────────────────────────────────────────

const HALF = 1          // half the cube's size
const T = 0.1           // panel core thickness
const BT = 0.022        // bevel thickness
const BS = 0.022        // bevel size
const GAP = 0.02        // seam between panels
const A = HALF - GAP - BS
const Z_IN = HALF - T - 2 * BT   // inner face of the front panel
const DOOR = { w: 0.74, h: 1.2, y0: -0.86 }
const OPEN_W = DOOR.w - 2 * BS
const OPEN_H = DOOR.h - 2 * BS
const DOOR_CY = DOOR.y0 + DOOR.h / 2
const STRAP_Y = 0.64

export const HIDE_LOOKS = {
  suede:  { color: '#5b5936', edge: '#34331f', roughness: 0.95, sheen: 1.0, sheenColor: '#a9a47b', sheenRoughness: 0.55, clearcoat: 0.02, clearcoatRoughness: 0.8, map: 'suede',   normal: 0.55 },
  nappa:  { color: '#5f1624', edge: '#240a10', roughness: 0.42, sheen: 0.3, sheenColor: '#b86a78', sheenRoughness: 0.45, clearcoat: 0.45, clearcoatRoughness: 0.32, map: 'pebble', normal: 0.32 },
  pullup: { color: '#2d3b34', edge: '#121a16', roughness: 0.52, sheen: 0.15, sheenColor: '#7a9687', sheenRoughness: 0.5, clearcoat: 0.72, clearcoatRoughness: 0.24, map: 'crackle', normal: 0.6 },
}

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const lerp = (a, b, t) => a + (b - a) * t

function roundRect(p, x, y, w, h, r) {
  p.moveTo(x + r, y)
  p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r)
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r)
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y)
  return p
}

function panelGeometry(withDoor) {
  const shape = roundRect(new THREE.Shape(), -A, -A, 2 * A, 2 * A, 0.07)
  if (withDoor) shape.holes.push(roundRect(new THREE.Path(), -DOOR.w / 2, DOOR.y0, DOOR.w, DOOR.h, 0.035))
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: T, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelSegments: 3, curveSegments: 8,
  })
  g.translate(0, 0, -T / 2)
  return g
}

// A strap: a flat band swept along a path. widthAt returns the band's width direction.
function bandGeometry(pts, widthAt, width, thick, closed) {
  const n = pts.length
  const pos = [], uv = [], idx = []
  const Tn = new THREE.Vector3(), W = new THREE.Vector3(), N = new THREE.Vector3(), v = new THREE.Vector3()
  const corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  let run = 0
  for (let i = 0; i < n; i++) {
    const prev = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)]
    const next = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)]
    Tn.subVectors(next, prev).normalize()
    W.copy(widthAt(i, Tn)).normalize()
    N.crossVectors(Tn, W).normalize()
    if (i > 0) run += pts[i].distanceTo(pts[i - 1])
    corners.forEach(([sw, sn], k) => {
      v.copy(pts[i]).addScaledVector(W, (sw * width) / 2).addScaledVector(N, (sn * thick) / 2)
      pos.push(v.x, v.y, v.z)
      uv.push(run * 3, k / 3)
    })
  }
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const a = i * 4, b = ((i + 1) % n) * 4
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4
      idx.push(a + k, b + k, b + k2, a + k, b + k2, a + k2)
    }
  }
  if (!closed) {
    const e = (n - 1) * 4
    idx.push(0, 1, 2, 0, 2, 3, e, e + 2, e + 1, e, e + 3, e + 2)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function roundedLoop(half, r, seg) {
  const c = half - r, out = []
  for (const [cx, cy, a0] of [[c, c, 0], [-c, c, Math.PI / 2], [-c, -c, Math.PI], [c, -c, Math.PI * 1.5]]) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2)
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  return out
}

function stitchesAlong(path, spacing, open = false) {
  const len = path.getLength()
  const n = Math.max(2, Math.floor(len / spacing))
  const out = []
  for (let i = 0; i < n; i++) {
    const t = open ? i / (n - 1) : i / n
    out.push({ p: path.getPointAt(Math.min(t, 1)), t: path.getTangentAt(Math.min(t, 0.9999)) })
  }
  return out
}

function signTexture() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 192
  const x = c.getContext('2d')
  x.fillStyle = '#12a35a'; x.fillRect(0, 0, 512, 192)
  x.fillStyle = '#eafff2'
  x.font = '800 118px Archivo, "Arial Narrow", Arial, sans-serif'
  x.textBaseline = 'middle'
  x.fillText('EXIT', 44, 100)
  x.beginPath(); x.moveTo(372, 96); x.lineTo(456, 96); x.lineWidth = 16; x.strokeStyle = '#eafff2'; x.stroke()
  x.beginPath(); x.moveTo(430, 64); x.lineTo(466, 96); x.lineTo(430, 128); x.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const x = c.getContext('2d')
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(120,255,180,0.9)'); g.addColorStop(0.35, 'rgba(61,220,132,0.35)'); g.addColorStop(1, 'rgba(61,220,132,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function createRoom(canvas, { hide = 'suede', shadows, motion = true, onReady } = {}) {
  const owned = { geo: [], mat: [], tex: [] }
  const G = g => (owned.geo.push(g), g)
  const M = m => (owned.mat.push(m), m)
  const X = t => (owned.tex.push(t), t)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, stencil: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.autoClear = false
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const camera = new THREE.PerspectiveCamera(32, 1, 0.02, 90)
  const main = new THREE.Scene()
  const maskScene = new THREE.Scene()
  const inside = new THREE.Scene()
  inside.fog = new THREE.Fog(0x1f4a38, 0.4, 15)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRoom = new RoomEnvironment()
  const env = pmrem.fromScene(envRoom, 0.04)
  main.environment = env.texture
  main.environmentIntensity = 0.55
  envRoom.dispose?.()
  pmrem.dispose()

  // ── materials ────────────────────────────────────────────────────────────
  const look0 = HIDE_LOOKS[hide] || HIDE_LOOKS.suede
  const hideMat = M(new THREE.MeshPhysicalMaterial({
    color: look0.color, roughness: look0.roughness, metalness: 0,
    sheen: look0.sheen, sheenColor: new THREE.Color(look0.sheenColor), sheenRoughness: look0.sheenRoughness,
    clearcoat: look0.clearcoat, clearcoatRoughness: look0.clearcoatRoughness,
    normalMap: leatherNormal(look0.map), normalScale: new THREE.Vector2(look0.normal, look0.normal),
  }))
  hideMat.normalMap.repeat.set(1.4, 1.4)
  const edgeMat = M(new THREE.MeshPhysicalMaterial({ color: look0.edge, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }))
  const strapMat = M(new THREE.MeshPhysicalMaterial({ color: '#3b281d', roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.4, side: THREE.DoubleSide }))
  const brass = M(new THREE.MeshStandardMaterial({ color: '#b39452', metalness: 1, roughness: 0.3 }))
  const thread = M(new THREE.MeshStandardMaterial({ color: '#d9c89b', roughness: 0.75 }))

  // ── the room ─────────────────────────────────────────────────────────────
  const room = new THREE.Group()
  main.add(room)
  const faces = [
    { n: [0, 0, 1], r: [0, 0, 0], door: true },
    { n: [0, 0, -1], r: [0, Math.PI, 0] },
    { n: [1, 0, 0], r: [0, Math.PI / 2, 0] },
    { n: [-1, 0, 0], r: [0, -Math.PI / 2, 0] },
    { n: [0, 1, 0], r: [-Math.PI / 2, 0, 0] },
    { n: [0, -1, 0], r: [Math.PI / 2, 0, 0] },
  ]
  const plain = G(panelGeometry(false))
  const withDoor = G(panelGeometry(true))
  const zOut = T / 2 + BT
  const stitchSpots = []
  const rivetSpots = []
  const seamPath = roundRect(new THREE.Path(), -(A - 0.07), -(A - 0.07), 2 * (A - 0.07), 2 * (A - 0.07), 0.05)
  const doorSeam = new THREE.Path()
  {
    const xl = -DOOR.w / 2 - 0.06, xr = DOOR.w / 2 + 0.06, yb = DOOR.y0 + 0.05, yt = DOOR.y0 + DOOR.h + 0.06, r = 0.06
    doorSeam.moveTo(xl, yb); doorSeam.lineTo(xl, yt - r); doorSeam.quadraticCurveTo(xl, yt, xl + r, yt)
    doorSeam.lineTo(xr - r, yt); doorSeam.quadraticCurveTo(xr, yt, xr, yt - r); doorSeam.lineTo(xr, yb)
  }
  const corner = A - 0.13
  for (const f of faces) {
    const mesh = new THREE.Mesh(f.door ? withDoor : plain, [hideMat, edgeMat])
    mesh.position.set(...f.n).multiplyScalar(HALF - zOut)
    mesh.rotation.set(...f.r)
    mesh.updateMatrix()
    room.add(mesh)
    for (const s of stitchesAlong(seamPath, 0.072)) stitchSpots.push({ m: mesh.matrix, ...s })
    if (f.door) for (const s of stitchesAlong(doorSeam, 0.072, true)) stitchSpots.push({ m: mesh.matrix, ...s })
    for (const [x, y] of [[corner, corner], [-corner, corner], [-corner, -corner], [corner, -corner]]) rivetSpots.push({ m: mesh.matrix, x, y })
    if (f.door) {
      const dx = DOOR.w / 2 + 0.13
      for (const [x, y] of [[dx, DOOR.y0 + 0.12], [-dx, DOOR.y0 + 0.12], [dx, DOOR.y0 + DOOR.h - 0.05], [-dx, DOOR.y0 + DOOR.h - 0.05]]) rivetSpots.push({ m: mesh.matrix, x, y })
    }
  }
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpP = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1)
  const zAxis = new THREE.Vector3(0, 0, 1)
  const stitches = new THREE.InstancedMesh(G(new THREE.CylinderGeometry(0.0062, 0.0062, 0.04, 5, 1)), thread, stitchSpots.length)
  stitchSpots.forEach((s, i) => {
    tmpQ.setFromAxisAngle(zAxis, Math.atan2(s.t.y, s.t.x) - Math.PI / 2)
    tmpP.set(s.p.x, s.p.y, zOut + 0.002)
    tmpM.compose(tmpP, tmpQ, one).premultiply(s.m)
    stitches.setMatrixAt(i, tmpM)
  })
  room.add(stitches)
  const rivetGeo = G(new THREE.SphereGeometry(0.03, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2))
  rivetGeo.rotateX(Math.PI / 2)
  const rivets = new THREE.InstancedMesh(rivetGeo, brass, rivetSpots.length)
  rivetSpots.forEach((s, i) => {
    tmpM.makeTranslation(s.x, s.y, zOut).premultiply(s.m)
    rivets.setMatrixAt(i, tmpM)
  })
  room.add(rivets)

  // Light leaking from the doorway.
  const leak = new THREE.PointLight(0x3ddc84, 4, 3.2, 2)
  leak.position.set(0, DOOR_CY, HALF + 0.3)
  room.add(leak)

  // ── straps ───────────────────────────────────────────────────────────────
  const strapA = new THREE.Group()
  const strapB = new THREE.Group()
  room.add(strapA, strapB)
  const up = new THREE.Vector3(0, 1, 0), fwd = new THREE.Vector3(0, 0, 1)
  const loopA = roundedLoop(HALF + 0.035, 0.08, 6).map(([u, v]) => new THREE.Vector3(u, STRAP_Y, v))
  strapA.add(new THREE.Mesh(G(bandGeometry(loopA, () => up, 0.13, 0.022, true)), strapMat))
  const loopB = roundedLoop(HALF + 0.066, 0.09, 6).map(([u, v]) => new THREE.Vector3(u, v, -0.42))
  strapB.add(new THREE.Mesh(G(bandGeometry(loopB, () => fwd, 0.12, 0.022, true)), strapMat))
  // buckle on the front of strap A
  const buckle = new THREE.Group()
  const box = G(new THREE.BoxGeometry(1, 1, 1))
  for (const [x, y, w, h] of [[0, 0.074, 0.2, 0.022], [0, -0.074, 0.2, 0.022], [-0.089, 0, 0.022, 0.17], [0.089, 0, 0.022, 0.17], [0, 0, 0.016, 0.17]]) {
    const bar = new THREE.Mesh(box, brass)
    bar.position.set(x, y, 0); bar.scale.set(w, h, 0.02)
    buckle.add(bar)
  }
  buckle.position.set(0.42, STRAP_Y, HALF + 0.035 + 0.024)
  strapA.add(buckle)
  // the loose end floats upward, as if gravity had been switched off
  const tailPivot = new THREE.Group()
  tailPivot.position.set(0.52, STRAP_Y, HALF + 0.05)
  strapA.add(tailPivot)
  const tailCurve = new THREE.CatmullRomCurve3([
    [0, 0, 0], [0.26, 0.04, 0.06], [0.53, 0.25, 0.05], [0.73, 0.62, -0.1], [0.78, 1.05, -0.33], [0.68, 1.45, -0.5],
  ].map(p => new THREE.Vector3(...p)))
  const tailPts = tailCurve.getPoints(60)
  const tmpW = new THREE.Vector3()
  tailPivot.add(new THREE.Mesh(G(bandGeometry(tailPts, (i, tan) => tmpW.crossVectors(tan, fwd), 0.13, 0.022, false)), strapMat))

  // A thread coming loose from the top seam.
  const THREAD_N = 48
  const threadGeo = G(new THREE.BufferGeometry())
  threadGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(THREAD_N * 3), 3))
  const threadLine = new THREE.Line(threadGeo, M(new THREE.LineBasicMaterial({ color: '#d9c89b' })))
  threadLine.frustumCulled = false
  room.add(threadLine)
  const threadBase = new THREE.Vector3(-0.3, HALF + 0.004, A - 0.07)

  // ── the wrong shadow, on the wall behind ─────────────────────────────────
  const loader = new THREE.TextureLoader()
  const shadowMats = [0, 1].map(() => M(new THREE.MeshBasicMaterial({ color: 0x050b08, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })))
  const shadowGeo = G(new THREE.PlaneGeometry(4.2, 4.2))
  const shadowPlanes = shadowMats.map(m => { const p = new THREE.Mesh(shadowGeo, m); p.position.set(1.55, 0.0, -2.8); main.add(p); return p })
  const shadowTex = {}
  let shadowFront = 0
  const loadShadow = id => new Promise(res => {
    if (shadowTex[id]) return res(shadowTex[id])
    if (!shadows?.[id]) return res(null)
    loader.load(shadows[id], t => { shadowTex[id] = X(t); res(t) }, undefined, () => res(null))
  })

  // lights
  main.add(new THREE.HemisphereLight(0xe8f5e6, 0x1a2a22, 0.6))
  const key = new THREE.DirectionalLight(0xfff1da, 2.4); key.position.set(-3, 4.5, 5); main.add(key)
  const rim = new THREE.DirectionalLight(0x9fd8c0, 1.2); rim.position.set(4, 1.5, -3); main.add(rim)

  // ── doorway mask ─────────────────────────────────────────────────────────
  const maskRoot = new THREE.Group(); maskRoot.matrixAutoUpdate = false; maskScene.add(maskRoot)
  const maskMat = M(new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }))
  maskMat.stencilWrite = true
  maskMat.stencilRef = 1
  maskMat.stencilFunc = THREE.AlwaysStencilFunc
  maskMat.stencilZPass = THREE.ReplaceStencilOp
  const mask = new THREE.Mesh(G(new THREE.PlaneGeometry(OPEN_W + 0.004, OPEN_H + 0.004)), maskMat)
  mask.position.set(0, DOOR_CY, Z_IN + 0.0015)
  maskRoot.add(mask)

  // ── the corridor inside ──────────────────────────────────────────────────
  const inRoot = new THREE.Group(); inRoot.matrixAutoUpdate = false; inside.add(inRoot)
  const portal = m => {
    m.stencilWrite = true; m.stencilRef = 1; m.stencilFunc = THREE.EqualStencilFunc
    m.stencilFail = THREE.KeepStencilOp; m.stencilZFail = THREE.KeepStencilOp; m.stencilZPass = THREE.KeepStencilOp
    m.toneMapped = false
    return M(m)
  }
  const CW = 1.1, FLOOR = DOOR.y0, CEIL = DOOR.y0 + 1.62, LEN = 70, ZC = Z_IN - LEN / 2
  const addPlane = (w, h, color, pos, rot) => {
    const p = new THREE.Mesh(G(new THREE.PlaneGeometry(w, h)), portal(new THREE.MeshBasicMaterial({ color })))
    p.position.set(...pos); p.rotation.set(...rot); inRoot.add(p); return p
  }
  addPlane(2 * CW, LEN, 0x29483b, [0, FLOOR, ZC], [-Math.PI / 2, 0, 0])
  addPlane(2 * CW, LEN, 0x17302a, [0, CEIL, ZC], [Math.PI / 2, 0, 0])
  addPlane(LEN, CEIL - FLOOR, 0x22413a, [-CW, (FLOOR + CEIL) / 2, ZC], [0, Math.PI / 2, 0])
  addPlane(LEN, CEIL - FLOOR, 0x1d3b33, [CW, (FLOOR + CEIL) / 2, ZC], [0, -Math.PI / 2, 0])
  addPlane(2 * CW, CEIL - FLOOR, 0x1f4a38, [0, (FLOOR + CEIL) / 2, Z_IN - LEN + 0.2], [0, 0, 0])
  const TUBES = 40
  const tubes = new THREE.InstancedMesh(box, portal(new THREE.MeshBasicMaterial({ color: 0xe9fff1 })), TUBES)
  const pools = new THREE.InstancedMesh(G(new THREE.PlaneGeometry(1.3, 0.95)), portal(new THREE.MeshBasicMaterial({ color: 0x4f8a70, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending })), TUBES)
  const qFloor = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  const noRot = new THREE.Quaternion()
  for (let i = 0; i < TUBES; i++) {
    const z = Z_IN - 0.9 - i * 1.7
    tubes.setMatrixAt(i, tmpM.compose(tmpP.set(0, CEIL - 0.015, z), noRot, new THREE.Vector3(0.56, 0.022, 0.07)))
    pools.setMatrixAt(i, tmpM.compose(tmpP.set(0, FLOOR + 0.003, z), qFloor, one))
  }
  inRoot.add(tubes, pools)
  const FRAMES = 18
  const frames = new THREE.InstancedMesh(box, portal(new THREE.MeshBasicMaterial({ color: 0x0c1a15 })), FRAMES * 3)
  for (let i = 0; i < FRAMES; i++) {
    const z = Z_IN - 2.4 - i * 3.4, fh = OPEN_H + 0.05
    frames.setMatrixAt(i * 3, tmpM.compose(tmpP.set(-OPEN_W / 2 - 0.04, FLOOR + fh / 2, z), noRot, new THREE.Vector3(0.07, fh, 0.07)))
    frames.setMatrixAt(i * 3 + 1, tmpM.compose(tmpP.set(OPEN_W / 2 + 0.04, FLOOR + fh / 2, z), noRot, new THREE.Vector3(0.07, fh, 0.07)))
    frames.setMatrixAt(i * 3 + 2, tmpM.compose(tmpP.set(0, FLOOR + fh, z), noRot, new THREE.Vector3(OPEN_W + 0.15, 0.07, 0.07)))
  }
  inRoot.add(frames)
  const TAPE = 130
  const tape = new THREE.InstancedMesh(G(new THREE.PlaneGeometry(0.035, 0.24)), portal(new THREE.MeshBasicMaterial({ color: 0xc9a94a })), TAPE)
  for (let i = 0; i < TAPE; i++) tape.setMatrixAt(i, tmpM.compose(tmpP.set(0, FLOOR + 0.005, Z_IN - 0.35 - i * 0.5), qFloor, one))
  inRoot.add(tape)
  const signMat = portal(new THREE.MeshBasicMaterial({ map: X(signTexture()), fog: false }))
  const sign = new THREE.Mesh(G(new THREE.PlaneGeometry(0.42, 0.158)), signMat)
  const halo = new THREE.Mesh(G(new THREE.PlaneGeometry(1.5, 0.8)), portal(new THREE.MeshBasicMaterial({ map: X(glowTexture()), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.7 })))
  sign.position.set(0, CEIL - 0.24, -14)
  halo.position.set(0, CEIL - 0.24, -14.01)
  inRoot.add(halo, sign)

  // ── state ────────────────────────────────────────────────────────────────
  const state = {
    p: 0, motion, t: 0, rotY: -0.62, velY: 0.12, drag: false, lastX: 0, lastT: 0,
    px: 0, py: 0, sx: 0, sy: 0, width: 1, height: 1, camZ0: 7.6, camZEnd: 1.6, visible: true, disposed: false,
    lookFrom: new THREE.Vector3(0, 0.62, 0), lookTo: new THREE.Vector3(0, DOOR_CY, -12), look: new THREE.Vector3(),
  }
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth
    const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight
    state.width = w; state.height = h
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // keep the whole room in frame on narrow screens
    state.camZ0 = Math.max(7.6, 3.5 / (2 * tanHalf * camera.aspect))
    // end the dolly just in front of the doorway, with the opening filling the screen
    const dEnd = Math.min(OPEN_W / (2 * tanHalf * camera.aspect), OPEN_H / (2 * tanHalf)) * 0.9
    state.camZEnd = HALF + Math.max(0.06, dEnd)
  }

  function frame(dt) {
    const s = state
    s.t += dt
    const p = s.p
    const face = smooth(0, 0.34, p)
    const release = smooth(0.1, 0.55, p)
    const dolly = smooth(0.36, 1, p)
    // rotation: idle drift and drag, then turn the door to face you
    if (!s.drag && s.motion && p < 0.02) s.rotY += s.velY * dt
    if (!s.drag) s.velY += (0.12 * (s.motion ? 1 : 0) - s.velY) * Math.min(1, dt * 1.5)
    const front = Math.round(s.rotY / (Math.PI * 2)) * Math.PI * 2
    s.sx += (s.px - s.sx) * Math.min(1, dt * 3)
    s.sy += (s.py - s.sy) * Math.min(1, dt * 3)
    room.rotation.y = lerp(s.rotY + s.sx * 0.12, front, face)
    room.rotation.x = lerp(0.16 + s.sy * 0.1, 0, face)
    room.rotation.z = lerp(-0.035, 0, face)
    room.position.y = s.motion ? Math.sin(s.t * 0.8) * 0.05 * (1 - face) : 0
    // straps slip off: A rises over the top, B slides out backwards
    strapA.position.y = release * 3.4
    strapA.rotation.x = release * 0.45
    strapB.position.z = -release * 3.6
    strapB.rotation.z = release * 0.5
    if (s.motion) {
      tailPivot.rotation.z = Math.sin(s.t * 0.7) * 0.06 + release * 0.3
      tailPivot.rotation.y = Math.sin(s.t * 0.45 + 1) * 0.1
    }
    // the loose thread
    const arr = threadGeo.attributes.position.array
    for (let i = 0; i < THREAD_N; i++) {
      const k = i / (THREAD_N - 1)
      const wave = s.motion ? s.t : 0
      arr[i * 3] = threadBase.x + Math.sin(wave * 0.9 + k * 5) * 0.12 * k + k * 0.25
      arr[i * 3 + 1] = threadBase.y + k * 1.9
      arr[i * 3 + 2] = threadBase.z + Math.cos(wave * 0.7 + k * 4) * 0.1 * k - k * 0.3
    }
    threadGeo.attributes.position.needsUpdate = true
    // the door hums
    leak.intensity = (3.4 + (s.motion ? Math.sin(s.t * 11) * 0.12 + Math.sin(s.t * 2.3) * 0.25 : 0)) * (1 + dolly * 1.5)
    // shadow drifts a little with the pointer and fades as you go in
    const so = 1 - smooth(0.2, 0.7, p)
    shadowPlanes.forEach((pl, i) => {
      pl.position.x = 1.55 + s.sx * 0.18
      pl.position.y = -s.sy * 0.1
      pl.material.opacity += (((i === shadowFront && pl.material.map) ? 0.72 : 0) * so - pl.material.opacity) * Math.min(1, dt * 4)
    })
    // the exit keeps its distance: almost there
    sign.position.z = -14 - p * 16
    halo.position.z = sign.position.z - 0.01
    // camera
    camera.position.set(0, lerp(0.35, DOOR_CY, dolly), lerp(s.camZ0, s.camZEnd, dolly))
    s.look.lerpVectors(s.lookFrom, s.lookTo, dolly)
    camera.lookAt(s.look)

    room.updateMatrixWorld(true)
    maskRoot.matrix.copy(room.matrixWorld)
    inRoot.matrix.copy(room.matrixWorld)
    maskScene.updateMatrixWorld(true)
    inside.updateMatrixWorld(true)

    renderer.clear(true, true, true)
    renderer.render(main, camera)
    renderer.render(maskScene, camera)
    renderer.clearDepth()
    renderer.render(inside, camera)
  }

  // ── loop, input, lifecycle ───────────────────────────────────────────────
  let raf = 0, last = performance.now(), readyFired = false
  const loop = now => {
    raf = 0
    if (state.disposed) return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    frame(dt)
    if (!readyFired) { readyFired = true; onReady?.() }
    if (state.visible && !document.hidden) raf = requestAnimationFrame(loop)
  }
  const wake = () => { if (!raf && !state.disposed && state.visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop) } }

  const onDown = e => {
    if (state.p > 0.05) return
    state.drag = true; state.lastX = e.clientX; state.lastT = performance.now()
    canvas.setPointerCapture?.(e.pointerId)
    canvas.classList.add('is-dragging')
  }
  const onMove = e => {
    const r = canvas.getBoundingClientRect()
    state.px = ((e.clientX - r.left) / r.width) * 2 - 1
    state.py = ((e.clientY - r.top) / r.height) * 2 - 1
    if (!state.drag) return
    const now = performance.now()
    const dx = e.clientX - state.lastX
    state.rotY += dx * 0.009
    state.velY = (dx * 0.009) / Math.max(0.008, (now - state.lastT) / 1000)
    state.velY = Math.max(-4, Math.min(4, state.velY))
    state.lastX = e.clientX; state.lastT = now
  }
  const onUp = () => { state.drag = false; canvas.classList.remove('is-dragging') }
  canvas.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)

  const ro = new ResizeObserver(() => { resize(); wake() })
  ro.observe(canvas)
  const io = new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; wake() })
  io.observe(canvas)
  const onVis = () => wake()
  document.addEventListener('visibilitychange', onVis)
  const onLost = e => { e.preventDefault(); api.onLost?.() }
  canvas.addEventListener('webglcontextlost', onLost)

  resize()
  wake()

  async function setHide(id) {
    const look = HIDE_LOOKS[id]
    if (!look) return
    const c = new THREE.Color(look.color), sc = new THREE.Color(look.sheenColor), ec = new THREE.Color(look.edge)
    const from = {
      r: hideMat.color.r, g: hideMat.color.g, b: hideMat.color.b, sr: hideMat.sheenColor.r, sg: hideMat.sheenColor.g, sb: hideMat.sheenColor.b,
      er: edgeMat.color.r, eg: edgeMat.color.g, eb: edgeMat.color.b,
      roughness: hideMat.roughness, sheen: hideMat.sheen, sheenRoughness: hideMat.sheenRoughness, clearcoat: hideMat.clearcoat, clearcoatRoughness: hideMat.clearcoatRoughness,
    }
    const nm = leatherNormal(look.map)
    nm.repeat.set(1.4, 1.4)
    hideMat.normalMap = nm
    hideMat.normalScale.set(look.normal, look.normal)
    const start = performance.now(), dur = 700
    const step = () => {
      const k = smooth(0, 1, (performance.now() - start) / dur)
      hideMat.color.setRGB(lerp(from.r, c.r, k), lerp(from.g, c.g, k), lerp(from.b, c.b, k))
      hideMat.sheenColor.setRGB(lerp(from.sr, sc.r, k), lerp(from.sg, sc.g, k), lerp(from.sb, sc.b, k))
      edgeMat.color.setRGB(lerp(from.er, ec.r, k), lerp(from.eg, ec.g, k), lerp(from.eb, ec.b, k))
      for (const key of ['roughness', 'sheen', 'sheenRoughness', 'clearcoat', 'clearcoatRoughness']) hideMat[key] = lerp(from[key], look[key], k)
      room.scale.setScalar(1 + Math.sin(k * Math.PI) * 0.025)
      wake()
      if (k < 1 && !state.disposed) requestAnimationFrame(step)
    }
    step()
    const tex = await loadShadow(id)
    if (state.disposed || !tex) return
    shadowFront = 1 - shadowFront
    shadowPlanes[shadowFront].material.map = tex
    shadowPlanes[shadowFront].material.needsUpdate = true
    wake()
  }
  setHide(hide)

  const api = {
    setHide,
    setProgress(p) { state.p = Math.min(1, Math.max(0, p)); wake() },
    setMotion(m) { state.motion = m; wake() },
    onLost: null,
    dispose() {
      state.disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('webglcontextlost', onLost)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      owned.geo.forEach(g => g.dispose())
      owned.mat.forEach(m => m.dispose())
      owned.tex.forEach(t => t.dispose())
      env.texture.dispose()
      renderer.dispose()
    },
  }
  return api
}
