// Self-initiated concept. Not commissioned, not produced. Brands named in research
// are references for positioning only. Photographs are planned shots.
export default {
  slug: 'archive-reconstruction',
  title: 'Unmade',
  subtitle: 'Archive / Reconstruction · “Unmade” is a proposed display title',
  type: 'concept',
  disciplines: ['garments', 'bags', 'materials'],
  featured: true,
  order: 11,
  premise: 'Old denim and leather offcuts taken apart and rebuilt into gender-fluid workwear and bags, with every seam, patch and repair left on show.',
  overview: [
    'Every piece starts as something else: a pair of jeans, a belt, the leather off a sofa. Unmade takes them apart along their original seams and rebuilds them inside out, so their history stays visible: fade lines, old labels, stitch holes. Leather offcuts go where denim fails first, at knees, pockets, hems and straps, so the repair becomes the design.',
    'The capsule is eight pieces of rugged, gender-fluid workwear and bags, in the tradition of denim deconstruction, with leather pushed further than it usually goes in that work.',
  ],
  facts: [
    ['Status', 'Self-initiated concept'],
    ['Range', '8 pieces: jackets, trousers, bags, accessories'],
    ['Materials', 'Reclaimed denim and leather offcuts only'],
    ['Reference', 'Denim reconstruction (your reference: RKIVECITY)'],
  ],
  cover: { shot: { n: 1, title: 'Rebuilt trucker among drying denim', tone: 'accent' } },
  hero: { shot: { n: 1, title: 'The rebuilt trucker jacket, at a washing ghat among lines of drying denim', direction: 'Wide frame, the model small among the lines of jeans, jacket worn open. Reads first as laundry, then as a person.', light: 'Hard afternoon sun from the side, no fill', cast: 'Indian, gender-neutral, unstyled hair', tone: 'accent' } },
  accent: { paper: '#d8dde4', ink: '#1d2b4a', color: '#2b3f6b' },
  related: ['lingerie-campaign', 'luxury-bags', 'rexine-jacket'],
  seo: { description: 'Unmade: a self-initiated concept by Aditi Arya for gender-fluid workwear and bags rebuilt from reclaimed denim and leather offcuts.' },

  sections: [
    {
      id: 'brief', title: 'Design brief',
      modules: [
        { kind: 'text', heading: 'Proposed brief', body: [
          'Build a capsule of eight pieces from reclaimed denim and leather offcuts, in the tradition of denim deconstruction, and push the leather further. Rugged, worn by anyone, and clearly rebuilt rather than new.',
        ] },
        { kind: 'list', heading: 'Self-set constraints', cols: 2, items: [
          'Only second-hand or deadstock denim, and leather offcuts from factory and upholstery waste',
          'No new fabric: only thread and hardware are bought new',
          'Seams, labels and repairs stay visible',
          'Each piece carries a parts list inside: what it was made from',
        ] },
      ],
    },
    {
      id: 'research', title: 'Market and trend research',
      modules: [
        { kind: 'groups', items: [
          { title: 'Reconstruction', body: 'Maison Margiela’s Artisanal line remakes found garments; Junya Watanabe’s patchwork denim; Greg Lauren’s rebuilt workwear; Children of the Discordance’s vintage textile work.' },
          { title: 'Repair as craft', body: 'Kapital’s boro-inspired, visibly mended denim treats repair as ornament.' },
          { title: 'Heritage patchwork', body: 'Ahluwalia builds patchwork from deadstock and from Indian and Nigerian heritage.' },
          { title: 'The gap', body: 'Reconstructed denim is common. Reconstruction that combines denim with leather, and makes bags from the same parts as the clothes, is rarer.' },
        ] },
        { kind: 'list', heading: 'Trend forecasting: signals', cols: 2, items: [
          'Upcycled pieces sold as one-of-a-kind luxury',
          'Visible mending',
          'Workwear silhouettes: carpenter, chore, trucker',
          'Gender-fluid volume',
          'Provenance shown on the garment',
        ] },
        { kind: 'text', body: ['A designer’s reading of recent collections and resale, not a sourced forecast.'] },
      ],
    },
    {
      id: 'brainstorm', title: 'Brainstorm',
      modules: [
        { kind: 'component', name: 'Mindmap', props: {
          center: 'Unmade',
          branches: [
            { label: 'Take apart', leaves: ['unpicked seams', 'waistbands', 'pocket bags'] },
            { label: 'Rebuild', leaves: ['patchwork', 'inside out', 'inversions'] },
            { label: 'Wear', leaves: ['whiskers', 'fades', 'knee holes'] },
            { label: 'Leather', leaves: ['offcuts', 'sofa hides', 'old belts'] },
            { label: 'Proof', leaves: ['parts list', 'original labels', 'stitch holes'] },
          ],
          rejected: ['distressing new denim', 'printed fake patches'],
        } },
      ],
    },
    {
      id: 'audience', title: 'Consumer persona and client board',
      modules: [
        { kind: 'groups', items: [
          { title: 'Who', items: ['20–35', 'Any gender', 'Students, skaters, musicians, makers', 'Metro India'] },
          { title: 'How they buy', items: ['Second-hand first', 'Wants pieces nobody else has', 'Values a story they can check'] },
          { title: 'What they want', items: ['Clothes that look lived in', 'Room to move: workwear volume', 'Bags that take a beating'] },
        ] },
        { kind: 'list', heading: 'Client board: labels whose customers this capsule speaks to', cols: 3, items: ['Maison Margiela', 'Junya Watanabe', 'Kapital', 'Ahluwalia', 'Greg Lauren', 'RKIVECITY'] },
        { kind: 'text', body: ['Named for positioning only. No association with these labels is implied.'] },
      ],
    },
    {
      id: 'concept', title: 'Concept and narrative',
      modules: [
        { kind: 'quote', text: 'The repair is the design.' },
        { kind: 'text', body: [
          'Unmade works backwards from wear. Denim fails in predictable places: knees, pocket edges, hems, the back of the waistband. Those are exactly where leather offcuts go. The rebuilt garment is stronger where the old one broke, and shows it.',
          'Seams are turned outward so the construction is the surface. Original labels, fade lines and stitch holes are kept, and each piece carries a parts list inside: three pairs of jeans, one belt, a sofa’s worth of leather.',
        ] },
      ],
    },
    {
      id: 'moodboard', title: 'Inspiration and moodboard',
      intro: 'References to source and photograph.',
      modules: [
        { kind: 'images', cols: 3, items: [
          { placeholder: 'A washing ghat: lines of drying denim', ratio: 4 / 5 },
          { placeholder: 'Workshop wall of patterns and offcuts', ratio: 1 },
          { placeholder: 'Patched work trousers, boro mending', ratio: 4 / 5 },
          { placeholder: 'Upholstery workshop scraps', ratio: 1 },
          { placeholder: 'Worn knees, whiskers and fades', ratio: 4 / 5 },
          { placeholder: 'Street tailors’ stalls', ratio: 1 },
        ] },
      ],
    },
    {
      id: 'colour', title: 'Colour board',
      modules: [
        { kind: 'palette', colors: [
          { name: 'Raw indigo', hex: '#1f2c4c' }, { name: 'Mid wash', hex: '#4c6a93' }, { name: 'Bleach', hex: '#a9bcd0' },
          { name: 'Ecru', hex: '#e4dcc8', note: 'Pocket bags, selvedge' }, { name: 'Tobacco', hex: '#7a4a2a', note: 'Leather offcuts' },
          { name: 'Rust', hex: '#a3502b', note: 'Thread' }, { name: 'Black', hex: '#151515' },
        ] },
      ],
    },
    {
      id: 'materials', title: 'Material board',
      modules: [
        { kind: 'materials', items: [
          { name: 'Reclaimed denim, 12–14 oz', use: 'All garment bodies', note: 'Sorted by wash before cutting' },
          { name: 'Deadstock selvedge', use: 'Facings and trims' },
          { name: 'Leather offcuts: upholstery and belts', use: 'Knees, yokes, bases, straps' },
          { name: 'Copper rivets and shank buttons', use: 'Kept from the source jeans where possible' },
          { name: 'Waxed linen thread', use: 'Visible stitching' },
          { name: 'Original labels', use: 'Kept and re-sewn' },
        ] },
      ],
    },
    {
      id: 'development', title: 'Design development',
      modules: [
        { kind: 'steps', items: [
          { title: 'Sourcing', body: 'Second-hand jeans bought by weight and sorted by wash, from rinse to bleached.' },
          { title: 'Unpicking', body: 'Taken apart along original seams; every part catalogued: legs, yokes, waistbands, pockets.' },
          { title: 'Floor layouts', body: 'Patchwork laid out on the floor at full size and photographed before cutting.' },
          { title: 'Leather where it breaks', body: 'Offcuts placed over the wear points of the original garments.' },
        ] },
        { kind: 'images', cols: 3, items: [
          { placeholder: 'Sorted piles of jeans by wash', ratio: 1 },
          { placeholder: 'Catalogued parts on a table', ratio: 1 },
          { placeholder: 'Patchwork layout on the floor', ratio: 1 },
        ] },
      ],
    },
    {
      id: 'range', title: 'Range development',
      modules: [
        { kind: 'range', prefix: 'Piece', items: [
          { name: 'Rebuilt trucker', desc: 'Trucker jacket from the backs of four pairs of jeans; leather yoke and cuffs; seams outside.', material: 'Denim · offcut leather' },
          { name: 'Knee-panel carpenter', desc: 'Wide carpenter trouser with leather knees and hammer loop; gender-fluid fit.', material: 'Denim · leather' },
          { name: 'Waistband tote', desc: 'A tote woven from eighteen jeans waistbands, on a leather base.', material: 'Denim · leather' },
          { name: 'Pocket crossbody', desc: 'Built from back pockets, with a leather gusset; the original rivets kept.', material: 'Denim · leather' },
          { name: 'Split skirt-trouser', desc: 'A wrap panel over a trouser; worn by anyone.', material: 'Denim' },
          { name: 'Belt-strap gilet', desc: 'Gilet with old leather belts as straps and closures.', material: 'Denim · belts' },
          { name: 'Patch overshirt', desc: 'Chore shirt in denim patchwork, leather at the elbows.', material: 'Denim · leather' },
          { name: 'Boot gaiters', desc: 'Leather and denim gaiters worn over boots.', material: 'Leather · denim' },
        ] },
      ],
    },
    {
      id: 'campaign', title: 'Campaign and shoot', final: true,
      intro: 'Rugged and on location. Every frame below is a planned shot.',
      modules: [
        { kind: 'shots', layout: 'feature', items: [
          { n: 1, title: 'Among the drying denim', direction: 'The rebuilt trucker at a washing ghat, the model small among lines of drying jeans.', light: 'Hard afternoon sun from the side, no fill', cast: 'Indian, gender-neutral', tone: 'accent', ratio: 16 / 9 },
          { n: 2, title: 'Seams outside', direction: 'Macro of the inside-out seams meeting the leather yoke.', light: 'Raking light across the twill', tone: 'dark' },
          { n: 3, title: 'On the pile', direction: 'Model sitting on a stack of reclaimed jeans in the workshop.', light: 'One bare tungsten bulb, everything else falls off', cast: 'Indian, gender-neutral', tone: 'dark' },
          { n: 4, title: 'Under the flyover', direction: 'Walking fast in the carpenter trousers; traffic behind.', light: 'Flash with a dragged shutter for streaked headlights', tone: 'dark' },
          { n: 5, title: 'Bags on concrete', direction: 'Waistband tote and pocket crossbody on a concrete floor, shot from directly above.', light: 'Hard overhead flash, crisp shadow', tone: 'light' },
          { n: 6, title: 'Three against metal', direction: 'Three models of different builds and genders against a corrugated metal wall.', light: 'Hard sun, squinting faces allowed', cast: 'Three Indian models', tone: 'accent' },
          { n: 7, title: 'Unpicking', direction: 'Hands with a seam ripper opening a side seam; threads in the air.', light: 'Window light, hard', tone: 'light' },
          { n: 8, title: 'Portrait in patchwork', direction: 'Tight portrait in the patch overshirt; the parts-list label visible at the neck.', light: 'Hard window light from one side', tone: 'dark' },
        ] },
      ],
    },
    {
      id: 'next', title: 'Limitations and next steps',
      modules: [
        { kind: 'text', body: [
          'A self-initiated concept: no pieces have been made and no photographs taken yet.',
          'Next: source and sort the first batch of jeans, unpick two pairs to test how many usable parts one pair gives, and prototype the waistband tote, the quickest piece to prove the system.',
        ] },
      ],
    },
  ],
}
