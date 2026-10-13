// Builds a relief map from a cut-out's alpha channel.
//   red:   wide blur  -> overall form and the soft cast shadow
//   green: narrow blur -> rounded edges for the lighting normal
// Pure functions, so they can be unit-tested in Node.

export function boxBlur(src, w, h, r) {
  if (r < 1) return src.slice()
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const norm = 1 / (2 * r + 1)
  const clampX = x => (x < 0 ? 0 : x >= w ? w - 1 : x)
  const clampY = y => (y < 0 ? 0 : y >= h ? h - 1 : y)
  for (let y = 0; y < h; y++) {
    const row = y * w
    let acc = 0
    for (let x = -r; x <= r; x++) acc += src[row + clampX(x)]
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc * norm
      acc += src[row + clampX(x + r + 1)] - src[row + clampX(x - r)]
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0
    for (let y = -r; y <= r; y++) acc += tmp[clampY(y) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc * norm
      acc += tmp[clampY(y + r + 1) * w + x] - tmp[clampY(y - r) * w + x]
    }
  }
  return out
}

// Three box passes approximate a gaussian.
export function softBlur(src, w, h, r) {
  let a = src
  for (let i = 0; i < 3; i++) a = boxBlur(a, w, h, Math.max(1, Math.round(r)))
  return a
}

// alpha: Float32Array in 0..1, row-major from the top. Returns RGBA bytes, same orientation.
export function reliefFromAlpha(alpha, w, h) {
  const size = Math.max(w, h)
  const wide = softBlur(alpha, w, h, size * 0.022)
  const narrow = softBlur(alpha, w, h, size * 0.006)
  let peak = 0
  for (let i = 0; i < wide.length; i++) if (wide[i] > peak) peak = wide[i]
  const k = peak > 0 ? 1 / peak : 1
  const out = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    // ease the wide blur so the object reads as a cushion, not a cone
    const f = Math.min(1, wide[i] * k)
    out[i * 4] = Math.round(255 * (1 - (1 - f) * (1 - f)))
    out[i * 4 + 1] = Math.round(255 * narrow[i])
    out[i * 4 + 2] = Math.round(255 * alpha[i])
    out[i * 4 + 3] = 255
  }
  return out
}

// Browser helper: image element -> canvas holding the relief map (max 256 px).
export function reliefCanvas(image, maxSide = 256) {
  const s = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height))
  const w = Math.max(2, Math.round((image.naturalWidth || image.width) * s))
  const h = Math.max(2, Math.round((image.naturalHeight || image.height) * s))
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0, w, h)
  const px = ctx.getImageData(0, 0, w, h).data
  const alpha = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) alpha[i] = px[i * 4 + 3] / 255
  const relief = reliefFromAlpha(alpha, w, h)
  ctx.putImageData(new ImageData(relief, w, h), 0, 0)
  return c
}

// How a plate maps onto its image. mode 'contain' keeps the whole object with padding;
// 'cover' fills the frame. Returns the scale that turns plate uv into image uv.
export function fitScale(plateW, plateH, imgW, imgH, mode = 'contain', pad = 0) {
  const pa = plateW / plateH
  const ia = imgW / imgH
  if (mode === 'cover') {
    return pa > ia ? [1, ia / pa] : [pa / ia, 1]
  }
  const box = 1 - 2 * pad
  const fw = pa > ia ? (ia / pa) * box : box
  const fh = pa > ia ? box : (pa / ia) * box
  return [1 / fw, 1 / fh]
}
