import { useState } from 'react'
import { Plate, RoomHead, Chips, Spec, Film, SheetsLink } from './parts'
import { jacket, collection } from '../content'

export default function RoomJacket() {
  const j = jacket
  const [focus, setFocus] = useState(null)
  const PAD = 0.05
  return (
    <section id="jacket" className="room" data-tone="#D4C7C3" data-ink="dark" data-sign={collection.signs.jacket}>
      <RoomHead room={j} sign={collection.signs.jacket} />
      <div className="jacket-grid">
        <figure className="jacket-hero">
          <Plate {...j.hero} kind="cutout" pad={PAD} focus={focus} className="jacket-plate">
            {j.hotspots.map(h => (
              <button
                key={h.label}
                type="button"
                className={`hotspot ${h.x > 0.5 ? 'is-left' : ''} ${focus === h ? 'is-on' : ''}`}
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
          <figcaption className="caption">Move the light across the jacket, or point at a marker to light a detail.</figcaption>
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
      <Film film={j.film} alt="Process film for the jacket" />
      <SheetsLink room={j} />
    </section>
  )
}
