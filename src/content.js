// ─────────────────────────────────────────────────────────────────────────────
//  ESCAPE ROOMS · Aditi Arya
//  Everything written on the site lives in this one file.
//
//  • Change words, specs, prices, links and image paths here.
//  • Images live in /public/assets/…  Refer to them as 'assets/…' (no leading slash).
//  • Bills of materials: totals are added up automatically from the line items.
//  • Save the file and the page refreshes by itself while `npm run dev` is running.
// ─────────────────────────────────────────────────────────────────────────────

export const person = {
  name: 'Aditi Arya',
  role: 'Leather design',
  school: 'NIFT Raebareli',
  degree: 'B.Des. Leather Design, 2023–2027',
  minor: 'Interdisciplinary minor in Fashion Communication',
  email: 'aryaaditi2607@gmail.com',
  instagram: { handle: '@diffworld__', url: 'https://www.instagram.com/diffworld__/' },
  linkedin: 'https://www.linkedin.com/in/aditi-arya-787336364',
  // The live address of the site, used by the print kit (QR codes) and share cards.
  // Leave empty to use whatever address the page is opened from.
  site: '',
}

export const collection = {
  title: 'Escape Rooms',
  season: 'Ready-to-wear, A/W 2026',
  // The large statement line and Aditi's concept text (portfolio, page 1).
  pull: 'We keep wanting to escape the soft constraints, while the mundane is still where life unfolds.',
  concept: [
    'Modern mundanity emerged from the structures of predictable routines, digital repetition, economic pressures, and the bureaucratic order that standardised our days, flattening experience into cycles of work obligation and shallow stimulation.',
    'Escape Rooms captures this tension by iterating grounded forms in a bounded space of everyday life, challenging them to use creativity and focus to navigate restrictions, providing a guaranteed narrative of triumph often missing in contemporary life.',
  ],
  // Words from Aditi's inspiration board. They become the signage around the site.
  signs: {
    hero: 'sealed entrance',
    statement: 'observe carefully',
    jacket: 'follow the line',
    bags: 'it loops',
    bagsEnd: 'again',
    boots: 'layer',
    bootsEnd: 'alignment required',
    other: 'unused pathway',
    models: 'not all is visible',
    about: 'almost there',
    exit: 'entry != exit',
  },
  inspiration: { src: 'assets/pages/p2.jpg', alt: 'Inspiration board: exit signs, sealed doors, an empty parking garage and a rusted car, labelled with wayfinding phrases' },
  mood: { src: 'assets/pages/p4.jpg', alt: 'Moodboard: blurred green corridors, a grid tunnel, an eye in close-up and a sunlit bench of fire extinguishers' },
  palette: [
    { code: '7763 C', name: 'Olive', hex: '#5E5C3A' },
    { code: '7532 C', name: 'Umber', hex: '#6B5543' },
    { code: '476 C', name: 'Burnt wood', hex: '#4E3526' },
    { code: '7428 C', name: 'Cherry', hex: '#6A1F2E' },
    { code: '20-0037 TPM', name: 'Fort Knox', hex: '#A68B45' },
    { code: '567 C', name: 'Deep green', hex: '#1F4439' },
  ],
  consumer: {
    who: 'Ages 18–30 in Mumbai, Delhi, Bangalore, Pune and Hyderabad: students, creatives, freelancers and early professionals.',
    how: 'They move between college, work, cafés and studios with multi-purpose essentials, and want pieces that adapt to each setting while still feeling individual.',
  },
}

