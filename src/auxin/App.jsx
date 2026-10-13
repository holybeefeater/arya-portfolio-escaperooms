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
      gsap.utils.toArray('[data-tone]').forEach(sec => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 50%', end: 'bottom 50%',
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
