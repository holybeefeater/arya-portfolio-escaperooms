# Escape Rooms · Aditi Arya

Leather design portfolio for Aditi Arya, B.Des. Leather Design, NIFT Raebareli.
React 18 · three.js r176 · GSAP 3.13 (ScrollTrigger) · Tailwind CSS 3 · Vite 6.

The site is built around her collection's own idea: rooms you escape from.
The phrases on her inspiration board ("sealed entrance", "follow the line", "it loops",
"entry != exit") are the signage, and the palette comes from her Pantone card.

## Run it

Needs Node.js 18.18 or newer (20 or 22 recommended).

```bash
npm install        # or: npm ci  (uses the included lockfile, same versions every time)
npm run dev        # opens http://localhost:5173
```

```bash
npm run build      # production build in dist/
npm run preview    # serve that build locally
npm test           # every asset path exists, bills of materials add up, the nesting study fits, maths helpers
```

Deploy `dist/` anywhere static: Vercel, Netlify, GitHub Pages. The build uses relative
paths, so it also works from a sub-folder. On Vercel: framework "Vite", output `dist`.

**Set `SITE_URL` when you build for the live site**, e.g. `SITE_URL=https://aditiarya.com/ npm run build`
(on Vercel or Netlify, add it as an environment variable). It makes the share card
(`public/og-card.jpg`, shown when the link is posted on WhatsApp, LinkedIn or X) use absolute
addresses, which those apps need. Put the same address in `person.site` in `content.js` so the
QR codes in the print kit point to it.

## Change the words, prices or images

**Everything written on the site is in `src/content.js`.** Edit it and save; the page
refreshes by itself while `npm run dev` is running.

- Specs, details, materials and captions: edit the text in place.
- Bills of materials: each row is `[item, quantity, cost]`. Totals are added up automatically.
- Images: put files in `public/assets/…` and refer to them as `'assets/…'` (no leading slash).
- Jacket markers: `jacket.hotspots` uses `x` and `y` from 0 to 1, measured from the image's top-left.
- LinkedIn: `person.linkedin` (taken from her résumé) appears in the Exit, the hint and the keycard.

### Please check two bills of materials

Her own sheets disagree with themselves. On page 23 the Duffle's printed lines add up to ₹989
but the sheet's total says ₹969; on page 32 the Drawstring's lines add up to ₹810 but the
total says ₹870. The site shows the sum of the lines (and the costing table uses it), so fix
whichever line is wrong in `content.js` and everything follows. The PDFs in `public/downloads/`
still carry the old totals until they are re-exported. The T-base, Hobo and Boots sheets reconcile.
Also on the PDFs only: page 43 of the portfolio says "nitrile rubber soles" while the boot's bill
of materials lists a PU outsole. The site says PU.

### Things only Aditi can add

Each of these is already built into the site and stays hidden (or uses a neutral default)
until it is filled in, in `src/content.js`:

| What | Where | What happens |
|---|---|---|
| Retail prices | `retail` on each bag and on `boots` | The costing table shows her price and her markup instead of the indicative one |
| A line from a mentor | `about.testimonial` | A quote appears in About |
| IFCOMA Shoetech photographs | `about.exhibition` | A small gallery appears under About |
| Clips of making (skiving, edge painting, stitching, riveting) | `making` | A strip of short films appears in the brief, "At the bench" |
| Pictures for the side projects | `thumb` on each `otherWork` item | That door opens onto the picture |
| Tannage and source of each hide | `tannage`, `source` in `hides[].passport` | Extra rows on the material passport |
| Real 3D models | `models.items[].src` | The "Turn it over" section comes back (it hides while there are none; `models.showReliefs: true` shows the photo reliefs meanwhile) |
| The live address | `person.site` | Used by the QR codes in the print kit |

## Print kit

