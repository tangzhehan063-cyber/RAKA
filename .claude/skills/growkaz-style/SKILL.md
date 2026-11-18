---
name: growkaz-style
description: Panduan gaya GrowKaz Stickman untuk video RAKA (stickman 9:16): tampilan sinematik low-key (rim light, struktur gelap-terang, lapisan parallax, latar depan buram, atmosfer), kosakata shot dan proporsinya, tempo (15–25 shot/menit), transisi, grafik tersinkron kata, suara, dan checklist sebelum contact sheet. Pakai saat menulis shot list dan kode adegan (WORKFLOW langkah 5), saat memilih kamera/transisi/grafik, dan sebelum contact sheet.
---

# Gaya GrowKaz untuk RAKA

Baca `brand/gaya-growkaz.md` (ringkasan, skor video kita, resep per babak, checklist) lalu bila perlu `brand/growkaz/style-bible.md` (tampilan lengkap), `engine-api.md` (API), `story-breakdown.md` (tempo), `sound-design.md`, `render-qc.md`. Semua salinan dari plugin resmi di `plugin/GrowKaz_Stickman.plugin`.

## Aturan yang paling sering terlewat
1. 15–25 shot/menit, median 2–3,5 dtk; jumlah shot mengikuti naskah, bukan angka tetap.
2. Rim light di setiap tokoh tersinari; tokoh diposisikan di depan area terang; 60–75% bingkai tengah-gelap.
3. Latar depan buram (`blurLayer` depth 1,5–1,8) di sebagian besar shot menengah; atmosfer dan gerak kamera di setiap shot.
4. Kosakata shot bervariasi: establishing, medium, over-the-shoulder, `bigFace`, insert/macro, top-down, freeze-frame (momen hening, masuk lewat `flash`), 3D, data card. Maks 3 shot berturut-turut sejenis.
5. Pakai helper bawaan `UI.dataCard / compareBars / callout / dimension / meter / bubble`, sinkron `wordTime()`; jangan menggambar kartu datar sendiri.
6. Semua warna dari `mood()` / `S()` / cast; tidak ada warna tertulis di set (grade gaya harus bekerja).
7. Transisi: ≥80% cut; `flash`, `dip`, `whip`, `zoom` dengan makna; letterbox `bars` (`scope` untuk klimaks).
8. Tokoh melakukan aksi (jalan, tulis, tunjuk) dengan kamera mengikuti; jangan rentetan tokoh duduk diam atau kartu.
