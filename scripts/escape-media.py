"""Prepare the Escape Rooms shoot photographs for the web.

    python3 scripts/escape-media.py

Originals live in media/escape/shoot/ (developed from the raw files); the file
name is the name used in src/content.js. Writes, to public/assets/shoot/:

  <name>.webp       the photograph, up to 1800 px on its long side
  <name>-cut.webp   for the names in CUT: the piece and the person cut out of the
                    background (transparent), cropped to them, for the rooms

and prints every size, to copy into content.js. Cut-outs need `pip install
rembg onnxruntime` and are only made when missing: delete one to remake it.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'media', 'escape', 'shoot')
OUT = os.path.join(ROOT, 'public', 'assets', 'shoot')
os.makedirs(OUT, exist_ok=True)

# the plain-background photographs that become cut-outs in the rooms
CUT = [
    'jacket-open-front', 'jacket-back-plain', 'jacket-profile-grey',
    'boots-side-kick', 'boots-lacing-hands',
    'prototype-front-open', 'prototype-profile', 'prototype-back-walk',
]

session = None

def cutout(im):
    global session
    from rembg import remove, new_session
    session = session or new_session('isnet-general-use')
    work = im.copy()
    work.thumbnail((2000, 2000), Image.LANCZOS)
    out = remove(work, session=session, alpha_matting=True)
    return out.crop(out.getbbox())

for f in sorted(os.listdir(SRC)):
    name, ext = os.path.splitext(f)
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'):
        continue
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    web = im.copy()
    web.thumbnail((1800, 1800), Image.LANCZOS)
    web.save(os.path.join(OUT, f'{name}.webp'), quality=82, method=6)
    print(f"{name}: w: {web.width}, h: {web.height}")
    if name in CUT:
        path = os.path.join(OUT, f'{name}-cut.webp')
        if not os.path.exists(path):
            cut = cutout(im)
            cut.thumbnail((1600, 1600), Image.LANCZOS)
            cut.save(path, quality=86, method=6)
        c = Image.open(path)
        print(f"{name}-cut: w: {c.width}, h: {c.height}")
