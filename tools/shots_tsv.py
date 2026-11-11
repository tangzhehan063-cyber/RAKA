#!/usr/bin/env python3
"""shots.tsv (ringkas, hemat token) -> story/shots.json
Format per baris (pisah TAB, baris diawali # = komentar):
  id  start  end  set  transisi  sfx  amb  line | scene
  - transisi: cut | flash | dip | dipWhite | zoom | whip | swipe | swipeBack   (durasi default otomatis)
  - sfx: "0.1 thunder -12; 1.9 riser -10"  atau  -
  - amb: "rain -20"  atau  -
Baris khusus:
  @music  0-27.4 mystery 0.35; 27.4-36.2 sad 0.3; 36.2-44.5 hopeful 0.5; 44.5-56.2 triumph 0.5
  @title  Judul Video
Durasi = end shot terakhir; config.json ikut diperbarui.
Usage: python3 tools/shots_tsv.py <shots.tsv> <project_dir>
"""
import json, os, sys

src, proj = sys.argv[1], sys.argv[2]
DUR = {"flash": 0.3, "whip": 0.35, "swipe": 0.32}
shots, music, title = [], [], os.path.basename(proj)
for raw in open(src, encoding="utf-8"):
    ln = raw.rstrip("\n")
    if not ln.strip() or ln.lstrip().startswith("#"): continue
    if ln.startswith("@music"):
        for part in ln[6:].split(";"):
            rng, mood, inten = part.split()
            a, b = rng.split("-"); music.append({"start": float(a), "end": float(b), "mood": mood, "intensity": float(inten)})
        continue
    if ln.startswith("@title"): title = ln[6:].strip(); continue
    c = ln.split("\t")
    if len(c) < 8: sys.exit(f"kolom kurang (butuh 8, TAB): {ln}")
    sid, a, b, st, tr, sfx, amb, rest = c[:8]
    line, _, scene = rest.partition("|")
    st, _, style = st.partition("@")   # set@gaya, mis. kamar@retro
    d = {"id": sid, "start": float(a), "end": float(b), "line": line.strip(), "scene": scene.strip(), "set": st, "bars": None,
         "in": {"type": "swipe", "dir": -1, "dur": 0.32} if tr == "swipeBack" else {"type": tr} if tr == "cut" else {"type": tr, "dur": DUR.get(tr, 0.4)}, "sfx": [], "notes": ""}
    if style: d["style"] = style
    if sfx.strip() not in ("", "-"):
        for s in sfx.split(";"):
            at, name, gain = s.split(); d["sfx"].append({"at": float(at), "name": name, "gain": float(gain)})
    if amb.strip() not in ("", "-"):
        n, g = amb.split(); d["amb"] = {"name": n, "gain": float(g)}
    shots.append(d)
dur = shots[-1]["end"]
json.dump({"title": title, "duration": dur, "shots": shots, "music": music, "sfx": []},
          open(os.path.join(proj, "story", "shots.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
cp = os.path.join(proj, "config.json"); c = json.load(open(cp)); c["duration"] = dur; c["title"] = title
json.dump(c, open(cp, "w"), indent=1)
print(f"{len(shots)} shot, {dur:.2f} dtk, musik {len(music)} bagian")
