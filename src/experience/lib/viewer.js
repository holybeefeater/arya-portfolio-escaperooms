import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { reliefCanvas } from './depth'
import { fitTransform, frameDistance } from './fit'

// ─────────────────────────────────────────────────────────────────────────────
//  A small product studio. Shows Aditi's own 3D files (.glb from CLO 3D, Rhino
//  or a phone scan) when they exist; until then, a "photo relief" built from
//  the product photograph: the outline gives it depth, and it rocks gently so
//  it never shows its thin edge. Drag to turn either one.
// ─────────────────────────────────────────────────────────────────────────────

const FIT = 1.6
const FOV = 30
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'

const lerp = (a, b, t) => a + (b - a) * t

// Relief -> displacement. Mixes the narrow and wide blurs so the outline sits at
// about 0.5 (becomes zero with the bias below) and the middle bulges.
function displacementCanvas(img) {
  const c = reliefCanvas(img, 320)
  const ctx = c.getContext('2d', { willReadFrequently: true })
  const d = ctx.getImageData(0, 0, c.width, c.height)
  const px = d.data
  for (let i = 0; i < px.length; i += 4) {
    const v = Math.round(px[i + 1] * 0.55 + px[i] * 0.45)
    px[i] = px[i + 1] = px[i + 2] = v
    px[i + 3] = 255
  }
  ctx.putImageData(d, 0, 0)
  return c
}

function mirrored(tex) {
  const t = tex.clone()
  t.repeat.set(-1, 1)
  t.offset.set(1, 0)
  t.needsUpdate = true
  return t
}

function disposeTree(obj) {
  obj.traverse(o => {
    if (!o.isMesh) return
    o.geometry?.dispose()
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    for (const m of mats) {
      if (!m) continue
      for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.()
      m.dispose()
    }
  })
}

