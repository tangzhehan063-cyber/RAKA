#!/usr/bin/env python3
"""Overlay zona aman TikTok/Reels pada still 9:16 lalu susun jadi satu sheet (cek caption/teks tidak tertutup UI).
Merah = tertutup UI aplikasi (kolom tombol kanan, deskripsi bawah, header atas). Garis kuning = pita caption.
Usage: python3 tools/safezone.py <out.png> <still1.png> [still2.png ...]
"""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = []
for f in files:
    im = Image.open(f).convert("RGB"); W, H = im.size; k = W / 1080
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    red = (255, 40, 40, 70)
    d.rectangle([0, 0, W, 150 * k], fill=red)                    # header Following / For You
    d.rectangle([880 * k, 860 * k, W, 1560 * k], fill=red)       # tombol like/komentar/share/profil
    d.rectangle([0, 1480 * k, W, H], fill=red)                   # nama, deskripsi, musik, nav bar
    for yy in (1210, 1330): d.line([60 * k, yy * k, 860 * k, yy * k], fill=(255, 212, 90, 160), width=max(1, int(2 * k)))
    ims.append(Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB"))
W, H = ims[0].size; cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (W * cols, H * rows), (17, 17, 17))
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * W, (i // cols) * H))
sheet.save(out); print(out)