// The hero sculpture: one hide for each project. Each hide casts the shadow of what was made from it.
// `passport` is the material passport shown in the brief. Only facts from her sheets are
// filled in; add `tannage` or `source` to any of them and they appear too.
export const hides = [
  { id: 'suede',  label: 'Olive suede',      from: 'bags',   shadow: 'assets/shadows/suede.png',  swatch: '#5E5B38',
    passport: { hide: 'Cow', finish: 'Suede, olive', use: 'Shell A of all four bags', area: '165 dm² across the four bags', pairs: 'Printed polyblend microfibre, dark green cotton lining' } },
  { id: 'nappa',  label: 'Cherry nappa',     from: 'jacket', shadow: 'assets/shadows/nappa.png',  swatch: '#6A1F2E',
    passport: { hide: 'Sheep', finish: 'Nappa, cherry maroon', use: 'Body of the jacket', pairs: 'Olive suede collar, cuffs and hem' } },
  { id: 'pullup', label: 'Oil pull-up',      from: 'boots',  shadow: 'assets/shadows/pullup.png', swatch: '#2F3D36',
    passport: { grain: 'Full grain', finish: 'Oil pull-up, dark green with black finish', thickness: '1.6–2.0 mm', use: 'Upper of the high ankle boot', pairs: 'Sheep nappa lining, 0.6 mm' } },
]

// ─── Room 01 ────────────────────────────────────────────────────────────────
export const jacket = {
  id: 'jacket',
  number: '01',
  title: 'Jacket',
  duration: '1 week',
  line: 'Waist-length, unisex jacket with a kimono-based silhouette.',
  materials: ['Cherry maroon sheep nappa', 'Olive suede leather'],
  text: 'The body is cut in cherry maroon sheep nappa. Olive suede lines the standing collar and turns back at the cuffs and hem. The front fastens with a column of straps, each finished with an antique buckle and rivets.',
  hero: { src: 'assets/products/jacket-front.webp', alt: 'Model wearing the cherry maroon nappa jacket open over bare chest, olive suede collar and cuffs', w: 785, h: 1800 },
  // Hotspots sit on the hero image. x and y run from 0 to 1, measured from the top-left corner.
  hotspots: [
    { x: 0.63, y: 0.21, label: 'Standing dual-tone collar' },
    { x: 0.73, y: 0.39, label: 'Antique-finish rivets' },
    { x: 0.73, y: 0.45, label: 'Antique-finish buckle closure' },
    { x: 0.06, y: 0.42, label: 'Cuff-accented half sleeve' },
    { x: 0.13, y: 0.58, label: 'Contrast panelling at the hem' },
    { x: 0.75, y: 0.63, label: 'Belt-strap closure' },
  ],
  gallery: [
    { src: 'assets/products/jacket-back.webp', alt: 'Back view of the jacket, kimono sleeves falling from a dropped shoulder', w: 664, h: 1346, kind: 'cutout' },
    { src: 'assets/products/jacket-close.webp', alt: 'Close-up of the collar held open, olive suede against maroon nappa', w: 1800, h: 1182, kind: 'photo' },
  ],
  details: [
    'Multi-strap front fastening system',
    'Kimono-inspired sleeve',
    'Reinforced seam construction',
    'Contrast panelling at cuffs and inner sections',
  ],
  spec: [
    ['Length', '25 in'], ['Chest', '38 in'], ['Waist', '32 in'], ['Shoulder', '6 in'],
    ['Hem', '38 in'], ['Hip', '40 in'], ['Sleeve length', '15 in'], ['Cap height', '9 in'],
    ['Cuff width', '4 in'], ['Size', 'M'], ['Thread', '3-ply polyester'], ['Trims', 'Buckles, rivets'],
  ],
  care: 'Professional leather clean only. Wipe with a dry or slightly damp cloth. Do not machine wash, bleach or iron.',
  film: { src: 'assets/films/jacket.mp4', poster: 'assets/posters/jacket.webp', caption: 'From trend research and silhouette sketches to the specification sheet and the final shoot.' },
  sheets: { from: 7, to: 16 },
  pdf: 'downloads/Aditi-Arya-Kimono-Jacket.pdf',
}

