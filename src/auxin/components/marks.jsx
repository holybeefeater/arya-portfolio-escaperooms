import { useEffect, useRef, useState } from 'react'
import { light } from '../lib/light'
import { useCalm } from './media'

// ─────────────────────────────────────────────────────────────────────────────
//  Marks made on the prints in Bloom, as the page draws them: a tailor's chalk,
//  thread, an editor's grease pencil, and what holds each print to the page.
//  The photographs underneath are never changed.
// ─────────────────────────────────────────────────────────────────────────────

import { smooth, loop, f } from '../../shared/draw'

export { smooth, loop }

// Drawing units per screen pixel, so strokes and words keep their size on a
// print of any size.
function useUnit(ref, width) {
  const [u, setU] = useState(1)
  useEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(() => { if (el.clientWidth) setU(width / el.clientWidth) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return u
}

// Drawn once in view (at once under reduced motion); brighter as the visitor's
// light comes near.
export function useDrawn(ref) {
  const calm = useCalm()
  const [drawn, setDrawn] = useState(calm)
  useEffect(() => {
    const el = ref.current
    if (calm) { setDrawn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    const off = light.subscribe(s => {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const d = Math.hypot(s.x - (r.left + r.width / 2), s.y - (r.top + r.height / 2))
      el.style.setProperty('--near', Math.max(0, 1 - d / Math.max(360, r.width)).toFixed(2))
    })
    return () => { io.disconnect(); off() }
  }, [calm])
  return drawn
}

// One mark: its strokes, and the word written beside it (kept apart, so the
// chalk's grain never eats the words).
function mark(m, i, W, H, u) {
  const P = ([x, y]) => [x * W, y * H]
  const word = (x, y, text, anchor = 'start', rot = 0) => text ? (
    <text key={`w${i}`} className="mark-word" x={f(x)} y={f(y)} textAnchor={anchor} transform={rot ? `rotate(${f(rot)} ${f(x)} ${f(y)})` : undefined} style={{ '--i': i }}>{text}</text>
  ) : null
  const draw = (d, k = 0) => <path key={`d${i}.${k}`} className="draw" pathLength="1" d={d} style={{ '--i': i + k * 0.3 }} />
  if (m.circle) {
    const [x, y, rx, ry] = m.circle
    const [lx, ly] = P(m.at || [x + rx, y - ry])
    return { ink: draw(loop(x * W, y * H, rx * W, ry * H, i + 1)), word: word(lx, ly, m.label) }
  }
  if (m.line) {
    const [lx, ly] = P(m.at || m.line[m.line.length - 1])
    return { ink: draw(smooth(m.line.map(P))), word: word(lx, ly, m.label) }
  }
  if (m.measure) {
    const [[x1, y1], [x2, y2]] = m.measure.map(P)
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux
    const n = 12, ticks = []
    for (let k = 0; k <= n; k++) {
      const l = (k === 0 || k === n ? 11 : k % 3 ? 4 : 7) * u
      const cx = x1 + (x2 - x1) * k / n, cy = y1 + (y2 - y1) * k / n
      ticks.push(<path key={`t${i}.${k}`} className="tick" d={`M${f(cx - nx * l)},${f(cy - ny * l)} L${f(cx + nx * l)},${f(cy + ny * l)}`} style={{ '--k': k }} />)
    }
    let ang = Math.atan2(uy, ux) * 180 / Math.PI
    if (ang >= 90) ang -= 180
    if (ang < -90) ang += 180
    return {
      ink: [draw(`M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}`), ...ticks],
      word: word((x1 + x2) / 2 + nx * 16 * u, (y1 + y2) / 2 + ny * 16 * u, m.label, 'middle', ang),
    }
  }
  if (m.brackets) {
    const [x0, y0, x1, y1] = [m.brackets[0] * W, m.brackets[1] * H, m.brackets[2] * W, m.brackets[3] * H]
    const L = Math.min(x1 - x0, y1 - y0) * 0.24
    return { ink: [`M${f(x0)},${f(y0 + L)} L${f(x0)},${f(y0)} L${f(x0 + L)},${f(y0)}`, `M${f(x1 - L)},${f(y0)} L${f(x1)},${f(y0)} L${f(x1)},${f(y0 + L)}`,
      `M${f(x1)},${f(y1 - L)} L${f(x1)},${f(y1)} L${f(x1 - L)},${f(y1)}`, `M${f(x0 + L)},${f(y1)} L${f(x0)},${f(y1)} L${f(x0)},${f(y1 - L)}`].map(draw), word: null }
  }
  return { ink: null, word: null }
}

// Marks over one print, in the print's own proportions (`ar`, width / height).
export function Marks({ marks, ar, tool }) {
  const ref = useRef(null)
  const W = 1000, H = W / ar
  const u = useUnit(ref, W)
  const isDrawn = useDrawn(ref)
  const drawn = marks.map((m, i) => mark(m, i, W, H, u))
  return (
    <svg ref={ref} className={`marks marks--${tool} ${isDrawn ? 'is-drawn' : ''}`} viewBox={`0 0 ${W} ${f(H)}`} preserveAspectRatio="none" aria-hidden="true" style={{ '--u': u }}>
      <g className="marks-ink">
        {/* the whole print, so the ink's filter has room even for a straight line */}
        <rect width={W} height={f(H)} fill="none" />
        {drawn.map(d => d.ink)}
      </g>
      {drawn.map(d => d.word)}
    </svg>
  )
}

// How a print is held to the page: dressmaker's pins, cross-stitches through
// punched holes, brass rivets ("hardware as nodes") or masking tape.
export function Fix({ kind }) {
  if (!kind) return null
  const n = kind === 'pins' || kind === 'tape' ? 2 : 4
  return <span className={`fix fix--${kind}`} aria-hidden="true">{Array.from({ length: n }, (_, k) => <span key={k} className={`fx fx-${k}`} />)}</span>
}

// Two crops side by side, sewn together across the gap with cross-stitches.
// The row is drawn 100 wide; each crop is 48 wide and 60 tall (4:5).
export function Seam() {
  const ref = useRef(null)
  const u = useUnit(ref, 100)
  const drawn = useDrawn(ref)
  const rows = [8, 17, 26, 35, 44, 53]
  return (
    <svg ref={ref} className={`seam ${drawn ? 'is-drawn' : ''}`} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true" style={{ '--u': u }}>
      {rows.map((y, k) => (
        <g key={y} style={{ '--k': k }}>
          <path d={`M45,${y - 2.4} L55,${y + 2.4} M45,${y + 2.4} L55,${y - 2.4}`} />
          {[[45, y - 2.4], [55, y + 2.4], [45, y + 2.4], [55, y - 2.4]].map(([x, yy]) => <circle key={`${x},${yy}`} cx={x} cy={yy} r={1.5 * u} />)}
        </g>
      ))}
    </svg>
  )
}

// A running stitch across a whole spread (100 wide, `h` tall), sewn as the
// spread scrolls by (Bloom sets --p); a third value of 1 marks a hole.
export function Thread({ points, h }) {
  const ref = useRef(null)
  const u = useUnit(ref, 100)
  const d = smooth(points)
  return (
    <svg ref={ref} className="thread" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true" style={{ '--u': u }}>
      <path className="thread-shade" d={d} />
      <path className="thread-line" d={d} />
      {points.filter(p => p[2]).map(([x, y]) => <circle key={`${x},${y}`} className="thread-hole" cx={x} cy={y} r={2.6 * u} />)}
    </svg>
  )
}

// An editor's grease-pencil ring around a frame number: chosen.
export function Select() {
  return <svg className="select" viewBox="0 0 64 34" aria-hidden="true"><path pathLength="1" d={loop(32, 17, 28, 13, 3)} /></svg>
}
