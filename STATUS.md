# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (20 Nov 2026, #16 selesai)
- **Video #16 "Kalau–Maka" SELESAI (20 Nov)**: implementation intentions (Gollwitzer & Brandstätter 1997: 71% vs 32%, angka via tinjauan Parks-Stamm dkk., belum dicek di teks asli; Gollwitzer & Sheeran 2006; tinjauan 2024 efek lebih kecil, disebut jujur di VO). VERSI PANJANG 129,8 dtk (2:10), 9:16, 40 shot, −14,6 LUFS, palet ARCTIC (dipilih user dari clay/arctic/lembut). Alur GrowKaz asli: cold-open freeze, title card, eskalasi, twist riset blueprint, shot 3D jembatan, hening teks diketik, aksi (lari parallax), end screen. Tokoh Bayu; momen khas jurang NIAT/AKSI + jembatan papan. VO Gemini Charon (Claude via API atas permintaan user; hening 2,5 dtk @91,4-95,0). Drive `16 - Kalau Maka` (id 1SmfWyJRpBecpWPG6sHYW_QlWZxFDjLfc): cover, caption, naskah, VO mp3. Arsip + artifact diperbarui. Caption tanpa riset bahasa (kredit ScrapeMedsos 0).
- **Cara kerja baru (user 20 Nov)**: tiap langkah user diberi pilihan BERURUT lewat AskUserQuestion (topik, durasi, mesin VO, palet, ACC sheet), dengan rekomendasi. Gaya "GrowKaz asli" = cara stickman beraksi + alur cerita (cold-open, title card, eskalasi, twist, segmen sains, end screen), bukan meniru Grok.
- Pelajaran: (1) render 130 dtk × 40 shot ±10 mnt (WORKERS=nproc-1). (2) Pita caption y≈1300–1400 dan zona bawah y>1480: periksa label/figur/sepatu di semua shot sebelum sheet (banyak yang jatuh di situ). (3) `tangan()` raksasa di `_util.js`: pena pakai `penTangan` supaya ujung pena tepat di teks. (4) Sisa kecil: label MAHASISWA (s18) sedikit menimpa kaki figur, label NIAT (s16) mepet tepi kiri. (5) `produksi.sh init` masih menimpa style ke emerald; atur config manual.
- **Berikutnya**: video #17 (gaya dasar BUKAN arctic; isi kredit ScrapeMedsos; mulai lagi dengan langkah berurutan: topik, durasi, mesin VO, palet, sheet).

## Catatan lintas repo (19 Nov 2026): Channel-Penjelasan versi panjang (hasil diskusi, belum dikerjakan)
- User tanya apakah Channel-Penjelasan bisa dibuat panjang (2-3 mnt) seperti RAKA #15. Jawaban: bisa. Repo itu BUKAN dari nol: 23 video, kit `remotion/src/kit/` (`<Penjelasan>`, kamera isometrik, objek prosedural), template `v08`/`v14`, gerbang checklist, `cek-sutradara`/`cek-gerak`, render per potongan 15 dtk.
- Yang perlu diputuskan/disesuaikan sebelum mulai: (1) `STATUS.md` repo itu mencatat keputusan user 12 Nov "Fakta Rumah tetap 50-60 dtk", sedangkan `WORKFLOW.md` menulis "fleksibel, naik bertahap": tegaskan mana yang berlaku; (2) ambang `cek-sutradara` (hook ≤4 dtk, ritme, jeda SFX) dibuat untuk video pendek; (3) render 3D tanpa GPU ±25 mnt per 60 dtk, jadi 2,5 mnt ≈ 1 jam+; (4) #23 punya 57% frame diam, di video panjang terasa lambat; (5) komposisi semua 1080x1920 (16:9 butuh tata letak baru; Shorts setahu saya kini sampai 3 mnt, cek dulu).
- Saran: video percobaan 2 mnt memakai pola #23 (satu mekanisme, satu garis waktu objek, kamera berganti, 3 tahap alami), bukan banyak objek baru.
- Dikerjakan di chat terpisah untuk repo itu (aturan: satu chat = satu repo). Repo itu hanya di-clone untuk dibaca, tidak diubah.

