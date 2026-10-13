// The two kinds of metadata every project carries.
// Project type answers "what kind of work is this?"; disciplines answer "what is it about?".
// The filters on /work are built from these lists, in this order.

export const TYPES = [
  { id: 'collection', label: 'Collection', plural: 'Collections', blurb: 'Full collections developed from concept to finished pieces.' },
  { id: 'exploration', label: 'Exploration', plural: 'Explorations', blurb: 'Studies of a theme, a material, a construction or a form.' },
  { id: 'research', label: 'Research', plural: 'Research', blurb: 'Documentation, field observation and what it taught.' },
  { id: 'concept', label: 'Self-initiated concept', plural: 'Concepts', blurb: 'Self-initiated briefs. Not commissioned, not launched.' },
]

export const DISCIPLINES = [
  { id: 'bags', label: 'Bags' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'garments', label: 'Garments' },
  { id: 'materials', label: 'Materials' },
  { id: 'branding', label: 'Branding' },
  { id: 'campaign', label: 'Campaign' },
]

export const typeOf = id => TYPES.find(t => t.id === id)
export const disciplineOf = id => DISCIPLINES.find(d => d.id === id)
