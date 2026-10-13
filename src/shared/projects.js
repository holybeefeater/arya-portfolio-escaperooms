// ─────────────────────────────────────────────────────────────────────────────
//  The collections on the site, in the order the header toggle shows them.
//
//  Each collection is its own page with its own look. To add one:
//    1. add an entry here (`path` is its folder, ending in a slash),
//    2. create <path>index.html and its entry in vite.config.js (copy auxin/),
//    3. copy the small inline script at the top of auxin/index.html into the new
//       page's <head>, with the new id and cover colour (it paints the arriving
//       colour before anything loads).
//  The toggle becomes a three-way (or wider) switch by itself.
//
//  `cover` is the transition: `grow` rises from the ground like a stem,
//  `shutter` drops like a garage door. `bg` and `ink` are its colours.
// ─────────────────────────────────────────────────────────────────────────────

export const projects = [
  {
    id: 'escape-rooms',
    title: 'Escape Rooms',
    short: 'Escape Rooms',
    season: 'A/W 2026',
    path: '',
    cover: { kind: 'shutter', bg: '#13241E', ink: '#E6EBD9' },
  },
  {
    id: 'auxin',
    title: 'Auxin',
    short: 'Auxin',
    season: 'A/W 27/28',
    path: 'auxin/',
    cover: { kind: 'grow', bg: '#D6DECE', ink: '#22397A' },
  },
]

// The site's root, worked out from where the scripts are served, so links work
// on any host and from a sub-folder (every built script sits in /assets/).
export const siteRoot = () => (import.meta.env.DEV ? '/' : new URL(/* @vite-ignore */ '../', import.meta.url).href)
export const hrefOf = p => siteRoot() + p.path
export const byId = id => projects.find(p => p.id === id)