## Catatan penutup sesi (19 Nov 2026, #15 selesai)
- **Video #15 "Terlanjur" SELESAI (19 Nov)**: VERSI PANJANG 157,8 dtk (2:38, permintaan user: seperti video Grok ±5 mnt, target 2-3 mnt), 9:16, 46 shot, −14,3 LUFS, palet PAPER (dipilih user dari clay/paper/arctic). Sunk cost pada jurusan kuliah: Arkes & Blumer 1985 (tiket teater Ohio) + NCES Data Point 2018-434 (±30% ganti jurusan dalam 3 tahun, data AS). Format baru: 3 kartu bab bernomor (YANG SUDAH DIBAYAR / KATA ORANG / YANG BELUM DIBAYAR). VO Gemini Charon dibuat Claude via API (model `gemini-3.1-flash-tts-preview`, karena `2.5-flash-tts` kena kuota 429; dua potongan teks disambung + hening 2,5 dtk @ ±111 dtk). Drive `15 - Terlanjur` (id 1bCkgO9rFQioYgtmYBXRWN3oGhMb1jcdP): cover, caption, naskah, VO mp3. Arsip + artifact diperbarui. Caption tanpa riset bahasa (ScrapeMedsos kredit 0).
- Pelajaran: (1) "tembok" diktat bata terbaca sebagai tembok; user minta tumpukan buku sungguhan, jadi `_util.js` punya `tumpukan()` (punggung buku, label, sisi halaman). (2) Render 158 dtk ×46 shot di 4 core = ±19 mnt (WORKERS=3). (3) `ui.cream/gold` gelap di palet paper: untuk teks di latar hitam pakai warna tetap. (4) `produksi.sh init` masih menimpa style ke emerald; atur `config.json` manual (fadeIn 0, fadeOut 0.3, style). (5) Teks angka di TTS: "tahun seribu sembilan ratus..." terbaca benar. (6) `Arkes & Blumer`: angka diskon ($13/$8) hanya implikasi dari diskon $2/$7; bar grafik tanpa angka.
- **Berikutnya**: video #16 (gaya dasar BUKAN paper; isi kredit ScrapeMedsos; format panjang 2-3 mnt boleh diulang bila user minta).

