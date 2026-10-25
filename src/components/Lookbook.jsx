import { useEffect, useRef, useState } from 'react'
import { useScroll } from '../lib/scroll'
import { url } from '../lib/asset'
import { loop, smooth, f } from '../shared/draw'
import { lookbook } from '../content'

// ─────────────────────────────────────────────────────────────────────────────
//  The shoot, as a way out of the Backrooms: three levels, each with its own
//  light. The visitor's pointer is a torch: where it falls, the photograph is
//  seen as it is. Marks are drawn over the photographs by the page; the
//  photographs themselves are never changed, and open untouched when clicked.
// ─────────────────────────────────────────────────────────────────────────────

const place = it => ({ '--x': it.at[0], '--y': it.at[1], '--w': it.at[2], '--rot': `${it.rot || 0}deg`, '--mw': it.m[0] })

// pointer position, for every torch on the page (mouse and pen only)
const torch = { x: -9999, y: -9999, fns: new Set() }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return
    torch.x = e.clientX; torch.y = e.clientY
    torch.fns.forEach(fn => fn())
  }, { passive: true })
}

function useTorch(ref, on) {
  useEffect(() => {
    if (!on) return
    const el = ref.current
    const set = () => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--tx', `${(torch.x - r.left).toFixed(0)}px`)
      el.style.setProperty('--ty', `${(torch.y - r.top).toFixed(0)}px`)
    }
    torch.fns.add(set)
    window.addEventListener('scroll', set, { passive: true })
    return () => { torch.fns.delete(set); window.removeEventListener('scroll', set) }
  }, [on])
}

