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

7a. **Remotion 3D (`remotion-3d/`): gerak tidak dari `useCurrentFrame()`** (`useFrame()` r3f, animasi bawaan model/shader, `Math.random()` tanpa seed) → flicker saat render. `<Sequence>` di dalam `<ThreeCanvas>` wajib `layout="none"`. Detail: skill `remotion-fitur`.

## Proses
9. Render final **setelah** user melihat sheet; kalau ada revisi saat render jalan, matikan prosesnya sampai benar-benar mati (`pgrep -fa render` kosong, `kill -9 <pid>` bila perlu).
10. **Awal sesi:** `git fetch origin` + merge cabang `claude/*` yang belum masuk (video #2 & #3 pernah dibuat di dua cabang terpisah sehingga nomor bentrok dan artifact arsip tidak terupdate).
11. **Setelah video selesai:** caption + cover + baris `arsip/README.md` + pratinjau `arsip/halaman/` + republish artifact arsip.
12. **Tokoh rebahan melayang** (#5): pose `lie` + `rot: -π/2` di set `bedroom.js` harus `y = GY + 40` (di atas kasur), bukan GY − 150. Cek still adegan tidur sebelum render.
13. **Badge pojok kanan atas menabrak benda besar** (#5): kalender/papan besar mulai di y ≥ 380 bila ada badge.
14. **Properti melayang / label kepanjangan** (#6, ditegur user di cover): benda yang dibawa tokoh digambar dari posisi tangan (`pose.hB`), benda di lantai pakai y = kaki tokoh; teks di properti kecil jangan dipakai (terpotong). Cek cover & still sebelum render final.
15. **Gaya `retro` kusam kehijauan** (#6): untuk dunia hangat pakai `ember` (oranye menyala); cek warna di still ukuran penuh, bukan hanya contact sheet kecil.
- Kursi: dudukan harus setinggi pinggul pose sit (72×s), sandaran di belakang pinggul; tokoh sit tidak boleh melayang tanpa kursi/kasur; pose lie+rot melayang, hindari (#7 s03/s06/s15).
