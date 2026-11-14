---
name: sutradara
description: Keahlian sutradara untuk video RAKA (stickman self-improvement, Shorts 9:16 24 fps): mempertahankan DNA channel lalu menambah lapisan penyutradaraan (satu tokoh satu perubahan, momen khas, shot list, ritme, kamera beralasan, waktu baca, suara, hierarki gerak, palet menurut emosi). Pakai di Tahap 2 (naskah dan storyboard) dan Tahap 5-6 (adegan, cek sebelum render); jalankan `tools/produksi.sh cek <slug>` (cek-sutradara.py) dan `python3 tools/cek-visual.py frame <still...>`.
---

# Sutradara RAKA

Aturan angka lengkap (naskah, arahan per kalimat, angka gerak, momen khas, larangan, cara mengukur) ada di **`brand/sutradara.md`**; palet menurut emosi di **`brand/palet-emosi.md`**; DNA di **`brand/dna-video.md`** (DNA menang bila bertabrakan). Skill ini = cara memakainya + alat pemeriksa. Diporting dari skill `sutradara` repo Channel-Penjelasan (14 Nov 2026) dan disesuaikan ke engine 2D canvas stickman (`studio/`), bukan Remotion.
Urutan nilai film: **suara → ritme → kamera → penyutradaraan**. Frame cantik hanya titik awal.

## A. DNA RAKA: jangan diubah (ACC user)
- Stickman "kamu" dengan satu item maskot oranye `#d64a33`; tiap video tokoh dan cerita baru.
- 9:16, 1080p, **24 fps**; caption posisi baku (pusat y=1344, maks 3 kata); zona aman = `tools/safezone.py` (satu sumber angka).
- Ending **loop** (kalimat terakhir menyambung ke pertama); swipe ala feed (1 variasi baru per video, `brand/eksperimen.md`).
- **Tanpa bisikan** di VO; puncak emosi = hening ±2 dtk + teks diketik (`brand/kerangka-cerita.md`).
- Warna: palet dipilih menurut emosi cerita (`brand/palet-emosi.md`); tokoh tetap menonjol di palet apa pun.

## B. Lapisan sutradara (ditambahkan)
1. **Satu tokoh, satu keinginan, satu perubahan.** Tulis logline 1 kalimat: anggapan → belokan (riset) → akhir beda dari awal; akhir menggema ke pembuka.
2. **Satu momen khas** di puncak emosi, hanya bisa terjadi di video ini; tulis di storyboard; jangan diulang di video berikutnya.
3. **Shot list wajib di storyboard Tahap 2** (format D): framing, gerak kamera + alasan, hero, SFX/transisi.
4. **Kamera beralasan, ≥4 jenis gerak per video**: push (fokus), pull (konteks), pan (pindah perhatian), crane (naik-turun), orbit dan dive (khusus shot 3D). Tidak ada kamera diam total; tahan pun didorong ≤2%.
5. **Ritme tidak rata**: ≥1 shot cepat ≤2,5 dtk (akselerasi menuju belokan) dan ≥1 napas ≥5 dtk; hook ≤4 dtk, frame 0 sudah gambar jadi. Ganti gambar tiap 2–3,5 dtk; shot > 5,5 dtk wajib berubah di dalamnya.
6. **Waktu baca**: ≤3,4 kata/dtk; teks layar tampil ≥ huruf/15 + 0,8 dtk (min 1,8), tidak bergerak saat dibaca.
7. **Suara = separuh film**: tiap shot punya SFX/ambience sesuai bahan; SFX jatuh **1 frame setelah** gambarnya; transisi non-cut diberi SFX di ≤0,3 dtk; hening ±2 dtk di puncak emosi; tidak ada SFX > −8 dB.
8. **Hierarki gerak**: satu hero per shot; gerak pendukung 50–70% jaraknya dan mulai 3–5 frame (100–200 ms) lebih lambat; gerak latar < 5%. Masuk ease-out 10–18 frame, keluar ease-in 40–50% lebih singkat.
9. **Antisipasi → aksi → follow-through** untuk gerak penting (angka/stempel: antisipasi 3 frame, skala 1,0→1,08→1,0 dalam 6 frame, puncak pas di kata).
10. **Larangan**: semua elemen masuk bersamaan, fade-naik di tiap elemen, teks karangan di luar naskah, partikel hiasan, ikon palsu di kolom kanan, flash > 3×/dtk, easing linear (kecuali putaran/progress), neon di luar style emerald.

