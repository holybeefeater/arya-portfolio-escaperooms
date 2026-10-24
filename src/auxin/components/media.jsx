import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { img, url } from '../lib/asset'
import { light } from '../lib/light'
import { isGap, rupees, sum } from '../content'

export const Calm = createContext(false)
export const useCalm = () => useContext(Calm)

// A picture from public/assets/auxin/img/, both sizes offered to the browser.
export function Pic({ name, alt = '', sizes = '(min-width: 900px) 50vw, 100vw', className = '', eager, style }) {
  const i = img(name)
  return (
    <img
      className={className} src={i.src} srcSet={i.srcSet} sizes={i.srcSet ? sizes : undefined}
      width={i.width} height={i.height} alt={alt} style={style}
      loading={eager ? 'eager' : 'lazy'} decoding="async"
    />
  )
}

// Turns to face the light, as a leaf does: the face tilts toward the pointer, a
// sheen sits where the light falls, and a cut-out's shadow drops away from it.
export function Lean({ children, max = 8, cutout = false, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const calm = useCalm()
  useEffect(() => (calm ? undefined : light.addLeaner(ref.current, { max })), [calm, max])
  return (
    <Tag ref={ref} className={`lean ${cutout ? 'lean--cutout' : ''} ${className}`} {...rest}>
      <div className="lean-body">
        {children}
        {!cutout && <span className="lean-sheen" aria-hidden="true" />}
      </div>
    </Tag>
  )
}

// A photograph that moves. With `video` (her own footage) it plays that; until
// then it plays `loop`, a slow camera move over the same photograph. It plays
// only while on screen, never under reduced motion, and can always be paused.
export function Living({ name, alt, loop, video, sizes, className = '', label = true, eager }) {
  const calm = useCalm()
  const ref = useRef(null), vid = useRef(null)
  const [paused, setPaused] = useState(calm)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)
  const src = video || loop
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setSeen(true) }, { rootMargin: '200px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const v = vid.current
    if (!v) return
    if (inView && !paused) v.play().catch(() => setPaused(true))
    else v.pause()
  }, [inView, paused])
  const i = img(name)
  return (
    <figure ref={ref} className={`living ${className}`}>
      <Lean>
        <div className="living-frame" style={{ aspectRatio: `${i.width} / ${i.height}` }}>
          <Pic name={name} alt={alt} sizes={sizes} eager={eager} />
          {src && seen && (
            <video
              ref={vid} className={`living-video ${paused ? '' : 'is-on'}`} src={url(src)} muted loop playsInline
              preload="metadata" aria-hidden="true" tabIndex={-1}
            />
          )}
        </div>
      </Lean>
      {src && (
        <button type="button" className="living-btn" aria-pressed={!paused} onClick={() => setPaused(p => !p)}>
          <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
          <span className="sr-only">{paused ? 'Play' : 'Pause'} the motion</span>
          {label && <span className="living-tag">{video ? 'Shoot video' : 'Moving still'}</span>}
        </button>
      )}
    </figure>
  )
}

// A photograph that opens full size, untreated, in the lightbox.
export function Shot({ item, sizes = '(min-width: 900px) 40vw, 100vw', className = '', caption, max = 5 }) {
  const open = useLightbox()
  const i = img(item.img)
  return (
    <figure className={`shot ${className}`}>
      <Lean max={max}>
        <button type="button" className="shot-btn" onClick={() => open({ img: item.img, alt: item.alt, caption: caption ?? item.caption ?? '' })} aria-label={`Open full size: ${item.alt}`}>
          <span className="shot-frame" style={{ aspectRatio: `${i.width} / ${i.height}` }}><Pic name={item.img} alt="" sizes={sizes} /></span>
        </button>
      </Lean>
      {(caption ?? item.caption) && <figcaption className="cap">{caption ?? item.caption}</figcaption>}
    </figure>
  )
}

// A photograph that fills its place in the layout, cropped by its frame; `focus`
// ([x, y], 0 to 1) is the point kept in view. It opens whole when clicked.
export function Fill({ item, sizes, className = '' }) {
  const open = useLightbox()
  const i = img(item.img)
  const [fx, fy] = item.focus || [0.5, 0.5]
  return (
    <figure className={`fill ${className}`} style={{ '--ar': i.width / i.height }}>
      <Lean max={4}>
        <button type="button" className="shot-btn fill-btn" onClick={() => open({ img: item.img, alt: item.alt, caption: item.caption ?? '' })} aria-label={`Open full size: ${item.alt}`}>
          <Pic name={item.img} alt="" sizes={sizes} style={{ objectPosition: `${fx * 100}% ${fy * 100}%` }} />
        </button>
      </Lean>
    </figure>
  )
}