// ─── Room 02 ────────────────────────────────────────────────────────────────
export const bags = {
  id: 'bags',
  number: '02',
  title: 'Bags',
  duration: '2 months',
  line: 'Four bags in olive cow suede and printed microfibre, with antique-finish hardware.',
  text: 'Each bag carries more than one way: detachable straps, external pockets and concealed zips let the same piece move from the shoulder to the hand to the back.',
  materials: ['Olive cow suede', 'Brown texture-print polyblend microfibre', 'Dark green cotton lining', 'Antique-finish hardware'],
  pieces: [
    {
      name: 'Duffle',
      line: 'Designed for in-between spaces. It changes between duffle, top handle, backpack, shoulder and crossbody.',
      img: { src: 'assets/products/duffle.webp', alt: 'Olive suede duffle with printed panels, studs and a push-lock flap, held by the handles', w: 1113, h: 1536 },
      size: '17 × 9.5 × 5.5 in, 8 in handle drop, 47.2 in detachable strap',
      details: ['Five front-panel pockets', 'Detachable handles', 'Push-lock flap', 'Side concealed zip pocket', 'Back welt pocket', 'Bottom panel studs'],
      // Aditi's sheet (page 23) prints ₹969, but its own line items add up to ₹989.
      // The site shows the sum of the lines. Correct a line here if one is wrong.
      retail: null, // her target retail price in rupees, e.g. 4200. Shown with the markup when set.
      bom: [
        ['Cow suede, olive (shell A)', '70 dm²', 350], ['Printed microfibre (shell B)', '0.10 m²', 45],
        ['Cotton lining, dark green', '0.30 m²', 60], ['Thread, stitch & turn', '1 spool', 40],
        ['No. 5 zip & puller', '1', 20], ['Concealed zip', '1', 10], ['Push lock', '1', 60],
        ['Rivets', '52', 104], ['Dogtooth hooks', '8', 160], ['Rectangle rings, 1 in', '8', 40],
        ['Base studs', '4', 80], ['Snap button', '1', 20],
      ],
    },
    {
      name: 'T-base',
      line: 'A crossbody layered with pockets: card slots, a flap gusset and rings for hanging charms.',
      img: { src: 'assets/products/tbase.webp', alt: 'T-base crossbody with a suede pocket over a printed flap, lifted by the top edge', w: 739, h: 1145 },
      size: '12 × 10.5 × 3 in, 40 in detachable strap',
      details: ['Four front-panel pockets', 'Card holder', 'Charm-hanging rings', 'Flap gusset pocket', 'Front-panel zip pocket', 'Front-flap push lock'],
      retail: null,
      bom: [
        ['Cow suede, olive (shell A)', '35 dm²', 175], ['Printed microfibre (shell B)', '0.05 m²', 22.5],
        ['Cotton lining, dark green', '0.15 m²', 30], ['Thread, stitch & turn', '1 spool', 40],
        ['No. 5 zip & puller', '2', 40], ['Push lock', '1', 60], ['Rivets', '20', 40],
        ['Dogtooth hooks', '2', 40], ['Rectangle rings, 1 in', '8', 40], ['Base studs', '4', 80], ['Snap button', '1', 20],
      ],
    },
    {
      name: 'Drawstring',
      line: 'A drawstring body with a studded, push-lock flap pocket and a zipped printed base.',
      img: { src: 'assets/products/drawstring.webp', alt: 'Drawstring bag in olive suede with a studded flap pocket and a printed zipped base', w: 1416, h: 1688 },
      size: '12 × 15 × 2.5 in, 30 in string',
      details: ['Push-lock pocket flap', 'Two front-panel pockets', 'Side-seam concealed zip', 'Front-panel zip pocket', 'String and buckle'],
      // Aditi's sheet (page 32) prints ₹870, but its own line items add up to ₹810.
      // The site shows the sum of the lines. Correct a line here if one is wrong.
      retail: null,
      bom: [
        ['Cow suede, olive (shell A)', '45 dm²', 225], ['Printed microfibre (shell B)', '0.06 m²', 27],
        ['Cotton lining, dark green', '0.20 m²', 40], ['Thread, stitch & turn', '1 spool', 40],
        ['No. 5 zip & puller', '2', 40], ['Concealed zip', '1', 10], ['Push lock', '1', 60],
        ['Rivets', '19', 38], ['Dogtooth hooks', '8', 160], ['Rectangle rings, 1 in', '8', 40],
        ['Base studs', '4', 80], ['Buckle, 1 × 0.5 in', '1', 30], ['Snap button', '1', 20],
      ],
    },
    {
      name: 'Hobo',
      line: 'A small crossbody gathered into pleats between suede panels, closed with a single zip.',
      img: { src: 'assets/products/hobo-single.webp', alt: 'Small hobo bag with pleated printed panels between suede strips, on a long strap', w: 696, h: 936 },
      size: '12 × 5 in, 40 in detachable strap',
      details: ['Pleated panels', 'No. 5 metal zip', 'D-ring hardware', 'Base studs'],
      retail: null,
      bom: [
        ['Cow suede, olive (shell A)', '15 dm²', 75], ['Printed microfibre (shell B)', '0.05 m²', 22.5],
        ['Cotton lining, dark green', '0.10 m²', 20], ['Thread, stitch & turn', '1 spool', 40],
        ['No. 5 zip & puller', '1', 20], ['Rivets', '8', 16], ['Dogtooth hooks', '2', 40],
        ['D-rings, 1 in', '2', 20], ['Base studs', '4', 80], ['Snap button', '1', 20],
      ],
    },
  ],
  // The Duffle's five ways to carry (portfolio, page 21). Each has a pictogram in the site.
  carry: [
    { id: 'duffle',    label: 'Duffle',     how: 'Both handles together, carried at the side.' },
    { id: 'tophandle', label: 'Top handle', how: 'One handle, held in front like a case.' },
    { id: 'backpack',  label: 'Backpack',   how: 'The two dogtooth-hooked straps clipped to the base rings.' },
    { id: 'shoulder',  label: 'Shoulder',   how: 'The detachable strap shortened, under the arm.' },
    { id: 'crossbody', label: 'Crossbody',  how: 'The 47.2 in strap at full length, across the body.' },
  ],
  // A day with the bags, imagined from the consumer in the brief.
  day: [
    { time: '08:30', place: 'Metro to college', bag: 'T-base', mode: 'crossbody', why: 'Hands free on the train; card slots for the metro pass.' },
    { time: '10:00', place: 'Studio class',     bag: 'Duffle', mode: 'backpack',  why: 'Laptop, sketchbook and swatches, weight on both shoulders.' },
    { time: '14:00', place: 'Café',             bag: 'Duffle', mode: 'shoulder',  why: 'Strap shortened, the bag sits on the chair beside you.' },
    { time: '17:30', place: 'Client meeting',   bag: 'Duffle', mode: 'tophandle', why: 'Handles up, straps away: it reads as a case.' },
    { time: '20:00', place: 'Out for the evening', bag: 'Hobo', mode: 'shoulder', why: 'Only the essentials, in the small pleated crossbody.' },
  ],
  // Nesting study for the Duffle: the pieces drawn from its finished size
  // (17 × 9.5 × 5.5 in, 8 in handle drop, 47.2 in strap) with 1 cm seam allowance,
  // packed onto a hide 95 cm across. Positions are [name, x, y, width, height] in cm.
  // Compared with the 70 dm² of suede on Aditi's bill of materials.
  nesting: {
    bag: 'Duffle',
    allowance: 70, // dm² of suede on her BOM
    pieces: [
      ['Front', 0, 0, 45.2, 26.1], ['Back', 46.0, 0, 45.2, 26.1], ['Base', 0, 26.9, 45.2, 16.0],
      ['Flap', 46.0, 26.9, 24.0, 18.0], ['End gusset', 70.8, 26.9, 16.0, 26.1], ['End gusset', 0, 43.7, 26.1, 16.0],
      ['Strap', 0, 60.5, 61.9, 5.0], ['Strap', 0, 66.3, 61.9, 5.0], ['Handle', 0, 72.1, 50.6, 5.0],
      ['Handle', 87.6, 26.9, 5.0, 50.6], ['Pocket', 26.9, 43.7, 16.0, 14.0], ['Pocket', 46.0, 45.7, 16.0, 14.0],
      ['Pocket', 70.8, 53.8, 16.0, 14.0],
    ],
  },
  campaign: [
    { src: 'assets/products/bags-pair.webp', alt: 'Drawstring and hobo bags held out side by side', w: 1800, h: 1656, kind: 'cutout' },
    { src: 'assets/products/collection.webp', alt: 'All four bags laid together on a suede-draped plinth', w: 1800, h: 934, kind: 'cutout' },
  ],
  film: { src: 'assets/films/bags.mp4', poster: 'assets/posters/bags.webp', caption: 'Trends, bag explorations, technical drawings and the bill of materials, then each bag in turn.' },
  sheets: { from: 17, to: 37 },
  pdf: 'downloads/Aditi-Arya-Escape-Rooms.pdf',
}

