import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { site, about } from '../content/site'
import { Img, T } from '../components/media'
import { useHead } from '../lib/head'
import { useReveal } from '../lib/motion'

export default function About() {
  useHead({ title: 'About', description: `${site.name}: ${site.intro}`, path: '/about' })
  const root = useRef(null)
  useReveal(root, [])
  return (
    <div ref={root} className="about">
      <header className="about-head grid">
        <h1 className="about-title">About</h1>
        <figure className="about-portrait" data-reveal>
          <Img image={site.portrait.image} alt={site.portrait.alt} sizes="(min-width: 900px) 30vw, 80vw" eager />
        </figure>
        <div className="about-intro">
          <p className="about-lede">{site.intro}</p>
          {about.bio.map((p, i) => <p key={i}>{p}</p>)}
          <blockquote className="about-quote"><p>“{about.quote.text}”</p><cite className="mono">{about.quote.source}</cite></blockquote>
          <p className="hero-links">
            <a className="btn" href={site.resume.href} target="_blank" rel="noreferrer">Download résumé <span className="mono">{site.resume.size}</span></a>
            <a className="btn btn--ghost" href={`mailto:${site.email}`}>{site.email}</a>
            <a className="btn btn--ghost" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </p>
        </div>
      </header>

      <div className="about-cols grid">
        <section data-reveal><h2 className="mono">Education</h2>
          <dl className="cv">{about.education.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
        <section data-reveal><h2 className="mono">Experience</h2>
          <dl className="cv">{about.experience.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
        <section data-reveal><h2 className="mono">Recognition and publishing</h2>
          <ul className="cv-list">{about.recognition.map(r => <li key={r}>{r}</li>)}</ul></section>
        <section data-reveal><h2 className="mono">Skills</h2>
          <ul className="cv-list">{about.skills.map(r => <li key={r}>{r}</li>)}</ul>
          <h2 className="mono cv-sub">Software</h2>
          <p className="cv-tools">{about.tools.join(' · ')}</p></section>
        <section data-reveal><h2 className="mono">Based in</h2><p><T v={site.location} /></p>
          <h2 className="mono cv-sub">Looking for</h2><p><T v={site.availability} /></p></section>
      </div>
      <p className="grid about-more"><Link className="btn" to="/work">See the work <span aria-hidden="true">→</span></Link></p>
    </div>
  )
}
