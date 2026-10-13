// Self-initiated concept: identity for a fictional leather label. KOSHA does not exist
// as a business. The mark, type, colour and mockups are drawn in the site itself
// (src/components/mockups.jsx). Brands named in research are references only.
export default {
  slug: 'brand-identity',
  title: 'KOSHA',
  subtitle: 'Brand Identity for a Leather Label · KOSHA is a fictional label',
  type: 'concept',
  disciplines: ['branding'],
  featured: true,
  order: 12,
  premise: 'An identity for a fictional luxury leather label, from name and mark to packaging, an app, outdoor posters and social.',
  overview: [
    'Kosha comes from the Sanskrit kośa: a sheath, a covering, also a treasury. A hide is the body’s covering, and a bag keeps what its owner treasures. The label is imagined as quiet Indian luxury: each piece cut from one hide, numbered, and repaired for as long as its owner has it.',
    'The identity follows that promise. The monogram is a sheath drawn round a K, simple enough to deboss into leather at 12 mm. The serif has the sharp contrast of an edge cut with a knife. The colours come from leather finishing: oxblood, ivory like unbleached cotton, kohl, brass and henna.',
  ],
  facts: [
    ['Status', 'Self-initiated concept; fictional label'],
    ['Deliverables', 'Name, mark, type, colour, icons, voice, packaging, app, outdoor, social'],
    ['Type', 'Bodoni Moda and Schibsted Grotesk (both SIL OFL)'],
  ],
  cover: { component: 'KoshaCover' },
  hero: { component: 'KoshaCover' },
  accent: { paper: '#efe8dc', ink: '#4a1c1c', color: '#4a1c1c' },
  related: ['luxury-bags', 'lingerie-campaign', 'archive-reconstruction'],
  seo: { description: 'KOSHA: a self-initiated brand identity by Aditi Arya for a fictional luxury leather label. Monogram, type, colour, packaging, app and outdoor.' },

  sections: [
    {
      id: 'brief', title: 'Design brief',
      modules: [
        { kind: 'text', heading: 'Proposed brief', body: [
          'Create a complete identity for a luxury leather label based in India: a name and a mark that work debossed into leather as well as on a phone screen, and a system flexible enough for packaging, retail, digital and outdoor.',
        ] },
        { kind: 'list', heading: 'Requirements', cols: 2, items: [
          'Mark legible when debossed at 12 mm',
          'Works in one colour, on leather, paper and screen',
          'A voice as specific as the product',
          'A service, not only a shop: ownership records and repair',
        ] },
      ],
    },
    {
      id: 'research', title: 'Market and trend research',
      modules: [
        { kind: 'groups', items: [
          { title: 'Identity without a logo', body: 'Hermès’ orange box and Bottega Veneta’s weave are recognised before any name is read.' },
          { title: 'Monograms redrawn', body: 'Loewe’s anagram shows a heritage monogram can be made contemporary through drawing, not ornament.' },
          { title: 'Indian leather labels', body: 'Hidesign and Nappa Dori built Indian leather brands with distinct, non-Western identities.' },
          { title: 'The gap', body: 'Few Indian luxury leather identities build on Indian language and on repair as the brand promise.' },
        ] },
        { kind: 'list', heading: 'Trend forecasting: signals', cols: 2, items: [
          'Craft and repair as the brand promise',
          'High-contrast serifs back in luxury identities',
          'Monograms redrawn, not revived',
          'Digital ownership records and repair booking',
        ] },
        { kind: 'text', body: ['A designer’s reading, not a sourced forecast.'] },
      ],
    },
    {
      id: 'brainstorm', title: 'Brainstorm and naming',
      modules: [
        { kind: 'component', name: 'Mindmap', props: {
          center: 'Kosha',
          branches: [
            { label: 'Name', leaves: ['kośa: sheath', 'covering', 'treasury'] },
            { label: 'Material', leaves: ['hide', 'skin', 'cover'] },
            { label: 'Mark', leaves: ['sheath shape', 'K stem', 'deboss'] },
            { label: 'Promise', leaves: ['one hide', 'numbered', 'repaired'] },
            { label: 'Voice', leaves: ['plain', 'warm', 'exact'] },
          ],
          rejected: ['animal imagery', 'gold foil everywhere', 'English heritage pastiche'],
        } },
        { kind: 'text', body: ['Before use as a real brand, the name would need a trademark search in India and the main export markets.'] },
      ],
    },
    {
      id: 'audience', title: 'Customer and client board',
      modules: [
        { kind: 'groups', items: [
          { title: 'Who', items: ['28–55', 'Any gender', 'India’s metros and the diaspora', 'Buys fewer, better things'] },
          { title: 'What they value', items: ['Knowing who made it', 'Repair over replacement', 'Indian identity without costume'] },
        ] },
        { kind: 'list', heading: 'Client board: brands this customer already buys', cols: 3, items: ['Hermès', 'Bottega Veneta', 'Loewe', 'Hidesign', 'Nappa Dori', 'The Row'] },
        { kind: 'text', body: ['Named for positioning only. No association with these brands is implied.'] },
      ],
    },
    {
      id: 'logo', title: 'Mark and logo',
      intro: 'A sheath drawn around the letter K: thick stem, thin arm, the contrast of a knife-cut edge.',
      modules: [
        { kind: 'component', name: 'KoshaLogoSheet' },
      ],
    },
    {
      id: 'type-colour', title: 'Type and colour',
      modules: [
        { kind: 'component', name: 'KoshaType' },
        { kind: 'palette', colors: [
          { name: 'Oxblood', hex: '#4a1c1c', note: 'Primary, packaging' },
          { name: 'Ivory', hex: '#efe8dc', note: 'Paper, unbleached cotton' },
          { name: 'Kohl', hex: '#141210', note: 'Type' },
          { name: 'Brass', hex: '#b08d57', note: 'Hardware, foil, accents' },
          { name: 'Henna', hex: '#9b4a2c', note: 'Tissue, seasonal' },
          { name: 'Stone', hex: '#cfc6b7', note: 'Secondary type on oxblood' },
        ] },
      ],
    },
    {
      id: 'icons-voice', title: 'Icons and voice',
      modules: [
        { kind: 'component', name: 'KoshaIcons' },
        { kind: 'spec', title: 'Voice: say this, not that', rows: [
          ['Cut from one hide.', 'not “Premium quality leather”'],
          ['Repaired for as long as you own it.', 'not “Lifetime guarantee*”'],
          ['Fourteen hours, one maker.', 'not “Artisanal craftsmanship”'],
          ['Made to be worn in.', 'not “Timeless elegance”'],
        ] },
      ],
    },
    {
      id: 'packaging', title: 'Packaging',
      modules: [{ kind: 'component', name: 'KoshaPackaging' }],
    },
    {
      id: 'app', title: 'App', final: true,
      intro: 'Shop, see each piece’s record, and book repairs. Image areas are left for the campaign photographs.',
      modules: [{ kind: 'component', name: 'KoshaApp' }],
    },
    {
      id: 'outdoor', title: 'Outdoor and social',
      modules: [
        { kind: 'component', name: 'KoshaBillboard' },
        { kind: 'component', name: 'KoshaSocial' },
      ],
    },
    {
      id: 'campaign', title: 'Campaign photography',
      intro: 'Product first, hard light. Planned shots.',
      modules: [
        { kind: 'shots', layout: 'three', items: [
          { n: 1, title: 'The Sheath Tote at the hip', direction: 'Tote held low at the hip, coat edge in frame, face out of shot.', light: 'Hard key from high left; black background', cast: 'Indian, gender-neutral', tone: 'dark' },
          { n: 2, title: 'Deboss', direction: 'The monogram debossed in oxblood calf, filling the frame.', light: 'Raking light at a low angle so the deboss reads', tone: 'accent' },
          { n: 3, title: 'Unboxing', direction: 'Hands lifting the lid; tissue and dust bag visible.', light: 'Overhead hard light, ivory surface', tone: 'light' },
        ] },
      ],
    },
    {
      id: 'next', title: 'Limitations and next steps',
      modules: [
        { kind: 'text', body: [
          'KOSHA is a fictional label made for this project; it is not a company and sells nothing. The packaging and screens are drawn mock-ups, not produced items.',
          'Next: test the monogram debossed in real calf at 12 mm and 20 mm, run a trademark search on the name, and sample the box with a packaging maker.',
        ] },
      ],
    },
  ],
}
