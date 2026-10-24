import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createGarden } from '../lib/garden'
import { light } from '../lib/light'
import { url } from '../lib/asset'
import { Pic, useCalm } from './media'
import { person } from '../../content'
import { collection, swatches, leaves } from '../content'

gsap.registerPlugin(ScrollTrigger)

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches

export default function Hero() {
  const calm = useCalm()
  const section = useRef(null), canvas = useRef(null), api = useRef(null)
  const [failed, setFailed] = useState(false)
  const [focus, setFocus] = useState(null)
  const [tilt, setTilt] = useState('none') // none | offer | on
  const small = typeof window !== 'undefined' && (window.innerWidth < 760 || !fine())

  useEffect(() => {
    let g = null
    try {
      g = createGarden(canvas.current, {
        texBase: url('assets/auxin/tex/'), small, motion: !calm,
        onLost: () => setFailed(true),
      })
      api.current = g
    } catch (err) {
      console.warn('[auxin] WebGL unavailable, showing a photograph instead.', err)
      setFailed(true)
    }
    // the shared light, mapped into the canvas
    const off = light.subscribe(s => {
      const r = canvas.current?.getBoundingClientRect()
      if (r && r.bottom > 0) api.current?.setLight(s.x - r.left, s.y - r.top)
    })
    if (!fine() && 'DeviceOrientationEvent' in window) setTilt('offer')
    return () => { off(); g?.dispose(); api.current = null }
  }, [calm])
  useEffect(() => { api.current?.focus(focus) }, [focus])

  // scroll: the camera climbs the stems toward the light, and the strips lengthen
  useLayoutEffect(() => {
    if (calm) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 760px)', () => {
      const tl = gsap.timeline({ paused: true })
      tl.to('.hx-title', { yPercent: -38, opacity: 0.12, duration: 1, ease: 'none' }, 0)
        .to('.hx-fade', { y: -40, autoAlpha: 0, duration: 0.45, ease: 'none' }, 0)
      ScrollTrigger.create({
        trigger: section.current, start: 'top top', end: '+=110%', pin: true, scrub: true, anticipatePin: 1,
        onUpdate: self => { api.current?.setProgress(self.progress); tl.progress(self.progress) },
      })
    })
    mm.add('(max-width: 759px)', () => {
      ScrollTrigger.create({
        trigger: section.current, start: 'top top', end: 'bottom top', scrub: true,
        onUpdate: self => api.current?.setProgress(self.progress * 0.6),
      })
    })
    return () => mm.revert()
  }, [calm])

  return (
    <section ref={section} id="top" className="hx" data-tone="#D6DECE" data-ink="dark"
      onClick={e => { if (!e.target.closest('a, button')) api.current?.pulse() }}>
      <p className="hx-kicker hx-fade">
        <span>Collection 02</span><span>{collection.season}</span><span>{collection.kind}</span>
      </p>
      <h1 className="hx-title" aria-label={`${collection.title}, a collection by ${person.name}`}>{collection.title}</h1>
      <canvas ref={canvas} className="hx-canvas" aria-hidden="true" />
      {failed && <Pic name="jacket-neckline" alt="Close-up of the Auxin jacket: the crossover neckline and the grain of the leather" className="hx-fallback" eager />}

      <div className="hx-intro hx-fade">
        <p className="hx-lede">
          I’m {person.name.split(' ')[0]}, a {person.degree.split(',')[0]} student at {person.school}.
          {' '}Auxin is a jacket and trousers, calf boots and cowboy boots, built on the way a plant bends toward light.
        </p>
        <p className="hx-how">
          {calm ? 'The strips are cut from the materials of the collection.'
            : fine() ? 'You are the light. Move it, and the strips turn toward you; click and they reach.'
              : 'You are the light. Drag across the strips and they turn toward your finger.'}
          {tilt === 'offer' && !calm && (
            <button type="button" className="hx-tilt" onClick={async () => setTilt((await light.enableTilt()) ? 'on' : 'none')}>Use the phone’s tilt</button>
          )}
        </p>
        <p className="hx-jump">
          <a href="#seed" className="ax-btn">Start at the seed <span aria-hidden="true">↓</span></a>
          {leaves.map(l => <a key={l.id} href={`#${l.id}`} className="ax-link">{l.short}</a>)}
        </p>
      </div>

      <div className="hx-legend hx-fade" role="group" aria-label="Materials in the strips">
        <p className="hx-legend-k">Cut from the shoot photographs</p>
        {swatches.map(s => (
          <button key={s.id} type="button" className="hx-swatch" aria-pressed={focus === s.id}
            onClick={() => setFocus(f => (f === s.id ? null : s.id))}
            onMouseEnter={() => fine() && setFocus(s.id)} onMouseLeave={() => fine() && setFocus(null)}>
            <span className="hx-chip" style={{ backgroundImage: `url(${url(s.tex)})` }} aria-hidden="true" />
            <span className="hx-swatch-name">{s.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
