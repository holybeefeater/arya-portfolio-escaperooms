import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { reducedMotion, finePointer } from '../lib/motion'

// The hero object: one leather swatch, as it would hang on a swatch ring in a studio.
// Its surface is Aditi's own oil pull-up leather, photographed on the Auxin jacket:
// the grain is that photograph with the large shadows lifted out, and the relief is
// computed from the same grain (see README, "The hero swatch"). Pinked edges, a punched
// hole with a brass eyelet and ring, and a row of saddle stitches along one side.
const W = 1.5, H = 2.0

function maskTexture() {
  // pinking-shear outline and the punched hole, drawn once as an alpha mask
  const c = document.createElement('canvas'); c.width = 600; c.height = 800
  const x = c.getContext('2d')
  x.fillStyle = '#000'; x.fillRect(0, 0, 600, 800)
  x.fillStyle = '#fff'; x.beginPath()
  const z = 14, pad = 10
  const edge = (x0, y0, x1, y1, n) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n, px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t
      const nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny), o = i % 2 ? z * 0.6 : 0
      x.lineTo(px + (nx / l) * o, py + (ny / l) * o)
    }
  }
  x.moveTo(pad, pad)
  edge(pad, pad, 600 - pad, pad, 40); edge(600 - pad, pad, 600 - pad, 800 - pad, 54)
  edge(600 - pad, 800 - pad, pad, 800 - pad, 40); edge(pad, 800 - pad, pad, pad, 54)
  x.closePath(); x.fill()
  x.fillStyle = '#000'; x.beginPath(); x.arc(92, 92, 26, 0, Math.PI * 2); x.fill()
  const t = new THREE.CanvasTexture(c)
  return t
}

// The swatch bends a little, as leather does. Same formula on the GPU and here.
const bendZ = (x, y, b, tw) => b * x * x + tw * x * y

