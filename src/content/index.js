// Collects every project file in ./projects. Adding a file there publishes it;
// nothing else needs editing. See README "Add a project".
import media from './media.json'
import { TYPES } from './taxonomy'

const files = import.meta.glob('./projects/*.js', { eager: true })

export { todo, isTodo } from './todo.js'

const all = Object.values(files).map(m => m.default).filter(Boolean)

const typeRank = Object.fromEntries(TYPES.map((t, i) => [t.id, i]))
export const projects = all
  .filter(p => !p.hidden)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || typeRank[a.type] - typeRank[b.type] || a.title.localeCompare(b.title))

// Each visible project gets a stable index number for the site (01, 02 …).
projects.forEach((p, i) => { p.number = String(i + 1).padStart(2, '0') })

export const bySlug = slug => projects.find(p => p.slug === slug)
export const related = p => (p.related || []).map(bySlug).filter(Boolean)

// Image lookup: "auxin/final-editorial-1" → sizes recorded by `npm run images`.
export const imageInfo = key => (key ? media[key] : null)

// Duplicate slugs would break links: fail loudly in development.
const seen = new Set()
for (const p of all) {
  if (seen.has(p.slug)) throw new Error(`Two projects use the slug "${p.slug}"`)
  seen.add(p.slug)
}