// ─── Room 03 ────────────────────────────────────────────────────────────────
export const boots = {
  id: 'boots',
  number: '03',
  title: 'Boots',
  duration: '2 weeks',
  line: 'High ankle boots in dark green, built for city and cold-weather wardrobes.',
  text: 'A full-grain, oil pull-up leather upper over a sheep nappa lining, with reinforcement panels, leather lacing loops and a closed gusset tongue that keeps dust out.',
  // The exploded view is cut from Aditi's construction drawing (portfolio, page 42).
  layers: [
    { name: 'Upper',    src: 'assets/layers/upper.webp',   w: 680, h: 350 },
    { name: 'EVA sheet', src: 'assets/layers/eva.webp',    w: 702, h: 92 },
    { name: 'Texon',    src: 'assets/layers/texon.webp',   w: 707, h: 88 },
    { name: 'Insole',   src: 'assets/layers/insole.webp',  w: 705, h: 72 },
    { name: 'Midsole',  src: 'assets/layers/midsole.webp', w: 705, h: 69 },
    { name: 'Outsole',  src: 'assets/layers/outsole.webp', w: 723, h: 131 },
  ],
  photos: [
    { src: 'assets/products/boot-detail.webp', alt: 'Hands tying the laces of the dark green boot through leather loops', w: 1800, h: 1672, kind: 'cutout' },
    { src: 'assets/products/boot.webp', alt: 'Side view of the boot on a raised foot, chunky tread sole', w: 1800, h: 1158, kind: 'photo' },
  ],
  spec: [
    ['Size', 'UK 9 / EU 43–44'], ['Colour', 'Dark green, black finish'], ['Construction', 'Cemented / direct injection'],
    ['Stitching', 'Double stitch, reinforced panels'], ['Toe spring', '10–15 mm'], ['Heel height', '25–35 mm'],
    ['Ankle height', 'About 6–7 in'], ['Tongue', 'Closed gusset, dust resistant'],
  ],
  retail: null,
  bom: [
    ['Upper: full grain / oil pull-up leather, 1.6–2.0 mm', '', 330],
    ['Toe puff and heel counter: thermoplastic, 0.6 mm', '', 40],
    ['Lining: sheep nappa, 0.6 mm', '', 100],
    ['Collar padding: PU foam, 8 mm', '', 20],
    ['Insole: EVA and fabric, 4–6 mm', '', 40],
    ['Midsole: cellulose fibre board, 2.0 mm', '', 40],
    ['Outsole: PU, 0.45 g/cm³', '', 110],
    ['Laces: polyester, 5 mm', '', 60],
    ['Thread: bonded nylon', '', 40],
  ],
  film: { src: 'assets/films/boots.mp4', poster: 'assets/posters/boots.webp', caption: 'Footwear trends, sketches, the exploded view and the bill of materials, then the finished boot.' },
  sheets: { from: 38, to: 49 },
  pdf: 'downloads/Aditi-Arya-Ankle-Boots.pdf',
}

