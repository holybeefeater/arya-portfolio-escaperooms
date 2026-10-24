import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterHead } from './chrome'
import { Crop, Develop, Gap, Living, Lean, Pic, useCalm, useLightbox } from './media'
import { img } from '../lib/asset'
import { chapters, collection, bloom, closingImage } from '../content'

gsap.registerPlugin(ScrollTrigger)
const c = chapters[4]

// One frame of a spread. It opens full size and untreated when clicked.
function Frame({ item, sizes }) {
  const open = useLightbox()
  const i = img(item.img)
  const ar = item.crop ? '4 / 5' : `${i.width} / ${i.height}`
  return (
    <figure className="bloom-shot">
      <Lean max={4}>
        <button type="button" className="shot-btn" onClick={() => open({ img: item.img, alt: item.alt, caption: item.piece })} aria-label={`Open full size: ${item.alt}`}>
          <span className="shot-frame" style={{ aspectRatio: ar }}>
            {item.develop ? <Develop name={item.img} sizes={sizes} /> : item.crop ? <Crop name={item.img} crop={item.crop} sizes={sizes} /> : <Pic name={item.img} alt="" sizes={sizes} />}
          </span>
        </button>
      </Lean>
      <figcaption className="cap">{item.piece}</figcaption>
    </figure>
  )
}

export default function Bloom() {
  const calm = useCalm()
  const stage = useRef(null)
  // the full look opens from a small frame to fill the screen, as a bud opens
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
  const { hero: full, spreads, finale } = bloom
  return (
    <section id={c.id} className="ch ch--bloom" data-tone={c.tone} data-ink={c.ink}>
      <ChapterHead c={c}>
        <p>The three pieces as made and worn: the jacket and trousers, the calf boots and the cowboy boots.{calm ? '' : ' Some photographs wait in her palette until your light develops them into colour.'} Click any photograph to see it full size, untouched.</p>
      </ChapterHead>
      <div ref={stage} className="bloom-stage">
        <p className="bloom-word" aria-hidden="true">bloom</p>
        <div className="bloom-frame">
          <Living name={full.img} loop={full.loop} video={full.video} alt={full.alt} sizes="100vw" />
        </div>
      </div>
      {spreads.map((sp, n) => (
        <div key={sp[0].img} className={`bloom-spread ${sp.length === 1 ? 'bloom-spread--wide' : spreads.slice(0, n).filter(x => x.length > 1).length % 2 ? 'bloom-spread--flip' : ''}`}>
          {sp.map((it, k) => <Frame key={it.img + k} item={it} sizes={sp.length === 1 ? '(min-width: 900px) 80vw, 100vw' : k ? '(min-width: 900px) 30vw, 70vw' : '(min-width: 900px) 55vw, 100vw'} />)}
        </div>
      ))}
      <div className="bloom-finale">
        <Living name={finale.img} loop={finale.loop} video={finale.video} alt={finale.alt} sizes="(min-width: 900px) 60vw, 100vw" />
      </div>
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
          <div className="bloom-reflect"><dt>Reflection</dt><dd><Gap v={collection.reflection} /></dd></div>
        </dl>
      </div>
    </section>
  )
}
