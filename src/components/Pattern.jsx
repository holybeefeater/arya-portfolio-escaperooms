import { useState } from 'react'
import { url } from '../lib/asset'

// The jacket's pattern as a general dotted outline, laid out like a marker.
// Pointing at a piece fills it with the leather it is cut from.
const W = 78, H = 27.5

function Grain({ dir, w, h }) {
  const a = dir === 'h'
    ? { x1: w * 0.25, y1: h / 2, x2: w * 0.75, y2: h / 2 }
    : { x1: w / 2, y1: h * 0.3, x2: w / 2, y2: h * 0.72 }
  return <line className="pt-grain" {...a} markerStart="url(#pt-arrow)" markerEnd="url(#pt-arrow)" />
}

export default function Pattern({ pattern }) {
  const [on, setOn] = useState(null)
  const [all, setAll] = useState(false)
  const shown = on && pattern.pieces.find(p => p.name === on)
  return (
    <figure className="pt">
      <svg className="pt-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Pattern pieces of the jacket">
        <defs>
          <pattern id="pt-nappa" patternUnits="userSpaceOnUse" width="10" height="10">
            <image href={url('assets/shoot/tex-nappa.webp')} width="10" height="10" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="pt-suede" patternUnits="userSpaceOnUse" width="8" height="8">
            <image href={url('assets/shoot/tex-suede.webp')} width="8" height="8" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <marker id="pt-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="pt-arrowhead" />
          </marker>
        </defs>
        {pattern.pieces.flatMap(p => Array.from({ length: p.repeat || 1 }, (_, k) => {
          const lit = all || on === p.name
          const box = p.name === 'Strap' ? [1.2, 5.4] : p.name === 'Back' ? [22.4, 25] : p.name === 'Front' ? [11.2, 25] : p.name === 'Sleeve' ? [16, 15] : p.name === 'Cuff' ? [14, 4] : p.name === 'Standing collar' ? [17, 3.8] : [19, 2.6]
          return (
            <g key={p.name + k} className={`pt-piece ${lit ? 'is-on' : ''}`} transform={`translate(${p.at[0] + k * (p.step || 0)} ${p.at[1]})`}
              tabIndex={k ? -1 : 0} role="button" aria-label={`${p.name}: ${p.cut}, ${pattern.materials[p.mat]}`} aria-pressed={on === p.name}
              onMouseEnter={() => setOn(p.name)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(p.name)} onBlur={() => setOn(null)}
              onClick={() => setOn(o => (o === p.name ? null : p.name))}>
              <path d={p.d} className="pt-fill" style={{ fill: `url(#pt-${p.mat})` }} />
              <path d={p.d} className="pt-cut" />
              {!p.repeat && <Grain dir={p.grain} w={box[0]} h={box[1]} />}
              {!p.repeat && <text className="pt-name" x={box[0] / 2} y={p.grain === 'h' ? box[1] / 2 - 0.35 : box[1] * 0.2} textAnchor="middle">{p.name}</text>}
              {!p.repeat && p.grain === 'v' && <text className="pt-cutnote" x={box[0] / 2} y={box[1] * 0.2 + 1.2} textAnchor="middle">{p.cut}</text>}
            </g>
          )
        }))}
        <text className="pt-name" x={57.6} y={21.2}>Straps</text>
        <text className="pt-cutnote" x={57.6} y={22.4}>Cut 6</text>
      </svg>
      <figcaption className="pt-cap">
        <span className="pt-read" aria-live="polite">
          {shown ? <><strong>{shown.name}</strong> · {shown.cut} · {pattern.materials[shown.mat]}</> : pattern.note}
        </span>
        <button type="button" className="pt-all" aria-pressed={all} onClick={() => setAll(v => !v)}>{all ? 'Show the outline' : 'Fill every piece'}</button>
      </figcaption>
    </figure>
  )
}
