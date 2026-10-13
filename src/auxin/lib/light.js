import { gsap } from 'gsap'

// ─────────────────────────────────────────────────────────────────────────────
//  The visitor is the light. One point, shared by everything on the Auxin page
//  that grows toward it: the 3D strips, the photographs and drawings (which
//  turn to face it), and the stem down the left edge (which leans to it).
//
//  Sources, in order: the pointer; a finger dragged on a touch screen; the
//  phone's tilt, if the visitor allows it. With none of these the light drifts
//  slowly across the top of the screen, like the sun through water (not under
//  reduced motion, where it stays put).
// ─────────────────────────────────────────────────────────────────────────────

const W = () => window.innerWidth, H = () => window.innerHeight
const s = { x: 0, y: 0, tx: 0, ty: 0, present: false, tilt: false, t: 0 }
const fns = new Set()
const leaners = new Set()
let started = false, calm = false

export const light = {
  get x() { return s.x }, get y() { return s.y },
  get present() { return s.present },
  subscribe(fn) { fns.add(fn); return () => fns.delete(fn) },
  start(opts = {}) {
    if (started || typeof window === 'undefined') return
    started = true
    calm = !!opts.calm
    s.x = s.tx = W() * 0.68
    s.y = s.ty = H() * 0.2
    const move = e => {
      if (e.pointerType === 'touch' && e.type === 'pointermove' && !e.isPrimary) return
      s.tx = e.clientX; s.ty = e.clientY; s.present = true
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', () => { s.present = false })
    gsap.ticker.add(tick)
  },
  setCalm(v) { calm = v },
  // iOS asks for permission, and only from a tap
  async enableTilt() {
    try {
      const D = window.DeviceOrientationEvent
      if (D && typeof D.requestPermission === 'function' && (await D.requestPermission()) !== 'granted') return false
      window.addEventListener('deviceorientation', e => {
        if (e.gamma == null) return
        s.tilt = true; s.present = true
        s.tx = W() * (0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.48)
        s.ty = H() * (0.5 + Math.max(-1, Math.min(1, (e.beta - 45) / 35)) * 0.48)
      })
      return true
    } catch (err) { return false }
  },
  // elements that turn to face the light (see Lean in components/media.jsx)
  addLeaner(el, opts) {
    const item = { el, body: el.firstElementChild, max: opts?.max ?? 9, near: false }
    const io = new IntersectionObserver(([e]) => { item.near = e.isIntersecting })
    io.observe(el)
    item.io = io
    leaners.add(item)
    return () => { io.disconnect(); leaners.delete(item) }
  },
}

function tick(time, deltaMs) {
  const dt = Math.min(0.05, deltaMs / 1000)
  s.t += dt
  if (!s.present && !calm) {
    s.tx = W() * (0.5 + 0.34 * Math.sin(s.t * 0.11))
    s.ty = H() * (0.16 + 0.08 * Math.sin(s.t * 0.19))
  }
  const k = calm ? 1 : 1 - Math.exp(-dt * (s.present ? 9 : 2.2))
  s.x += (s.tx - s.x) * k
  s.y += (s.ty - s.y) * k
  fns.forEach(fn => fn(s))
  const vw = W(), vh = H()
  for (const it of leaners) {
    if (!it.near || !it.body) continue
    const r = it.el.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const dx = Math.max(-1, Math.min(1, (s.x - cx) / (vw * 0.6)))
    const dy = Math.max(-1, Math.min(1, (s.y - cy) / (vh * 0.6)))
    // turn the face toward the light, as a leaf does; the shadow falls away from it
    it.body.style.transform = `perspective(1400px) rotateX(${(-dy * it.max).toFixed(2)}deg) rotateY(${(dx * it.max).toFixed(2)}deg)`
    it.el.style.setProperty('--lx', `${(((s.x - r.left) / r.width) * 100).toFixed(1)}%`)
    it.el.style.setProperty('--ly', `${(((s.y - r.top) / r.height) * 100).toFixed(1)}%`)
    it.el.style.setProperty('--sx', `${(-dx * 18).toFixed(1)}px`)
    it.el.style.setProperty('--sy', `${(-dy * 18 + 10).toFixed(1)}px`)
  }
}
