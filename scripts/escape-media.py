"""Prepare the Escape Rooms shoot photographs and films for the web.

    python3 scripts/escape-media.py

Originals live in media/escape/shoot/ (developed from the raw files) and
media/escape/frames/ (stills taken from the bag films); the file name is the
name used in src/content.js. Every photograph is edited with the collection's
grade (scripts/noir.py: neo-noir, a little grain, the product kept clear) and
written to public/assets/shoot/:

  <name>.webp       the edited photograph, up to 1800 px on its long side
  <name>-cut.webp   for the names in CUT: the piece and the person cut out of
                    the background (transparent), then edited the same way

Cut-outs need `pip install rembg onnxruntime` (BiRefNet) and are only made when
missing: delete one to remake it. Films: see FILMS at the end.
"""
import os, subprocess, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noir import grade, clean_alpha

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'media', 'escape', 'shoot')
FRAMES = os.path.join(ROOT, 'media', 'escape', 'frames')
OUT = os.path.join(ROOT, 'public', 'assets', 'shoot')
os.makedirs(OUT, exist_ok=True)

# cut out of their background: name -> (source, crop box or None)
CUT = {n: (n, None) for n in [
    'jacket-open-front', 'jacket-back-plain', 'jacket-profile-grey', 'jacket-profile-look-up',
    'jacket-back-glance', 'jacket-dark-tilt', 'jacket-reach-studio',
    'jacket-collar-hand', 'jacket-buckles-skin',
    'prototype-front-open', 'prototype-profile', 'prototype-back-walk',
    'boots-side-kick', 'boots-lacing-hands', 'boots-stride-low', 'boots-soles-lying',
    'duffle-handles-walk', 'duffle-lean-back', 'drawstring-shoulder', 'tbase-crossbody-back',
    'bags-pair-lean', 'bags-pair-glance', 'bags-pair-seated',
]}
# the bags on their own, for the bag bays
CUT.update({
    'duffle': ('bags-held-out', (150, 1040, 870, 1760)),
    'tbase': ('bags-held-out', (790, 420, 1170, 1700)),
    'hobo': ('frames/hobo-video', None),
    'drawstring': ('frames/drawstring-video', None),
})

session = None

def remove_bg(im):
    global session
    from rembg import remove, new_session
    session = session or new_session('birefnet-general')
    work = im.copy()
    work.thumbnail((1280, 1280), Image.LANCZOS)
    return clean_alpha(remove(work, session=session))

def source(name):
    if name.startswith('frames/'):
        return Image.open(os.path.join(FRAMES, name[7:] + '.jpg')).convert('RGB')
    return Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB')

only = set(sys.argv[1:])
cuts_only = os.environ.get('CUTS_ONLY')
for f in sorted(os.listdir(SRC)):
    name, ext = os.path.splitext(f)
    if cuts_only or ext.lower() not in ('.jpg', '.jpeg', '.png') or (only and name not in only):
        continue
    im = source(name)
    im.thumbnail((1800, 1800), Image.LANCZOS)
    grade(im, vignette=0.3).save(os.path.join(OUT, f'{name}.webp'), quality=84, method=6)
    print(f"{name}: w: {im.width}, h: {im.height}")

# BiRefNet holds on to memory between photographs: with many to make, run one
# name per process (CUTS_ONLY=1 python3 scripts/escape-media.py <name>)
for name, (src, box) in CUT.items():
    if only and name not in only:
        continue
    path = os.path.join(OUT, f'{name}-cut.webp')
    if not os.path.exists(path):
        im = source(src)
        if box:
            im = im.crop(box)
        cut = grade(remove_bg(im), grain=0.022, toe=0.0, contrast=1.1, lift=0.1)
        cut.save(path, quality=86, method=6)
    c = Image.open(path)
    print(f"{name}-cut: w: {c.width}, h: {c.height}", flush=True)

# The bag films: the maker's mark cropped off, edited like the photographs.
UP = os.environ.get('FILMS_FROM', '')
FILMS = {
    'film-hobo': 'Video_Generation_For_New_Bag', 'film-garage': 'New_Video_Generation_Request',
    'film-drawstring': 'Studio_Product_Photography_Generation', 'film-lining': 'kling_20260307_VIDEO_Luxury_pro_4053_0',
}
if UP:
    for name, match in FILMS.items():
        src = next(os.path.join(UP, f) for f in os.listdir(UP) if match in f)
        vf = ("crop=iw*0.9:ih*0.9:iw*0.05:0,scale='if(gt(iw,ih),1280,720)':-2,"
              "eq=contrast=1.12:saturation=0.82:brightness=-0.03,"
              "colorbalance=rs=-0.03:gs=0.03:bs=0.01:rh=0.03:gh=0.02:bh=-0.04,noise=alls=7:allf=t,format=yuv420p")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', vf, '-an', '-c:v', 'libx264', '-crf', '27',
                        '-preset', 'slow', '-movflags', '+faststart', os.path.join(ROOT, 'public', 'assets', 'films', name + '.mp4')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-i', os.path.join(ROOT, 'public', 'assets', 'films', name + '.mp4'),
                        '-frames:v', '1', '-q:v', '4', os.path.join(ROOT, 'public', 'assets', 'posters', name + '.jpg')], check=True)
        print(name)
