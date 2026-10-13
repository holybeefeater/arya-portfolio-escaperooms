import { createContext, useContext } from 'react'
import { reducedMotion } from './motion'

// Shared scroll state. Sections wait for `ready` before creating their ScrollTriggers.
// Scrolling is the browser's own; nothing intercepts the wheel or trackpad.
export const ScrollCtx = createContext({ ready: false, smoother: null, calm: false, openSheets: () => {} })
export const useScroll = () => useContext(ScrollCtx)

// Menu links: glide for short trips, jump for long ones (so nothing can stall halfway).
export function scrollToTarget(_unused, target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY)
  const far = Math.abs(y - window.scrollY) > window.innerHeight * 2.5
  window.scrollTo({ top: y, behavior: far || reducedMotion() ? 'auto' : 'smooth' })
}
