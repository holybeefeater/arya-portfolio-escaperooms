import * as THREE from 'three'

// Tileable surface maps for the three hides of Escape Rooms, generated on the device
// (no image files). Each is a height field turned into a normal map.
//   suede  -> short fibrous nap (fractal noise)
//   pebble -> sheep nappa's soft domed grain (Worley F1)
//   crackle-> oil pull-up's creased, tumbled surface (Worley F2 - F1 ridges)

function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

function valueNoise(size, period, seed) {
  const r = rng(seed)
  const lattice = new Float32Array(period * period)
  for (let i = 0; i < lattice.length; i++) lattice[i] = r()
  const out = new Float32Array(size * size)
  const smooth = t => t * t * (3 - 2 * t)
  for (let y = 0; y < size; y++) {
    const gy = (y / size) * period
    const y0 = Math.floor(gy) % period
    const y1 = (y0 + 1) % period
    const ty = smooth(gy - Math.floor(gy))
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * period
      const x0 = Math.floor(gx) % period
      const x1 = (x0 + 1) % period
      const tx = smooth(gx - Math.floor(gx))
      const a = lattice[y0 * period + x0], b = lattice[y0 * period + x1]
      const c = lattice[y1 * period + x0], d = lattice[y1 * period + x1]
      out[y * size + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty
    }
  }
  return out
}

function worley(size, cells, seed) {
  const r = rng(seed)
  const pts = new Float32Array(cells * cells * 2)
  for (let i = 0; i < cells * cells; i++) { pts[i * 2] = r(); pts[i * 2 + 1] = r() }
  const f1 = new Float32Array(size * size)
  const ridge = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    const gy = (y / size) * cells
    const iy = Math.floor(gy)
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells
      const ix = Math.floor(gx)
      let d1 = 9, d2 = 9
      for (let oy = -1; oy <= 1; oy++) {
        const cy = (iy + oy + cells) % cells
        for (let ox = -1; ox <= 1; ox++) {
          const cx = (ix + ox + cells) % cells
          const k = (cy * cells + cx) * 2
          const dx = gx - (ix + ox + pts[k])
          const dy = gy - (iy + oy + pts[k + 1])
          const d = dx * dx + dy * dy
          if (d < d1) { d2 = d1; d1 = d } else if (d < d2) d2 = d
        }
      }
      const s1 = Math.sqrt(d1)
      f1[y * size + x] = s1
      ridge[y * size + x] = Math.sqrt(d2) - s1
    }
  }
  return { f1, ridge }
}

function toNormalTexture(height, size, strength) {
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    const yu = ((y + 1) % size) * size
    const yd = ((y - 1 + size) % size) * size
    for (let x = 0; x < size; x++) {
      const xr = (x + 1) % size
      const xl = (x - 1 + size) % size
      const dx = (height[y * size + xr] - height[y * size + xl]) * strength
      const dy = (height[yu + x] - height[yd + x]) * strength
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1)
      const i = (y * size + x) * 4
      data[i] = Math.round((-dx * inv * 0.5 + 0.5) * 255)
      data[i + 1] = Math.round((-dy * inv * 0.5 + 0.5) * 255)
      data[i + 2] = Math.round((inv * 0.5 + 0.5) * 255)
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}

const makers = {
  suede(size) {
    const a = valueNoise(size, 64, 11), b = valueNoise(size, 128, 12), c = valueNoise(size, 256, 13)
    const h = new Float32Array(size * size)
    for (let i = 0; i < h.length; i++) h[i] = a[i] * 0.45 + b[i] * 0.35 + c[i] * 0.2
    return toNormalTexture(h, size, 2.2)
  },
  pebble(size) {
    const { f1 } = worley(size, 26, 21)
    const n = valueNoise(size, 96, 22)
    const h = new Float32Array(size * size)
    for (let i = 0; i < h.length; i++) {
      const d = Math.min(1, f1[i] * 1.35)
      h[i] = (1 - d * d) * 0.85 + n[i] * 0.15
    }
    return toNormalTexture(h, size, 3.4)
  },
  crackle(size) {
    const { ridge } = worley(size, 13, 31)
    const fine = worley(size, 34, 32).ridge
    const n = valueNoise(size, 48, 33)
    const h = new Float32Array(size * size)
    for (let i = 0; i < h.length; i++) {
      const crease = Math.min(1, ridge[i] / 0.14)
      const small = Math.min(1, fine[i] / 0.1)
      h[i] = crease * 0.62 + small * 0.2 + n[i] * 0.18
    }
    return toNormalTexture(h, size, 4.2)
  },
}

const cache = new Map()
export function leatherNormal(kind, size = 512) {
  if (!cache.has(kind)) cache.set(kind, makers[kind](size))
  return cache.get(kind)
}
export function disposeLeather() {
  for (const t of cache.values()) t.dispose()
  cache.clear()
}
