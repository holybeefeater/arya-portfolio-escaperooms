// After `vite build`: write an HTML file for every page with its own title,
// description and preview image, so links shared on WhatsApp, LinkedIn or email
// show the right project even though those apps do not run JavaScript.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { site } from '../src/content/site.js'

const DIST = 'dist'
const media = JSON.parse(await readFile('src/content/media.json', 'utf8'))
const shell = await readFile(`${DIST}/index.html`, 'utf8')
const base = site.url.replace(/\/$/, '')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const text = v => (v && typeof v === 'object' && 'todo' in v ? '' : v || '')
const imageUrl = key => { const m = key && media[key]; return m ? `${base}/work/${key}-${m.widths[m.widths.length - 1]}.webp` : `${base}/og-card.jpg` }

function page({ title, description, image, path, body = '' }) {
  const full = title ? `${title} · ${site.name}` : `${site.name} · ${site.descriptor}`
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(full)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(full)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${esc(image)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${base}${path}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${base}${path}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(full)}`)
    .replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${esc(image)}`)
  if (body) html = html.replace('<div id="root"></div>', `<div id="root"></div><noscript>${body}</noscript>`)
  return html
}

async function write(path, html) {
  const out = `${DIST}${path}`
  await mkdir(out, { recursive: true })
  await writeFile(`${out}/index.html`, html)           // /work/auxin/
  await writeFile(`${out}.html`, html)                 // /work/auxin (clean URL)
}

const files = (await readdir('src/content/projects')).filter(f => f.endsWith('.js'))
const projects = (await Promise.all(files.map(f => import(`../src/content/projects/${f}`).then(m => m.default)))).filter(p => p && !p.hidden)

for (const p of projects) {
  const premise = text(p.premise)
  const description = p.seo?.description || premise || site.intro
  const image = imageUrl(p.seo?.image || p.cover?.image)
  const body = `<h1>${esc(p.title)}</h1><p>${esc(premise)}</p>${(p.overview || []).map(o => text(o) && `<p>${esc(text(o))}</p>`).join('')}<p><a href="/work">All work</a> · <a href="mailto:${site.email}">${site.email}</a></p>`
  await write(`/work/${p.slug}`, page({ title: p.seo?.title || p.title, description, image, path: `/work/${p.slug}`, body }))
}
await write('/work', page({ title: 'Work', description: `All ${projects.length} projects by ${site.name}: collections, explorations, research and self-initiated concepts.`, image: `${base}/og-card.jpg`, path: '/work' }))
await write('/about', page({ title: 'About', description: `${site.name}: ${site.intro}`, image: imageUrl(site.portrait.image), path: '/about' }))
console.log(`prerender: ${projects.length} projects + work + about`)
