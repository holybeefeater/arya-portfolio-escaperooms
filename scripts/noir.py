"""The Escape Rooms grade: neo-noir with a little grunge, the product kept clear.

Shadows lean to the collection's deep green, highlights to a sodium yellow,
blacks are pressed down and a fine grain is laid over. Reds and olives keep
their colour, so the cherry nappa, the olive suede and the green boots read
as they are. Used by escape-media.py.
"""
import numpy as np
from PIL import Image, ImageFilter

def _curve(x, toe=0.06, contrast=1.18):
    # an S-curve around the mid-grey, with the blacks pressed down
    x = np.clip((x - toe) / (1 - toe), 0, 1)
    return 0.5 + (x - 0.5) * contrast - 0.12 * (x - 0.5) * (1 - abs(2 * x - 1)) * (contrast - 1) * 4

def grade(im, grain=0.035, vignette=0.0, seed=7, toe=0.06, contrast=1.18, lift=0.0):
    rgba = im.convert('RGBA')
    a = np.asarray(rgba).astype(np.float32) / 255
    rgb, alpha = a[..., :3], a[..., 3:]
    lum = (rgb * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    # saturation: muted overall, but the collection's reds and greens keep theirs
    mx, mn = rgb.max(-1, keepdims=True), rgb.min(-1, keepdims=True)
    sat = (mx - mn) / (mx + 1e-4)
    r, g, b = rgb[..., :1], rgb[..., 1:2], rgb[..., 2:3]
    keep = np.clip(((r - g) * 3) + ((g - b) * 2.4), 0, 1) * np.clip(sat * 3, 0, 1)
    s = 0.62 + 0.4 * keep
    rgb = lum + (rgb - lum) * s
    # tone curve on each channel
    rgb = _curve(rgb, toe, contrast)
    # cut-outs sit on a dark page: open the shadows so the piece reads
    rgb = rgb + lift * (1 - rgb) ** 3
    lum2 = (rgb * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    # split tone: deep green into the shadows, sodium yellow into the highlights
    sh = np.clip(1 - lum2 * 2.2, 0, 1)
    hi = np.clip((lum2 - 0.55) * 2.2, 0, 1)
    rgb = rgb + sh * (np.array([0.02, 0.07, 0.05]) - 0.0) * 0.9
    rgb = rgb + hi * (np.array([0.05, 0.04, -0.05]))
    # grain, finer than the leather's own grain
    rng = np.random.default_rng(seed)
    n = rng.normal(0, 1, rgb.shape[:2] + (1,)).astype(np.float32)
    rgb = rgb + n * grain * (0.6 + 0.8 * (1 - lum2))
    if vignette:
        h, w = rgb.shape[:2]
        yy, xx = np.mgrid[0:h, 0:w]
        d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / 1.42
        rgb = rgb * (1 - vignette * np.clip(d, 0, 1)[..., None] ** 2)
    out = np.concatenate([np.clip(rgb, 0, 1), alpha], -1)
    img = Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA')
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
    return img if im.mode == 'RGBA' else img.convert('RGB')

def clean_alpha(cut):
    """Tighten a cut-out's edge: drop the faint halo and the light fringe it leaves."""
    a = np.asarray(cut.convert('RGBA')).astype(np.float32)
    al = a[..., 3] / 255
    al = np.clip((al - 0.12) / 0.8, 0, 1)
    # pull the colour of edge pixels toward their darker inside, so no white rim shows
    edge = (al > 0) & (al < 0.98)
    rgb = a[..., :3]
    rgb[edge] = rgb[edge] * (0.55 + 0.45 * al[edge][:, None])
    a[..., 3] = al * 255
    a[..., :3] = rgb
    out = Image.fromarray(a.astype(np.uint8), 'RGBA')
    return out.crop(out.getbbox())
