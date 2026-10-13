import media from '../media.json'
import { siteRoot } from '../../shared/projects'

// Paths in content.js ('assets/…') → URLs that work locally and on any host.
export const url = path => siteRoot() + String(path).replace(/^\/+/, '')

// An image from public/assets/auxin/img/, by name, with both sizes for srcset.
export function img(name) {
  const m = media[name]
  if (!m) { console.warn('[auxin] no image named', name); return { src: '', width: 1, height: 1 } }
  const big = url(`assets/auxin/img/${name}.webp`)
  const small = url(`assets/auxin/img/${name}-s.webp`)
  return {
    src: big,
    srcSet: m.sw < m.w ? `${small} ${m.sw}w, ${big} ${m.w}w` : undefined,
    width: m.w, height: m.h, alpha: m.alpha,
  }
}
