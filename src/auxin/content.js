// ─────────────────────────────────────────────────────────────────────────────
//  AUXIN · Aditi Arya
//  Everything written on the Auxin side of the site lives in this one file.
//
//  • Facts come from Aditi's Auxin presentation (28 pages). Nothing here is
//    invented: where the deck is silent, the text is gap('…'), which shows on
//    the site as a marked note to fill in. Replace gap('…') with plain text.
//  • Images are named by their file in public/assets/auxin/img/ (no extension).
//    To add or replace one, put the original in media/auxin/ and run
//    `python3 scripts/auxin-media.py`.
//  • Video: every moving photograph has a `video` slot. Put an .mp4 in
//    public/assets/auxin/video/ and write its path, e.g. video: 'assets/auxin/video/shoot-1.mp4'.
//    Until then the photograph moves with a slow camera move (a "moving still").
//  • Name, contact, résumé and the about text are shared with Escape Rooms and
//    live in src/content.js.
// ─────────────────────────────────────────────────────────────────────────────

export const gap = text => ({ gap: text })
export const isGap = v => !!v && typeof v === 'object' && 'gap' in v

export const collection = {
  title: 'Auxin',
  season: 'A/W 27/28',
  kind: 'Garments and footwear in leather and furnishing fabric',
  // the deck's own premise (moodboard page)
  premise: 'Like submerged aquatic plants elongating toward filtered light, the silhouette is made to stretch, weather, and be continuously altered by its surroundings rather than constructed as a fixed wearable.',
  // what auxin is, in plain words (concept page)
  what: 'Auxin is the plant hormone that directs growth in response to water, gravity, pressure and light. It is why a stem bends toward a window.',
  idea: 'The collection borrows that movement. Silhouettes lengthen and lean, and vertical ribbing reads as vascular structure, giving the pieces an upward pull.',
  pieces: 'A menswear ensemble (an asymmetric, kimono-inspired leather jacket with pleated, striped trousers) and two boot ranges, calf boots and cowboy boots.',
  closing: 'Exploration on the idea of objects shaped by invisible environmental forces.',
  role: gap('Your role on Auxin, e.g. research, design, pattern, construction, styling'),
  when: gap('Year and course or module'),
  reflection: gap('What Auxin taught you, what you would change, and what you would develop next.'),
}

// The five growth stages that organise the page. `id` is the anchor in the address bar.
export const chapters = [
  { id: 'seed',   n: '01', stage: 'Seed',   title: 'The idea',            tone: '#D6DECE', ink: 'dark' },
  { id: 'roots',  n: '02', stage: 'Roots',  title: 'Research',            tone: '#1E2B23', ink: 'light' },
  { id: 'stem',   n: '03', stage: 'Stem',   title: 'Colour and material', tone: '#E3E8DA', ink: 'dark' },
  { id: 'leaves', n: '04', stage: 'Leaves', title: 'Three pieces',        tone: '#D6DECE', ink: 'dark' },
  { id: 'bloom',  n: '05', stage: 'Bloom',  title: 'The shoot',           tone: '#22397A', ink: 'light' },
]

// Her brainstorm, drawn in the deck as a stem from the root to the light.
// Pairs of branches, from the bottom up; notes sit between them.
export const brainstorm = {
  root: 'root — the concept, unmoving',
  top: 'grows toward light',
  branches: [
    ['phototropism', 'leather grain'],
    ['asymmetry', 'structural bend'],
    ['reaching', 'material memory'],
  ],
  notes: [['shadow & light', 'hardware as nodes'], ['root to stem', 'seams as veins']],
  rejected: ['too literal: photosynthesis pun', 'keep it abstract, not botanical'],
}

