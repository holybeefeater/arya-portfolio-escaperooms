import { ChapterHead } from './chrome'
import { RoomJacket, RoomCalf, RoomCowboy } from './Rooms'
import { chapters, leaves } from '../content'

const c = chapters[3]

export default function Leaves() {
  return (
    <section id={c.id} className="ch ch--leaves" data-tone={c.tone} data-ink={c.ink}>
      <ChapterHead c={c}>
        <p>The range grew three pieces: a jacket with trousers, and two pairs of boots. Each has its own page below, from sketches to specification and costing.</p>
      </ChapterHead>
      <ol className="leaf-index">
        {leaves.map(l => (
          <li key={l.id}><a href={`#${l.id}`}><span className="leaf-index-n">{l.n}</span><span className="leaf-index-t">{l.title}</span><span aria-hidden="true">↓</span></a></li>
        ))}
      </ol>
      <RoomJacket />
      <RoomCalf />
      <RoomCowboy />
    </section>
  )
}
