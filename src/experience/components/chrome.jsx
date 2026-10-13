import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { stage } from '../lib/stage'
import { finePointer } from '../lib/motion'
import { useScroll, scrollToTarget } from '../lib/scroll'
import { guide } from '../lib/guide'
import { progress } from '../lib/progress'
import { sound } from '../lib/sound'
import Mark from './Mark'
import { person, collection, models, keys } from '../content'

// ── Intro: a fluorescent tube stutters on, then the shutter splits along its line.
// The flicker stays under three flashes a second and is skipped for reduced motion.
export function Intro({ calm, roomReady, onDone }) {
  const root = useRef(null), tube = useRef(null), top = useRef(null), bottom = useRef(null), text = useRef(null)
  const [pct, setPct] = useState(0)
  const finish = useRef(() => {})
  const roomRef = useRef(roomReady)
  roomRef.current = roomReady

  useEffect(() => stage.onProgress(p => setPct(Math.round(p * 100))), [])

  useEffect(() => {
    let opened = false
    const tl = gsap.timeline()
    if (calm) gsap.set(tube.current, { opacity: 1 })
    else {
      tl.set(tube.current, { opacity: 0.06 })
        .to(tube.current, { opacity: 0.85, duration: 0.05, delay: 0.35 })
        .to(tube.current, { opacity: 0.12, duration: 0.1 })
        .to(tube.current, { opacity: 0.7, duration: 0.05, delay: 0.14 })
        .to(tube.current, { opacity: 0.2, duration: 0.16 })
        .to(tube.current, { opacity: 1, duration: 0.08, delay: 0.2 })
    }
    const open = () => {
      if (opened) return
      opened = true
      tl.kill()
      const out = gsap.timeline({ onComplete: onDone })
      if (calm) out.to(root.current, { opacity: 0, duration: 0.35 })
      else out
        .to(text.current, { opacity: 0, duration: 0.25 })
        .to(tube.current, { scaleX: 2.6, opacity: 1, duration: 0.45, ease: 'power2.in' }, '<')
        .to(top.current, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '-=0.12')
        .to(bottom.current, { yPercent: 100, duration: 1.05, ease: 'expo.inOut' }, '<')
        .to(tube.current, { opacity: 0, duration: 0.35 }, '<0.25')
    }
    finish.current = open
    const wait = ms => new Promise(r => setTimeout(r, ms))
    const assets = new Promise(r => { const off = stage.onProgress(p => { if (p >= 0.999) { off?.(); r() } }) })
    const room = new Promise(r => { const id = setInterval(() => { if (roomRef.current) { clearInterval(id); r() } }, 60) })
    const fonts = document.fonts?.ready || Promise.resolve()
    Promise.all([wait(calm ? 150 : 1500), Promise.race([Promise.all([assets, room, fonts]), wait(4200)])]).then(open)
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={root} className="intro" onClick={() => finish.current()} role="presentation">
      <div ref={top} className="intro-half intro-top" />
      <div ref={bottom} className="intro-half intro-bottom" />
      <div className="intro-center">
        <Mark className="intro-mark" />
        <div ref={tube} className="intro-tube" />
        <p ref={text} className="intro-text" aria-live="polite">
          <span>{collection.signs.hero}</span>
          <span>{pct < 100 ? `warming up ${pct}%` : 'lights on'}</span>
        </p>
      </div>
    </div>
  )
}

// ── Cursor: a torch. Over photographs it becomes the light source.
export function Cursor() {
  const dot = useRef(null), halo = useRef(null), label = useRef(null)
  useEffect(() => {
    if (!finePointer()) return
    const html = document.documentElement
    html.classList.add('has-torch')
    const q = (el, p, d) => gsap.quickTo(el, p, { duration: d, ease: 'power3' })
    const dx = q(dot.current, 'x', 0.12), dy = q(dot.current, 'y', 0.12)
    const hx = q(halo.current, 'x', 0.55), hy = q(halo.current, 'y', 0.55)
    const names = { light: 'light', watch: 'watch', open: 'open', drag: 'drag' }
    const move = e => { dx(e.clientX); dy(e.clientY); hx(e.clientX); hy(e.clientY); html.classList.add('torch-on') }
    const over = e => {
      const t = e.target.closest?.('[data-cursor], a, button, summary, [role="button"]')
      const mode = t?.getAttribute('data-cursor') || (t ? 'link' : '')
      html.dataset.cursor = mode
      if (label.current) label.current.textContent = names[mode] || ''
    }
    const leave = () => html.classList.remove('torch-on')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    html.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      html.removeEventListener('pointerleave', leave)
      html.classList.remove('has-torch', 'torch-on')
    }
  }, [])
  return (
    <div className="torch" aria-hidden="true">
      <div ref={halo} className="torch-halo"><span /></div>
      <div ref={dot} className="torch-dot"><span className="torch-core" /><span ref={label} className="torch-label" /></div>
    </div>
  )
}

export const hasModels = models.showReliefs || models.items.some(i => i.src)
const LINKS = [['Jacket', '#jacket'], ['Bags', '#bags'], ['Boots', '#boots'], ...(hasModels ? [['In 3D', '#in-3d']] : []), ['Other work', '#other'], ['About', '#about'], ['Contact', '#exit']]

