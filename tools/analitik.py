#!/usr/bin/env python3
"""Ringkas analitik/video.csv tanpa menyimpulkan sebab. Pakai: python3 tools/analitik.py [analitik/video.csv] [--by pilar|hook_tipe|gaya|jenis_topik|durasi]
Menampilkan rasio per kelompok, video views tinggi tapi follow 0, retensi tinggi tapi views rendah. n kecil = indikatif."""
import csv, sys, statistics as st
a = sys.argv[1:]; p = next((x for x in a if x.endswith(".csv")), "analitik/video.csv"); by = a[a.index("--by") + 1] if "--by" in a else "jenis_topik"
rows = list(csv.DictReader(open(p, encoding="utf-8")))
def num(r, k):
    try: return float(r[k])
    except (ValueError, KeyError, TypeError): return None
def bucket(r):
    if by == "durasi":
        d = num(r, "durasi_dtk"); return None if d is None else ("<45" if d < 45 else "45-90" if d < 90 else ">90")
    return r.get(by) or None
g = {}
for r in rows:
    b = bucket(r)
    if b and num(r, "views") is not None: g.setdefault(b, []).append(r)
print(f"Kelompok per '{by}' (median; n kecil = indikatif, bukan bukti)")
for b, rs in sorted(g.items()):
    v = [num(r, "views") for r in rs]; lk = [num(r, "likes") / num(r, "views") * 100 for r in rs if num(r, "likes") is not None]
    ap = [num(r, "avg_pct_viewed") for r in rs if num(r, "avg_pct_viewed") is not None]
    print(f"  {b:<14} n={len(rs):<2} views median {st.median(v):>7.0f}  like/view {st.median(lk) if lk else float('nan'):4.1f}%  %tonton {st.median(ap) if ap else float('nan'):4.1f}" + ("" if ap else " (tanpa data retensi)"))
vs = sorted(num(r, "views") for r in rows if num(r, "views") is not None); med = st.median(vs) if vs else 0
print("\nViews tinggi, follow = 0 (hanya bila kolom follows terisi 0) (kandidat 'ramai tapi tak menghasilkan follower'):", [r["video"] for r in rows if (num(r, "views") or 0) > med and (num(r, "follows") == 0)] or "- (kolom follows belum terisi)")
print("Retensi tinggi, views rendah (kandidat distribusi/hook-nya lemah, isi bagus):", [r["video"] for r in rows if (num(r, "avg_pct_viewed") or 0) >= 60 and (num(r, "views") or 1e9) <= med] or "- (belum ada data retensi)")
print("Peringatan: views saja tidak menjelaskan penyebab; isi kolom retensi dari TikTok Studio untuk analisis yang berarti.")
