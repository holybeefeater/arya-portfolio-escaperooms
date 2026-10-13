import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterHead } from './chrome'
import { Board, useCalm } from './media'
import { chapters, research, boards } from '../content'

gsap.registerPlugin(ScrollTrigger)
const c = chapters[1]

// Four roots grow down from the chapter line, one to each finding of the research.
// Paths are drawn in a 1000 × 260 box and stretch with the page.
const ROOTS = [
  'M500,0 C500,60 380,70 300,120 S140,200 125,250',
  'M500,0 C505,80 450,140 420,180 S380,230 375,250',
  'M500,0 C495,70 560,140 590,180 S620,230 625,250',
  'M500,0 C500,60 640,80 720,130 S860,210 875,250',
]
const HAIRS = [
  'M300,120 C270,130 250,160 235,170', 'M420,180 C440,195 455,205 470,230', 'M590,180 C570,200 560,215 545,236',
  'M720,130 C760,128 790,140 815,150', 'M380,72 C350,60 330,58 300,62', 'M640,90 C660,70 690,62 720,64',
]

export default function Roots() {
  const calm = useCalm()
  const root = useRef(null)
  useLayoutEffect(() => {
    if (calm) return
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: '.roots-svg', start: 'top 80%', end: 'bottom 50%', scrub: 0.5 } })
        .fromTo('.root-main', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.08, ease: 'none' })
        .fromTo('.root-hair', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.05, ease: 'none' }, 0.5)
      gsap.from('.signal', { opacity: 0, y: 24, stagger: 0.12, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.signals', start: 'top 85%' } })
      gsap.from('.persona-col', { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.persona', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [calm])
  return (
    <section ref={root} id={c.id} className="ch ch--roots" data-tone={c.tone} data-ink={c.ink}>
      <ChapterHead c={c}>
        <p><span className="k">The brief.</span> {research.brief}</p>
      </ChapterHead>

      <div className="roots">
        <svg className="roots-svg" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          {ROOTS.map(d => <path key={d} className="root-main" d={d} pathLength="1" />)}
          {HAIRS.map(d => <path key={d} className="root-hair" d={d} pathLength="1" />)}
        </svg>
        <ol className="signals" aria-label="What the trend research pointed to">
          {research.signals.map(s => (
            <li key={s.tag} className="signal">
              <span className="signal-node" aria-hidden="true" />
              <p className="signal-tag">{s.tag}</p>
              <p className="signal-text">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="roots-src">{research.source}</p>
      </div>

      <h3 className="ch-sub">Who it is for</h3>
      <div className="persona">
        {research.persona.map(g => (
          <div key={g.title} className="persona-col">
            <p className="persona-k">{g.title}</p>
            <ul>{g.items.map(i => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="drawer drawer--dark">
        <Board item={boards.trend} />
        <Board item={boards.persona} />
      </div>
    </section>
  )
}