export const boards = {
  moodboard: { img: 'board-moodboard', alt: 'Moodboard: cyanotype roots, green and yellow aquatic forms, and hyacinth bulbs with their roots', caption: 'Moodboard. The vertical ribbing references vascular structures and underwater plant elongation.' },
  inspiration: { img: 'board-inspiration', alt: 'Inspiration board of scanned and annotated plant forms', caption: 'Inspiration: scientific plant imagery and scanning diagrams.' },
  brainstorm: { img: 'board-brainstorm', alt: 'Brainstorm page: a stem from root to light with branches of ideas', caption: 'The brainstorm page as drawn in the deck.' },
  trend: { img: 'board-garment-trend', alt: 'Trend forecasting board for the garment with runway and street images', caption: 'Trend forecasting for the garment. Source: WGSN.' },
  persona: { img: 'board-consumer-persona', alt: 'Consumer persona board with styling references', caption: 'Consumer persona.' },
  colour: { img: 'board-garment-colour-material', alt: 'Colour and material board for the garment', caption: 'Colour and material board, garment. Swatch photographs on the board are reference images.' },
}

// Roots: what the research found (trend pages, source WGSN) and who the collection is for.
export const research = {
  brief: 'Design a range and develop one ensemble of a menswear leather jacket or shirt with trousers, in any material, as a material exploration.',
  signals: [
    { tag: '#SoftVolume', text: 'Soft volume shapes and kimono-inspired cover-ups.' },
    { tag: 'Material', text: 'Constructions that favour responsible leathers and plant-based alternatives.' },
    { tag: 'New neutrals', text: 'Neutrals drawn from nature: soft greens, browns and metallics.' },
    { tag: 'Deep Green', text: 'Forecast to give depth to A/W 27/28.' },
  ],
  source: 'Trend sources: WGSN, as cited on her trend pages.',
  persona: [
    { title: 'Who', items: ['Age 22–35', 'Unisex', 'Urban metropolitan cities', 'Income above ₹15 LPA'] },
    { title: 'Work', items: ['Designers', 'Architects', 'Musicians', 'Stylists', 'Media professionals'] },
    { title: 'Values', items: ['Visually expressive', 'Experimental', 'Subtle, conceptual storytelling', 'A handmade, artisanal feel', 'Individual styling over trends'] },
    { title: 'Influences', items: ['Fashion weeks, editorials, Instagram creators', 'Indie, alternative and experimental music', 'Contemporary art, architecture, exhibitions'] },
    { title: 'Found at', items: ['Cafés', 'Art shows', 'Thrift stores', 'Music gigs'] },
  ],
}

// Stem: the colour card (Pantone references from her colour page) and the materials.
export const palette = [
  { name: 'Surf the Web', code: 'Pantone 19-3952 TCX', hex: '#203C7F' },
  { name: 'Teal', code: 'Pantone 7699 C', hex: '#34657F' },
  { name: 'Green Eyes', code: 'Pantone 16-0224 TCX', hex: '#7D956D' },
  { name: 'Juniper', code: 'Pantone 18-6330 TCX', hex: '#3D7245' },
]

// Swatches are cropped from her own shoot photographs (see public/assets/auxin/tex/).
export const swatches = [
  { id: 'leather', name: 'Aqua oil pull-up cow leather', note: 'Full grain, distressed vintage effect. Jacket and cowboy boots.', tex: 'assets/auxin/tex/leather.jpg' },
  { id: 'stripe', name: 'Striped curtain fabric', note: 'Alternating vertical stripes. Trousers.', tex: 'assets/auxin/tex/stripe.jpg' },
  { id: 'pleat', name: 'Teal pleat fabric', note: 'Pleated insertion: trouser outer seam, jacket centre back and inner sleeve.', tex: 'assets/auxin/tex/pleat.jpg' },
]

export const garmentMaterials = [
  ['Full grain cow leather, oil pull-up', 'Jacket shell'],
  ['Upholstery fabric', 'Jacket and trouser panels'],
  ['Curtain fabric, striped', 'Trousers'],
  ['Polyester', 'Jacket lining'],
  ['Crepe', 'Trouser lining'],
  ['Buckram, fusing', 'Waistband structure'],
  ['Magnet buttons, metal clasp hooks, zipper, plastic button', 'Closures'],
]

