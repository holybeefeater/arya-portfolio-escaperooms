import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { stage } from '../lib/stage'
import { url } from '../lib/asset'
import { finePointer } from '../lib/motion'
import { useScroll } from '../lib/scroll'
import { useStretch, useReveal } from '../lib/stretch'
import { bomTotal, rupees, collection } from '../content'

// A product photograph drawn by the WebGL stage. The <img> inside is the
// accessible, no-WebGL version; it fades out once the stage has taken over.
export function Plate({
  src, alt = '', w, h, kind = 'cutout', fit, pad, lift, tilt, shadow, focus, ratio,
  className = '', style, children, film, poster, hoverable, cursor,
}) {
  const ref = useRef(null)
  const item = useRef(null)
  const isFilm = kind === 'film'
  useEffect(() => {
    item.current = stage.register(ref.current, {
      src: src && url(src), kind, fit, pad, lift, tilt, shadow, hoverable,
      film: film && url(film), poster: poster && url(poster),
    })
    return () => { stage.unregister(item.current); item.current = null }
  }, [src, kind, film, poster, fit, pad, lift, tilt, hoverable])
  useEffect(() => { stage.setFocus(item.current, focus || null) }, [focus])
  const cover = isFilm || kind === 'photo' || fit === 'cover'
  const filmProps = isFilm ? {
    role: 'button', tabIndex: 0, 'aria-label': `Play or pause: ${alt}`,
    onClick: () => stage.toggle(item.current),
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.toggle(item.current) } },
  } : {}
  return (
    <div
      ref={ref}
      className={`plate plate--${kind} ${className}`}
      style={{ aspectRatio: ratio || (w && h ? `${w} / ${h}` : undefined), ...style }}
      data-cursor={cursor || (isFilm ? 'watch' : 'light')}
      {...filmProps}
    >
      <img
        className="plate-img"
        src={url(isFilm ? poster : src)}
        alt={isFilm ? '' : alt}
        width={w} height={h}
        loading="lazy" decoding="async"
        style={{ objectFit: cover ? 'cover' : 'contain' }}
      />
      {isFilm && <video className="plate-video" src={url(film)} poster={url(poster)} muted loop playsInline controls preload="none" aria-label={alt} />}
      {children}
    </div>
  )
}

