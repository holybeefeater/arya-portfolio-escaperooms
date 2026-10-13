import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plate, Sign, StretchTitle } from './parts'
import Mark from './Mark'
import { url } from '../lib/asset'
import { finePointer } from '../lib/motion'
import { useScroll } from '../lib/scroll'
import { progress, formatTime } from '../lib/progress'
import { sound } from '../lib/sound'
import { collection, internship, otherWork, about, person, downloads, keys } from '../content'

export function OtherWork() {
  const i = internship
  const [print, ...boards] = i.boards
  return (
    <section id="other" className="room" data-tone="#CBCFBF" data-ink="dark" data-sign={collection.signs.other}>
      <Sign>{collection.signs.other}</Sign>
      <StretchTitle>Other work</StretchTitle>
      <div className="intern">
        <div className="intern-copy">
          <h3 className="intern-co">{i.company}</h3>
          <p className="intern-when">Industry internship, {i.when}</p>
          <p className="lead">{i.what}</p>
          <p className="muted">{i.mentors}</p>
          <a className="btn btn--quiet" href={url(i.deck)} download>Download the internship presentation</a>
        </div>
        <figure className="board board--film">
          <Plate kind="film" film={print.film.src} poster={print.film.poster} alt={`${print.title}, build-up film`} ratio="1 / 1" w={560} h={560} />
          <figcaption className="caption"><strong>{print.title}.</strong> {print.text} {finePointer() ? 'Hover' : 'Tap'} to watch it build.</figcaption>
        </figure>
      </div>
      <div className="boards">
        {boards.map(b => (
          <figure key={b.title} className="board">
            <Plate kind="photo" src={b.src} alt={b.title} w={b.w} h={b.h} tilt={0.1} />
            <figcaption className="caption"><strong>{b.title}.</strong> {b.text}</figcaption>
          </figure>
        ))}
      </div>
      <h3 className="h-small work-h">Research, publishing and identity</h3>
      <p className="doors-hint">{finePointer() ? 'Point at a door to look inside.' : 'Tap a door to look inside.'}</p>
      <Doors items={otherWork} />
    </section>
  )
}

// The unused pathway: a corridor of numbered doors, each opening onto a side project.
function Doors({ items }) {
  const [open, setOpen] = useState(null)
  const shown = items[open]
  return (
    <>
    <ul className="doors">
      {items.map((w, i) => {
        const no = `U-${String(i + 1).padStart(2, '0')}`
        return (
          <li key={w.title} className={`door-frame ${open === i ? 'is-open' : ''}`}>
            <div className="door-room">
              {w.thumb
                ? <img src={url(w.thumb)} alt="" loading="lazy" className="door-thumb" />
                : <span className="door-light" aria-hidden="true" />}
              <p className="door-title">{w.title}</p>
              <p className="door-role">{w.role}</p>
            </div>
            <button
              type="button"
              className="door"
              aria-expanded={open === i}
              aria-label={`Door ${no}: ${w.title}. ${w.role}.`}
              onClick={() => setOpen(v => (v === i ? null : i))}
            >
              <span className="door-plate">{no}</span>
              <span className="door-name">{w.short}</span>
              <span className="door-handle" aria-hidden="true" />
            </button>
          </li>
        )
      })}
    </ul>
    <p className={`doors-caption ${shown ? 'is-on' : ''}`} aria-live="polite">
      {shown ? <><strong>{shown.title}.</strong> {shown.role}.</> : null}
    </p>
    </>
  )
}

