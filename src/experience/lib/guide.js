// The scroll guide: while a section holds the page still (the room, the bags,
// the boots), it says what is happening, shows how far along you are, and
// offers a Skip button that jumps straight to where normal scrolling resumes.

let state = { id: null, title: '', detail: '', progress: 0, skipText: 'Skip', skip: null }
const listeners = new Set()

export const guide = {
  set(next) { state = { ...state, ...next }; listeners.forEach(fn => fn(state)) },
  hide(id) { if (state.id === id) guide.set({ id: null }) },
  subscribe(fn) { listeners.add(fn); fn(state); return () => { listeners.delete(fn) } },
}

const find = next => (typeof next === 'string' ? document.querySelector(next) : next?.current || next || null)

// Returns ScrollTrigger callbacks that keep the guide in step with one held section.
//   label(progress) -> [title, detail]
//   next            -> the element (or selector) where normal scrolling resumes
//   showAtStart     -> show the guide before any scrolling (used for the first room)
export function guideFor(id, { label, skipText, next, showAtStart = false }) {
  let trigger = null
  // An instant jump: measured from the page, so nothing can interrupt it
  // (a smooth glide can be cancelled by trackpad momentum).
  const skip = () => {
    const el = find(next)
    const y = el ? el.getBoundingClientRect().top + window.scrollY : trigger ? trigger.end + 2 : null
    if (y == null) return
    guide.hide(id)
    window.scrollTo(0, Math.ceil(y) + 1)
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
  }
  const report = self => {
    trigger = self
    const p = self.progress
    const show = p < 0.999 && (self.isActive || (showAtStart && p < 0.001))
    if (!show) return guide.hide(id)
    const [title, detail] = label(p)
    guide.set({ id, title, detail, progress: p, skipText, skip })
  }
  return { onUpdate: report, onToggle: report, onRefresh: report }
}
