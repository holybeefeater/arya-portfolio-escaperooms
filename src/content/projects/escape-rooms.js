import { todo } from '../todo.js'

// Source: the Escape Rooms portfolio (49 pages) and the earlier Escape Rooms site.
export default {
  slug: 'escape-rooms',
  title: 'Escape Rooms',
  type: 'collection',
  disciplines: ['garments', 'bags', 'footwear', 'materials'],
  featured: true,
  order: 2,
  premise: 'A ready-to-wear leather collection about the routines we keep wanting to escape: a jacket, four convertible bags and a high ankle boot.',
  overview: [
    '“We keep wanting to escape the soft constraints, while the mundane is still where life unfolds.” Modern mundanity comes from predictable routines, digital repetition and the order that standardises our days. Escape Rooms works grounded forms inside that bounded space, using wayfinding signs, sealed doors and underpasses as its references.',
    'The collection covers a waist-length unisex jacket in cherry maroon sheep nappa, four bags in olive cow suede and printed microfibre that each carry more than one way, and a high ankle boot in dark green oil pull-up leather, each with specification and a bill of materials.',
  ],
  facts: [
    ['Season', 'Ready-to-wear, A/W 2026'],
    ['Pieces', 'Jacket (1 week), four bags (2 months), high ankle boot (2 weeks)'],
    ['Role', todo('Your role on this collection')],
    ['Year and context', todo('Year and course or module')],
    ['Downloads', 'Project PDFs below, and the 49-page portfolio'],
  ],
  cover: { image: 'escape-rooms/look', alt: 'Model in the Escape Rooms jacket carrying the olive suede duffle' },
  hero: { image: 'escape-rooms/campaign', alt: 'Escape Rooms campaign image', caption: 'Campaign image, Escape Rooms.' },
  accent: { paper: '#d4c7c3', ink: '#6a1f2e', color: '#6a1f2e' },
  related: ['auxin', 'rexine-jacket', 'swatches'],
  seo: { description: 'Escape Rooms: a ready-to-wear leather collection by Aditi Arya. A cherry nappa jacket, four convertible olive suede bags and a dark green high ankle boot.' },

  sections: [
    {
      id: 'concept', title: 'Concept',
      modules: [
        { kind: 'quote', text: 'We keep wanting to escape the soft constraints, while the mundane is still where life unfolds.' },
        { kind: 'text', body: [
          'Modern mundanity emerged from predictable routines, digital repetition, economic pressures and the bureaucratic order that standardised our days, flattening experience into cycles of work, obligation and shallow stimulation.',
          'Escape Rooms captures this tension by working grounded forms in a bounded space of everyday life, asking them to navigate restrictions with creativity and focus. The phrases on the inspiration board, “sealed entrance”, “follow the line”, “it loops”, “entry != exit”, became the collection’s signage.',
        ] },
        { kind: 'boards', cols: 2, items: [
          { image: 'escape-rooms/board-inspiration', alt: 'Inspiration board: exit signs, sealed doors, an empty parking garage', caption: 'Inspiration, labelled with wayfinding phrases.' },
          { image: 'escape-rooms/board-moodboard', alt: 'Moodboard: green corridors, a grid tunnel, an eye in close-up', caption: 'Moodboard.' },
        ] },
        { kind: 'groups', items: [
          { title: 'Who it is for', body: 'Ages 18–30 in Mumbai, Delhi, Bangalore, Pune and Hyderabad: students, creatives, freelancers and early professionals.' },
          { title: 'How they live', body: 'They move between college, work, cafés and studios with multi-purpose essentials, and want pieces that adapt to each setting while still feeling individual.' },
        ] },
        { kind: 'palette', heading: 'Six colours from the underpass', colors: [
          { name: 'Olive', code: 'Pantone 7763 C', hex: '#5e5c3a' }, { name: 'Umber', code: 'Pantone 7532 C', hex: '#6b5543' },
          { name: 'Burnt wood', code: 'Pantone 476 C', hex: '#4e3526' }, { name: 'Cherry', code: 'Pantone 7428 C', hex: '#6a1f2e' },
          { name: 'Fort Knox', code: 'Pantone 20-0037 TPM', hex: '#a68b45' }, { name: 'Deep green', code: 'Pantone 567 C', hex: '#1f4439' },
        ] },
      ],
    },
    {
      id: 'jacket', title: 'Jacket',
      intro: 'Waist-length, unisex, with a kimono-based silhouette. Developed over one week.',
      modules: [
        { kind: 'annotated', image: 'escape-rooms/jacket-front', alt: 'Model wearing the cherry maroon nappa jacket open, olive suede collar and cuffs', notes: [
          { x: 0.63, y: 0.21, label: 'Standing dual-tone collar', text: 'olive suede lining the cherry nappa.' },
          { x: 0.73, y: 0.39, label: 'Antique-finish rivets', text: 'on each front strap.' },
          { x: 0.73, y: 0.45, label: 'Buckle closure', text: 'a column of straps with antique buckles.' },
          { x: 0.06, y: 0.42, label: 'Cuff-accented half sleeve', text: 'suede turned back at the cuff.' },
          { x: 0.13, y: 0.58, label: 'Contrast panelling at the hem', text: 'suede again at the hem.' },
        ] },
        { kind: 'images', cols: 2, items: [
          { image: 'escape-rooms/jacket-back', alt: 'Back view of the jacket, kimono sleeves falling from a dropped shoulder', caption: 'Back: kimono sleeves from a dropped shoulder.' },
          { image: 'escape-rooms/jacket-close', alt: 'Collar held open, olive suede against maroon nappa', caption: 'Collar: olive suede against cherry nappa.' },
        ] },
        { kind: 'spec', title: 'Specification, look 1', rows: [
          ['Materials', 'Cherry maroon sheep nappa; olive suede'], ['Length / chest / waist', '25 in / 38 in / 32 in'],
          ['Sleeve length / cap height', '15 in / 9 in'], ['Cuff width', '4 in'], ['Size', 'M'],
          ['Thread', '3-ply polyester'], ['Trims', 'Buckles, rivets'], ['Care', 'Professional leather clean only'],
        ] },
      ],
    },
    {
      id: 'bags', title: 'Bags',
      intro: 'Four bags in olive cow suede and brown texture-print microfibre. Each carries more than one way: detachable straps, external pockets and concealed zips. Developed over two months.',
      modules: [
        { kind: 'board', image: 'escape-rooms/board-bag-explorations', alt: 'Bag sketch explorations', caption: 'Explorations.' },
        { kind: 'range', prefix: 'Bag', items: [
          { name: 'Duffle', image: 'escape-rooms/duffle', desc: 'Changes between duffle, top handle, backpack, shoulder and crossbody. Five front pockets, push-lock flap.', material: '17 × 9.5 × 5.5 in · 47.2 in detachable strap' },
          { name: 'T-base', image: 'escape-rooms/tbase', desc: 'A crossbody layered with pockets: card slots, a flap gusset and rings for charms.', material: '12 × 10.5 × 3 in · 40 in strap' },
          { name: 'Drawstring', image: 'escape-rooms/drawstring', desc: 'Drawstring body with a studded push-lock flap pocket and a zipped printed base.', material: '12 × 15 × 2.5 in · 30 in string' },
          { name: 'Hobo', image: 'escape-rooms/hobo-single', desc: 'A small crossbody gathered into pleats between suede panels, closed with one zip.', material: '12 × 5 in · 40 in strap' },
        ] },
        { kind: 'spec', title: 'Material cost from the bills of materials', costing: {
          caption: 'Line items summed per bag', head: ['Bag', 'Suede', 'Hardware', 'Material cost'],
          rows: [['Duffle', '70 dm²', '8 dogtooth hooks, 52 rivets, push lock', '₹989'], ['T-base', '35 dm²', 'Push lock, 20 rivets', '₹587.50'], ['Drawstring', '45 dm²', '8 dogtooth hooks, buckle', '₹810'], ['Hobo', '15 dm²', 'D-rings, base studs', '₹353.50']],
        }, note: todo('Confirm two totals: the Duffle sheet prints ₹969 and the Drawstring sheet ₹870, while their line items add up to ₹989 and ₹810.') },
        { kind: 'details', title: 'Duffle specification sheet', summary: 'Original page', modules: [
          { kind: 'board', image: 'escape-rooms/board-duffle-spec', alt: 'Duffle bag specification sheet and bill of materials', caption: 'Specification and bill of materials, duffle.' },
        ] },
      ],
    },
    {
      id: 'boots', title: 'Boots',
      intro: 'High ankle boots in dark green, for city and cold-weather wardrobes. Developed over two weeks.',
      modules: [
        { kind: 'board', image: 'escape-rooms/board-boot-explorations', alt: 'Boot sketch explorations', caption: 'Explorations.' },
        { kind: 'board', image: 'escape-rooms/board-exploded-view', alt: 'Exploded view of the boot: upper, EVA sheet, Texon, insole, midsole, outsole', caption: 'Exploded view: six layers from upper to outsole.' },
        { kind: 'images', cols: 2, items: [
          { image: 'escape-rooms/boot-detail', alt: 'Hands tying the laces through leather loops', caption: 'Leather lacing loops.' },
          { image: 'escape-rooms/boot', alt: 'Side view of the boot, chunky tread sole', caption: 'Side view.' },
        ] },
        { kind: 'spec', title: 'Specification', rows: [
          ['Upper', 'Full grain oil pull-up leather, 1.6–2.0 mm'], ['Lining', 'Sheep nappa, 0.6 mm'], ['Construction', 'Cemented / direct injection'],
          ['Outsole', 'PU'], ['Heel height', '25–35 mm'], ['Tongue', 'Closed gusset, dust resistant'], ['Size', 'UK 9 / EU 43–44'],
        ], costing: { caption: 'Bill of materials', head: ['Component', 'Cost'], rows: [['Upper', '₹330'], ['Toe puff and heel counter', '₹40'], ['Lining', '₹100'], ['Collar padding', '₹20'], ['Insole', '₹40'], ['Midsole', '₹40'], ['Outsole', '₹110'], ['Laces', '₹60'], ['Thread', '₹40']], total: '₹780' } },
      ],
    },
    {
      id: 'final', title: 'Final collection', final: true,
      modules: [
        { kind: 'image', image: 'escape-rooms/collection', alt: 'All four bags laid together on a suede-draped plinth', caption: 'The four bags.', size: 'wide' },
        { kind: 'images', cols: 2, items: [
          { image: 'escape-rooms/look', alt: 'Model in the jacket carrying the duffle', caption: 'Jacket and duffle.' },
          { image: 'escape-rooms/bags-pair', alt: 'Drawstring and hobo bags held out side by side', caption: 'Drawstring and hobo.' },
        ] },
        { kind: 'link', href: '/escape-rooms/experience/', label: 'Walk through the interactive room', note: 'The collection as a scroll-driven 3D experience, built for this project.' },
        { kind: 'files', heading: 'Downloads', items: [
          { label: 'Jacket, project PDF', href: '/downloads/Aditi-Arya-Kimono-Jacket.pdf' },
          { label: 'Bags, project PDF', href: '/downloads/Aditi-Arya-Escape-Rooms.pdf' },
          { label: 'Boots, project PDF', href: '/downloads/Aditi-Arya-Ankle-Boots.pdf' },
          { label: 'Full Escape Rooms portfolio, 49 pages', href: '/downloads/Aditi-Arya-Full-Portfolio.pdf', size: 'PDF, 10 MB' },
        ] },
      ],
    },
    {
      id: 'reflection', title: 'Reflection',
      modules: [{ kind: 'text', body: [todo('What you learned from Escape Rooms, and what you would develop next.')] }],
    },
  ],
}