// Shown in her palette (Surf the Web, Teal, Green Eyes) until the visitor's
// light falls on it; where it falls, the photograph develops into colour.
// Under reduced motion it is simply shown in colour.
export function Develop({ name, sizes }) {
  const calm = useCalm()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (calm || !el) return
    return light.subscribe(s => {
      const r = el.getBoundingClientRect()
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return
      el.style.setProperty('--dx', `${(s.x - r.left).toFixed(0)}px`)
      el.style.setProperty('--dy', `${(s.y - r.top).toFixed(0)}px`)
    })
  }, [calm])
  return (
    <span ref={ref} className="develop">
      <Pic name={name} alt="" sizes={sizes} />
      {!calm && <Pic name={name} alt="" sizes={sizes} className="develop-duo" />}
    </span>
  )
}

// An extreme crop made at display time: the original is untouched.
export function Crop({ name, crop, sizes }) {
  return (
    <span className="crop">
      <Pic name={name} alt="" sizes={sizes} style={{ transformOrigin: `${crop.x * 100}% ${crop.y * 100}%`, transform: `scale(${crop.zoom})` }} />
    </span>
  )
}

// ── Proof: the plain-background photographs beside a specification ─────────
// A specification row with a link lights its point on the photograph; the
// other photographs step back, as the strips do in the hero.
const Proof = createContext(null)

export function ProofRoom({ children }) {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(null)
  const ref = useRef(null)
  const calm = useCalm()
  const api = {
    active: hover || pinned,
    pinned,
    show: v => setHover(v),
    pin: v => {
      const next = pinned?.label === v.label ? null : v
      setPinned(next)
      if (!next) return
      // on a phone the photographs sit above the table: bring the lit one into view
      const fig = ref.current?.querySelector(`[data-proof="${v.img}"]`)
      const r = fig?.getBoundingClientRect()
      if (r && (r.top < 70 || r.bottom > window.innerHeight)) fig.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' })
    },
  }
  return <Proof.Provider value={api}><div ref={ref} className="proof-room">{children}</div></Proof.Provider>
}

