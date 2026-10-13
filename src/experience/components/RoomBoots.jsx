import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScroll } from '../lib/scroll'
import { guide, guideFor } from '../lib/guide'
import { progress } from '../lib/progress'
import { Costing } from './craft'
import { Plate, RoomHead, Spec, Bom, Film, SheetsLink, Sign } from './parts'
import { boots, bags, collection } from '../content'

gsap.registerPlugin(ScrollTrigger)

// Layer positions from Aditi's exploded drawing (portfolio page 42), in that page's pixels.
const SOURCE = [
  { x: 70, y: 85 }, { x: 64, y: 415 }, { x: 61, y: 528 }, { x: 65, y: 603 }, { x: 64, y: 677 }, { x: 53, y: 728 },
]
const LEFT = 53, WIDTH = 723, SPREAD = 1.3
const OVERLAP = [0, 48, 58, 60, 50, 52]

function layout(layers) {
  const exploded = layers.map((l, i) => (SOURCE[i].y - SOURCE[0].y) * SPREAD)
  const height = exploded[exploded.length - 1] + layers[layers.length - 1].h
  const packed = []
  layers.forEach((l, i) => { packed[i] = i === 0 ? 0 : packed[i - 1] + layers[i - 1].h - OVERLAP[i] })
  const packedH = packed[packed.length - 1] + layers[layers.length - 1].h
  const shift = (height - packedH) / 2
  return {
    height,
    rows: layers.map((l, i) => ({
      ...l,
      left: ((SOURCE[i].x - LEFT) / WIDTH) * 100,
      width: (l.w / WIDTH) * 100,
      a: packed[i] + shift,
      b: exploded[i],
    })),
  }
}

export default function RoomBoots() {
  const { ready, calm, smoother } = useScroll()
  const pin = useRef(null)
  const stack = useRef(null)
  const b = boots
  const { height, rows } = layout(b.layers)

  // --u is one pixel of the source drawing, scaled to the stack's width.
  useLayoutEffect(() => {
    const el = stack.current
    const set = () => el.style.setProperty('--u', `${el.clientWidth / WIDTH}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    if (calm) {
      stack.current.style.setProperty('--e', '1')
      const st = ScrollTrigger.create({ trigger: stack.current, start: 'bottom 85%', onEnter: () => progress.key('boots') })
      return () => st.kill()
    }
    const hold = guideFor('boots', {
      smoother,
      skipText: 'Skip past the boot',
      next: '#boots .boots-after',
      label: p => ['Keep scrolling', p < 0.3 ? 'Lifting the upper off the sole' : p < 0.92 ? 'Taking the boot apart, layer by layer' : 'All six layers apart'],
    })
    const ctx = gsap.context(() => {
      gsap.fromTo(stack.current, { '--e': 0 }, {
        '--e': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current, start: 'top top', end: '+=90%', pin: true, scrub: 0.4, anticipatePin: 1, ...hold,
          onUpdate: self => { hold.onUpdate(self); if (self.progress > 0.95) progress.key('boots') },
        },
      })
    }, pin)
    return () => { ctx.revert(); guide.hide('boots') }
  }, [ready, calm, smoother])

  return (
    <section id="boots" className="room" data-tone="#BCC8C3" data-ink="dark" data-sign={collection.signs.boots}>
      <RoomHead room={b} sign={collection.signs.boots} variant="layers" />
      <div ref={pin} className="explode-pin">
        <div className="explode-copy">
          <p className="lead">{b.text}</p>
          <p className="explode-hint">Keep scrolling to take the boot apart, layer by layer.</p>
          <Spec rows={b.spec} label="Product details" />
        </div>
        <div className="explode-wrap">
          <div ref={stack} className="explode" style={{ height: `calc(var(--u) * ${height})` }}>
            {rows.map((r, i) => {
              const top = `calc(var(--u) * (${r.a.toFixed(1)} + (${(r.b - r.a).toFixed(1)}) * var(--e)))`
              return (
                <div key={r.name} className="explode-row">
                  <Plate
                    src={r.src} alt={`${r.name}, from the exploded view`} w={r.w} h={r.h} kind="layer" pad={0}
                    className="explode-layer"
                    style={{ left: `${r.left}%`, width: `${r.width}%`, top, zIndex: i }}
                  />
                  <p className="explode-label" style={{ top: `calc(var(--u) * (${(r.a + r.h / 2).toFixed(1)} + (${(r.b - r.a).toFixed(1)}) * var(--e)))` }}>
                    <span className="explode-leader" aria-hidden="true" />{r.name}
                  </p>
                </div>
              )
            })}
          </div>
          <Sign className="explode-sign">{collection.signs.bootsEnd}</Sign>
        </div>
      </div>

      <div className="boots-after">
        {b.photos.map(p => (
          <figure key={p.src} className="boots-photo">
            <Plate {...p} />
            <figcaption className="caption">{p.alt}.</figcaption>
          </figure>
        ))}
        <div className="boots-bom">
          <h3 className="h-small">Bill of materials, high ankle boot</h3>
          <Bom rows={b.bom} name="UK 9" />
        </div>
      </div>
      <Costing items={[...bags.pieces, { name: 'High ankle boot', bom: b.bom, retail: b.retail }]} />
      <Film film={b.film} alt="Process film for the boots" />
      <SheetsLink room={b} />
    </section>
  )
}
