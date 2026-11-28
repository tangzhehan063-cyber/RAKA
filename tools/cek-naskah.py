#!/usr/bin/env python3
"""Lint naskah RAKA (bukan penilai kualitas). Pakai: python3 tools/cek-naskah.py <naskah.txt|md> [--brief riset/<slug>.md] [--durasi 40]
Teks yang diperiksa = baris yang tidak diawali '#', '|', '>' , '-' atau '//' (jadi tulis VO polos per baris/kalimat)."""
import re, sys
a = sys.argv[1:]; f = a[0]
brief = a[a.index("--brief") + 1] if "--brief" in a else None
dur = float(a[a.index("--durasi") + 1]) if "--durasi" in a else None
raw = open(f, encoding="utf-8").read()
lines = [l.strip() for l in raw.splitlines() if l.strip() and not l.strip().startswith(("#", "|", ">", "-", "//", "```"))]
text = " ".join(lines); sent = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n", text) if s.strip()]
bad = warn = 0
def B(m): global bad; bad += 1; print("  GAGAL", m)
def W(m): global warn; warn += 1; print("  SARAN", m)
first = sent[0] if sent else ""
if re.match(r"(?i)^(halo|hai|hi|selamat|assalam|guys|teman)", first): B(f"dimulai dengan salam: '{first[:40]}'")
if re.match(r"(?i)^pernah(kah)? kamu", first): W("hook 'Pernahkah kamu...' (cari hook lebih konkret)")
if len(first.split()) > 12: W(f"hook {len(first.split())} kata (>12); pendekkan atau jadikan visual")
if re.match(r"(?i)^(psikolog|menurut|definisi|dalam psikologi)", first): W("pembuka definisi/akademis")
frasa = ["yuk simak", "tahukah kamu", "di era modern", "mari kita", "penting untuk diingat", "tanpa disadari", "ternyata", "faktanya", "kunci utama", "sebuah perjalanan"]
for p in frasa:
    n = len(re.findall(p, text, re.I)); 
    if n >= 1: W(f"frasa khas AI/klise '{p}' x{n}")
if re.search(r"—", text): W("tanda '—' (humanizer: hapus)")
for s in sent:
    if re.search(r"(?i)\bbukan\b[^.]{3,60}\b(tapi|melainkan)\b", s): W(f"pola 'bukan X tapi Y': '{s[:60]}'")
    if len(s.split()) > 18: W(f"kalimat {len(s.split())} kata: '{s[:50]}...'")
if re.search(r"(?i)\[(whisper|bisik)", raw): B("tag whispering (dilarang user)")
if re.search(r"\b\d{2,}\b", re.sub(r"\[[^\]]*\]", "", text)): W("angka digit di teks TTS (tulis sebagai kata: 'enam puluh enam')")
words = len(text.split()); print(f"\n{len(sent)} kalimat, {words} kata" + (f", ±{words/dur:.1f} kata/dtk untuk {dur:g} dtk" if dur else f", perkiraan {words/2.8:.0f} dtk (2,8 kata/dtk)"))
if dur and not 2.2 <= words / dur <= 3.4: W("kecepatan baca di luar 2,2–3,4 kata/dtk")
if brief:
    b = open(brief, encoding="utf-8").read()
    for n in set(re.findall(r"\b\d+(?:[.,]\d+)?\s?%|\b\d{3,}\b", raw)):
        if n.strip() not in b: B(f"angka '{n}' tidak ada di research brief (sumber?)")
print(f"\nHasil: {bad} GAGAL, {warn} SARAN (lint saja; kualitas dinilai lewat brand/retention.md)")
sys.exit(1 if bad else 0)