function useSeen(ref, calm) {
  const [seen, setSeen] = useState(calm)
  useEffect(() => {
    if (calm) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [calm])
  return seen
}

// Marks drawn over a photograph in exit-sign green: loops, arrows, a measured
// length, and lettered hazard tape.
function Marks({ marks, ar, calm }) {
  const ref = useRef(null)
  const seen = useSeen(ref, calm)
  const W = 1000, H = W / ar
  const P = ([x, y]) => [x * W, y * H]
  const word = (x, y, text, k, anchor = 'start', rot = 0) => text && (
    <text key={`w${k}`} className="lb-word" x={f(x)} y={f(y)} textAnchor={anchor} transform={rot ? `rotate(${f(rot)} ${f(x)} ${f(y)})` : undefined} style={{ '--i': k }}>{text}</text>
  )
  const out = []
  marks.forEach((m, k) => {
    if (m.circle) {
      const [x, y, rx, ry] = m.circle
      out.push(<path key={k} className="lb-draw" pathLength="1" d={loop(x * W, y * H, rx * W, ry * H, k + 2)} style={{ '--i': k }} />)
      out.push(word(...P(m.at || [x + rx, y - ry]), m.label, k))
    } else if (m.arrow) {
      const pts = m.arrow.map(P), [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 2]
      const a = Math.atan2(ey - py, ex - px), L = 34
      out.push(<path key={k} className="lb-draw" pathLength="1" d={`${smooth(pts)} M${f(ex - L * Math.cos(a - 0.5))},${f(ey - L * Math.sin(a - 0.5))} L${f(ex)},${f(ey)} L${f(ex - L * Math.cos(a + 0.5))},${f(ey - L * Math.sin(a + 0.5))}`} style={{ '--i': k }} />)
      out.push(word(...P(m.at || m.arrow[0]), m.label, k))
    } else if (m.measure) {
      const [[x1, y1], [x2, y2]] = m.measure.map(P)
      const len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len, ny = (x2 - x1) / len
      out.push(<path key={k} className="lb-draw" pathLength="1" d={`M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}`} style={{ '--i': k }} />)
      for (let t = 0; t <= 10; t++) {
        const l = t === 0 || t === 10 ? 18 : t % 5 ? 7 : 12, cx = x1 + (x2 - x1) * t / 10, cy = y1 + (y2 - y1) * t / 10
        out.push(<path key={`${k}t${t}`} className="lb-tick" d={`M${f(cx - nx * l)},${f(cy - ny * l)} L${f(cx + nx * l)},${f(cy + ny * l)}`} />)
      }
      out.push(word((x1 + x2) / 2 - nx * 30, (y1 + y2) / 2 - ny * 30, m.label, k, 'middle', -90))
    }
  })
  return (
    <>
      <svg ref={ref} className={`lb-marks ${seen ? 'is-seen' : ''}`} viewBox={`0 0 ${W} ${f(H)}`} preserveAspectRatio="none" aria-hidden="true">{out}</svg>
      {marks.filter(m => m.tape).map(m => (
        <span key={m.label} className={`lb-tape ${seen ? 'is-seen' : ''}`} style={{ left: `${m.tape[0] * 100}%`, top: `${m.tape[1] * 100}%`, '--r': `${m.tape[2]}deg` }} aria-hidden="true">{m.label}</span>
      ))}
    </>
  )
}

// What the shoot's light does to a photograph: strip light or a camera feed,
// with true colour where the torch falls.
function Shot({ it, light, calm, no }) {
  const ref = useRef(null)
  useTorch(ref, !!light && !calm)
  const lit = light && !calm
  return (
    <a ref={ref} className={`lb-shot lb-shot--${light || 'clear'}`} href={url(it.src)} target="_blank" rel="noreferrer" aria-label={`Open full size: ${it.alt}`}>
      <span className="lb-img" style={{ aspectRatio: `${it.w} / ${it.h}` }}>
        <img src={url(it.src)} alt="" width={it.w} height={it.h} loading="lazy" decoding="async" />
        {lit && <img className="lb-filter" src={url(it.src)} alt="" loading="lazy" decoding="async" />}
        {light === 'cctv' && !calm && <span className="lb-feed" aria-hidden="true"><span>CAM {no}</span><span className="lb-rec">REC</span></span>}
      </span>
      {it.marks && <Marks marks={it.marks} ar={it.w / it.h} calm={calm} />}
      <span className="lb-tag" aria-hidden="true">{no} · {it.piece}</span>
    </a>
  )
}

function Level({ lv, calm }) {
  let k = 0
  return (
    <div id={lv.id} className={`lb-level lb-level--${lv.light || 'clear'}`} data-tone={lv.tone} data-ink={lv.ink} data-sign={lv.sign}>
      {lv.light === 'fluoro' && !calm && <span className="lb-hum" aria-hidden="true" />}
      <div className="lb-spread" style={{ '--h': lv.h }}>
        <header className="lb-item lb-head" style={place({ at: lv.head, m: [100, 'l'] })}>
          <p className="lb-sign"><span className="lb-sign-tape" aria-hidden="true" />{lv.sign}</p>
          <h3 className="lb-title"><span>{lv.title}</span></h3>
          <p className="lb-line">{lv.line}</p>
        </header>
        {lv.frames.map(it => {
          const no = `${lv.n}.${++k}`
          return (
            <figure key={it.src} className={`lb-item lb-m-${it.m[1]}`} style={place(it)}>
              <Shot it={it} light={lv.light} calm={calm} no={no} />
            </figure>
          )
        })}
      </div>
      {lv.exit && <Exit it={lv.exit} no={`${lv.n}.${++k}`} />}
    </div>
  )
}

// The last photograph, through the exit door, under a lit EXIT sign.
function Exit({ it, no }) {
  return (
    <figure className="lb-exit">
      <p className="lb-exit-sign" aria-hidden="true"><span className="lb-exit-man">⟶</span>EXIT</p>
      <a className="lb-door" href={url(it.src)} target="_blank" rel="noreferrer" aria-label={`Open full size: ${it.alt}`}>
        <img src={url(it.src)} alt="" width={it.w} height={it.h} loading="lazy" decoding="async" />
      </a>
      <figcaption className="lb-exit-cap">{no} · {it.piece}</figcaption>
    </figure>
  )
}

export default function Lookbook() {
  const { calm } = useScroll()
  return (
    <section id="shoot" className="room lookbook">
      <header className="lb-intro" data-tone={lookbook.levels[0].tone} data-ink="dark" data-sign={lookbook.levels[0].sign}>
        <h2 className="display lb-h">{lookbook.title}</h2>
        <p className="lead">{lookbook.line}</p>
      </header>
      {/* yellow-green strip light, and a green camera feed */}
      <svg width="0" height="0" className="lb-defs" aria-hidden="true" focusable="false">
        <filter id="er-fluoro" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.16 0.62 0.96" />
            <feFuncG type="table" tableValues="0.18 0.66 0.95" />
            <feFuncB type="table" tableValues="0.06 0.22 0.55" />
          </feComponentTransfer>
        </filter>
        <filter id="er-cctv" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.02 0.1 0.62" />
            <feFuncG type="table" tableValues="0.06 0.5 0.98" />
            <feFuncB type="table" tableValues="0.04 0.2 0.6" />
          </feComponentTransfer>
        </filter>
      </svg>
      {lookbook.levels.map(lv => <Level key={lv.id} lv={lv} calm={calm} />)}
    </section>
  )
}