export function createViewer(canvas, { onStatus, motion = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new RoomEnvironment()
  const env = pmrem.fromScene(envScene, 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.85
  envScene.dispose?.()
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 60)
  scene.add(new THREE.HemisphereLight(0xf4f6ec, 0x4a5243, 0.55))
  const key = new THREE.DirectionalLight(0xfff4e2, 2.3)
  key.position.set(-2.2, 4.2, 3.2)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.6, bottom: -1, near: 0.5, far: 14 })
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  key.shadow.radius = 5
  key.shadow.camera.updateProjectionMatrix()
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xcfe3d8, 0.9)
  rim.position.set(3, 2.2, -3)
  scene.add(rim)
  const floorGeo = new THREE.PlaneGeometry(12, 12)
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.2 })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const turntable = new THREE.Group()
  scene.add(turntable)

  const gltf = new GLTFLoader()
  const draco = new DRACOLoader()
  draco.setDecoderPath(DRACO_PATH)
  gltf.setDRACOLoader(draco)
  gltf.setMeshoptDecoder(MeshoptDecoder)
  const texLoader = new THREE.TextureLoader()
  const photoCache = new Map()

  const s = {
    mode: 'relief', token: 0, current: null, width: FIT, height: FIT,
    rotY: 0, velY: 0, base: 0, phase: 0, drag: false, lastX: 0, lastT: 0,
    auto: true, motion, close: 0, closeT: 0, px: 0, sx: 0, appear: 1,
    visible: true, disposed: false, w: 1, h: 1,
  }

  // ── loading ──────────────────────────────────────────────────────────────
  function loadModel(url, onProgress) {
    return new Promise((resolve, reject) => {
      gltf.load(url, res => {
        const obj = res.scene || res.scenes?.[0]
        if (!obj) return reject(new Error('The file has no scene'))
        obj.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
          }
        })
        obj.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(obj)
        if (box.isEmpty()) return reject(new Error('The model is empty'))
        const f = fitTransform(box.min.toArray(), box.max.toArray(), FIT)
        obj.position.add(new THREE.Vector3(...f.position))
        const holder = new THREE.Group()
        holder.add(obj)
        holder.scale.setScalar(f.scale)
        holder.userData = { width: f.width, height: f.height, gltf: true }
        resolve(holder)
      }, xhr => { if (xhr.total) onProgress(xhr.loaded / xhr.total) }, reject)
    })
  }

  function photo(src) {
    if (photoCache.has(src)) return photoCache.get(src)
    const job = new Promise((resolve, reject) => {
      texLoader.load(src, tex => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
        const disp = new THREE.CanvasTexture(displacementCanvas(tex.image))
        resolve({ tex, disp, texB: mirrored(tex), dispB: mirrored(disp) })
      }, undefined, reject)
    })
    photoCache.set(src, job)
    return job
  }

  async function reliefObject(r) {
    const { tex, disp, texB, dispB } = await photo(r.src)
    const aspect = r.w / r.h
    const H = aspect > 1 ? FIT / aspect : FIT
    const W = aspect > 1 ? FIT : FIT * aspect
    const depth = Math.min(W, H) * 0.13
    const geo = new THREE.PlaneGeometry(W, H, 180, 180)
    const mat = (map, dm, tint) => new THREE.MeshStandardMaterial({
      map, color: tint, alphaTest: 0.5, roughness: 0.62, metalness: 0,
      displacementMap: dm, displacementScale: depth * 2, displacementBias: -depth,
      bumpMap: dm, bumpScale: 2.5,
    })
    const front = new THREE.Mesh(geo, mat(tex, disp, 0xffffff))
    const back = new THREE.Mesh(geo, mat(texB, dispB, 0xb4b4b4))  // the far side is a mirror, so it is dimmed
    back.rotation.y = Math.PI
    for (const m of [front, back]) { m.castShadow = true; m.position.y = H / 2 }
    const g = new THREE.Group()
    g.add(front, back)
    g.userData = { width: W, height: H, own: [geo, front.material, back.material] }
    return g
  }

  function dropCurrent() {
    const c = s.current
    if (!c) return
    turntable.remove(c)
    if (c.userData.gltf) disposeTree(c)
    else c.userData.own?.forEach(x => x.dispose())
    s.current = null
  }

  async function show(item) {
    const token = ++s.token
    onStatus?.({ mode: 'loading', progress: 0 })
    let obj = null
    let mode = 'relief'
    let error = null
    if (item.src) {
      try {
        obj = await loadModel(item.src, p => { if (token === s.token) onStatus?.({ mode: 'loading', progress: p }) })
        mode = 'model'
      } catch (err) {
        error = err
        console.warn('[viewer] could not load', item.src, err)
      }
    }
    if (!obj) {
      try { obj = await reliefObject(item.relief) } catch (err) { onStatus?.({ mode: 'error', error: err }); return }
    }
    if (token !== s.token || s.disposed) {
      if (obj.userData.gltf) disposeTree(obj)
      else obj.userData.own?.forEach(x => x.dispose())
      return
    }
    dropCurrent()
    s.current = obj
    turntable.add(obj)
    s.mode = mode
    s.width = obj.userData.width
    s.height = obj.userData.height
    s.rotY = mode === 'model' ? -0.5 : 0
    s.velY = 0; s.base = s.rotY; s.phase = 0; s.appear = 0
    onStatus?.({ mode, fellBack: !!error })
    wake()
  }

  // ── per frame ────────────────────────────────────────────────────────────
  function frame(dt) {
    if (!s.drag) {
      s.rotY += s.velY * dt
      s.velY *= Math.exp(-dt * 3)
      if (s.auto && s.motion && Math.abs(s.velY) < 0.05) {
        if (s.mode === 'model') s.rotY += dt * 0.4
        else {
          // a photo relief rocks rather than spins, so its thin edge never faces you
          s.phase += dt * 0.55
          s.rotY += (s.base + Math.sin(s.phase) * 0.55 - s.rotY) * Math.min(1, dt * 1.5)
        }
      }
    }
    turntable.rotation.y = s.rotY
    s.appear += (1 - s.appear) * Math.min(1, dt * 5)
    turntable.scale.setScalar(0.94 + 0.06 * s.appear)
    s.close += (s.closeT - s.close) * Math.min(1, dt * 4)
    s.sx += (s.px - s.sx) * Math.min(1, dt * 3)
    const dist = frameDistance(s.width, s.height, FOV, camera.aspect)
    const lookY = lerp(s.height * 0.5, s.height * 0.62, s.close)
    const d = lerp(dist, dist * 0.52, s.close)
    camera.position.set(s.sx * 0.3, lookY + lerp(0.28, 0.08, s.close), d)
    camera.lookAt(0, lookY, 0)
    renderer.render(scene, camera)
  }

  let raf = 0, last = performance.now()
  const loop = now => {
    raf = 0
    if (s.disposed) return
    frame(Math.min(0.05, (now - last) / 1000))
    last = now
    if (s.visible && !document.hidden) raf = requestAnimationFrame(loop)
  }
  function wake() { if (!raf && !s.disposed && s.visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop) } }

  function resize() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1
    s.w = w; s.h = h
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    wake()
  }

  // ── input: drag sideways to turn (vertical swipes still scroll the page) ──
  const onDown = e => {
    s.drag = true; s.lastX = e.clientX; s.lastT = performance.now(); s.velY = 0
    canvas.setPointerCapture?.(e.pointerId)
    canvas.classList.add('is-dragging')
  }
  const onMove = e => {
    const r = canvas.getBoundingClientRect()
    s.px = ((e.clientX - r.left) / r.width) * 2 - 1
    if (!s.drag) return
    const now = performance.now()
    const dx = e.clientX - s.lastX
    s.rotY += dx * 0.01
    s.velY = Math.max(-5, Math.min(5, (dx * 0.01) / Math.max(0.008, (now - s.lastT) / 1000)))
    s.lastX = e.clientX; s.lastT = now
    wake()
  }
  const onUp = () => {
    if (!s.drag) return
    s.drag = false; s.base = s.rotY; s.phase = 0
    canvas.classList.remove('is-dragging')
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = new IntersectionObserver(([en]) => { s.visible = en.isIntersecting; wake() })
  io.observe(canvas)
  const onVis = () => wake()
  document.addEventListener('visibilitychange', onVis)
  resize()

  return {
    show,
    setAuto(v) { s.auto = v; wake() },
    setClose(v) { s.closeT = v ? 1 : 0; wake() },
    setMotion(v) { s.motion = v; wake() },
    nudge(rad) { s.rotY += rad; s.base = s.rotY; s.phase = 0; s.velY = 0; wake() },
    dispose() {
      s.disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      dropCurrent()
      photoCache.forEach(job => job.then(p => { p.tex.dispose(); p.disp.dispose(); p.texB.dispose(); p.dispB.dispose() }).catch(() => {}))
      floorGeo.dispose(); floorMat.dispose()
      env.texture.dispose()
      draco.dispose()
      renderer.dispose()
    },
  }
}