function KeyIcon({ found }) {
  return (
    <svg className={`key-icon ${found ? 'is-found' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M11.2 12 H21 M17 12 v3.4 M20 12 v2.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Key ring: one brass key for finishing each room. A reward, never a lock.
export function KeyRing() {
  const [found, setFound] = useState([])
  const [toast, setToast] = useState(null)
  useEffect(() => {
    let timer
    let seen = 0
    return progress.subscribe(s => {
      setFound(s.keys)
      if (s.keys.length > seen) {
        seen = s.keys.length
        const k = keys.find(k => k.id === s.last)
        setToast(k ? `Key ${s.keys.length} of ${keys.length}: ${k.label}` : null)
        sound.play('key')
        clearTimeout(timer)
        timer = setTimeout(() => setToast(null), 2600)
      }
    })
  }, [])
  const label = `${found.length} of ${keys.length} keys found. ${keys.map(k => `${k.label}: ${found.includes(k.id) ? 'found' : k.how.toLowerCase()}`).join('. ')}.`
  return (
    <div className="keyring" role="status" aria-label={label} title={label}>
      <span className="keyring-loop" aria-hidden="true" />
      {keys.map(k => <KeyIcon key={k.id} found={found.includes(k.id)} />)}
      <span className={`keyring-toast ${toast ? 'is-on' : ''}`} aria-live="polite">{toast}</span>
    </div>
  )
}

export function SoundToggle() {
  const [on, setOn] = useState(sound.isOn())
  useEffect(() => sound.subscribe(setOn), [])
  return (
    <button type="button" className="sound-btn" aria-pressed={on} onClick={() => sound.toggle()} title={on ? 'Sound on' : 'Sound off'}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
        {on
          ? <path d="M16 9 q2 3 0 6 M18.5 6.5 q4.5 5.5 0 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          : <path d="M16.5 9.5 l5 5 M21.5 9.5 l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
      </svg>
      <span className="sr-only">Sound</span>
    </button>
  )
}

export function Header({ onHint }) {
  const { smoother } = useScroll()
  const [open, setOpen] = useState(false)
  const btn = useRef(null)
  useEffect(() => {
    if (!open) return
    const k = e => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  const go = (e, href) => { e.preventDefault(); setOpen(false); scrollToTarget(smoother, href) }
  return (
    <header className="site-header">
      <a href="#top" className="wordmark" onClick={e => go(e, '#top')}><Mark className="wordmark-mark" />{person.name}</a>
      <nav id="site-nav" className={open ? 'nav is-open' : 'nav'} aria-label="Sections">
        {LINKS.map(([label, href]) => <a key={href} href={href} onClick={e => go(e, href)}>{label}</a>)}
      </nav>
      <div className="header-tools">
        <button type="button" className="hint-btn" onClick={onHint} aria-haspopup="dialog">Need a hint?</button>
        <KeyRing />
        <SoundToggle />
      </div>
      <button ref={btn} type="button" className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(v => !v)}>
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
  )
}

// ── Wayfinding: floor tape down the left edge. It runs past as you scroll, and
// the sign beside it shows the phrase from Aditi's board for the room you are in.
export function Wayfinding() {
  const tape = useRef(null)
  const { smoother } = useScroll()
  useEffect(() => {
    const tick = () => {
      const y = smoother ? smoother.scrollTop() : window.scrollY
      if (tape.current) tape.current.style.backgroundPositionY = `${(-y * 0.5).toFixed(1)}px`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [smoother])
  return (
    <div className="wayline" aria-hidden="true">
      <div ref={tape} className="wayline-tape" />
      <p id="you-are-here" className="wayline-here"><span className="here-dot" /><span className="here-text">{collection.signs.hero}</span></p>
    </div>
  )
}

// ── Scroll guide: shown only while a section holds the page still.
export function PinGuide() {
  const root = useRef(null), title = useRef(null), detail = useRef(null)
  const fill = useRef(null), track = useRef(null), pct = useRef(null), skipText = useRef(null)
  const skip = useRef(null)
  useEffect(() => guide.subscribe(s => {
    const el = root.current
    if (!el) return
    el.classList.toggle('is-on', !!s.id)
    if (!s.id) return
    skip.current = s.skip
    if (title.current.textContent !== s.title) title.current.textContent = s.title
    if (detail.current.textContent !== s.detail) detail.current.textContent = s.detail
    if (skipText.current.textContent !== s.skipText) skipText.current.textContent = s.skipText
    const v = Math.round(s.progress * 100)
    fill.current.style.transform = `scaleX(${s.progress.toFixed(4)})`
    pct.current.textContent = `${v}%`
    track.current.setAttribute('aria-valuenow', String(v))
  }), [])
  return (
    <div ref={root} className="pin-guide">
      <div className="pg-text">
        <p ref={title} className="pg-title" />
        <p ref={detail} className="pg-detail" aria-live="polite" />
      </div>
      <div ref={track} className="pg-track" role="progressbar" aria-label="Progress through this section" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <span ref={fill} className="pg-fill" />
      </div>
      <span ref={pct} className="pg-pct" aria-hidden="true">0%</span>
      <button type="button" className="pg-skip" onClick={() => skip.current?.()}>
        <span ref={skipText}>Skip</span><span aria-hidden="true">↓</span>
      </button>
    </div>
  )
}
