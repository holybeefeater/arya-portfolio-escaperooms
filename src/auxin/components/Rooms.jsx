import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Board, Costing, Estimate, Fill, Lean, Pic, ProofGallery, ProofRoom, Shot, Spec, useCalm } from './media'
import { light } from '../lib/light'
import { img, url } from '../lib/asset'
import { jacket, calf, cowboy, sum, rupees } from '../content'

gsap.registerPlugin(ScrollTrigger)

function RoomHead({ room }) {
  return (
    <header className="room-head">
      <p className="room-leaf"><span>Leaf {room.n}</span><span className="room-leaf-line" aria-hidden="true" /></p>
      <h3 className="room-title">{room.title}</h3>
      <p className="room-line">{room.line}</p>
      {room.research && <p className="room-research">{room.research}</p>}
    </header>
  )
}

// A room opens on its photographs: the lead frame on the side that sends the
// eye into the text, the second filling the space under the words, so the
// opening reads as one block with no gaps.
function RoomOpen({ room }) {
  const o = room.open
  const lead = img(o.lead.img)
  return (
    <div className={`room-open room-open--${o.side}`} style={{ '--ar': lead.width / lead.height }}>
      <Fill item={o.lead} className="room-open-lead" sizes="(min-width: 900px) 46vw, 100vw" />
      <RoomHead room={room} />
      <Fill item={o.second} className="room-open-second" sizes="(min-width: 900px) 46vw, 100vw" />
    </div>
  )
}

// One photograph between the drawings and the specification, or a pair side by side.
function Pause({ item, className = '' }) {
  if (!Array.isArray(item)) return <Shot item={item} className={`room-pause ${className}`} sizes="(min-width: 900px) 34vw, 80vw" />
  return <div className="room-pause-pair">{item.map(it => <Shot key={it.img} item={it} sizes="(min-width: 900px) 46vw, 50vw" />)}</div>
}

function Tabs({ tabs, label }) {
  const [at, setAt] = useState(0)
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs-list">
        {tabs.map((t, i) => (
          <button key={t.label} type="button" role="tab" id={`tab-${label}-${i}`} aria-selected={at === i} aria-controls={`panel-${label}-${i}`} tabIndex={at === i ? 0 : -1}
            onClick={() => setAt(i)}
            onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (at + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; setAt(n); e.currentTarget.parentElement.children[n].focus() } }}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`panel-${label}-${i}`} aria-labelledby={`tab-${label}-${i}`} hidden={at !== i} className="tabs-panel">{t.body}</div>
      ))}
    </div>
  )
}