export function Sign({ children, className = '' }) {
  return (
    <p className={`sign ${className}`}>
      <span className="sign-tape" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

// Each room announces itself in its own way:
//   stitch  · the jacket's title is sewn: a saddle-stitched outline, filled as you arrive
//   bay     · the bags' title is painted on a parking-bay floor
//   layers  · the boots' title splits into layers, like the sole unit
export function RoomHead({ room, sign, variant }) {
  const meta = (
    <>
      <p className="room-line">{room.line}</p>
      <p className="room-meta">Developed over {room.duration}. {collection.season}.</p>
    </>
  )
  const label = <span className="sr-only">Room {room.number}: {room.title}</span>
  return (
    <header className={`room-head room-head--${variant || 'plain'}`}>
      <Sign>{sign}</Sign>
      {variant === 'stitch' && <StitchHead room={room} label={label}>{meta}</StitchHead>}
      {variant === 'bay' && <BayHead room={room} label={label}>{meta}</BayHead>}
      {variant === 'layers' && <LayerHead room={room} label={label}>{meta}</LayerHead>}
      {!variant && (
        <div className="room-head-grid">
          <span className="room-num" aria-hidden="true">{room.number}</span>
          <div className="room-head-text">
            <h2 className="display room-title">{label}<span aria-hidden="true">{room.title}</span></h2>
            {meta}
          </div>
        </div>
      )}
    </header>
  )
}

// The title as SVG text, made the way the jacket was: first a chalk pattern line,
// then the leather is cut and saddle-stitched, left to right as you arrive.
// The cream stitches sit inside each letter, a few millimetres in from the edge.
function StitchHead({ room, label, children }) {
  const wrap = useRef(null), text = useRef(null)
  const [box, setBox] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const b = text.current?.getBBox()
      if (b && b.width) setBox({ x: b.x - 8, y: b.y - 8, w: b.width + 16, h: b.height + 16 })
    }
    measure()
    document.fonts?.ready.then(measure)
  }, [])
  useReveal(wrap)
  const id = `stitch-${room.id}`
  const word = room.title.toUpperCase()
  const b = box || { x: 0, y: -200, w: 600, h: 240 }
  return (
    <div ref={wrap} className="stitch-head" style={{ '--w': b.w }}>
      <div className="room-head-grid">
        <span className="room-num" aria-hidden="true">{room.number}</span>
        <div className="room-head-text">
          <h2 className="stitch-title">
            {label}
            <svg aria-hidden="true" viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`} className="stitch-svg">
              <defs>
                <clipPath id={`${id}-cut`}><rect className="stitch-clip" x={b.x} y={b.y} width={b.w} height={b.h} /></clipPath>
                <mask id={`${id}-inset`} maskUnits="userSpaceOnUse" x={b.x} y={b.y} width={b.w} height={b.h}>
                  <text x="0" y="0" className="stitch-text" fill="#fff" stroke="#000" strokeWidth="10">{word}</text>
                </mask>
              </defs>
              <text ref={text} x="0" y="0" className="stitch-text stitch-chalk">{word}</text>
              <g clipPath={`url(#${id}-cut)`}>
                <text x="0" y="0" className="stitch-text stitch-fill">{word}</text>
                <text x="0" y="0" className="stitch-text stitch-thread" mask={`url(#${id}-inset)`}>{word}</text>
              </g>
              <g className="stitch-needle"><line x1={b.x} x2={b.x} y1={b.y + 4} y2={b.y + b.h - 4} /></g>
            </svg>
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}

// Painted on the floor of a parking bay, between two dashed bay lines.
function BayHead({ room, label, children }) {
  const wrap = useRef(null), title = useRef(null)
  useReveal(wrap)
  useStretch(title)
  return (
    <div ref={wrap} className="bay-head">
      <div className="bay-floor" aria-hidden="true">
        <span className="bay-floor-num">{room.number}</span>
      </div>
      <h2 className="bay-paint-wrap">{label}<span ref={title} aria-hidden="true" className="display bay-paint stretchy">{room.title}</span></h2>
      <div className="room-head-text">{children}</div>
    </div>
  )
}

// Three copies of the title, each showing one band, pulled apart like the sole layers.
function LayerHead({ room, label, children }) {
  const wrap = useRef(null), title = useRef(null)
  useReveal(wrap, '--e')
  useStretch(title)
  const bands = [['0%', '62%', 'Upper'], ['62%', '81%', 'Midsole'], ['81%', '100%', 'Outsole']]
  return (
    <div ref={wrap} className="layer-head">
      <div className="room-head-grid">
        <span className="room-num" aria-hidden="true">{room.number}</span>
        <div className="room-head-text">
          <h2 className="layer-title">
            {label}
            <span ref={title} className="display layer-stack stretchy" aria-hidden="true">
              <span className="layer-ghost">{room.title}</span>
              {bands.map(([a, b, name], i) => (
                <span key={name} className="layer-band" style={{ '--i': i, clipPath: `inset(${a} -2% calc(100% - ${b}) -2%)` }}>{room.title}</span>
              ))}
              {bands.map(([a, b, name], i) => (
                <span key={'l' + name} className="layer-tag" style={{ '--i': i, top: `calc((${a} + ${b}) / 2)` }}>{name}</span>
              ))}
            </span>
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}

// A section title that eases open on the width axis as it arrives.
export function StretchTitle({ children, className = '' }) {
  const ref = useRef(null)
  useStretch(ref)
  return <h2 className={`display section-title ${className}`}><span ref={ref} className="stretchy">{children}</span></h2>
}

export function Chips({ items }) {
  return <ul className="chips">{items.map(m => <li key={m}>{m}</li>)}</ul>
}

export function Spec({ rows, label }) {
  return (
    <table className="spec">
      {label && <caption>{label}</caption>}
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

export function Bom({ rows, name }) {
  const total = bomTotal(rows)
  return (
    <details className="bom">
      <summary data-cursor="open">
        <span>Bill of materials{name ? `, ${name}` : ''}</span>
        <span className="bom-total">{rupees(total)}</span>
      </summary>
      <div className="bom-panel">
        <table className="bom-table">
          <thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Cost</th></tr></thead>
          <tbody>
            {rows.map(([n, q, c]) => (
              <tr key={n}><td>{n}</td><td>{q || ''}</td><td>{rupees(c)}</td></tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={2}>Material cost</td><td>{rupees(total)}</td></tr></tfoot>
        </table>
      </div>
    </details>
  )
}

export function Film({ film, alt, ratio = '16 / 10', className = '' }) {
  const hint = finePointer() ? 'Hover to watch the process.' : 'Tap to watch the process.'
  return (
    <figure className={`film ${className}`}>
      <Plate kind="film" film={film.src} poster={film.poster} alt={alt} ratio={ratio} w={1200} h={750} />
      <figcaption className="caption"><strong>{hint}</strong> {film.caption}</figcaption>
    </figure>
  )
}

export function SheetsLink({ room }) {
  const { openSheets } = useScroll()
  const { from, to } = room.sheets
  return (
    <div className="sheets-row">
      <button type="button" className="btn" onClick={() => openSheets(room)} data-cursor="open">
        Open the development sheets <span className="btn-note">pages {from}–{to}</span>
      </button>
      <a className="btn btn--quiet" href={url(room.pdf)} download>Download the project PDF</a>
    </div>
  )
}
