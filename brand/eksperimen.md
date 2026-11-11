# Eksperimen moodboard & storyboard (RAKA)
Claude boleh terus meng-improve visual & cara bercerita (izin user 9 Nov 2026). Aturan:
- Tiap video: 1–2 eksperimen baru, DNA video (`brand/dna-video.md`) tetap dipegang.
- Saat kirim sheet ke user, sebutkan eksperimennya dalam 1 kalimat.
- User bilang **suka** → status `DISUKAI` → pindahkan ke `brand/dna-video.md` sebagai baku. User bilang **jangan** → `DITOLAK`, jangan diulang.

| Video | Eksperimen | Status |
|---|---|---|
| #4 Satu Video Lagi | swipe sebagai transisi + jam melompat; blueprint sebagai kartu feed; selimut sebagai item maskot; momen khas: kamar sendiri jadi kartu feed yang ikut ter-swipe; jam dicuri 3 bayangan (bos/dosen/orang lain); arahan sutradara per kalimat (`brand/sutradara.md`) | **DISUKAI: swipe ala feed** (9 Nov, jadi baku di dna-video). Sisanya belum ada respons |
| #3 Gitar di Atas Lemari | 1 shot 3D (gitar) di tengah adegan 2D; SFX genjreng `pluck` sebagai motif bunyi | belum ada respons |
| #2 Jam Tiga Pagi | tokoh bayangan "Si Ramalan" sebagai personifikasi pikiran | belum ada respons |

## Pengembangan swipe (DISUKAI, pakai 1 variasi per video)
- **Swipe yang ditolak:** jempol mencoba swipe tapi layar memantul balik (momen "nggak bisa kabur" dari masalah).
- **Swipe ke samping = pindah akun/sudut pandang:** cerita yang sama dilihat dari orang lain (bos, ibu, teman).
- **Feed yang melambat:** kecepatan swipe makin pelan sepanjang video, berhenti total di titik balik (sunyi).
- **Kartu feed punya "komentar":** satu bubble komentar (teks dari naskah) muncul di kartu fakta, seolah penonton lain bereaksi.
- **Hitungan scroll:** badge pojok menghitung jumlah swipe (12, 47, 128...) sebagai angka cerita.
- **Swipe terbalik di loop:** akhir video swipe ke bawah kembali ke frame 0 (rewind feed).

## Video #5 Nunggu 1 Januari (10 Nov) — menunggu respons user
- **Swipe yang gagal:** kartu "MULAI SEKARANG" ditarik ke atas lalu memantul jatuh (lelucon visual "tapi… nanti").
- **Angka riset sebagai benda fisik:** kalender hitung mundur 52 hari (dipakai di hook, momen khas, dan loop).
- **Dua fakta berantai** (fakta → "tapi ada sisi gelapnya") + durasi naik ke 67 dtk.
- **Item maskot dengan aksi:** spidol merah melingkari 1 Jan, lalu menulis "HARI 1" (bukan sekadar pakaian).
- Momen khas: 52 lembar kalender lepas satu per satu jadi debu emas, freeze "DENGAN SADAR".
- SFX baru di library: `scribble` (spidol) dan `tear` (kertas sobek).

## #6 Dua Orang, Satu Gaji (11 Nov) — menunggu respons/analitik
- **Struktur baru (permintaan user): cerita dulu, penjelasan di akhir.** 0–36 dtk dialog tanpa fakta, twist, lalu narator + riset.
- **Dialog dua suara** (Rafiq = Si Cukup, Abay = Si Kurang), narator Ghaisan baru masuk di twist. VO dibuat per baris lalu digabung (`input/lines.json`), Scribe hanya untuk narator.
- **Warna per adegan** (engine: `set@gaya` di shots.tsv): hangat = ember, dingin = arctic, penjelasan = ember. **Warna CC per pembicara** (`captionSpeakers` di config).
- Momen khas: layar terbelah; garis pembelah melebar jadi layar HP, dua orang menyatu.

## Ide eksperimen berikutnya (belum dicoba)
- Transisi "match cut" benda → benda (mis. jam dinding → roda sepeda) untuk menyambung adegan.
- Satu warna aksen per video selain merah-oranye maskot (palet emosi: biru = sedih, emas = harapan).
- Hook visual tanpa kata 1 detik pertama (aksi tokoh dulu, baru VO).
- Akhir loop dengan kamera yang sama persis di frame pertama & terakhir.
