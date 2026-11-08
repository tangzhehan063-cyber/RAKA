#!/usr/bin/env python3
"""Ringkas hasil ScrapeMedsos tanpa membaca JSON mentah (hemat token).
  python3 tools/scrape_ringkas.py search  <file.json|txt> [N=10]   # video teratas: views, likes, komentar, url, caption
  python3 tools/scrape_ringkas.py comments <file.json|txt> [N=15]  # komentar teratas: likes + teks
File = output tool yang disimpan otomatis (tool-results/*.txt) atau JSON yang ditempel ke file.
"""
import json, sys
mode, f = sys.argv[1], sys.argv[2]; n = int(sys.argv[3]) if len(sys.argv) > 3 else (10 if mode == "search" else 15)
d = json.load(open(f))
if mode == "search":
    rows = []
    for it in d.get("search_item_list") or d.get("data") or []:
        a = it.get("aweme_info", it); s = a.get("statistics", {}); u = a.get("author", {}).get("unique_id", "")
        rows.append((s.get("play_count", 0), s.get("digg_count", 0), s.get("comment_count", 0), u, a.get("aweme_id"), (a.get("desc") or "")[:90].replace("\n", " ")))
    for v, l, c, u, i, t in sorted(rows, reverse=True)[:n]:
        print(f"{v/1e6:5.1f}jt {l/1e3:6.0f}rb ♥ {c:5d}💬 https://www.tiktok.com/@{u}/video/{i} | {t}")
else:
    cs = d.get("comments") or []
    for c in sorted(cs, key=lambda c: -c.get("digg_count", 0))[:n]:
        print(f"{c.get('digg_count', 0):6d} ♥ | {c.get('text', '').replace(chr(10), ' / ')[:140]}")