// ─── Leaf 01 ────────────────────────────────────────────────────────────────
export const jacket = {
  id: 'jacket',
  n: '01',
  title: 'Jacket and trousers',
  short: 'Jacket',
  line: 'An asymmetric, kimono-inspired jacket with adjustable sleeve lengths, worn with relaxed striped trousers pleated along the outer seam.',
  // line drawing → coloured design → photograph, as you scroll
  stages: [
    { img: 'flat-jacket', label: 'Technical flat', alt: 'Technical flat of the jacket, front and back' },
    { img: 'final-design-front-back', label: 'Final design', alt: 'Final design of the jacket, front and back: the back shows a centre seam with a teal pleat insertion' },
    { img: 'final-editorial-1', label: 'Made', alt: 'The finished jacket in blue oil pull-up leather, worn with the striped trousers', photo: true },
  ],
  // points on the final design image (front view on the left, back on the right).
  // x and y run from 0 to 1, measured from the image's top-left corner.
  details: [
    { x: 0.22, y: 0.17, label: 'Kimono crossover neckline' },
    { x: 0.36, y: 0.2, label: 'Dropped shoulder' },
    { x: 0.06, y: 0.345, label: 'Zipped sleeve: adjustable length' },
    { x: 0.22, y: 0.44, label: 'Open front, lace tie' },
    { x: 0.75, y: 0.3, label: 'Centre back seam, teal pleat insertion' },
    { x: 0.06, y: 0.8, label: 'Trousers: pleated outer seam' },
  ],
  range: { img: 'range-garments', alt: 'Range: five variations of the jacket and trousers, drawn on a model', caption: 'Range: five variations on the jacket and trousers.' },
  forms: { img: 'board-garment-forms-shapes', alt: 'Pages of silhouette sketches for jackets and trousers', caption: 'Forms and shapes: silhouette sketches.' },
  photos: [
    { img: 'final-closeup', loop: 'assets/auxin/loops/final-closeup.mp4', video: '', alt: 'Close-up of the crossover neckline and the grain of the blue oil pull-up leather' },
  ],
  spec: [
    ['Category', 'Relaxed kimono jacket, menswear'],
    ['Fabric', 'Full grain cowhide, upholstery fabric'],
    ['Lining', 'Polyester'],
    ['Closure', 'Open front, lace tie'],
    ['Sleeve', 'Kimono sleeve, adjustable length'],
    ['Neckline', 'Kimono crossover'],
    ['Shoulder', 'Dropped'],
    ['Seam detail', 'Centre back seam with teal pleat insertion'],
    ['Pleat placement', 'Inner sleeve and centre back'],
    ['Hem', 'Folded clean finish'],
    ['Construction', 'Structured edge finishing'],
    ['Colour finish', 'Aqua oil pull-up, distressed vintage effect'],
    ['Water resistance', 'Semi water-resistant (treated leather)'],
    ['Durability', 'High, designed for rugged and fashion use'],
    // The sheet also lists "Comfort features: cushioned insole, moisture-wicking lining",
    // which looks copied from a boot sheet, so it is left out here.
  ],
  costing: [
    ['Leather', '350 dm²', '₹6/dm²', 2100],
    ['Polyester lining', '1 m', '₹100/m', 100],
    ['Teal pleat fabric', '0.5 m', '₹400/m', 200],
    ['Sewing thread', '1 reel', '₹40', 40],
    ['Magnet buttons', '2', '₹10 each', 20],
  ],
  trousers: {
    spec: [
      ['Category', 'Flared trousers, menswear'],
      ['Fabric', 'Striped fabric, upholstery fabric'],
      ['Lining', 'Crepe'],
      ['Waistband', 'Structured'],
      ['Closure', 'Hook and zipper'],
      ['Pleat placement', 'Outer seam'],
      ['Pockets', 'Side seam'],
      ['Hem', 'Blind hem'],
      ['Surface', 'Alternating vertical stripes'],
    ],
    costing: [
      ['Green fabric', '2.3 m', '₹350/m', 805],
      ['Crepe', '1 m', '₹50/m', 50],
      ['Teal pleat fabric', '0.3 m', '₹400/m', 120],
      ['Waistband fusing', '0.3 m', '₹50/m', 15],
      ['Zipper', '1', '₹20', 20],
      ['Hooks', '2 sets', '₹20 each', 40],
      ['Sewing thread', '1 reel', '₹40', 40],
    ],
    flat: { img: 'flat-trousers', alt: 'Technical flat of the trousers, front and back, with pleated outer panels' },
  },
  sheet: { img: 'board-garment-spec-costing', alt: 'Specification and costing sheet with jacket and trouser flats', caption: 'The specification and costing page.' },
}

