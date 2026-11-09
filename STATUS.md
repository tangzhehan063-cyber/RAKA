# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (9 Nov 2026)
- **Video #1–#3 Shorts selesai** (video, caption, cover, arsip + artifact https://claude.ai/artifact/8zT2UTpuoXUQ3wsdwNvjQC):
  #1 "Hari ke-10" (kebiasaan, 66 hari) · #2 "Jam Tiga Pagi" (overthinking, 91%) · #3 "Gitar di Atas Lemari" (penyesalan, 76%). Lokasi file: `arsip/README.md`.
- **Video berikutnya: #4** lewat `WORKFLOW.md` (mulai langkah 1, riset tren TikTok).
- Opsional: render ulang #1–#3 dengan posisi CC baru (untuk #2 pindahkan readout "PESERTA 29" di s06; untuk #3 pindahkan "PESERTA RATUSAN" dari pita CC). Versi panjang 16:9 #1 belum diproduksi (`naskah/hari-ke-10.md`).
- Channel pengetahuan ada di repo `Channel-Penjelasan`.

## Preferensi user
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: arsip + artifact, lalu PR ke `main` dan Claude langsung merge sendiri (izin user 9 Nov).** User bukan programmer; laporan cukup "sudah masuk main".
- **Moodboard & storyboard boleh terus di-improve Claude** (izin user 9 Nov): tiap video coba 1–2 eksperimen visual/cerita baru, catat di `brand/eksperimen.md`. Yang user bilang "suka" → jadi baku di `brand/dna-video.md`.
- **Posisi CC baku (ACC 9 Nov): pusat y=1344 (0,70 H)**, default engine, jangan diubah. Teks penting di zona aman TikTok.
- Bahasa Indonesia, sederhana. Suka saran "out of the box".
- Tahap ide: riset tren (ScrapeMedsos TikTok) + saran improvisasi topik.
- Setelah ACC naskah: caption + komentar pertama berbahasa manusia (hasil scrape), bukan gaya AI. Setelah video: SELALU caption + cover.
- Setiap video berdiri sendiri; konsisten di DNA/style, bukan kelanjutan cerita.

## Lingkungan
- ElevenLabs: pakai koneksi `ElevenLabs-3f8d1d88` (akun upgrade); koneksi `ElevenLabs` kena antrean gratis.
- `elevenlabsusercontent.com` diizinkan; huggingface diblokir (jangan pakai Whisper).
- ScrapeMedsos ±45 kredit (9 Nov).
- Container baru: `tools/produksi.sh setup`. Render butuh `CHROMIUM_PATH=/opt/pw-browsers/chromium` (sudah diatur di skrip).

## Log (5 terakhir; lebih lama lihat `git log`)
- 9 Nov: workflow dirapikan (distribusi: arsip + artifact + PR); STATUS diringkas; daftar cek bug `brand/cek-bug.md`; CC baku diturunkan ke 0,70 H.
- 9 Nov: cabang Jam Tiga Pagi & Gitar digabung; Gitar jadi #3; artifact arsip diperbarui.
- 9 Nov: video #3 Gitar di Atas Lemari diproduksi end-to-end (set kamar+lemari+gitar, SFX pluck).
- 8 Nov: workflow hemat token (`WORKFLOW.md`, `tools/produksi.sh`, `shots_tsv.py`, `scrape_ringkas.py`); arsip + artifact.
- 8 Nov: video #2 Jam Tiga Pagi (set `kamar.js` bisa dipakai ulang); feedback CC tertutup tombol TikTok → zona aman.
