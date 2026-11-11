# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (11 Nov 2026)
- **Video #6 "Dua Orang, Satu Gaji" selesai (11 Nov)**: perbandingan sosial (Luttmer 2005), 74 dtk, format DIALOG (2 suara) + narator di akhir, warna per adegan (ember/arctic). PR https://github.com/tangzhehan063-cyber/RAKA/pull/13. Menunggu ACC user untuk merge.
- **Cara kerja baru (permintaan user 11 Nov): langkah demi langkah, minta review di tiap tahap** (naskah → caption+suara → VO → contact sheet → render → distribusi). Cerita dulu, penjelasan di akhir. Warna jangan hanya hijau-gelap; kombinasikan gaya GrowKaz (ember, arctic, sakura, retro).

- **Video #1–#4 Shorts selesai** (video, caption, cover, arsip + artifact https://claude.ai/artifact/8zT2UTpuoXUQ3wsdwNvjQC):
  #1 "Hari ke-10" (kebiasaan, 66 hari) · #2 "Jam Tiga Pagi" (overthinking, 91%) · #3 "Gitar di Atas Lemari" (penyesalan, 76%) · #4 "Satu Video Lagi" (begadang, 6 jam × 14 malam ≈ 2 malam tanpa tidur). Lokasi file: `arsip/README.md`.
- **Video #5 "Nunggu 1 Januari" selesai (10 Nov)**: fresh start effect, 67 dtk (tangga durasi naik, lihat `brand/formula.md`), eksperimen swipe gagal + kalender hitung mundur + spidol merah. Menunggu respons user & data analitik.
- **User akan mengirim video referensi** (10 Nov) di sesi Claude Code ini: lebih baik upload MP4 (bedah per frame, tanpa kredit); link TikTok/YT = transkrip+komentar saja (±1–2 kredit). Analisis → `brand/formula.md`, terapkan ke #6.
- **Video berikutnya: #6** (target ±75 dtk bila retensi #5 aman). Cadangan ide: membandingkan diri (4,8 jt view, 8 rb komentar), "tiba-tiba rajin nyapu".
- (lama) Video berikutnya: #5 lewat `WORKFLOW.md` (mulai langkah 1, riset tren TikTok → 10 ide). **Swipe ala feed DISUKAI user** (baku di `brand/dna-video.md`); tiap video pakai 1 variasi swipe baru dari daftar di `brand/eksperimen.md`. Usulan untuk #5: "swipe yang gagal" (layar memantul balik). Respons user soal selimut & kamar-jadi-kartu-feed belum ada.
- Opsional: render ulang #1–#3 dengan posisi CC baru (untuk #2 pindahkan readout "PESERTA 29" di s06; untuk #3 pindahkan "PESERTA RATUSAN" dari pita CC). Versi panjang 16:9 #1 belum diproduksi (`naskah/hari-ke-10.md`).
- Channel pengetahuan ada di repo `Channel-Penjelasan`.

## Preferensi user
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: arsip + artifact, lalu PR ke `main` dan Claude langsung merge sendiri (izin user 9 Nov).** User bukan programmer; laporan cukup "sudah masuk main".
- **Moodboard & storyboard boleh terus di-improve Claude** (izin user 9 Nov): tiap video coba 1–2 eksperimen visual/cerita baru, catat di `brand/eksperimen.md`. Yang user bilang "suka" → jadi baku di `brand/dna-video.md`.
- **Posisi CC baku (ACC 9 Nov): pusat y=1344 (0,70 H)**, default engine, jangan diubah. Teks penting di zona aman TikTok.
- Bahasa Indonesia, sederhana. Suka saran "out of the box".
- Tahap ide: riset tren (ScrapeMedsos TikTok) + saran improvisasi topik.
- Kirim MP4 final apa adanya (kualitas & ukuran asli, jangan dikompres ulang). Video #4 sempat tidak bisa dibuka di HP karena internet user lambat, bukan masalah file (9 Nov).
- **Caption TikTok ≤150 karakter, to the point, memancing debat** (9 Nov). Komentar pin juga memancing pilih pihak.
- Setelah ACC naskah: caption + komentar pertama berbahasa manusia (hasil scrape), bukan gaya AI. Setelah video: SELALU caption + cover.
- Setiap video berdiri sendiri; konsisten di DNA/style, bukan kelanjutan cerita.

