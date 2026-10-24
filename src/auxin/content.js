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
//  • Photographs from the shoot sit in three places in each piece's room:
//      open   the lifestyle frames that open the room. `side` is where the lead
//             frame sits ('left' when the model looks or moves to the right, so
//             the eye travels into the text). The second frame fills the space
//             under the words and is cropped to fit; `focus` ([x, y], 0 to 1)
//             is the point it keeps in view.
//      pause  one frame between the drawings and the specification, or a list
//             of two shown side by side.
//      proof  the plain-background frames beside the specification. `links`
//             ties a specification row (by its label) to a point on one of them:
//             'Row label': ['image', x, y], x and y from 0 to 1 from the top left.
//             Pointing at or focusing that row lights that point.
//    Bloom, the shoot chapter, is `bloom` near the end of this file.
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
  source: 'Trend sources: WGSN.',
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

// `img`: the swatch shown under "The three materials", cut at full size from the
// shoot photographs by scripts/auxin-media.py. `tex`: the strip material in the
// hero (public/assets/auxin/tex/).
export const swatches = [
  { id: 'leather', name: 'Aqua oil pull-up cow leather', note: 'Full grain, distressed vintage effect. Jacket and cowboy boots.', img: 'swatch-leather', tex: 'assets/auxin/tex/leather.jpg' },
  { id: 'stripe', name: 'Striped curtain fabric', note: 'Alternating vertical stripes. Trousers.', img: 'swatch-stripe', tex: 'assets/auxin/tex/stripe.jpg' },
  { id: 'pleat', name: 'Teal pleat fabric', note: 'Pleated insertion: trouser outer seam, jacket centre back and inner sleeve.', img: 'swatch-pleat', tex: 'assets/auxin/tex/pleat.jpg' },
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
    { img: 'jacket-front-studio', label: 'Made', alt: 'The finished jacket, tied at the waist with its lace, worn with the striped trousers against a plain grey backdrop', photo: true },
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
  open: {
    side: 'left',
    lead: { img: 'jacket-grass-blade', alt: 'The jacket worn open against a dark wall, a long blade of grass held up to the face; the teal pleat shows at the inner sleeve' },
    second: { img: 'jacket-hands-back', focus: [0.5, 0.58], alt: 'From behind, hands clasped at the back: the zipped sleeves with their teal pleated inner panels, the lace hanging over the striped trousers' },
  },
  pause: [
    { img: 'trousers-seated', alt: 'Seated with legs crossed: the striped trousers with their teal pleated outer panels, black lug-soled boots, the jacket’s lace hanging at the knee', caption: 'The trousers, seated, with their pleated outer panels.' },
    { img: 'ensemble-double-exposure', alt: 'A double exposure on black: the full look standing still beside a blurred second figure leaning back, holding a bag', caption: 'The full look, in a double exposure.' },
  ],
  proof: [
    { img: 'jacket-front-studio', label: 'Front', alt: 'Front of the jacket on a plain grey backdrop: the crossover neckline, the lace tied at the waist, flap pockets and zipped sleeves' },
    { img: 'ensemble-back', label: 'Back', alt: 'Back of the jacket and trousers: the teal pleat insertion down the centre back, and the trousers’ pleated outer panels flaring to the floor' },
    { img: 'jacket-neckline', label: 'Neckline', alt: 'Close-up of the crossover neckline with its topstitched collar band, and the grain of the leather' },
    { img: 'jacket-sleeve-zip', label: 'Sleeve', alt: 'The zip that sets the sleeve’s length, the teal pleat along the inner sleeve and the side panel' },
    { img: 'trousers-seam', label: 'Outer seam', alt: 'Close-up of the trousers’ outer seam: green and cream stripes meeting the teal pleated panel' },
  ],
  links: {
    'Fabric': ['jacket-neckline', 0.22, 0.72],
    'Closure': ['jacket-front-studio', 0.47, 0.58],
    'Sleeve': ['jacket-sleeve-zip', 0.3, 0.52],
    'Neckline': ['jacket-neckline', 0.42, 0.42],
    'Shoulder': ['jacket-neckline', 0.07, 0.5],
    'Seam detail': ['ensemble-back', 0.44, 0.25],
    'Pleat placement': ['jacket-sleeve-zip', 0.22, 0.68],
    'Hem': ['jacket-front-studio', 0.3, 0.84],
    'Colour finish': ['jacket-front-studio', 0.72, 0.42],
  },
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
    links: {
      'Category': ['ensemble-back', 0.38, 0.84],
      'Fabric': ['trousers-seam', 0.3, 0.6],
      'Pleat placement': ['trousers-seam', 0.8, 0.55],
      'Pockets': ['jacket-front-studio', 0.18, 0.87],
      'Surface': ['trousers-seam', 0.25, 0.35],
    },
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
    { img: 'calf-view-front', label: 'Front', photo: { img: 'calf-front-pair-white', alt: 'The finished pair from the front, on white' } },
    { img: 'calf-view-side', label: 'Side', photo: { img: 'calf-side-white', alt: 'A finished boot worn, in profile on white' } },
    { img: 'calf-view-back', label: 'Back', photo: { img: 'calf-back-pair-white', alt: 'The finished pair from behind, on white: back seams, heel counters and striped collars' } },
  ],
  open: {
    side: 'left',
    lead: { img: 'calf-stride-sole', alt: 'A calf boot mid-stride, seen from below with its lug sole toward the camera, a striped trouser hem above' },
    second: { img: 'calf-gum-step', focus: [0.55, 0.72], alt: 'A calf boot lifting off a string of chewing gum on an olive floor' },
  },
  pause: [
    { img: 'calf-door-handle', alt: 'One calf boot hung by its sole on a brass door handle, lit by a single spot', caption: 'One boot, hung on a door.' },
    { img: 'calf-seated-pair', alt: 'Seated in a dark room, the calf boots laced to just below the knee, a striped hem above', caption: 'The pair, worn.' },
  ],
  proof: [
    { img: 'calf-side-plinth', label: 'Side', alt: 'A calf boot in profile on a plinth: deep blue ostrich-embossed upper, teal textured panels and toe cap, striped collar, black lug sole' },
    { img: 'calf-top-pair-white', label: 'Above', alt: 'The pair from above on white: teal tongues, black laces, the shaped teal panels and toe caps' },
    { img: 'calf-pair-flatlay', label: 'Pair', alt: 'The pair laid flat on pale grey, one boot turned over above the other, showing the full lacing and the lug sole' },
    { img: 'calf-lace-detail', label: 'Eyestay', alt: 'Close-up of the eyestay: the ostrich grain, a double row of topstitching and flat woven laces over the teal tongue' },
  ],
  links: {
    'Main upper': ['calf-side-plinth', 0.3, 0.35],
    'Contrast panels': ['calf-side-plinth', 0.42, 0.62],
    'Tongue': ['calf-top-pair-white', 0.33, 0.12],
    'Eyestay': ['calf-lace-detail', 0.2, 0.45],
    'Lining': ['calf-top-pair-white', 0.33, 0.04],
    'Toe puff and heel counter': ['calf-side-plinth', 0.2, 0.72],
    'Outsole': ['calf-pair-flatlay', 0.55, 0.88],
    'Eyelets': ['calf-pair-flatlay', 0.52, 0.45],
  },
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
  // the drawing fills with this crop of the boot's own leather (from cowboy-outer-white)
  leather: 'assets/auxin/tex/cowboy-leather.jpg',
  open: {
    side: 'right',
    lead: { img: 'cowboy-willow-water', alt: 'The cowboy boots worn with legs crossed, hanging under a willow over dark water' },
    second: { img: 'cowboy-moss-walk', focus: [0.5, 0.62], alt: 'Walking away over wet moss in the cowboy boots: the back seams and stacked heels' },
  },
  made: { img: 'cowboy-dark-studio', alt: 'One cowboy boot lit against a dark ground: the chevron of brass rivets and the pleated teal panel', caption: 'As made.' },
  proof: [
    { img: 'cowboy-side-white', label: 'Inner side', alt: 'A cowboy boot in profile on white: two columns of brass rivets either side of a pleated teal panel, a stacked heel and a pull tab' },
    { img: 'cowboy-outer-white', label: 'Outer side', alt: 'The outer side on white: a chevron band of rivets over a short pleated panel, with a row of rivets beneath' },
    { img: 'cowboy-back-white', label: 'Back', alt: 'The boot from behind on white: the back seam, both pull tabs and the stacked heel' },
  ],
  links: {
    'Upper': ['cowboy-outer-white', 0.4, 0.66],
    'Outsole': ['cowboy-side-white', 0.3, 0.9],
    'Toe shape': ['cowboy-side-white', 0.12, 0.8],
    'Heel': ['cowboy-side-white', 0.48, 0.9],
    'Shaft height': ['cowboy-side-white', 0.42, 0.3],
    'Closure': ['cowboy-back-white', 0.62, 0.05],
    'Decoration': ['cowboy-outer-white', 0.5, 0.33],
    'Stitching': ['cowboy-back-white', 0.5, 0.45],
    'Colour finish': ['cowboy-outer-white', 0.55, 0.58],
  },
  boards: [
    { img: 'board-cowboy-boots-trend', alt: 'Cowboy boots trend forecasting board', caption: 'Trend forecasting. Source: WGSN.' },
    { img: 'board-cowboy-boots-colour-material', alt: 'Cowboy boots colour and material board', caption: 'Colour and material.' },
    { img: 'board-cowboy-boots-spec-costing', alt: 'Cowboy boot flats with specification and costing tables', caption: 'Specification and costing.' },
  ],
}

