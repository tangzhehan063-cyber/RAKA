#!/usr/bin/env python3
"""Cek sutradara RAKA: ritme, transisi, kamera, waktu baca, suara, palet, animasi (tanpa render).
Dibaca dari studio/projects/<slug>-shorts: story/shots.json, timeline/words.json, config.json, scenes/shots/*.js.
Aturan: .claude/skills/sutradara/SKILL.md (angka di brand/sutradara.md, palet di brand/palet-emosi.md).
Pakai: python3 tools/cek-sutradara.py <slug>      (slug tanpa akhiran -shorts; keluar 1 bila ada GAGAL)
Bentuk gambar tidak diautomasi (engine 2D canvas prosedural): nilai lewat contact sheet + tools/cek-visual.py."""
import colorsys, collections, glob, json, pathlib, re, statistics, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
slug = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)
P = ROOT / "studio/projects" / f"{slug}-shorts"
if not P.exists():
    sys.exit(f"tidak ada {P}")
shots_d = json.load(open(P / "story/shots.json"))
shots = shots_d["shots"]
cfg = json.load(open(P / "config.json"))
words = []
wp = P / "timeline/words.json"
if wp.exists():
    w = json.load(open(wp)); words = w["words"] if isinstance(w, dict) else w
code = "\n".join(open(f, encoding="utf8").read() for f in sorted(glob.glob(str(P / "scenes/**/*.js"), recursive=True)))
END = shots_d.get("duration") or shots[-1]["end"]
out, fail, warn = [], 0, 0
f1 = lambda x: f"{x:.1f}"
def ok(s): out.append(f"  OK    {s}")
def bad(s):
    global fail; fail += 1; out.append(f"  GAGAL {s}")
def hm(s):
    global warn; warn += 1; out.append(f"  SARAN {s}")

# ---------- 1. ritme ----------
durs = [s["end"] - s["start"] for s in shots]
mean = statistics.mean(durs); cv = statistics.pstdev(durs) / mean
out.append(f"\n1. RITME ({len(shots)} shot, rata {f1(mean)} dtk, total {f1(END)} dtk)")
out.append("  " + " | ".join(f"{s['id']} {f1(d)}" for s, d in zip(shots, durs)))
if durs[0] > 4: bad(f"hook terlalu panjang: {f1(durs[0])} dtk (>4); frame 0 sudah hook, jawaban paling cepat di tengah")
else: ok(f"hook {f1(durs[0])} dtk (≤4)")
ok(f"variasi tempo CV {cv:.2f} (≥0,25)") if cv >= 0.25 else hm(f"tempo terlalu rata (CV {cv:.2f}); tambah 1 shot cepat ≤2,5 dtk dan 1 napas ≥5 dtk")
fast = [s["id"] for s, d in zip(shots, durs) if d <= 2.5]; breath = [s["id"] for s, d in zip(shots, durs) if d >= 5]
ok(f"shot cepat ≤2,5 dtk: {', '.join(fast)}") if fast else hm("tidak ada shot cepat ≤2,5 dtk (akselerasi menjelang belokan)")
ok(f"shot napas ≥5 dtk: {', '.join(breath)}") if breath else hm("tidak ada shot napas ≥5 dtk")
long_ = [f"{s['id']} ({f1(d)})" for s, d in zip(shots, durs) if d > 5.5]
if long_: hm(f"shot > 5,5 dtk harus berubah di dalamnya (kamera/objek/swipe): {', '.join(long_)}")

# ---------- 2. transisi ----------
out.append("\n2. TRANSISI")
tr = [s["in"]["type"] for s in shots]; cnt = collections.Counter(tr)
out.append("  " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()))
ok(f"{len(cnt)} jenis transisi") if len(cnt) >= 3 else hm(f"hanya {len(cnt)} jenis transisi (≥3 disarankan; swipe ala feed + variasi baru dari brand/eksperimen.md)")
run = max((len(list(g)) for _, g in __import__('itertools').groupby(tr)), default=0)
hm(f"transisi sama {run}× berturut-turut") if run > 4 else ok(f"transisi sama berturut-turut maks {run}×")
fl = [s["start"] for s, t_ in zip(shots, tr) if t_ == "flash"]
bad("flash > 3×/dtk") if any(sum(1 for y in fl if x <= y < x + 1) > 3 for x in fl) else ok(f"flash {len(fl)}× (≤3×/dtk)")

