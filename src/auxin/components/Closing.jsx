import Toggle from '../../shared/Toggle'
import { url } from '../lib/asset'
import { Lean } from './media'
import { person, about, downloads } from '../../content'

// About and contact are shared with Escape Rooms (src/content.js).
// Escape Rooms' first bio paragraph is about that collection, so only the second is used here.
const bio = about.bio.slice(1)

export function About() {
  return (
    <section id="about" className="ch ch--about" data-tone="#C5CCB4" data-ink="dark">
      <header className="ch-head">
        <p className="ch-stage"><span className="ch-n">—</span><span className="ch-line" aria-hidden="true" />About</p>
        <h2 className="ch-title">{person.name}</h2>
      </header>
      <div className="about-grid">
        <figure className="about-portrait">
          <Lean max={6}><img src={url(about.portrait.src)} alt={about.portrait.alt} width={about.portrait.w} height={about.portrait.h} loading="lazy" decoding="async" /></Lean>
        </figure>
        <div className="about-copy">
          <p className="about-lede">{person.degree.split(',')[0]} at {person.school}, {person.degree.split(', ')[1]}. {person.minor}.</p>
          {bio.map(p => <p key={p}>{p}</p>)}
          <blockquote className="about-motto"><p>“{about.motto}”</p><footer>From her internship reflection</footer></blockquote>
        </div>
        <div className="about-lists">
          <div><h3 className="list-k">Education</h3><ul>{about.education.map(([a, b]) => <li key={a}>{a}<span>{b}</span></li>)}</ul></div>
          <div><h3 className="list-k">Recognition</h3><ul>{about.awards.map(a => <li key={a}>{a}</li>)}</ul></div>
          <div><h3 className="list-k">Skills</h3><ul>{about.skills.map(a => <li key={a}>{a}</li>)}</ul></div>
          <div><h3 className="list-k">Tools</h3><p className="tools">{about.tools.join(' · ')}</p></div>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const keep = downloads.filter(d => /résumé|portfolio|internship/i.test(d.label))
  return (
    <section id="contact" className="ch ch--contact" data-tone="#22397A" data-ink="light">
      <p className="ch-stage"><span className="ch-n">—</span><span className="ch-line" aria-hidden="true" />Contact</p>
      <a className="contact-mail" href={`mailto:${person.email}`}>{person.email.split('@')[0]}@<wbr />{person.email.split('@')[1]}</a>
      <ul className="contact-links">
        <li><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></li>
        <li><a href={person.instagram.url} target="_blank" rel="noreferrer">Instagram {person.instagram.handle} <span aria-hidden="true">↗</span></a></li>
      </ul>
      <ul className="contact-files">
        {keep.map(d => (
          <li key={d.file}><a href={url(d.file)} download><span>{d.label}</span><span className="contact-file-note">{[d.note, d.size].filter(Boolean).join(' · ')}</span><span aria-hidden="true">↓</span></a></li>
        ))}
      </ul>
      <div className="contact-next">
        <p>Another collection:</p>
        <Toggle current="auxin" className="contact-toggle" />
      </div>
      <footer className="colophon">
        <p>Type: <a href="https://fonts.google.com/specimen/Instrument+Serif" target="_blank" rel="noreferrer">Instrument Serif</a> (Rodrigo Fuenzalida, Jordan Egstad) and <a href="https://fonts.google.com/specimen/Archivo" target="_blank" rel="noreferrer">Archivo</a> (Omnibus-Type), both SIL Open Font License.</p>
        <p>The strips at the top are cut, in 3D, from crops of the shoot photographs. A “moving still” is a slow camera move over one of those photographs; her own shoot video replaces it when added. Boards, drawings and the closing image are pages of her Auxin deck.</p>
        <p>© {person.name}</p>
      </footer>
    </section>
  )
}
