import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterHead } from './chrome'
import { Gap, Living, Lean, Pic, useCalm } from './media'
import { chapters, collection, shoot, closingImage } from '../content'

gsap.registerPlugin(ScrollTrigger)
const c = chapters[4]

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
  const [full, ...rest] = shoot
  return (
    <section id={c.id} className="ch ch--bloom" data-tone={c.tone} data-ink={c.ink}>
      <ChapterHead c={c}>
        <p>The ensemble as made: the jacket in blue oil pull-up cow leather, the trousers in striped curtain fabric with teal pleated panels.</p>
      </ChapterHead>
      <div ref={stage} className="bloom-stage">
        <p className="bloom-word" aria-hidden="true">bloom</p>
        <div className="bloom-frame">
          <Living name={full.img} loop={full.loop} video={full.video} alt={full.alt} sizes="100vw" />
        </div>
      </div>
      <div className="bloom-pair">
        {rest.map(s => <Living key={s.img} name={s.img} loop={s.loop} video={s.video} alt={s.alt} sizes="(min-width: 900px) 45vw, 100vw" />)}
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
