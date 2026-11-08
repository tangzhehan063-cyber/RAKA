# Repo RAKA: channel stickman self-improvement

Repo ini hanya untuk channel stickman (STYLE RAKA). Channel pengetahuan ("fakta rumah", editorial 3D) ada di repo terpisah **`tangzhehan063-cyber/Channel-Penjelasan`**; jangan campur gaya.
**Di awal setiap sesi, baca `STATUS.md`**, lalu kerjakan video dengan `WORKFLOW.md` + `tools/produksi.sh` (hemat token & waktu) (posisi terakhir & preferensi user), dan perbarui `STATUS.md` setiap ada kemajuan.
Aturan umum: Bahasa Indonesia, fakta riset dengan sumber, **caption posting + cover wajib setelah setiap video**.

---

# STYLE RAKA: channel self-improvement berbasis riset

Channel faceless **self-improvement berbasis riset**, bahasa **Indonesia**, gaya **stickman sinematik** (plugin GrowKaz Stickman).
Baca file ini, `brand/dna-video.md` (ciri khas wajib setiap video) dan `brand/brand-kit.md` sebelum membuat konten apa pun.
**Setiap video berdiri sendiri**: topik, cerita, dan tokoh baru. Yang konsisten adalah DNA video (struktur, visual, suara, fakta riset), bukan kelanjutan cerita. Jangan melanjutkan cerita/tokoh video lalu kecuali user meminta. Komunikasi dengan user: Bahasa Indonesia.

## Alur wajib setiap video
1. **Naskah:** pakai alur ScriptForge (`prompts/ScriptForge.pdf`): niche, 10 ide, naskah. Jangan mengarang statistik; sebut sumber dan kata "median"/"perkiraan" bila perlu.
2. **Voiceover:** ElevenLabs, model `eleven_v4`, voice **Ghaisan** `vLsH4ENK3zGpAuW1lSh4`.
   - Di teks TTS, tulis angka sebagai kata ("enam puluh enam"), pakai tag arahan `[calm, slow]`, `[whispering]`, `[warm, building]`.
   - Unduh audio dari `elevenlabsusercontent.com` (host ini harus diizinkan di network environment).
3. **Timestamp:** ElevenLabs Scribe (`creative_add_flow_asset_node` lalu `creative_transcribe_audio`). Unduh `words.json`, lalu:
   `python3 tools/scribe_to_timeline.py <words.json> studio/projects/<slug>/input/script.json`
   `python3 tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.json` (dijalankan dari `studio/`)
   (Whisper/huggingface diblokir di cloud; jangan andalkan.)
4. **Render:** dari `studio/`, selalu dengan `CHROMIUM_PATH=/opt/pw-browsers/chromium`. Cek `--sheet --scale 0.5` dulu, baru render final, lalu `python3 audio/mix.py --project projects/<slug>`.
5. **QC:** durasi, audio ada, −14 LUFS, contact sheet dicek dengan mata.
6. **SELALU buat caption posting DAN cover setelah video selesai.** Caption ke `caption/<slug>.md` (format di bawah). Cover 1080×1920: salin `studio/projects/hari-ke-10-cover/` sebagai template (adegan dari video + teks cover 2–4 kata, angka emas besar, teks di pita tengah agar aman untuk crop 3:4), render dengan `--stills 0.5 --scale 1`, simpan ke `caption/<slug>-cover.png`. Jangan anggap video selesai sebelum caption dan cover dibuat.

## Format caption (wajib, per video)
- **Hook baris pertama** (≤ 60 karakter, berhenti scroll; jangan "Halo guys").
- 2–3 baris isi: satu fakta kunci + sumbernya.
- Satu pertanyaan CTA untuk komentar.
- Hashtag: 3–5 spesifik + 1–2 luas. Jangan lebih dari 6.
- Versi: **TikTok/Reels** (caption di atas), **YouTube Shorts** (judul ≤ 60 karakter dengan `#shorts`, deskripsi 2 baris + sumber), **teks pin komentar**.

## Default produksi
- Shorts/TikTok: 9:16, 1080p, 24 fps, caption on (di zona aman TikTok: tidak tertutup tombol kanan & deskripsi bawah, cek `safe.png`), style `emerald`, `fadeIn 0`, ending **loop** (kalimat terakhir menyambung ke kalimat pertama).
- Versi panjang: 16:9, 1080p, caption off.
- Protagonis: stickman "kamu" dengan satu item merah-oranye `#d64a33` (maskot); nama boleh baru tiap video. Mulai proyek dengan menyalin `studio/library/` (cast + set kamar & jalan); buat set baru bila topik membutuhkan, gaya tetap sama.
- Niche: hanya self-improvement (ScriptForge 1.1–1.5). Tolak/konfirmasi dulu bila user minta topik di luar niche.

## Catatan teknis
- Folder repo tidak menyimpan `node_modules`; jalankan `./setup.sh` di container baru.

## Patch yang sudah diterapkan ke engine (`studio/`), jangan ditimpa saat update plugin
- `render.mjs`: mendukung `CHROMIUM_PATH` (Chromium bawaan container).
- `engine/rig2d.js`: alis `worried` dan `angry` sebelumnya tertukar, sudah diperbaiki.
- `engine/ui2d.js` captions: grup caption berhenti di tanda baca, jarak antar kata lebih lebar, pop sorotan diperkecil; posisi 9:16 di zona aman TikTok (y 0,66 H, pusat x 0,44 W, lebar maks 0,74 W, maks 3 kata).

## Caption & komentar pertama (berlaku setelah user ACC naskah final)
- Begitu user menyatakan **ACC/final** untuk naskah, langsung kirim **caption posting + komentar pertama** (jangan tunggu video selesai; cover tetap dibuat setelah render).
- **Wajib riset bahasa manusia dulu:** pakai ScrapeMedsos (TikTok `v1_tiktok_search_keyword` region ID, lalu komentar video teratas dengan `v1_tiktok_video_comments`, bila perlu YouTube) untuk topik yang sama. Catat kata, singkatan, dan gaya yang benar-benar dipakai orang (mis. "jeglek", "kopong", "rembes", "wkwk", "auto", "relate banget").
- Tulis caption & komentar pertama meniru ritme itu: kalimat pendek, boleh tidak baku, emoji secukupnya (0–2), tanpa frasa khas AI ("Yuk simak!", "Tahukah kamu", "di era modern ini", "mari kita", "penting untuk diingat", tanda "—" berlebihan, daftar berpoin di caption).
- Komentar pertama = pancingan diskusi dari sudut pandang kreator (pertanyaan spesifik atau "aku dulu juga…"), bukan ringkasan video.
- Simpan contoh bahasa hasil scrape (maks. 10 kutipan pendek) di file caption sebagai bukti, jangan menyalin komentar orang utuh ke caption.
