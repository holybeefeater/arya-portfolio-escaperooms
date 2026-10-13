// Self-initiated concept. Not commissioned, not produced. Written as a full design
// proposal; every photograph is a planned shot until it is taken.
// Brands named in research are references for positioning only.
export default {
  slug: 'lingerie-campaign',
  title: 'Eyelet',
  subtitle: 'Lingerie Campaign · “Eyelet” is a proposed display title',
  type: 'concept',
  disciplines: ['garments', 'campaign'],
  featured: true,
  order: 9,
  theme: 'dark',
  premise: 'A gender-fluid lingerie and costume range in leather, mesh and chrome, where eyelets and rivets do the work lace usually does.',
  overview: [
    'An eyelet is a hole that has been finished: a gap made strong enough to pull against. Eyelet makes that small piece of hardware the subject of a luxury lingerie range. Rows of eyelets let skin show through patent leather, lacing closes and sizes every piece, and rivets hold straps where they cross.',
    'The range is ten pieces around one hero ensemble, a leather bralette worn as part of a full look, with masks, harnesses and party pieces. Most pieces adjust to fit any body and gender. The campaign is planned as a studio story under hard light and a short film.',
  ],
  facts: [
    ['Status', 'Self-initiated concept'],
    ['Range', '10 pieces: lingerie, harnesses, masks, party and costume'],
    ['Fit', 'Adjustable by lacing and sliders; gender-fluid'],
    ['Deliverables', 'Range, material board, campaign plan, film storyboard'],
  ],
  cover: { shot: { n: 1, title: 'Eyelet bralette over open black tailoring', tone: 'dark' } },
  hero: { shot: { n: 1, title: 'Hero look: the Eyelet bralette, harness bodice and laced brief, worn under open black tailoring', direction: 'Three-quarter length, model turned 30° from camera, jacket slipping off one shoulder. Chrome eyelets catch the key light as a line of points.', light: 'One hard key, camera left at 45°; thin rim from behind right; black void', cast: 'Indian model, androgynous styling, slicked-back hair', tone: 'dark' } },
  accent: { paper: '#16110f', ink: '#e8c9b5', color: '#8c1d22' },
  related: ['archive-reconstruction', 'brand-identity', 'luxury-bags'],
  seo: { description: 'Eyelet: a self-initiated concept for a gender-fluid luxury lingerie and costume range in leather, mesh and chrome hardware, with a hard-light campaign plan.' },

  sections: [
    {
      id: 'brief', title: 'Design brief',
      modules: [
        { kind: 'text', heading: 'Proposed brief', body: [
          'Design a luxury lingerie and costume capsule of ten pieces around one hero ensemble: a leather bralette with eyelets and rivets, worn as part of a complete look rather than on its own. Most pieces should fit any body and any gender. Deliver a campaign: one studio story and one short film.',
        ] },
        { kind: 'list', heading: 'Self-set constraints', cols: 2, items: [
          'Fit by lacing and sliders, not fixed cup sizes',
          'Every leather piece can be worn as outerwear, over shirting or tailoring',
          'Nickel-free hardware only',
          'Bold and sensual in the campaign, without nudity',
        ] },
      ],
    },
    {
      id: 'research', title: 'Market and trend research',
      intro: 'Where luxury lingerie, harness and runway meet, and the gap this range could fill.',
      modules: [
        { kind: 'groups', items: [
          { title: 'Lingerie houses', body: 'Agent Provocateur, Bordelle and Fleur du Mal treat lingerie as fashion: strap architecture, hardware, high price points.' },
          { title: 'Leather and harness', body: 'Zana Bayne made the leather harness an accessory worn over clothes rather than under them.' },
          { title: 'Runway', body: 'Mugler’s corsetry; Ludovic de Saint Sernin’s eyelet lacing and gender-fluid sensuality; Nensi Dojaka’s lingerie construction worn as eveningwear.' },
          { title: 'The gap', body: 'In Indian luxury retail, lingerie is mostly sold as innerwear, in fixed sizes and in gendered aisles. Hardware-led pieces that adjust, and that anyone can wear outside, are hard to find.' },
        ] },
        { kind: 'list', heading: 'Trend forecasting: signals', cols: 2, items: [
          'Lingerie worn as outerwear and eveningwear',
          'Hardware as ornament: eyelets, rivets, chain',
          'Corsetry and harnessing over tailoring',
          'Sensuality in menswear and gender-fluid dressing',
          'High-shine surfaces: patent and lacquered leather',
        ] },
        { kind: 'text', body: ['These are a designer’s reading of recent runways and luxury retail, not a sourced forecast.'] },
      ],
    },
    {
      id: 'brainstorm', title: 'Brainstorm',
      modules: [
        { kind: 'component', name: 'Mindmap', props: {
          center: 'Eyelet',
          branches: [
            { label: 'Hole as ornament', leaves: ['skin through leather', 'rows of light', 'lacing closes'] },
            { label: 'Hardware', leaves: ['rivets', 'D-rings', 'chain drop'] },
            { label: 'Body', leaves: ['strap maps', 'pressure points', 'adjustable fit'] },
            { label: 'Night', leaves: ['masquerade', 'club', 'stage'] },
            { label: 'Fluid', leaves: ['no cup sizes', 'over shirting', 'any body'] },
          ],
          rejected: ['lace trim', 'literal bondage gear', 'pink'],
        } },
      ],
    },
    {
      id: 'audience', title: 'Consumer persona and client board',
      modules: [
        { kind: 'groups', items: [
          { title: 'Who', items: ['24–35', 'Any gender', 'Metro India and the diaspora', 'Artists, performers, stylists, people who dress for the night'] },
          { title: 'How they dress', items: ['Tailoring with something exposed underneath', 'Vintage and one loud piece', 'Getting dressed as performance'] },
          { title: 'What they need', items: ['Fit that adjusts', 'Pieces that work outside the bedroom', 'Hardware that will not irritate skin'] },
          { title: 'Influences', items: ['Ballroom and drag culture', 'Club nights', 'Editorial photography', 'Theatre costume'] },
        ] },
        { kind: 'list', heading: 'Client board: labels whose customers this range speaks to', cols: 3, items: ['Agent Provocateur', 'Bordelle', 'Ludovic de Saint Sernin', 'Mugler', 'Zana Bayne', 'Nensi Dojaka'] },
        { kind: 'text', body: ['Named for positioning only. No association with these labels is implied.'] },
      ],
    },
    {
      id: 'concept', title: 'Concept and narrative',
      modules: [
        { kind: 'quote', text: 'Held together by something you can see.' },
        { kind: 'text', body: [
          'Eyelet takes the smallest fitting in leatherwork and makes it the point. Used literally, rows of eyelets open patent leather so skin shows through in points of light, and lacing replaces hooks and fixed sizes. Used as a feeling, the range is about being held together by something visible: straps that map the body, closures that are part of the look.',
          'The night is the setting: masquerade, the club, the stage. Pieces move between them, from a bralette under a blazer to a mask and a cape for a performance.',
        ] },
      ],
    },
    {
      id: 'moodboard', title: 'Inspiration and moodboard',
      intro: 'References to source and photograph. Placeholders show what each frame should contain.',
      modules: [
        { kind: 'images', cols: 3, items: [
          { placeholder: 'Corset lacing in close-up, hard side light', ratio: 4 / 5 },
          { placeholder: 'Chrome hardware catching a flash', ratio: 1 },
          { placeholder: 'Masquerade masks, Venetian and club', ratio: 4 / 5 },
          { placeholder: 'Ballroom: bodies mid-movement', ratio: 1 },
          { placeholder: 'Black patent surfaces and reflections', ratio: 4 / 5 },
          { placeholder: 'Theatre costume fittings: pins, tape, chalk', ratio: 1 },
        ] },
      ],
    },
    {
      id: 'colour', title: 'Colour board',
      modules: [
        { kind: 'palette', colors: [
          { name: 'Kohl', hex: '#0f0d0d', note: 'Patent calf, mesh' },
          { name: 'Lacquer', hex: '#7d1420', note: 'One hero colourway' },
          { name: 'Chrome', hex: '#c9ccd1', note: 'All hardware' },
          { name: 'Smoke', hex: '#3a3636', note: 'Sheer mesh' },
          { name: 'Dusk', hex: '#7a4e3b', note: 'Skin-tone mesh, deep' },
          { name: 'Clay', hex: '#a8775d', note: 'Skin-tone mesh, mid' },
          { name: 'Sand', hex: '#d0a688', note: 'Skin-tone mesh, light' },
        ] },
        { kind: 'text', body: ['Sheer mesh comes in three skin tones rather than one “nude”.'] },
      ],
    },
    {
      id: 'materials', title: 'Material board',
      modules: [
        { kind: 'materials', items: [
          { name: 'Patent calf, 0.9–1.1 mm', use: 'Cups, masks, belt, cape', note: 'Holds an eyelet without tearing' },
          { name: 'Lambskin nappa, 0.6–0.8 mm', use: 'Straps, harness, gloves' },
          { name: 'Power mesh and silk organza', use: 'Bodysuit, sheer panels' },
          { name: 'Nickel-free chrome eyelets, 5 and 8 mm', use: 'All lacing points' },
          { name: 'Double-cap rivets', use: 'Strap crossings' },
          { name: 'Satin elastic and metal sliders', use: 'Adjustment' },
          { name: 'Spiral steel boning', use: 'Corset belt' },
          { name: 'Silicone grip tape', use: 'Holds straps on skin' },
        ] },
      ],
    },
    {
      id: 'development', title: 'Design development',
      modules: [
        { kind: 'steps', items: [
          { title: 'Strap mapping', body: 'Tape lines drawn on a body form and on fit models of different builds, to find where straps can cross and where they must not.' },
          { title: 'Eyelet pitch', body: 'Test rows at 12, 16 and 20 mm spacing on patent calf: how much skin shows, and when the leather starts to tear.' },
          { title: 'Cups without sizes', body: 'A triangle cup cut flat, edges turned and stitched, closed by lacing so one pattern fits a range of bodies.' },
          { title: 'Wearing it out', body: 'Every piece tried over a shirt and under a blazer before it is approved.' },
        ] },
        { kind: 'images', cols: 3, items: [
          { placeholder: 'Sketch page: bralette and harness', ratio: 3 / 4 },
          { placeholder: 'Eyelet pitch test swatches', ratio: 3 / 4 },
          { placeholder: 'Toile on a fit model', ratio: 3 / 4 },
        ] },
      ],
    },
    {
      id: 'range', title: 'Range development',
      intro: 'Ten pieces. Most are sized by lacing and fit any gender.',
      modules: [
        { kind: 'range', prefix: 'Piece', items: [
          { name: 'Eyelet bralette', desc: 'The hero. Triangle cups in patent calf bordered with 5 mm eyelets, laced at centre front, rivet-set adjustable straps.', material: 'Patent calf · chrome' },
          { name: 'Harness bodice', desc: 'A lambskin strap cage worn over a sheer bodysuit; a rivet at every crossing.', material: 'Lambskin · mesh' },
          { name: 'Laced high brief', desc: 'High-waisted, with eyelet-laced side panels that set the fit.', material: 'Patent calf · mesh' },
          { name: 'Corset belt', desc: 'A wide patent belt with spiral boning and front lacing, worn over shirting or skin.', material: 'Patent calf · steel' },
          { name: 'Masquerade mask', desc: 'Half-mask in patent calf with eyelet trim and a ribbon tie.', material: 'Patent calf' },
          { name: 'Chain-drop collar', desc: 'Leather collar with eyelets; a chain drops to the sternum.', material: 'Lambskin · chrome' },
          { name: 'Grommet slip', desc: 'Party piece: a bias silk slip with a patent yoke and a grommet-panel back.', material: 'Silk · patent calf' },
          { name: 'Laced opera gloves', desc: 'Lambskin gloves laced up the outer arm.', material: 'Lambskin' },
          { name: 'Leg harness', desc: 'Garter straps for thigh and calf, worn over sheer tights or trousers.', material: 'Lambskin · elastic' },
          { name: 'Stage cape', desc: 'Costume: a short structured cape in patent calf, laced at the shoulders.', material: 'Patent calf' },
        ] },
      ],
    },
    {
      id: 'campaign', title: 'Campaign and shoot', final: true,
      intro: 'A studio story under hard light, and a 30-second film. Every frame below is a planned shot.',
      modules: [
        { kind: 'shots', layout: 'feature', items: [
          { n: 1, title: 'Hero look under open tailoring', direction: 'Bralette, harness bodice and laced brief under an unbuttoned black suit. Three-quarter length, turned 30° from camera, jacket slipping off one shoulder.', light: 'Hard key camera left at 45°, rim from behind right, black void', cast: 'Indian, androgynous styling', tone: 'dark', ratio: 16 / 9 },
          { n: 2, title: 'Eyelet macro', direction: 'The edge of a patent cup: a row of eyelets, skin visible through each one. Shallow focus on the third eyelet.', light: 'Bare-bulb flash close to the lens; chrome as hot points', tone: 'dark' },
          { n: 3, title: 'Masquerade portrait', direction: 'Half mask and chain-drop collar. Tight crop from brow to collarbone; chain sharp, face soft.', light: 'Hard top light, eyes in shadow under the mask', cast: 'Indian, gender-neutral', tone: 'dark' },
          { n: 4, title: 'Movement', direction: 'Voguing in the grommet slip and leg harness. The body sharp, the slip blurred behind it.', light: 'Rear-curtain flash with a slow shutter, coloured gel on the background only', cast: 'Ballroom performer', tone: 'accent' },
          { n: 5, title: 'Lacing', direction: 'Hands pulling the corset belt closed on the body. Crop at ribs and wrists.', light: 'Single hard source from directly above', tone: 'dark' },
          { n: 6, title: 'The line-up', direction: 'Three models of different builds and genders in a row against a seamless, each in pieces from the range.', light: 'Flat, hard frontal flash; white seamless', cast: 'Three Indian models, varied bodies', tone: 'light' },
          { n: 7, title: 'Stage cape', direction: 'From a low angle, the cape opening as the model turns.', light: 'One follow-spot through haze; everything else black', tone: 'dark' },
          { n: 8, title: 'Hardware still life', direction: 'Every eyelet, rivet, slider and chain from the range on black glass, in rows.', light: 'Strip light reflected in the glass', tone: 'dark' },
        ] },
        { kind: 'steps', items: [
          { title: 'Film, 0–8 s', body: 'Black. The sound of cord pulled through eyelets. Light comes up on hands lacing.' },
          { title: '8–18 s', body: 'Cuts between the mask going on, the cape opening, the collar chain swinging.' },
          { title: '18–26 s', body: 'The line-up, flash-lit, one frame per beat.' },
          { title: '26–30 s', body: 'End card: EYELET, and the line “Held together by something you can see.”' },
        ] },
        { kind: 'list', heading: 'Casting and styling', cols: 2, items: [
          'Indian models across genders and body types; no single “lingerie body”',
          'Styling over tailoring and shirting as often as on skin',
          'Hair and make-up kept graphic: slicked hair, bare skin, one lacquer lip',
          'Sensual through hardware, cut and pose; no nudity',
        ] },
      ],
    },
    {
      id: 'next', title: 'Limitations and next steps',
      modules: [
        { kind: 'text', body: [
          'This is a self-initiated concept. No pieces have been made and none of the photographs exist yet; the frames above are the plan for them.',
          'Next: toile the bralette and harness in lambskin, test eyelet pitch on patent calf, run fit sessions across different bodies before calling the range gender-fluid, then cast and shoot the hero look.',
        ] },
      ],
    },
  ],
}
