import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Mark from '../../components/Mark'
import Toggle from '../../shared/Toggle'
import { light } from '../lib/light'
import { url } from '../lib/asset'
import { useCalm } from './media'
import { person, downloads } from '../../content'
import { chapters, leaves } from '../content'

const resume = downloads.find(d => /résumé/i.test(d.label))

const jump = (e, id) => {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 2.5
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: far || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  history.replaceState(null, '', '#' + id)
}

export function Header() {
  const [open, setOpen] = useState(false)
  const btn = useRef(null)
  useEffect(() => {
    if (!open) return
    const k = e => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  const go = id => e => { setOpen(false); jump(e, id) }
  return (
    <header className="ax-header">
      <a href="#top" className="ax-word" onClick={go('top')}>
        <Mark className="ax-mark" />
        <span className="ax-word-text"><span className="ax-name">{person.name}</span><span className="ax-role">Leather design · {person.school}</span></span>
      </a>
      <Toggle current="auxin" className="ax-toggle" />
      <nav id="ax-nav" className={`ax-nav ${open ? 'is-open' : ''}`} aria-label="Sections">
        <ol className="ax-nav-chapters">
          {chapters.map(c => (
            <li key={c.id}><a href={`#${c.id}`} onClick={go(c.id)}><span className="ax-nav-n">{c.n}</span>{c.stage}<span className="ax-nav-t">{c.title}</span></a></li>
          ))}
        </ol>
        <ul className="ax-nav-pieces">
          {leaves.map(l => <li key={l.id}><a href={`#${l.id}`} onClick={go(l.id)}>{l.short}</a></li>)}
        </ul>
        <a href="#about" onClick={go('about')}>About</a>
        <a href="#contact" onClick={go('contact')}>Contact</a>
        <a href={url(resume.file)} target="_blank" rel="noreferrer" className="ax-resume">Résumé <span aria-hidden="true">↗</span></a>
      </nav>
      <button ref={btn} type="button" className="ax-menu" aria-expanded={open} aria-controls="ax-nav" onClick={() => setOpen(v => !v)}>
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
  )
}

// The stem down the left edge: it grows as you read, leans toward the light,
// and carries a brass node for each chapter ("hardware as nodes").
export function StemMeter() {
  const calm = useCalm()
  const path = useRef(null), drawn = useRef(null), nodes = useRef([]), label = useRef(null)
  const [here, setHere] = useState(null)
  useEffect(() => {
    let progress = 0, marks = [], H = window.innerHeight
    const measure = () => {
      H = window.innerHeight
      const max = document.documentElement.scrollHeight - H
      marks = chapters.map(c => {
        const el = document.getElementById(c.id)
        return el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - H * 0.4) / max)) : 0
      })
    }
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => { progress = self.progress },
      onRefresh: self => { progress = self.progress; measure() },
    })
    measure()
    const draw = () => {
      const lean = calm ? 0 : Math.max(-26, Math.min(26, (light.x - 30) * 0.03))
      const top = 76, bottom = H - 24
      const d = `M10,${bottom} C10,${bottom - (bottom - top) * 0.45} ${10 + lean * 0.5},${top + (bottom - top) * 0.3} ${10 + lean},${top}`
      path.current?.setAttribute('d', d)
      drawn.current?.setAttribute('d', d)
      drawn.current?.style.setProperty('stroke-dashoffset', String(1 - progress))
      // place a node at each chapter's height along the curve
      marks.forEach((m, i) => {
        const n = nodes.current[i]
        if (!n) return
        const t = m, y = bottom - (bottom - top) * t
        const u = 1 - t
        const x = u * u * u * 10 + 3 * u * u * t * 10 + 3 * u * t * t * (10 + lean * 0.5) + t * t * t * (10 + lean)
        n.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
        n.classList.toggle('is-past', progress >= m - 0.002)
      })
    }
    const off = light.subscribe(draw)
    draw()
    const onR = () => { measure(); draw() }
    window.addEventListener('resize', onR)
    return () => { off(); st.kill(); window.removeEventListener('resize', onR) }
  }, [calm])
  useEffect(() => {
    const triggers = chapters.map(c => ScrollTrigger.create({
      trigger: '#' + c.id, start: 'top 55%', end: 'bottom 55%',
      onToggle: self => { if (self.isActive) setHere(c); else if (self.direction < 0 && c === chapters[0]) setHere(null) },
    }))
    return () => triggers.forEach(t => t.kill())
  }, [])
  return (
    <div className="ax-stem" aria-hidden="true">
      <svg className="ax-stem-svg">
        <path ref={path} className="ax-stem-line" />
        <path ref={drawn} className="ax-stem-grown" pathLength="1" />
        {chapters.map((c, i) => (
          <g key={c.id} ref={el => { nodes.current[i] = el }} className="ax-stem-node" onClick={e => jump(e, c.id)}>
            <circle r="5.5" /><circle r="2.2" className="ax-stem-eye" />
          </g>
        ))}
      </svg>
      <p ref={label} className={`ax-stem-here ${here ? 'is-on' : ''}`}><span>{here?.n}</span> {here?.stage}</p>
    </div>
  )
}

export function ChapterHead({ c, children }) {
  return (
    <header className="ch-head">
      <p className="ch-stage"><span className="ch-n">{c.n}</span><span className="ch-line" aria-hidden="true" />{c.stage}</p>
      <h2 className="ch-title">{c.title}</h2>
      {children && <div className="ch-intro">{children}</div>}
    </header>
  )
}
