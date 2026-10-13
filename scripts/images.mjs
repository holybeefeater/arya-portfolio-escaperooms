// Builds responsive images for the portfolio.
//
//   media/<project>/<name>.(jpg|png|webp)   ← put originals here
//   public/work/<project>/<name>-<width>.webp   ← generated, do not edit
//   src/content/media.json                  ← generated: sizes for every image
//
// Run `npm run images` after adding or replacing an original. In project files,
// refer to an image by "<project>/<name>", e.g. "auxin/final-editorial-1".
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'media', OUT = 'public/work', MANIFEST = 'src/content/media.json'
const WIDTHS = [480, 960, 1600, 2400]

const manifest = {}
for (const dir of (await readdir(SRC, { withFileTypes: true })).filter(d => d.isDirectory())) {
  const project = dir.name
  await mkdir(join(OUT, project), { recursive: true })
  for (const file of await readdir(join(SRC, project))) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue
    const name = parse(file).name, input = join(SRC, project, file)
    const img = sharp(input)
    const { width, height, hasAlpha } = await img.metadata()
    // boards (documents with text) keep their largest size for reading
    const max = name.startsWith('board-') ? 2400 : 1600
    const widths = WIDTHS.filter(w => w < Math.min(width, max))
    widths.push(Math.min(width, max))
    for (const w of widths) {
      const out = join(OUT, project, `${name}-${w}.webp`)
      const fresh = await stat(out).then(o => o.mtimeMs > (0), () => false)
      if (!fresh || process.argv.includes('--force')) await sharp(input).resize({ width: w }).webp({ quality: name.startsWith('board-') ? 84 : 80, alphaQuality: 90 }).toFile(out)
    }
    manifest[`${project}/${name}`] = { w: width, h: height, widths, alpha: !!hasAlpha }
  }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`images: ${Object.keys(manifest).length} originals → ${OUT}`)
