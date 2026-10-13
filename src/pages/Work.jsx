import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projects } from '../content'
import { TYPES, DISCIPLINES, typeOf, disciplineOf } from '../content/taxonomy'
import ProjectCard, { ProjectLink, Cover } from '../components/ProjectCard'
import { T } from '../components/media'
import { useHead } from '../lib/head'
import { useReveal } from '../lib/motion'

// Filters live in the address (?type=collection&discipline=footwear&view=list),
// so a filtered selection can be bookmarked or sent to someone.
export default function Work() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') || 'all'
  const discipline = params.get('discipline') || 'all'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const set = (key, value, def) => {
    const next = new URLSearchParams(params)
    if (value === def) next.delete(key); else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const shown = projects.filter(p => (type === 'all' || p.type === type) && (discipline === 'all' || p.disciplines?.includes(discipline)))
  const typesInUse = TYPES.filter(t => projects.some(p => p.type === t.id))
  const discInUse = DISCIPLINES.filter(d => projects.some(p => p.disciplines?.includes(d.id)))
  const label = [type !== 'all' && typeOf(type)?.plural, discipline !== 'all' && disciplineOf(discipline)?.label].filter(Boolean).join(' · ')
  useHead({ title: label ? `Work: ${label}` : 'Work', description: `All ${projects.length} projects by Aditi Arya: collections, explorations, research and self-initiated concepts.`, path: `/work${params.toString() ? `?${params}` : ''}` })
  const root = useRef(null)
  useReveal(root, [type, discipline, view])
  // on a phone each filter row scrolls sideways: keep the selected option in view
  useEffect(() => {
    root.current?.querySelectorAll('.seg').forEach(seg => {
      const on = seg.querySelector('[aria-pressed="true"]')
      if (on && seg.scrollWidth > seg.clientWidth) seg.scrollLeft = on.offsetLeft - seg.offsetLeft - 16
    })
  }, [type, discipline, view])

  return (
    <div ref={root} className="work">
      <header className="work-head grid">
        <h1 className="work-title">Work</h1>
        <p className="work-count mono" aria-live="polite">{shown.length} of {projects.length} projects{label ? ` · ${label}` : ''}</p>
      </header>

      <div className="filters grid" role="group" aria-label="Filter projects">
        <div className="filter-row">
          <span className="mono filter-k" id="f-type">Type</span>
          <div className="seg" role="group" aria-labelledby="f-type">
            <button type="button" aria-pressed={type === 'all'} onClick={() => set('type', 'all', 'all')}>All</button>
            {typesInUse.map(t => <button key={t.id} type="button" aria-pressed={type === t.id} onClick={() => set('type', t.id, 'all')}>{t.plural}</button>)}
          </div>
        </div>
        <div className="filter-row">
          <span className="mono filter-k" id="f-disc">About</span>
          <div className="seg seg--light" role="group" aria-labelledby="f-disc">
            <button type="button" aria-pressed={discipline === 'all'} onClick={() => set('discipline', 'all', 'all')}>Everything</button>
            {discInUse.map(d => <button key={d.id} type="button" aria-pressed={discipline === d.id} onClick={() => set('discipline', d.id, 'all')}>{d.label}</button>)}
          </div>
        </div>
        <div className="filter-row filter-view">
          <span className="mono filter-k" id="f-view">View</span>
          <div className="seg seg--light" role="group" aria-labelledby="f-view">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => set('view', 'grid', 'grid')}>Images</button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => set('view', 'list', 'grid')}>List</button>
          </div>
        </div>
        {type !== 'all' && <p className="filter-blurb">{typeOf(type)?.blurb}</p>}
      </div>

      {shown.length === 0 && (
        <p className="empty grid">Nothing matches both filters yet. <button type="button" className="link" onClick={() => setParams({}, { replace: true })}>Clear filters</button></p>
      )}

      {view === 'grid' ? (
        <div className="work-grid">
          {shown.map((p, i) => <ProjectCard key={p.slug} project={p} size={p.type === 'collection' ? 'l' : 'm'} ratio={p.type === 'collection' ? 4 / 3 : 4 / 5} eager={i < 3} />)}
        </div>
      ) : (
        <table className="work-list">
          <caption className="sr-only">All projects</caption>
          <thead className="mono"><tr><th scope="col">No.</th><th scope="col">Project</th><th scope="col">Type</th><th scope="col">About</th><th scope="col">Summary</th></tr></thead>
          <tbody>
            {shown.map(p => (
              <tr key={p.slug}>
                <td className="mono">{p.number}</td>
                <th scope="row"><ProjectLink project={p} className="list-link"><span className="list-thumb" aria-hidden="true"><Cover project={p} sizes="96px" ratio={1} /></span>{p.title}</ProjectLink></th>
                <td className="mono">{typeOf(p.type)?.label}</td>
                <td className="mono">{p.disciplines?.map(d => disciplineOf(d)?.label).join(', ') || '—'}</td>
                <td><T v={p.premise} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
