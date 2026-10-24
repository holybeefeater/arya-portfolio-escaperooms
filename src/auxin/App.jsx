import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/motion'
import { reveal } from '../shared/swap'
import { light } from './lib/light'
import { Calm, LightboxProvider } from './components/media'
import { Header, StemMeter } from './components/chrome'
import Hero from './components/Hero'
import Seed from './components/Seed'
import Roots from './components/Roots'
import StemChapter from './components/StemChapter'
import Leaves from './components/Leaves'
import Bloom from './components/Bloom'
import { About, Contact } from './components/Closing'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const calm = useReducedMotion()

  useEffect(() => { light.start({ calm }); light.setCalm(calm) }, [calm])
  useEffect(() => { reveal('auxin') }, [])
  // the light itself, a soft glow under the pointer (mouse and pen only)
  useEffect(() => {
    if (calm || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = document.querySelector('.ax-glow')
    document.documentElement.classList.add('has-light')
    const off = light.subscribe(s => { el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)` })
    return () => { off(); document.documentElement.classList.remove('has-light') }
  }, [calm])

  // each chapter brings its own ground colour; the header's ink follows it
  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })
    const ground = document.getElementById('ground')
    const ctx = gsap.context(() => {
      const tones = gsap.utils.toArray('[data-tone]')
      tones.forEach((sec, i) => {
        ScrollTrigger.create({
          // data-tone-at: where its ground takes over, when that must be earlier than half way
          // (dark ink arriving over a dark ground would be unreadable until then); the part
          // before it hands over at the same line, so scrolling back up reads the same way
          trigger: sec, start: `top ${sec.dataset.toneAt || '50%'}`, end: `bottom ${tones[i + 1]?.dataset.toneAt || '50%'}`,
          onToggle: self => {
            if (!self.isActive) return
            gsap.to(ground, { backgroundColor: sec.dataset.tone, duration: calm ? 0 : 0.9, ease: 'power1.out', overwrite: true })
            document.documentElement.dataset.ink = sec.dataset.ink
          },
        })
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    // jump to a chapter named in the address once the pins have been measured
    if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 400)
    return () => { ctx.revert(); window.removeEventListener('load', refresh) }
  }, [calm])

  return (
    <Calm.Provider value={calm}>
      <LightboxProvider>
        <div id="ground" aria-hidden="true" />
        <div className="ax-glow" aria-hidden="true" />
        {/* the collection's palette as a tritone (Surf the Web, Teal, Green Eyes), for photographs the light develops */}
        <svg className="ax-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id="ax-tritone" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.125 0.204 0.49" />
              <feFuncG type="table" tableValues="0.235 0.396 0.584" />
              <feFuncB type="table" tableValues="0.498 0.498 0.427" />
            </feComponentTransfer>
          </filter>
          {/* tailor's chalk: a rough edge, and grain where the chalk skips */}
          <filter id="ax-chalk" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.75" result="grain" />
            <feComposite in="rough" in2="grain" operator="in" />
          </filter>
        </svg>
        <a className="skip" href="#seed">Skip to the collection</a>
        <Header />
        <StemMeter />
        <main>
          <Hero />
          <Seed />
          <Roots />
          <StemChapter />
          <Leaves />
          <Bloom />
          <About />
        </main>
        <Contact />
      </LightboxProvider>
    </Calm.Provider>
  )
}