## Catatan penutup sesi (18 Nov 2026)
- Semua pekerjaan #10–#13 sudah di `main` (PR #25–#30). Sesi baru: mulai dari `main`, baca file ini, lalu minta topik #14 ke user.
- #14: gaya dasar BUKAN lavender; user memilih palet lewat `produksi.sh palet`; tanya mesin VO (Gemini/ElevenLabs) dulu; pakai `brand/gaya-growkaz.md` §6 dan §9. Opsi: satu shot 3D (belum pernah dipakai di #13).
- Terbuka: kredit ScrapeMedsos 0 (riset bahasa caption belum dilakukan #10–#13); `cek-sutradara` belum memeriksa aturan GrowKaz.
- Channel-Penjelasan: user ingin kit + panduan gaya ala GrowKaz (rencana ada di STATUS repo itu).

## Posisi terakhir (19 Nov 2026, #14 selesai)
- **Video #14 "Bahan Bakar" SELESAI (19 Nov)**: ide dari user (diremehkan, hinaan jadi bahan bakar). Underdog effect: Nurmohamed 2020 (AMJ): efek hanya jalan bila peremeh dinilai tidak kredibel; Xue dkk. 2022 (pedang bermata dua). 74,2 dtk, −14,2 LUFS, 22 shot, palet INDIGO (dipilih user dari ember/indigo/clay), 2D penuh. VO Gemini (Charon, dibuat Claude via API atas permintaan user; hening 1 dtk disisipkan @54,2 dtk). Drive `14 - Bahan Bakar` (id 1pFJMWSiqvdJLrtnbC8as3BGrvBRud5ax): cover, caption, naskah, VO mp3. Arsip + artifact diperbarui. Caption tanpa riset bahasa (kredit ScrapeMedsos 0). Pelajaran: judul papan >8 huruf di size 150 terpotong (dikecilkan ke 118); kursi wajib digambar bila tokoh duduk di meja; render ulang potongan lewat `render.mjs --from/--to` lalu sambung ffmpeg + `mix.py`. Bug `produksi.sh init`: baris komentar menelan `json.dump`, jadi style/fadeIn di config.json harus diatur manual.
- **Berikutnya**: video #15 (mulai dari ide; gaya dasar BUKAN indigo; isi kredit ScrapeMedsos).

## Posisi sebelumnya (18 Nov 2026, #13 selesai)
- **Video #13 "Satu Kritik Terngiang" SELESAI (18 Nov)**: bias negatif (Baumeister dkk. 2001; Rozin & Royzman 2001), 60,9 dtk, −14,5 LUFS, 22 shot, palet LAVENDER (dipilih user), gaya GrowKaz penuh (satu ruang rapat kaya detail `sets/rapat.js` dipakai berulang, insert tangan raksasa, gelembung komentar, blueprint bar, freeze-frame hening, jalan parallax). VO ElevenLabs (eleven_v4, voice Ghaisan vLsH4ENK3zGpAuW1lSh4, 1 take 947 kredit, flow h1sICrpYHnqDKsTq4oIj; hening 1,2 dtk disisipkan di audio @39,2 dtk). Drive folder `13 - Satu Kritik Terngiang` (id 1wumvsmNZc-X_KpssANxLZ6hMQgQjZE2x). Arsip + artifact diperbarui. Caption tanpa riset bahasa (ScrapeMedsos kredit 0). Rasio Gottman 5:1 sengaja tidak dipakai (sekunder). Shot 3D belum dipakai di #13 (hanya 2D).

## Posisi sebelumnya (18 Nov 2026)
- **Berikutnya**: video #14 (mulai dari ide; gaya dasar BUKAN lavender; isi kredit ScrapeMedsos untuk riset bahasa; pakai checklist `brand/gaya-growkaz.md` §6 dan pelajaran §9).
- **Panduan GrowKaz (18 Nov)**: plugin ternyata berisi panduan resmi (style bible dst.) yang belum terpasang. Disalin ke `brand/growkaz/`, ringkasan RAKA + skor video #9–#12 + checklist di `brand/gaya-growkaz.md`, skill `growkaz-style`. **Keputusan user (18 Nov): CAMPUR**: warna fleksibel menurut tema/masalah, identitas channel = style kit; video dibuat dengan panduan GrowKaz + skill yang sudah dibangun (lihat `brand/gaya-growkaz.md` §8). Temuan: selalu 19 shot, tak pernah flash/whip/zoom/bars/freeze/OTS, helper UI bawaan tak terpakai, latar depan buram minim.
- **Video #12 "Lupa Itu Wajar" SELESAI (18 Nov)**: kurva lupa (replikasi Murre & Dros 2015 atas Ebbinghaus; Cepeda dkk. 2006: belajar berjeda lebih awet), 69,6 dtk, −14,4 LUFS, 19 shot + 1 shot 3D kartu catatan, gaya ARCTIC (dipilih user lewat `produksi.sh palet`). Adegan dibuat gaya GrowKaz: tokoh berjalan (walkPose), kamera mengikuti, parallax street (`sets/street.js`), ruang ujian, kamar masuk-berjalan. VO Gemini (Charon, dibuat Claude). Drive folder `12 - Lupa Itu Wajar` (id 16B4ShZNB8M5UGM3n61AhMadYa3FqexxC): cover, caption, naskah, VO. Arsip + artifact diperbarui. Caption tanpa riset bahasa (ScrapeMedsos kredit 0). Bug: konversi angka "1880-an" jadi "1808 puluhan" di timeline (perbaiki words.json sebelum `timeline`).

## Posisi sebelumnya (17 Nov 2026)
- **Video #11 "Keranjang Kosong" SELESAI (17 Nov)**: choice overload (Iyengar & Lepper 2000; hasil studi lain campur, VO menyebutnya), kasus belanja skincare/pelembap, 76,3 dtk, −14,3 LUFS, 19 shot + 1 shot 3D meja selai, gaya lembut. VO Gemini (Charon, dibuat Claude atas pilihan user). Drive folder `11 - Keranjang Kosong` (id 1kR1Ykf0GBnXvmgmeLmM-PEpCcEc0kz0D): cover, caption, naskah, VO. Arsip + artifact diperbarui. Caption tanpa riset bahasa (ScrapeMedsos kredit 0). Keranjang = HUD pojok kanan atas (aman dari tombol TikTok); laptop menghadap penonton seperti #9.
- **Formula validasi terbukti (user 17 Nov)**: #9 dan #10 banyak disukai; terapkan ke banyak kasus lain (`brand/formula.md`, ide cadangan di sana). **Berikutnya**: video #13 (mulai dari ide; isi kredit ScrapeMedsos untuk riset bahasa). Gaya dasar #13 BUKAN arctic; adegan gaya GrowKaz (tokoh bergerak, parallax) jadi standar baru (user 18 Nov).
- **Warna = ikut TEMA video (user 17 Nov)**, bukan wajib per adegan. Per adegan hanya untuk pergeseran emosi besar (maks 2–3 palet per video, aturan `cek-sutradara`).
- **Gaya visual (user 17 Nov)**: gaya dasar BERGANTI tiap video (bukan lembut terus); lihat aturan di `brand/palet-emosi.md`. #12 jangan lembut. Set di kode (`01_*.js`) memakai warna pastel tetap, jadi untuk gaya lain gunakan token mood/style, bukan warna tertulis.
- Catatan teknis: set kamar/pantri bisa dipakai ulang (`studio/projects/*/scenes/shots/01_*.js`); wall layer harus dibuat lebih tinggi dari lantai (celah parallax = garis hitam); jangan pakai `rm` dengan wildcard (diblokir).

## Posisi sebelumnya (16 Nov 2026)
- **Gaya rumah `lembut`** (terang pastel, tanpa neon, tokoh 3D tanpa garis tepi bercahaya lewat `outline3D: false` di `studio/engine/three-kit.js`) jadi default proyek baru (`produksi.sh init`). Diuji lewat still video #8 (salinan tanpa style per shot); user ACC. Video #1–#9 tidak berubah. Belum: warna set masih tertulis langsung di kode set (sofa, lantai, pintu), bentuk benda belum diperhalus, caption belum diubah.
- **Skill `sutradara`** + `tools/cek-sutradara.py` + `tools/cek-visual.py` sudah di main (PR #20).
- **Engine tetap GrowKaz** (user 14 Nov): uji Remotion + three.js untuk RAKA ditolak; jangan pindah engine.
- **Aturan merge (16 Nov)**: setiap video selesai → PR ke main → Claude langsung merge sendiri.
- **Video #10 "Bolos Sekali" SELESAI (16 Nov)**: what-the-hell effect (Herman & Mack 1975), 62,8 dtk, −14,1 LUFS, 19 shot + 1 shot 3D meja, gaya lembut. VO Gemini (Charon, dibuat Claude atas permintaan user). Drive folder `10 - Bolos Sekali` (id 1HFUg0tdibRI7HyRPUBb2EMls9_xo_VYj): cover, caption, naskah, VO mp3. Arsip + artifact diperbarui. Catatan: riset bahasa caption belum (ScrapeMedsos kredit 0). Bug celah dinding-lantai (garis hitam) di set pantri sudah diperbaiki sebelum render final. Formula topik "validasi" dicatat di `brand/formula.md`.

## Posisi sebelumnya (14 Nov 2026)
- **Video #9 "Skripsi Dua Minggu" SELESAI (14 Nov)**: planning fallacy (Buehler 1994), 82,8 dtk, −14,0 LUFS, 19 shot + 1 shot 3D. VO Gemini (Charon) dibuat Claude atas permintaan user. MP4 dikirim ke user (33 MB); Drive folder `09 - Skripsi Dua Minggu` (id 1vFyVkw55SFHZsWJXxERQdXc-TjdOqf_m) berisi cover, VO, caption, naskah. Bug s11 (stempel menabrak angka) diperbaiki dengan render ulang potongan 42,7–47,5 dtk lalu disambung. Arsip + artifact diperbarui. PR https://github.com/tangzhehan063-cyber/RAKA/pull/22 menunggu merge user (lihat KEPUTUSAN.md).

## Posisi sebelumnya (13 Nov 2026)
- **Palet warna selesai (13 Nov)**: style baru `paper`, `indigo`, `clay`, `lavender` + perbaikan `--style` di `studio/engine/player.js`. Panduan emosi × waktu di `brand/palet-emosi.md` (per adegan lewat `"style"` di shots.json). User ACC arah warna.
- **VO**: hanya tanya user Gemini atau ElevenLabs, lalu berhenti (suara diatur user; channel punya karakter beda). `tools/align_teks.py` ditambahkan.
- **Video #8 "Tas Belum Dilepas" SELESAI RENDER (13 Nov)**: hibrid 2D+3D, 82 dtk, -14,1 LUFS, MP4 dikirim ke user (45 MB), cover + caption + arsip sudah. Render 3D memakan ±29 mnt (WORKERS=nproc-1). Belum ada PR ke main; belum diunggah ke Drive (user). Sebelumnya: naskah draf 2 di-ACC (jam 18:00→19:30), caption draf ada (scrape gagal: kredit habis). VO: user pilih **Gemini TTS** dan mengambil suaranya sendiri; teks TTS siap di `naskah/tas-belum-dilepas.md` (JANGAN buat `naskah/*.txt` di repo: push memicu workflow dengan suara default). Setelah user kirim WAV: `align_teks.py` → timeline → adegan.
- **Berikutnya**: video #10 (mulai dari ide). Isi ulang kredit ScrapeMedsos agar caption bisa riset bahasa.

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
- **Setiap video selesai: arsip + artifact, lalu PR ke `main` dan Claude langsung merge sendiri (aturan user 16 Nov).** User bukan programmer; laporan cukup "sudah masuk main".
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
