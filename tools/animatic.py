#!/usr/bin/env python3
"""Animatic ringan RAKA: tabel timing per shot dari studio/projects/<slug>-shorts/story/shots.json (tanpa render).
Kunci timing sebelum render penuh: user ACC tabel ini. Peringatan: shot < 1,0 dtk atau > 9 dtk, kata/dtk > 3,4.
Pakai: python3 tools/animatic.py <slug> [--md]   (--md menulis naskah/animatic-<slug>.md)"""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
slug = sys.argv[1]
p = root / "studio/projects" / f"{slug}-shorts/story/shots.json"
d = json.load(open(p))
rows = ["| Shot | Mulai | Durasi | Kata | Kata/dtk | Teks |", "|---|---|---|---|---|---|"]
warn = []
for s in d["shots"]:
    a, b = s.get("start", 0), s.get("end", 0); dur = b - a
    line = s.get("line") or s.get("text") or ""
    n = len(line.split()); wps = n / dur if dur else 0
    rows.append(f"| {s.get('id','?')} | {a:.2f} | {dur:.2f} | {n} | {wps:.1f} | {line[:80]} |")
    if dur < 1.0 or dur > 9 or wps > 3.4: warn.append(f"{s.get('id','?')} ({dur:.1f} dtk, {wps:.1f} kata/dtk)")
rows += ["", f"Total {d.get('duration', 0):.1f} dtk, {len(d['shots'])} shot."]
rows.append("Perlu dicek: " + ", ".join(warn) if warn else "Tidak ada shot yang terlalu cepat/pendek/panjang.")
out = "\n".join(rows); print(out)
if "--md" in sys.argv:
    q = root / f"naskah/animatic-{slug}.md"; q.write_text(f"# Animatic ringan {slug} (kunci timing)\n\n{out}\n"); print("tertulis:", q.relative_to(root))