export const leaves = [jacket, calf, cowboy]

// ─── Bloom: the shoot ───────────────────────────────────────────────────────
// The order is the story: reaching for filtered light (the hero), close and
// intimate, the walk, out in the world, and full sun at the end.
// `develop`: shown in her palette until the visitor's light falls on it, where
// it develops into colour. `crop`: an extreme crop made at display time
// (x and y of its centre, from 0 to 1, and how far in). Every frame opens
// untreated, full size, when clicked.
export const bloom = {
  hero: { img: 'jacket-reach-fog', loop: 'assets/auxin/loops/jacket-reach-fog.mp4', video: '', alt: 'In fog, seen from below, one hand on a tall stem and the face turned up to the light: the jacket tied over the striped trousers' },
  spreads: [
    [
      { img: 'jacket-upside-down', develop: true, piece: 'Jacket', alt: 'Lying back, the face upside down in sunlight, the jacket’s collar against the skin' },
      { img: 'jacket-neckline', crop: { x: 0.2, y: 0.74, zoom: 3.4 }, piece: 'Jacket, the leather', alt: 'The jacket’s leather, cropped close from the neckline photograph: the grain and its sheen' },
    ],
    [
      { img: 'calf-crowd-print', piece: 'Calf boots', alt: 'An aged, taped print: a crowd walking past in a blur, one pair of calf boots standing still and sharp' },
    ],
    [
      { img: 'cowboy-branch-seated', develop: true, piece: 'Cowboy boots', alt: 'Sitting on a fallen branch in the cowboy boots: one shows the chevron of rivets, the other the pleated teal panel between two rows' },
      { img: 'calf-skyline', develop: true, piece: 'Calf boots', alt: 'A calf boot on a concrete ledge, a city skyline and power lines behind, a striped trouser hem above' },
    ],
  ],
  finale: { img: 'ensemble-fisheye-sky', loop: 'assets/auxin/loops/ensemble-fisheye-sky.mp4', video: '', alt: 'Through a fisheye lens from below: crouched on a rail against the sky, both arms raised toward the sun, the full look' },
}
export const closingImage = { img: 'closing-plant', alt: 'A blurred plant leaning toward light: the closing image of the Auxin deck', caption: 'The closing image of the deck.' }

export const sum = rows => rows.reduce((s, r) => s + Number(r[r.length - 1] || 0), 0)
export const rupees = n => '₹' + Number(n).toLocaleString('en-IN')
