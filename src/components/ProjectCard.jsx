import { Link, useLocation } from 'react-router-dom'
import { Img, Placeholder, Shot, T } from './media'
import { registry } from './mockups'
import { typeOf, disciplineOf } from '../content/taxonomy'

// Opening a project from inside the site shows it as an overlay over the current
// page; the address still becomes /work/<slug>, so it can be shared or reloaded.
export function ProjectLink({ project, children, className, hash = '', ...rest }) {
  const location = useLocation()
  const background = location.state?.background || location
  return (
    <Link to={`/work/${project.slug}${hash}`} state={{ background }} className={className} {...rest}>
      {children}
    </Link>
  )
}

export function Cover({ project, sizes = '(min-width: 900px) 33vw, 100vw', eager, ratio }) {
  const c = project.cover
  if (c?.component) { const C = registry[c.component]; return <C ratio={ratio || 4 / 5} /> }
  // the project's own accent, so an accent-toned shot reads the same outside its page
  const accent = project.accent && { '--accent': project.accent.color, '--accent-paper': project.accent.paper }
  if (c?.shot) return <Shot shot={{ ...c.shot, ratio: ratio || 4 / 5 }} className="shot--cover" style={accent} />
  if (c?.image) return <Img image={c.image} alt={c.alt} sizes={sizes} eager={eager} fit={ratio ? 'cover' : undefined} style={ratio ? { aspectRatio: ratio, width: '100%', height: 'auto' } : undefined} />
  return <Placeholder label={c?.placeholder || `Cover image for ${project.title}`} ratio={ratio || 4 / 5} />
}

export function Tags({ project }) {
  return (
    <p className="tags mono">
      <span className={`tag-type tag-${project.type}`}>{typeOf(project.type)?.label}</span>
      {project.disciplines?.map(d => <span key={d}>{disciplineOf(d)?.label}</span>)}
    </p>
  )
}

export default function ProjectCard({ project, size = 'm', ratio = 4 / 5, eager }) {
  return (
    <article className={`card card--${size}`} data-reveal>
      <ProjectLink project={project} className="card-link">
        <div className="card-img" style={{ aspectRatio: ratio }}>
          <Cover project={project} ratio={ratio} eager={eager} sizes={size === 'l' ? '(min-width: 900px) 58vw, 100vw' : '(min-width: 900px) 30vw, 100vw'} />
        </div>
        <div className="card-meta">
          <span className="card-n mono">{project.number}</span>
          <h3 className="card-title">{project.title}</h3>
          <p className="card-premise"><T v={project.premise} /></p>
          <Tags project={project} />
        </div>
      </ProjectLink>
    </article>
  )
}
