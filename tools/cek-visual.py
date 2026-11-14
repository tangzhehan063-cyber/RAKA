#!/usr/bin/env python3
"""Cek visual RAKA dari still hasil render (`tools/produksi.sh sheet <slug>` -> /tmp/produksi/sheet-*/f*.png atau build/stills):
perpaduan warna, kontras tokoh vs latar, neon, keluarga warna dominan, keberadaan maskot oranye #d64a33.
Pakai: python3 tools/cek-visual.py frame <still1.png> [still2.png ...] [--emerald]
  --emerald  izinkan neon/saturasi tinggi (style emerald untuk momen teknologi/peringatan, lihat brand/palet-emosi.md)
Hanya numpy + Pillow. Keluaran: GAGAL (wajib) / SARAN. Bentuk gambar dinilai dengan mata di contact sheet."""
import sys, pathlib, colorsys
import numpy as np
from PIL import Image

MASCOT = "#d64a33"


def rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(c):
    a = np.asarray(c, dtype=float) / 255.0
    a = np.where(a <= 0.03928, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def to_hsv(a):
    a = a.astype(float) / 255.0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1); d = mx - mn; h = np.zeros_like(mx); m = d > 1e-9
    rc = m & (mx == r); gc = m & (mx == g) & ~rc; bc = m & ~rc & ~gc
    h[rc] = ((g - b)[rc] / d[rc]) % 6; h[gc] = (b - r)[gc] / d[gc] + 2; h[bc] = (r - g)[bc] / d[bc] + 4
    return h * 60, np.where(mx > 0, d / np.maximum(mx, 1e-9), 0), mx


def hd(a, b): d = abs(a - b) % 360; return np.minimum(d, 360 - d)


def main(files, emerald):
    mh = colorsys.rgb_to_hsv(*[x / 255 for x in rgb(MASCOT)])[0] * 360
    fail = warn = 0
    for f in files:
        a = np.asarray(Image.open(f).convert("RGB").resize((270, 480)))
        h, s, v = to_hsv(a)
        flat = a.reshape(-1, 3).astype(np.int64)
        q = flat // 24; key = q[:, 0] * 10000 + q[:, 1] * 100 + q[:, 2]
        vals, cnts = np.unique(key, return_counts=True)
        bg = np.median(flat[key == vals[cnts.argmax()]], 0)  # warna paling dominan = latar
        chrom = (s > 0.28) & (v > 0.25) & (np.linalg.norm(a.astype(float) - bg, axis=-1) > 60)
        cover = chrom.mean(); notes = []
        if chrom.sum() > 200:
            hh = h[chrom]
            fam = int((np.histogram(hh, bins=12, range=(0, 360))[0] / len(hh) >= 0.05).sum())
            if fam > 4: notes.append(("SARAN", f"{fam} keluarga warna dominan (maks 4); perpaduan terlalu ramai"))
            neon = ((s[chrom] > 0.92) & (v[chrom] > 0.85)).mean() * 100
            if neon > 3 and not emerald: notes.append(("GAGAL", f"{neon:.0f}% piksel neon (jenuh > 0,92 dan terang); hanya untuk style emerald (--emerald)"))
            lo = float(np.median(lum(a[chrom]))); lb = float(lum(bg))
            ratio = (max(lo, lb) + 0.05) / (min(lo, lb) + 0.05)
            if ratio < 1.25: notes.append(("GAGAL", f"objek berwarna hampir sama terang dengan latar (rasio {ratio:.2f}); beri rim light/ganti palet"))
            elif ratio < 1.8: notes.append(("SARAN", f"kontras objek vs latar rendah ({ratio:.2f}); disarankan ≥ 1,8"))
            mpx = ((hd(h, mh) < 14) & (s > 0.5) & (v > 0.4)).mean()
            if mpx < 0.0015: notes.append(("info", "warna maskot oranye nyaris tidak terlihat (wajar di adegan papan data/tanpa tokoh)"))
        line = f"- {pathlib.Path(f).name}: latar≈{tuple(int(x) for x in bg)}, berwarna {cover:.0%}"
        for tag, msg in notes:
            if tag == "GAGAL": fail += 1
            elif tag == "SARAN": warn += 1
            line += f"\n    {tag} {msg}"
        print(line)
    print(f"\nHasil: {fail} GAGAL, {warn} SARAN")
    return 1 if fail else 0


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] != "frame" or len(args) < 2: print(__doc__); sys.exit(2)
    emerald = "--emerald" in args
    sys.exit(main([x for x in args[1:] if x != "--emerald"], emerald))
