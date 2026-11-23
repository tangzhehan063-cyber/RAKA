#!/usr/bin/env python3
"""Skor ide RAKA (alat keputusan editorial, BUKAN formula ilmiah). Bobot: relatability 25, hook 25, curiosity 20, visual 15, riset 15.
GATE: riset <=2 -> GAGAL walau skor total tinggi; riset '?'/kosong -> BELUM DICEK (tak boleh masuk 3 terbaik).
Pakai: python3 tools/skor-ide.py ide.json   (list objek: title, pilar, relatability, hook, curiosity, visual, riset; skala 1-5)"""
import json, sys
W = {"relatability": .25, "hook": .25, "curiosity": .20, "visual": .15, "riset": .15}
def skor(i):
    r = i.get("riset"); rr = r if isinstance(r, (int, float)) else None
    tot = sum(W[k] * (i[k] if isinstance(i.get(k), (int, float)) else 0) for k in W) / 5 * 100
    gate = "BELUM DICEK" if rr is None else ("GAGAL" if rr <= 2 else "LOLOS")
    return round(tot, 1), gate
def main(p):
    ide = json.load(open(p)); rows = []
    for i in ide:
        for k in W:
            v = i.get(k)
            if k != "riset" and not (isinstance(v, (int, float)) and 1 <= v <= 5): sys.exit(f"'{i.get('title')}': {k} harus 1-5")
        t, g = skor(i); rows.append((t, g, i))
    rows.sort(key=lambda x: (x[1] != "LOLOS", -x[0]))
    print(f"{'#':>2} {'skor':>5} {'gate':<12} pilar  judul")
    for n, (t, g, i) in enumerate(rows, 1): print(f"{n:>2} {t:>5} {g:<12} {i.get('pilar','-'):<5}  {i['title']}")
    ok = [r for r in rows if r[1] == "LOLOS"][:3]
    print("\n3 terbaik (hanya yang lolos gate):", "; ".join(r[2]["title"] for r in ok) or "belum ada (cek riset dulu)")
    pil = [r[2].get("pilar") for r in ok]
    if len(set(pil)) < len(pil): print("PERINGATAN: ada pilar sama di 3 terbaik; pertimbangkan diversifikasi")
    print("Catatan: skor = alat editorial; potensi audience tanpa data platform adalah hipotesis.")
if __name__ == "__main__": main(sys.argv[1]) if len(sys.argv) > 1 else sys.exit(__doc__)
