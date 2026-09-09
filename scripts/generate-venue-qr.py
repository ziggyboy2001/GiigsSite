#!/usr/bin/env python3
"""
Generate a Giigs-branded QR code for a venue landing page.

Matches the house style of public/images/giigsQRCode.png:
  * inverted look — lavender/purple modules on a black field
  * circular data "dots", solid rounded-square finder eyes
  * a gradient rounded center tile carrying the Giigs script logo

The QR encodes the venue landing page URL (with campaign attribution
params) so PostHog can attribute scans → venue page → funnel.

Usage:
  python3 scripts/generate-venue-qr.py \
      --venue-id 147 \
      --slug marigny-opera-house \
      --venue marigny_opera_house \
      --campaign moh_launch_sep_2026 \
      --placement poster

  # or pass a fully-formed URL
  python3 scripts/generate-venue-qr.py --url "https://giigsapp.com/..." --slug marigny-opera-house

Output: public/venue-qr/<slug>.png
"""
import argparse
import os
from urllib.parse import urlencode

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO_PATH = os.path.join(ROOT, "public", "images", "giigsVector.png")
OUT_DIR = os.path.join(ROOT, "public", "venue-qr")
SITE_URL = "https://giigsapp.com"

# ── palette (sampled from the existing brand QR) ──────────────────────
BG = (0, 0, 0, 255)                 # black field
MODULE_TOP = (176, 112, 246)        # lavender (top)
MODULE_BOTTOM = (122, 63, 232)      # deep purple (bottom)
TILE_TL = (150, 60, 235)            # center tile gradient — purple
TILE_BR = (214, 63, 176)            # center tile gradient — magenta


def build_url(args):
    if args.url:
        return args.url
    venue_key = args.venue_id or args.slug
    base = f"{SITE_URL}/events/venue/{venue_key}"
    params = {}
    if args.venue:
        params["venue"] = args.venue
    if args.campaign:
        params["campaign"] = args.campaign
    if args.placement:
        params["placement"] = args.placement
    return f"{base}?{urlencode(params)}" if params else base


def vertical_gradient(size, top, bottom):
    w, h = size
    grad = Image.new("RGBA", size)
    px = grad.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b, 255)
    return grad


def diagonal_gradient(size, tl, br):
    w, h = size
    grad = Image.new("RGBA", size)
    px = grad.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(w - 1, 1) + y / max(h - 1, 1)) / 2
            r = int(tl[0] + (br[0] - tl[0]) * t)
            g = int(tl[1] + (br[1] - tl[1]) * t)
            b = int(tl[2] + (br[2] - tl[2]) * t)
            px[x, y] = (r, g, b, 255)
    return grad


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def make_center_tile(tile_px):
    """Gradient rounded tile with the white-haloed Giigs script logo."""
    tile = diagonal_gradient((tile_px, tile_px), TILE_TL, TILE_BR)
    radius = int(tile_px * 0.17)
    tile.putalpha(rounded_mask((tile_px, tile_px), radius))

    logo = Image.open(LOGO_PATH).convert("RGBA")
    # trim to content bbox
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    target_w = int(tile_px * 0.74)
    scale = target_w / logo.width
    logo = logo.resize((target_w, int(logo.height * scale)), Image.LANCZOS)

    # white halo — dilate the logo alpha and fill white, so the mark pops
    # on the purple tile (mirrors the outlined look of the original QR).
    halo_r = max(9, int(target_w * 0.035)) | 1  # odd
    alpha = logo.split()[3]
    halo_alpha = alpha.filter(ImageFilter.MaxFilter(halo_r))
    halo = Image.new("RGBA", logo.size, (255, 255, 255, 0))
    halo.putalpha(halo_alpha)

    lx = (tile_px - logo.width) // 2
    ly = (tile_px - logo.height) // 2
    tile.alpha_composite(halo, (lx, ly))
    tile.alpha_composite(logo, (lx, ly))
    return tile


def render(url, out_path, cell=30):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    matrix = qr.get_matrix()          # includes quiet-zone border
    n = len(matrix)
    border = qr.border
    count = qr.modules_count           # data area (no border)

    size = n * cell
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)

    # finder 7x7 blocks in matrix coords (top-left of each)
    finders = [
        (border, border),
        (border, border + count - 7),
        (border + count - 7, border),
    ]

    def in_finder(r, c):
        for fr, fc in finders:
            if fr <= r < fr + 7 and fc <= c < fc + 7:
                return True
        return False

    dot_r = cell * 0.46
    for r in range(n):
        for c in range(n):
            if not matrix[r][c] or in_finder(r, c):
                continue
            cx = c * cell + cell / 2
            cy = r * cell + cell / 2
            md.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=255)

    # rounded-square finder eyes: outer frame + inner dot
    for fr, fc in finders:
        x0, y0 = fc * cell, fr * cell
        outer = [x0, y0, x0 + 7 * cell - 1, y0 + 7 * cell - 1]
        gap = [x0 + cell, y0 + cell, x0 + 6 * cell - 1, y0 + 6 * cell - 1]
        inner = [x0 + 2 * cell, y0 + 2 * cell, x0 + 5 * cell - 1, y0 + 5 * cell - 1]
        md.rounded_rectangle(outer, radius=cell * 1.7, fill=255)
        md.rounded_rectangle(gap, radius=cell * 1.25, fill=0)
        md.rounded_rectangle(inner, radius=cell * 0.9, fill=255)

    # colour the modules through the mask with a vertical gradient
    img = Image.new("RGBA", (size, size), BG)
    grad = vertical_gradient((size, size), MODULE_TOP, MODULE_BOTTOM)
    img.paste(grad, (0, 0), mask)

    # center brand tile (~30% width — safely within ECC-H tolerance)
    tile_px = int(size * 0.30)
    tile = make_center_tile(tile_px)
    img.alpha_composite(tile, ((size - tile_px) // 2, (size - tile_px) // 2))

    # supersample down for smooth circle edges
    final = img.resize((1200, 1200), Image.LANCZOS)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    final.save(out_path)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url")
    ap.add_argument("--venue-id")
    ap.add_argument("--slug", required=True, help="output filename + fallback path segment")
    ap.add_argument("--venue")
    ap.add_argument("--campaign")
    ap.add_argument("--placement")
    ap.add_argument("--out")
    args = ap.parse_args()

    url = build_url(args)
    out = args.out or os.path.join(OUT_DIR, f"{args.slug}.png")
    render(url, out)
    print("URL :", url)
    print("PNG :", out)


if __name__ == "__main__":
    main()
