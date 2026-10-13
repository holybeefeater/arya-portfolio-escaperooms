// Framing maths for the 3D viewer, kept free of three.js so it can be unit-tested.
// Given a model's bounding box, returns how to scale and move it so that its
// largest side is `fit` units, it is centred left-right and front-back, and it
// stands on the floor.
export function fitTransform(min, max, fit = 1.6) {
  const dx = max[0] - min[0], dy = max[1] - min[1], dz = max[2] - min[2]
  const largest = Math.max(dx, dy, dz) || 1
  const scale = fit / largest
  return {
    scale,
    position: [-(min[0] + max[0]) / 2, -min[1], -(min[2] + max[2]) / 2],
    width: Math.max(dx, dz) * scale,
    height: dy * scale,
  }
}

// Camera distance that keeps an object of this width and height in frame.
export function frameDistance(width, height, fovDeg, aspect, margin = 1.24) {
  const t = Math.tan((fovDeg * Math.PI) / 360)
  return Math.max((height * margin) / (2 * t), (width * margin) / (2 * t * aspect))
}
