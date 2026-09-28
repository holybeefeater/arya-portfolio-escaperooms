import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createRoom } from '../lib/room'
import { url } from '../lib/asset'
import { finePointer } from '../lib/motion'
import { useScroll } from '../lib/scroll'
import { guide, guideFor } from '../lib/guide'
import { Sign } from './parts'
import { person, collection, hides } from '../content'

gsap.registerPlugin(ScrollTrigger)

const NAME = person.name.toUpperCase()

export default function Hero({ onRoomReady }) {
  const { ready, calm, smoother } = useScroll()
  const section = useRef(null)
  const canvas = useRef(null)
  const nameRef = useRef(null)
  const api = useRef(null)
  const [hide, setHide] = useState(hides[0].id)
  const [failed, setFailed] = useState(false)
  const current = hides.find(h => h.id === hide)

  // the 3D room
  useEffect(() => {
    let room = null
    try {
      room = createRoom(canvas.current, {
        hide: hides[0].id,
        shadows: Object.fromEntries(hides.map(h => [h.id, url(h.shadow)])),
        motion: !calm,
        onReady: onRoomReady,
      })
      room.onLost = () => setFailed(true)
      api.current = room
    } catch (err) {
      console.warn('[room] WebGL unavailable, showing a photograph instead.', err)
      setFailed(true)
      onRoomReady?.()
    }
    return () => { room?.dispose(); api.current = null }
  }, [])
  useEffect(() => { api.current?.setHide(hide) }, [hide])
  useEffect(() => { api.current?.setMotion(!calm) }, [calm])

  // keep the name inside the screen whatever font arrives (Archivo, or a wider fallback)
  useEffect(() => {
    const el = nameRef.current
    const fit = () => {
      el.style.fontSize = ''
      const room = window.innerWidth * 0.94
      if (el.scrollWidth > room) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room) / el.scrollWidth}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // the name's letters widen as the pointer passes: walls easing open
  useEffect(() => {
    if (calm || !finePointer()) return
    const letters = [...nameRef.current.querySelectorAll('.ch')]
    let boxes = []
    const measure = () => { boxes = letters.map(l => { const r = l.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] }) }
    measure()
    const onMove = e => {
      if (window.scrollY > 40) return
      letters.forEach((l, i) => {
        const [cx, cy] = boxes[i]
        const d = Math.hypot(e.clientX - cx, (e.clientY - cy) * 1.4)
        l.style.setProperty('--w', (62 + 30 * Math.exp(-(d * d) / (2 * 150 * 150))).toFixed(1))
      })
    }
    const ro = new ResizeObserver(measure)
    ro.observe(nameRef.current)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    return () => { ro.disconnect(); window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', measure) }
  }, [calm])

  // scroll: the door turns to face you, the straps slip off, and you walk in
  useLayoutEffect(() => {
    if (!ready || calm) return
    const hold = guideFor('hero', {
      smoother,
      showAtStart: true,
      skipText: 'Skip to the brief',
      next: '#brief',
      label: p => p < 0.02 ? ['Scroll down', 'The door opens as you scroll']
        : ['Keep scrolling', p < 0.34 ? 'Turning the room to face you' : p < 0.55 ? 'Unbuckling the straps' : 'Walking through the door'],
    })
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      tl.to('.hero-fade', { autoAlpha: 0, y: -28, duration: 0.22, ease: 'none' }, 0)
        .to('.hero-name .ch', { '--w': 125, autoAlpha: 0, duration: 0.45, stagger: { each: 0.015, from: 'center' }, ease: 'power1.in' }, 0.04)
        .to({}, { duration: 1 - 0.49 })
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: '+=110%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        ...hold,
        onUpdate: self => { api.current?.setProgress(self.progress); tl.progress(self.progress); hold.onUpdate(self) },
      })
    }, section)
    return () => { ctx.revert(); guide.hide('hero') }
  }, [ready, calm, smoother])

  return (
    <section ref={section} id="top" className="hero" data-tone="#13241E" data-ink="light" data-sign={collection.signs.hero}>
      <div className="hero-glow" aria-hidden="true" />
      <h1 ref={nameRef} className="hero-name display" aria-label={person.name}>
        {NAME.split('').map((c, i) => (
          <span key={i} className={c === ' ' ? 'sp' : 'ch'} aria-hidden="true">{c === ' ' ? '\u00a0' : c}</span>
        ))}
      </h1>
      <canvas ref={canvas} className="room-canvas" data-cursor="drag" aria-hidden="true" />
      {failed && <img className="room-fallback" src={url('assets/products/duffle.webp')} alt="Olive suede duffle bag from Escape Rooms" />}

      <div className="hero-fade hero-lede">
        <p><strong>{collection.title}</strong>, a collection in leather.</p>
        <p>A jacket, four bags and a pair of boots by {person.name.split(' ')[0]}, {person.degree.split(',')[0].replace('B.Des. ', 'B.Des. student in ')} at {person.school}.</p>
      </div>

      <div className="hero-fade hide-picker">
        <p className="picker-title" id="hide-label">Change the hide</p>
        <div role="group" aria-labelledby="hide-label" className="picker-row">
          {hides.map(h => (
            <button key={h.id} type="button" className="hide-btn" aria-pressed={hide === h.id} onClick={() => setHide(h.id)}>
              <span className="hide-chip" style={{ '--c': h.swatch }} aria-hidden="true" />
              <span className="hide-name">{h.label}</span>
            </button>
          ))}
        </div>
        <p className="picker-note" aria-live="polite">
          {current.label}, from the {current.from}. Each hide casts the shadow of what it became.
        </p>
      </div>

      <div className="hero-fade hero-foot">
        <Sign>{collection.signs.hero}</Sign>
        {calm && <p className="scroll-cue">Scroll down to see the collection</p>}
      </div>
    </section>
  )
}
