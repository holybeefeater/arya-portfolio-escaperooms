import * as THREE from 'three'
import { gsap } from 'gsap'
import { plateVertex, plateFragment, filmFragment } from './shaders'
import { reliefCanvas, fitScale } from './depth'
import { reducedMotion, finePointer } from './motion'

// ─────────────────────────────────────────────────────────────────────────────
//  One WebGL canvas, fixed behind the page, draws every product photograph as
//  a relief mesh placed exactly over its DOM element. The cursor is the light.
//
//  Each <Plate> registers its element here. Every frame the stage reads the
//  element's box, so plates follow pinned sections and smooth scrolling.
//  If WebGL is unavailable, nothing is drawn and the plain <img> stays visible.
// ─────────────────────────────────────────────────────────────────────────────

const REST_LIGHT = [0.22, 0.92, 0.6]

class Stage {
  items = new Set()
  textures = new Map()
  pointer = { x: -1e5, y: -1e5 }
  requested = 0
  loaded = 0
  listeners = new Set()
  started = false
  failed = false
  order = 0
  time = 0

  register(el, opts) {
    const item = {
      el, opts, mesh: null, near: false, ready: false, hover: 0, reveal: 0, opacity: 0,
      light: new THREE.Vector3(...REST_LIGHT), focus: null, toggled: false, w: 0, h: 0,
      order: this.order++, phase: Math.random() * 6.28, video: null, playing: false,
    }
    this.items.add(item)
    if (this.started && !this.failed) this.attach(item)
    return item
  }

  unregister(item) {
    if (!item) return
    this.items.delete(item)
    this.io?.unobserve(item.el)
    if (item.mesh) {
      this.scene.remove(item.mesh)
      item.mesh.material.dispose()
    }
    if (item.video) { item.video.pause(); item.video.removeAttribute('src'); item.video.load() }
    item.videoTex?.dispose()
    item.dead = true
  }

  setFocus(item, point) { if (item) item.focus = point }
  toggle(item) { if (item) item.toggled = !item.toggled }

  onProgress(fn) { this.listeners.add(fn); fn(this.progress()); return () => this.listeners.delete(fn) }
  progress() { return this.requested ? this.loaded / this.requested : this.failed ? 1 : 0 }
  emit() { const p = this.progress(); this.listeners.forEach(fn => fn(p)) }

