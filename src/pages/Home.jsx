import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../content'
import { site } from '../content/site'
import { TYPES, typeOf, disciplineOf } from '../content/taxonomy'
import { Img, T } from '../components/media'
import ProjectCard, { Cover, ProjectLink, Tags } from '../components/ProjectCard'
import { useHead } from '../lib/head'
import { useReveal } from '../lib/motion'

const SwatchHero = lazy(() => import('../components/SwatchHero'))

// Sizes for the curated selection: the rhythm repeats if more projects are featured.
const RHYTHM = [['l', 4 / 5], ['s', 1], ['s', 4 / 5], ['m', 3 / 4], ['m', 1], ['s', 3 / 4]]

export default function Home() {
  useHead({ path: '/' })
  const root = useRef(null)
  useReveal(root, [])
  const collections = projects.filter(p => p.type === 'collection' && p.featured)
  // projects with real visuals lead the selection; ones still waiting for images follow
  const visual = p => !!(p.cover?.image || p.cover?.shot || p.cover?.component)
  const selection = projects.filter(p => p.type !== 'collection' && p.featured).sort((a, b) => visual(b) - visual(a))
  const counts = TYPES.map(t => [t, projects.filter(p => p.type === t.id).length]).filter(([, n]) => n)

  return (
    <div ref={root} className="home">
      {/* ── 1. Introduction, with the 3D swatch ───────────────────────────── */}
      <section className="hero grid" aria-labelledby="hero-name">
        <p className="hero-rail mono" aria-hidden="true">Portfolio {new Date().getFullYear()} — {projects.length} projects — index 01–{String(projects.length).padStart(2, '0')}</p>
        <h1 id="hero-name" className="hero-name"><span>Aditi</span><span>Arya</span></h1>
        <div className="hero-copy">
          <p className="hero-intro">{site.intro}</p>
          <p className="hero-approach">{site.approach}</p>
          <p className="hero-links">
            <Link className="btn" to="/work">See all work <span aria-hidden="true">→</span></Link>
            <a className="btn btn--ghost" href={site.resume.href} target="_blank" rel="noreferrer">Résumé <span className="mono">PDF</span></a>
            <a className="btn btn--ghost" href="#contact">Contact</a>
          </p>
          <dl className="hero-meta">
            <div><dt className="mono">Practice</dt><dd>Bags, footwear, garments, materials, brand identity</dd></div>
            <div><dt className="mono">Based in</dt><dd><T v={site.location} /></dd></div>
            <div><dt className="mono">Now</dt><dd><T v={site.availability} /></dd></div>
          </dl>
        </div>
        <figure className="hero-portrait">
          <Img image={site.portrait.image} alt={site.portrait.alt} sizes="(min-width: 900px) 14vw, 30vw" eager />
          <figcaption className="mono">Aditi Arya</figcaption>
        </figure>
        <div className="hero-swatch">
          <Suspense fallback={<div className="swatch-fallback" />}>
            <SwatchHero />
          </Suspense>
        </div>
      </section>

      {/* ── 2. The collections lead ───────────────────────────────────────── */}
      <section className="block collections" aria-labelledby="h-collections">
        <header className="block-head grid" data-reveal>
          <h2 id="h-collections" className="mono">Collections</h2>
          <p className="block-note">Full collections, from research to finished pieces. Each spans more than one category.</p>
        </header>
        {collections.map((p, i) => (
          <article key={p.slug} className={`feature grid ${i % 2 ? 'feature--r' : ''}`} data-reveal>
            <ProjectLink project={p} className="feature-img" aria-label={`${p.title}: open project`}>
              <Cover project={p} sizes="(min-width: 900px) 60vw, 100vw" ratio={i % 2 ? 4 / 5 : 5 / 6} eager={i === 0} />
            </ProjectLink>
            <div className="feature-text">
              <p className="feature-n mono">{p.number}</p>
              <h3 className="feature-title"><ProjectLink project={p}>{p.title}</ProjectLink></h3>
              <p className="feature-premise"><T v={p.premise} /></p>
              <Tags project={p} />
              {p.facts?.length > 0 && <p className="feature-season mono">{p.facts.find(([k]) => /season|year/i.test(k))?.[1]}</p>}
              <ProjectLink project={p} className="btn">Open {p.title} <span aria-hidden="true">→</span></ProjectLink>
            </div>
          </article>
        ))}
      </section>

      {/* ── 3. A curated cut through the rest of the practice ─────────────── */}
      <section className="block selection" aria-labelledby="h-selection">
        <header className="block-head grid" data-reveal>
          <h2 id="h-selection" className="mono">Explorations, research and concepts</h2>
          <p className="block-note">Material studies, field research and self-initiated briefs. A selection; the index below lists everything.</p>
        </header>
        <div className="mosaic">
          {selection.map((p, i) => { const [size, ratio] = RHYTHM[i % RHYTHM.length]; return <ProjectCard key={p.slug} project={p} size={size} ratio={ratio} /> })}
        </div>
      </section>

      {/* ── 4. The whole index, one line each ─────────────────────────────── */}
      <section className="block index" aria-labelledby="h-index">
        <header className="block-head grid" data-reveal>
          <h2 id="h-index" className="mono">Index</h2>
          <p className="block-note">{counts.map(([t, n]) => `${n} ${n === 1 ? t.label.toLowerCase() : t.plural.toLowerCase()}`).join(' · ')}</p>
        </header>
        <ol className="idx">
          {projects.map(p => (
            <li key={p.slug} data-reveal>
              <ProjectLink project={p} className="idx-row">
                <span className="mono idx-n">{p.number}</span>
                <span className="idx-title">{p.title}</span>
                <span className="mono idx-type">{typeOf(p.type)?.label}</span>
                <span className="mono idx-disc">{p.disciplines?.map(d => disciplineOf(d)?.label).join(', ') || '—'}</span>
                <span className="idx-thumb" aria-hidden="true"><Cover project={p} sizes="160px" ratio={4 / 5} /></span>
              </ProjectLink>
            </li>
          ))}
        </ol>
        <p className="grid"><Link className="btn" to="/work">Browse and filter all work <span aria-hidden="true">→</span></Link></p>
      </section>

      {/* ── 5. About, briefly ─────────────────────────────────────────────── */}
      <section className="block about-teaser grid" aria-labelledby="h-about" data-reveal>
        <h2 id="h-about" className="mono">About</h2>
        <p className="about-teaser-text">{site.approach} <Link to="/about" className="link">More about Aditi, experience and recognition →</Link></p>
      </section>
    </div>
  )
}
