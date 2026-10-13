# Aditi Arya · Portfolio

Portfolio for Aditi Arya: leather goods, footwear, garments, materials and brand identity.
React 18, react-router 6, three.js r176, Vite 6. Static output, deployed on Vercel.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # images → vite build → prerendered pages, in dist/
npm run preview    # serve dist/ locally
npm test           # content checks: slugs, types, images on disk, links between projects
```

`npm run build` runs three steps: `scripts/images.mjs` makes responsive WebP files, Vite
builds the app, and `scripts/prerender.mjs` writes one HTML file per page. Each file has
its own title, description, share image and canonical URL, so a link to `/work/auxin`
previews correctly on WhatsApp, LinkedIn or X.

---

## How the site is organised

It is built for three kinds of visit:

| Visit | What it uses |
| --- | --- |
| **30 seconds** | Home: name, one-line introduction, résumé, contact, then the two collections as large images, then a selection of the rest. Every project also has one line in the index. |
| **1–2 minutes on a project** | Each project opens with a title, a one-sentence premise, a lead image, a short overview and a facts table (role, year, materials), and a **See the final work** button that jumps to the finished pieces. |
| **Deep review** | Below that, numbered sections with a contents rail: research, development, range, materials, specs and costing, then the final work. Boards open full size in a lightbox. |

### Routes

| URL | Page |
| --- | --- |
| `/` | Home: introduction, 3D swatch, collections, selection, index, about teaser, contact |
| `/work` | All projects. Filters are kept in the address: `?type=concept&discipline=bags&view=list` |
| `/work/<slug>` | One project. From inside the site it opens as an overlay over a darkened page, with Escape, a close button and **Open as page**. Loaded directly or shared, it is a full standalone page. |
| `/about` | Biography, education, experience, recognition, skills, résumé download |
| `/escape-rooms/experience/` | The interactive Escape Rooms site (the previous site, moved here intact; see `docs/escape-rooms-experience.md`) |
| `/escape-rooms/print.html` | Its printable kit |

Contact (email, LinkedIn, Instagram) is the footer of every page, reached by **Contact** in the header.

### Kinds of work

Every project has one **type**, set in its file:

- `collection` (major collections: lead the home page)
- `exploration`
- `research`
- `concept`: self-initiated. These show the badge **Self-initiated · not commissioned or produced** on the card, in the index and at the top of the project. They are labelled this way so they are never read as client work or a commercial launch.

**Disciplines** (`bags`, `footwear`, `garments`, `materials`, `branding`, `campaign`) are the second filter. Both lists live in `src/content/taxonomy.js`; add a new entry there to add a new filter.

---

## Updating content

All content is in `src/content/`. Layout code lives in `src/components/` and `src/pages/`, and
normally does not need to change.

```
src/content/
  site.js          name, introduction, contact, résumé, about page, fonts
  taxonomy.js      types and disciplines
  projects/        one file per project  ← most edits happen here
