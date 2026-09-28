import { Plate, Sign } from './parts'
import { url } from '../lib/asset'
import { finePointer } from '../lib/motion'
import { collection, internship, otherWork, about, person, downloads } from '../content'

export function OtherWork() {
  const i = internship
  const [print, ...boards] = i.boards
  return (
    <section id="other" className="room" data-tone="#CBCFBF" data-ink="dark" data-sign={collection.signs.other}>
      <Sign>{collection.signs.other}</Sign>
      <h2 className="display section-title">Other work</h2>
      <div className="intern">
        <div className="intern-copy">
          <h3 className="intern-co">{i.company}</h3>
          <p className="intern-when">Industry internship, {i.when}</p>
          <p className="lead">{i.what}</p>
          <p className="muted">{i.mentors}</p>
          <a className="btn btn--quiet" href={url(i.deck)} download>Download the internship presentation</a>
        </div>
        <figure className="board board--film">
          <Plate kind="film" film={print.film.src} poster={print.film.poster} alt={`${print.title}, build-up film`} ratio="1 / 1" w={560} h={560} />
          <figcaption className="caption"><strong>{print.title}.</strong> {print.text} {finePointer() ? 'Hover' : 'Tap'} to watch it build.</figcaption>
        </figure>
      </div>
      <div className="boards">
        {boards.map(b => (
          <figure key={b.title} className="board">
            <Plate kind="photo" src={b.src} alt={b.title} w={b.w} h={b.h} tilt={0.1} />
            <figcaption className="caption"><strong>{b.title}.</strong> {b.text}</figcaption>
          </figure>
        ))}
      </div>
      <h3 className="h-small work-h">Research, publishing and identity</h3>
      <ul className="work-list">
        {otherWork.map(w => (
          <li key={w.title}><span className="work-title">{w.title}</span><span className="work-role">{w.role}</span></li>
        ))}
      </ul>
    </section>
  )
}

export function About() {
  const a = about
  return (
    <section id="about" className="room about" data-tone="#D3D6C8" data-ink="dark" data-sign={collection.signs.about}>
      <Sign>{collection.signs.about}</Sign>
      <div className="about-grid">
        <figure className="about-portrait">
          <Plate kind="photo" {...a.portrait} tilt={0.14} />
        </figure>
        <div className="about-copy">
          <h2 className="display section-title">About {person.name.split(' ')[0]}</h2>
          {a.bio.map(p => <p key={p.slice(0, 16)} className="lead">{p}</p>)}
          <dl className="edu">
            {a.education.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>
      <div className="about-cols">
        <div><h3 className="h-small">Awards</h3><ul className="details">{a.awards.map(x => <li key={x}>{x}</li>)}</ul></div>
        <div><h3 className="h-small">Skills</h3><ul className="details">{a.skills.map(x => <li key={x}>{x}</li>)}</ul></div>
        <div><h3 className="h-small">Software</h3><ul className="chips">{a.tools.map(x => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </section>
  )
}

function Runner() {
  // A simple running figure and arrow, after the emergency-exit pictogram.
  return (
    <svg className="exit-figure" viewBox="0 0 120 80" aria-hidden="true">
      <rect x="4" y="6" width="34" height="68" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="66" cy="15" r="7" fill="currentColor" />
      <path d="M62 26 L54 46 L40 50 M58 34 L72 40 L80 32 M54 46 L66 58 L62 74 M54 46 L46 62 L34 66" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M88 40 H114 M104 30 L115 40 L104 50" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Exit() {
  return (
    <section id="exit" className="exit" data-tone="#13241E" data-ink="light" data-sign={collection.signs.exit}>
      <Sign>{collection.signs.exit}</Sign>
      <a className="exit-sign" href={`mailto:${person.email}`} aria-label={`Email Aditi Arya at ${person.email}`}>
        <Runner />
        <span className="exit-word">EXIT</span>
      </a>
      <p className="exit-line">
        For internships, graduation projects and collaborations, write to{' '}
        <a href={`mailto:${person.email}`}>{person.email}</a>.
      </p>
      <ul className="exit-links">
        <li><a href={person.instagram.url} target="_blank" rel="noreferrer">Instagram {person.instagram.handle}</a></li>
        {person.linkedin && <li><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
        {downloads.map(d => <li key={d.file}><a href={url(d.file)} download>{d.label} <span className="muted">({d.size})</span></a></li>)}
      </ul>
      <footer className="foot">
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>{collection.title}, {collection.season}</span>
        <a href="#top">Back to the entrance</a>
      </footer>
    </section>
  )
}
