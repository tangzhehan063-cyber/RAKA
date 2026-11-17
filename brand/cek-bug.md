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

## #8 Tas Belum Dilepas (13 Nov)
- **Kaki menembus dasar sofa 3D** (tokoh terlihat berlutut di atas "kasur"): sofa harus dangkal (dudukan ±0,6 m), pinggul tokoh di atas dudukan, kaki jatuh di LANTAI DEPAN sofa. Jangan pakai kotak padat menjangkau lantai di bawah kaki.
- **Furnitur dekat kamera orbit menutupi layar** (lampu meja raksasa): taruh benda kecil di sisi jauh dari lintasan kamera.
- **Kamera 3D potret terlalu sempit**: pintu/sofa terpotong. Pakai fov vertikal ±60 dan jarak ±8 m untuk shot lebar; jarak antar objek utama ≤ 4 m.
- **Bayangan dinding samping** menggelapkan pintu: `castShadow = false` untuk dinding samping.
- **Overlay merah di contact sheet bukan bagian video** (zona aman TikTok dari `tools/safezone.py`): kirim ke user versi tanpa overlay (susun `build/sheets/s*_*.png`).
- Kata-kata callout/teks tidak boleh jatuh di pita caption (y≈1290–1400).
- **Teks stempel menabrak angka tiang grafik** (#9 s11): judul/stempel di atas grafik batang harus di luar jangkauan angka tiang tertinggi (dan tiang yang membesar keluar kartu); cek still di detik kata pemicunya, bukan hanya awal shot.

## #10–#11 (16–17 Nov): bug yang lolos dari cek otomatis
- **Celah dinding-lantai = garis hitam** (set pantri/kamar): lapisan dinding (kedalaman 0,45) harus digambar sampai di bawah garis lantai (G + 2 H), kalau tidak parallax membuka celah hitam. Terlihat di contact sheet sebagai garis gelap di bawah meja.
- **Laptop terbalik** (#11): jangan gambar laptop tampak samping dengan engsel di sisi jauh dari tokoh. Pakai laptop menghadap penonton seperti #9 (alas trapesium + layar).
- **Ikon/benda di kolom tombol TikTok** (#11): jangan taruh benda penting di x>870 pada y 860–1560 (area merah di `safe.png`). Penghitung/HUD ditaruh di pojok kanan atas (x≈930, y≈290).
- **HUD menabrak benda lain**: jam dinding, judul layar, dan badge bisa bertumpuk di pojok kanan atas; cek di still penuh pada beberapa zoom.
- **Ukuran benda tidak proporsional** (#10): kotak bekal terlalu besar dibanding tokoh; benda kecil diskalakan ±0,45 dari tokoh dan digambar mirip aslinya (bukan bulatan/kotak).
- **Bentuk "origami" 3D** (#10): kertas kusut dari ikosahedron terlihat berfaset; pakai bola resolusi tinggi dengan normal halus, atau hapus bila tidak perlu.
- **`cek-sutradara` tidak mendeteksi**: kamera bergerak (selalu 0%), palet monoton antar video, objek terlalu kecil. Mata manusia tetap perlu cek `safe.png`.
