import { useEffect, useLayoutEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stage } from './lib/stage'
import { useReducedMotion } from './lib/motion'
import { ScrollCtx } from './lib/scroll'
import { Intro, Cursor, Header, Wayfinding, PinGuide } from './components/chrome'
import Hero from './components/Hero'
import Statement from './components/Statement'
import RoomJacket from './components/RoomJacket'
import RoomBags from './components/RoomBags'
import RoomBoots from './components/RoomBoots'
import Showcase from './components/Showcase'
import { OtherWork, About, Exit } from './components/closing'
import SheetViewer from './components/SheetViewer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const calm = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [roomReady, setRoomReady] = useState(false)
  const [sheets, setSheets] = useState(null)

  // the WebGL stage for every photograph
  useEffect(() => { stage.start() }, [])

  // Native scrolling: the page moves exactly as the wheel or trackpad says.
  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })
    setReady(true)
  }, [])

  // each room sets the light (backdrop colour), the chrome ink, and the wayfinding sign
  useLayoutEffect(() => {
    if (!ready) return
    const backdrop = document.getElementById('backdrop')
    const here = document.querySelector('#you-are-here .here-text')
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-tone]').forEach(sec => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: self => {
            if (!self.isActive) return
            gsap.to(backdrop, { backgroundColor: sec.dataset.tone, duration: calm ? 0 : 0.9, ease: 'power1.out', overwrite: true })
            document.documentElement.dataset.ink = sec.dataset.ink
            if (here && sec.dataset.sign) here.textContent = sec.dataset.sign
          },
        })
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => { ctx.revert(); window.removeEventListener('load', refresh) }
  }, [ready, calm])

  // hold the page still during the intro and while sheets are open
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !entered || !!sheets)
  }, [entered, sheets])

  return (
    <ScrollCtx.Provider value={{ ready, smoother: null, calm, openSheets: setSheets }}>
      <div id="backdrop" aria-hidden="true" />
      <a className="skip-link" href="#jacket">Skip to the collection</a>
      <Header />
      <PinGuide />
      <Wayfinding />
      <Cursor />
      <main>
        <Hero onRoomReady={() => setRoomReady(true)} />
        <Statement />
        <RoomJacket />
        <RoomBags />
        <RoomBoots />
        <Showcase />
        <OtherWork />
        <About />
      </main>
      <Exit />
      <SheetViewer room={sheets} onClose={() => setSheets(null)} />
      {!entered && <Intro calm={calm} roomReady={roomReady} onDone={() => setEntered(true)} />}
    </ScrollCtx.Provider>
  )
}
