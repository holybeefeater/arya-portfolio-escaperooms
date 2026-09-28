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
npm test           # 9 checks: every asset path exists, bills of materials add up, maths helpers
```

Deploy `dist/` anywhere static: Vercel, Netlify, GitHub Pages. The build uses relative
paths, so it also works from a sub-folder. On Vercel: framework "Vite", output `dist`.

## Change the words, prices or images

**Everything written on the site is in `src/content.js`.** Edit it and save; the page
refreshes by itself while `npm run dev` is running.

- Specs, details, materials and captions: edit the text in place.
- Bills of materials: each row is `[item, quantity, cost]`. Totals are added up automatically.
- Images: put files in `public/assets/…` and refer to them as `'assets/…'` (no leading slash).
- Jacket markers: `jacket.hotspots` uses `x` and `y` from 0 to 1, measured from the image's top-left.
- LinkedIn: paste the URL into `person.linkedin` and it appears in the contact section.

### Please check two bills of materials

The line items on two sheets don't add up to the totals printed on them:

| Bag | Printed total | Line items add up to |
|---|---|---|
| Duffle | ₹969 | ₹989 |
| Drawstring | ₹870 | ₹810 |

The site shows the sum of the line items, so once the right figure is fixed in
`content.js` everything stays consistent. The T-base, Hobo and Boots sheets reconcile.
Also worth checking: the boot details page says "nitrile rubber soles" while the BOM lists a PU outsole.

## Add the real 3D models

The **Turn it over** section shows a photo relief of each piece until a real model exists.
To replace one:

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
| Turn it over | A turntable for the jacket, duffle and boot. Drag sideways, or use Turn, Close-up and Pause. It loads her own .glb files when they exist (see above); until then each piece is a clearly labelled photo relief. The boot is assembled from the six layers of her exploded drawing. |
| Other work | Internship at Hats Off Accessories, with a film of Print 1 building up over 18 trials. |
| Exit | The contact section is an emergency-exit sign. |

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
    chrome.jsx          ← intro, torch cursor, header, wayfinding tape
    Hero.jsx            ← the room, the hide picker, scroll into the door
    Statement.jsx       ← the brief, consumer, boards, palette
    RoomJacket.jsx  RoomBags.jsx  RoomBoots.jsx
    closing.jsx         ← other work, about, exit
    SheetViewer.jsx     ← Aditi's original portfolio pages
    parts.jsx           ← Plate, Film, Bom, Spec, Sign …
  lib/
    room.js             ← three.js scene for the room and its portal
    leather.js          ← procedural suede, nappa and pull-up surfaces
    stage.js            ← one WebGL canvas that draws every photograph
    shaders.js          ← relight and film-reveal shaders
    depth.js            ← relief maps from each cut-out's silhouette
public/assets/
  products/  pages/  communication/  profile/   ← from Aditi's portfolio
  layers/     ← the six boot layers, cut from her exploded drawing
  films/      ← process films assembled from her sheets
  posters/  shadows/
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