// ─── 3D viewer ──────────────────────────────────────────────────────────────
// To show a real 3D model, export it as .glb (CLO 3D, Rhino, or a phone scan with
// Polycam / Scaniverse / Luma), put it in /public/assets/models/, and write its
// path in `src`, e.g. src: 'assets/models/jacket.glb'. Leave src empty to show
// the photo relief made from `relief`.
export const models = {
  // Photo reliefs are a stand-in. While this is false, only pieces with a real .glb
  // in `src` are shown, and the whole section (and its menu link) hides if there are none.
  showReliefs: false,
  title: 'Turn it over',
  intro: 'The three pieces on a turntable. Drag sideways to turn them, or use the buttons.',
  reliefNote: 'Shown as a photo relief: depth drawn from the photograph, with the far side mirrored. The full 3D model will replace it.',
  modelNote: 'The 3D model. Drag to turn it all the way round.',
  items: [
    { id: 'jacket', label: 'Jacket', room: '#jacket', src: '',
      relief: { src: 'assets/products/jacket-front.webp', w: 785, h: 1800 },
      line: 'Cherry maroon sheep nappa with olive suede collar, cuffs and hem.' },
    { id: 'duffle', label: 'Duffle bag', room: '#bags', src: '',
      relief: { src: 'assets/products/duffle.webp', w: 1113, h: 1536 },
      line: 'Olive cow suede and printed microfibre, with antique-finish hardware.' },
    { id: 'boot', label: 'Ankle boot', room: '#boots', src: '',
      relief: { src: 'assets/models/boot-relief.webp', w: 714, h: 525 },
      line: 'Oil pull-up upper on the six-layer sole unit, assembled from the exploded view.' },
  ],
}

