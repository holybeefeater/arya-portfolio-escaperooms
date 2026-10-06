import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScroll } from '../lib/scroll'
import { useReveal } from '../lib/stretch'
import { progress } from '../lib/progress'
import { sound } from '../lib/sound'
import { Plate } from './parts'
import { bomTotal, rupees, materialQuote } from '../content'

gsap.registerPlugin(ScrollTrigger)

// ── Jacket: "follow the line". A saddle-stitch line sews itself from marker to
// marker as you scroll past the jacket. Reaching the hem finds the first key.
const ORDER = ['Standing dual-tone collar', 'Antique-finish rivets', 'Antique-finish buckle closure', 'Belt-strap closure', 'Contrast panelling at the hem', 'Cuff-accented half sleeve']

function smooth(points) {
  // Catmull-Rom through every point, as cubic Béziers
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

export function StitchLine({ hotspots, w, h, pad, trigger, onPass }) {
  const { ready, calm } = useScroll()
  const svg = useRef(null), reveal = useRef(null), needle = useRef(null)
  const pts = ORDER.map(l => hotspots.find(s => s.label === l)).filter(Boolean)
    .map(s => [(pad + s.x * (1 - 2 * pad)) * w, (pad + s.y * (1 - 2 * pad)) * h])
  const d = smooth(pts)
  const marks = pts.map((p, i) => ({ at: i / (pts.length - 1), label: ORDER[i] }))

  useLayoutEffect(() => {
    if (!ready) return
    const path = reveal.current
    const total = path.getTotalLength()
    let passed = -1
    const set = p => {
      path.style.strokeDashoffset = String(1 - p)
      const pt = path.getPointAtLength(total * p)
      needle.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      needle.current.style.opacity = p > 0.001 && p < 0.999 ? 1 : 0
      const n = marks.filter(m => p >= m.at - 0.01).length
      if (n !== passed) { passed = n; onPass?.(marks.slice(0, n).map(m => m.label)) }
    }
    if (calm) {
      set(1)
      const st = ScrollTrigger.create({ trigger: trigger.current, start: 'bottom 85%', onEnter: () => progress.key('jacket') })
      return () => st.kill()
    }
    set(0)
    const st = ScrollTrigger.create({
      trigger: trigger.current,
      start: 'top 65%',
      end: 'bottom 75%',
      scrub: 0.6,
      onUpdate: self => {
        set(self.progress)
        if (self.progress > 0.985) progress.key('jacket')
      },
    })
    return () => st.kill()
  }, [ready, calm])

  return (
    <svg ref={svg} className="stitchline" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <mask id="stitch-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <path ref={reveal} d={d} pathLength="1" fill="none" stroke="#fff" strokeWidth="40" strokeDasharray="1 1" strokeDashoffset="1" strokeLinecap="round" />
        </mask>
      </defs>
      <g mask="url(#stitch-mask)">
        <path d={d} fill="none" className="stitchline-shadow" />
        <path d={d} fill="none" className="stitchline-thread" />
      </g>
      <g ref={needle} className="stitchline-needle" style={{ opacity: 0 }}>
        <circle r="13" />
        <circle r="5" />
      </g>
    </svg>
  )
}

// ── Duffle: five ways to carry it, as wayfinding pictograms.
const FIG = {
  head: <circle cx="50" cy="15" r="9" />,
  body: 'M50 28 V80 M50 80 L39 132 M50 80 L61 132',
}
const POSES = {
  duffle: {
    arms: 'M50 36 L37 58 L35 82 M50 36 L64 58 L68 80',
    bag: <><path d="M60 92 L68 81 L76 92" className="pic-strap" /><rect x="54" y="92" width="38" height="22" rx="6" className="pic-bag" /></>,
  },
  tophandle: {
    arms: 'M50 36 L37 58 L35 82 M50 36 L66 54 L58 70',
    bag: <><path d="M49 80 Q57 64 64 80" className="pic-strap" /><rect x="40" y="79" width="33" height="26" rx="5" className="pic-bag" /></>,
  },
  backpack: {
    profile: true,
    arms: 'M54 36 L60 58 L57 80',
    bag: <><rect x="22" y="32" width="20" height="40" rx="5" className="pic-bag" /><path d="M40 35 Q50 26 55 34 M40 66 Q48 70 52 64" className="pic-strap" /></>,
  },
  shoulder: {
    arms: 'M50 36 L37 58 L35 82 M50 36 L66 58 L70 80',
    bag: <><path d="M58 32 L66 58" className="pic-strap" /><rect x="58" y="56" width="26" height="22" rx="5" className="pic-bag" /></>,
  },
  crossbody: {
    arms: 'M50 36 L37 58 L35 82 M50 36 L64 58 L66 80',
    bag: <><path d="M60 32 L32 70" className="pic-strap" /><rect x="16" y="66" width="26" height="20" rx="5" className="pic-bag" /></>,
  },
}

export function Pictogram({ mode, className = '' }) {
  const p = POSES[mode]
  return (
    <svg className={`pictogram ${className}`} viewBox="0 0 100 140" aria-hidden="true">
      {p.bag}
      <g className="pic-figure">
        {p.profile ? <circle cx="54" cy="15" r="9" /> : FIG.head}
        <path d={p.profile ? 'M52 28 V80 M52 80 L44 132 M52 80 L60 132' : FIG.body} />
        <path d={p.arms} />
      </g>
    </svg>
  )
}

export function CarryModes({ modes, name = 'Duffle' }) {
  const [mode, setMode] = useState(modes[0].id)
  const m = modes.find(x => x.id === mode)
  const pick = id => { if (id !== mode) { setMode(id); sound.play('click') } }
  return (
    <div className="carry">
      <div className="carry-copy">
        <h3 className="craft-h">One {name.toLowerCase()}, five ways to carry it</h3>
        <p className="lead">The same bag moves from the hand to the shoulder to the back: detachable handles, a long strap, dogtooth hooks and base rings.</p>
        <div className="carry-tabs" role="radiogroup" aria-label={`${name} carry modes`}>
          {modes.map((x, i) => (
            <button key={x.id} type="button" role="radio" aria-checked={x.id === mode} className="carry-tab" onClick={() => pick(x.id)}>
              <Pictogram mode={x.id} className="carry-mini" />
              <span><span className="carry-n">{i + 1}</span>{x.label}</span>
            </button>
          ))}
        </div>
      </div>
      <figure className="carry-stage" aria-live="polite">
        <div className="carry-sign">
          <Pictogram mode={mode} key={mode} className="carry-big" />
        </div>
        <figcaption><strong>{m.label}.</strong> {m.how}</figcaption>
      </figure>
    </div>
  )
}

export function DayWithBag({ day }) {
  const ref = useRef(null)
  useReveal(ref, '--p', { start: 'top 80%', end: 'bottom 70%' })
  return (
    <div ref={ref} className="day">
      <h3 className="craft-h">A day with the bags</h3>
      <p className="day-intro">The consumer in the brief moves between college, work, cafés and studios. Here is one day, imagined from that brief, and what each stop asks of the bag.</p>
      <ol className="day-line">
        {day.map((s, i) => (
          <li key={s.time} className="day-stop" style={{ '--i': i, '--n': day.length }}>
            <span className="day-time">{s.time}</span>
            <span className="day-dot" aria-hidden="true" />
            <Pictogram mode={s.mode} className="day-pic" />
            <span className="day-place">{s.place}</span>
            <span className="day-bag">{s.bag}, {s.mode === 'tophandle' ? 'top handle' : s.mode}</span>
            <span className="day-why">{s.why}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── Nesting: the duffle's pieces laid onto a section of hide, with the yield.
const HIDE = 'M-6 4 C-9 -10 10 -9 24 -7 C40 -4 60 -9 78 -6 C92 -4 101 -2 99 12 C97 30 102 50 98 66 C96 79 92 85 74 84 C56 82 40 88 22 84 C6 81 -8 86 -7 70 C-6 52 -10 30 -6 4 Z'

export function Nesting({ nesting }) {
  const ref = useRef(null)
  useReveal(ref, '--p', { start: 'top 75%', end: 'center 45%' })
  const area = nesting.pieces.reduce((s, [, , , w, h]) => s + w * h, 0) / 100
  const yieldPct = Math.round((area / nesting.allowance) * 100)
  const spare = nesting.allowance - area
  const n = nesting.pieces.length
  return (
    <div ref={ref} className="nest">
      <div className="nest-copy">
        <h3 className="craft-h">Cutting the {nesting.bag.toLowerCase()}</h3>
        <blockquote className="nest-quote">
          <p>“{materialQuote}”</p>
          <cite>Aditi, on her internship</cite>
        </blockquote>
        <dl className="nest-stats">
          <div><dt>Pieces</dt><dd>{n}</dd></div>
          <div><dt>Leather in the pieces</dt><dd>{area.toFixed(1)} dm²</dd></div>
          <div><dt>Suede on her bill of materials</dt><dd>{nesting.allowance} dm²</dd></div>
          <div className="nest-yield"><dt>Yield</dt><dd>{yieldPct}%</dd></div>
        </dl>
        <p className="caption">A nesting study drawn from the {nesting.bag.toLowerCase()}’s finished size, with 1 cm seam allowance. The other {spare.toFixed(1)} dm² covers flaws, stretch direction and the loss between cuts.</p>
      </div>
      <svg className="nest-svg" viewBox="-12 -14 118 106" role="img" aria-label={`${n} pattern pieces nested on a section of olive suede, ${yieldPct}% yield`}>
        <path d={HIDE} className="nest-hide" />
        <path d={HIDE} className="nest-hide-edge" />
        {nesting.pieces.map(([name, x, y, w, h], i) => (
          <g key={i} className="nest-piece" style={{ '--i': i, '--n': n }}>
            <rect x={x} y={y} width={w} height={h} rx="0.6" />
            <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx="0.3" className="nest-seam" />
            <text x={x + w / 2} y={y + h / 2} transform={h > w * 1.6 ? `rotate(-90 ${x + w / 2} ${y + h / 2})` : undefined}>{name}</text>
          </g>
        ))}
        <g className="nest-scale" transform="translate(0 92)">
          <path d="M0 0 H50 M0 -1.4 V1.4 M50 -1.4 V1.4" />
          <text x="25" y="-2.2">50 cm</text>
        </g>
      </svg>
    </div>
  )
}

// ── Material passport: one card per hide, only with facts from her sheets.
const PASSPORT_ROWS = [['hide', 'Hide'], ['grain', 'Grain'], ['finish', 'Finish'], ['tannage', 'Tannage'], ['thickness', 'Thickness'], ['use', 'Used for'], ['area', 'Area cut'], ['pairs', 'Paired with'], ['source', 'Source']]

export function HidePassport({ hides }) {
  return (
    <div className="passport">
      <h2 className="brief-h">Material passport</h2>
      <ul className="passport-cards">
        {hides.map((h, i) => (
          <li key={h.id} className="passport-card">
            <div className="passport-top">
              <span className="passport-swatch" style={{ '--c': h.swatch }} aria-hidden="true" />
              <div>
                <p className="passport-no">Hide {String(i + 1).padStart(2, '0')} · {h.from}</p>
                <h3 className="passport-name">{h.label}</h3>
              </div>
            </div>
            <dl className="passport-rows">
              {PASSPORT_ROWS.filter(([k]) => h.passport?.[k]).map(([k, label]) => (
                <div key={k}><dt>{label}</dt><dd>{h.passport[k]}</dd></div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Costing to retail: material cost from each bill of materials, and the retail
// price at a chosen markup (or Aditi's own retail price where she has set one).
export function Costing({ items }) {
  const [m, setM] = useState(4)
  return (
    <div className="costing">
      <div className="costing-head">
        <h3 className="craft-h">From material cost to shelf price</h3>
        <div className="costing-pick" role="radiogroup" aria-label="Markup on material cost">
          <span>Markup</span>
          {[3, 4, 5].map(x => (
            <button key={x} type="button" role="radio" aria-checked={m === x} onClick={() => setM(x)}>{x}×</button>
          ))}
        </div>
      </div>
      <table className="costing-table" style={{ '--max': Math.max(...items.map(it => it.retail || bomTotal(it.bom) * m)) }}>
        <thead><tr><th scope="col">Piece</th><th scope="col">Material</th><th scope="col">Retail</th><th scope="col" className="costing-bar-h"><span className="sr-only">Proportion</span></th></tr></thead>
        <tbody>
          {items.map(it => {
            const cost = bomTotal(it.bom)
            const retail = it.retail || Math.round((cost * m) / 50) * 50
            return (
              <tr key={it.name}>
                <th scope="row">{it.name}</th>
                <td>{rupees(cost)}</td>
                <td>{rupees(retail)}{it.retail ? <span className="costing-own"> her price, {(it.retail / cost).toFixed(1)}×</span> : null}</td>
                <td className="costing-bar"><span style={{ '--r': retail, '--c': cost }} aria-hidden="true" /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="caption">Material cost is the sum of each bill of materials. Retail is indicative, at a {m}× markup rounded to ₹50, unless a price of her own is shown. Each bar is the retail price, against the dearest piece; the dark part is the material.</p>
    </div>
  )
}

// ── Making: short clips of hands at work. Hidden until clips are added in content.js.
export function Making({ clips }) {
  if (!clips?.length) return null
  return (
    <div className="making">
      <h2 className="brief-h">At the bench</h2>
      <ul className="making-grid">
        {clips.map(c => (
          <li key={c.src}>
            <Plate kind="film" film={c.src} poster={c.poster} alt={c.label} ratio="4 / 5" w={800} h={1000} />
            <p className="caption">{c.label}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
