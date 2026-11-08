# Channel Raka: aturan kerja untuk Claude

Channel faceless **self-improvement berbasis riset**, bahasa **Indonesia**, gaya **stickman sinematik** (plugin GrowKaz Stickman).
Baca file ini dan `brand/brand-kit.md` sebelum membuat konten apa pun. Komunikasi dengan user: Bahasa Indonesia.

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
6. **SELALU buat caption posting setelah video selesai** (lihat format di bawah) dan simpan ke `caption/<slug>.md`. Jangan anggap video selesai sebelum caption dibuat.

## Format caption (wajib, per video)
- **Hook baris pertama** (≤ 60 karakter, berhenti scroll; jangan "Halo guys").
- 2–3 baris isi: satu fakta kunci + sumbernya.
- Satu pertanyaan CTA untuk komentar.
- Hashtag: 3–5 spesifik + 1–2 luas. Jangan lebih dari 6.
- Versi: **TikTok/Reels** (caption di atas), **YouTube Shorts** (judul ≤ 60 karakter dengan `#shorts`, deskripsi 2 baris + sumber), **teks pin komentar**.

## Default produksi
- Shorts/TikTok: 9:16, 1080p, 24 fps, caption on, style `emerald`, `fadeIn 0`, ending **loop** (kalimat terakhir menyambung ke kalimat pertama).
- Versi panjang: 16:9, 1080p, caption off.
- Karakter utama **Raka** (hoodie `#d64a33`), lihat `studio/projects/*/scenes/cast.js`. Set yang sudah ada: `bedroom.js`, `street.js` (salin, jangan ditulis ulang).

## Patch yang sudah diterapkan ke engine (`studio/`), jangan ditimpa saat update plugin
- `render.mjs`: mendukung `CHROMIUM_PATH` (Chromium bawaan container).
- `engine/rig2d.js`: alis `worried` dan `angry` sebelumnya tertukar, sudah diperbaiki.
- `engine/ui2d.js` captions: grup caption berhenti di tanda baca, jarak antar kata lebih lebar, pop sorotan diperkecil.
