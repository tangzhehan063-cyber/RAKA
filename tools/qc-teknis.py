#!/usr/bin/env python3
"""QC teknis video RAKA. Pakai: python3 tools/qc-teknis.py <file.mp4> [--durasi 47.2] [--w 1080 --h 1920 --fps 24] [--lufs -14] [--out-dir folder]
Memeriksa: file, durasi, resolusi, fps, audio, loudness, true peak, clipping, black frame, file sementara. Tidak menilai kualitas isi."""
import json, re, subprocess, sys, os, glob
a = sys.argv[1:]; f = a[0]
def opt(k, d, c=float): return c(a[a.index(k) + 1]) if k in a else d
W_, H_, FPS, LUFS = opt("--w", 1080, int), opt("--h", 1920, int), opt("--fps", 24, int), opt("--lufs", -14.0)
DUR = opt("--durasi", None); OUT = opt("--out-dir", os.path.dirname(os.path.abspath(f)), str)
fail = warn = 0
def P(s): print(" ", s)
def ok(s): P("OK    " + s)
def bad(s):
    global fail; fail += 1; P("GAGAL " + s)
def hm(s):
    global warn; warn += 1; P("SARAN " + s)
if not os.path.isfile(f) or os.path.getsize(f) == 0: sys.exit("GAGAL file tidak ada/kosong")
pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", f], capture_output=True, text=True).stdout)
v = next((s for s in pr["streams"] if s["codec_type"] == "video"), None); au = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
d = float(pr["format"]["duration"]); ok(f"file {os.path.getsize(f)/1e6:.1f} MB, durasi {d:.2f} dtk")
if DUR is not None: (ok if abs(d - DUR) <= 0.3 else bad)(f"durasi {d:.2f} vs target {DUR:g} (±0,3)")
if not v: bad("tidak ada stream video")
else:
    (ok if (v["width"], v["height"]) == (W_, H_) else bad)(f"resolusi {v['width']}x{v['height']} (harus {W_}x{H_})")
    n, dd = map(int, v["r_frame_rate"].split("/")); fps = n / dd; (ok if abs(fps - FPS) < .01 else bad)(f"fps {fps:g} (harus {FPS})")
if not au: bad("tidak ada audio")
else:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"Integrated loudness:\s+I:\s+(-?[\d.]+) LUFS", r); tp = re.search(r"True peak:\s+Peak:\s+(-?[\d.]+) dBFS", r)
    if m:
        l = float(m.group(1)); (ok if abs(l - LUFS) <= 1.5 else bad)(f"loudness {l:.1f} LUFS (target {LUFS:g} ±1,5)")
    else: hm("loudness tidak terbaca (audio senyap?)")
    if tp:
        p = float(tp.group(1)); (ok if p <= -1.0 else bad)(f"true peak {p:.1f} dBTP (≤ -1)")
    vol = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    mv = re.search(r"max_volume:\s+(-?[\d.]+) dB", vol)
    if mv and float(mv.group(1)) >= -0.1: bad(f"clipping: max volume {mv.group(1)} dB")
    elif mv: ok(f"max volume {mv.group(1)} dB (tanpa clipping)")
bl = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-vf", "blackdetect=d=0.3:pix_th=0.05", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
bk = [(float(x), float(y)) for x, y in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", bl)]
mid = [b for b in bk if b[0] > 0.5 and b[1] < d - 0.5]
(ok("tidak ada black frame tak sengaja") if not mid else hm(f"black frame di tengah: {', '.join(f'{s:.1f}-{e:.1f}s' for s, e in mid)} (cek apakah disengaja)"))
tmp = [x for x in glob.glob(os.path.join(OUT, "*")) if re.search(r"(tmp|temp|_part|\.partial|\.wav$|concat|\.json$)", os.path.basename(x), re.I)]
(ok("tidak ada file sementara di folder output") if not tmp else bad(f"file sementara di {OUT}: {', '.join(os.path.basename(t) for t in tmp[:5])}"))
print(f"\nQC teknis: {fail} GAGAL, {warn} SARAN. Lolos teknis ≠ lolos konten (brand/qc.md bagian B). Subtitle/safe zone/aset hilang dicek lewat produksi.sh sheet + safe.png.")
sys.exit(1 if fail else 0)
