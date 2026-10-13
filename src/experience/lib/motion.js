import { useEffect, useState } from 'react'

const mq = q => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(q).matches
export const reducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const finePointer = () => mq('(hover: hover) and (pointer: fine)')

export function useReducedMotion() {
  const [calm, setCalm] = useState(reducedMotion)
  useEffect(() => {
    if (!window.matchMedia) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setCalm(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return calm
}
