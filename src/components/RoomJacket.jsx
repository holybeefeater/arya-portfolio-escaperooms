import { useRef, useState } from 'react'
import { RoomHead, Chips, Spec, Film, SheetsLink, Still } from './parts'
import { StitchLine } from './craft'
import Pattern from './Pattern'
import { jacket, collection } from '../content'

// A line under each piece, pointing to its shoot further down.
export function MoreBelow({ what }) {
  return <p className="more-below"><a href="#shoot">More of the {what}, worn, in the lookbook below <span aria-hidden="true">↓</span></a></p>
}

export default function RoomJacket() {
  const j = jacket
  const [focus, setFocus] = useState(null)
  const [sewn, setSewn] = useState([])
  const fig = useRef(null)
  const [side, back] = j.views
  const hot = h => ({
    onMouseEnter: () => setFocus(h), onMouseLeave: () => setFocus(null),
    onFocus: () => setFocus(h), onBlur: () => setFocus(null),
  })
  return (
    <section id="jacket" className="room room--noir" data-tone="#1A0E11" data-ink="light" data-sign={collection.signs.jacket}>
      <RoomHead room={j} sign={collection.signs.jacket} variant="stitch" />

      {/* the three views, standing on one line: side, front, back */}
      <div className="jk-lineup">
        <figure className="jk-view jk-view--side">
          <Still {...side} />
          <figcaption>{side.label}</figcaption>
        </figure>
        <figure ref={fig} className="jk-view jk-view--front">
          <div className="jk-hero" style={{ aspectRatio: `${j.hero.w} / ${j.hero.h}` }}>
            <Still {...j.hero} eager />
            {/* everything but the detail in focus steps into the dark */}
            <Still {...j.hero} alt="" aria-hidden="true" className={`jk-dim ${focus ? 'is-on' : ''}`}
              style={focus ? { '--fx': `${focus.x * 100}%`, '--fy': `${focus.y * 100}%` } : undefined} />
            <StitchLine hotspots={j.hotspots} w={j.hero.w} h={j.hero.h} pad={0} trigger={fig} onPass={setSewn} />
            {j.hotspots.map(h => (
              <button key={h.label} type="button" aria-label={h.label} {...hot(h)} onClick={() => setFocus(f => (f === h ? null : h))}
                className={`hotspot ${h.x > 0.5 ? 'is-left' : ''} ${focus === h ? 'is-on' : ''} ${sewn.includes(h.label) ? 'is-sewn' : ''}`}
                style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}>
                <span className="hotspot-label" aria-hidden="true">{h.label}</span>
              </button>
            ))}
          </div>
          <figcaption>Front</figcaption>
        </figure>
        <figure className="jk-view jk-view--back">
          <Still {...back} />
          <figcaption>{back.label}</figcaption>
        </figure>
      </div>
      <MoreBelow what="jacket" />

      <div className="jk-copy">
        <div>
          <p className="lead">{j.text}</p>
          <h3 className="h-small">Materials</h3>
          <Chips items={j.materials} />
          <h3 className="h-small">Details</h3>
          <ul className="details">
            {j.hotspots.map(h => (
              <li key={h.label}><button type="button" className="detail-link" {...hot(h)}>{h.label}</button></li>
            ))}
            {j.details.map(d => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="h-small">Specification, look 1</h3>
          <Spec rows={j.spec} />
          <p className="care">{j.care}</p>
        </div>
      </div>

      {/* close-ups, cropped from the shoot */}
      <div className="jk-close">
        {j.close.map(c => (
          <figure key={c.src} className="jk-close-fig">
            <Still {...c} className="jk-close-img" />
            <figcaption>{c.label}</figcaption>
          </figure>
        ))}
      </div>

      {/* the fit variant, and the pattern it was made to check */}
      <div className="fit">
        <div className="fit-copy">
          <h3 className="fit-title">{j.variant.title}</h3>
          <p className="fit-line">{j.variant.line}</p>
        </div>
        <div className="fit-views">
          {j.variant.views.map(v => (
            <figure key={v.src} className="fit-view">
              <Still {...v} />
              <figcaption>{v.label}</figcaption>
            </figure>
          ))}
        </div>
        <Pattern pattern={j.pattern} />
      </div>

      <Film film={j.film} alt="Process film for the jacket" />
      <SheetsLink room={j} />
    </section>
  )
}