- **Motion-videos = sutradara (permintaan user 9 Nov):** aturannya di `brand/sutradara.md`, dipakai tiap video. Naskah & karakter tetap gaya lama; formula terus dicari dan diukur.

## Lingkungan
- ElevenLabs: pakai koneksi `ElevenLabs-3f8d1d88` (akun upgrade); koneksi `ElevenLabs` kena antrean gratis.
- `elevenlabsusercontent.com` diizinkan di sesi lama, tapi DITOLAK (403) di sesi Claude chat 9 Nov; hasil Scribe tetap bisa dibaca lewat tool ElevenLabs. Huggingface diblokir (jangan pakai Whisper).
- ScrapeMedsos ±7 kredit (10 Nov).
- Container baru: `tools/produksi.sh setup`. Render butuh `CHROMIUM_PATH=/opt/pw-browsers/chromium` (sudah diatur di skrip).

## Log (5 terakhir; lebih lama lihat `git log`)
- 10 Nov: video #5 Nunggu 1 Januari selesai (18 shot, 1 shot 3D spidol). `brand/formula.md` dibuat (tangga durasi + tabel analitik). SFX baru `scribble`, `tear`. ScrapeMedsos tersisa ±7 kredit.
- 9 Nov: video #4 Satu Video Lagi selesai (16 shot, kartu feed + swipe, momen khas kamar jadi kartu feed, 1 shot 3D teras). VO bisa diunduh langsung dari ElevenLabs (`creative_get_generations` → full_res_url → curl). `produksi.sh final` kini memanggil QC dengan path absolut.
- 9 Nov: Motion-videos dijadikan sutradara (`brand/sutradara.md`); naskah #4 begadang ditulis.
- 9 Nov: skill `remotion-fitur` + paket `@remotion/transitions`, `motion-blur`, `effects` di `remotion-3d/` (sama seperti Channel-Penjelasan; belum dipakai di video).
- 9 Nov: workflow dirapikan (distribusi: arsip + artifact + PR); STATUS diringkas; daftar cek bug `brand/cek-bug.md`; CC baku diturunkan ke 0,70 H.
- 9 Nov: cabang Jam Tiga Pagi & Gitar digabung; Gitar jadi #3; artifact arsip diperbarui.
- 9 Nov: video #3 Gitar di Atas Lemari diproduksi end-to-end (set kamar+lemari+gitar, SFX pluck).
- 8 Nov: workflow hemat token (`WORKFLOW.md`, `tools/produksi.sh`, `shots_tsv.py`, `scrape_ringkas.py`); arsip + artifact.
- 8 Nov: video #2 Jam Tiga Pagi (set `kamar.js` bisa dipakai ulang); feedback CC tertutup tombol TikTok → zona aman.

## Seri baru Stick.Tales ("What If", 11 Nov) — DIJEDA, menunggu referensi user
- Video 1: "The Curse of Being the Emperor's Firstborn" (EN, Tiongkok kuno, caption Inggris, watermark STICK.TALES). VO 2:28 di `seri-whatif/the-emperors-firstborn/vo.mp3`, moodboard v1 + contact-sheet-v1.png di folder yang sama.
- Proyek: `studio/projects/emperor-shorts/` (style `imperial`, caption Cinzel via `captionStyle`). Timeline = perkiraan silencedetect (`seri-whatif/tools/align_silence.py`), belum Scribe.
- User menilai v1 banyak error. Bug diketahui: tokoh terlalu kecil; s10 split kelas/taman salah; anak di taman melayang; s11 pedang = belati & tak dipegang; s01 judul dobel dgn caption; s05 wajah kaisar harus tertutup bayangan.
- Lanjut: user kirim screenshot referensi video "what if" stickman (+ catatan gaya) → buat moodboard v2 (palet, desain tokoh, 4–6 frame kunci) → ACC → ulang 21 shot.
- 11 Nov (lanjutan): gaya diganti ke referensi (kepala besar + hanfu, istana terang, style `flat`, caption Fredoka maks 2 kata y=1380). Rig `scenes/chibi.js` (IK tangan `{to:[x,y]}`), set `scenes/sets/palace.js`, 21 shot di `scenes/shots/01_cerita.js`. VIDEO SELESAI (148,45 dtk, −14,8 LUFS): `studio/projects/emperor-shorts/out/`, cover + caption di `caption/emperor-firstborn-stick-tales*`. Render penuh ±28 mnt (3 worker, ~1 fps/worker; latar blur di-cache).
