import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { imageInfo } from '../content'
import { isTodo } from '../content/todo'

// ── Text that may still be a placeholder ────────────────────────────────────
export function T({ v, as: Tag = 'span', className = '' }) {
  if (v == null || v === '') return null
  if (isTodo(v)) return <Tag className={`todo ${className}`} title="Content to add">{v.todo}</Tag>
  return <Tag className={className}>{v}</Tag>
}

// ── Responsive image from media.json ────────────────────────────────────────
// Space is reserved from the recorded width and height, so nothing shifts as it loads.
export function Img({ image, alt = '', sizes = '100vw', className = '', eager = false, fit, style }) {
  const info = imageInfo(image)
  if (!info) return <Placeholder label={`Missing image: ${image}`} className={className} />
  const src = w => `/work/${image}-${w}.webp`
  const largest = info.widths[info.widths.length - 1]
  return (
    <img
      className={`img ${info.alpha ? 'img--cutout' : ''} ${className}`}
      src={src(info.widths.find(w => w >= 960) || largest)}
      srcSet={info.widths.map(w => `${src(w)} ${w}w`).join(', ')}
      sizes={sizes}
      width={info.w} height={info.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      style={{ objectFit: fit, ...style }}
    />
  )
}
export const ratioOf = image => { const i = imageInfo(image); return i ? i.w / i.h : 4 / 5 }
export const fullSrc = image => { const i = imageInfo(image); return i ? `/work/${image}-${i.widths[i.widths.length - 1]}.webp` : null }

// ── Neutral placeholder for an asset that is not supplied yet ───────────────
export function Placeholder({ label = 'Image to come', ratio = 4 / 5, className = '', note }) {
  return (
    <div className={`ph ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder: ${label}`}>
      <span className="ph-tag">Placeholder</span>
      <span className="ph-label">{label}</span>
      {note && <span className="ph-note">{note}</span>}
    </div>
  )
}

// ── Art-directed shot frame (self-initiated concepts) ───────────────────────
// Reads as a planned photograph: number, framing, light, casting, styling.
// Replace it with the real photograph by giving the shot an `image`.
export function Shot({ shot, className = '', style }) {
  const { n, title, direction, light, cast, ratio = 4 / 5, image, alt, tone = 'dark' } = shot
  if (image) return (
    <figure className={`shot shot--real ${className}`}>
      <Img image={image} alt={alt || title} sizes="(min-width: 900px) 50vw, 100vw" />
      <figcaption className="cap"><span className="mono">Shot {n}</span> {title}</figcaption>
    </figure>
  )
  return (
    <figure className={`shot shot--${tone} ${className}`} style={style}>
      <div className="shot-frame" style={{ aspectRatio: ratio }} role="img" aria-label={`Planned shot ${n}: ${title}. ${direction}`}>
        <span className="shot-corner tl" /><span className="shot-corner tr" /><span className="shot-corner bl" /><span className="shot-corner br" />
        <span className="shot-n">{String(n).padStart(2, '0')}</span>
        <span className="shot-status">Planned shot · photograph to come</span>
        <div className="shot-body">
          <p className="shot-title">{title}</p>
          <p className="shot-dir">{direction}</p>
          <dl className="shot-meta">
            {light && <><dt>Light</dt><dd>{light}</dd></>}
            {cast && <><dt>Cast</dt><dd>{cast}</dd></>}
          </dl>
        </div>
      </div>
    </figure>
  )
}

// ── Lightbox for boards and full-size images ────────────────────────────────
const LightboxCtx = createContext(() => {})
export const useLightbox = () => useContext(LightboxCtx)

export function LightboxProvider({ children }) {
  const [item, setItem] = useState(null)
  const dialog = useRef(null)
  const back = useRef(null)
  const open = useCallback(it => { back.current = document.activeElement; setItem(it) }, [])
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (item && !d.open) d.showModal?.()
    if (!item && d.open) d.close()
  }, [item])
  const close = () => { setItem(null); back.current?.focus?.() }
  return (
    <LightboxCtx.Provider value={open}>
      {children}
      <dialog ref={dialog} className="lightbox" onClose={close} onClick={e => { if (e.target === dialog.current) dialog.current.close() }} aria-label={item?.alt || 'Image'}>
        {item && (
          <div className="lightbox-inner">
            <div className="lightbox-bar">
              <p className="mono">{item.caption || item.alt}</p>
              <div className="lightbox-actions">
                <a className="mono link" href={fullSrc(item.image)} target="_blank" rel="noreferrer">Open full size ↗</a>
                <button type="button" className="btn-x" onClick={() => dialog.current.close()} autoFocus>Close</button>
              </div>
            </div>
            <div className="lightbox-stage"><Img image={item.image} alt={item.alt} sizes="100vw" eager /></div>
          </div>
        )}
      </dialog>
    </LightboxCtx.Provider>
  )
}
