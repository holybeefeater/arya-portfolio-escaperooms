import { Img, Placeholder, Shot, T, useLightbox, ratioOf } from './media'
import { isTodo } from '../content/todo'
import { registry } from './mockups'

// Every block a project page can use. A section in a project file is a list of these:
//   { kind: 'text', heading?, body: [...] }
// See README "Modules" for each kind and its fields.

const Cap = ({ children, n }) => children ? <figcaption className="cap">{n && <span className="mono">{n}</span>}<T v={children} /></figcaption> : null

function Text({ m }) {
  return (
    <div className={`m-text m-text--${m.width || 'narrow'}`}>
      {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
      {(m.body || []).map((p, i) => <p key={i}><T v={p} /></p>)}
    </div>
  )
}

function Figure({ m }) {
  const zoom = useLightbox()
  const size = m.size || 'wide'
  const body = m.image
    ? <Img image={m.image} alt={m.alt} sizes={size === 'full' || size === 'bleed' ? '100vw' : '(min-width: 900px) 66vw, 100vw'} />
    : <Placeholder label={m.placeholder || m.alt || 'Image to come'} ratio={m.ratio || 3 / 2} note={m.note} />
  return (
    <figure className={`m-fig m-fig--${size} ${m.tone ? `tone-${m.tone}` : ''}`}>
      {m.zoom && m.image
        ? <button type="button" className="zoomable" onClick={() => zoom(m)} aria-label={`Enlarge: ${m.alt}`}>{body}</button>
        : body}
      <Cap n={m.n}>{m.caption}</Cap>
    </figure>
  )
}

function Images({ m }) {
  const cols = m.cols || m.items.length
  return (
    <div className={`m-images cols-${cols} ${m.align === 'top' ? 'align-top' : ''} ${m.stagger ? 'stagger' : ''}`}>
      {m.items.map((it, i) => (
        <figure key={i} className="m-images-item" style={it.span ? { gridColumn: `span ${it.span}` } : undefined}>
          {it.image ? <Img image={it.image} alt={it.alt} sizes={`(min-width: 900px) ${Math.round(100 / cols)}vw, 100vw`} /> : <Placeholder label={it.placeholder || it.alt} ratio={it.ratio || 4 / 5} />}
          <Cap n={it.n}>{it.caption}</Cap>
        </figure>
      ))}
    </div>
  )
}

// A designed board from the original portfolio: shown wide, opened full size to read.
function Board({ m, compact }) {
  const zoom = useLightbox()
  return (
    <figure className={`m-board ${compact ? 'is-compact' : ''}`}>
      <button type="button" className="zoomable board-btn" onClick={() => zoom(m)} aria-label={`Open board full size: ${m.alt}`}>
        <Img image={m.image} alt={m.alt} sizes={compact ? '(min-width: 900px) 45vw, 100vw' : '(min-width: 900px) 83vw, 100vw'} />
        <span className="board-open mono">Open board ↗</span>
      </button>
      <Cap n={m.n}>{m.caption}</Cap>
    </figure>
  )
}
const Boards = ({ m }) => <div className={`m-boards cols-${m.cols || 2}`}>{m.items.map((b, i) => <Board key={i} m={b} compact />)}</div>

const Facts = ({ m }) => (
  <dl className="m-facts">{m.items.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd><T v={v} /></dd></div>)}</dl>
)