`/print.html` (not linked from the site) is a keycard business card, 85.6 × 54 mm front and back,
and a hang tag for each room, 50 × 100 mm, each with a QR code that opens the site at the right
place. Open it from the live site, press Print, and print at 100% on 300–350 gsm card (or Save as
PDF for a print shop). The maker's mark is also in `public/brand/` as SVG: `makers-mark.svg` (the
stamp) and `makers-mark-deboss.svg` (letters only, for a deboss or hot-stamp die).

## Add the real 3D models

The **Turn it over** section stays hidden until a real model exists (or until
`models.showReliefs` is set to `true`, which shows a labelled photo relief of each piece).
To add one:

1. Export a `.glb` file. From **CLO 3D**, use File → Export → glTF, and choose binary .glb.
   From **Rhino**, use File → Export Selected → .glb. From a phone scan (**Polycam**, **Scaniverse**
   or **Luma**, all free), export GLB.
2. Put it in `public/assets/models/`, for example `public/assets/models/jacket.glb`.
3. In `src/content.js`, under `models.items`, set that piece's `src: 'assets/models/jacket.glb'`.

The viewer centres the model, sizes it, stands it on the floor and lights it. The label changes
from "Photo relief" to "3D model" by itself. Keep each file under about 20 MB. If it's larger,
drop it on https://gltf.report and export it compressed; Draco and Meshopt compression are both
supported. For phone scans, shoot the bag or boot on a plain surface, in soft daylight, walking a
full circle around it.

## What's on the page

| Section | What happens |
|---|---|
| Scroll guide | Scrolling is the browser's own (nothing intercepts the wheel or trackpad). Three sections hold the page briefly: the room (about one screen of scrolling), the bags, and the boots (about one screen). While they do, a bar at the bottom says what's happening, shows progress, and has a **Skip** button that jumps instantly to where normal scrolling resumes. |
| Intro | A fluorescent tube stutters on (under three flashes a second), then the screen splits along its line. |
| The room | A cube sewn from six leather panels, with saddle stitching, rivets and luggage straps. Its door opens onto a corridor far deeper than the cube (a stencil portal). Change the hide between olive suede, cherry nappa and oil pull-up, and it casts the shadow of what that hide became: a bag, a figure, a boot. Drag to turn it; scroll to walk through the door. |
| Every photograph | Drawn in WebGL as a relief. The cursor is a torch: it rakes light across the suede, catches the brass and throws a real shadow. On phones the light moves by itself. |
| Films | Rest on the finished object. Hover (or tap) opens a window into a process film built from Aditi's own sheets: trends, sketches, spec sheet, finished piece. |
| Jacket | Markers on the photo point the torch at each detail. |
| Bags | The four bags are parked in numbered bays; scrolling drives along the row. Each has its bill of materials. |
| Boots | Scroll takes the boot apart into the six layers of her exploded drawing (page 42). |
| Turn it over | A turntable for the jacket, duffle and boot. Drag sideways, or use Turn, Close-up and Pause. It loads her own .glb files when they exist (see above). Hidden, with its menu link, until at least one .glb is added, so the site never shows unfinished work; set `models.showReliefs: true` to show the labelled photo reliefs instead. |
| Other work | Internship at Hats Off Accessories, with a film of Print 1 building up over 18 trials. |
| Hint | "Need a hint?" in the header opens the whole portfolio on one screen: three projects, strengths, software, résumé, email, LinkedIn. |
| Keys | One brass key for finishing each room: the stitch line reaching the jacket's cuff, the end of the bag row, the boot fully apart. They collect on a key ring in the header. Nothing is locked behind them. |
| Sound | Off until switched on (speaker in the header). Synthesised in the browser, no files: a fluorescent hum, a buckle click when the hide changes, a zip pull as the bag bays pass, a chime for a key. |
| Room headers | Each project announces itself differently: the jacket's title is cut from a chalk pattern line and saddle-stitched as you arrive; the bags' is painted on a parking-bay floor; the boots' splits into upper, midsole and outsole. Section titles open on Archivo's width axis as they scroll in. |
| Brief | Adds a material passport for each hide, using only facts from her sheets. |
| Jacket | A saddle-stitch line sews itself from marker to marker as you scroll. |
| Bags | The one room lit at full strength (olive 7763 C). Adds the duffle's five carry modes as pictograms, a day with the bags drawn from the consumer brief, and a nesting study: the duffle's 13 pieces, from its finished size plus 1 cm seam allowance, laid on a hide, 61.5 dm² against the 70 dm² on her bill of materials (88% yield). |
| Boots | Adds a costing table for all five pieces: material cost from each bill of materials, and an indicative retail price at 3×, 4× or 5×. |
| Other work | The side projects are a corridor of numbered doors; each opens onto the project. |
| About | Her portrait at full resolution (from her résumé), and her own line, "Craftsmanship is coordination made visible." |
| Exit | The contact section is an emergency-exit sign, with how many keys you found and how long you took, a floor plan with your route in floor tape, and the downloads as clue cards. |

