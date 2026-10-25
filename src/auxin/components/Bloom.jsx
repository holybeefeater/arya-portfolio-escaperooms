import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterHead } from './chrome'
import { Crop, Develop, Gap, Living, Lean, Pic, useCalm, useLightbox } from './media'
import { Fix, Marks, Seam, Select, Thread, loop } from './marks'
import { img } from '../lib/asset'
import { light } from '../lib/light'
import { chapters, collection, bloom, closingImage } from '../content'

gsap.registerPlugin(ScrollTrigger)
const c = chapters[4]
const end = bloom.acts[bloom.acts.length - 1]

// Where an item sits: on the act's spread (desktop) and in the column (phone).
const place = it => ({ '--x': it.at[0], '--y': it.at[1], '--w': it.at[2], '--rot': `${it.rot || 0}deg`, '--mw': it.m[0] })
const sizes = (it, zoom = 1) => `(min-width: 900px) ${Math.round(it.at[2] * 0.92 * zoom)}vw, ${Math.round(it.m[0] * zoom)}vw`

// An act's title printed in three colours that do not quite register; they
// come into register as the visitor's light comes near.
function Riso({ text }) {
  return (
    <span className="riso">
      <span className="riso-a" aria-hidden="true">{text}</span>
      <span className="riso-b" aria-hidden="true">{text}</span>
      <span className="riso-c">{text}</span>
    </span>
  )
}

// One print on the spread. It opens full size, untouched, when clicked.
function Print({ f, act, no }) {
  const open = useLightbox()
  const i = img(f.img)
  return (
    <figure className={`bl-item bl-m-${f.m[1]}`} style={place(f)}>
      <Lean max={3}>
        <button type="button" className="bl-print" onClick={() => open({ img: f.img, alt: f.alt, caption: `${no} · ${f.piece}` })} aria-label={`Open full size: ${f.alt}`}>
          <span className="bl-img" style={{ aspectRatio: `${i.width} / ${i.height}` }}>
            {act.light ? <Develop name={f.img} sizes={sizes(f)} mode={act.light} /> : <Pic name={f.img} alt="" sizes={sizes(f)} />}
          </span>
          {f.marks && <Marks marks={f.marks} ar={i.width / i.height} tool={act.tool} />}
          <Fix kind={f.fix} />
          <span className={`bl-tag bl-tag--${f.tag || 'bl'}`} aria-hidden="true"><span className="bl-no">{no}{act.select && <Select />}</span>{f.piece}</span>
        </button>
      </Lean>
    </figure>
  )
}

// Two close crops side by side, sewn together.
function Pair({ p, no }) {
  const open = useLightbox()
  return (
    <figure className={`bl-item bl-pair bl-m-${p.m[1]}`} style={place(p)}>
      <div className="bl-pair-row">
        {p.pair.map(t => (
          <button key={t.img} type="button" className="bl-print" onClick={() => open({ img: t.img, alt: t.alt, caption: p.caption })} aria-label={`Open full size: ${t.alt}`}>
            <span className="bl-img" style={{ aspectRatio: '4 / 5' }}><Crop name={t.img} crop={t.crop} sizes={sizes(p, t.crop.zoom / 2)} /></span>
            <span className="bl-pair-word" aria-hidden="true">{t.word}</span>
          </button>
        ))}
        <Seam />
      </div>
      <figcaption className="bl-pair-cap"><span className="bl-no">{no}</span>{p.caption}</figcaption>
    </figure>
  )
}

// The last photograph opens as a circle, the sun, as the page scrolls to it,
// and a grease pencil rings it: the pick of the shoot.
function Finale({ item, no }) {
  const calm = useCalm()
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (calm) return
    const el = ref.current
    const st = ScrollTrigger.create({ trigger: el, start: 'top 90%', end: 'center 52%', scrub: 0.6, onUpdate: s => el.style.setProperty('--p', s.progress.toFixed(3)) })
    el.style.setProperty('--p', st.progress.toFixed(3))
    return () => st.kill()
  }, [calm])
  return (
    <figure ref={ref} className={`bl-item bl-finale bl-m-${item.m[1]}`} style={place(item)}>
      <div className="bl-sun">
        <Living name={item.img} loop={item.loop} video={item.video} alt={item.alt} sizes={sizes(item)} />
      </div>
      <svg className="bl-ring" viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d={loop(50, 50, 47, 47, 2)} /></svg>
      <figcaption className="bl-finale-cap"><span className="bl-no">{no}<Select /></span>{item.piece}</figcaption>
    </figure>
  )
}