function createSwatch(canvas, { motion }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0, 0)
  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.5
  pmrem.dispose()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0, 6.2)

  const loader = new THREE.TextureLoader()
  const albedo = loader.load('/hero/oilpullup-albedo.jpg'); albedo.colorSpace = THREE.SRGBColorSpace
  const normal = loader.load('/hero/oilpullup-normal.png')
  albedo.anisotropy = normal.anisotropy = renderer.capabilities.getMaxAnisotropy()
  const alpha = maskTexture()
  const uniforms = { uBend: { value: 0 }, uTwist: { value: 0 } }
  const bendShader = shader => {
    shader.uniforms.uBend = uniforms.uBend; shader.uniforms.uTwist = uniforms.uTwist
    shader.vertexShader = 'uniform float uBend; uniform float uTwist;\n' + shader.vertexShader
      .replace('#include <beginnormal_vertex>', `
        float dzdx = 2.0 * uBend * position.x + uTwist * position.y;
        float dzdy = uTwist * position.x;
        vec3 objectNormal = normalize(vec3(-dzdx, -dzdy, 1.0)) * sign(normal.z);
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif`)
      .replace('#include <begin_vertex>', `vec3 transformed = vec3(position); transformed.z += uBend * position.x * position.x + uTwist * position.x * position.y;`)
  }
  const plane = new THREE.PlaneGeometry(W, H, 60, 80)
  const grain = new THREE.MeshPhysicalMaterial({
    map: albedo, normalMap: normal, normalScale: new THREE.Vector2(0.45, 0.45), alphaMap: alpha, alphaTest: 0.5,
    roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color('#6d7fa8'), sheenRoughness: 0.5,
  })
  grain.onBeforeCompile = bendShader
  // the flesh side: unfinished, fibrous, lighter
  const flesh = new THREE.MeshStandardMaterial({ color: '#8e7c66', roughness: 1, alphaMap: alpha, alphaTest: 0.5, side: THREE.BackSide })
  flesh.onBeforeCompile = bendShader
  // the cut edge, burnished dark, shown as a slightly larger layer just behind
  const edge = new THREE.MeshStandardMaterial({ color: '#141a26', roughness: 0.55, alphaMap: alpha, alphaTest: 0.5 })
  edge.onBeforeCompile = bendShader

  const group = new THREE.Group()
  scene.add(group)
  const front = new THREE.Mesh(plane, grain)
  const back = new THREE.Mesh(plane, flesh); back.position.z = -0.018
  const rim = new THREE.Mesh(plane, edge); rim.position.z = -0.009; rim.scale.set(1.006, 1.005, 1)
  group.add(rim, front, back)

  // brass: eyelet in the punched hole, and the swatch ring through it
  const brass = new THREE.MeshStandardMaterial({ color: '#b8964f', metalness: 1, roughness: 0.26 })
  const hx = -W / 2 + (92 / 600) * W, hy = H / 2 - (92 / 800) * H
  const eyelet = new THREE.Group()
  const ey1 = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 16, 40), brass)
  const ey2 = ey1.clone(); ey2.position.z = -0.02
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.03, 32, 1, true), brass); barrel.rotation.x = Math.PI / 2; barrel.position.z = -0.01
  eyelet.add(ey1, ey2, barrel)
  group.add(eyelet)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.022, 20, 90), brass)
  group.add(ring)

  // saddle stitches down the right-hand side, waxed thread
  const STITCH = 26
  const thread = new THREE.MeshStandardMaterial({ color: '#e7dab6', roughness: 0.7 })
  const stitches = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.009, 0.042, 4, 8), thread, STITCH)
  group.add(stitches)
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s1 = new THREE.Vector3(1, 1, 1), nrm = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0)

  // light
  scene.add(new THREE.HemisphereLight('#fffaf0', '#2b2a28', 0.55))
  const key = new THREE.DirectionalLight('#fff4e2', 1.6); key.position.set(-2.5, 3, 4); scene.add(key)
  const lamp = new THREE.PointLight('#ffd6a0', 7, 7, 1.6); lamp.position.set(1, 0.5, 2.4); scene.add(lamp)

  const st = { t: 0, rotY: -0.45, vel: 0, drag: false, lastX: 0, px: 0, py: 0, sx: 0, sy: 0, w: 1, h: 1, visible: true, dead: false }

  function place() {
    const b = uniforms.uBend.value, tw = uniforms.uTwist.value
    const z = bendZ(hx, hy, b, tw)
    const dzdx = 2 * b * hx + tw * hy, dzdy = tw * hx
    nrm.set(-dzdx, -dzdy, 1).normalize()
    eyelet.position.set(hx, hy, z + 0.006)
    eyelet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm)
    // the ring hangs through the hole, its plane across the swatch
    ring.position.set(hx - 0.27, hy + 0.2, z)
    ring.rotation.set(0, Math.PI / 2 + 0.25, 0.75)
    const xS = W / 2 - 0.13
    for (let i = 0; i < STITCH; i++) {
      const y = -H / 2 + 0.16 + (i / (STITCH - 1)) * (H - 0.32)
      const zz = bendZ(xS, y, b, tw)
      p.set(xS, y, zz + 0.006)
      q.setFromUnitVectors(up, new THREE.Vector3(0.18, 1, 0).normalize())
      stitches.setMatrixAt(i, m4.compose(p, q, s1))
    }
    stitches.instanceMatrix.needsUpdate = true
  }

  function resize() {
    const r = canvas.getBoundingClientRect()
    st.w = r.width || 1; st.h = r.height || 1
    renderer.setSize(st.w, st.h, false)
    camera.aspect = st.w / st.h
    camera.position.z = camera.aspect < 0.75 ? 7.4 : 6.2
    camera.updateProjectionMatrix()
  }

  let raf = 0, last = performance.now()
  const frame = now => {
    raf = 0
    if (st.dead) return
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now
    st.t += dt
    const live = motion && !reducedMotion()
    if (!st.drag && live) { st.vel *= 0.96; st.rotY += st.vel * dt + Math.sin(st.t * 0.35) * 0.0025 }
    st.sx += (st.px - st.sx) * Math.min(1, dt * 3); st.sy += (st.py - st.sy) * Math.min(1, dt * 3)
    uniforms.uBend.value = live ? -0.1 + Math.sin(st.t * 0.6) * 0.05 : -0.1
    uniforms.uTwist.value = live ? Math.sin(st.t * 0.43 + 1) * 0.06 : 0.03
    group.rotation.y = st.rotY + st.sx * 0.25
    group.rotation.x = -0.1 + st.sy * 0.15 + (live ? Math.sin(st.t * 0.5) * 0.04 : 0)
    group.rotation.z = 0.12
    group.position.y = live ? Math.sin(st.t * 0.8) * 0.04 : 0
    // the lamp rakes across the grain with the pointer (or drifts on touch screens)
    lamp.position.set(finePointer() ? st.sx * 3 : Math.sin(st.t * 0.5) * 2.2, finePointer() ? -st.sy * 2.4 : 0.6, 2.2)
    place()
    renderer.render(scene, camera)
    if (st.visible && !document.hidden && live) raf = requestAnimationFrame(frame)
  }
  const wake = () => { if (!raf && !st.dead) { last = performance.now(); raf = requestAnimationFrame(frame) } }

  const onDown = e => { st.drag = true; st.lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId) }
  const onMove = e => {
    const r = canvas.getBoundingClientRect()
    st.px = ((e.clientX - r.left) / r.width) * 2 - 1; st.py = ((e.clientY - r.top) / r.height) * 2 - 1
    if (st.drag) { const dx = e.clientX - st.lastX; st.rotY += dx * 0.008; st.vel = dx * 0.4; st.lastX = e.clientX }
    wake()
  }
  const onUp = () => { st.drag = false }
  canvas.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)
  const ro = new ResizeObserver(() => { resize(); wake() }); ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => { if (e.boundingClientRect.width) { st.visible = e.isIntersecting; wake() } }); io.observe(canvas)
  document.addEventListener('visibilitychange', wake)
  albedo.onUpdate = normal.onUpdate = wake
  THREE.DefaultLoadingManager.onLoad = wake
  resize(); wake()

  return {
    nudge(d) { st.rotY += d; wake() },
    dispose() {
      st.dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
      document.removeEventListener('visibilitychange', wake)
      scene.traverse(o => { o.geometry?.dispose?.(); [].concat(o.material || []).forEach(m => m.dispose()) })
      ;[albedo, normal, alpha, env.texture].forEach(t => t.dispose()); renderer.dispose()
    },
  }
}

