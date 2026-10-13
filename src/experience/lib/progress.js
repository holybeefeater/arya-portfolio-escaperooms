// The visit, as an escape room keeps it: which rooms you have walked through,
// which keys you have found, and how long you have been inside.
// Nothing on the site is locked behind any of it.

const state = { started: 0, finished: 0, keys: [], route: [], last: null }
const listeners = new Set()
const emit = () => listeners.forEach(fn => fn(state))

export const progress = {
  get: () => state,
  subscribe(fn) { listeners.add(fn); fn(state); return () => { listeners.delete(fn) } },
  start() { if (!state.started) { state.started = Date.now(); emit() } },
  // Returns true the first time a key is found.
  key(id) {
    if (state.keys.includes(id)) return false
    state.keys = [...state.keys, id]
    state.last = id
    emit()
    return true
  },
  visit(id) {
    if (!id || state.route[state.route.length - 1] === id) return
    state.route = [...state.route, id]
    emit()
  },
  // Stops the clock the first time the exit is reached.
  finish() { if (state.started && !state.finished) { state.finished = Date.now(); emit() } },
  elapsed() { return state.started ? (state.finished || Date.now()) - state.started : 0 },
}

export function formatTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(s / 60)
  return m ? `${m}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`
}
