# Aditi Arya · Escape Rooms and Auxin

Leather design portfolio for Aditi Arya, B.Des. Leather Design, NIFT Raebareli.
React 18 · three.js r176 · GSAP 3.13 (ScrollTrigger) · Tailwind CSS 3 · Vite 6.

Each collection is its own site with its own idea, joined by a switch in the header:

| Address | Collection | Built around |
| --- | --- | --- |
| `/` | **Escape Rooms** (A/W 2026) | rooms you escape from: her wayfinding phrases are the signage, her Pantone card the palette |
| `/auxin/` | **Auxin** (A/W 27/28) | growth that bends toward light: the visitor is the light, and the page grows toward it |

Both share the header (name, the collection switch, about, contact, résumé), the about and
contact details, and the résumé. More collections can be added without redesigning either
(see *Add another collection* below).

## Run it

Needs Node.js 18.18 or newer (20 or 22 recommended).

```bash
npm install        # or: npm ci  (uses the included lockfile, same versions every time)
npm run dev        # opens http://localhost:5173 (Escape Rooms); Auxin is http://localhost:5173/auxin/
```

```bash
npm run build      # production build in dist/
npm run preview    # serve that build locally
npm test           # every asset path exists, costings add up, the nesting study fits, every collection has a page
```

Deploy `dist/` anywhere static: Vercel, Netlify, GitHub Pages. The build uses relative
paths, so it also works from a sub-folder. On Vercel: framework "Vite", output `dist`.

**Set `SITE_URL` when you build for the live site**, e.g. `SITE_URL=https://aditiarya.com/ npm run build`
(on Vercel or Netlify, add it as an environment variable). It makes the share card
(`public/og-card.jpg`, shown when the link is posted on WhatsApp, LinkedIn or X) use absolute
addresses, which those apps need. `person.site` in `content.js` (already set to the Vercel address) is used when SITE_URL is not, and by the
QR codes in the print kit.

## The collection switch

`src/shared/projects.js` lists the collections in toggle order. Clicking the other one closes
a cover in its colours over the page (Auxin's rises from the ground with a wave; Escape Rooms'
drops like a garage door), the browser goes to that page, and the new page opens the same
cover. The switch is a pair of real links, so it also works in a new tab and without scripts.
Arriving at Escape Rooms through the switch skips its shutter intro. Under *reduced motion*
the switch simply navigates.

### Add another collection

1. Add it to `src/shared/projects.js` (`path` is its folder, e.g. `'dark-ages/'`).
2. Copy `auxin/index.html` to `<folder>/index.html`; change the title, share tags and the id
   and colour in the small script at the top. Add the page to `input` in `vite.config.js`, to
   `folders` in the same file, and a redirect in `vercel.json`.
