import { useEffect, useRef } from 'react'
import { ChapterHead } from './chrome'
import { Board, Lean, useCalm } from './media'
import { light } from '../lib/light'
import { img } from '../lib/asset'
import { chapters, palette, swatches, garmentMaterials, boards } from '../content'

const c = chapters[2]

// The colour card as four stems. Each bends at its base toward the light.
function Palette() {
  const calm = useCalm()
  const row = useRef(null)
  useEffect(() => {
    if (calm) return
    const cols = [...row.current.querySelectorAll('.pal-stem')]
    return light.subscribe(s => {
      const vh = window.innerHeight
      cols.forEach(col => {
        const r = col.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) return
        const dx = (s.x - (r.left + r.width / 2)) / window.innerWidth
        const above = Math.max(0.15, Math.min(1, (r.bottom - s.y) / vh))
        col.style.setProperty('--bend', `${Math.max(-9, Math.min(9, dx * 22 * above)).toFixed(2)}deg`)
      })
    })
  }, [calm])
  return (
    <ul ref={row} className="pal" aria-label="Colour references">
      {palette.map((p, i) => (
        <li key={p.name} className="pal-item" style={{ '--h': `${78 + (i % 2) * 14 - i * 4}%` }}>
          <span className="pal-stem" style={{ background: p.hex }} aria-hidden="true" />
          <p className="pal-name">{p.name}</p>
          <p className="pal-code">{p.code} · {p.hex}</p>
        </li>
      ))}
    </ul>
  )
}

export default function StemChapter() {
  return (
    <section id={c.id} className="ch ch--stem" data-tone={c.tone} data-ink={c.ink}>
      <ChapterHead c={c}>
        <p>Blues and greens from water and plant tissue. The leather is paired with furnishing fabrics: upholstery fabric, a striped curtain fabric and a teal pleat.</p>
      </ChapterHead>
      <Palette />
      <p className="cap pal-note">Screen colours are close approximations.</p>

      <h3 className="ch-sub">The three materials</h3>
      <ul className="swatches">
        {swatches.map(s => (
          <li key={s.id}>
            <Lean max={10}>
              <span className="swatch-cut" style={{ backgroundImage: `url(${img(s.img).src})` }} role="img" aria-label={`${s.name}, close-up`} />
            </Lean>
            <p className="swatch-name">{s.name}</p>
            <p className="swatch-note">{s.note}</p>
          </li>
        ))}
      </ul>
      <p className="cap">Each swatch is cut from the shoot photographs.</p>

      <div className="mat-grid">
        <table className="spec spec--wide">
          <caption>Garment materials</caption>
          <tbody>{garmentMaterials.map(([m, u]) => <tr key={m}><th scope="row">{m}</th><td>{u}</td></tr>)}</tbody>
        </table>
        <Board item={boards.colour} />
      </div>
    </section>
  )
}
