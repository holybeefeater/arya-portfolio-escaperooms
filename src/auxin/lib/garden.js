import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// ─────────────────────────────────────────────────────────────────────────────
//  The Auxin hero: a stand of cut strips that grow toward the light.
//
//  Each strip is a ribbon of material cropped from Aditi's own photographs:
//  the aqua oil pull-up leather of the jacket, the striped curtain fabric and
//  the teal pleat of the trousers. The light is the visitor (pointer, touch or
//  tilt). Every strip bends along an arc so its tip points toward it, the way
//  auxin bends a stem toward a window. Leather strips have pinked edges and a
//  stitched centre seam ("seams as veins"); brass rings sit at their roots
//  ("hardware as nodes"). The back of the leather shows its flesh side.
// ─────────────────────────────────────────────────────────────────────────────

const SAGE = new THREE.Color('#D6DECE')

const MATERIALS = [
  { id: 'leather', weight: 0.6, rough: 0.6, normal: 0.38, texSize: [0.62, 0.62], flesh: '#56627A', fleshMix: 0.6, stitch: 1, pink: 1, width: [0.11, 0.19] },
  { id: 'stripe', weight: 0.22, rough: 0.86, normal: 0.5, texSize: [0.26, 1.04], flesh: '#AEB89E', fleshMix: 0.35, stitch: 0, pink: 0, width: [0.12, 0.22] },
  { id: 'pleat', weight: 0.18, rough: 0.74, normal: 0.6, texSize: [0.22, 0.76], flesh: '#3E5F6D', fleshMix: 0.3, stitch: 0, pink: 0, width: [0.1, 0.18] },
]

// deterministic random, so the stand is the same on every visit
function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296)
}

const VERT_HEAD = /* glsl */`
attribute vec2 aRoot;
attribute vec4 aShape;   // width, length, twist, phase
attribute float aDelay;
uniform float uTime, uGrow, uLean, uPulse, uRise, uSway;
uniform vec2 uTex;
uniform vec3 uLight;
varying vec4 vStrip;     // across (-0.5..0.5), along (0..1), length, local width
`

const VERT_BEND = /* glsl */`
  float gr = clamp((uGrow * 1.7 - aDelay) / 0.7, 0.0, 1.0);
  gr = gr * gr * (3.0 - 2.0 * gr);
  float len = max(aShape.y * gr * (1.0 + 0.22 * uRise + 0.12 * uPulse), 1e-4);
  float st = position.y;
  float sl = st * len;
  vec3 sroot = vec3(aRoot.x, 0.0, aRoot.y);
  vec3 toL = uLight - (sroot + vec3(0.0, len * 0.45, 0.0));
  float hd = length(toL.xz);
  vec2 dir = hd > 1e-4 ? toL.xz / hd : vec2(0.0, 1.0);
  // bend just enough for the tip to point at the light; nearer light pulls harder
  float elev = atan(toL.y, max(hd, 1e-3));
  float lean = clamp((1.5708 - elev) * uLean, 0.0, 1.4) * mix(0.55, 1.0, smoothstep(10.0, 1.5, length(toL)));
  lean += 0.2 * uPulse;
  float ph = aShape.w;
  float sw = uSway * (sin(uTime * 0.55 + ph) * 0.16 + sin(uTime * 1.27 + ph * 1.7) * 0.05);
  float kc = lean / len;
  float ang = kc * sl;
  float fwd = abs(kc) < 1e-4 ? 0.0 : (1.0 - cos(ang)) / kc;
  float upv = abs(kc) < 1e-4 ? sl : sin(ang) / kc;
  vec3 T = normalize(vec3(dir.x * sin(ang), cos(ang), dir.y * sin(ang)));
  vec3 P = vec3(-dir.y, 0.0, dir.x);
  vec3 N0 = normalize(cross(T, P));
  float tw = aShape.z * st + sin(uTime * 0.4 + ph) * 0.3 * st * uSway;
  vec3 W = P * cos(tw) + N0 * sin(tw);
  vec3 bentNormal = normalize(N0 * cos(tw) - P * sin(tw));
  float taper = mix(1.0, 0.6, st * st);
  vec3 center = sroot + vec3(dir.x * fwd, upv, dir.y * fwd) + P * sw * st * st * len * 0.35;
  vec3 bentPos = center + W * position.x * aShape.x * taper;
  vStrip = vec4(position.x, st, len, aShape.x * taper);
  // texture runs along the strip at the material's real scale
  vec2 stripUv = vec2((position.x + 0.5) * aShape.x * uTex.x + ph, sl * uTex.y + ph * 3.1);
  #ifdef USE_MAP
    vMapUv = stripUv;
  #endif
  #ifdef USE_NORMALMAP
    vNormalMapUv = stripUv;
  #endif
  vec3 objectNormal = bentNormal;
  #ifdef USE_TANGENT
    vec3 objectTangent = vec3( tangent.xyz );
  #endif
`

