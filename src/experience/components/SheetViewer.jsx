import { useEffect, useRef, useState } from 'react'
import { url } from '../lib/asset'
import { pageSrc, sheetsFor } from '../content'

// Aditi's original portfolio pages for one project, one sheet at a time.
export default function SheetViewer({ room, onClose }) {
  const dialog = useRef(null)
  const [i, setI] = useState(0)
  const pages = room ? sheetsFor(room.sheets) : []

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (room) {
      setI(0)
      if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', '') }
    }
    else if (d.open) { if (d.close) d.close(); else d.removeAttribute('open') }
  }, [room])

  useEffect(() => {
    if (!room) return
    const onKey = e => {
      if (e.key === 'ArrowRight') setI(v => Math.min(pages.length - 1, v + 1))
      if (e.key === 'ArrowLeft') setI(v => Math.max(0, v - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [room, pages.length])

  const page = pages[i]
  return (
    <dialog ref={dialog} className="viewer" onClose={onClose} aria-label={room ? `${room.title} development sheets` : 'Development sheets'}>
      {room && (
        <>
          <div className="viewer-bar">
            <p><strong>{room.title}</strong>, portfolio page {page} <span className="muted">({i + 1} of {pages.length})</span></p>
            <button type="button" className="btn btn--quiet" onClick={() => dialog.current.close()} autoFocus>Close</button>
          </div>
          <div className="viewer-stage">
            <button type="button" className="viewer-nav" onClick={() => setI(v => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous page">←</button>
            <img key={page} src={url(pageSrc(page))} alt={`${room.title}: portfolio page ${page}`} />
            <button type="button" className="viewer-nav" onClick={() => setI(v => Math.min(pages.length - 1, v + 1))} disabled={i === pages.length - 1} aria-label="Next page">→</button>
          </div>
          <div className="viewer-strip" role="list">
            {pages.map((p, k) => (
              <button type="button" role="listitem" key={p} aria-current={k === i ? 'page' : undefined} aria-label={`Page ${p}`} onClick={() => setI(k)}>
                <img src={url(pageSrc(p))} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      )}
    </dialog>
  )
}
