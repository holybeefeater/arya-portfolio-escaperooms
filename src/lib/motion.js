import { useEffect, useState } from 'react'

const mq = q => typeof window !== 'undefined' && window.matchMedia?.(q).matches
export const reducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const finePointer = () => mq('(hover: hover) and (pointer: fine)')

export function useReducedMotion() {
  const [calm, setCalm] = useState(reducedMotion)
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!m) return
    const on = () => setCalm(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return calm
}

// Reveals blocks marked data-reveal as they enter the screen. Content is visible
// without JavaScript and with reduced motion: the hidden state is only applied
// by the class this hook adds.
export function useReveal(root, deps = []) {
  useEffect(() => {
    const el = root.current
    if (!el || reducedMotion() || !('IntersectionObserver' in window)) return
    const items = [...el.querySelectorAll('[data-reveal]:not(.is-in)')]
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }), { root: el.closest('.overlay-scroll') || null, rootMargin: '0px 0px -8% 0px' })
    items.forEach(i => { i.classList.add('will-reveal'); io.observe(i) })
    return () => io.disconnect()
  }, deps)
}
