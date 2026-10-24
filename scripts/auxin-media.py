"""Prepare the Auxin images for the web, from the originals in media/auxin/.

    python3 scripts/auxin-media.py

Photographs from the shoot go in media/auxin/shoot/; the file name becomes the
image name in content.js. Writes two sizes of each image to
public/assets/auxin/img/ (<name>.webp and <name>-s.webp) and their sizes to
src/auxin/media.json. Line drawings are cut
out of Aditi's specification boards and their sage background made transparent.
Run it again after adding or replacing an image in media/auxin/.
"""
import json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'media', 'auxin')
OUT = os.path.join(ROOT, 'public', 'assets', 'auxin', 'img')
os.makedirs(OUT, exist_ok=True)
manifest = {}

def save(name, im, big=1600, small=720, q=82):
    im = im.copy()
    alpha = im.mode in ('RGBA', 'LA')
    im = im.convert('RGBA' if alpha else 'RGB')
    for suffix, w in (('', big), ('-s', small)):
        x = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        x.save(os.path.join(OUT, f'{name}{suffix}.webp'), quality=q, method=6)
    w = min(im.width, big)
    manifest[name] = {'w': w, 'h': round(im.height * w / im.width), 'sw': min(im.width, small), 'alpha': alpha}

def key_sage(im, thresh=30):
    """Make the flat sage board colour transparent, including pockets enclosed by
    the drawing (the drawings themselves are white with dark lines)."""
    rgb = im.convert('RGB')
    w, h = rgb.size
    corners = [rgb.getpixel(xy) for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
    bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))
    a = Image.new('L', rgb.size, 255)
    px, pa = rgb.load(), a.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            d = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
            if d < thresh:
                pa[x, y] = 0
            elif d < thresh * 2:  # soften the edge of the key
                pa[x, y] = int(255 * (d - thresh) / thresh)
    out = rgb.convert('RGBA'); out.putalpha(a)
    return out.crop(out.getbbox())

def open_(n):
    return Image.open(os.path.join(SRC, n))

# photographs from the shoot: every file in media/auxin/shoot/, named by its file
SHOOT = os.path.join(SRC, 'shoot')
for f in sorted(os.listdir(SHOOT)):
    n, ext = os.path.splitext(f)
    if ext.lower() in ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'):
        save(n, Image.open(os.path.join(SHOOT, f)), big=1600, small=720)
# images from the deck (reference images, not her photographs)
for n in ('title-plate', 'cells-texture', 'closing-plant'):
    save(n, open_(n + '.jpg'), big=1200, small=640)
# her renders and range drawings (transparent cut-outs)
for n in ('range-garments', 'final-design-front-back', 'calf-boots-range', 'calf-boots-final-design'):
    save(n, open_(n + '.png'), big=1600, small=720)
# the three views of the calf boot, for the turn
boot = open_('calf-boots-final-design.png')
for name, box in (('calf-view-front', (0, 0, 262, 812)), ('calf-view-back', (262, 0, 528, 812)), ('calf-view-side', (528, 0, 1122, 812))):
    v = boot.crop(box); save(name, v.crop(v.getbbox()), big=800, small=400)
# boards, whole pages
for f in sorted(os.listdir(SRC)):
    if f.startswith('board-'):
        save(f[:-4], open_(f), big=1800, small=900, q=80)
# line drawings, cut out of the specification boards (coordinates in the 2400 px page)
flats = {
    'flat-jacket': ('board-garment-spec-costing.jpg', (888, 288, 1602, 738)),
    'flat-trousers': ('board-garment-spec-costing.jpg', (888, 744, 1602, 1260)),
    'flat-cowboy': ('board-cowboy-boots-spec-costing.jpg', (0, 312, 740, 996)),
    'flat-calf': ('board-calf-boots-spec-costing.jpg', (210, 410, 768, 1150)),
}
for name, (f, box) in flats.items():
    save(name, key_sage(open_(f).crop(box)), big=1200, small=600)

with open(os.path.join(ROOT, 'src', 'auxin', 'media.json'), 'w') as fh:
    json.dump(manifest, fh, indent=1, sort_keys=True)
print(len(manifest), 'images')
