import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as ax from '../src/auxin/content.js'
import { projects } from '../src/shared/projects.js'

const root = p => fileURLToPath(new URL('../' + p, import.meta.url))
const media = JSON.parse(readFileSync(root('src/auxin/media.json'), 'utf8'))

// every { img: '…' } and 'assets/…' path anywhere in the Auxin content
function walk(v, imgs = [], paths = []) {
  if (typeof v === 'string' && /^assets\//.test(v)) paths.push(v)
  else if (Array.isArray(v)) v.forEach(x => walk(x, imgs, paths))
  else if (v && typeof v === 'object') {
    if (typeof v.img === 'string') imgs.push(v.img)
    Object.values(v).forEach(x => walk(x, imgs, paths))
  }
  return { imgs, paths }
}

test('every image named in the Auxin content has both web sizes', () => {
  const { imgs } = walk(ax)
  assert.ok(imgs.length > 25, `expected many images, found ${imgs.length}`)
  const missing = imgs.filter(n => !media[n] || !existsSync(root(`public/assets/auxin/img/${n}.webp`)) || !existsSync(root(`public/assets/auxin/img/${n}-s.webp`)))
  assert.deepEqual(missing, [])
})

test('every texture and moving still exists', () => {
  const { paths } = walk(ax)
  assert.ok(paths.some(p => p.endsWith('.mp4')) && paths.some(p => p.includes('/tex/')))
  assert.deepEqual(paths.filter(p => !existsSync(root('public/' + p))), [])
  for (const m of ['leather', 'stripe', 'pleat']) {
    assert.ok(existsSync(root(`public/assets/auxin/tex/${m}.jpg`)) && existsSync(root(`public/assets/auxin/tex/${m}-n.jpg`)), m)
  }
})

test('costing totals match the totals printed on her sheets', () => {
  assert.equal(ax.sum(ax.jacket.costing), 2460)
  assert.equal(ax.sum(ax.jacket.trousers.costing), 1090)
  assert.equal(ax.sum(ax.cowboy.costing), 1362)
  // the rivet line: 66 rivets at ₹2
  const rivets = ax.cowboy.costing.find(r => /rivet/i.test(r[0]))
  assert.equal(rivets[3], ax.cowboy.rivets * 2)
})

test('calf boot estimates are ranges, low below high', () => {
  for (const [name, lo, hi] of ax.calf.estimate) assert.ok(lo < hi, name)
})

test('chapters and pieces have unique anchors', () => {
  const ids = [...ax.chapters.map(c => c.id), ...ax.leaves.map(l => l.id), 'top', 'about', 'contact']
  assert.equal(new Set(ids).size, ids.length)
})

test('detail markers sit inside the final design image', () => {
  for (const d of ax.jacket.details) assert.ok(d.x >= 0 && d.x <= 1 && d.y >= 0 && d.y <= 1, d.label)
})

test('every collection in the toggle has its own page and arrival script', () => {
  const ids = new Set()
  for (const p of projects) {
    assert.ok(!ids.has(p.id), 'duplicate id ' + p.id); ids.add(p.id)
    const html = readFileSync(root((p.path || '') + 'index.html'), 'utf8')
    assert.ok(html.includes(`s.to==='${p.id}'`), `${p.path}index.html paints the cover for ${p.id}`)
    assert.ok(['grow', 'shutter'].includes(p.cover.kind))
  }
  const vite = readFileSync(root('vite.config.js'), 'utf8')
  for (const p of projects.filter(p => p.path)) assert.ok(vite.includes(`'${p.path}index.html'`), `vite input for ${p.path}`)
})

test('every specification link names a real row and one of the room’s photographs', () => {
  const rooms = [
    [ax.jacket.spec, ax.jacket.links, ax.jacket.proof],
    [ax.jacket.trousers.spec, ax.jacket.trousers.links, ax.jacket.proof],
    [ax.calf.spec, ax.calf.links, ax.calf.proof],
    [ax.cowboy.spec, ax.cowboy.links, ax.cowboy.proof],
  ]
  for (const [spec, links, proof] of rooms) {
    for (const [row, [name, x, y]] of Object.entries(links)) {
      assert.ok(spec.some(r => r[0] === row), `no specification row "${row}"`)
      assert.ok(proof.some(p => p.img === name), `${row}: ${name} is not beside this specification`)
      assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1, `${row}: point outside the photograph`)
    }
  }
})

test('every room opens on photographs, and every shoot photograph has alt text', () => {
  for (const l of ax.leaves) {
    assert.ok(['left', 'right'].includes(l.open.side), l.id)
    if (l.open.second.focus) assert.ok(l.open.second.focus.every(v => v >= 0 && v <= 1), l.id)
    for (const p of [l.open.lead, l.open.second, ...[].concat(l.pause || l.made), ...l.proof]) assert.ok(p.img && p.alt && p.alt.length > 20, `${l.id}: ${p.img}`)
  }
  assert.ok(ax.bloom.hero.alt.length > 20)
})

test('Bloom: every print sits on its spread, with alt text, and its marks on the print', () => {
  const unit = v => v >= 0 && v <= 1
  for (const a of ax.bloom.acts) {
    assert.ok(['shade', 'palette', ''].includes(a.light), a.id)
    assert.ok(['chalk', 'thread', 'grease'].includes(a.tool), a.id)
    const items = [...a.frames, ...(a.finale ? [a.finale] : [])]
    for (const f of items) {
      const [x, y, w] = f.at, name = f.img || f.pair.map(t => t.img).join(' + ')
      assert.ok(x >= 0 && w > 0 && x + w <= 100.5 && y >= 0 && y < a.h, `${a.id}: ${name} is off its spread`)
      assert.ok(f.m[0] > 0 && f.m[0] <= 100 && ['l', 'r', 'c'].includes(f.m[1]), `${a.id}: ${name} has no place on a phone`)
      if (f.fix) assert.ok(['pins', 'stitch', 'rivets', 'tape'].includes(f.fix), name)
      for (const p of f.pair || [f]) {
        assert.ok(p.alt && p.alt.length > 20, `${a.id}: ${p.img} needs alt text`)
        if (p.crop) assert.ok(p.crop.zoom > 1 && unit(p.crop.x) && unit(p.crop.y), p.img)
      }
      for (const m of f.marks || []) {
        const pts = m.circle ? [m.circle.slice(0, 2)] : m.line || m.measure || (m.brackets && [m.brackets.slice(0, 2), m.brackets.slice(2)])
        assert.ok(pts && pts.flat().every(unit) && (!m.at || m.at.every(unit)), `${a.id}: a mark is off ${f.img}`)
      }
    }
    for (const [x, y] of a.thread || []) assert.ok(x >= 0 && x <= 100 && y >= 0 && y <= a.h, `${a.id}: the thread leaves its spread`)
  }
})

test('Bloom: the ground lightens act by act, from shade to sun', () => {
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) }
  const tones = ax.bloom.acts.map(a => lum(a.tone))
  assert.deepEqual([...tones].sort((p, q) => p - q), tones)
  assert.equal(ax.bloom.acts.at(-1).ink, 'dark')
})

test('every shoot photograph has been through the media script', () => {
  const shoot = readdirSync(root('media/auxin/shoot')).map(f => f.replace(/\.[^.]+$/, ''))
  assert.ok(shoot.length > 0)
  assert.deepEqual(shoot.filter(n => !media[n]), [])
})
