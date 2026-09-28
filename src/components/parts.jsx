import { useEffect, useRef } from 'react'
import { stage } from '../lib/stage'
import { url } from '../lib/asset'
import { finePointer } from '../lib/motion'
import { useScroll } from '../lib/scroll'
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

export function RoomHead({ room, sign }) {
  return (
    <header className="room-head">
      <Sign>{sign}</Sign>
      <div className="room-head-grid">
        <span className="room-num" aria-hidden="true">{room.number}</span>
        <div className="room-head-text">
          <h2 className="display room-title"><span className="sr-only">Room {room.number}: </span>{room.title}</h2>
          <p className="room-line">{room.line}</p>
          <p className="room-meta">Developed over {room.duration}. {collection.season}.</p>
        </div>
      </div>
    </header>
  )
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
