import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as content from '../src/content.js'

const publicPath = p => fileURLToPath(new URL('../public/' + p, import.meta.url))

function collectPaths(value, out = []) {
  if (typeof value === 'string' && /^(assets|downloads)\//.test(value)) out.push(value)
  else if (Array.isArray(value)) value.forEach(v => collectPaths(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach(v => collectPaths(v, out))
  return out
}

test('every image, film and download named in content.js exists in /public', () => {
  const paths = collectPaths(content)
  assert.ok(paths.length > 40, `expected many asset paths, found ${paths.length}`)
  const missing = paths.filter(p => !existsSync(publicPath(p)))
  assert.deepEqual(missing, [])
})

test('portfolio pages referenced by the sheet viewer exist', () => {
  for (const room of [content.jacket, content.bags, content.boots]) {
    for (const n of content.sheetsFor(room.sheets)) assert.ok(existsSync(publicPath(content.pageSrc(n))), `page ${n}`)
  }
})

test('bills of materials add up from their line items', () => {
  const [duffle, tbase, drawstring, hobo] = content.bags.pieces
  assert.equal(content.bomTotal(tbase.bom), 587.5)
  assert.equal(content.bomTotal(hobo.bom), 353.5)
  assert.equal(content.bomTotal(content.boots.bom), 780)
  // These two differ from the totals printed on Aditi's sheets (969 and 870): see README.
  assert.equal(content.bomTotal(duffle.bom), 989)
  assert.equal(content.bomTotal(drawstring.bom), 810)
})

test('rupee formatting', () => {
  assert.equal(content.rupees(989), '₹989')
  assert.equal(content.rupees(587.5), '₹587.50')
})

test('jacket hotspots sit inside the photograph', () => {
  for (const h of content.jacket.hotspots) {
    assert.ok(h.x >= 0 && h.x <= 1 && h.y >= 0 && h.y <= 1, h.label)
  }
})

test('each hide has a shadow and a matching project', () => {
  const rooms = ['bags', 'jacket', 'boots']
  for (const h of content.hides) {
    assert.ok(rooms.includes(h.from), h.id)
    assert.ok(existsSync(publicPath(h.shadow)), h.shadow)
  }
})
