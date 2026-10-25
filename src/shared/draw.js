// Lines drawn by hand, shared by both collections' marks on photographs.

export const f = n => Math.round(n * 10) / 10

// A smooth line through points (Catmull-Rom, as cubic Béziers).
export function smooth(pts) {
  if (pts.length < 2) return ''
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`
  }
  return d
}

// A loop drawn by hand: a little more than one turn, wobbling, not quite closed.
export function loop(cx, cy, rx, ry, seed = 1) {
  const pts = [], a0 = -2.3 + seed * 0.9, turn = Math.PI * 2 * 1.1
  for (let k = 0; k <= 32; k++) {
    const t = k / 32, a = a0 + turn * t
    const w = 1 + 0.035 * Math.sin(a * 3 + seed) + 0.06 * t
    pts.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w])
  }
  return smooth(pts)
}
