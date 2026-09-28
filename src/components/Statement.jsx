import { Plate, Sign } from './parts'
import { collection } from '../content'

export default function Statement() {
  const c = collection
  return (
    <section id="brief" className="brief" data-tone="#13241E" data-ink="light" data-sign={c.signs.statement}>
      <Sign>{c.signs.statement}</Sign>
      <p className="brief-pull">{c.pull}</p>
      <div className="brief-grid">
        <div className="brief-concept">
          <h2 className="brief-h">The brief</h2>
          {c.concept.map(p => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
        <div className="brief-for">
          <h2 className="brief-h">Who it is for</h2>
          <p>{c.consumer.who}</p>
          <p>{c.consumer.how}</p>
        </div>
      </div>
      <div className="brief-boards">
        <figure>
          <Plate kind="photo" src={c.inspiration.src} alt={c.inspiration.alt} w={1800} h={1012} tilt={0.12} />
          <figcaption className="caption">Inspiration. The phrases on this board became the signs around this site.</figcaption>
        </figure>
        <figure>
          <Plate kind="photo" src={c.mood.src} alt={c.mood.alt} w={1800} h={1012} tilt={0.12} />
          <figcaption className="caption">Moodboard.</figcaption>
        </figure>
      </div>
      <div className="palette">
        <h2 className="brief-h">Six colours from the underpass</h2>
        <ul className="tags">
          {c.palette.map(p => (
            <li key={p.code} className="tag">
              <span className="tag-swatch" style={{ background: p.hex }}><span className="tag-eyelet" /></span>
              <span className="tag-name">{p.name}</span>
              <span className="tag-code">Pantone {p.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