// ─── Leaf 02 ────────────────────────────────────────────────────────────────
export const calf = {
  id: 'calf-boots',
  n: '02',
  title: 'Calf boots',
  short: 'Calf boots',
  line: 'Calf-length lace-up boots in deep blue ostrich-embossed leather, with muted green fabric panels and a flat lug sole.',
  research: 'Research followed the #BoxingBoot, forecast as a key item through #SportCore: knee-high or mid-calf lengths for directional ranges, rubber soles for grip, and gender-inclusive styles (source: WGSN).',
  // the final design's three views, for turning the boot
  views: [
    { img: 'calf-view-front', label: 'Front' },
    { img: 'calf-view-side', label: 'Side' },
    { img: 'calf-view-back', label: 'Back' },
  ],
  range: { img: 'calf-boots-range', alt: 'Range of calf boot designs in blue embossed leather with green panels', caption: 'Range.' },
  flat: { img: 'flat-calf', alt: 'Technical flat of the calf boot, front and back' },
  forms: { img: 'board-calf-boots-forms-shapes', alt: 'Two pages of boot sketches', caption: 'Forms and shapes: boot sketches.' },
  materials: [
    ['Ostrich-embossed leather', 'Upper, tongue and eyestay; deep blue'],
    ['Upholstery / curtain fabric', 'Contrast panels; muted green'],
    ['Flat laces', 'Fastening'],
    ['Skinfit', 'Lining'],
    ['Texon sheet', 'Insole'],
    ['Rubber', 'Outsole, flat lug profile'],
  ],
  spec: [
    ['Size', 'UK / India 5'],
    ['Main upper', 'Ostrich-embossed leather, deep blue, textured embossed grain'],
    ['Contrast panels', 'Reinforced curtain fabric, muted green, woven matte'],
    ['Tongue', 'Full-length lace-up tongue, embossed leather with lining'],
    ['Eyestay', 'Full-length front fastening, reinforced and topstitched'],
    ['Lining', 'Skinfit, full shaft and vamp'],
    ['Toe puff and heel counter', 'Thermoplastic, concealed'],
    ['Outsole', 'Rubber or TPR, black, flat lug profile, moulded tread'],
    ['Eyelets', 'Metal, black / gunmetal, matte'],
  ],
  // estimated cost per component, ₹ [low, high], from her sheet (it gives ranges, not a total)
  estimate: [
    ['Main upper', 1200, 2000], ['Contrast panels', 200, 400], ['Tongue', 150, 250],
    ['Eyestay panels', 150, 250], ['Inner lining', 250, 400], ['Toe puff', 50, 100],
    ['Heel counter', 60, 120], ['Insole board', 60, 100], ['Sock liner', 100, 180],
    ['Outsole', 350, 650], ['Laces', 40, 80], ['Eyelets', 60, 120],
    ['Stitching thread', 50, 100], ['Interlining / backing', 80, 150], ['Adhesives / primers', 100, 200],
    ['Edge finishing', 50, 100], ['Packaging', 100, 200],
  ],
  photo: { video: '', label: 'Finished pair', note: 'Photographs of the finished calf boots to come (the final product page in the deck is empty).' },
  boards: [
    { img: 'board-calf-boots-trend', alt: 'Calf boots trend forecasting board', caption: 'Trend forecasting. Source: WGSN.' },
    { img: 'board-calf-boots-colour-material', alt: 'Calf boots colour and material board', caption: 'Colour and material.' },
    { img: 'board-calf-boots-spec-costing', alt: 'Calf boots specification and costing sheet', caption: 'Specification and costing.' },
  ],
}

