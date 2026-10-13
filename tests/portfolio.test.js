import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { TYPES, DISCIPLINES } from '../src/content/taxonomy.js'
import { site } from '../src/content/site.js'

const media = JSON.parse(readFileSync(new URL('../src/content/media.json', import.meta.url)))
const dir = new URL('../src/content/projects/', import.meta.url)
const projects = await Promise.all(readdirSync(dir).filter(f => f.endsWith('.js')).map(f => import(new URL(f, dir)).then(m => m.default)))
const slugs = projects.map(p => p.slug)

// every image key used anywhere in a project
function images(v, out = []) {
  if (Array.isArray(v)) v.forEach(x => images(x, out))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'image' && typeof x === 'string') out.push(x); else images(x, out) }
  return out
}

test('twelve named projects are present', () => {
  for (const s of ['auxin', 'escape-rooms', 'dark-ages-collection', 'rexine-jacket', 'swatches', 'footwear-concept-collection', 'crd', 'tannery', 'lingerie-campaign', 'luxury-bags', 'archive-reconstruction', 'brand-identity']) assert.ok(slugs.includes(s), s)
})

test('slugs are unique and URL-safe', () => {
  assert.equal(new Set(slugs).size, slugs.length)
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/)
})

test('every project has a known type and only known disciplines', () => {
  const types = TYPES.map(t => t.id), discs = DISCIPLINES.map(d => d.id)
  for (const p of projects) {
    assert.ok(types.includes(p.type), `${p.slug}: type ${p.type}`)
    for (const d of p.disciplines || []) assert.ok(discs.includes(d), `${p.slug}: discipline ${d}`)
  }
})

test('self-initiated concepts say so', () => {
  for (const p of projects.filter(p => p.type === 'concept')) {
    const status = (p.facts || []).find(([k]) => k === 'Status')?.[1] || ''
    assert.match(status, /self-initiated/i, p.slug)
  }
})

test('every image a project uses has been processed by npm run images', () => {
  for (const p of projects) for (const key of images(p)) assert.ok(media[key], `${p.slug}: ${key} missing from media.json`)
  for (const [key, m] of Object.entries(media)) for (const w of m.widths) assert.ok(existsSync(new URL(`../public/work/${key}-${w}.webp`, import.meta.url)), `${key}-${w}`)
})

test('section ids are unique within a project, and related projects exist', () => {
  for (const p of projects) {
    const ids = (p.sections || []).map(s => s.id)
    assert.equal(new Set(ids).size, ids.length, p.slug)
    for (const r of p.related || []) assert.ok(slugs.includes(r), `${p.slug} → ${r}`)
  }
})

test('the résumé and downloads linked from the site exist', () => {
  assert.ok(existsSync(new URL(`../public${site.resume.href}`, import.meta.url)))
})