export function About() {
  const a = about
  return (
    <section id="about" className="room about" data-tone="#D3D6C8" data-ink="dark" data-sign={collection.signs.about}>
      <Sign>{collection.signs.about}</Sign>
      <div className="about-grid">
        <figure className="about-portrait">
          <Plate kind="photo" {...a.portrait} tilt={0.14} />
        </figure>
        <div className="about-copy">
          <StretchTitle>About {person.name.split(' ')[0]}</StretchTitle>
          {a.motto && <blockquote className="motto"><p>{a.motto}</p></blockquote>}
          {a.bio.map(p => <p key={p.slice(0, 16)} className="lead">{p}</p>)}
          <dl className="edu">
            {a.education.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>
      {a.testimonial && (
        <figure className="testimonial">
          <blockquote><p>“{a.testimonial.text}”</p></blockquote>
          <figcaption><strong>{a.testimonial.name}</strong>, {a.testimonial.role}</figcaption>
        </figure>
      )}
      {a.exhibition?.length > 0 && (
        <div className="exhibition">
          <h3 className="h-small">{a.awards[0]}</h3>
          <div className="exhibition-grid">
            {a.exhibition.map(x => <figure key={x.src}><Plate kind="photo" {...x} /><figcaption className="caption">{x.alt}.</figcaption></figure>)}
          </div>
        </div>
      )}
      <div className="about-cols">
        <div><h3 className="h-small">Awards</h3><ul className="details">{a.awards.map(x => <li key={x}>{x}</li>)}</ul></div>
        <div><h3 className="h-small">Skills</h3><ul className="details">{a.skills.map(x => <li key={x}>{x}</li>)}</ul></div>
        <div><h3 className="h-small">Software</h3><ul className="chips">{a.tools.map(x => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </section>
  )
}

function Runner() {
  // A simple running figure and arrow, after the emergency-exit pictogram.
  return (
    <svg className="exit-figure" viewBox="0 0 120 80" aria-hidden="true">
      <rect x="4" y="6" width="34" height="68" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="66" cy="15" r="7" fill="currentColor" />
      <path d="M62 26 L54 46 L40 50 M58 34 L72 40 L80 32 M54 46 L66 58 L62 74 M54 46 L46 62 L34 66" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M88 40 H114 M104 30 L115 40 L104 50" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A floor plan of the site. Rooms you walked through light up, and floor tape
// traces your route between them through the corridor.
// Laid out as a loop: along the top from the entrance, back along the bottom to an
// exit beside it (entry != exit).
const PLAN = [
  ['top', 'Entrance'], ['brief', 'Brief'], ['jacket', '01 Jacket'], ['bags', '02 Bags'],
  ['boots', '03 Boots'], ['other', 'Other work'], ['about', 'About'], ['exit', 'Exit'],
]
const ROOM_W = 66, ROOM_H = 64, GAP = 8, HALL = 116
const roomAt = i => {
  const row = i < 4 ? 0 : 1
  const col = row ? 7 - i : i
  return { x: 6 + col * (ROOM_W + GAP), y: row ? 140 : 18, row }
}

function FloorPlan({ route, found }) {
  const pos = Object.fromEntries(PLAN.map(([id], i) => {
    const r = roomAt(i)
    return [id, { ...r, cx: r.x + ROOM_W / 2, cy: r.y + ROOM_H / 2 }]
  }))
  const path = route.filter(id => pos[id])
  // the tape runs along the corridor, turning in at each doorway you used
  const door = p => [p.cx, p.row ? p.y : p.y + ROOM_H]
  const lane = p => [p.cx, p.row ? HALL + 9 : HALL - 9]
  const pts = []
  path.forEach((id, i) => {
    const p = pos[id]
    if (i === 0) { pts.push(door(p)); return }
    const q = pos[path[i - 1]]
    pts.push(lane(q), [p.cx, lane(q)[1]], lane(p), door(p))
  })
  const d = pts.length > 1 ? 'M' + pts.map(p => p.join(' ')).join(' L') : ''
  const last = path.length ? pos[path[path.length - 1]] : null
  const here = last ? [last.cx, last.cy] : null
  const keyRooms = Object.fromEntries(keys.map(k => [k.id, found.includes(k.id)]))
  return (
    <svg className="plan" viewBox="0 0 300 214" role="img" aria-label={`Floor plan. You walked through ${path.length} rooms.`}>
      <rect x="2" y="96" width="296" height="40" className="plan-hall" />
      {PLAN.map(([id, label], i) => {
        const r = roomAt(i)
        const seen = path.includes(id)
        return (
          <g key={id} className={`plan-room ${seen ? 'is-seen' : ''} ${id === 'exit' ? 'is-exit' : ''}`}>
            <rect x={r.x} y={r.y} width={ROOM_W} height={ROOM_H} rx="2" />
            <path d={r.row ? `M${r.x + 22} ${r.y} H${r.x + 44}` : `M${r.x + 22} ${r.y + ROOM_H} H${r.x + 44}`} className="plan-door" />
            <text x={r.x + 6} y={r.y + (r.row ? ROOM_H - 8 : 14)}>{label}</text>
            {id in keyRooms && (
              <g className={`plan-key ${keyRooms[id] ? 'is-found' : ''}`} transform={`translate(${r.x + ROOM_W - 22} ${r.y + (r.row ? 8 : ROOM_H - 20)})`}>
                <circle cx="5" cy="6" r="3.6" /><path d="M8.6 6 H17 M14 6 v3 M16.5 6 v2" />
              </g>
            )}
          </g>
        )
      })}
      {d && <path d={d} className="plan-route" />}
      {here && <circle cx={here[0]} cy={here[1]} r="4.5" className="plan-here" />}
      <text x="296" y="212" className="plan-legend" textAnchor="end">your route, in floor tape</text>
    </svg>
  )
}

function useVisit() {
  const [s, setS] = useState(progress.get())
  useEffect(() => progress.subscribe(x => setS({ ...x })), [])
  return s
}

export function Exit() {
  const { ready } = useScroll()
  const ref = useRef(null)
  const v = useVisit()
  useEffect(() => {
    if (!ready) return
    const st = ScrollTrigger.create({ trigger: ref.current, start: 'top 60%', onEnter: () => progress.finish() })
    return () => st.kill()
  }, [ready])
  const n = v.keys.length
  const missing = keys.filter(k => !v.keys.includes(k.id))
  const time = v.finished ? formatTime(v.finished - v.started) : null
  return (
    <section ref={ref} id="exit" className="exit" data-tone="#13241E" data-ink="light" data-sign={collection.signs.exit}>
      <Sign>{collection.signs.exit}</Sign>
      <div className="exit-grid">
        <div className="exit-main">
          <a className="exit-sign" href={`mailto:${person.email}`} aria-label={`Email Aditi Arya at ${person.email}`} onMouseEnter={() => sound.play('hum')}>
            <Runner />
            <span className="exit-word">EXIT</span>
          </a>
          <p className="exit-score" aria-live="polite">
            <span className="exit-keys">{n}/{keys.length} keys</span>
            {time && <span> · you escaped in {time}</span>}
            {missing.length > 0 && n > 0 && <span className="exit-missing"> · still hidden: {missing.map(k => k.how.toLowerCase()).join('; ')}</span>}
          </p>
          <p className="exit-line">
            For internships, graduation projects and collaborations, write to{' '}
            <a href={`mailto:${person.email}`}>{person.email}</a>.
          </p>
          <ul className="exit-links">
            {person.linkedin && <li><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
            <li><a href={person.instagram.url} target="_blank" rel="noreferrer">Instagram {person.instagram.handle}</a></li>
          </ul>
        </div>
        <FloorPlan route={v.route} found={v.keys} />
      </div>

      <h3 className="clues-h">Clues to take with you</h3>
      <ol className="clues">
        {downloads.map((d, i) => (
          <li key={d.file} className="clue" style={{ '--r': `${((i * 37) % 7) - 3}deg` }}>
            <a href={url(d.file)} download>
              <span className="clue-no">Clue {String(i + 1).padStart(2, '0')}</span>
              <span className="clue-label">{d.label}</span>
              <span className="clue-note">{d.note}{d.size ? ` · ${d.size}` : ''}</span>
              <span className="clue-get" aria-hidden="true">Download ↓</span>
            </a>
          </li>
        ))}
      </ol>

      <footer className="foot">
        <span className="foot-mark"><Mark className="foot-mark-svg" />© {new Date().getFullYear()} {person.name}</span>
        <span>{collection.title}, {collection.season}</span>
        <a href="#top">Back to the entrance</a>
      </footer>
    </section>
  )
}
