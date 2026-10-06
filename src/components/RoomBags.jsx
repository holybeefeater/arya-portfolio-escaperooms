import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScroll } from '../lib/scroll'
import { guide, guideFor } from '../lib/guide'
import { progress } from '../lib/progress'
import { sound } from '../lib/sound'
import { CarryModes, DayWithBag, Nesting } from './craft'
import { Plate, RoomHead, Chips, Bom, Film, SheetsLink, Sign } from './parts'
import { bags, collection } from '../content'

gsap.registerPlugin(ScrollTrigger)

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
    <section id="bags" className="room room--dark" data-tone="#5E5C3A" data-ink="light" data-sign={collection.signs.bags}>
      <RoomHead room={b} sign={collection.signs.bags} variant="bay" />
      <div className="room-intro">
        <p className="lead">{b.text}</p>
        <Chips items={b.materials} />
      </div>

      <div ref={pin} className={`bays-pin ${calm ? 'is-native' : ''}`}>
        <div ref={track} className="bays-track">
          {b.pieces.map((p, i) => (
            <article className="bay" key={p.name} aria-labelledby={`bay-${i}`}>
              <span className="bay-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <Plate {...p.img} kind="cutout" className="bay-plate" />
              <div className="bay-copy">
                <h3 id={`bay-${i}`} className="display bay-title">{p.name}</h3>
                <p className="bay-line">{p.line}</p>
                <p className="bay-size">{p.size}</p>
                <ul className="details details--compact">{p.details.map(d => <li key={d}>{d}</li>)}</ul>
                <Bom rows={p.bom} />
              </div>
            </article>
          ))}
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
        {b.campaign.map(c => (
          <figure key={c.src} className="bags-campaign">
            <Plate {...c} />
            <figcaption className="caption">{c.alt}.</figcaption>
          </figure>
        ))}
        <Film film={b.film} alt="Process film for the bags" className="bags-film" />
      </div>
      <SheetsLink room={b} />
    </section>
  )
}