Reduced-motion settings are respected: no flicker, no pinning, no drifting light.
If WebGL is unavailable, every photograph falls back to a normal image and every film to a
normal video player; the page still works end to end.

## Files

```
src/
  content.js            ← all copy, specs, prices and asset paths
  App.jsx               ← page order, smooth scroll, per-room light and wayfinding
  styles.css            ← Tailwind + the design system
  components/
    chrome.jsx          ← intro, torch cursor, header (hint, key ring, sound), wayfinding tape
    Hint.jsx            ← the portfolio in 60 seconds
    Mark.jsx            ← the maker's mark
    craft.jsx           ← stitch line, carry modes, day, nesting, passport, costing, making
    Hero.jsx            ← the room, the hide picker, scroll into the door
    Statement.jsx       ← the brief, consumer, boards, palette
    RoomJacket.jsx  RoomBags.jsx  RoomBoots.jsx
    closing.jsx         ← other work, about, exit
    SheetViewer.jsx     ← Aditi's original portfolio pages
    parts.jsx           ← Plate, Film, Bom, Spec, Sign, the three room headers …
  lib/
    room.js             ← three.js scene for the room and its portal
    leather.js          ← procedural suede, nappa and pull-up surfaces
    stage.js            ← one WebGL canvas that draws every photograph
    shaders.js          ← relight and film-reveal shaders
    depth.js            ← relief maps from each cut-out's silhouette
    progress.js         ← keys, route and clock for the visit
    sound.js            ← the optional synthesised sound
    stretch.js          ← width-axis and reveal scroll hooks
  print.jsx  print.css  ← the print kit (print.html)
public/assets/
  products/  pages/  communication/  profile/   ← from Aditi's portfolio and résumé
  layers/     ← the six boot layers, cut from her exploded drawing
  films/      ← process films assembled from her sheets
  posters/  shadows/
public/brand/     ← maker's mark SVGs
public/og-card.jpg ← share card, 1200 × 630
public/downloads/ ← résumé, full portfolio, project PDFs, internship deck
tests/          ← node --test
```

## How this was checked

Built in a sandbox without access to the npm registry, so three.js and GSAP could not be
installed there. What was verified:

- The whole app bundles with no syntax or import errors (esbuild).
- Both shaders compile and link against three.js's exact ShaderMaterial prelude in headless
  Chromium, and render correctly on real product photographs (relight, cast shadow, film reveal).
- Every three.js API used is a real r176 export.
- Desktop (1440 px) and phone (390 px) layouts, rendered with real React and the no-WebGL
  fallback path: no page errors, no sideways scroll.
- `npm test` passes.

Not verifiable in the sandbox: the live three.js room and GSAP scrolling. Your first
`npm run dev` is their first real run. If anything misbehaves, the browser console names the
part (`[room]`, `[stage]`, `[scroll]`) and the rest of the page keeps working.

## Credits

Product work, photographs, drawings and documents © Aditi Arya.
Films, boot layers and shadows are made directly from her portfolio pages.
Typeface: Archivo (SIL Open Font License), served by Google Fonts.
