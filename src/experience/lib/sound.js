// Optional sound, off until the visitor turns it on. Everything is synthesised with
// Web Audio, so there are no files to load: a fluorescent hum, a buckle click,
// a zip pull and a small brass chime for a key.

const KEY = 'escape-rooms:sound'
let ctx = null
let master = null
let on = false
const listeners = new Set()

try { on = localStorage.getItem(KEY) === 'on' } catch {}

function audio() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)
  return ctx
}

function noise(seconds) {
  const c = audio()
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  return src
}

function env(gain, t, attack, hold, release, peak) {
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + attack)
  gain.gain.setValueAtTime(peak, t + attack + hold)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release)
}

const voices = {
  // mains hum with a flicker of ballast buzz
  hum() {
    const c = ctx, t = c.currentTime, g = c.createGain()
    env(g, t, 0.08, 1.1, 0.6, 0.12)
    ;[100, 200, 300].forEach((f, i) => {
      const o = c.createOscillator(), og = c.createGain()
      o.type = i ? 'sine' : 'sawtooth'
      o.frequency.value = f
      og.gain.value = [0.35, 0.25, 0.1][i]
      o.connect(og).connect(g)
      o.start(t); o.stop(t + 1.9)
    })
    const lfo = c.createOscillator(), lg = c.createGain()
    lfo.frequency.value = 7; lg.gain.value = 0.04
    lfo.connect(lg).connect(g.gain); lfo.start(t); lfo.stop(t + 1.9)
    g.connect(master)
  },
  // a buckle tongue dropping into its hole: two short metallic ticks
  click() {
    const c = ctx, t = c.currentTime
    ;[0, 0.055].forEach((d, i) => {
      const n = noise(0.05), f = c.createBiquadFilter(), g = c.createGain()
      f.type = 'bandpass'; f.frequency.value = i ? 3200 : 2200; f.Q.value = 6
      env(g, t + d, 0.002, 0.004, 0.04, i ? 0.5 : 0.8)
      n.connect(f).connect(g).connect(master)
      n.start(t + d); n.stop(t + d + 0.06)
    })
  },
  // a zip: a rising band of noise, chopped by the teeth
  zip() {
    const c = ctx, t = c.currentTime, n = noise(0.42), f = c.createBiquadFilter(), g = c.createGain()
    const teeth = c.createOscillator(), tg = c.createGain()
    f.type = 'bandpass'; f.Q.value = 2
    f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(4200, t + 0.36)
    env(g, t, 0.02, 0.28, 0.1, 0.22)
    teeth.type = 'square'; teeth.frequency.setValueAtTime(60, t); teeth.frequency.linearRampToValueAtTime(110, t + 0.36)
    tg.gain.value = 0.18
    teeth.connect(tg).connect(g.gain)
    n.connect(f).connect(g).connect(master)
    n.start(t); n.stop(t + 0.42); teeth.start(t); teeth.stop(t + 0.42)
  },
  // a key on a brass ring
  key() {
    const c = ctx, t = c.currentTime
    ;[1568, 2349, 3136].forEach((fr, i) => {
      const o = c.createOscillator(), g = c.createGain()
      o.type = 'sine'; o.frequency.value = fr
      env(g, t + i * 0.07, 0.003, 0.02, 0.7, 0.16 / (i + 1))
      o.connect(g).connect(master)
      o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.8)
    })
  },
}

export const sound = {
  isOn: () => on,
  subscribe(fn) { listeners.add(fn); fn(on); return () => { listeners.delete(fn) } },
  // Call from a click so the browser allows audio to start.
  toggle() {
    on = !on
    try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch {}
    if (on && audio()) { ctx.resume?.(); voices.hum() }
    listeners.forEach(fn => fn(on))
  },
  play(name) {
    if (!on || !voices[name]) return
    try {
      if (!audio()) return
      if (ctx.state === 'suspended') ctx.resume?.()
      voices[name]()
    } catch (err) { console.warn('[sound]', err) }
  },
}