function Act({ act }) {
  const calm = useCalm()
  const ref = useRef(null)
  useEffect(() => {
    if (calm) return
    const t = ref.current.querySelector('.riso')
    return light.subscribe(s => {
      const r = t.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const d = Math.hypot(s.x - (r.left + r.width / 2), s.y - (r.top + r.height / 2))
      t.style.setProperty('--mis', Math.min(9, d / 70).toFixed(2))
    })
  }, [calm])
  // the thread is sewn as the act scrolls by
  useLayoutEffect(() => {
    if (calm || !act.thread) return
    const el = ref.current.querySelector('.thread')
    const st = ScrollTrigger.create({ trigger: ref.current, start: 'top 70%', end: 'bottom 75%', scrub: 0.6, onUpdate: s => el.style.setProperty('--p', s.progress.toFixed(3)) })
    el.style.setProperty('--p', st.progress.toFixed(3))
    return () => st.kill()
  }, [calm, act.thread])
  let k = 0
  return (
    <div ref={ref} className={`bl-act bl-act--${act.id}`} data-tone={act.tone} data-ink={act.ink} data-tone-at={act.ink === 'dark' ? '92%' : undefined}>
      <div className="bl-spread" style={{ '--h': act.h }}>
        <header className="bl-item bl-head" style={place({ at: act.head, m: [100, 'l'] })}>
          <h3 className="bl-title"><span className="bl-title-n">{act.n}</span><Riso text={act.title} /></h3>
          <p className="bl-words">“…{act.words}”</p>
          <p className="bl-line">{act.line}</p>
        </header>
        {act.frames.map(f => {
          const no = `${act.n}.${++k}`
          return f.pair ? <Pair key={no} p={f} no={no} /> : <Print key={no} f={f} act={act} no={no} />
        })}
        {act.finale && <Finale item={act.finale} no={`${act.n}.${++k}`} />}
        {act.thread && <Thread points={act.thread} h={act.h} />}
      </div>
    </div>
  )
}

export default function Bloom() {
  const calm = useCalm()
  const stage = useRef(null)
  // the opening photograph opens from a small frame to fill the screen, as a bud opens
  useLayoutEffect(() => {
    if (calm) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const q = gsap.utils.selector(stage)
      gsap.timeline({ scrollTrigger: { trigger: stage.current, start: 'top top', end: '+=120%', pin: true, scrub: 0.5, anticipatePin: 1 } })
        .fromTo(q('.bloom-frame'), { clipPath: 'inset(22% 36% 22% 36% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 }, 0)
        .fromTo(q('.bloom-frame .living-frame'), { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(q('.bloom-word'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.4, ease: 'none', duration: 0.5 }, 0)
    })
    return () => mm.revert()
  }, [calm])
  const full = bloom.hero
  // the section has no tone of its own: each part brings its own ground, so
  // the page lightens act by act, from shade to sun
  return (
    <section id={c.id} className="ch ch--bloom">
      <div className="bl-open" data-tone={c.tone} data-ink={c.ink}>
        <ChapterHead c={c}>
          <p>The shoot, from shade into sun: the jacket and trousers, the calf boots and the cowboy boots, worn.{calm ? '' : ' In the shade your light finds the photographs; in filtered light it develops them into colour.'} Click any photograph to see it full size, untouched.</p>
        </ChapterHead>
        <div ref={stage} className="bloom-stage">
          <p className="bloom-word" aria-hidden="true">bloom</p>
          <div className="bloom-frame">
            <Living name={full.img} loop={full.loop} video={full.video} alt={full.alt} sizes="100vw" />
          </div>
        </div>
      </div>
      {bloom.acts.map(a => <Act key={a.id} act={a} />)}
      <div className="bl-end" data-tone={end.tone} data-ink={end.ink}>
        <div className="bloom-close">
          <p className="bloom-quote">“{collection.closing}”</p>
          <figure className="bloom-plant">
            <Lean max={6}><Pic name={closingImage.img} alt={closingImage.alt} sizes="(min-width: 900px) 30vw, 70vw" /></Lean>
            <figcaption className="cap">{closingImage.caption}</figcaption>
          </figure>
          <dl className="bloom-facts">
            <div><dt>Season</dt><dd>{collection.season}</dd></div>
            <div><dt>Pieces</dt><dd>Jacket and trousers; calf boots; cowboy boots</dd></div>
            <div><dt>Role</dt><dd><Gap v={collection.role} /></dd></div>
            <div><dt>When</dt><dd><Gap v={collection.when} /></dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}
