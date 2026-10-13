// Self-initiated concept. Not commissioned, not produced. Brands named in research
// are references for positioning only. Photographs are planned shots.
export default {
  slug: 'luxury-bags',
  title: 'Sediment',
  subtitle: 'Luxury / Refined Aesthetic Bags · “Sediment” is a proposed display title',
  type: 'concept',
  disciplines: ['bags', 'materials'],
  featured: true,
  order: 10,
  premise: 'Eight bags in neutral leathers whose forms come from rock strata: stacked edges, cut sections and offsets that look carved rather than sewn.',
  overview: [
    'Sediment builds bags the way rock builds, in layers. On the hero bag the cut edge of the leather becomes the main surface: up to six plies stacked and each painted a shade darker, so the edge reads like strata. Other bags take a geological section as their silhouette, a core sample, a fault, a pebble worn smooth.',
    'The palette stays quiet: bone, chalk, stone, clay and umber, with brushed brass used once per bag. There is no logo on the outside. Each bag has one structural idea a customer could name.',
  ],
  facts: [
    ['Status', 'Self-initiated concept'],
    ['Range', '8 bags'],
    ['Palette', 'Bone, chalk, stone, clay, umber'],
    ['Deliverables', 'Range, edge studies, material board, campaign plan'],
  ],
  cover: { shot: { n: 1, title: 'Stratum top-handle on a plaster plinth', tone: 'light' } },
  hero: { shot: { n: 1, title: 'Stratum top-handle bag on a plaster plinth', direction: 'The bag side-on so the six-ply edge runs across the frame. Plinth and wall the same chalk tone as the leather.', light: 'One hard source raking at 10° to the surface; deep shadow on the far side', tone: 'light' } },
  accent: { paper: '#e7e2d8', ink: '#3b332b', color: '#8a7a66' },
  related: ['brand-identity', 'escape-rooms', 'archive-reconstruction'],
  seo: { description: 'Sediment: a self-initiated concept by Aditi Arya for eight luxury bags in neutral leathers, with forms taken from rock strata and stacked, painted edges.' },

  sections: [
    {
      id: 'brief', title: 'Design brief',
      modules: [
        { kind: 'text', heading: 'Proposed brief', body: [
          'Design eight bags for a luxury house at the quiet end of the market: neutral colours, no logos on the outside, and forms recognisable without a monogram. Every bag must carry one structural idea a customer can name.',
        ] },
        { kind: 'list', heading: 'Self-set constraints', cols: 2, items: [
          'Vegetable-tanned calf, box calf and nubuck only',
          'Hardware reduced to one brass fitting per bag',
          'Buildable with standard leather goods construction: turned, folded, edge-painted. No moulded plastic',
          'Neutral palette; colour comes from the edges',
        ] },
      ],
    },
    {
      id: 'research', title: 'Market and trend research',
      modules: [
        { kind: 'groups', items: [
          { title: 'Quiet luxury', body: 'The Row, Khaite and Jil Sander: no visible branding, attention on proportion and material.' },
          { title: 'Craft as signature', body: 'Bottega Veneta’s intrecciato is recognisable without a logo; Loewe builds identity on craft and puzzle construction; Hermès on stitching and edge work.' },
          { title: 'Sculptural forms', body: 'Alaïa and Loewe show bags handled as objects: carved, folded, architectural.' },
          { title: 'The gap', body: 'Neutral luxury bags tend toward soft and plain. Few play with section and layering while staying quiet.' },
        ] },
        { kind: 'list', heading: 'Trend forecasting: signals', cols: 2, items: [
          'Recognisable without a logo',
          'Sculptural, architectural bag forms',
          'Construction shown as decoration: edges, layers, seams',
          'Mineral neutrals: stone, chalk, clay',
          'Heirloom and repair stories',
        ] },
        { kind: 'text', body: ['A designer’s reading of recent collections and retail, not a sourced forecast.'] },
      ],
    },
    {
      id: 'brainstorm', title: 'Brainstorm',
      modules: [
        { kind: 'component', name: 'Mindmap', props: {
          center: 'Strata',
          branches: [
            { label: 'Layering', leaves: ['stacked edges', 'graduated tones', 'visible plies'] },
            { label: 'Cut', leaves: ['section', 'core sample', 'split'] },
            { label: 'Time', leaves: ['deposit', 'patina', 'wear'] },
            { label: 'Weight', leaves: ['base', 'gravity', 'carved handle'] },
            { label: 'Quiet', leaves: ['no logo', 'neutral', 'proportion'] },
          ],
          rejected: ['stone-print leather', 'marble effect', 'gold logo plate'],
        } },
      ],
    },
    {
      id: 'audience', title: 'Consumer persona and client board',
      modules: [
        { kind: 'groups', items: [
          { title: 'Who', items: ['30–50', 'Architects, gallerists, collectors of design objects', 'India and abroad'] },
          { title: 'How they buy', items: ['One bag every year or two', 'Kept for a decade', 'Repairs rather than replaces'] },
          { title: 'What they want', items: ['A form people recognise without a logo', 'Leather that ages well', 'Quiet, exact proportion'] },
        ] },
        { kind: 'list', heading: 'Client board: labels whose customers this range speaks to', cols: 3, items: ['The Row', 'Loewe', 'Bottega Veneta', 'Hermès', 'Khaite', 'Jil Sander'] },
        { kind: 'text', body: ['Named for positioning only. No association with these labels is implied.'] },
      ],
    },
    {
      id: 'concept', title: 'Concept and narrative',
      modules: [
        { kind: 'quote', text: 'The edge is the surface.' },
        { kind: 'text', body: [
          'Leather goods usually hide their edges: folded under, bound, painted to match. Sediment does the opposite. Plies of leather are stacked and the cut edge is left on show, painted in six graduated tones from bone to umber, so a bag reads like a cliff face in section.',
          'Where the edge is not the idea, the section is: a cylindrical bag shaped like a core sample, a shoulder bag split along a fault line, a clutch worn smooth like a river stone.',
        ] },
      ],
    },
    {
      id: 'moodboard', title: 'Inspiration and moodboard',
      intro: 'References to source and photograph.',
      modules: [
        { kind: 'images', cols: 3, stagger: true, items: [
          { placeholder: 'Sandstone strata in close-up', ratio: 3 / 4 },
          { placeholder: 'Geological core samples on racks', ratio: 1 },
          { placeholder: 'A split boulder with clean faces', ratio: 3 / 4 },
          { placeholder: 'Plaster casts in a sculptor’s studio', ratio: 1 },
          { placeholder: 'Erosion lines on a riverbank', ratio: 3 / 4 },
          { placeholder: 'Architect’s section drawings', ratio: 1 },
        ] },
      ],
    },
    {
      id: 'colour', title: 'Colour board',
      modules: [
        { kind: 'palette', colors: [
          { name: 'Bone', hex: '#e8e1d3', note: 'Nubuck' },
          { name: 'Chalk', hex: '#d8d2c5', note: 'Box calf' },
          { name: 'Stone', hex: '#b9ae9c', note: 'Box calf' },
          { name: 'Clay', hex: '#9a7b62', note: 'Suede lining' },
          { name: 'Umber', hex: '#5b4636', note: 'Darkest edge ply' },
          { name: 'Ink', hex: '#22201d', note: 'Stitching' },
          { name: 'Brushed brass', hex: '#a08458', note: 'One fitting per bag' },
        ] },
      ],
    },
    {
      id: 'materials', title: 'Material board',
      modules: [
        { kind: 'materials', items: [
          { name: 'Vegetable-tanned calf, natural, 1.8–2.0 mm', use: 'Structure and stacked edges', note: 'Takes edge paint and burnishing; darkens with age' },
          { name: 'Box calf, chalk and stone', use: 'Outer panels' },
          { name: 'Nubuck, bone', use: 'Soft forms' },
          { name: 'Suede, clay', use: 'Linings' },
          { name: 'Edge paint, six graduated tones', use: 'Strata edges' },
          { name: 'Brushed brass', use: 'One fitting per bag' },
          { name: 'Cellulose acetate, stone tones', use: 'Carved handles' },
        ] },
      ],
    },
    {
      id: 'development', title: 'Design development',
      modules: [
        { kind: 'steps', items: [
          { title: 'Edge stacks', body: 'Test stacks from two to six plies, skived, glued and painted in graduated tones, to find how thick an edge can get before the bag turns heavy.' },
          { title: 'Paper forms', body: 'Each silhouette mocked up in card and paper at full size, then in toile leather.' },
          { title: 'Sections', body: 'A section drawing for every bag, the way an architect draws a wall, to plan where plies sit.' },
          { title: 'One fitting', body: 'Hardware cut back until each bag has a single brass piece doing one job.' },
        ] },
        { kind: 'images', cols: 3, items: [
          { placeholder: 'Edge-stack test pieces, 2 to 6 plies', ratio: 1 },
          { placeholder: 'Card mock-ups of the eight forms', ratio: 1 },
          { placeholder: 'Section drawing: Stratum', ratio: 1 },
        ] },
      ],
    },
    {
      id: 'range', title: 'Range development',
      modules: [
        { kind: 'range', prefix: 'Bag', items: [
          { name: 'Stratum', desc: 'Structured top-handle. Six-ply edges painted bone to umber run round the whole body.', material: 'Veg-tan calf · box calf' },
          { name: 'Core', desc: 'Cylindrical bucket shaped like a core sample, standing on a carved brass base.', material: 'Box calf · brass' },
          { name: 'Fault', desc: 'Shoulder bag in two halves joined off-centre, so the seam steps like a fault line.', material: 'Box calf, two tones' },
          { name: 'Pebble', desc: 'Soft clutch, wet-moulded from vegetable-tanned leather to a worn-smooth form.', material: 'Veg-tan calf' },
          { name: 'Shelf', desc: 'Baguette whose flap cantilevers past the body like a ledge.', material: 'Box calf' },
          { name: 'Cairn', desc: 'Crossbody of three graduated pouches stacked on one strap.', material: 'Nubuck · suede' },
          { name: 'Silt', desc: 'Oversized unlined tote, folded from one piece with raw, burnished edges.', material: 'Veg-tan calf' },
          { name: 'Erosion', desc: 'Minaudière with a hand-carved acetate handle in stone tones.', material: 'Box calf · acetate' },
        ] },
      ],
    },
    {
      id: 'campaign', title: 'Campaign and shoot', final: true,
      intro: 'Product first, under experimental hard light. Every frame below is a planned shot.',
      modules: [
        { kind: 'shots', layout: 'feature', items: [
          { n: 1, title: 'Stratum on a plaster plinth', direction: 'Side-on, so the six-ply edge runs across the frame. Plinth and wall in the same chalk tone as the leather.', light: 'Hard source raking at 10°; far side in deep shadow', tone: 'light', ratio: 16 / 9 },
          { n: 2, title: 'The edge, in macro', direction: 'Six plies, each a shade darker, filling the frame like rock in section.', light: 'Focus-stacked macro, single hard light from above', tone: 'light' },
          { n: 3, title: 'Held against the body', direction: 'Fault bag held flat to the chest; the face cropped out above the mouth.', light: 'Hard top light', cast: 'Indian, gender-neutral, stone-coloured tailoring', tone: 'light' },
          { n: 4, title: 'Core on sand', direction: 'The Core bag standing alone on raked sand, long shadow toward camera.', light: 'One hard backlight (sun or HMI) low behind the bag', tone: 'accent' },
          { n: 5, title: 'The range in layers', direction: 'All eight on stepped plinths, built like a stratified cliff.', light: 'Flat hard flash, no fill', tone: 'light' },
          { n: 6, title: 'Silt in motion', direction: 'The tote swinging from a hand, the bag sharp at one end of its arc.', light: 'Flash with a slow shutter', cast: 'Indian, gender-neutral', tone: 'dark' },
          { n: 7, title: 'Burnishing', direction: 'Hands burnishing an edge; the slicker and the stacked plies in focus.', light: 'Practical lamp over the bench', tone: 'dark' },
          { n: 8, title: 'Cairn on the back', direction: 'Back view against raw concrete; the three pouches read as a stack.', light: 'Hard noon light, short shadow', tone: 'light' },
        ] },
      ],
    },
    {
      id: 'next', title: 'Limitations and next steps',
      modules: [
        { kind: 'text', body: [
          'A self-initiated concept: no bags have been made and no photographs taken yet.',
          'Next: make the edge-stack tests to settle weight and ply count, prototype Stratum and Core in toile leather, then cost the range against the brief’s price position.',
        ] },
      ],
    },
  ],
}