  start() {
    if (this.started || typeof window === 'undefined') return
    this.started = true
    this.fine = finePointer()
    this.calm = reducedMotion()
    try {
      const canvas = document.createElement('canvas')
      canvas.className = 'stage-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      document.body.appendChild(canvas)
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
      if (!renderer.getContext()) throw new Error('no context')
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setClearColor(0x000000, 0)
      this.canvas = canvas
      this.renderer = renderer
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(45, 1, 10, 8000)
      this.camera.position.z = 1000
      this.relief = new THREE.PlaneGeometry(1, 1, 90, 90)
      this.flat = new THREE.PlaneGeometry(1, 1, 1, 1)
      const blank = document.createElement('canvas')
      blank.width = blank.height = 2
      const bctx = blank.getContext('2d'); bctx.fillStyle = '#fff'; bctx.fillRect(0, 0, 2, 2)
      this.blank = new THREE.CanvasTexture(blank)
      this.resize()
      window.addEventListener('resize', this.resize)
      window.addEventListener('pointermove', this.onPointer, { passive: true })
      document.documentElement.addEventListener('pointerleave', this.onLeave)
      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); this.fail() })
      this.io = new IntersectionObserver(this.onIntersect, { rootMargin: '400px 0px 400px 0px' })
      for (const item of this.items) this.attach(item)
      gsap.ticker.add(this.tick)
      document.documentElement.classList.add('has-stage')
    } catch (err) {
      console.warn('[stage] WebGL unavailable, showing plain images.', err)
      this.fail()
    }
  }

  fail() {
    this.failed = true
    gsap.ticker.remove(this.tick)
    document.documentElement.classList.remove('has-stage')
    document.documentElement.classList.add('no-stage')
    for (const item of this.items) item.el.classList.remove('is-live')
    this.canvas?.remove()
    this.loaded = this.requested
    this.emit()
  }

  resize = () => {
    if (!this.renderer) return
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(this.height / 2 / 1000))
    this.camera.updateProjectionMatrix()
  }

  onPointer = e => { this.pointer.x = e.clientX; this.pointer.y = e.clientY; if (e.pointerType === 'mouse') this.fine = true }
  onLeave = () => { this.pointer.x = -1e5; this.pointer.y = -1e5 }
  onIntersect = entries => {
    for (const en of entries) {
      const item = en.target.__plate
      if (item) item.near = en.isIntersecting
    }
  }

  texture(src, withRelief) {
    const key = src + (withRelief ? '#relief' : '')
    if (this.textures.has(key)) return this.textures.get(key)
    this.requested++
    const job = new Promise((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        try {
          const map = new THREE.Texture(img)
          map.premultiplyAlpha = true
          map.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
          map.needsUpdate = true
          const relief = withRelief ? new THREE.CanvasTexture(reliefCanvas(img)) : this.blank
          resolve({ map, relief, w: img.naturalWidth, h: img.naturalHeight })
        } catch (e) { reject(e) }
        this.loaded++; this.emit()
      }
      img.onerror = () => { this.loaded++; this.emit(); reject(new Error('Could not load ' + src)) }
      img.src = src
    })
    job.catch(() => {})
    this.textures.set(key, job)
    return job
  }

  attach(item) {
    item.el.__plate = item
    this.io.observe(item.el)
    const o = item.opts
    const relief = o.kind === 'cutout' || o.kind === 'layer'
    const src = o.kind === 'film' ? o.poster : o.src
    this.texture(src, relief).then(tex => {
      if (item.dead || this.failed) return
      item.tex = tex
      item.mesh = o.kind === 'film' ? this.filmMesh(item, tex) : this.plateMesh(item, tex, relief)
      item.mesh.renderOrder = item.order
      item.mesh.frustumCulled = false
      item.mesh.visible = false
      this.scene.add(item.mesh)
      item.ready = true
      item.w = 0
      item.el.classList.add('is-live')
    }).catch(err => console.warn('[stage]', err.message))
  }

  plateMesh(item, tex, relief) {
    const o = item.opts
    const mat = new THREE.ShaderMaterial({
      vertexShader: plateVertex,
      fragmentShader: plateFragment,
      transparent: true, depthTest: false, depthWrite: false,
      uniforms: {
        uMap: { value: tex.map }, uDepth: { value: tex.relief },
        uScale: { value: new THREE.Vector2(1, 1) },
        uTexel: { value: new THREE.Vector2(1.5 / tex.w, 1.5 / tex.h) },
        uLight: { value: item.light }, uAspect: { value: 1 }, uHover: { value: 0 },
        uCutout: { value: relief ? 1 : 0 }, uOpacity: { value: 0 },
        uLift: { value: o.lift ?? (o.kind === 'layer' ? 18 : 34) },
        uLightColor: { value: new THREE.Vector3(1, 0.97, 0.88) },
        uShadowColor: { value: new THREE.Vector3(...(o.shadow || [0.1, 0.14, 0.12])) },
      },
    })
    return new THREE.Mesh(relief ? this.relief : this.flat, mat)
  }

  filmMesh(item, tex) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: plateVertex,
      fragmentShader: filmFragment,
      transparent: true, depthTest: false, depthWrite: false,
      uniforms: {
        uPoster: { value: tex.map }, uVideo: { value: tex.map }, uDepth: { value: this.blank },
        uScale: { value: new THREE.Vector2(1, 1) }, uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: 1 }, uReveal: { value: 0 }, uOpacity: { value: 0 },
        uHover: { value: 0 }, uCutout: { value: 0 }, uLift: { value: 0 },
        uRim: { value: new THREE.Vector3(0.55, 1, 0.72) },
      },
    })
    return new THREE.Mesh(this.flat, mat)
  }

  ensureVideo(item) {
    if (item.video) return item.video
    const v = document.createElement('video')
    v.src = item.opts.film
    v.muted = true
    v.loop = true
    v.playsInline = true
    v.preload = 'auto'
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    item.video = v
    item.videoTex = new THREE.VideoTexture(v)
    v.addEventListener('playing', () => { if (item.mesh) item.mesh.material.uniforms.uVideo.value = item.videoTex }, { once: true })
    return v
  }

  fit(item) {
    const o = item.opts, t = item.tex, u = item.mesh.material.uniforms
    const mode = o.fit || (o.kind === 'photo' || o.kind === 'film' ? 'cover' : 'contain')
    const pad = o.pad ?? (mode === 'cover' ? 0 : 0.05)
    const [sx, sy] = fitScale(item.w, item.h, t.w, t.h, mode, pad)
    u.uScale.value.set(sx, sy)
    u.uAspect.value = item.w / item.h
    item.pad = pad
  }

  tick = (time, deltaMs) => {
    if (!this.renderer || this.failed) return
    const dt = Math.min(0.05, deltaMs / 1000)
    this.time += dt
    const vw = this.width, vh = this.height, px = this.pointer.x, py = this.pointer.y
    const ease = k => 1 - Math.exp(-dt * k)
    let drawn = false
    for (const item of this.items) {
      const mesh = item.mesh
      if (!mesh) continue
      if (!item.near) { mesh.visible = false; continue }
      const r = item.el.getBoundingClientRect()
      if (r.bottom < -80 || r.top > vh + 80 || r.right < -80 || r.left > vw + 80 || r.width < 2 || r.height < 2) { mesh.visible = false; continue }
      mesh.visible = true
      drawn = true
      if (Math.abs(r.width - item.w) > 0.5 || Math.abs(r.height - item.h) > 0.5) { item.w = r.width; item.h = r.height; this.fit(item) }
      mesh.position.set(r.left + r.width / 2 - vw / 2, vh / 2 - (r.top + r.height / 2), 0)
      mesh.scale.set(r.width, r.height, 1)
      const u = mesh.material.uniforms
      const lx = (px - r.left) / r.width
      const ly = 1 - (py - r.top) / r.height
      const over = lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1 && item.opts.hoverable !== false
      item.opacity += (1 - item.opacity) * ease(5)
      u.uOpacity.value = item.opacity

      if (item.opts.kind === 'film') {
        const want = (over && this.fine) || item.toggled
        if (want) {
          const v = this.ensureVideo(item)
          if (v.paused && !item.playRequested) {
            item.playRequested = true
            v.play().catch(() => { item.playRequested = false })
          }
          if (over) u.uPointer.value.set(lx, ly)
          else if (item.toggled) u.uPointer.value.set(0.5, 0.5)
        }
        item.reveal += ((want ? 1 : 0) - item.reveal) * ease(want ? 1.8 : 3)
        if (!want && item.reveal < 0.01 && item.video && !item.video.paused) { item.video.pause(); item.playRequested = false }
        u.uReveal.value = item.reveal
        const tilt = item.reveal * 0.06
        mesh.rotation.y += (((over ? lx - 0.5 : 0) * tilt) - mesh.rotation.y) * ease(6)
        mesh.rotation.x += (((over ? 0.5 - ly : 0) * tilt) - mesh.rotation.x) * ease(6)
        continue
      }

      // the torch
      let target = 0
      let tx = REST_LIGHT[0], ty = REST_LIGHT[1], tz = REST_LIGHT[2]
      if (item.focus) {
        const p = item.pad || 0
        target = 1
        tx = p + item.focus.x * (1 - 2 * p)
        ty = 1 - (p + item.focus.y * (1 - 2 * p))
        tz = 0.3
      } else if (over && this.fine) {
        target = 1; tx = lx; ty = ly; tz = 0.34
      } else if (!this.fine && !this.calm) {
        // touch screens: the light walks across the object on its own
        target = 0.7
        tx = 0.5 + Math.cos(this.time * 0.5 + item.phase) * 0.38
        ty = 0.55 + Math.sin(this.time * 0.7 + item.phase) * 0.32
        tz = 0.4
      }
      item.hover += (target - item.hover) * ease(target > item.hover ? 5 : 2.5)
      item.light.x += (tx - item.light.x) * ease(9)
      item.light.y += (ty - item.light.y) * ease(9)
      item.light.z += (tz - item.light.z) * ease(6)
      u.uHover.value = item.hover
      const tiltAmt = (item.opts.tilt ?? 0.2) * item.hover
      const rx = -(item.light.y - 0.5) * tiltAmt
      const ry = (item.light.x - 0.5) * tiltAmt
      mesh.rotation.x += (rx - mesh.rotation.x) * ease(6)
      mesh.rotation.y += (ry - mesh.rotation.y) * ease(6)
    }
    if (drawn || this.wasDrawn) this.renderer.render(this.scene, this.camera)
    this.wasDrawn = drawn
  }
}

export const stage = new Stage()
