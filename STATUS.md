# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (14 Nov 2026)
- **Video #9 "Skripsi Dua Minggu" (14 Nov)**: planning fallacy (Buehler, Griffin & Ross 1994: tebakan 34 hari, terburuk 49, nyata 55; ±30% tepat). Naskah draf 2 ACC user (14 Nov), caption draf di `caption/skripsi-dua-minggu-shorts.md`. VO: user pilih **Gemini TTS** dan mengambil suaranya sendiri (teks TTS di naskah; JANGAN buat `naskah/*.txt`). Setelah WAV dikirim: align_teks → timeline → animatic → adegan. Tanpa scrape (kredit 0). Cabang sesi lama sudah digabung.

## Posisi sebelumnya (13 Nov 2026)
- **Palet warna selesai (13 Nov)**: style baru `paper`, `indigo`, `clay`, `lavender` + perbaikan `--style` di `studio/engine/player.js`. Panduan emosi × waktu di `brand/palet-emosi.md` (per adegan lewat `"style"` di shots.json). User ACC arah warna.
- **VO**: hanya tanya user Gemini atau ElevenLabs, lalu berhenti (suara diatur user; channel punya karakter beda). `tools/align_teks.py` ditambahkan.
- **Video #8 "Tas Belum Dilepas" SELESAI RENDER (13 Nov)**: hibrid 2D+3D, 82 dtk, -14,1 LUFS, MP4 dikirim ke user (45 MB), cover + caption + arsip sudah. Render 3D memakan ±29 mnt (WORKERS=nproc-1). Belum ada PR ke main; belum diunggah ke Drive (user). Sebelumnya: naskah draf 2 di-ACC (jam 18:00→19:30), caption draf ada (scrape gagal: kredit habis). VO: user pilih **Gemini TTS** dan mengambil suaranya sendiri; teks TTS siap di `naskah/tas-belum-dilepas.md` (JANGAN buat `naskah/*.txt` di repo: push memicu workflow dengan suara default). Setelah user kirim WAV: `align_teks.py` → timeline → adegan.
- **Berikutnya**: lanjut #8 setelah VO; user juga akan membahas karakteristik animasi.

## Posisi sebelumnya (12 Nov 2026)
- **Hemat ElevenLabs (12 Nov)**: 1 take, hanya naskah final, revisi per kalimat, 1 flow per video; draf suara lewat workflow GitHub Actions "Gemini TTS" (`naskah/*.txt` → `audio/*.wav`, secret `GEMINI_API_KEY`) atau `python3 tools/gemini_tts.py`. Aturan lengkap di CLAUDE.md.
- **Panel Studio (12 Nov)**: kontrol RAKA lewat tab RAKA di https://claude.ai/artifact/4Aiv5HDCLRRfVLdEapvt3s (ACC/revisi per tahap, ide, daftar video, tempat referensi: link/MP4/gambar ≤20 MB). Cara pakai: `WORKFLOW.md` langkah 0.
- **Video #7 "Ditolak Duluan" selesai (12 Nov)**: kalah 1 poin di seleksi kerja (Wang, Jones & Wang 2019), 59 dtk, kerangka baru `brand/kerangka-cerita.md` (Pukulan ke-99: cerita dulu, riset jadi plot twist), momen hening 2 dtk + teks diketik (pengganti bisikan). Ide ditulis tanpa scrape (permintaan user).
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
- **Laporan akhir video (13 Nov): di chat hanya MP4 + link Drive; cover, caption, naskah, suara (mp3) diunggah ke Drive `NN - Judul`** (seperti Channel-Penjelasan). #8: https://drive.google.com/drive/folders/1AAUO9vTfCugFJkTIjTJlrEBYE-1zb3Lc
- **Tanpa bisikan di VO** (12 Nov). Puncak emosi = hening ±1 dtk + teks diketik di layar. Struktur naskah: `brand/kerangka-cerita.md`.
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: arsip + artifact, lalu PR ke `main` dan (merge: lihat `KEPUTUSAN.md`, belum diputuskan; jangan merge sendiri).** User bukan programmer; laporan cukup "sudah masuk main".
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
- 12 Nov: video #7 Ditolak Duluan selesai (17 shot). Bug kursi/tokoh melayang dicatat di cek-bug.md. User tidak suka bisikan di VO.
- 10 Nov: video #5 Nunggu 1 Januari selesai (18 shot, 1 shot 3D spidol). `brand/formula.md` dibuat (tangga durasi + tabel analitik). SFX baru `scribble`, `tear`. ScrapeMedsos tersisa ±7 kredit.
- 9 Nov: video #4 Satu Video Lagi selesai (16 shot, kartu feed + swipe, momen khas kamar jadi kartu feed, 1 shot 3D teras). VO bisa diunduh langsung dari ElevenLabs (`creative_get_generations` → full_res_url → curl). `produksi.sh final` kini memanggil QC dengan path absolut.
- 9 Nov: Motion-videos dijadikan sutradara (`brand/sutradara.md`); naskah #4 begadang ditulis.
- 9 Nov: skill `remotion-fitur` + paket `@remotion/transitions`, `motion-blur`, `effects` di `remotion-3d/` (sama seperti Channel-Penjelasan; belum dipakai di video).
- 9 Nov: workflow dirapikan (distribusi: arsip + artifact + PR); STATUS diringkas; daftar cek bug `brand/cek-bug.md`; CC baku diturunkan ke 0,70 H.
- 9 Nov: cabang Jam Tiga Pagi & Gitar digabung; Gitar jadi #3; artifact arsip diperbarui.
- 9 Nov: video #3 Gitar di Atas Lemari diproduksi end-to-end (set kamar+lemari+gitar, SFX pluck).
- 8 Nov: workflow hemat token (`WORKFLOW.md`, `tools/produksi.sh`, `shots_tsv.py`, `scrape_ringkas.py`); arsip + artifact.
- 8 Nov: video #2 Jam Tiga Pagi (set `kamar.js` bisa dipakai ulang); feedback CC tertutup tombol TikTok → zona aman.

## Stick.Tales ("What If") — dipindah 11 Nov
Seri berbahasa Inggris ini sekarang punya repo sendiri: `tangzhehan063-cyber/what-if`. Di repo RAKA hanya tersisa tambahan engine yang aman: style `flat`/`imperial`, font Cinzel, dan opsi `font`/`weight` di `captionStyle`.
