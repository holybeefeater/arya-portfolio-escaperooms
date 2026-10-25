import { useEffect, useRef } from 'react'
import { useScroll } from '../lib/scroll'
import { url } from '../lib/asset'
import { lookbook } from '../content'

// ─────────────────────────────────────────────────────────────────────────────
//  The shoot, level by level. Every photograph is edited and cut out of the
//  studio; the levels give them their ground: a sodium-yellow back room, a
//  night alley with a wet floor, cherry, olive. As the page scrolls, the
//  cut-outs drift at different depths. Click any photograph to open it.
// ─────────────────────────────────────────────────────────────────────────────

const place = it => ({ '--x': it.at[0], '--y': it.at[1], '--w': it.at[2], '--mw': it.m[0] })

function Frame({ it }) {
  const href = url(it.src)
  if (it.crop) {
    return (
      <a className="lb-crop" href={href} target="_blank" rel="noreferrer" style={{ aspectRatio: it.crop.ar }} aria-label={`Open full size: ${it.alt}`}>
        <img src={href} alt="" loading="lazy" decoding="async" style={{ objectPosition: it.crop.pos }} />
      </a>
    )
  }
  return (
    <a className="lb-cut" href={href} target="_blank" rel="noreferrer" aria-label={`Open full size: ${it.alt}`}>
      {Array.from({ length: it.echo || 0 }, (_, k) => (
        <img key={k} className="lb-echo" src={href} alt="" aria-hidden="true" loading="lazy" style={{ '--k': k + 1 }} />
      ))}
      <img className="lb-main" src={href} alt="" width={it.w} height={it.h} loading="lazy" decoding="async" />
      {it.reflect && <img className="lb-reflect" src={href} alt="" aria-hidden="true" loading="lazy" />}
    </a>
  )
}

function Level({ lv }) {
  return (
    <div id={lv.id} className={`lb-level lb-scene--${lv.scene}`} data-tone={lv.tone} data-ink={lv.ink}>
      <header className="lb-head">
        <h3 className="lb-title">{lv.title}</h3>
        <p className="lb-line">{lv.line}</p>
      </header>
      <div className="lb-spread" style={{ '--h': lv.h }}>
        {lv.frames.map(it => (
          <figure key={it.src} className={`lb-item lb-m-${it.m[1]}`} style={place(it)} data-depth={it.depth || 0}>
            <Frame it={it} />
            <figcaption className="lb-piece">{it.piece}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export default function Lookbook() {
  const { calm } = useScroll()
  const root = useRef(null)
  // depth: each cut-out drifts with the scroll by its own amount
  useEffect(() => {
    if (calm || !matchMedia('(min-width: 900px)').matches) return
    const items = [...root.current.querySelectorAll('[data-depth]')].filter(el => +el.dataset.depth)
    let raf = 0
    const run = () => {
      raf = 0
      const vh = window.innerHeight
      for (const el of items) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) continue
        const off = (r.top + r.height / 2 - vh / 2) * +el.dataset.depth * -0.12
        el.style.setProperty('--py', `${off.toFixed(1)}px`)
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [calm])
  const c = lookbook.close
  return (
    <section ref={root} id="shoot" className="room lookbook">
      <header className="lb-intro" data-tone={lookbook.levels[0].tone} data-ink="dark">
        <h2 className="display lb-h">{lookbook.title}</h2>
        <p className="lead">{lookbook.line}</p>
      </header>
      {lookbook.levels.map(lv => <Level key={lv.id} lv={lv} />)}
      <figure className="lb-close" data-tone="#B9AF5C" data-ink="dark">
        <a href={url(c.src)} target="_blank" rel="noreferrer" aria-label={`Open full size: ${c.alt}`}>
          <img src={url(c.src)} alt="" loading="lazy" decoding="async" />
        </a>
        <figcaption className="lb-piece">{c.piece}</figcaption>
      </figure>
    </section>
  )
}
