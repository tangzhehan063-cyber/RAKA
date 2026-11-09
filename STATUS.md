# STATUS & log kerja (baca ini dulu di sesi baru)

## Posisi terakhir (9 Nov 2026)
- **Video #3 "Gitar di Atas Lemari" (penyesalan, 76% penyesalan = diri ideal yang tak dikejar):** SELESAI: `studio/projects/gitar-di-atas-lemari/out/Gitar_di_Atas_Lemari.mp4` (58,2 dtk, −14,1 LUFS, loop mulus), cover `caption/gitar-di-atas-lemari-cover.png`, caption `caption/gitar-di-atas-lemari.md`. VO lewat koneksi `ElevenLabs-3f8d1d88`, flow `IrW3jlX2lM4Ht8EzQGR4`. Sudah masuk arsip + artifact.
- **Lanjut nanti:** (opsional) render ulang video #1 dan #2 dengan caption zona aman (untuk #2 naikkan readout "PESERTA 29" di s06 dulu), lalu video #4 lewat `WORKFLOW.md`.
- **Penting (pelajaran 9 Nov):** video #2 dan #3 dibuat di dua sesi/cabang berbeda yang tidak saling melihat, sehingga #3 tidak masuk artifact. Di awal sesi: `git fetch origin` dan merge cabang `claude/*` yang belum masuk sebelum kerja.
- **Channel stickman (STYLE RAKA):** video #1 "Hari ke-10" Shorts SELESAI (video, caption, cover). Versi panjang 16:9 belum diproduksi (naskah lengkap di `naskah/hari-ke-10.md`).
- **Video #2 (stickman):** "Jam Tiga Pagi" (overthinking, 91% kekhawatiran tidak terjadi, LaFreniere & Newman 2020) SELESAI: video `studio/projects/jam-tiga-pagi-shorts/out/`, caption `caption/jam-tiga-pagi-shorts.md`, cover `caption/jam-tiga-pagi-shorts-cover.png`.
- **Channel pengetahuan** dipindah ke repo `Channel-Penjelasan` (8 Nov 2026).

## Cara kerja (WAJIB, hemat token)
- Ikuti `WORKFLOW.md` + `tools/produksi.sh` (init/timeline/shots/sheet/stills/final/qc/cover). Shot list ditulis di `story/shots.tsv`.
- Arsip semua artifact: `arsip/README.md`. Halaman artifact Claude (arsip + workflow): slug `40b5677b-fc79-4023-83fe-457a59db2581`, https://claude.ai/artifact/8zT2UTpuoXUQ3wsdwNvjQC . Setiap video baru: buat pratinjau di `arsip/halaman/` lalu republish (publish_files dengan slug + base_version terakhir).

## Preferensi user (penting)
- Caption & teks penting WAJIB di zona aman TikTok (tidak tertutup tombol kanan/deskripsi bawah).
- Bahasa Indonesia. Suka saran "out of the box".
- Setelah video selesai: SELALU caption + cover.
- Tahap ide: selalu riset tren (ScrapeMedsos) + saran improvisasi topik.
- Setelah ACC naskah final: kirim caption + komentar pertama berbahasa manusia (hasil scrape sosmed), bukan gaya AI.
- Setiap video berdiri sendiri; konsisten di DNA/style, bukan kelanjutan cerita.

## Lingkungan
- ElevenLabs: koneksi pertama (`ElevenLabs`) kena antrean gratis; pakai `ElevenLabs-3f8d1d88` (akun sudah upgrade, 9 Nov 2026).
- Network: `elevenlabsusercontent.com` sudah diizinkan di environment Default. huggingface diblokir (jangan pakai Whisper).
- ScrapeMedsos: ±45 kredit tersisa per 9 Nov 2026.
- Container baru: `./setup.sh` (studio, remotion-3d). Render butuh `CHROMIUM_PATH=/opt/pw-browsers/chromium`.

## Log
- 9 Nov 2026: cabang sesi Jam Tiga Pagi dan Gitar di Atas Lemari digabung; Gitar jadi video #3; arsip + artifact diperbarui; captions() menerima dua gaya opsi (x/cx, maxW pecahan/piksel).
- 9 Nov 2026: video #3 diproduksi end-to-end (user ACC semua lalu istirahat): VO, Scribe, set kamar+lemari+gitar, SFX pluck baru, CC zona aman, cover.
- 9 Nov 2026: riset tren TikTok "penyesalan terbesar" + draft naskah video #3 (penyesalan).
- 8 Nov 2026: feedback user: caption video #2 tertutup tombol TikTok. Caption dipindah ke zona aman (y 0,66 H, x 60–870), cek otomatis `tools/safezone.py` di `produksi.sh sheet/stills`. Video #2 yang sudah jadi masih versi lama.
- 8 Nov 2026: workflow hemat token: `WORKFLOW.md`, `tools/produksi.sh`, `tools/shots_tsv.py`, `tools/scrape_ringkas.py`; arsip + halaman artifact; `__pycache__` di-ignore; "jam tiga" otomatis jadi "jam 3".
- 8 Nov 2026: video #2 Jam Tiga Pagi diproduksi. Set baru `kamar.js` (jam digital, meja+lampu, kertas ketakutan, tokoh bayangan "Si Ramalan") bisa dipakai ulang. Catatan: free ElevenLabs kadang "busy" (TTS hanya 1 take, Scribe perlu dicoba ulang beberapa kali, tidak ditagih).
- 8 Nov 2026: riset tren video #2. Sinyal kuat: animasi "prokrastinasi memindahkan stres ke malam terakhir" (15,7 jt views, 2,2 jt likes), "overthinking jam 3 pagi" (3 jt), "niat scroll 5 menit jadi 30 menit" (1,2 jt), "procrastinator vs planner" (1–1,9 jt, banyak akun ID), "capek mikirin penilaian orang" (1,8 jt).
- 8 Nov 2026: bagian channel pengetahuan dipindah ke repo Channel-Penjelasan.
- 8 Nov 2026: setup Remotion+three.js, plugin GrowKaz, video Hari ke-10, repo RAKA (privat), style pengetahuan + otak 3D prosedural, alur naskah dari storyboard origami, riset ide #5.
