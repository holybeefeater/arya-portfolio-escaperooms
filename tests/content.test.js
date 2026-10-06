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

test('duffle nesting: pieces do not overlap, and the yield matches her bill of materials', () => {
  const { pieces, allowance } = content.bags.nesting
  assert.equal(pieces.length, 13)
  for (let i = 0; i < pieces.length; i++) {
    const [, x, y, w, h] = pieces[i]
    assert.ok(x >= 0 && y >= 0 && x + w <= 95 + 1e-9, `${pieces[i][0]} sits on the 95 cm hide`)
    for (let j = i + 1; j < pieces.length; j++) {
      const [, x2, y2, w2, h2] = pieces[j]
      const apart = x + w <= x2 || x2 + w2 <= x || y + h <= y2 || y2 + h2 <= y
      assert.ok(apart, `${pieces[i][0]} overlaps ${pieces[j][0]}`)
    }
  }
  const area = pieces.reduce((s, [, , , w, h]) => s + w * h, 0) / 100
  assert.equal(Math.round(area * 10) / 10, 61.5)
  // the duffle's suede line on its bill of materials is 70 dm²
  assert.equal(allowance, Number(content.bags.pieces[0].bom[0][1].replace(/[^\d.]/g, '')))
  assert.equal(Math.round((area / allowance) * 100), 88)
})

test('every stop in the day uses a real bag and a real carry mode', () => {
  const bags = content.bags.pieces.map(p => p.name)
  const modes = content.bags.carry.map(c => c.id)
  assert.equal(modes.length, 5)
  for (const s of content.bags.day) {
    assert.ok(bags.includes(s.bag), s.bag)
    assert.ok(modes.includes(s.mode), s.mode)
  }
})

test('one key per room, and the suede area in the passport adds up', () => {
  assert.deepEqual(content.keys.map(k => k.id), ['jacket', 'bags', 'boots'])
  const suede = content.bags.pieces.reduce((s, p) => s + Number(p.bom[0][1].replace(/[^\d.]/g, '')), 0)
  assert.equal(suede, 165)
  assert.match(content.hides[0].passport.area, /^165 dm²/)
})
