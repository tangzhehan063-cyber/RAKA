# Daftar cek bug visual RAKA (WAJIB sebelum render final)
Dicatat dari bug nyata di dua channel (RAKA & Channel-Penjelasan). Cek setiap poin di `produksi.sh sheet` (overlay `safe.png`) sebelum `final`. Tambahkan bug baru di sini begitu ditemukan.

## Caption & teks
1. **Posisi CC baku (ACC user 9 Nov): pusat y=1344 (0,70 H), x=475, lebar maks 0,74 W, maks 3 kata.** Sudah jadi default engine; jangan diubah per video. Video #2 pernah tertutup tombol TikTok karena CC terlalu ke kanan/bawah.
1b. **Pita CC (y ≈ 1300–1390) harus kosong dari teks adegan.** Readout/label di adegan jangan diletakkan di pita ini (9 Nov: setelah CC diturunkan, readout "PESERTA RATUSAN" di board video Gitar tertimpa CC).
2. **Teks penting di zona merah `safe.png`** (bawah y>1480, kanan x>880 pada y 860–1560, atas y<150). Video #2: readout "PESERTA 29" di s06 kena zona.
3. **Teks/stiker tertutup elemen lain** (judul, badge, tokoh). Elemen kunci beat harus terlihat jelas (Channel-Penjelasan #8: matahari & awan tertutup judul).
4. **Teks keluar layar atau bertumpuk** (stempel besar terpotong, label menimpa label lain). Pakai `nowrap` + ukuran font yang muat; beri ruang tetap untuk label.
5. **Emoji** tidak tampil di Chromium container → jangan pakai emoji di teks layar.

## Objek & tokoh
6. **Bagian set menembus bagian lain** (Channel-Penjelasan #8: segitiga atap menembus genteng). Cek dari sudut kamera yang dipakai.
7. **Kamera/framing terlalu dekat**: tokoh & objek utama tidak terpotong tepi.
8. **Ekspresi alis**: `worried` vs `angry` pernah tertukar di `rig2d.js` (sudah diperbaiki); cek ekspresi sesuai emosi kalimat.

## Proses
9. Render final **setelah** user melihat sheet; kalau ada revisi saat render jalan, matikan prosesnya sampai benar-benar mati (`pgrep -fa render` kosong, `kill -9 <pid>` bila perlu).
10. **Awal sesi:** `git fetch origin` + merge cabang `claude/*` yang belum masuk (video #2 & #3 pernah dibuat di dua cabang terpisah sehingga nomor bentrok dan artifact arsip tidak terupdate).
11. **Setelah video selesai:** caption + cover + baris `arsip/README.md` + pratinjau `arsip/halaman/` + republish artifact arsip.