media/<project>/   original images (jpg, png, webp)
public/downloads/  PDFs offered for download
```

### Add a project

1. Copy a project file in `src/content/projects/` that is close to what you need (for example `rexine-jacket.js` for an exploration) and rename it, e.g. `belt-study.js`.
2. Change `slug` (it becomes the URL `/work/belt-study`), `title`, `type`, `disciplines`, `order` and `premise`.
3. Put the images in `media/belt-study/`, then run `npm run images`. Refer to an image by `'belt-study/<file name without extension>'`.
4. Run `npm run dev` and check it. `npm test` will report a missing image or a duplicate slug.

The home page, the work index, the filters, the counts and the prerendered page update themselves.

### Reorder, hide, feature

In the project's file:

- `order: 3`: position everywhere (smaller numbers first). The numbers shown on the site (01, 02 …) follow this order.
- `hidden: true`: removes the project from the site entirely. The file stays, so it can be brought back later.
- `featured: true`: shows a collection as a large feature on the home page, or puts another project in the home selection. Projects that are not featured still appear in the index and on `/work`.

### Sections and modules

A project is a list of `sections`, and each section is a list of `modules`. Sections can
be reordered, removed or added freely. Set `final: true` on the section the **See the final
work** button should jump to. When a project has four or more sections, a contents rail
appears automatically.

| Module `kind` | Use |
| --- | --- |
| `text` | Heading and paragraphs |
| `image` | One image; `size`: `full`, `wide`, `inset`, `left`, `right`, `bleed` |
| `images` | A row of images; `cols`, `stagger` |
| `board` / `boards` | Presentation boards, opened full size in the lightbox |
| `facts`, `list`, `groups` | Short structured information |
| `palette` | Colour swatches with names and hex values |
| `materials` | Material board: name, source, use, image |
| `spec` | Spec sheet rows, optional costing table with total |
| `range` | Numbered range line-up |
| `annotated` | Image with numbered notes |
| `shots` | Shoot direction: planned shots with framing, light and cast |
| `steps`, `quote`, `details` (accordion), `video`, `link`, `files` (downloads) | |
| `placeholder` | A marked gap for material still to come |
| `component` | A drawn piece registered in `src/components/mockups.jsx` (used by KOSHA) |

### Marking what is missing

Write `todo('What goes here')` in place of any text you do not have yet. It shows on the
site in red mono as **To add: …**, so a gap is never mistaken for finished copy. Search the
project for `todo(` to find every gap. `{ kind: 'placeholder', label: '…' }` does the
same for images.

Planned photographs for the self-initiated concepts are `shots`: dark, light or accent frames
labelled **Planned shot · photograph to come**, with the framing and light written out. When
a photograph exists, add `image: 'project/file'` to that shot and it replaces the frame.

---

## Content still needed

Everything below shows on the site as a marked gap.

**Site (`site.js`):** city, and what Aditi is looking for now (internships, roles, dates).

**Auxin:** role, year and course, a short reflection, and photographs of the finished calf boots (the deck shows design drawings and range only).

**Escape Rooms:** role, year and course, a reflection, and two totals to confirm. The Duffle sheet prints ₹969 and the Drawstring sheet ₹870, but their line items add up to ₹989 and ₹810.

**Dark Ages Collection, Rexine Jacket, Swatches, Footwear Concept Collection, CRD, Tannery:**
no material was supplied, so each page is a structure of marked gaps (premise, overview, facts,
process, final images) laid out for its kind of work. Nothing has been written about what these
projects contain. The CRD subtitle quotes the résumé entry "Craft Research Documentation (CRD):
Aipan Art". The Tannery page names Mirza International, Unnao, which is also on the résumé. Both should be confirmed.

**The four self-initiated concepts** (Eyelet / Lingerie Campaign, Sediment / Luxury Bags,
Unmade / Archive Reconstruction, KOSHA / Brand Identity) are fully written as proposals:
research, persona, brief, narrative, colour, materials, range, development and shoot direction.
They need:

- Aditi's own sketches, boards and photographs, wherever she has them.
- A review of every line, which was drafted for her to edit.
- Confirmation of the proposed display titles. Each original name is kept in the subtitle, e.g. "Lingerie Campaign · 'Eyelet' is a proposed display title".

Trend and market statements on those pages are labelled as a designer's reading, not sourced forecasts.

## Points to check

- **Twelve projects, not thirteen.** The brief says 13, but 12 were named: Auxin, Escape Rooms, Dark Ages Collection, Rexine Jacket, Swatches, Footwear Concept Collection, CRD, Tannery, and the four concepts. To add the thirteenth, copy a file as described above.
- **Auxin has no bags** in its deck, so it is tagged garments, footwear and materials only.
- The Auxin jacket spec sheet has a row "Comfort features: cushioned insole", which looks copied from the boot sheet. It is left out of the jacket spec on the site.

---

## Design notes

- **Grid and type.** A 12-column Swiss grid, broken on purpose by oversized names that cross columns, a vertical rail, and staggered image runs. Schibsted Grotesk for text and display, JetBrains Mono for labels and data.
- **Colour.** Paper `#F1EFEA`, ink `#121212`, one signal red `#C7350F` for the self-initiated badge, the active state and gaps to fill. Each project can set its own `accent` (`paper`, `ink`, `color`). Auxin uses the pale sage and cobalt of its deck, so the frame stays neutral and each collection keeps its own colour.
- **Hero swatch.** A three.js model of a leather swatch: pinked edge, punched hole, brass eyelet and ring, saddle stitching. It bends slowly and turns when dragged or with the arrow keys, and a light follows the pointer across the grain. The grain is **a crop of Aditi's own photograph** of the Auxin jacket (`media/auxin/final-closeup.jpg`), with the shading evened out. The surface relief is computed from that crop, so no texture was generated or drawn. If WebGL is unavailable, the photograph is shown instead.
- **Motion.** Projects open in an overlay, page elements rise in as they enter view, and the swatch moves. None of it is required: no intro animation, no scroll hijacking, and all motion stops under *Reduce motion*.
- **Accessibility.**
  - Skip link, visible focus and real links throughout.
  - The overlay is a dialog that traps focus, closes on Escape and returns focus.
  - Filters are toggle buttons with pressed state.
  - Images carry width, height and alt text.
  - Nothing depends on hover.

### Fonts and licences

All three are under the SIL Open Font License 1.1 (free for commercial use, including embedding on the web), installed from npm via Fontsource and served with the site:

| Font | By | Source | Used for |
| --- | --- | --- | --- |
| Schibsted Grotesk | Schibsted / Bakken & Bæck | github.com/schibsted/schibsted-grotesk | All text |
| JetBrains Mono | JetBrains | github.com/JetBrains/JetBrainsMono | Labels, numbers, data |
| Bodoni Moda | Owen Earl (indestructible type*) | github.com/indestructible-type/Bodoni | KOSHA identity only |

### Deploy

Vercel builds with `npm run build` and serves `dist/`. In `vercel.json`:

- `cleanUrls` serves `/work/auxin` from the prerendered `work/auxin.html`.
- Any other path falls back to the app.

Set `SITE_URL` to the live address if it changes from `https://aditiaryaescaperoomsportfolio.vercel.app`, so the share cards use absolute links.
