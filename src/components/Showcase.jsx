import { useEffect, useRef, useState } from 'react'
import { createViewer } from '../lib/viewer'
import { url } from '../lib/asset'
import { useScroll, scrollToTarget } from '../lib/scroll'
import { Sign } from './parts'
import { models, collection } from '../content'

// A turntable for the three pieces. Real .glb files load when content.js names them;
// until then each piece is a photo relief, clearly labelled as such.
export default function Showcase() {
  const { calm } = useScroll()
  const canvas = useRef(null)
  const api = useRef(null)
  const [active, setActive] = useState(models.items[0].id)
  const [status, setStatus] = useState({ mode: 'loading', progress: 0 })
  const [failed, setFailed] = useState(false)
  const [auto, setAuto] = useState(true)
  const [close, setClose] = useState(false)
  const item = models.items.find(i => i.id === active)

  useEffect(() => {
    try {
      api.current = createViewer(canvas.current, { onStatus: setStatus, motion: !calm })
    } catch (err) {
      console.warn('[viewer] WebGL unavailable, showing the photograph instead.', err)
      setFailed(true)
    }
    return () => { api.current?.dispose(); api.current = null }
  }, [])

  useEffect(() => {
    api.current?.show({ src: item.src ? url(item.src) : '', relief: { ...item.relief, src: url(item.relief.src) } })
  }, [active])
  useEffect(() => { api.current?.setAuto(auto) }, [auto])
  useEffect(() => { api.current?.setMotion(!calm) }, [calm])
  useEffect(() => { api.current?.setClose(close) }, [close])

  const isModel = status.mode === 'model'
  return (
    <section id="in-3d" className="room" data-tone="#C6CBBC" data-ink="dark" data-sign={collection.signs.models}>
      <Sign>{collection.signs.models}</Sign>
      <div className="v3d">
        <div className="v3d-copy">
          <h2 className="display section-title">{models.title}</h2>
          <p className="lead">{models.intro}</p>
          <div className="v3d-tabs" role="group" aria-label="Choose a piece">
            {models.items.map(m => (
              <button key={m.id} type="button" className="v3d-tab" aria-pressed={m.id === active} onClick={() => setActive(m.id)}>{m.label}</button>
            ))}
          </div>
          <p className="v3d-line">{item.line}</p>
          <p className="v3d-mode" aria-live="polite">
            <span className="v3d-chip">{failed ? 'Photograph' : status.mode === 'loading' ? 'Loading' : isModel ? '3D model' : 'Photo relief'}</span>
            <span>{failed ? '3D is not available in this browser, so this is the photograph.' : isModel ? models.modelNote : models.reliefNote}</span>
          </p>
          <a className="btn btn--quiet v3d-room" href={item.room} onClick={e => { e.preventDefault(); scrollToTarget(null, item.room) }}>
            See the {item.label.toLowerCase()} in detail
          </a>
        </div>
        <div className="v3d-stage">
          <canvas ref={canvas} className="v3d-canvas" data-cursor="drag" aria-label={`${item.label}, turnable view. Use the buttons below to turn it.`} role="img" />
          {failed && <img className="v3d-fallback" src={url(item.relief.src)} alt={item.label} />}
          {status.mode === 'loading' && status.progress > 0 && (
            <p className="v3d-loading">Loading the 3D model {Math.round(status.progress * 100)}%</p>
          )}
          {!failed && (
            <div className="v3d-controls">
              <button type="button" className="v3d-btn" onClick={() => api.current?.nudge(-0.7)} aria-label="Turn left">← Turn</button>
              <button type="button" className="v3d-btn" onClick={() => api.current?.nudge(0.7)} aria-label="Turn right">Turn →</button>
              <button type="button" className="v3d-btn" aria-pressed={close} onClick={() => setClose(v => !v)}>{close ? 'Full view' : 'Close-up'}</button>
              {!calm && <button type="button" className="v3d-btn" aria-pressed={!auto} onClick={() => setAuto(v => !v)}>{auto ? 'Pause' : 'Play'}</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
