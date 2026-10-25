import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScroll } from '../lib/scroll'
import { guide, guideFor } from '../lib/guide'
import { progress } from '../lib/progress'
import { sound } from '../lib/sound'
import { CarryModes, DayWithBag, Nesting } from './craft'
import { RoomHead, Chips, Bom, Film, SheetsLink, Sign, Still } from './parts'
import { url } from '../lib/asset'
import { MoreBelow } from './RoomJacket'
import { bags, collection } from '../content'

gsap.registerPlugin(ScrollTrigger)

// One bay: the bag cut out, with its close-ups pinned to it, and beside it a
// small screen that plays the bag's film until a close-up is chosen, from a pin
// or from the list of details.
function Bay({ p, i }) {
  const [look, setLook] = useState(null)
  const vid = useRef(null), box = useRef(null)
  useEffect(() => {
    const v = vid.current
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.25 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  const hold = l => ({
    onMouseEnter: () => setLook(l), onMouseLeave: () => setLook(null), onFocus: () => setLook(l), onBlur: () => setLook(null),
    onClick: () => setLook(x => (x === l ? null : l)), 'aria-pressed': look === l,
  })
  const byLabel = Object.fromEntries(p.looks.map(l => [l.label, l]))
  return (
    <article ref={box} className="bay" aria-labelledby={`bay-${i}`}>
      <span className="bay-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <div className="bag-stage">
        <div className="bag-zone">
          <div className="bag-cut" style={{ '--ar': p.cut.w / p.cut.h }}>
            <Still {...p.cut} />
            {p.looks.filter(l => l.at).map(l => (
              <button key={l.label} type="button" className={`bag-pin ${look === l ? 'is-on' : ''}`} style={{ left: `${l.at[0] * 100}%`, top: `${l.at[1] * 100}%` }}
                aria-label={`Close-up: ${l.label}`} {...hold(l)} />
            ))}
          </div>
        </div>
        <figure className="bag-screen">
          <div className="bag-screen-box">
            <video ref={vid} src={url(p.film.src)} poster={url(p.film.poster)} muted loop playsInline preload="none" aria-label={`Film: the ${p.name.toLowerCase()}`} />
            {p.looks.map(l => <img key={l.src} src={url(l.src)} alt={l.alt} loading="lazy" className={look === l ? 'is-on' : ''} />)}
          </div>
          <figcaption>{look ? look.label : p.film.label}</figcaption>
        </figure>
      </div>
      <div className="bay-copy">
        <h3 id={`bay-${i}`} className="display bay-title">{p.name}</h3>
        <p className="bay-line">{p.line}</p>
        <p className="bay-size">{p.size}</p>
        <ul className="details details--compact">
          {p.details.map(d => <li key={d}>{byLabel[d] ? <button type="button" className="detail-link" {...hold(byLabel[d])}>{d}</button> : d}</li>)}
        </ul>
        <Bom rows={p.bom} />
        <MoreBelow what={p.name.toLowerCase()} />
      </div>
    </article>
  )
}

// Four bags parked in numbered bays. Scrolling drives along the row.
export default function RoomBags() {
  const { ready, calm, smoother } = useScroll()
  const pin = useRef(null)
  const track = useRef(null)
  const b = bags

  useLayoutEffect(() => {
    if (!ready || calm) return
    const names = b.pieces.map(p => p.name)
    const hold = guideFor('bags', {
      smoother,
      skipText: 'Skip past the bags',
      next: '#bags .bags-after',
      label: p => ['Keep scrolling', p > 0.94 ? 'End of the row' : `Bay ${Math.min(names.length, Math.floor(p * names.length * 1.08) + 1)} of ${names.length}: ${names[Math.min(names.length - 1, Math.floor(p * names.length * 1.08))]}`],
    })
    let bay = 0
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, track.current.scrollWidth - pin.current.clientWidth)
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...hold,
          onUpdate: self => {
            hold.onUpdate(self)
            const now = Math.min(names.length - 1, Math.floor(self.progress * names.length * 1.08))
            if (now !== bay) { bay = now; sound.play('zip') }
            if (self.progress > 0.94) progress.key('bags')
          },
        },
      })
    }, pin)
    return () => { ctx.revert(); guide.hide('bags') }
  }, [ready, calm, smoother])

  // without pinning (reduced motion), reaching the end of the row finds the key
  useLayoutEffect(() => {
    if (!ready || !calm) return
    const st = ScrollTrigger.create({ trigger: '#bags .bay--end', start: 'top 80%', onEnter: () => progress.key('bags') })
    return () => st.kill()
  }, [ready, calm])

  return (
    <section id="bags" className="room room--dark room--noir" data-tone="#26271A" data-ink="light" data-sign={collection.signs.bags}>
      <RoomHead room={b} sign={collection.signs.bags} variant="bay" />
      <div className="room-intro">
        <p className="lead">{b.text}</p>
        <Chips items={b.materials} />
      </div>

      <div ref={pin} className={`bays-pin ${calm ? 'is-native' : ''}`}>
        <div ref={track} className="bays-track">
          {b.pieces.map((p, i) => <Bay key={p.name} p={p} i={i} />)}
          <div className="bay bay--end">
            <Sign>{collection.signs.bagsEnd}</Sign>
            <p className="bay-end-text">Four bags from one hide, each carried more than one way.</p>
          </div>
        </div>
      </div>

      <CarryModes modes={b.carry} name={b.pieces[0].name} />
      <DayWithBag day={b.day} />
      <Nesting nesting={b.nesting} />

      <div className="bags-after">
        <Film film={b.film} alt="Process film for the bags" className="bags-film" />
      </div>
      <SheetsLink room={b} />
    </section>
  )
}
