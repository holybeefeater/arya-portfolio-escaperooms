// Shaders for the shared "stage": every product photograph on the site is drawn
// as a small relief mesh and lit by the visitor's cursor.
//
// Written for THREE.ShaderMaterial (GLSL 3 via three's prelude): three supplies
// position, uv, modelViewMatrix and projectionMatrix, and maps texture2D/gl_FragColor.
// Colour is kept in the photograph's own (sRGB) space so that, at rest, each image
// is drawn exactly as photographed.

export const plateVertex = /* glsl */ `
uniform sampler2D uDepth;
uniform vec2 uScale;     // plate uv -> image uv
uniform float uLift;     // relief height in pixels
uniform float uHover;
uniform float uCutout;   // 1 for cut-out objects, 0 for full-frame photographs
varying vec2 vUv;
varying vec2 vImg;
varying float vDepth;

void main() {
  vUv = uv;
  vImg = (uv - 0.5) * uScale + 0.5;
  // Keep the image's own frame edge flat, so arms cropped by the photograph stay straight.
  vec2 c = clamp(vImg, 0.0, 1.0);
  float frame = smoothstep(0.0, 0.07, min(min(c.x, 1.0 - c.x), min(c.y, 1.0 - c.y)));
  float d = texture2D(uDepth, c).r * uCutout * frame;
  vDepth = d;
  vec3 p = position;
  p.z += d * uLift * (0.3 + 0.7 * uHover);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

export const plateFragment = /* glsl */ `
uniform sampler2D uMap;      // premultiplied alpha
uniform sampler2D uDepth;    // r: wide silhouette blur, g: narrow blur
uniform vec2 uScale;
uniform vec2 uTexel;         // one image pixel, in image uv
uniform vec3 uLight;         // x, y in plate uv; z height
uniform float uAspect;       // plate width / height
uniform float uHover;        // 0 at rest, 1 under the torch
uniform float uCutout;
uniform float uOpacity;
uniform vec3 uLightColor;
uniform vec3 uShadowColor;
varying vec2 vUv;
varying vec2 vImg;
varying float vDepth;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float inside(vec2 p) { vec2 s = step(vec2(0.0), p) * step(p, vec2(1.0)); return s.x * s.y; }

void main() {
  float ins = inside(vImg);
  vec4 texel = texture2D(uMap, vImg) * ins;
  vec3 albedo = texel.a > 0.0001 ? texel.rgb / texel.a : vec3(0.0);

  // Relief normal: fine grain from the photograph, broad form from the silhouette.
  vec2 tx = vec2(uTexel.x, 0.0);
  vec2 ty = vec2(0.0, uTexel.y);
  float hl = luma(texture2D(uMap, vImg - tx).rgb);
  float hr = luma(texture2D(uMap, vImg + tx).rgb);
  float hd = luma(texture2D(uMap, vImg - ty).rgb);
  float hu = luma(texture2D(uMap, vImg + ty).rgb);
  vec2 tw = tx * 6.0;
  vec2 th = ty * 6.0;
  float dl = texture2D(uDepth, vImg - tw).g;
  float dr = texture2D(uDepth, vImg + tw).g;
  float dd = texture2D(uDepth, vImg - th).g;
  float du = texture2D(uDepth, vImg + th).g;
  vec3 n = normalize(vec3(
    (hl - hr) * 3.4 + (dl - dr) * 2.2 * uCutout,
    (hd - hu) * 3.4 + (dd - du) * 2.2 * uCutout,
    1.0));

  // Torch: a point light hovering above the plate.
  vec3 P = vec3(vUv.x * uAspect, vUv.y, vDepth * 0.08);
  vec3 Lp = vec3(uLight.x * uAspect, uLight.y, uLight.z);
  vec3 Lv = Lp - P;
  float dist = length(Lv.xy);
  vec3 L = normalize(Lv);
  float diff = max(dot(n, L), 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float gloss = smoothstep(0.42, 0.95, luma(albedo));
  float spec = pow(max(dot(n, H), 0.0), 38.0) * (0.14 + 1.6 * gloss);
  float fall = 1.0 / (1.0 + dist * dist * 4.5);
  vec3 lit = albedo * mix(1.0, 0.5 + 1.15 * diff * fall + 0.06, uHover)
           + uLightColor * spec * fall * uHover * 0.42;

  // Cast shadow on the wall behind a cut-out, thrown away from the torch.
  vec2 away = vUv - uLight.xy;
  float reach = min(length(away), 0.9);
  vec2 soff = (reach > 0.0001 ? normalize(away) * reach : vec2(0.0)) * (0.03 + 0.045 * uHover);
  vec2 simg = vImg - soff * uScale;
  float sh = texture2D(uDepth, clamp(simg, 0.0, 1.0)).r * inside(simg) * uCutout * (0.26 + 0.2 * uHover);

  float a = texel.a + sh * (1.0 - texel.a);
  vec3 col = (lit * texel.a + uShadowColor * sh * (1.0 - texel.a)) / max(a, 0.0001);
  gl_FragColor = vec4(col, a * uOpacity);
}
`

// Film plates: the finished object at rest; hovering opens a window into the
// process film around the cursor, edged with a thin line of tube light.
export const filmFragment = /* glsl */ `
uniform sampler2D uPoster;
uniform sampler2D uVideo;
uniform vec2 uScale;
uniform vec2 uPointer;
uniform float uAspect;
uniform float uReveal;
uniform float uOpacity;
uniform vec3 uRim;
varying vec2 vUv;
varying vec2 vImg;

void main() {
  vec2 uv = clamp(vImg, 0.0, 1.0);
  vec3 poster = texture2D(uPoster, uv).rgb;
  vec3 film = texture2D(uVideo, uv).rgb;
  vec2 d = (vUv - uPointer) * vec2(uAspect, 1.0);
  float r = uReveal * (1.7 * max(uAspect, 1.0));
  float len = length(d);
  float edge = 0.16;
  float m = 1.0 - smoothstep(r - edge, r, len);
  float band = smoothstep(r - edge, r - edge * 0.5, len) * (1.0 - smoothstep(r - edge * 0.5, r, len));
  float rimAmt = step(0.001, uReveal) * (1.0 - uReveal * 0.7);
  vec3 col = mix(poster, film, m) + uRim * band * 0.35 * rimAmt;
  gl_FragColor = vec4(col, uOpacity);
}
`
