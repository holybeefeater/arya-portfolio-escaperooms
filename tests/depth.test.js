import { test } from 'node:test'
import assert from 'node:assert/strict'
import { boxBlur, softBlur, reliefFromAlpha, fitScale } from '../src/lib/depth.js'

test('box blur keeps a flat field flat and spreads a point', () => {
  const w = 21, h = 21
  const flat = new Float32Array(w * h).fill(0.5)
  for (const v of boxBlur(flat, w, h, 3)) assert.ok(Math.abs(v - 0.5) < 1e-6)
  const dot = new Float32Array(w * h); dot[10 * w + 10] = 1
  const out = boxBlur(dot, w, h, 2)
  let sum = 0; for (const v of out) sum += v
  assert.ok(Math.abs(sum - 1) < 1e-6, 'energy is preserved away from the edges')
  assert.ok(out[10 * w + 12] > 0 && out[10 * w + 13] === 0, 'radius is respected')
})

test('relief map is normalised and encodes the silhouette in blue', () => {
  const w = 40, h = 40
  const a = new Float32Array(w * h)
  for (let y = 10; y < 30; y++) for (let x = 10; x < 30; x++) a[y * w + x] = 1
  const r = reliefFromAlpha(a, w, h)
  assert.equal(r.length, w * h * 4)
  let peak = 0; for (let i = 0; i < w * h; i++) peak = Math.max(peak, r[i * 4])
  assert.equal(peak, 255)
  assert.equal(r[(20 * w + 20) * 4 + 2], 255)
  assert.equal(r[(0 * w + 0) * 4 + 2], 0)
  assert.equal(softBlur(a, w, h, 2).length, w * h)
})

test('fitScale: contain keeps the whole image, cover fills the frame', () => {
  // a tall image in a wide plate: contain shrinks the width
  const [cx, cy] = fitScale(400, 200, 100, 200, 'contain', 0)
  assert.equal(cy, 1); assert.equal(cx, 4)
  // cover on the same pair crops top and bottom instead
  const [vx, vy] = fitScale(400, 200, 100, 200, 'cover')
  assert.equal(vx, 1); assert.equal(vy, 0.25)
  // padding shrinks the image box on both axes
  const [px, py] = fitScale(100, 100, 100, 100, 'contain', 0.1)
  assert.ok(Math.abs(px - 1.25) < 1e-9 && Math.abs(py - 1.25) < 1e-9)
})

import { fitTransform, frameDistance } from '../src/lib/fit.js'

test('fitTransform stands a model on the floor, centred, at the right size', () => {
  // a 2 m tall coat, off-centre and floating: largest side becomes 1.6
  const f = fitTransform([1, 0.5, -2], [2, 2.5, -1.5], 1.6)
  assert.equal(f.scale, 0.8)
  assert.deepEqual(f.position, [-1.5, -0.5, 1.75])
  assert.ok(Math.abs(f.height - 1.6) < 1e-9 && Math.abs(f.width - 0.8) < 1e-9)
})

test('frameDistance backs off for wide objects on narrow screens', () => {
  const wide = frameDistance(1.6, 0.6, 30, 0.5)
  const tall = frameDistance(0.6, 1.6, 30, 0.5)
  assert.ok(wide > tall, 'a wide boot on a phone needs more distance than a tall jacket')
  assert.ok(frameDistance(1, 1, 30, 1) > 0)
})
