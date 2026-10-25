import { useRef, useState } from 'react'
import { Plate, RoomHead, Chips, Spec, Film, SheetsLink } from './parts'
import { StitchLine } from './craft'
import { jacket, collection } from '../content'

// The prototype beside the final jacket, one view at a time.
function Prototype({ p }) {
  const [at, setAt] = useState(0)
  const v = p.views[at]
  return (
    <div className="proto">
      <div className="proto-copy">
        <h3 className="proto-k">Prototype variant</h3>
        <p className="proto-line">{p.line}</p>
        <div className="proto-tabs" role="group" aria-label="View">
          {p.views.map((x, i) => <button key={x.label} type="button" aria-pressed={i === at} onClick={() => setAt(i)}>{x.label}</button>)}
        </div>
      </div>
      <div className="proto-pair">
        <figure className="proto-fig">
          <Plate key={v.proto.src} {...v.proto} kind="cutout" className="proto-plate" />
          <figcaption><span className="proto-tag proto-tag--proto">Prototype</span>{v.label}</figcaption>
        </figure>
        <span className="proto-arrow" aria-hidden="true">→</span>
        <figure className="proto-fig">
          <Plate key={v.final.src} {...v.final} kind="cutout" className="proto-plate" />
          <figcaption><span className="proto-tag">Final</span>{v.label}</figcaption>
        </figure>
      </div>
    </div>
  )
}

export default function RoomJacket() {
  const j = jacket
  const [focus, setFocus] = useState(null)
  const [sewn, setSewn] = useState([])
  const fig = useRef(null)
  const PAD = 0.05
  return (
    <section id="jacket" className="room" data-tone="#D4C7C3" data-ink="dark" data-sign={collection.signs.jacket}>
      <RoomHead room={j} sign={collection.signs.jacket} variant="stitch" />
      <div className="jacket-grid">
        <figure ref={fig} className="jacket-hero">
          <Plate {...j.hero} kind="cutout" pad={PAD} focus={focus} className="jacket-plate">
            <StitchLine hotspots={j.hotspots} w={j.hero.w} h={j.hero.h} pad={PAD} trigger={fig} onPass={setSewn} />
            {j.hotspots.map(h => (
              <button
                key={h.label}
                type="button"
                className={`hotspot ${h.x > 0.5 ? 'is-left' : ''} ${focus === h ? 'is-on' : ''} ${sewn.includes(h.label) ? 'is-sewn' : ''}`}
                style={{ left: `${(PAD + h.x * (1 - 2 * PAD)) * 100}%`, top: `${(PAD + h.y * (1 - 2 * PAD)) * 100}%` }}
                aria-label={h.label}
                onMouseEnter={() => setFocus(h)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(h)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus(f => (f === h ? null : h))}
              >
                <span className="hotspot-label" aria-hidden="true">{h.label}</span>
              </button>
            ))}
          </Plate>
          <figcaption className="caption">Follow the line: it sews from the collar to the cuff as you scroll. Move the light across the jacket, or point at a marker to light a detail.</figcaption>
        </figure>

        <div className="jacket-copy">
          <p className="lead">{j.text}</p>
          <h3 className="h-small">Materials</h3>
          <Chips items={j.materials} />
          <h3 className="h-small">Details</h3>
          <ul className="details">
            {j.hotspots.map(h => (
              <li key={h.label}>
                <button type="button" className="detail-link" onMouseEnter={() => setFocus(h)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(h)} onBlur={() => setFocus(null)}>
                  {h.label}
                </button>
              </li>
            ))}
            {j.details.map(d => <li key={d}>{d}</li>)}
          </ul>
          <h3 className="h-small">Specification, look 1</h3>
          <Spec rows={j.spec} />
          <p className="care">{j.care}</p>
        </div>

        <div className="jacket-side">
          {j.gallery.map(g => (
            <figure key={g.src}>
              <Plate {...g} />
              <figcaption className="caption">{g.alt}.</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Prototype p={j.prototype} />
      <Film film={j.film} alt="Process film for the jacket" />
      <SheetsLink room={j} />
    </section>
  )
}