const List = ({ m }) => (
  <div className={`m-list cols-${m.cols || 1}`}>
    {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
    <ul>{m.items.map((it, i) => <li key={i}><T v={it} /></li>)}</ul>
  </div>
)

const Groups = ({ m }) => (
  <div className="m-groups">
    {m.items.map(g => (
      <section key={g.title} className="m-group">
        <h3 className="mono">{g.title}</h3>
        {g.body && <p><T v={g.body} /></p>}
        {g.items && <ul>{g.items.map((it, i) => <li key={i}><T v={it} /></li>)}</ul>}
      </section>
    ))}
  </div>
)

const Palette = ({ m }) => (
  <div className="m-palette">
    {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
    <ul>
      {m.colors.map(c => (
        <li key={c.name + c.hex}>
          <span className="chip" style={{ background: c.hex }} />
          <span className="chip-name">{c.name}</span>
          <span className="mono chip-code">{c.code || c.hex}</span>
          {c.note && <span className="chip-note">{c.note}</span>}
        </li>
      ))}
    </ul>
  </div>
)

const Materials = ({ m }) => (
  <div className="m-materials">
    {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
    <ol>
      {m.items.map((it, i) => (
        <li key={i}>
          <div className="mat-sw">{it.image ? <Img image={it.image} alt={isTodo(it.name) ? '' : it.name} sizes="200px" /> : <Placeholder label="Swatch photo" ratio={1} />}</div>
          <p className="mat-name"><span className="mono">{String(i + 1).padStart(2, '0')}</span> <T v={it.name} /></p>
          {it.use && <p className="mat-use"><T v={it.use} /></p>}
          {it.note && <p className="mat-note mono"><T v={it.note} /></p>}
        </li>
      ))}
    </ol>
  </div>
)

const Spec = ({ m }) => (
  <div className="m-spec">
    {m.title && <h3 className="m-h"><T v={m.title} /></h3>}
    {m.rows && <table className="tbl"><tbody>{m.rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td><T v={v} /></td></tr>)}</tbody></table>}
    {m.costing && (
      <table className="tbl tbl--cost">
        <caption className="mono">{m.costing.caption || 'Costing'}</caption>
        <thead><tr>{m.costing.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{m.costing.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        {m.costing.total && <tfoot><tr><td colSpan={m.costing.head.length - 1}>Total</td><td>{m.costing.total}</td></tr></tfoot>}
      </table>
    )}
    {m.note && <p className="cap"><T v={m.note} /></p>}
  </div>
)

const Quote = ({ m }) => (
  <blockquote className="m-quote"><p><T v={m.text} /></p>{m.cite && <cite className="mono"><T v={m.cite} /></cite>}</blockquote>
)

const Shots = ({ m }) => (
  <div className={`m-shots m-shots--${m.layout || 'grid'}`}>
    {m.items.map(s => <Shot key={s.n} shot={s} />)}
  </div>
)

const Steps = ({ m }) => (
  <ol className="m-steps">
    {m.items.map((s, i) => (
      <li key={i}>
        <span className="step-n mono">{String(i + 1).padStart(2, '0')}</span>
        <h3><T v={s.title} /></h3>
        <p><T v={s.body} /></p>
      </li>
    ))}
  </ol>
)

// A range plan: every piece listed, with its sketch or render when there is one.
const Range = ({ m }) => (
  <div className="m-range">
    {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
    <ol>
      {m.items.map((it, i) => (
        <li key={i}>
          <div className="range-img">{it.image ? <Img image={it.image} alt={it.name} sizes="(min-width: 900px) 25vw, 50vw" /> : <Placeholder label={`Flat / render: ${isTodo(it.name) ? 'to add' : it.name}`} ratio={3 / 4} />}</div>
          <p className="range-n mono">{m.prefix || 'Look'} {String(i + 1).padStart(2, '0')}</p>
          <h4><T v={it.name} /></h4>
          {it.desc && <p><T v={it.desc} /></p>}
          {it.material && <p className="mono range-mat"><T v={it.material} /></p>}
        </li>
      ))}
    </ol>
  </div>
)

// An image with numbered notes beside it (x, y from 0 to 1 over the image).
function Annotated({ m }) {
  return (
    <figure className="m-annot">
      <div className="annot-stage" style={{ aspectRatio: ratioOf(m.image) }}>
        <Img image={m.image} alt={m.alt} sizes="(min-width: 900px) 50vw, 100vw" />
        {m.notes.map((n, i) => <span key={i} className="annot-dot mono" style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }} aria-hidden="true">{i + 1}</span>)}
      </div>
      <ol className="annot-notes">{m.notes.map((n, i) => <li key={i}><span className="mono">{i + 1}</span><strong><T v={n.label} /></strong> <T v={n.text} /></li>)}</ol>
      <Cap>{m.caption}</Cap>
    </figure>
  )
}

function Details({ m }) {
  return (
    <details className="m-details">
      <summary><span className="mono">+ </span><T v={m.title} />{m.summary && <span className="details-sum"><T v={m.summary} /></span>}</summary>
      <div className="details-body"><Modules list={m.modules} /></div>
    </details>
  )
}

const Video = ({ m }) => (
  <figure className="m-fig m-fig--wide">
    <video src={m.src} poster={m.poster} controls muted playsInline preload="none" style={{ width: '100%', aspectRatio: m.ratio || '16 / 10' }} />
    <Cap>{m.caption}</Cap>
  </figure>
)

const Files = ({ m }) => (
  <div className="m-files">
    {m.heading && <h3 className="m-h"><T v={m.heading} /></h3>}
    <ul>{m.items.map(f => <li key={f.href}><a href={f.href} target="_blank" rel="noreferrer"><span>{f.label}</span><span className="mono">{f.size || 'PDF'} ↗</span></a></li>)}</ul>
  </div>
)

const LinkOut = ({ m }) => (
  <p className="m-link"><a className="btn" href={m.href}>{m.label} <span aria-hidden="true">→</span></a>{m.note && <span className="cap"><T v={m.note} /></span>}</p>
)

function Component({ m }) {
  const C = registry[m.name]
  return C ? <C {...m.props} /> : <Placeholder label={`Unknown component ${m.name}`} />
}

const KINDS = {
  text: Text, image: Figure, images: Images, board: Board, boards: Boards, facts: Facts, list: List,
  groups: Groups, palette: Palette, materials: Materials, spec: Spec, quote: Quote, shots: Shots,
  steps: Steps, range: Range, files: Files, annotated: Annotated, details: Details, video: Video, link: LinkOut,
  component: Component,
  placeholder: ({ m }) => <div className="m-fig m-fig--wide"><Placeholder label={m.label} ratio={m.ratio || 16 / 9} note={m.note} /></div>,
}

export function Modules({ list = [] }) {
  return list.map((m, i) => {
    const K = KINDS[m.kind]
    if (!K) return <Placeholder key={i} label={`Unknown module "${m.kind}"`} ratio={8} />
    return <div key={i} className={`mod mod-${m.kind}`} data-reveal><K m={m} /></div>
  })
}