## C. Proses (masuk ke WORKFLOW)
- **Tahap 2**: logline + momen khas + kolom shot list di `story/shots.tsv`/storyboard; pilih palet per adegan (maks 2, 3 bila ada adegan riset/papan).
- **Tahap 5**: setelah `produksi.sh shots`, jalankan `python3 tools/animatic.py <slug> --md` (kunci timing), lalu tulis kamera dan stiker mengikuti angka di B.
- **Tahap 6**: `tools/produksi.sh cek <slug>` → semua GAGAL diperbaiki, SARAN dipertimbangkan; lalu `produksi.sh sheet` (sheet + zona aman), `python3 tools/cek-visual.py frame studio/projects/<slug>-shorts/build/sheets/s*_*.png`, dan `brand/cek-bug.md`. Satu putaran perbaikan, cek lagi, lalu render.
- Video baru tidak boleh mengulang struktur, momen khas, dan jalur kamera video sebelumnya (≥4 dari 6 berbeda: struktur, pembuka, momen khas, jalur kamera, pola suara, penutup).

## D. Format shot list (kolom tambahan di tabel beat Tahap 2)
| # | Detik | Framing | Gerak kamera | Kenapa | Hero | SFX / transisi | Palet |
|---|---|---|---|---|---|---|---|
| 1 | 0–2,7 | lebar | push 4% | perkenalkan ruang dan tokoh | Doni + tas | footstep ×5 / cut | clay |
| 9 | 32,6–36 | papan data | pan ke angka | fokus ke 43% | angka | swish + blip / swipe | arctic |

## E. Yang dicek otomatis
`python3 tools/cek-sutradara.py <slug>` (dari `story/shots.json`, `timeline/words.json`, `scenes/shots/*.js`):
| Bagian | Diperiksa | Patokan |
|---|---|---|
| 1 Ritme | durasi tiap shot | hook ≤4 dtk (GAGAL bila lebih); CV ≥0,25; ada shot ≤2,5 dtk dan ≥5 dtk; shot > 5,5 dtk diingatkan |
| 2 Transisi | jenis transisi; flash | ≥3 jenis; sama berturut-turut ≤4; flash ≤3×/dtk (GAGAL) |
| 3 Kamera | `cam = {...}` yang bergantung waktu; kamera 3D | gerak di ≥50% adegan; ≥3–4 jenis |
| 4 Waktu baca & VO | kata/dtk per shot; jeda napas; awal kata VO | ≤3,4 kata/dtk; VO mulai ≤0,5 dtk; potongan jatuh di awal kata |
| 5 Suara | SFX per shot; hening; SFX transisi; gain | hening ≥2 dtk; transisi non-cut ber-SFX ≤0,3 dtk; gain ≤ −8 dB |
| 6 Palet & warna | jumlah style; emerald; neon; warna maskot | ≤2 palet (3 bila ada papan; >3 GAGAL); emerald bukan default; `#d64a33` ada |
| 7 Animasi | `linear`; antisipasi/overshoot | linear ≤4×; ada antisipasi |
`python3 tools/cek-visual.py frame <still...> [--emerald]` (dari still): keluarga warna dominan (≤4), kontras tokoh/objek terhadap latar (≥1,8; GAGAL <1,25), neon, keberadaan maskot oranye.
**Batas:** bentuk gambar tidak diautomasi (engine 2D prosedural), nilai di contact sheet. Deteksi gerak kamera dibaca dari pola `cam = {...}` di kode, jadi kamera yang dibuat dengan cara lain bisa terlewat.

## F. Baseline (14 Nov 2026, `cek-sutradara.py`)
- #8 tas-belum-dilepas: 0 GAGAL, 6 SARAN (kamera hanya satu jenis, 3D; 5 shot > 5,5 dtk; beberapa transisi tanpa SFX; `impact` > −8 dB).
- #7 ditolak-duluan: **1 GAGAL**: 4 palet (ember, arctic, retro, sakura); video ini lebih dulu dari aturan palet 13 Nov. Kamera 2D tidak terdeteksi bergerak (0%).
- #5 nunggu-1-januari: 0 GAGAL, 6 SARAN (emerald 100% shot; kamera bergerak hanya 6% adegan).
- `cek-visual.py` pada 4 still #8: 0 GAGAL, 0 SARAN.
