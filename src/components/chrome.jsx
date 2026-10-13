import { Link, NavLink } from 'react-router-dom'
import { site, colophon } from '../content/site'
import { projects } from '../content'
import { T } from './media'

export function Header() {
  return (
    <header className="hdr">
      <a className="skip" href="#main">Skip to content</a>
      <Link to="/" className="hdr-name" aria-label={`${site.name}, home`}>
        <span className="hdr-mark" aria-hidden="true">AA</span>
        <span>{site.name}</span>
      </Link>
      <span className="hdr-desc mono" aria-hidden="true">{site.descriptor}</span>
      <nav className="hdr-nav" aria-label="Main">
        <NavLink to="/work">Work <sup className="mono">{projects.length}</sup></NavLink>
        <NavLink to="/about">About</NavLink>
        <a href={site.resume.href} target="_blank" rel="noreferrer">Résumé<span aria-hidden="true"> ↗</span><span className="sr-only"> (PDF, opens in a new tab)</span></a>
        <a href="#contact" className="hdr-contact">Contact</a>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="ftr" tabIndex={-1}>
      <div className="ftr-grid">
        <p className="mono ftr-k">Contact</p>
        <a className="ftr-mail" href={`mailto:${site.email}`}>{site.email}</a>
        <ul className="ftr-links">
          <li><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          <li><a href={site.instagram.url} target="_blank" rel="noreferrer">Instagram {site.instagram.handle} ↗</a></li>
          <li><a href={site.resume.href} target="_blank" rel="noreferrer">Résumé ({site.resume.size}) ↗</a></li>
          <li><Link to="/work">All work</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <p className="ftr-avail"><T v={site.availability} /></p>
      </div>
      <div className="ftr-base mono">
        <span>© {new Date().getFullYear()} {site.name}. All work shown is the designer’s own unless credited.</span>
        <span>Type: {colophon.map((f, i) => <span key={f.name}>{i ? ', ' : ''}<a href={f.source} target="_blank" rel="noreferrer">{f.name}</a> ({f.licence})</span>)}</span>
      </div>
    </footer>
  )
}
