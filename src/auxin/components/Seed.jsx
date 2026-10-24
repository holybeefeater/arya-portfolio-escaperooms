import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterHead } from './chrome'
import { Board, useCalm } from './media'
import { light } from '../lib/light'
import { chapters, collection, brainstorm, boards } from '../content'

gsap.registerPlugin(ScrollTrigger)
const c = chapters[0]

// Her brainstorm page, redrawn as a stem that grows from the root to the light.
const VB = { w: 640, h: 780 }
const ROOT = { x: 320, y: 730 }, TOP_Y = 118
const PAIRS = [0.3, 0.56, 0.8] // where each pair of branches leaves the stem, from the root up
const REACH = 230

function stemPoint(t, lean) {
  // cubic from the root to the top; the top half follows the light
  const p0 = [ROOT.x, ROOT.y], p1 = [ROOT.x, ROOT.y - (ROOT.y - TOP_Y) * 0.45]
  const p2 = [ROOT.x + lean * 0.5, TOP_Y + (ROOT.y - TOP_Y) * 0.3], p3 = [ROOT.x + lean, TOP_Y]
  const u = 1 - t
  const f = i => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]
  return [f(0), f(1)]
}

function Brainstorm() {
  const calm = useCalm()
  const svg = useRef(null)
  useEffect(() => {
    const el = svg.current
    const stem = el.querySelector('.bs-stem')
    const branches = [...el.querySelectorAll('.bs-branch')]
    const topNote = el.querySelector('.bs-top')
    let lastLean = null
    const draw = s => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const lean = calm || !s ? 0 : Math.max(-70, Math.min(70, (s.x - cx) * 0.09))
      if (lastLean !== null && Math.abs(lean - lastLean) < 0.3) return
      lastLean = lean
      const pts = Array.from({ length: 25 }, (_, i) => stemPoint(i / 24, lean))
      stem.setAttribute('d', 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L'))
      branches.forEach(b => {
        const t = PAIRS[+b.dataset.pair], side = +b.dataset.side
        const [x, y] = stemPoint(t, lean)
        const tx = ROOT.x + side * REACH, ty = y + 40
        b.setAttribute('d', `M${x.toFixed(1)},${y.toFixed(1)} C${(x + side * 90).toFixed(1)},${(y - 34).toFixed(1)} ${(tx - side * 70).toFixed(1)},${(ty - 40).toFixed(1)} ${tx},${ty}`)
      })
      const [tx, ty] = stemPoint(1, lean)
      topNote.setAttribute('transform', `translate(${tx.toFixed(1)} ${(ty - 26).toFixed(1)})`)
    }
    draw(null)
    return light.subscribe(draw)
  }, [calm])

  const tipY = i => stemPoint(PAIRS[i], 0)[1] + 40
  return (
    <svg ref={svg} className="bs" viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-labelledby="bs-title bs-desc">
      <title id="bs-title">Brainstorm, drawn as a stem from the root to the light</title>
      <desc id="bs-desc">
        From “{brainstorm.root}” up to “{brainstorm.top}”. Branches, from the bottom: {brainstorm.branches.map(p => p.join(' and ')).join('; ')}.
        Notes: {brainstorm.notes.flat().join(', ')}.
      </desc>
      <path className="bs-stem" pathLength="1" />
      {brainstorm.branches.map((pair, i) => pair.map((word, s) => {
        const side = s ? 1 : -1
        return (
          <g key={word} className={`bs-pair bs-pair-${i}`}>
            <path className="bs-branch" data-pair={i} data-side={side} pathLength="1" />
            <circle className="bs-node" cx={ROOT.x + side * REACH} cy={tipY(i)} r="4.5" />
            <text className="bs-word" x={ROOT.x + side * (REACH + 4)} y={tipY(i) + 34} textAnchor={side < 0 ? 'start' : 'end'}>{word}</text>
          </g>
        )
      }))}
      {brainstorm.notes.map((pair, i) => pair.map((note, s) => (
        <text key={note} className={`bs-note bs-note-${i}`} x={s ? VB.w - 22 : 22} y={(tipY(i) + tipY(i + 1)) / 2 - 12} textAnchor={s ? 'end' : 'start'}>{note}</text>
      )))}
      <g className="bs-top">
        <ellipse className="bs-ring" rx="138" ry="30" />
        <text className="bs-top-word" textAnchor="middle" y="9">{brainstorm.top}</text>
      </g>
      <text className="bs-root" x={ROOT.x} y={ROOT.y + 36} textAnchor="middle">{brainstorm.root}</text>
    </svg>
  )
}

export default function Seed() {
  const calm = useCalm()
  const stage = useRef(null)
  useLayoutEffect(() => {
    if (calm) return
    const q = gsap.utils.selector(stage)
    const build = () => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo(q('.bs-stem'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7 }, 0)
        .from(q('.bs-root'), { opacity: 0, y: 10, duration: 0.08 }, 0)
      PAIRS.forEach((_, i) => {
        const at = 0.12 + i * 0.17
        tl.fromTo(q(`.bs-pair-${i} .bs-branch`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.14 }, at)
          .from(q(`.bs-pair-${i} .bs-node, .bs-pair-${i} .bs-word`), { opacity: 0, y: 8, duration: 0.08, stagger: 0.02 }, at + 0.08)
        if (i < 2) tl.from(q(`.bs-note-${i}`), { opacity: 0, duration: 0.08 }, at + 0.14)
      })
      tl.from(q('.bs-top'), { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.1 }, 0.66)
        .to({}, { duration: 0.24 })
      return tl
    }
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      ScrollTrigger.create({ trigger: stage.current, start: 'top 12%', end: '+=140%', pin: true, scrub: 0.6, anticipatePin: 1, animation: build() })
    })
    mm.add('(max-width: 899px)', () => {
      ScrollTrigger.create({ trigger: q('.bs')[0], start: 'top 85%', end: 'bottom 45%', scrub: 0.6, animation: build() })
    })
    return () => mm.revert()
  }, [calm])

  return (
    <section id={c.id} className="ch ch--seed" data-tone={c.tone} data-ink={c.ink}>
      <div ref={stage} className="seed-stage">
        <div className="seed-copy">
          <ChapterHead c={c}>
            <p>{collection.what}</p>
            <p>{collection.idea}</p>
          </ChapterHead>
          <blockquote className="seed-quote">
            <p>{collection.premise}</p>
          </blockquote>
        </div>
        <figure className="seed-figure">
          <Brainstorm />
        </figure>
      </div>
      <div className="drawer">
        <Board item={boards.moodboard} />
        <Board item={boards.inspiration} />
        <Board item={boards.brainstorm} className="drawer-small" />
      </div>
    </section>
  )
}