const FRAG_HEAD = /* glsl */`
varying vec4 vStrip;
uniform vec3 uFlesh, uThread;
uniform float uFleshMix, uStitch, uPink, uDim;
`

const FRAG_CUT = /* glsl */`
  if (vStrip.z < 0.02) discard;
  float across = abs(vStrip.x) * 2.0;
  // pinking-shear zigzag along the edge of the leather
  float edgeLimit = 1.0 - uPink * 0.09 * abs(fract(vStrip.y * vStrip.z * 26.0) - 0.5) * 2.0;
  // a rounded tip
  float hw = vStrip.w * 0.5;
  float dTip = (1.0 - vStrip.y) * vStrip.z;
  if (dTip < hw) edgeLimit *= sqrt(max(0.0, 1.0 - pow((hw - dTip) / hw, 2.0)));
  if (across > edgeLimit) discard;
`

const FRAG_COLOUR = /* glsl */`
  // saddle stitches down the centre: seams as veins
  float dash = step(0.42, fract(vStrip.y * vStrip.z * 15.0));
  float seam = uStitch * dash * (1.0 - smoothstep(0.035, 0.07, across));
  diffuseColor.rgb *= 1.0 - uStitch * 0.22 * (1.0 - smoothstep(0.0, 0.16, across)) * (1.0 - dash);
  diffuseColor.rgb = mix(diffuseColor.rgb, uThread, seam * 0.9);
  // the back of the leather is its flesh side
  if (!gl_FrontFacing) diffuseColor.rgb = mix(diffuseColor.rgb, uFlesh, uFleshMix);
  // other materials step back when one is picked
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.84, 0.87, 0.81), uDim * 0.62);
`

function stripMaterial(def, maps, shared) {
  const mat = new THREE.MeshStandardMaterial({
    map: maps.map, normalMap: maps.normal, roughness: def.rough, metalness: 0,
    side: THREE.DoubleSide, envMapIntensity: def.id === 'leather' ? 0.3 : 0.15,
  })
  mat.normalScale.set(def.normal, def.normal)
  const own = {
    uTex: { value: new THREE.Vector2(1 / def.texSize[0], 1 / def.texSize[1]) },
    uFlesh: { value: new THREE.Color(def.flesh) },
    uThread: { value: new THREE.Color('#E8E2CC') },
    uFleshMix: { value: def.fleshMix }, uStitch: { value: def.stitch }, uPink: { value: def.pink },
    uDim: { value: 0 },
  }
  mat.userData.uniforms = own
  mat.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, shared, own)
    shader.vertexShader = VERT_HEAD + shader.vertexShader
      .replace('#include <beginnormal_vertex>', VERT_BEND)
      .replace('#include <begin_vertex>', 'vec3 transformed = bentPos;')
    shader.fragmentShader = FRAG_HEAD + shader.fragmentShader
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n' + FRAG_CUT)
      .replace('#include <map_fragment>', '#include <map_fragment>\n' + FRAG_COLOUR)
  }
  mat.customProgramCacheKey = () => 'auxin-strip-' + def.id
  return mat
}

