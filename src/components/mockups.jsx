import '@fontsource-variable/bodoni-moda'
import { T } from './media'

// Visual components that projects can place with { kind: 'component', name, props }.
// Everything here is drawn in SVG or HTML: no generated imagery.

// ── Brainstorm: a radial mind map ──────────────────────────────────────────
export function Mindmap({ center, branches = [], rejected = [], note }) {
  const W = 1000, H = 640, cx = 500, cy = 320
  const n = branches.length
  return (
    <figure className="mindmap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Brainstorm around “${center}”: ${branches.map(b => b.label).join(', ')}`}>
        {branches.map((b, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2
          const bx = cx + Math.cos(a) * 230, by = cy + Math.sin(a) * 190
          return (
            <g key={b.label}>
              <path d={`M${cx} ${cy} Q ${(cx + bx) / 2 + Math.sin(a) * 30} ${(cy + by) / 2 - Math.cos(a) * 30} ${bx} ${by}`} className="mm-line" />
              {(b.leaves || []).map((l, j) => {
                const spread = ((j - (b.leaves.length - 1) / 2) * 0.42)
                const la = a + spread * 0.55
                const lx = bx + Math.cos(la) * 120, ly = by + Math.sin(la) * 92
                return (
                  <g key={l}>
                    <line x1={bx} y1={by} x2={lx} y2={ly} className="mm-leafline" />
                    <text x={lx} y={ly} className="mm-leaf" textAnchor={Math.cos(la) > 0.2 ? 'start' : Math.cos(la) < -0.2 ? 'end' : 'middle'} dy={Math.sin(la) > 0.3 ? 14 : -6}>{l}</text>
                  </g>
                )
              })}
              <circle cx={bx} cy={by} r="5" className="mm-node" />
              <text x={bx} y={by - 12} className="mm-branch" textAnchor="middle">{b.label}</text>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r="62" className="mm-center" />
        <text x={cx} y={cy + 6} className="mm-center-t" textAnchor="middle">{center}</text>
      </svg>
      {rejected.length > 0 && <p className="mm-rejected mono">Set aside: {rejected.map((r, i) => <s key={r}>{i ? ', ' : ''}{r}</s>)}</p>}
      {note && <figcaption className="cap"><T v={note} /></figcaption>}
    </figure>
  )
}

// ── KOSHA: a concept leather label (fictional) ─────────────────────────────
const K = { oxblood: '#4a1c1c', ivory: '#efe8dc', kohl: '#141210', brass: '#b08d57', henna: '#9b4a2c', stone: '#cfc6b7' }

export function KoshaMonogram({ color = K.kohl, size = 60, title = 'KOSHA monogram' }) {
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} role="img" aria-label={title}>
      <path d="M50 3 C 86 40, 86 100, 50 137 C 14 100, 14 40, 50 3 Z" fill="none" stroke={color} strokeWidth="3" />
      <path d="M41 32 V108" stroke={color} strokeWidth="9" />
      <path d="M44 74 L66 40" stroke={color} strokeWidth="2.6" />
      <path d="M50 66 L68 110" stroke={color} strokeWidth="6.5" />
      <path d="M34 108 H50 M60 110 H74 M34 32 H48 M60 40 H72" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export function KoshaWordmark({ color = K.kohl, sub = true, size = 1 }) {
  return (
    <span className="k-word" style={{ color, fontSize: `${size}em` }}>
      <span className="k-word-main">KOSHA</span>
      {sub && <span className="k-word-sub">Leather · Made to be worn in</span>}
    </span>
  )
}

function Lockup({ color, bg, label, mono = true }) {
  return (
    <figure className="k-card" style={{ background: bg }}>
      <div className="k-lock">{mono && <KoshaMonogram color={color} size={46} />}<KoshaWordmark color={color} /></div>
      <figcaption className="mono" style={{ color }}>{label}</figcaption>
    </figure>
  )
}

export function KoshaLogoSheet() {
  return (
    <div className="k-grid k-grid--logo">
      <Lockup color={K.kohl} bg={K.ivory} label="Primary lockup, kohl on ivory" />
      <Lockup color={K.ivory} bg={K.oxblood} label="Reversed, ivory on oxblood" />
      <figure className="k-card k-card--sq" style={{ background: K.kohl }}>
        <KoshaMonogram color={K.brass} size={74} />
        <figcaption className="mono" style={{ color: K.brass }}>Monogram, brass on kohl</figcaption>
      </figure>
      <figure className="k-card k-card--sq k-deboss" style={{ background: K.oxblood }}>
        <span className="k-deboss-mark"><KoshaMonogram color="rgba(0,0,0,0.38)" size={74} /></span>
        <figcaption className="mono" style={{ color: K.stone }}>Blind deboss on leather (simulated)</figcaption>
      </figure>
      <figure className="k-card k-card--wide" style={{ background: K.ivory }}>
        <div className="k-clear"><span className="k-clear-box"><KoshaMonogram color={K.kohl} size={40} /><KoshaWordmark color={K.kohl} sub={false} /></span></div>
        <figcaption className="mono">Clear space: the height of the monogram’s stem on every side. Minimum size: wordmark 18 mm / 72 px wide.</figcaption>
      </figure>
    </div>
  )
}

export function KoshaType() {
  return (
    <div className="k-type">
      <div className="k-type-block">
        <p className="mono">Display · Bodoni Moda (SIL OFL)</p>
        <p className="k-type-display">Worn in, not worn out.</p>
        <p className="k-type-glyphs">Aa Bb Kk Ss Hh &amp; 0123456789</p>
      </div>
      <div className="k-type-block">
        <p className="mono">Text · Schibsted Grotesk (SIL OFL)</p>
        <p className="k-type-text">Every Kosha piece is cut from one hide, stitched by hand and numbered. Bring it back and we will repair it for as long as you own it.</p>
      </div>
    </div>
  )
}

const ICONS = [
  ['Bags', 'M14 20 h36 l-4 32 h-28 Z M24 20 v-6 a8 8 0 0 1 16 0 v6'],
  ['Footwear', 'M10 44 c10 0 16-4 20-14 l6 2 c-2 8 6 12 18 12 v8 h-44 Z'],
  ['Garments', 'M24 10 l-12 8 4 10 6-3 v27 h20 v-27 l6 3 4-10 -12-8 c-2 5-14 5-16 0 Z'],
  ['Care', 'M32 10 c8 12 14 20 14 28 a14 14 0 0 1 -28 0 c0-8 6-16 14-28 Z'],
  ['Repair', 'M14 50 l24-24 M38 26 l6-12 6 6 -12 6 M18 46 l-6 6'],
  ['Hide passport', 'M16 12 h32 v40 h-32 Z M22 22 h20 M22 30 h20 M22 38 h12'],
  ['Atelier', 'M10 52 h44 M14 52 v-22 l18-14 18 14 v22 M28 52 v-12 h8 v12'],
  ['Delivery', 'M10 22 h28 v22 h-28 Z M38 30 h10 l6 8 v6 h-16 M18 48 a4 4 0 1 0 0.1 0 M44 48 a4 4 0 1 0 0.1 0'],
]
export function KoshaIcons() {
  return (
    <ul className="k-icons">
      {ICONS.map(([label, d]) => (
        <li key={label}>
          <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><path d={d} fill="none" stroke={K.kohl} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" /></svg>
          <span className="mono">{label}</span>
        </li>
      ))}
    </ul>
  )
}

function Box() {
  return (
    <svg viewBox="0 0 320 260" className="k-svg" role="img" aria-label="Rigid presentation box in oxblood with a brass monogram on the lid">
      <polygon points="40,90 170,40 290,90 160,140" fill="#5a2424" />
      <polygon points="40,90 160,140 160,230 40,180" fill={K.oxblood} />
      <polygon points="160,140 290,90 290,180 160,230" fill="#3a1515" />
      <polygon points="40,90 160,140 160,150 40,100" fill="#2b0f0f" opacity="0.5" />
      <g transform="translate(150 70) scale(0.42) skewX(-28) rotate(8)"><KoshaMonogramPaths color={K.brass} /></g>
      <text x="100" y="200" fill={K.brass} fontFamily="Bodoni Moda Variable, serif" fontSize="12" letterSpacing="4" transform="skewY(22) translate(-10 -78)">KOSHA</text>
    </svg>
  )
}
function KoshaMonogramPaths({ color }) {
  return (
    <g>
      <path d="M50 3 C 86 40, 86 100, 50 137 C 14 100, 14 40, 50 3 Z" fill="none" stroke={color} strokeWidth="3" />
      <path d="M41 32 V108" stroke={color} strokeWidth="9" /><path d="M44 74 L66 40" stroke={color} strokeWidth="2.6" /><path d="M50 66 L68 110" stroke={color} strokeWidth="6.5" />
    </g>
  )
}
function DustBag() {
  return (
    <svg viewBox="0 0 240 260" className="k-svg" role="img" aria-label="Unbleached cotton dust bag with a drawstring and the monogram">
      <path d="M40 50 Q120 36 200 50 L214 240 Q120 252 26 240 Z" fill="#e4dccd" />
      <path d="M40 50 Q120 62 200 50" fill="none" stroke="#c8bda9" strokeWidth="2" />
      <path d="M52 66 Q120 74 188 66" fill="none" stroke={K.oxblood} strokeWidth="2" strokeDasharray="5 4" />
      <path d="M150 70 q10 30 -6 64 M156 70 q16 26 2 70" fill="none" stroke={K.oxblood} strokeWidth="2" />
      <g transform="translate(97 120) scale(0.46)"><KoshaMonogramPaths color={K.oxblood} /></g>
    </svg>
  )
}
function Tissue() {
  return (
    <svg viewBox="0 0 240 260" className="k-svg" role="img" aria-label="Tissue paper printed with a repeat of the monogram">
      <defs>
        <pattern id="k-tissue" width="40" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
          <g transform="translate(12 6) scale(0.17)"><KoshaMonogramPaths color={K.henna} /></g>
        </pattern>
      </defs>
      <path d="M20 30 L220 18 L230 236 L14 244 Z" fill={K.ivory} />
      <path d="M20 30 L220 18 L230 236 L14 244 Z" fill="url(#k-tissue)" opacity="0.55" />
    </svg>
  )
}
function SwingTag() {
  return (
    <svg viewBox="0 0 240 260" className="k-svg" role="img" aria-label="Swing tag: bag number, hide, maker">
      <path d="M120 0 V40" stroke={K.brass} strokeWidth="1.5" />
      <rect x="62" y="36" width="116" height="200" rx="4" fill={K.oxblood} />
      <circle cx="120" cy="54" r="6" fill="#f1efea" />
      <g transform="translate(103 72) scale(0.34)"><KoshaMonogramPaths color={K.ivory} /></g>
      <text x="120" y="148" fill={K.ivory} textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontSize="15" letterSpacing="4">KOSHA</text>
      <text x="120" y="176" fill={K.stone} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8">No. 014 / 120</text>
      <text x="120" y="192" fill={K.stone} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8">VEG-TANNED CALF</text>
      <text x="120" y="208" fill={K.stone} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8">STITCHED BY HAND</text>
    </svg>
  )
}
function ShoppingBag() {
  return (
    <svg viewBox="0 0 240 260" className="k-svg" role="img" aria-label="Paper shopping bag in ivory with oxblood rope handles">
      <path d="M86 64 Q120 0 154 64" fill="none" stroke={K.oxblood} strokeWidth="5" />
      <rect x="40" y="62" width="160" height="186" fill={K.ivory} />
      <polygon points="200,62 220,72 220,244 200,248" fill="#d9d0c1" />
      <g transform="translate(103 112) scale(0.34)"><KoshaMonogramPaths color={K.kohl} /></g>
      <text x="120" y="210" textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontSize="16" letterSpacing="6" fill={K.kohl}>KOSHA</text>
    </svg>
  )
}
function CareCard() {
  return (
    <div className="k-carecard" role="img" aria-label="Care card text">
      <p className="mono">Care</p>
      <p>Leather is skin. Keep it out of plastic, out of direct sun, and away from heat. Wipe with a dry cloth; condition twice a year. Scratches on vegetable-tanned leather darken and soften with wear: that is the point.</p>
      <p className="mono">Repairs for life · kosha atelier</p>
    </div>
  )
}
export function KoshaPackaging() {
  const items = [['Presentation box', <Box key="b" />], ['Dust bag', <DustBag key="d" />], ['Tissue', <Tissue key="t" />], ['Swing tag', <SwingTag key="s" />], ['Shopping bag', <ShoppingBag key="sb" />], ['Care card', <CareCard key="c" />]]
  return (
    <ul className="k-pack">
      {items.map(([label, el]) => <li key={label}><div className="k-pack-stage">{el}</div><p className="mono">{label}</p></li>)}
    </ul>
  )
}

function Phone({ children, label }) {
  return (
    <figure className="k-phone-wrap">
      <div className="k-phone"><div className="k-phone-notch" /><div className="k-screen">{children}</div></div>
      <figcaption className="mono">{label}</figcaption>
    </figure>
  )
}
const Slot = ({ label, tall }) => <div className={`k-slot ${tall ? 'is-tall' : ''}`}><span className="mono">{label}</span></div>
export function KoshaApp() {
  return (
    <div className="k-phones">
      <Phone label="Home">
        <div className="k-app-top"><span className="mono">≡</span><KoshaWordmark color={K.kohl} sub={false} size={0.62} /><span className="mono">Bag</span></div>
        <Slot label="Campaign photograph" tall />
        <p className="k-app-h">The Sheath, in oxblood</p>
        <div className="k-app-tabs mono"><span className="on">Bags</span><span>Shoes</span><span>Small goods</span></div>
        <div className="k-app-grid"><Slot label="Product" /><Slot label="Product" /></div>
      </Phone>
      <Phone label="Product">
        <Slot label="Product photograph" tall />
        <p className="k-app-h">The Sheath Tote</p>
        <p className="k-app-price">₹48,000 <span className="mono">proposed</span></p>
        <dl className="k-app-dl">
          <div><dt className="mono">Hide</dt><dd>Vegetable-tanned calf</dd></div>
          <div><dt className="mono">Edges</dt><dd>Burnished by hand</dd></div>
          <div><dt className="mono">Made</dt><dd>One maker, 14 hours</dd></div>
        </dl>
        <span className="k-app-btn">Reserve a fitting</span>
      </Phone>
      <Phone label="Care and repair">
        <div className="k-app-top"><span className="mono">←</span><span className="mono">Your pieces</span><span /></div>
        <ul className="k-app-list">
          <li><span>The Sheath Tote</span><span className="mono">No. 014</span></li>
          <li><span>Kohl card case</span><span className="mono">No. 207</span></li>
        </ul>
        <p className="k-app-h">Book a repair</p>
        <ol className="k-app-steps mono"><li className="done">Photograph the wear</li><li className="done">Courier pick-up</li><li>Atelier assessment</li><li>Returned, conditioned</li></ol>
        <span className="k-app-btn">Continue</span>
      </Phone>
    </div>
  )
}

export function KoshaBillboard() {
  return (
    <div className="k-ooh">
      <figure>
        <svg viewBox="0 0 1000 520" role="img" aria-label="Billboard: campaign photograph on the left, monogram and the line ‘Made to be worn in.’ on the right">
          <rect width="1000" height="520" fill="#d9d4ca" />
          <rect x="0" y="430" width="1000" height="90" fill="#bdb6a8" />
          <rect x="300" y="300" width="14" height="140" fill="#6d665b" /><rect x="690" y="300" width="14" height="140" fill="#6d665b" />
          <rect x="100" y="40" width="800" height="280" fill={K.oxblood} />
          <rect x="100" y="40" width="460" height="280" fill="#1a1312" />
          <text x="330" y="176" fill="#8d8174" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="14">CAMPAIGN PHOTOGRAPH</text>
          <text x="330" y="198" fill="#6d6257" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11">hard key light · the tote held at the hip</text>
          <g transform="translate(700 70) scale(0.5)"><KoshaMonogramPaths color={K.brass} /></g>
          <text x="730" y="210" fill={K.ivory} textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontSize="34" fontStyle="italic">Made to be worn in.</text>
          <text x="730" y="268" fill={K.ivory} textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontSize="22" letterSpacing="10">KOSHA</text>
        </svg>
        <figcaption className="mono">Billboard, 48-sheet</figcaption>
      </figure>
      <figure className="k-ooh-portrait">
        <svg viewBox="0 0 400 600" role="img" aria-label="Metro poster in ivory with the monogram">
          <rect width="400" height="600" fill={K.ivory} />
          <rect x="30" y="30" width="340" height="380" fill="#1a1312" />
          <text x="200" y="224" fill="#8d8174" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12">PRODUCT PHOTOGRAPH</text>
          <g transform="translate(176 440) scale(0.34)"><KoshaMonogramPaths color={K.oxblood} /></g>
          <text x="200" y="540" fill={K.kohl} textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontSize="18" fontStyle="italic">Repaired for as long as you own it.</text>
        </svg>
        <figcaption className="mono">Metro poster</figcaption>
      </figure>
    </div>
  )
}

export function KoshaSocial() {
  const posts = [
    { bg: K.kohl, fg: K.brass, line: 'No. 014 of 120', sub: 'The Sheath Tote' },
    { bg: K.ivory, fg: K.oxblood, line: 'Fourteen hours, one maker.', sub: 'Inside the atelier' },
    { bg: K.oxblood, fg: K.ivory, line: 'Worn in, not worn out.', sub: 'Repairs for life' },
  ]
  return (
    <ul className="k-social">
      {posts.map(p => (
        <li key={p.line} style={{ background: p.bg, color: p.fg }}>
          <KoshaMonogram color={p.fg} size={30} />
          <p className="k-social-line">{p.line}</p>
          <p className="mono">{p.sub}</p>
        </li>
      ))}
    </ul>
  )
}

export function KoshaCover({ ratio = 4 / 5 }) {
  return (
    <div className="k-cover" style={{ aspectRatio: ratio, background: K.oxblood }} role="img" aria-label="KOSHA monogram and wordmark on oxblood">
      <KoshaMonogram color={K.brass} size={64} />
      <KoshaWordmark color={K.ivory} />
    </div>
  )
}

export const registry = { KoshaCover, Mindmap, KoshaLogoSheet, KoshaType, KoshaIcons, KoshaPackaging, KoshaApp, KoshaBillboard, KoshaSocial }
