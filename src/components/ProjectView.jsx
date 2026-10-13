import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { bySlug, related } from '../content'
import { site } from '../content/site'
import { typeOf, disciplineOf } from '../content/taxonomy'
import { Img, Placeholder, Shot, T, fullSrc } from './media'
import { Modules } from './modules'
import ProjectCard, { ProjectLink } from './ProjectCard'
import { Header, Footer } from './chrome'
import { useHead } from '../lib/head'
import { useReveal } from '../lib/motion'
import NotFound from '../pages/NotFound'

const ogImage = p => {
  const key = p.seo?.image || p.cover?.image
  const src = key && fullSrc(key)
  return src || '/og-card.jpg'
}

function CopyLink({ slug }) {
  const [state, setState] = useState('')
  const copy = async () => {
    const link = `${window.location.origin}/work/${slug}`
    try { await navigator.clipboard.writeText(link); setState('Link copied') }
    catch { setState(link) }
    setTimeout(() => setState(''), 4000)
  }
  return (
    <span className="copy">
      <button type="button" className="btn btn--ghost" onClick={copy}>Copy project link</button>
      <span className="mono copy-status" role="status" aria-live="polite">{state}</span>
    </span>
  )
}

// Scrolls to a section inside whichever element scrolls (the overlay or the window),
// and records the section in the address without losing the overlay.
function useSectionLinks(scrollRoot) {
  const location = useLocation()
  const navigate = useNavigate()
  const go = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    navigate({ hash: id }, { replace: true, state: location.state })
    el.focus({ preventScroll: true })
  }
  // arriving with #section in the address
  useLayoutEffect(() => {
    if (!location.hash) { scrollRoot?.current?.scrollTo?.(0, 0); return }
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
  }, [location.pathname])
  return go
}

export function ProjectBody({ project: p, inOverlay, scrollRoot, titleId }) {
  const root = useRef(null)
  const go = useSectionLinks(scrollRoot)
  useReveal(root, [p.slug])
  const sections = (p.sections || []).filter(s => s.modules?.length)
  const finalSec = sections.find(s => s.final)
  const hero = p.hero || p.cover
  const type = typeOf(p.type)
  const facts = [
    ['Type', type?.label],
    ['Disciplines', p.disciplines?.map(d => disciplineOf(d)?.label).join(', ')],
    ...(p.facts || []),
  ].filter(([, v]) => v)
  const rel = related(p)

  return (
    <article ref={root} className={`proj proj--${p.type} ${p.theme ? `theme-${p.theme}` : ''}`} style={{ '--accent': p.accent?.color, '--accent-ink': p.accent?.ink, '--accent-paper': p.accent?.paper }}>
      <header className="proj-head grid">
        <p className="proj-kicker mono">
          <span>{p.number}</span>
          <span>{type?.label}</span>
          {p.type === 'concept' && <span className="concept-flag">Self-initiated · not commissioned or produced</span>}
        </p>
        <h1 id={titleId} className="proj-title" tabIndex={-1}>{p.title}</h1>
        {p.subtitle && <p className="proj-sub mono"><T v={p.subtitle} /></p>}
        <p className="proj-premise"><T v={p.premise} /></p>
      </header>

      <figure className={`proj-hero ${hero?.fit === 'contain' ? 'is-contain' : ''} ${hero?.images ? 'is-set' : ''}`}>
        {hero?.images
          ? <div className="proj-hero-set" style={{ '--n': hero.images.length }}>{hero.images.map((h, i) => <Img key={i} image={h.image} alt={h.alt} sizes={`${Math.round(100 / hero.images.length)}vw`} eager={i < 2} />)}</div>
          : hero?.image
            ? <Img image={hero.image} alt={hero.alt} sizes="100vw" eager />
            : hero?.shot ? <div className="proj-hero-shot"><Shot shot={{ ...hero.shot, ratio: hero.shot.ratio || 21 / 9 }} /></div>
            : hero?.component ? <Modules list={[{ kind: 'component', name: hero.component, props: hero.props }]} />
              : <Placeholder label={hero?.placeholder || 'Lead image to come'} ratio={21 / 9} note={hero?.note} />}
        {hero?.caption && <figcaption className="cap"><T v={hero.caption} /></figcaption>}
      </figure>

      <div className="proj-intro grid">
        <div className="proj-overview">
          {(p.overview || []).map((t, i) => <p key={i}><T v={t} /></p>)}
          <p className="proj-actions">
            {finalSec && <a className="btn" href={`#${finalSec.id}`} onClick={e => go(e, finalSec.id)}>See the final work <span aria-hidden="true">↓</span></a>}
            {sections[0] && <a className="btn btn--ghost" href={`#${sections[0].id}`} onClick={e => go(e, sections[0].id)}>Read the process</a>}
            <CopyLink slug={p.slug} />
          </p>
        </div>
        <dl className="proj-facts">
          {facts.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd><T v={v} /></dd></div>)}
        </dl>
      </div>

      <div className={`proj-body ${sections.length >= 4 ? 'has-nav' : ''}`}>
        {sections.length >= 4 && (
          <nav className="sec-nav" aria-label="Sections of this project">
            <p className="mono">Contents</p>
            <ol>{sections.map((s, i) => <li key={s.id}><a href={`#${s.id}`} onClick={e => go(e, s.id)}><span className="mono">{String(i + 1).padStart(2, '0')}</span> {s.title}{s.final ? ' ●' : ''}</a></li>)}</ol>
          </nav>
        )}
        <div className="sec-list">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className={`sec sec--${s.layout || 'flow'} ${s.final ? 'is-final' : ''}`} tabIndex={-1} aria-labelledby={`${s.id}-h`}>
              <header className="sec-head" data-reveal>
                <span className="sec-n mono">{String(i + 1).padStart(2, '0')}</span>
                <h2 id={`${s.id}-h`}>{s.title}</h2>
                {s.intro && <p className="sec-intro"><T v={s.intro} /></p>}
              </header>
              <Modules list={s.modules} />
            </section>
          ))}
        </div>
      </div>

      <footer className="proj-foot">
        <div className="proj-contact grid">
          <p className="mono">{p.number} · {p.title}</p>
          <p className="proj-contact-line">Questions about this project, or want the full development file? <a href={`mailto:${site.email}?subject=${encodeURIComponent(p.title)}`}>{site.email}</a></p>
          <p className="proj-contact-links"><Link className="btn btn--ghost" to="/work">All work</Link> <a className="btn btn--ghost" href={site.resume.href} target="_blank" rel="noreferrer">Résumé ↗</a> <Link className="btn btn--ghost" to="/about">About {site.name.split(' ')[0]}</Link></p>
        </div>
        {rel.length > 0 && (
          <div className="related">
            <h2 className="mono">Related work</h2>
            <div className="related-grid">{rel.map(r => <ProjectCard key={r.slug} project={r} size="s" />)}</div>
          </div>
        )}
      </footer>
    </article>
  )
}