# ---------- 3. kamera (dari kode adegan) ----------
out.append("\n3. KAMERA (dibaca dari scenes/shots/*.js)")
blocks = re.split(r"registerShot\(", code)[1:]
anim_blocks, axes = 0, collections.Counter()
for b in blocks:
    animated = False
    for m in re.finditer(r"\bcam\s*=\s*\{([^}]*)\}", b):
        for ax in ("x", "y", "z"):
            mm = re.search(rf"\b{ax}\s*:\s*([^,}}]*)", m.group(1))
            if mm and re.search(r"\bt\b|lerp|prog|ease|sin\(|info", mm.group(1)):
                axes[{"z": "zoom (push/pull)", "x": "pan", "y": "crane"}[ax]] += 1; animated = True
    if re.search(r"cam\s*\(\s*t\b|cam:\s*\(t", b): axes["kamera 3D (orbit/dive)"] += 1; animated = True
    anim_blocks += animated
if blocks:
    frac = anim_blocks / len(blocks)
    out.append(f"  {len(blocks)} blok adegan, kamera bergerak di {anim_blocks} ({frac:.0%}); jenis: {', '.join(f'{k} {v}' for k, v in axes.items()) or '-'}")
    ok("kamera bergerak di ≥50% adegan") if frac >= 0.5 else hm(f"kamera bergerak hanya {frac:.0%} adegan; tidak ada kamera diam total (tahan pun didorong 2%)")
    ok(f"{len(axes)} jenis gerak kamera") if len(axes) >= 3 else hm(f"hanya {len(axes)} jenis gerak kamera (target ≥4: push, pull, pan, crane, orbit, dive)")
else:
    hm("registerShot tidak ditemukan di scenes/")

# ---------- 4. waktu baca & VO ----------
out.append("\n4. WAKTU BACA & VO")
fast_read = []
for s, d in zip(shots, durs):
    n = len((s.get("line") or "").split())
    if n and d > 0 and n / d > 3.4: fast_read.append(f"{s['id']} ({n / d:.1f} kata/dtk)")
ok("kecepatan baca per shot ≤3,4 kata/dtk") if not fast_read else hm(f"terlalu cepat dibaca: {', '.join(fast_read)}")
if words:
    pauses = [(words[i]["end"], words[i + 1]["start"] - words[i]["end"]) for i in range(len(words) - 1) if words[i + 1]["start"] - words[i]["end"] >= 0.45]
    ok(f"{len(words)} kata, rata {len(words) / (words[-1]['end'] - words[0]['start']):.1f} kata/dtk; jeda napas ≥0,45 dtk: {len(pauses)}")
    ok(f"VO mulai {f1(words[0]['start'])} dtk (≤0,5)") if words[0]["start"] <= 0.5 else hm(f"VO baru mulai {f1(words[0]['start'])} dtk; hook harus jalan sejak frame 0")
    off = [s["id"] for s in shots[1:] if not any(abs(w["start"] - s["start"]) <= 0.35 for w in words)]
    ok("semua potongan shot jatuh di awal kata VO (±0,35)") if not off else hm(f"potongan tidak di awal kata VO: {', '.join(off)}")
else:
    hm("timeline/words.json tidak ada; waktu VO tidak diperiksa")

