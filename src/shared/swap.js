import { gsap } from 'gsap'
import { byId, hrefOf } from './projects'

// ─────────────────────────────────────────────────────────────────────────────
//  Moving between collections. Each is a separate page, so the switch is a real
//  navigation with its own address. A cover in the next collection's colours
//  closes over the page, the browser navigates, and the new page opens the same
//  cover. The inline script in each index.html paints that colour before any
//  JavaScript runs, so nothing flashes in between.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'aa-swap'
const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// a full-screen cover; `grow` is an SVG ground line with a soft wave, `shutter` a slatted door
function makeCover(p) {
  const el = document.createElement('div')
  el.className = `swap swap--${p.cover.kind}`
  el.setAttribute('aria-hidden', 'true')
  el.style.setProperty('--swap-bg', p.cover.bg)
  el.style.setProperty('--swap-ink', p.cover.ink)
  el.innerHTML = p.cover.kind === 'grow'
    ? `<svg class="swap-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="swap-fill" /><path class="swap-vein" /></svg>
       <p class="swap-label"><span class="swap-title">${p.title}</span><span class="swap-sub">${p.season}</span></p>`
    : `<div class="swap-door swap-door--top"></div><div class="swap-door swap-door--bottom"></div><div class="swap-tube"></div>
       <p class="swap-label"><span class="swap-title">${p.title}</span><span class="swap-sub">${p.season}</span></p>`
  document.body.appendChild(el)
  return el
}

// p = 0: page fully visible; p = 1: fully covered. The edge rises with a wave
// that is strongest halfway, like growth that leans and then settles.
function drawGrow(el, p, phase = 0) {
  const fill = el.querySelector('.swap-fill'), vein = el.querySelector('.swap-vein')
  const base = 100 - p * 116
  const amp = 9 * Math.sin(Math.PI * Math.min(1, p))
  let d = 'M0,100 L0,' + (base + amp * Math.sin(phase)).toFixed(2)
  for (let x = 4; x <= 100; x += 4) d += ` L${x},${(base + amp * Math.sin(x * 0.075 + phase)).toFixed(2)}`
  fill.setAttribute('d', d + ' L100,100 Z')
  // one stitched vein up the middle, a little ahead of the edge
  const top = Math.max(-5, base - 8)
  vein.setAttribute('d', `M50,100 C50,${(100 + top) / 2} ${50 + amp * 0.6},${top + 10} ${50 + amp * 0.4},${top}`)
}

export function swapTo(id) {
  const p = byId(id)
  if (!p) return
  const go = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ to: id, t: Date.now() })) } catch (e) { /* private mode: no cover on arrival */ }
    window.location.href = hrefOf(p)
  }
  if (calm()) return go()
  const el = makeCover(p)
  const label = el.querySelector('.swap-label')
  const tl = gsap.timeline({ onComplete: go })
  if (p.cover.kind === 'grow') {
    const s = { p: 0 }
    drawGrow(el, 0)
    tl.to(s, { p: 1, duration: 0.95, ease: 'power3.inOut', onUpdate: () => drawGrow(el, s.p, s.p * 2.2) })
  } else {
    tl.fromTo(el.querySelector('.swap-door--top'), { yPercent: -100 }, { yPercent: 0, duration: 0.75, ease: 'power3.in' })
      .fromTo(el.querySelector('.swap-door--bottom'), { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'power3.in' }, '<')
      .fromTo(el.querySelector('.swap-tube'), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.3 }, '-=0.15')
  }
  tl.fromTo(label, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.35').to({}, { duration: 0.12 })
}

// Did the visitor arrive here through the toggle? (Read once, before anything renders.)
export function arriving(id) {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('swap-in')
    && document.documentElement.dataset.swapTo === id
}

// Open the cover the inline script painted. Safe to call when there is none.
export function reveal(id) {
  const html = document.documentElement
  try { sessionStorage.removeItem(KEY) } catch (e) { /* ignore */ }
  if (!html.classList.contains('swap-in')) return
  const p = byId(id)
  const done = () => html.classList.remove('swap-in')
  if (!p || calm()) { done(); return }
  const el = makeCover(p)
  const label = el.querySelector('.swap-label')
  done()
  if (p.cover.kind === 'grow') {
    const tl = gsap.timeline({ onComplete: () => el.remove() })
    tl.set(label, { opacity: 1 }).to(label, { opacity: 0, y: -10, duration: 0.3, delay: 0.15 })
    const s = { p: 1 }
    drawGrow(el, 1, 2.2)
    tl.to(s, { p: 0, duration: 1.05, ease: 'power3.inOut', onUpdate: () => drawGrow(el, s.p, 2.2 + (1 - s.p) * 2) }, '-=0.1')
  } else {
    // the doors open with CSS transitions: they run off the main thread, so they stay
    // smooth while the arriving page is still busy building its 3D room
    el.classList.add('is-closed')
    label.style.opacity = '1'
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-opening')))
    setTimeout(() => el.remove(), 1800)
  }
}

// Back/forward cache: a page restored mid-cover should not stay covered.
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return
    document.querySelectorAll('.swap').forEach(el => el.remove())
    document.documentElement.classList.remove('swap-in')
  })
}

const fetched = new Set()
export function prefetch(id) {
  const p = byId(id)
  if (!p || fetched.has(id)) return
  fetched.add(id)
  const l = document.createElement('link')
  l.rel = 'prefetch'
  l.href = hrefOf(p)
  document.head.appendChild(l)
}