// ── Leaf 01: from line to leather ──────────────────────────────────────────
function Morph() {
  const calm = useCalm()
  const stage = useRef(null)
  const [step, setStep] = useState(calm ? 2 : 0)
  useLayoutEffect(() => {
    if (calm) return
    const q = gsap.utils.selector(stage)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo(q('.morph-1'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3 }, 0.08)
        .from(q('.morph-dot'), { opacity: 0, scale: 0.4, stagger: 0.04, duration: 0.06 }, 0.36)
        .to(q('.morph-dot'), { opacity: 0, duration: 0.06 }, 0.66)
        .fromTo(q('.morph-2'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.26 }, 0.68)
        .to({}, { duration: 0.06 })
      ScrollTrigger.create({
        trigger: stage.current, start: 'top 9%', end: '+=190%', pin: true, scrub: 0.5, anticipatePin: 1, animation: tl,
        onUpdate: self => setStep(self.progress < 0.2 ? 0 : self.progress < 0.74 ? 1 : 2),
      })
    })
    mm.add('(max-width: 899px)', () => { setStep(2) })
    return () => mm.revert()
  }, [calm])
  return (
    <div ref={stage} className={`morph ${calm ? 'is-calm' : ''}`}>
      <div className="morph-frame">
        {jacket.stages.map((s, i) => {
          const m = img(s.img)
          return (
            <div key={s.img} className={`morph-layer morph-${i}`}>
              <div className="morph-box" style={{ '--ar': m.width / m.height }}>
                <Pic name={s.img} alt={s.alt} sizes="(min-width: 900px) 46vw, 100vw" />
                {i === 1 && jacket.details.map(d => (
                  <span key={d.label} className="morph-dot" style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}>
                    <span className="morph-dot-label">{d.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="morph-side">
        <ol className="morph-steps">
          {jacket.stages.map((s, i) => (
            <li key={s.label} className={step === i ? 'is-on' : step > i ? 'is-past' : ''}><span>{String(i + 1).padStart(2, '0')}</span>{s.label}</li>
          ))}
        </ol>
        <ul className="morph-list">{jacket.details.map(d => <li key={d.label}>{d.label}</li>)}</ul>
      </div>
    </div>
  )
}

export function RoomJacket() {
  const j = jacket
  return (
    <article id={j.id} className="room">
      <RoomOpen room={j} />
      <Morph />
      <figure className="range">
        <Lean max={4} cutout><Pic name={j.range.img} alt={j.range.alt} sizes="100vw" /></Lean>
        <figcaption className="cap">{j.range.caption}</figcaption>
      </figure>
      <Pause item={j.pause} />
      <ProofRoom>
        <div className="room-grid room-proof">
          <ProofGallery items={j.proof} label="The jacket and trousers as made" />
          <Tabs label="ensemble" tabs={[
            { label: 'Jacket', body: <><Spec rows={j.spec} links={j.links} caption="Specification: jacket" /><Costing rows={j.costing} caption="Costing: jacket" /></> },
            { label: 'Trousers', body: <><Lean max={4} cutout className="tabs-flat"><Pic name={j.trousers.flat.img} alt={j.trousers.flat.alt} sizes="40vw" /></Lean><Spec rows={j.trousers.spec} links={j.trousers.links} caption="Specification: trousers" /><Costing rows={j.trousers.costing} caption="Costing: trousers" /></> },
          ]} />
        </div>
      </ProofRoom>
      <div className="drawer">
        <Board item={j.forms} />
        <Board item={j.sheet} />
      </div>
    </article>
  )
}

// ── Leaf 02: turn the boot ─────────────────────────────────────────────────
function Turn() {
  const views = calf.views
  const [at, setAt] = useState(0)
  const drag = useRef(null)
  const onDown = e => { drag.current = { x: e.clientX, at }; e.currentTarget.setPointerCapture(e.pointerId) }
  const onMove = e => {
    if (!drag.current) return
    const steps = Math.round((drag.current.x - e.clientX) / 90)
    setAt(((drag.current.at + steps) % views.length + views.length) % views.length)
  }
  const onUp = () => { drag.current = null }
  const made = views[at].photo
  return (
    <div className="turn">
      <div className="turn-pair">
        <div className="turn-stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          tabIndex={0} role="group" aria-roledescription="turnable drawing" aria-label={`Final design of the calf boot, ${views[at].label.toLowerCase()} view. Drag sideways or use the arrow keys to turn it.`}
          onKeyDown={e => { if (e.key === 'ArrowRight') setAt((at + 1) % views.length); if (e.key === 'ArrowLeft') setAt((at + views.length - 1) % views.length) }}>
          {views.map((v, i) => (
            <div key={v.img} className={`turn-view ${i === at ? 'is-on' : ''}`} style={{ '--d': i - at }}>
              <Pic name={v.img} alt="" sizes="(min-width: 900px) 30vw, 70vw" />
            </div>
          ))}
          <span className="turn-hint" aria-hidden="true">⟵ drag to turn ⟶</span>
        </div>
        <figure className="turn-made">
          <div className="turn-made-plate">
            {views.map((v, i) => <Pic key={v.photo.img} name={v.photo.img} alt={i === at ? made.alt : ''} sizes="(min-width: 900px) 24vw, 45vw" className={i === at ? 'is-on' : ''} />)}
          </div>
          <figcaption className="cap">As made: {views[at].label.toLowerCase()}</figcaption>
        </figure>
      </div>
      <div className="turn-btns" role="group" aria-label="View">
        {views.map((v, i) => <button key={v.label} type="button" aria-pressed={i === at} onClick={() => setAt(i)}>{v.label}</button>)}
      </div>
    </div>
  )
}

export function RoomCalf() {
  const b = calf
  return (
    <article id={b.id} className="room">
      <RoomOpen room={b} />
      <div className="room-grid room-grid--calf">
        <Turn />
        <div className="room-col">
          <figure className="range range--tall">
            <Lean max={6} cutout><Pic name={b.range.img} alt={b.range.alt} sizes="(min-width: 900px) 30vw, 100vw" /></Lean>
            <figcaption className="cap">{b.range.caption}</figcaption>
          </figure>
          <table className="spec spec--wide">
            <caption>Materials</caption>
            <tbody>{b.materials.map(([m, u]) => <tr key={m}><th scope="row">{m}</th><td>{u}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <Pause item={b.pause} className="room-pause--right" />
      <ProofRoom>
        <div className="room-grid room-proof">
          <ProofGallery items={b.proof} label="The calf boots as made" />
          <div>
            <Spec rows={b.spec} links={b.links} caption="Specification: calf boots" />
            <Lean max={5} cutout className="flat"><Pic name={b.flat.img} alt={b.flat.alt} sizes="(min-width: 900px) 30vw, 80vw" /></Lean>
            <Estimate rows={b.estimate} caption="Estimated cost per component, ₹ (ranges from the costing sheet)" />
          </div>
        </div>
      </ProofRoom>
      <div className="drawer drawer--three">
        <Board item={b.forms} />
        {b.boards.map(x => <Board key={x.img} item={x} />)}
      </div>
    </article>
  )
}

// ── Leaf 03: the light fills the drawing ───────────────────────────────────
// The line drawing, with the aqua oil pull-up leather it specifies showing
// through wherever the visitor's light falls. Sixty-six rivets catch it too.
function Reveal() {
  const calm = useCalm()
  const ref = useRef(null)
  const m = img(cowboy.flat.img)
  useEffect(() => {
    const el = ref.current
    if (calm) { el.style.setProperty('--rx', '50%'); el.style.setProperty('--ry', '50%'); el.style.setProperty('--rr', '70%'); return }
    return light.subscribe(s => {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      el.style.setProperty('--rx', `${(s.x - r.left).toFixed(0)}px`)
      el.style.setProperty('--ry', `${(s.y - r.top).toFixed(0)}px`)
    })
  }, [calm])
  const leather = url(cowboy.leather)
  const flat = m.src
  return (
    <figure className="reveal">
      <div ref={ref} className="reveal-stage" style={{ aspectRatio: `${m.width} / ${m.height}`, '--flat': `url(${flat})`, '--leather': `url(${leather})` }}>
        <span className="reveal-leather" aria-hidden="true" />
        <Pic name={cowboy.flat.img} alt={cowboy.flat.alt} sizes="(min-width: 900px) 50vw, 100vw" className="reveal-lines" />
      </div>
      <figcaption className="cap">Where your light falls, the drawing fills with the aqua oil pull-up leather it specifies, cropped from the photograph of the boot.</figcaption>
    </figure>
  )
}

function Rivets({ n }) {
  const calm = useCalm()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (calm) return
    return light.subscribe(s => {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const dx = (s.x - (r.left + r.width / 2)) / (r.width / 2), dy = (s.y - (r.top + r.height / 2)) / Math.max(200, r.height)
      el.style.setProperty('--hx', `${(50 + Math.max(-1, Math.min(1, dx)) * 26).toFixed(1)}%`)
      el.style.setProperty('--hy', `${(50 + Math.max(-1, Math.min(1, dy)) * 26).toFixed(1)}%`)
    })
  }, [calm])
  const row = cowboy.costing.find(r => /rivet/i.test(r[0]))
  return (
    <figure className="rivets">
      <div ref={ref} className="rivets-grid" role="img" aria-label={`${n} rivets`}>
        {Array.from({ length: n }, (_, i) => <span key={i} className="rivet" />)}
      </div>
      <figcaption className="cap"><strong>{n} metal rivets</strong>, antique brass finish, {row[2]}: {rupees(row[3])} of the {rupees(sum(cowboy.costing))} costing. Each one catches your light.</figcaption>
    </figure>
  )
}

export function RoomCowboy() {
  const b = cowboy
  return (
    <article id={b.id} className="room">
      <RoomOpen room={b} />
      <div className="room-grid room-grid--cowboy">
        <Reveal />
        <div className="room-col">
          <Rivets n={b.rivets} />
          <Shot item={b.made} className="room-made" sizes="(min-width: 900px) 30vw, 90vw" />
        </div>
      </div>
      <ProofRoom>
        <div className="room-grid room-proof">
          <ProofGallery items={b.proof} label="The cowboy boots as made" />
          <div>
            <Spec rows={b.spec} links={b.links} caption="Specification: cowboy boots" />
            <Costing rows={b.costing} caption="Costing: cowboy boots" />
          </div>
        </div>
      </ProofRoom>
      <div className="drawer drawer--three">
        <Board item={b.forms} />
        {b.boards.map(x => <Board key={x.img} item={x} />)}
      </div>
    </article>
  )
}