# ---------- 5. suara ----------
out.append("\n5. SUARA")
silent = [s["id"] for s in shots if not s.get("sfx") and not s.get("amb")]
ok("setiap shot punya SFX atau ambience") if not silent else hm(f"shot tanpa SFX/ambience: {', '.join(silent)}")
abs_sfx = sorted(s["start"] + e["at"] for s in shots for e in (s.get("sfx") or []))
gaps = [(abs_sfx[i], abs_sfx[i + 1] - abs_sfx[i]) for i in range(len(abs_sfx) - 1)]
big = max(gaps, key=lambda g: g[1]) if gaps else (0, 0)
ok(f"ada hening SFX ≥2 dtk ({f1(big[0])}+{f1(big[1])}); momen hening sebelum payoff/bisikan pengganti") if big[1] >= 2.0 else hm(f"jeda SFX terpanjang {f1(big[1])} dtk (<2); sediakan 1 momen hening ±2 dtk di puncak emosi (brand/kerangka-cerita.md)")
nocue = [s["id"] for s, t_ in zip(shots[1:], tr[1:]) if t_ != "cut" and not any(e["at"] <= 0.3 for e in (s.get("sfx") or []))]
ok("transisi non-cut diberi SFX di ≤0,3 dtk") if not nocue else hm(f"transisi tanpa SFX pembuka: {', '.join(nocue)}")
loud = [f"{s['id']}:{e['name']}" for s in shots for e in (s.get("sfx") or []) if e.get("gain", -99) > -8]
hm(f"SFX terlalu keras (> −8 dB): {', '.join(loud[:6])}") if loud else ok("tidak ada SFX > −8 dB")

# ---------- 6. palet & warna ----------
out.append("\n6. PALET & WARNA (brand/palet-emosi.md)")
styles = [s.get("style") or cfg.get("style") for s in shots]; sc = collections.Counter(styles)
out.append("  " + ", ".join(f"{k} {v}" for k, v in sc.most_common()))
has_board = any("board" in (s.get("set") or "") or "papan" in (s.get("scene") or "").lower() for s in shots)
lim = 3 if has_board else 2
if len(sc) > 3: bad(f"{len(sc)} palet (>3); maksimal 2, 3 bila ada adegan riset/papan")
elif len(sc) > lim: hm(f"{len(sc)} palet tanpa adegan riset/papan (maks 2)")
else: ok(f"{len(sc)} palet (≤{lim})")
if sc.get("emerald", 0) / len(shots) > 0.5: hm("emerald dipakai > 50% shot; hanya untuk teknologi/peringatan, bukan default")
else: ok(f"emerald {sc.get('emerald', 0)}/{len(shots)} shot (bukan default)")
hexes = {h.lower() for h in re.findall(r"#[0-9a-fA-F]{6}\b", code)}
def hsv(h): r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)); return colorsys.rgb_to_hsv(r, g, b)
neon = [h for h in hexes if hsv(h)[1] > 0.92 and hsv(h)[2] > 0.85 and "emerald" not in sc]
hm(f"warna neon di kode tanpa style emerald: {', '.join(sorted(neon)[:6])}") if neon else ok("tidak ada warna neon di luar emerald")
mascot = "#d64a33" in (code.lower() + " ".join(open(f, encoding="utf8").read().lower() for f in glob.glob(str(P / "scenes/cast.js"))))
ok("warna maskot #d64a33 ada di kode") if mascot else hm("warna maskot #d64a33 tidak ditemukan di kode adegan/cast (tokoh harus tetap oranye)")

# ---------- 7. animasi (kode) ----------
out.append("\n7. ANIMASI (kode adegan)")
lin = len(re.findall(r"linear", code))
hm(f"easing linear {lin}× (hanya putaran/progress)") if lin > 4 else ok(f"easing linear {lin}×")
anti = len(re.findall(r"overshoot|back\(|antisip", code, re.I))
ok(f"penanda antisipasi/overshoot {anti}×") if anti else hm("tidak ada antisipasi/overshoot; angka/stempel: antisipasi 3 frame, skala 1,0→1,08→1,0 selama 6 frame")
out.append("  info  bentuk gambar tidak diautomasi di raka; nilai di contact sheet (`produksi.sh sheet`) + `python3 tools/cek-visual.py frame <still...>`")

print(f"CEK SUTRADARA RAKA · {slug} · {f1(END)} dtk · {cfg.get('fps', 24)} fps")
print("\n".join(out))
print(f"\nHasil: {fail} GAGAL, {warn} SARAN")
sys.exit(1 if fail else 0)