export function ProofGallery({ items, label }) {
  const proof = useContext(Proof)
  const open = useLightbox()
  const a = proof?.active
  return (
    <div className={`proof ${a ? 'is-pointing' : ''}`} role="group" aria-label={label}>
      {items.map(p => {
        const m = img(p.img)
        const on = a?.img === p.img
        return (
          <figure key={p.img} data-proof={p.img} className={`proof-item ${on ? 'is-on' : ''}`}>
            <div className="proof-plate">
              <button type="button" className="proof-box" style={{ '--ar': m.width / m.height, '--px': `${(on ? a.x : 0.5) * 100}%`, '--py': `${(on ? a.y : 0.5) * 100}%` }}
                onClick={() => open({ img: p.img, alt: p.alt, caption: p.label })} aria-label={`Open full size: ${p.alt}`}>
                <Pic name={p.img} alt="" sizes="(min-width: 900px) 22vw, 46vw" />
                <span className="proof-light" aria-hidden="true" />
                {on && <span className={`proof-node ${a.x > 0.6 ? 'is-flip' : ''}`} style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }} aria-hidden="true"><span className="proof-node-label">{a.label}</span></span>}
              </button>
            </div>
            <figcaption className="cap">{p.label}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}

// An honest empty frame where a photograph or film is still to come.
export function Slot({ label, note, ratio = '4 / 5', className = '' }) {
  return (
    <figure className={`slot ${className}`} style={{ aspectRatio: ratio }}>
      <span className="slot-corner" aria-hidden="true" />
      <figcaption>
        <span className="slot-label">{label}</span>
        <span className="slot-note">{note}</span>
      </figcaption>
    </figure>
  )
}

export function Gap({ v, className = '' }) {
  if (!isGap(v)) return v ?? null
  return <span className={`gap ${className}`}><span className="gap-k">To add:</span> {v.gap}</span>
}

// ── Lightbox for the deck's boards ─────────────────────────────────────────
const Box = createContext(() => {})
export const useLightbox = () => useContext(Box)

export function LightboxProvider({ children }) {
  const dlg = useRef(null)
  const back = useRef(null)
  const [item, setItem] = useState(null)
  const open = it => { back.current = document.activeElement; setItem(it) }
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (item && !d.open) d.showModal()
    if (!item && d.open) d.close()
  }, [item])
  return (
    <Box.Provider value={open}>
      {children}
      <dialog ref={dlg} className="lightbox" aria-label={item?.alt || 'Board'} onClose={() => { setItem(null); back.current?.focus?.() }} onClick={e => { if (e.target === dlg.current) setItem(null) }}>
        {item && (
          <>
            <Pic name={item.img} alt={item.alt} sizes="100vw" eager className="lightbox-img" />
            <div className="lightbox-bar">
              <p>{item.caption}</p>
              <button type="button" className="lightbox-close" onClick={() => setItem(null)} autoFocus>Close <span aria-hidden="true">✕</span></button>
            </div>
          </>
        )}
      </dialog>
    </Box.Provider>
  )
}

export function Board({ item, className = '', sizes = '(min-width: 900px) 45vw, 100vw' }) {
  const open = useLightbox()
  return (
    <figure className={`board ${className}`}>
      <Lean max={5}>
        <button type="button" className="board-btn" onClick={() => open(item)} aria-label={`Open full size: ${item.alt}`}>
          <Pic name={item.img} alt={item.alt} sizes={sizes} />
          <span className="board-open" aria-hidden="true">Open ↗</span>
        </button>
      </Lean>
      {item.caption && <figcaption className="cap">{item.caption}</figcaption>}
    </figure>
  )
}

// ── Tables ─────────────────────────────────────────────────────────────────
export function Spec({ rows, caption, links }) {
  const proof = useContext(Proof)
  const row = (k, l) => {
    const v = { label: k, img: l[0], x: l[1], y: l[2] }
    return (
      <button type="button" className="spec-link" aria-pressed={proof.pinned?.label === k}
        onMouseEnter={() => proof.show(v)} onMouseLeave={() => proof.show(null)}
        onFocus={() => proof.show(v)} onBlur={() => proof.show(null)} onClick={() => proof.pin(v)}>
        <span className="spec-node" aria-hidden="true" />{k}<span className="sr-only">: show on the photograph</span>
      </button>
    )
  }
  return (
    <table className={`spec ${links && proof ? 'spec--linked' : ''}`}>
      {caption && <caption>{caption}</caption>}
      <tbody>{rows.map(([k, v]) => <tr key={k}><th scope="row">{links?.[k] && proof ? row(k, links[k]) : k}</th><td>{v}</td></tr>)}</tbody>
    </table>
  )
}

export function Costing({ rows, caption, printed }) {
  const total = sum(rows)
  return (
    <table className="cost">
      {caption && <caption>{caption}</caption>}
      <thead><tr><th scope="col">Material</th><th scope="col">Quantity</th><th scope="col">Rate</th><th scope="col" className="num">Cost</th></tr></thead>
      <tbody>{rows.map(([m, q, r, c]) => <tr key={m}><td>{m}</td><td>{q}</td><td>{r}</td><td className="num">{rupees(c)}</td></tr>)}</tbody>
      <tfoot><tr><th scope="row" colSpan={3}>Total{printed && printed !== total ? ` (sheet prints ${rupees(printed)})` : ''}</th><td className="num">{rupees(total)}</td></tr></tfoot>
    </table>
  )
}

export function Estimate({ rows, caption }) {
  const lo = rows.reduce((a, r) => a + r[1], 0), hi = rows.reduce((a, r) => a + r[2], 0)
  return (
    <table className="cost">
      {caption && <caption>{caption}</caption>}
      <thead><tr><th scope="col">Component</th><th scope="col" className="num">Estimate</th></tr></thead>
      <tbody>{rows.map(([m, a, b]) => <tr key={m}><td>{m}</td><td className="num">{rupees(a)}–{b.toLocaleString('en-IN')}</td></tr>)}</tbody>
      <tfoot><tr><th scope="row">Sum of her estimates</th><td className="num">{rupees(lo)}–{hi.toLocaleString('en-IN')}</td></tr></tfoot>
    </table>
  )
}
