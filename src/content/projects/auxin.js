import { todo } from '../todo.js'

// Source: Aditi's Auxin presentation (28 pages). Text is hers, transcribed or lightly
// condensed; boards are her pages; photographs are from her shoot.
export default {
  slug: 'auxin',
  title: 'Auxin',
  type: 'collection',
  disciplines: ['garments', 'footwear', 'materials'],
  featured: true,
  order: 1,
  premise: 'A collection shaped by invisible forces: like a plant growing toward light, each piece stretches, leans and weathers instead of holding a fixed form.',
  overview: [
    'Auxin is the plant hormone that directs growth in response to water, gravity, pressure and light. The collection borrows that movement: silhouettes that lengthen like submerged plants reaching for filtered light, and vertical ribbing that reads as vascular structure, giving a sense of upward pull.',
    'It is a hands-on collection across garments and footwear: a menswear ensemble (an asymmetric kimono-inspired leather jacket with pleated, striped trousers) and two boot ranges, calf boots and cowboy boots. Each went through trend research, sketching, range development, specification and costing.',
  ],
  facts: [
    ['Season', 'A/W 27/28'],
    ['Pieces', 'Jacket and trousers; calf boots; cowboy boots'],
    ['Role', todo('Your role, e.g. design, pattern, construction, styling')],
    ['Year and context', todo('Year and course or module')],
    ['Status', 'Ensemble made and photographed. Boot photographs to come.'],
  ],
  cover: { image: 'auxin/final-editorial-1', alt: 'Model in the Auxin jacket: blue oil pull-up leather with a kimono crossover front, tied at the waist, over striped trousers' },
  hero: {
    images: [
      { image: 'auxin/final-closeup', alt: 'Close-up of the jacket’s crossover neckline and the grain of the blue leather' },
      { image: 'auxin/final-editorial-1', alt: 'Model in the jacket and striped trousers against a pale blue wall' },
      { image: 'auxin/final-full-look', alt: 'Full look: the jacket tied with its lace, and wide striped trousers with a teal pleated panel' },
    ],
    caption: 'The finished ensemble. Jacket in blue oil pull-up cow leather; trousers in striped curtain fabric with a teal pleat along the outer seam.',
  },
  accent: { paper: '#d6dece', ink: '#22397a', color: '#22397a' },
  related: ['escape-rooms', 'footwear-concept-collection', 'swatches'],
  seo: { description: 'Auxin: a leather collection by Aditi Arya across garments and footwear, built on how plants grow toward light. Jacket and trousers, calf boots and cowboy boots.' },

  sections: [
    {
      id: 'concept', title: 'Concept',
      intro: 'From the plant hormone that bends growth toward light, to clothes that seem altered by their surroundings.',
      modules: [
        { kind: 'quote', text: 'Like submerged aquatic plants elongating toward filtered light, the silhouette is made to stretch, weather, and be continuously altered by its surroundings rather than constructed as a fixed wearable.', cite: 'From the moodboard' },
        { kind: 'board', image: 'auxin/board-moodboard', alt: 'Moodboard: cyanotype roots, green and yellow aquatic forms, and hyacinth bulbs with their roots', caption: 'Moodboard. The vertical ribbing references vascular structures and underwater plant elongation.' },
        { kind: 'boards', cols: 2, items: [
          { image: 'auxin/board-brainstorm', alt: 'Brainstorm drawn as a stem from root to light', caption: 'Brainstorm. A stem from “root, the concept, unmoving” to “grows toward light”, branching into reaching, asymmetry, phototropism, material memory, structural bend and leather grain. Crossed out: “too literal: photosynthesis pun — keep it abstract, not botanical.”' },
          { image: 'auxin/board-inspiration', alt: 'Inspiration board of scanned and annotated plant forms', caption: 'Inspiration. Scientific plant imagery and scanning diagrams.' },
        ] },
      ],
    },
    {
      id: 'research', title: 'Research',
      intro: 'Trend direction for A/W 27/28 and the person the collection is for.',
      modules: [
        { kind: 'text', heading: 'Trend forecasting', body: [
          'The garment brief: design a range and develop one ensemble of a menswear leather jacket or shirt with trousers, in any material, as a material exploration.',
          'Research pointed to #SoftVolume shapes and kimono-inspired cover-ups, constructions that favour responsible leathers and plant-based alternatives, and new neutrals drawn from nature: soft greens, browns and metallics, with Deep Green forecast to give depth to A/W 27/28 (source: WGSN).',
        ] },
        { kind: 'board', image: 'auxin/board-garment-trend', alt: 'Trend forecasting board for garments with runway and street images', caption: 'Trend forecasting for the garment. Source: WGSN.' },
        { kind: 'groups', items: [
          { title: 'Demographics', items: ['Age 22–35', 'Unisex', 'Urban metropolitan cities', 'Creative professionals: designers, architects, musicians, stylists, media professionals', 'Income above ₹15 LPA'] },
          { title: 'Psychographics', items: ['Visually expressive', 'Experimental', 'Likes subtle conceptual storytelling', 'Handmade, artisanal feel', 'Creative identity through clothing', 'Individual styling over trends'] },
          { title: 'Influences', items: ['Fashion weeks, editorials, Instagram creators', 'Indie and alternative music, experimental genres', 'Contemporary art, architecture, exhibitions', 'Creative directors, musicians, stylists'] },
          { title: 'Lifestyle', items: ['Cafés', 'Art shows', 'Thrift stores', 'Music gigs'] },
        ] },
        { kind: 'details', title: 'Consumer persona board', summary: 'The original page, with styling references', modules: [
          { kind: 'board', image: 'auxin/board-consumer-persona', alt: 'Consumer persona board', caption: 'Consumer persona.' },
        ] },
      ],
    },
    {
      id: 'materials', title: 'Colour and material',
      intro: 'Blues and greens from water and plant tissue; leather set against furnishing fabrics.',
      modules: [
        { kind: 'palette', colors: [
          { name: 'Surf the Web', code: 'Pantone 19-3952 TCX', hex: '#203c7f' },
          { name: 'Teal', code: 'Pantone 7699 C', hex: '#34657f' },
          { name: 'Green Eyes', code: 'Pantone 16-0224 TCX', hex: '#7d956d' },
          { name: 'Juniper', code: 'Pantone 18-6330 TCX', hex: '#3d7245' },
        ] },
        { kind: 'materials', heading: 'Garment materials', items: [
          { name: 'Full grain cow leather, oil pull-up', use: 'Jacket shell' },
          { name: 'Upholstery fabric', use: 'Jacket and trouser panels' },
          { name: 'Curtain fabric, striped', use: 'Trousers' },
          { name: 'Polyester', use: 'Jacket lining' },
          { name: 'Crepe', use: 'Trouser lining' },
          { name: 'Buckram, fusing', use: 'Waistband structure' },
          { name: 'Magnet buttons, metal clasp hooks, zipper, plastic button', use: 'Closures' },
        ] },
        { kind: 'board', image: 'auxin/board-garment-colour-material', alt: 'Colour and material board for the garment', caption: 'Colour and material board, garment. Swatch photographs on the board are reference images.' },
        { kind: 'text', body: ['Screen colours are close approximations of the Pantone references.'] },
      ],
    },
    {
      id: 'garment', title: 'Garment: jacket and trousers',
      intro: 'An asymmetric kimono-inspired jacket with adjustable sleeve lengths, and relaxed striped trousers with pleating along the outer seam.',
      modules: [
        { kind: 'board', image: 'auxin/board-garment-forms-shapes', alt: 'Pages of silhouette sketches for jackets and trousers', caption: 'Forms and shapes: silhouette sketches.' },
        { kind: 'image', image: 'auxin/range-garments', alt: 'Five ensemble variations of the jacket and trousers', caption: 'Range: five variations on the jacket and trousers.', size: 'wide', tone: 'accent' },
        { kind: 'image', image: 'auxin/final-design-front-back', alt: 'Final design, front and back: the back shows a centre seam with a teal pleat insertion', caption: 'Final design, front and back. Centre back seam with a teal pleat insertion.', size: 'inset', tone: 'accent' },
        { kind: 'spec', title: 'Specification: jacket', rows: [
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
          ['Colour finish', 'Aqua oil pull-up, distressed vintage effect'],
          ['Water resistance', 'Semi water-resistant (treated leather)'],
        ], costing: {
          caption: 'Costing: jacket', head: ['Material', 'Quantity', 'Rate', 'Cost'],
          rows: [['Leather', '350 dm²', '₹6/dm²', '₹2,100'], ['Polyester lining', '1 m', '₹100/m', '₹100'], ['Teal pleat fabric', '0.5 m', '₹400/m', '₹200'], ['Sewing thread', '1 reel', '₹40', '₹40'], ['Magnet buttons', '2 pc', '₹10 each', '₹20']],
          total: '₹2,460',
        } },
        { kind: 'spec', title: 'Specification: trousers', rows: [
          ['Category', 'Flared trousers, menswear'],
          ['Fabric', 'Striped fabric, upholstery fabric'],
          ['Lining', 'Crepe'],
          ['Waistband', 'Structured'],
          ['Closure', 'Hook and zipper'],
          ['Pleat placement', 'Outer seam'],
          ['Pockets', 'Side seam'],
          ['Hem', 'Blind hem'],
          ['Surface', 'Alternating vertical stripes'],
        ], costing: {
          caption: 'Costing: trousers', head: ['Material', 'Quantity', 'Rate', 'Cost'],
          rows: [['Green fabric', '2.3 m', '₹350/m', '₹805'], ['Crepe', '1 m', '₹50/m', '₹50'], ['Teal pleat fabric', '0.3 m', '₹400/m', '₹120'], ['Waistband fusing', '0.3 m', '₹50/m', '₹15'], ['Zipper', '1 pc', '₹20', '₹20'], ['Hooks', '2 sets', '₹20/pc', '₹40'], ['Sewing thread', '1 reel', '₹40', '₹40']],
          total: '₹1,090',
        } },
        { kind: 'details', title: 'Specification sheet', summary: 'The original page with technical flats', modules: [
          { kind: 'board', image: 'auxin/board-garment-spec-costing', alt: 'Specification and costing sheet with jacket and trouser flats', caption: 'Specification and costing, garment.' },
        ] },
      ],
    },
    {
      id: 'calf-boots', title: 'Footwear: calf boots',
      intro: 'A range of calf-length lace-up boots, developed into one pair.',
      modules: [
        { kind: 'text', body: [
          'Research followed the #BoxingBoot: forecast as a key item through #SportCore, with knee-high or mid-calf lengths for directional ranges, rubber soles for grip, and gender-inclusive styles (source: WGSN).',
        ] },
        { kind: 'materials', heading: 'Materials', items: [
          { name: 'Ostrich-embossed leather', use: 'Upper, tongue and eyestay; deep blue' },
          { name: 'Upholstery / curtain fabric', use: 'Contrast panels; muted green' },
          { name: 'Flat laces', use: 'Fastening' },
          { name: 'Skinfit', use: 'Lining' },
          { name: 'Texon sheet', use: 'Insole' },
          { name: 'Rubber', use: 'Outsole, flat lug profile' },
        ] },
        { kind: 'board', image: 'auxin/board-calf-boots-forms-shapes', alt: 'Two pages of boot sketches', caption: 'Forms and shapes: boot sketches.' },
        { kind: 'images', cols: 2, align: 'top', items: [
          { image: 'auxin/calf-boots-range', alt: 'Range of five calf boot designs in blue embossed leather with green panels', caption: 'Range.' },
          { image: 'auxin/calf-boots-final-design', alt: 'Final calf boot design: front, back and side views', caption: 'Final design: front, back and side.' },
        ] },
        { kind: 'spec', title: 'Specification: calf boots', rows: [
          ['Size', 'UK / India 5'],
          ['Main upper', 'Ostrich-embossed leather, deep blue, textured embossed grain'],
          ['Contrast panels', 'Reinforced curtain fabric, muted green, woven matte'],
          ['Lining', 'Skinfit, full shaft and vamp'],
          ['Toe puff and heel counter', 'Thermoplastic, concealed'],
          ['Outsole', 'Rubber or TPR, black, flat lug profile'],
          ['Eyelets', 'Metal, black / gunmetal'],
        ], note: 'Estimated cost per component, ₹: upper 1,200–2,000; contrast panels 200–400; outsole 350–650; lining 250–400. Full costing on the sheet below.' },
        { kind: 'details', title: 'Trend, colour and specification boards', summary: 'Three original pages', modules: [
          { kind: 'boards', cols: 3, items: [
            { image: 'auxin/board-calf-boots-trend', alt: 'Calf boots trend forecasting board', caption: 'Trend forecasting. Source: WGSN.' },
            { image: 'auxin/board-calf-boots-colour-material', alt: 'Calf boots colour and material board', caption: 'Colour and material.' },
            { image: 'auxin/board-calf-boots-spec-costing', alt: 'Calf boots specification and costing sheet', caption: 'Specification and costing.' },
          ] },
        ] },
      ],
    },
    {
      id: 'cowboy-boots', title: 'Footwear: cowboy boots',
      intro: 'Calf-length cowboy boots in oil pull-up leather with antique rivets.',
      modules: [
        { kind: 'text', body: [
          'Research followed #NuBoheme and #FeminineGrit in festival fashion: mid block heels, structured or soft wide shafts, and refined leather in smooth, grained or polished finishes (source: WGSN).',
        ] },
        { kind: 'materials', heading: 'Materials', items: [
          { name: 'Oil pull-up cow leather', use: 'Upper' },
          { name: 'Upholstery fabric', use: 'Upper panels' },
          { name: 'Antique-finish rivets', use: 'Hardware' },
          { name: 'Skinfit, sheep nappa', use: 'Lining' },
          { name: 'Texon sheet', use: 'Insole' },
          { name: 'Rubber', use: 'Outsole' },
        ] },
        { kind: 'board', image: 'auxin/board-cowboy-boots-forms-shapes', alt: 'Sketchbook pages of cowboy boot forms', caption: 'Forms and shapes.' },
        { kind: 'board', image: 'auxin/board-cowboy-boots-spec-costing', alt: 'Cowboy boot flats with specification and costing tables', caption: 'Specification and costing.' },
        { kind: 'details', title: 'Trend and colour boards', summary: 'Two original pages', modules: [
          { kind: 'boards', cols: 2, items: [
            { image: 'auxin/board-cowboy-boots-trend', alt: 'Cowboy boots trend forecasting board', caption: 'Trend forecasting. Source: WGSN.' },
            { image: 'auxin/board-cowboy-boots-colour-material', alt: 'Cowboy boots colour and material board', caption: 'Colour and material.' },
          ] },
        ] },
      ],
    },
    {
      id: 'final', title: 'Final collection', final: true,
      intro: 'The ensemble as made, and the two boot designs.',
      modules: [
        { kind: 'images', cols: 3, stagger: true, items: [
          { image: 'auxin/final-full-look', alt: 'Full look in the Auxin jacket and trousers', caption: 'Full look.' },
          { image: 'auxin/final-editorial-1', alt: 'The jacket, arm folded across the body', caption: 'Jacket in blue oil pull-up cow leather.' },
          { image: 'auxin/final-closeup', alt: 'Close-up of the crossover neckline', caption: 'Crossover neckline and grain.' },
        ] },
        { kind: 'images', cols: 2, items: [
          { placeholder: 'Calf boots, finished pair', alt: 'Photograph of the finished calf boots, to come', ratio: 4 / 5, caption: 'Calf boots: photographs to come (the final product page in the deck is empty).' },
          { placeholder: 'Cowboy boots, finished pair', alt: 'Photograph of the finished cowboy boots, to come', ratio: 4 / 5, caption: 'Cowboy boots: photographs to come.' },
        ] },
      ],
    },
    {
      id: 'reflection', title: 'Reflection',
      modules: [
        { kind: 'text', body: [todo('What you learned from Auxin: what worked, what you would change, what you would develop next.')] },
        { kind: 'image', image: 'auxin/closing-plant', alt: 'Blurred plant leaning toward light, the closing image of the Auxin deck', caption: '“Exploration on the idea of objects shaped by invisible environmental forces.”', size: 'right' },
      ],
    },
  ],
}