// ─── Other work ─────────────────────────────────────────────────────────────
export const internship = {
  company: 'Hats Off Accessories',
  when: '1 June – 24 July 2026',
  what: 'Eight weeks on print development, technical packs, product-line research and development, sourcing, and content and set design.',
  mentors: 'Guided by Sunaina Harjai, founder and director, and Dr. Anketa Kumar, faculty mentor.',
  deck: 'downloads/Aditi-Arya-Industry-Internship.pptx',
  boards: [
    { title: 'Print 1: process', text: 'Eighteen trials that build a border, a grid and the motifs one layer at a time, until the finished print.', src: 'assets/communication/print-process.png', w: 935, h: 661,
      film: { src: 'assets/films/print.mp4', poster: 'assets/posters/print.webp' } },
    { title: 'Print 4: double block', text: 'Four scarf-format studies in blue, ochre and brown that vary the border, motif scale and centre.', src: 'assets/communication/double-block.png', w: 935, h: 661 },
    { title: 'Nano bag proposal', text: 'An inspiration deck covering prints, charms and silhouettes before development began.', src: 'assets/communication/nano-bag.png', w: 935, h: 661 },
  ],
}

// Shown as a corridor of doors. Add `thumb: 'assets/other/….webp'` to any item and
// the door opens onto that picture; without one it opens onto the description.
export const otherWork = [
  { short: 'Aipan art', title: 'Craft research documentation: Aipan art', role: 'Research, creative direction', thumb: '' },
  { short: 'Tannery', title: 'Tannery training, Mirza International Ltd., Unnao', role: 'Research, layout, creative direction', thumb: '' },
  { short: 'AI paper', title: 'Research paper: the use of AI in the leather industry', role: 'Research gap and academic writing', thumb: '' },
  { short: 'Startup', title: 'Design associate, materials and social media', role: 'Startup', thumb: '' },
  { short: 'Fashion Review', title: 'Artwork published in Fashion Review, issue 1, Manchester', role: 'Publishing', thumb: '' },
  { short: 'Lost Stories', title: 'Artwork published in Lost Stories, 4th edition, NLUJAA Assam', role: 'Publishing', thumb: '' },
  { short: 'IIT Bombay', title: 'Character design and comic strip design, IIT Bombay', role: 'Faculty mentorship', thumb: '' },
  { short: 'Silver Jubilee', title: 'Silver Jubilee logo, Sanskriti School, New Delhi', role: 'Identity', thumb: '' },
]