3. Build the page in `src/<name>/` (Auxin's folder is a working template) and use
   `<Toggle current="<id>" />` in its header.

The switch becomes three-way by itself. `npm test` checks that every collection in the list
has a page, a build entry and its arrival script.

## Auxin

The deck's idea is phototropism: auxin is the plant hormone that bends a stem toward light.
Here **the visitor is the light**. The pointer (a finger on a phone, or the phone's tilt) is
one light that everything leans toward:

- **The hero**: a stand of strips in three.js, cut from crops of her own shoot photographs (the
  aqua oil pull-up leather of the jacket, the striped curtain fabric and the teal pleat of the
  trousers). Each strip bends along an arc until its tip points at the light. Leather strips
  have pinked edges and a stitched centre seam ("seams as veins", from her brainstorm); brass
  rings sit at their roots ("hardware as nodes"). Click and they reach; pick a material and
  the others step back. Scrolling lifts the camera up the stems.
- **The stem down the left edge** grows as you read, leans to the light, and has a brass node
  per chapter (click one to go there).
- **Photographs and drawings** turn to face the light; cut-outs cast a shadow away from it.
- **The shoot photographs** are treated by the page, never in the files: a room's first
  photograph stretches upward out of its frame as it arrives and settles into the true picture
  by the middle of the screen; some Bloom photographs wait in her palette (Surf the Web, Teal,
  Green Eyes) until the light develops them into colour; one is a close crop of the leather.
  Every one opens full size and untouched when clicked. Under *reduced motion* they are simply
  the photographs.

The page follows growth stages: **Seed** (the idea: her brainstorm redrawn as a stem that grows
as you scroll), **Roots** (research and persona), **Stem** (colour and material),
**Leaves** (the three pieces, each with its own room. A room opens on its lifestyle
photographs, then the drawings: the jacket from flat to design to photograph, the calf boot you
can turn beside the boot as made, the cowboy boot whose drawing fills with its leather under your
light and its 66 rivets. Its plain-background photographs sit beside the specification: point at
a row and its place on the photograph lights up), **Bloom** (the shoot, from fog to full sun),
then About and Contact.
Her own note on the brainstorm, "keep it abstract, not botanical", is followed: no leaf icons.

### Change Auxin's words, numbers or images

- **Words and numbers**: `src/auxin/content.js`. Facts come only from the Auxin deck. Where the
  deck is silent the value is `gap('…')`, which shows on the page as a dashed **To add** note.
  Costing totals are added up from the lines; `npm test` checks them against her printed
  totals (jacket ₹2,460, trousers ₹1,090, cowboy boots ₹1,362).
- **Images**: originals live in `media/auxin/`; shoot photographs in `media/auxin/shoot/`,
  where the file name is the name used in `content.js`. After adding or replacing one, run
  `npm run media:auxin` (needs Python 3 with Pillow) to write the two web sizes to
  `public/assets/auxin/img/` and update `src/auxin/media.json`. The script also cuts the
  technical flats out of her specification pages and makes their sage background clear.
- **Where the shoot photographs go**: each piece in `content.js` has `open` (the lifestyle
  photographs that open its room, with `side`: the lead photograph sits on the side that sends
  the eye into the text), `pause` (one photograph between the drawings and the specification),
  `proof` (the plain-background photographs beside the specification) and `links` (a
  specification row, by its label, to a point on one of them). Bloom is `bloom`, near the end.
  `npm test` checks that every link names a real row and photograph.
- **Video**: every moving photograph has a `video: ''` slot. Put an `.mp4` in
  `public/assets/auxin/video/` and write its path there. Until then it plays a *moving still*:
  a slow camera move over the same photograph (`public/assets/auxin/loops/`, made with ffmpeg
  from her photographs, nothing generated). It is labelled as such and can be paused. To make
  one for another photograph (720 × 900, five seconds in and five back):
  `ffmpeg -i media/auxin/shoot/NAME.webp -filter_complex "[0]scale=2880:-2,zoompan=z='1+0.07*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=720x900:fps=30,format=yuv420p,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -c:v libx264 -crf 24 -movflags +faststart -an public/assets/auxin/loops/NAME.mp4`
- **Strip materials**: `public/assets/auxin/tex/` (crops of her photographs with the lighting
  flattened, plus a relief map computed from each). `cowboy-leather.jpg` is a crop of
  `cowboy-outer-white`; the cowboy boot's drawing fills with it.

### Things only Aditi can add (Auxin)

- Her role on Auxin, the year and module, and a short reflection (marked **To add** under Bloom).
- Her shoot video, if there is one, for the moving stills.
- Full-size files for two photographs that arrived small: `jacket-upside-down` (720 × 540)
  and `jacket-stem-shadow` (576 × 720). Replace them in `media/auxin/shoot/` and run the script.
- Rows her specification sheets do not have, for details the photographs show: the jacket's
  flap pockets; the calf boots' teal textured panels and toe caps and striped collar (her sheet
  calls the contrast panels "reinforced curtain fabric, muted green"); the cowboy boots' pleated
  teal panel. Her deck calls the cowboy boots "the same finish as the jacket"; in the photographs
  the jacket reads cobalt and the boots grey-aqua.

Two notes from the deck: the jacket's specification lists "Comfort features: cushioned insole,
moisture-wicking lining", which looks copied from a boot sheet, so it is left out; the calf
boot sheet gives cost ranges per component but no total, so the page shows the sum of her
ranges (₹3,050–5,400) and says so.

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
index.html              ← Escape Rooms page
auxin/index.html        ← Auxin page
src/
  shared/               ← the collection switch: projects.js (the list), Toggle.jsx, swap.js, shared.css
  auxin/
    content.js          ← all Auxin copy, specs, costings and image names
    media.json          ← image sizes (written by scripts/auxin-media.py)
    App.jsx  main.jsx  styles.css
    components/
      Hero.jsx          ← the stand of strips, intro, materials
      chrome.jsx        ← header, the stem down the left edge, chapter titles
      Seed.jsx  Roots.jsx  StemChapter.jsx  Leaves.jsx  Rooms.jsx  Bloom.jsx  Closing.jsx
      media.jsx         ← pictures, Lean (faces the light), moving stills, boards, tables
    lib/
      garden.js         ← three.js: the strips, ground, spores and light
      light.js          ← the one light everything leans toward
      asset.js
  content.js            ← all Escape Rooms copy, specs, prices and asset paths; also the
                          shared person, about and downloads
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
public/og-card.jpg ← Escape Rooms share card, 1200 × 630
public/og-auxin.jpg ← Auxin share card
public/assets/auxin/ ← img/ (web images), tex/ (strip materials), loops/ (moving stills)
media/auxin/      ← Auxin originals (from the deck and the shoot)
scripts/auxin-media.py ← prepares the Auxin images
public/downloads/ ← résumé, full portfolio, project PDFs, internship deck
tests/          ← node --test
```

## How this was checked

Built and run with the real dependencies (three.js, GSAP, React) and driven in headless
Chromium with software WebGL:

- `npm run build` and `npm test` pass.
- Both collections at 1440 px and 390 px: no page errors, no sideways scroll; every Auxin
  chapter, the pinned scenes part-way through, and the hero with the light in two places.
- The switch both ways (Escape Rooms → Auxin → Escape Rooms), including the covers and the
  skipped intro on return; `/auxin` redirects to `/auxin/` in dev, preview and on Vercel.
- Reduced motion: no autoplay, no pinning, every part of every scene shown.
- `npm run dev` serves both pages.

A real GPU will look smoother than these checks: software WebGL runs the hero at a few frames
a second, which is why growth is timed by the clock rather than by frames.

## Credits

Product work, photographs, drawings and documents © Aditi Arya.
Films, boot layers and shadows are made directly from her portfolio pages.
Auxin's strips, swatches and moving stills are made directly from her shoot photographs.
Type: Archivo (Omnibus-Type) and Instrument Serif (Rodrigo Fuenzalida, Jordan Egstad), both
SIL Open Font License. Escape Rooms loads them from Google Fonts; Auxin bundles them
(`@fontsource`), so it also works offline.
