import { useEffect, useRef } from 'react'
import { url } from '../lib/asset'
import { scrollToTarget } from '../lib/scroll'
import Mark from './Mark'
import { person, collection, jacket, bags, boots, about, downloads } from '../content'

// "Need a hint?": the whole portfolio on one screen, for anyone short of time.
// In an escape room a hint is how you get out quickly.
const PROJECTS = [
  { room: jacket, img: 'assets/products/jacket-front.webp', what: 'Kimono-cut nappa jacket with a strap-and-buckle front' },
  { room: bags, img: 'assets/products/duffle.webp', what: 'Four convertible bags in olive suede; the duffle carries five ways' },
  { room: boots, img: 'assets/models/boot-relief.webp', what: 'High ankle boot on a six-layer sole unit, fully costed' },
]

export default function Hint({ open, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', '') }
    if (!open && d.open) { if (d.close) d.close(); else d.removeAttribute('open') }
  }, [open])

  const jump = (e, href) => {
    e.preventDefault()
    dialog.current?.close()
    requestAnimationFrame(() => scrollToTarget(null, href))
  }
  const [resume, portfolio] = downloads

  return (
    <dialog ref={dialog} className="hint" onClose={onClose} aria-labelledby="hint-title">
      <div className="hint-sheet">
        <div className="hint-top">
          <p className="hint-kicker"><Mark className="hint-mark" />Hint · the portfolio in 60 seconds</p>
          <button type="button" className="hint-close" onClick={() => dialog.current.close()} autoFocus>Close</button>
        </div>
        <h2 id="hint-title" className="hint-name">{person.name}</h2>
        <p className="hint-role">{person.degree}, {person.school}. {person.minor}.</p>

        <ol className="hint-projects">
          {PROJECTS.map(({ room, img, what }) => (
            <li key={room.id}>
              <a href={`#${room.id}`} onClick={e => jump(e, `#${room.id}`)} className="hint-card">
                <span className="hint-thumb"><img src={url(img)} alt="" loading="lazy" /></span>
                <span className="hint-num">{room.number}</span>
                <span className="hint-card-title">{room.title}</span>
                <span className="hint-card-line">{what}</span>
                <span className="hint-card-meta">{room.duration} · {collection.title}, {collection.season}</span>
              </a>
            </li>
          ))}
        </ol>

        <div className="hint-cols">
          <div>
            <h3 className="hint-h">Strengths</h3>
            <ul className="hint-list">{about.skills.slice(0, 4).map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <h3 className="hint-h">Software</h3>
            <p className="hint-tools">{about.tools.join(' · ')}</p>
            <h3 className="hint-h">Recognition</h3>
            <p className="hint-tools">{about.awards[0]}</p>
          </div>
        </div>

        <div className="hint-actions">
          <a className="btn" href={url(resume.file)} download>Download the résumé <span className="btn-note">{resume.size}</span></a>
          <a className="btn btn--quiet" href={url(portfolio.file)} download>Full portfolio PDF <span className="btn-note">{portfolio.size}</span></a>
          <a className="btn btn--quiet" href={`mailto:${person.email}`}>{person.email}</a>
          {person.linkedin && <a className="btn btn--quiet" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        </div>
        <p className="hint-foot">Close this to walk the rooms properly. It takes about four minutes.</p>
      </div>
    </dialog>
  )
}