export default function SwatchHero() {
  const canvas = useRef(null)
  const api = useRef(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    try { api.current = createSwatch(canvas.current, { motion: true }) }
    catch (err) { console.warn('[swatch] WebGL unavailable; showing the photograph.', err); setFailed(true) }
    return () => api.current?.dispose()
  }, [])

  return (
    <div className="sw">
      <p className="sw-hint mono" aria-hidden="true">{failed ? 'Swatch' : 'Drag to turn'}</p>
      {failed
        ? <img className="sw-flat" src="/hero/oilpullup-albedo.jpg" alt="Blue oil pull-up cow leather, close-up of its grain" />
        : <canvas ref={canvas} className="sw-canvas" role="img" aria-label="A swatch of blue oil pull-up cow leather with pinked edges, a brass eyelet and ring, and saddle stitching, turning slowly." onKeyDown={e => { if (e.key === 'ArrowLeft') api.current?.nudge(-0.3); if (e.key === 'ArrowRight') api.current?.nudge(0.3) }} tabIndex={0} />}
      <div className="sw-tag">
        <p className="sw-tag-k mono"><span>Swatch 01</span><span>Material in use</span></p>
        <p className="sw-tag-name">Oil pull-up cow leather</p>
        <p className="sw-tag-from">Aqua oil pull-up with a distressed vintage effect, on the jacket in <Link to="/work/auxin" state={{ background: { pathname: '/', search: '' } }}>Auxin</Link>.</p>
        <p className="sw-note">Surface photographed from the finished jacket.</p>
      </div>
    </div>
  )
}