const GROUND_VERT = /* glsl */`
varying vec3 vWorld;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`
// Light through water on the ground (a common caustics pattern), brightest under the light.
const GROUND_FRAG = /* glsl */`
uniform float uTime, uMotion, uGrow;
uniform vec3 uLight, uSage, uShade, uGlow;
varying vec3 vWorld;
float caustic(vec2 p, float t) {
  vec2 i = p; float c = 1.0; float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0; c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}
void main() {
  vec2 p = vWorld.xz;
  float r = length(p * vec2(0.42, 0.62));
  float fade = 1.0 - smoothstep(1.2, 3.6, r);
  float under = 1.0 - smoothstep(0.0, 1.6, length((p - vec2(0.0, -0.8)) * vec2(0.4, 0.8)));
  float near = 1.0 - smoothstep(0.0, 3.2, length(p - uLight.xz));
  float c = caustic(p * 1.6, uTime * 0.35 * uMotion + 7.0) * (0.35 + 0.65 * near);
  vec3 col = mix(uSage, uShade, under * 0.5 * uGrow);
  col = mix(col, uGlow, c * 0.55 * fade);
  gl_FragColor = vec4(col, fade * 0.95);
  #include <colorspace_fragment>
}
`

const SPORE_VERT = /* glsl */`
attribute float aSeed;
uniform float uTime, uMotion, uPx;
uniform vec3 uLight;
varying float vA;
void main() {
  vec3 p = position;
  float t = uTime * uMotion;
  p.y = mod(p.y + t * (0.08 + aSeed * 0.12), 5.5);
  p.x += sin(t * 0.3 + aSeed * 40.0) * 0.25;
  // drawn a little toward the light
  p += (uLight - p) * 0.06 * smoothstep(5.0, 0.5, distance(uLight, p));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (1.2 + aSeed * 2.4) / -mv.z;
  vA = smoothstep(0.0, 0.6, p.y) * (1.0 - smoothstep(4.4, 5.4, p.y)) * (0.35 + aSeed * 0.5);
}
`
const SPORE_FRAG = /* glsl */`
varying float vA;
uniform vec3 uColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,250,1)')
  grd.addColorStop(0.18, 'rgba(236,252,244,0.85)')
  grd.addColorStop(0.45, 'rgba(200,236,226,0.25)')
  grd.addColorStop(1, 'rgba(200,236,226,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function loadMaps(loader, base, id) {
  const load = (file, srgb) => new Promise((res, rej) => loader.load(base + file, t => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.MirroredRepeatWrapping
    t.anisotropy = 4
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    res(t)
  }, undefined, rej))
  return Promise.all([load(`${id}.jpg`, true), load(`${id}-n.jpg`, false)]).then(([map, normal]) => ({ map, normal }))
}

export function createGarden(canvas, { texBase, small = false, motion = true, onReady, onLost }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' })
  if (!renderer.getContext()) throw new Error('no WebGL')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(SAGE, 7.5, 17)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)
  const look = new THREE.Vector3(0, 1.75, 0)

  // the light: the visitor
  const lightPos = new THREE.Vector3(1.2, 3.6, 1.2)
  const lightAim = lightPos.clone()
  const point = new THREE.PointLight(0xeffff6, 13, 0, 1.6)
  scene.add(point)
  scene.add(new THREE.HemisphereLight(0xe9f3ec, 0x8f9d84, 0.7))
  const sun = new THREE.DirectionalLight(0xffffff, 0.55)
  sun.position.set(-2, 9, 4)
  scene.add(sun)
  const glowMap = glowTexture()
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  glow.scale.setScalar(0.62)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xcfeee4, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  halo.scale.setScalar(2.4)
  scene.add(glow, halo)

  const shared = {
    uTime: { value: 0 }, uGrow: { value: motion ? 0 : 1 }, uLean: { value: 0.78 }, uPulse: { value: 0 },
    uRise: { value: 0 }, uSway: { value: motion ? 1 : 0 }, uLight: { value: lightPos },
  }

  // the stand
  const rand = rng(20272028)
  const count = small ? 30 : 64
  const strips = []
  for (let i = 0; i < count; i++) {
    let x, z, tries = 0
    do {
      x = (rand() * 2 - 1) * 3.3
      z = -2.7 + rand() * 3.5
      tries++
    } while (tries < 20 && strips.some(s => Math.hypot(s.x - x, s.z - z) < 0.26))
    const centre = 1 - Math.min(1, Math.hypot(x / 3.3, (z + 1) / 2.2))
    let r = rand(), m = 0
    while (m < MATERIALS.length - 1 && r > MATERIALS[m].weight) { r -= MATERIALS[m].weight; m++ }
    const def = MATERIALS[m]
    strips.push({
      x, z, m,
      width: def.width[0] + rand() * (def.width[1] - def.width[0]),
      length: 1.3 + centre * 1.9 + rand() * 0.9,
      twist: (rand() * 2 - 1) * 2.6,
      phase: rand() * 6.283,
      delay: Math.min(1, Math.hypot(x, z + 0.6) / 3.6) * 0.8 + rand() * 0.2,
    })
  }

  const geoBase = new THREE.PlaneGeometry(1, 1, 1, small ? 36 : 56)
  geoBase.translate(0, 0.5, 0)
  const loader = new THREE.TextureLoader()
  const meshes = []
  const rings = []
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xa68b45, metalness: 1, roughness: 0.32, envMapIntensity: 1.2 })
  const ringGeo = new THREE.TorusGeometry(0.085, 0.018, 10, 28)
  ringGeo.rotateX(Math.PI / 2)

  let loaded = false, growStart = 0
  const ready = Promise.all(MATERIALS.map(def => loadMaps(loader, texBase, def.id))).then(maps => {
    MATERIALS.forEach((def, mi) => {
      const list = strips.filter(s => s.m === mi)
      if (!list.length) return
      const geo = new THREE.InstancedBufferGeometry().copy(geoBase)
      geo.instanceCount = list.length
      geo.setAttribute('aRoot', new THREE.InstancedBufferAttribute(new Float32Array(list.flatMap(s => [s.x, s.z])), 2))
      geo.setAttribute('aShape', new THREE.InstancedBufferAttribute(new Float32Array(list.flatMap(s => [s.width, s.length, s.twist, s.phase])), 4))
      geo.setAttribute('aDelay', new THREE.InstancedBufferAttribute(new Float32Array(list.map(s => s.delay)), 1))
      const mesh = new THREE.Mesh(geo, stripMaterial(def, maps[mi], shared))
      mesh.frustumCulled = false
      mesh.userData.id = def.id
      scene.add(mesh)
      meshes.push(mesh)
      if (def.id === 'leather') {
        const inst = new THREE.InstancedMesh(ringGeo, ringMat, list.length)
        const m4 = new THREE.Matrix4()
        list.forEach((s, k) => { m4.makeTranslation(s.x, 0.012, s.z); inst.setMatrixAt(k, m4) })
        inst.userData.list = list
        rings.push(inst)
        scene.add(inst)
      }
    })
    loaded = true
    growStart = performance.now()
    lastGrow = -1
    onReady?.()
    render()
  })

  // ground and spores
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.ShaderMaterial({
    vertexShader: GROUND_VERT, fragmentShader: GROUND_FRAG, transparent: true, depthWrite: false,
    uniforms: {
      uTime: shared.uTime, uMotion: { value: motion ? 1 : 0 }, uGrow: shared.uGrow, uLight: shared.uLight,
      uSage: { value: new THREE.Color('#CDD6C3') }, uShade: { value: new THREE.Color('#9AA78F') }, uGlow: { value: new THREE.Color('#F4FFF8') },
    },
  }))
  ground.rotation.x = -Math.PI / 2
  ground.position.z = -0.8
  ground.renderOrder = -1
  scene.add(ground)

  const sporeCount = small ? 90 : 220
  const sp = new Float32Array(sporeCount * 3), seeds = new Float32Array(sporeCount)
  for (let i = 0; i < sporeCount; i++) {
    sp[i * 3] = (rand() * 2 - 1) * 4.5
    sp[i * 3 + 1] = rand() * 5.5
    sp[i * 3 + 2] = -3 + rand() * 4.5
    seeds[i] = rand()
  }
  const sporeGeo = new THREE.BufferGeometry()
  sporeGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  sporeGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  const spores = new THREE.Points(sporeGeo, new THREE.ShaderMaterial({
    vertexShader: SPORE_VERT, fragmentShader: SPORE_FRAG, transparent: true, depthWrite: false,
    uniforms: { uTime: shared.uTime, uMotion: { value: motion ? 1 : 0 }, uLight: shared.uLight, uPx: { value: 60 * renderer.getPixelRatio() }, uColor: { value: new THREE.Color('#F7FBEF') } },
  }))
  spores.frustumCulled = false
  scene.add(spores)

  // sizing: keep the whole stand in view on any screen shape
  let w = 1, h = 1, rise = 0
  const place = () => {
    const aspect = w / h
    // wide screens see the whole stand; tall ones crop its sides rather than shrink it
    const halfW = aspect < 1 ? 2.2 : 4.1
    const vfov = THREE.MathUtils.degToRad(camera.fov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
    const dist = Math.min(14, Math.max(8.4, halfW / Math.tan(hfov / 2)))
    camera.position.set(0, 1.45 + rise * 2.6, dist - rise * 1.2)
    look.set(0, 1.75 + rise * 3.2, 0)
    camera.lookAt(look)
    scene.fog.near = dist - 1 - rise * 3
    scene.fog.far = dist + 8.6 - rise * 6
  }
  const resize = () => {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, r.width); h = Math.max(1, r.height)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    place()
    render()
  }

  // pointer (in canvas pixels) → a point on a plane just in front of the stand
  const ray = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.1)
  const ndc = new THREE.Vector2()
  const hit = new THREE.Vector3()
  const setLight = (px, py) => {
    ndc.set((px / w) * 2 - 1, -(py / h) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    if (ray.ray.intersectPlane(plane, hit)) {
      lightAim.set(THREE.MathUtils.clamp(hit.x, -5.5, 5.5), THREE.MathUtils.clamp(hit.y, 0.35, 6.5), 1.1)
    }
    if (!motion) { lightPos.copy(lightAim); render() }
  }

  let raf = 0, visible = true, last = performance.now(), dead = false, lastGrow = -1
  function render() {
    if (dead) return
    point.position.copy(lightPos)
    glow.position.copy(lightPos)
    halo.position.copy(lightPos)
    const g = shared.uGrow.value
    if (g !== lastGrow) rings.forEach(inst => {
      const m4 = new THREE.Matrix4()
      inst.userData.list.forEach((s, k) => {
        const gr = THREE.MathUtils.clamp((g * 1.7 - s.delay) / 0.7, 0, 1)
        m4.makeScale(gr, gr, gr).setPosition(s.x, 0.012, s.z)
        inst.setMatrixAt(k, m4)
      })
      inst.instanceMatrix.needsUpdate = true
    })
    lastGrow = g
    renderer.render(scene, camera)
  }
  const loop = now => {
    raf = requestAnimationFrame(loop)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    // on screen? (measured each frame: an observer can miss a canvas that starts at zero size)
    const r = canvas.getBoundingClientRect()
    visible = r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && !document.hidden
    if (!visible) return
    shared.uTime.value += dt
    // growth follows the clock, so a slow device still sees it finish in about three seconds
    if (loaded && shared.uGrow.value < 1) shared.uGrow.value = Math.min(1, (now - growStart) / 3200)
    lightPos.lerp(lightAim, 1 - Math.exp(-dt * 3.2))
    render()
  }
  if (motion) raf = requestAnimationFrame(loop)

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); onLost?.() })

  let pulseT = null
  return {
    ready,
    setLight,
    setProgress(p) { rise = p; shared.uRise.value = p; place(); if (!motion) render() },
    pulse() {
      if (!motion) return
      cancelAnimationFrame(pulseT)
      const t0 = performance.now()
      const step = now => {
        const k = Math.min(1, (now - t0) / 1600)
        shared.uPulse.value = Math.sin(Math.PI * k) * (1 - k * 0.3)
        if (k < 1) pulseT = requestAnimationFrame(step)
      }
      pulseT = requestAnimationFrame(step)
    },
    // pick one material: the others step back
    focus(id) {
      meshes.forEach(m => { m.material.userData.uniforms.uDim.value = id && m.userData.id !== id ? 1 : 0 })
      if (!motion) render()
    },
    dispose() {
      dead = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(pulseT)
      ro.disconnect()
      scene.traverse(o => { o.geometry?.dispose(); const m = o.material; if (m) { m.map?.dispose(); m.normalMap?.dispose(); m.dispose() } })
      geoBase.dispose(); env.dispose(); pmrem.dispose(); glowMap.dispose()
      renderer.dispose()
    },
  }
}