export const about = {
  portrait: { src: 'assets/profile/aditi-portrait.webp', alt: 'Portrait of Aditi Arya holding a hand-painted bag, wearing her NIFT lanyard', w: 1179, h: 1400 },
  // Her own line, from the reflection in her internship presentation.
  motto: 'Craftsmanship is coordination made visible.',
  bio: [
    'I see design as a way to make sense of the world and to navigate it with curiosity and purpose. Escape Rooms began with the routines we keep wanting to escape, and the mundane spaces where life still unfolds.',
    'My work starts with research, then moves through experiment and making by hand. I like working just past the conventional approach, where there is still room to question and test.',
  ],
  // A line from a mentor or tutor. Shown in About when filled in, e.g.
  // { text: '…', name: 'Sunaina Harjai', role: 'Founder and director, Hats Off Accessories' }
  testimonial: null,
  // Photographs of the IFCOMA Shoetech display, e.g. [{ src: 'assets/exhibition/ifcoma-1.webp', alt: '…', w, h }]
  exhibition: [],
  education: [
    ['Bachelor of Design, Leather Design', 'NIFT Raebareli, 2023–2027'],
    ['Minor, Fashion Communication', 'NIFT Raebareli'],
    ['Higher secondary', 'Mount Carmel School, Digwadih, 2021–2023'],
  ],
  awards: [
    'Leather collection displayed at IFCOMA Shoetech, Kanpur, 2025',
    'First position, surrealism painting, Antaragini 2023',
    'Top 10 proposed designs, Toycathon 2023',
    'First position, poster design, NIFT Raebareli',
  ],
  skills: [
    'Design research and trend forecasting', 'Leather goods design and material development',
    'Brand identity and visual communication', 'Creative art direction',
    'Product styling and concept development', 'Packaging, editorial and digital design',
  ],
  tools: ['Adobe Creative Suite', 'Procreate', 'Figma', 'Rhino 3D', 'CLO 3D', 'Shoemaster', 'ERP software'],
}

// The Exit's clue cards, in this order.
export const downloads = [
  { label: 'Résumé', note: 'One page', file: 'downloads/Aditi-Arya-Resume.pdf', size: '0.8 MB' },
  { label: 'Full portfolio', note: '49 pages', file: 'downloads/Aditi-Arya-Full-Portfolio.pdf', size: '10 MB' },
  { label: 'Jacket', note: 'Project PDF', file: 'downloads/Aditi-Arya-Kimono-Jacket.pdf', size: '' },
  { label: 'Bags', note: 'Project PDF', file: 'downloads/Aditi-Arya-Escape-Rooms.pdf', size: '' },
  { label: 'Boots', note: 'Project PDF', file: 'downloads/Aditi-Arya-Ankle-Boots.pdf', size: '' },
  { label: 'Internship', note: 'Presentation', file: 'downloads/Aditi-Arya-Industry-Internship.pptx', size: '5 MB' },
]

// Short clips of making: skiving, edge painting, hand stitching, riveting. A strip of
// them appears in the brief when this list has entries, e.g.
// { src: 'assets/making/edge-paint.mp4', poster: 'assets/making/edge-paint.webp', label: 'Edge painting' }
export const making = []

// Portfolio pages, used by the sheet viewer. Page images live in assets/pages/p1.jpg … p49.jpg
export const pageSrc = n => `assets/pages/p${n}.jpg`
export const sheetsFor = ({ from, to }) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

// Sum a bill of materials. Returns a number in rupees.
export const bomTotal = rows => rows.reduce((sum, row) => sum + Number(row[2] || 0), 0)
export const rupees = n => '₹' + (Number.isInteger(n) ? n.toLocaleString('en-IN') : n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

// Aditi's own words, from her internship presentation. Used beside the nesting study.
export const materialQuote = 'A material choice is never purely aesthetic; it changes cost, timing, construction and the final image.'

// The three keys, one for finishing each room. They are a reward only: nothing is locked.
export const keys = [
  { id: 'jacket', label: 'Jacket', how: 'Follow the stitch line to the hem' },
  { id: 'bags',   label: 'Bags',   how: 'Drive to the end of the row' },
  { id: 'boots',  label: 'Boots',  how: 'Take the boot fully apart' },
]
