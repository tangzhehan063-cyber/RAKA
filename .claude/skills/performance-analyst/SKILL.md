---
name: performance-analyst
description: Analitik, post-mortem, dan eksperimen RAKA (STEP 17-18). Pakai setelah user mengirim data performa video (views, tonton rata-rata, % tonton, share, save, komentar, follow, kurva retensi) atau sebelum merancang eksperimen: perbarui analitik/video.csv, cari pola per topik/hook/durasi/gaya, rancang eksperimen satu variabel.
---
# performance-analyst

**Input:** data dari user (angka/screenshot), `analitik/video.csv`. **Output:** baris baru di CSV, `templates/post-mortem.md` terisi, eksperimen berikutnya di `analitik/eksperimen.md`. **Batas:** tidak menghapus data historis; tidak menyimpulkan sebab dari views saja; tidak mengarang angka yang tidak diberikan.

## Langkah
1. Masukkan data ke `analitik/video.csv` (kolom kosong = tidak tersedia, bukan nol). Jangan mengubah baris lama kecuali koreksi data dari user (catat di kolom catatan).
2. `python3 tools/analitik.py --by jenis_topik|hook_tipe|gaya|durasi|pilar`. Laporkan n, dan tandai "indikatif" bila n<5.
3. Cari: topik menang, hook menang, durasi menang, gaya menang, pain paling menarik, format mudah dipahami, video ramai tanpa follow, views rendah retensi tinggi.
4. Tulis post-mortem: fakta, hal yang TIDAK bisa disimpulkan, interpretasi dengan tingkat keyakinan, 1–2 next action.
5. Rancang eksperimen berikutnya: HYPOTHESIS, VARIABLE (satu saja), CONTROL, TEST, METRIC, RESULT, INTERPRETATION, NEXT ACTION. Pola dianggap kandidat setelah ≥3 video.
6. Minta data yang kurang (retensi per detik adalah yang paling berharga).

## Quality gate
Setiap kesimpulan menyebut n dan batasnya; eksperimen mengubah satu variabel; tidak ada angka yang tidak berasal dari user atau CSV.