// ─── Leaf 03 ────────────────────────────────────────────────────────────────
export const cowboy = {
  id: 'cowboy-boots',
  n: '03',
  title: 'Cowboy boots',
  short: 'Cowboy boots',
  line: 'Pull-on cowboy boots in aqua oil pull-up cow leather, the same finish as the jacket, set with sixty-six antique brass rivets.',
  research: 'Research followed #NuBoheme and #FeminineGrit in festival fashion: mid block heels, structured or soft wide shafts, and refined leather in smooth, grained or polished finishes (source: WGSN).',
  flat: { img: 'flat-cowboy', alt: 'Technical flat of the cowboy boot, side and front, with rows of rivets and a butterfly seam' },
  forms: { img: 'board-cowboy-boots-forms-shapes', alt: 'Sketchbook pages of cowboy boot forms', caption: 'Forms and shapes.' },
  spec: [
    ['Product', 'Aqua oil pull-up cowboy boots with rivets'],
    ['Target market', 'Fashion, western wear, premium casual footwear'],
    ['Upper', 'Cowhide leather, oil pull-up finish, aqua-dyed'],
    ['Lining', 'Skinfit, sheep nappa leather'],
    ['Insole', 'Cushioned EVA + IFoam sock liner (anti-fatigue)'],
    ['Outsole', 'Rubber'],
    ['Toe shape', 'Pointed / slightly square hybrid'],
    ['Heel', 'Flat, 1.0 in'],
    ['Shaft height', '13 in'],
    ['Closure', 'Pull-on, leather pull tabs'],
    ['Decoration', 'Metal rivets, antique brass finish'],
    ['Stitching', 'Butterfly seam, front and back'],
    ['Colour finish', 'Aqua oil pull-up, distressed vintage effect'],
    ['Water resistance', 'Semi water-resistant (treated leather)'],
    ['Comfort', 'Cushioned insole, moisture-wicking lining'],
    ['Weight', '1.3 kg per pair'],
    ['Size', 'US 6 / EU 39'],
    ['Gender', 'Unisex'],
  ],
  costing: [
    ['Aqua oil pull-up leather (upper, vamp, shaft outer)', '50 dm²', '₹6/dm²', 300],
    ['Sheep leather (shaft lining)', '30 dm²', '₹5/dm²', 150],
    ['Skinfit fabric (vamp lining)', '0.20 m', '₹100/m', 20],
    ['Metal rivets', '66', '₹2 each', 132],
    ['Outsole', '1 pair', 'Fixed', 180],
    ['Adhesive', '1 set', 'Fixed', 40],
    ['Thread', '1 set', 'Fixed', 40],
    ['Lasting charges', '1 pair', '', 500],
  ],
  rivets: 66,
  photo: { video: '', label: 'Finished pair', note: 'Photographs of the finished cowboy boots to come.' },
  boards: [
    { img: 'board-cowboy-boots-trend', alt: 'Cowboy boots trend forecasting board', caption: 'Trend forecasting. Source: WGSN.' },
    { img: 'board-cowboy-boots-colour-material', alt: 'Cowboy boots colour and material board', caption: 'Colour and material.' },
    { img: 'board-cowboy-boots-spec-costing', alt: 'Cowboy boot flats with specification and costing tables', caption: 'Specification and costing.' },
  ],
}

export const leaves = [jacket, calf, cowboy]

// ─── Bloom: the shoot ───────────────────────────────────────────────────────
export const shoot = [
  { img: 'final-full-look', loop: 'assets/auxin/loops/final-full-look.mp4', video: '', alt: 'Full look: the jacket tied with its lace, wide striped trousers with teal pleated panels, black boots' },
  { img: 'final-editorial-1', loop: 'assets/auxin/loops/final-editorial-1.mp4', video: '', alt: 'The jacket worn open, one arm folded across the body, against a pale blue wall' },
  { img: 'final-closeup', loop: 'assets/auxin/loops/final-closeup.mp4', video: '', alt: 'Close-up of the crossover neckline and the leather grain' },
]
export const closingImage = { img: 'closing-plant', alt: 'A blurred plant leaning toward light: the closing image of the Auxin deck', caption: 'The closing image of the deck.' }

export const sum = rows => rows.reduce((s, r) => s + Number(r[r.length - 1] || 0), 0)
export const rupees = n => '₹' + Number(n).toLocaleString('en-IN')
