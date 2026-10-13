import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScroll } from './scroll'

gsap.registerPlugin(ScrollTrigger)

// Archivo's width axis as the room's walls: a title arrives pulled in (62%) and
// eases open (100%) as it scrolls into view. Its size is capped so that, fully open,
// it still fits its column.
export function useStretch(ref, { from = 62, to = 100 } = {}) {
  const { ready, calm } = useScroll()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    const fit = () => {
      el.style.fontSize = ''
      el.style.setProperty('--s', to)
      const room = el.parentElement.clientWidth
      const wide = el.scrollWidth
      if (wide > room) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room) / wide}px`
      el.style.setProperty('--s', calm ? to : from)
    }
    fit()
    document.fonts?.ready.then(() => { fit(); ScrollTrigger.refresh() })
    window.addEventListener('resize', fit)
    if (calm) return () => window.removeEventListener('resize', fit)
    const tween = gsap.fromTo(el, { '--s': from }, {
      '--s': to, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 38%', scrub: 0.5 },
    })
    return () => { window.removeEventListener('resize', fit); tween.scrollTrigger?.kill(); tween.kill() }
  }, [ready, calm])
}

// A 0→1 value for a header as it crosses the screen, written to a CSS variable.
export function useReveal(ref, name = '--p', { start = 'top 88%', end = 'top 30%', onDone } = {}) {
  const { ready, calm } = useScroll()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    if (calm) { el.style.setProperty(name, 1); onDone?.(); return }
    const tween = gsap.fromTo(el, { [name]: 0 }, {
      [name]: 1, ease: 'none',
      scrollTrigger: { trigger: el, start, end, scrub: 0.5, onLeave: () => onDone?.() },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [ready, calm])
}