const headFor = p => ({ title: p.seo?.title || p.title, description: p.seo?.description || (typeof p.premise === 'string' ? p.premise : site.intro), image: ogImage(p), path: `/work/${p.slug}` })

// Direct visits to /work/<slug>: a complete page that stands on its own.
export function ProjectPage() {
  const { slug } = useParams()
  const p = bySlug(slug)
  useHead(p ? headFor(p) : { title: 'Not found' })
  if (!p) return <NotFound />
  return (
    <>
      <Header />
      <main id="main" className="page-project">
        <nav className="crumb mono grid" aria-label="Breadcrumb"><Link to="/">{site.name}</Link><span>/</span><Link to="/work">Work</Link><span>/</span><span aria-current="page">{p.title}</span></nav>
        <ProjectBody project={p} titleId="proj-title" />
      </main>
      <Footer />
    </>
  )
}

// Opened from within the site: the same project over a darkened page.
export function ProjectOverlay() {
  const { slug } = useParams()
  const p = bySlug(slug)
  const navigate = useNavigate()
  const location = useLocation()
  const scroll = useRef(null)
  const panel = useRef(null)
  const opener = useRef(typeof document !== 'undefined' ? document.activeElement : null)
  const background = location.state?.background
  useHead(p ? headFor(p) : { title: 'Not found' })

  const close = () => navigate(`${background?.pathname || '/work'}${background?.search || ''}`)

  useEffect(() => {
    document.documentElement.classList.add('has-overlay')
    const el = opener.current
    return () => { document.documentElement.classList.remove('has-overlay'); if (el?.isConnected) el.focus({ preventScroll: true }) }
  }, [])
  useEffect(() => { document.getElementById('ov-title')?.focus({ preventScroll: true }) }, [slug])

  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); close() }
    if (e.key !== 'Tab') return
    const f = [...panel.current.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex="0"], video[controls]')].filter(x => x.offsetParent !== null)
    if (!f.length) return
    const first = f[0], last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  return (
    <div className="overlay" onKeyDown={onKey}>
      <div className="overlay-backdrop" onClick={close} aria-hidden="true" />
      <div ref={panel} className="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="ov-title">
        <div className="overlay-bar">
          <span className="mono">{p ? `${p.number} · ${p.title}` : 'Not found'}</span>
          <span className="overlay-bar-r">
            {p && <a className="mono link" href={`/work/${p.slug}`} target="_blank" rel="noreferrer">Open as page ↗</a>}
            <button type="button" className="btn-x" onClick={close}>Close <span aria-hidden="true">✕</span></button>
          </span>
        </div>
        <div ref={scroll} className="overlay-scroll">
          {p ? <ProjectBody key={p.slug} project={p} inOverlay scrollRoot={scroll} titleId="ov-title" /> : <NotFound bare />}
        </div>
      </div>
    </div>
  )
}
