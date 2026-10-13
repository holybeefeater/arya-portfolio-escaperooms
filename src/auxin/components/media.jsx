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
export function Spec({ rows, caption }) {
  return (
    <table className="spec">
      {caption && <caption>{caption}</caption>}
      <tbody>{rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
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
