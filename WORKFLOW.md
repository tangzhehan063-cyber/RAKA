# WORKFLOW cepat & hemat token (Shorts stickman)

Tujuan: satu video ≈ 1 chat, ±8 langkah, tanpa membaca file besar. **Satu chat hanya untuk repo ini.** Semua perintah dari root repo.

## 0. Awal sesi (baca 2 file saja)
- `git fetch origin` → cabang `claude/*` yang belum masuk `main`? Merge dulu ke cabang kerja (video #2/#3 pernah bentrok karena ini).
- `STATUS.md` (posisi + preferensi). `brand/dna-video.md` hanya kalau perlu ingat struktur.
- JANGAN baca: `prompts/ScriptForge.pdf`, kode shot video lama, engine. Contekan API ada di bawah.
- Container baru: `tools/produksi.sh setup` (npm + numpy/scipy, ±1 mnt).
- **Panel Studio** (tab RAKA): https://claude.ai/artifact/4Aiv5HDCLRRfVLdEapvt3s (slug `19a6f0e4-8170-4760-b8cc-959939f686ea`). Panggil `watch` (claude-artifacts) supaya tombol panel membangunkan chat. Perintah datang sebagai komentar "[Panel Studio · RAKA] …" (`read_comments`, balas `reply_comment`). Tiap pindah tahap perbarui `raka-aktif/sekarang` lewat `db_write` (nn, judul, seri, tahap 0–7 = Ide/Naskah/Caption & suara/VO/Contact sheet/Render/Distribusi/Selesai, menunggu true saat minta review, catatan, naskah). Video selesai → `raka-videos/vNN`; ide → `raka-ide/iNN` (urut, judul, catatan, rek). **Referensi** user di `raka-ref` (url, catatan, file = id aset): baca `db_list` + `read_asset`, bedah → `brand/formula.md`, set `dibedah: true`.

- **Mode cepat konfirmasi (keputusan user 12 Nov, berlaku semua channel):** ACC WAJIB di 3 titik: (1) **naskah** (tahap 1), (2) **pilihan warna/gaya** (langkah 5b, user memilih dari `style_grid.png`), dan (3) **contact sheet/cek gambar** sebelum render (tahap 4). Di titik itu: unggah pratinjau ke panel (`upload_asset` ke slug panel), tulis `pratinjau: [{id, tipe, label}]` + `menunggu: true` + `catatan` di dokumen aktif channel, lalu BERHENTI sampai user ACC/revisi. Tahap lain (suara, timestamp, animasi, render, distribusi) jalan terus tanpa menunggu, tetapi hasilnya tetap diunggah sebagai pratinjau + `menunggu: false` supaya user bisa mengecek dan mengirim revisi kapan saja; revisi dikerjakan di tahap itu saja. Pesan "[Panel Studio …] … Gaya visual: X (mesin dari repo Y)" = pakai mesin gambar repo Y untuk video ini (clone repo Y bila perlu); framework berpikir tetap dari channel asal.

## 1. Ide (≤ 4 kredit ScrapeMedsos)
- `v1_tiktok_search_keyword` × 3–4 paralel: `region:"ID"`, `date_posted:"last-3-months"`, `sort_by:"most-liked"`, `trim:true`.
- Output besar otomatis disimpan ke file → `python3 tools/scrape_ringkas.py search <file> 8`. Jangan baca file mentah.
- Beri 10 ide + 1 rekomendasi out-of-the-box. Tunggu pilihan user.

## 2. Fakta + naskah (1 WebSearch)
- 1–2× WebSearch "standard": 1 studi utama + 1 sumber pendukung. Tulis `naskah/<slug>.md` dengan struktur `brand/dna-video.md` §2 (framework v2: hook adegan "salah" → cermin → konflik → twist riset → hening → aksi & perubahan nyata → loop; sumber, teks TTS ±130–165 kata = ±60–75 dtk, storyboard tabel dengan arahan per kalimat dari **`brand/sutradara.md`**). Tunggu ACC.

## 3. Setelah ACC (paralel dalam satu giliran)
- Komentar: `v1_tiktok_video_comments` untuk 2 video saja, `trim:true` (≈1 kredit/video). Ringkas bila tersimpan ke file: `scrape_ringkas.py comments`.
- Tulis `caption/<slug>-shorts.md` (format CLAUDE.md) **dan** mulai TTS di giliran yang sama.
- Draf suara dulu (gratis): simpan teks TTS ke `naskah/<slug>.txt` lalu push → workflow "Gemini TTS" membuat `audio/<slug>.wav` (atau `python3 tools/gemini_tts.py naskah/<slug>.txt`).
- Final: `creative_create_flow` **sekali per video** (catat `flow_id`) → `creative_generate_speech` (`eleven_v4`, voice `vLsH4ENK3zGpAuW1lSh4`, **`generations_count: 1`**), hanya setelah naskah ACC. Revisi = kalimat yang berubah saja, disambung (aturan hemat di CLAUDE.md).
- Sambil menunggu: tulis kode adegan (langkah 5). Poll status seperlunya (tiap poll = token).

## 4. VO → timeline (2 perintah)
- `tools/produksi.sh init <slug> "<content_url VO>"`
- `creative_add_flow_asset_node` (generation_id) → `creative_transcribe_audio`. Bila "busy", kerjakan hal lain lalu coba lagi.
- `tools/produksi.sh timeline <slug> "<words_download_url>"` → mencetak kalimat + waktu (dasar shot list).

## 5. Adegan (+ 1–2 eksperimen)
- **Baca dulu `brand/gaya-growkaz.md` (skill `growkaz-style`)**: 15–25 shot/menit, kosakata shot bervariasi (bigFace, insert, over-the-shoulder, freeze-frame, 3D), rim light, latar depan buram, atmosfer, helper UI bawaan (`dataCard`, `compareBars`, `callout`), transisi bermakna. Checklist §6 dijalankan sebelum contact sheet.
- Pilih 1–2 eksperimen moodboard/storyboard baru (lihat `brand/eksperimen.md`: jangan ulang yang ditolak, pertahankan yang disukai). Sebutkan ke user saat kirim sheet: "eksperimen kali ini: …".
- Tulis `studio/projects/<slug>-shorts/story/shots.tsv` (contoh: `jam-tiga-pagi-shorts/story/shots.tsv`) → `tools/produksi.sh shots <slug>`.
- Kode: `scenes/shots/01_*.js` (lokasi), `02_papan.js` (blueprint/fakta), `03_*3d.js` (1 shot 3D). Salin pola dari `studio/projects/jam-tiga-pagi-shorts/scenes/shots/` **tanpa membacanya bila contekan cukup**.
- Set siap pakai di `studio/library/sets/`: `bedroom.js` (kalender), `street.js`, `kamar.js` (jam 03:00, meja + lampu, kertas, bayangan Si Ramalan).

## 5b. Pilihan warna menurut TEMA (WAJIB sebelum contact sheet; aturan user 17 Nov)
- Warna mengikuti **tema video**, dan gaya dasar **berganti antar video** (jangan sama dua video berturut-turut). Ganti palet per adegan hanya untuk pergeseran emosi besar (maks 2–3 palet/video).
- Sebelum `produksi.sh sheet`: pilih 2–3 gaya dari **tabel rekomendasi tema** di `brand/palet-emosi.md` ("Pilihan palet menurut tema"), jalankan `tools/produksi.sh palet <slug> "gayaA,gayaB,gayaC"` dan kirim `style_grid.png` ke user dengan 1 rekomendasi + alasannya. **User memilih**, baru set `style` di `config.json` dan lanjut ke sheet.
- Set kamar/ruang baru memakai token mood/style (`mood()`, `S().ui`), bukan warna pastel tertulis; kalau tidak, grid gaya tidak berubah.

## 6. Cek visual → render (1 sheet, perbaikan via stills)
- **Sutradara:** `tools/produksi.sh sheet` kini otomatis menjalankan `python3 tools/cek-sutradara.py <slug>` (ritme, transisi, kamera, waktu baca, suara, palet, animasi; GAGAL wajib diperbaiki; panduan: skill `.claude/skills/sutradara/SKILL.md`). Setelah sheet jadi: `python3 tools/cek-visual.py frame studio/projects/<slug>-shorts/build/sheets/s*_*.png` (warna, kontras, neon).
- `tools/produksi.sh sheet <slug>` → lihat 1 gambar `build/sheets/safe.png` (still + overlay zona aman TikTok), cocokkan dengan **`brand/cek-bug.md`**. Kirim sheet ke user sebelum final.
- Perbaiki → `tools/produksi.sh stills <slug> 12.3,40.1` (hanya shot yang diubah).
- **Jangan hentikan render** kecuali perubahan memang untuk video ini.
- `tools/produksi.sh final <slug>` dengan Bash `run_in_background` (±10 mnt untuk 56 dtk; WORKERS = nproc−1). Selesai = render + mix + QC + `build/qc.png`.

## 7. Cover + distribusi (wajib, urut)
1. Cover: salin `studio/projects/jam-tiga-pagi-cover/` → ganti teks/adegan di `scenes/shots/cover.js` → `tools/produksi.sh cover <slug>`.
2. **Drive (aturan user 13 Nov):** buat subfolder `NN - <Judul>` di folder RAKA (`1lErd-CVqlWZdbEVI5iPV3tQokyGWmWx9`) lalu unggah `cover.png`, `caption.md` (TikTok/Reels, Shorts, komentar pin), `naskah.md` (teks TTS + sumber), `voiceover-*.mp3` (`create_file`, `base64Content` = `sha256:<hash>:<path>`, file dari scratchpad). Kirim ke chat HANYA MP4 (SendUserFile) + link folder Drive; jangan kirim cover/caption/suara ke chat.
3. Arsip: baris baru di `arsip/README.md` + `brand/brand-kit.md`; pratinjau 540p (mp4 + cover jpg) di `arsip/halaman/` + kartu di `arsip/halaman/index.html` → republish artifact arsip (slug `40b5677b-fc79-4023-83fe-457a59db2581`, `publish_files`).
4. `STATUS.md` (2–3 baris). Commit + push.
5. **Buat PR ke `main` lalu merge sendiri** (izin user 9 Nov, ditegaskan 16 Nov: otomatis setiap video, jangan menunggu user; rollback lewat Revert PR). Laporkan singkat: "sudah masuk main".

## Contekan API engine (tidak perlu grep)
- Import: `import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, ring, text, FONTS, shake } from '/engine/core.js'`
- `V(h, v)` = nilai horizontal/vertikal. `E.W/E.H` = 1080×1920. `rel = (w, info, fb) => (wordTime(w, info.shot.start-0.1) ?? info.shot.start+fb) - info.shot.start` → detik kata dalam shot.
- `registerShot('s01', { draw(g, t, info) {...} })`; 3D: `{ kind:'3d', init(T){ T.stage({mood,fov,fog,keyPos,keyIntensity,ambient}); T.box/cyl/cone/sphere/plane/ground/planks/figure3D(outfit,{pose,rim}); T.THREE }, draw(s,t,info,T){ T.orbit(cam,t,{target,radius,height,from,to,dur}) } }`. 3D: 1 unit rig = 1/140 m; pose sit: pinggul 0,51 m di atas kaki.
- Tokoh: `drawFigure(g,{x,y,s,facing,pose,rot,outfit,expr,look,blink,rim:{color,dir,w},ink,alpha,shadow})`; `bigFace(g,cx,cy,r,{outfit,expr,look,blink,rimColor,rimSide,tilt})`; `POSES`: stand relaxed talk explain point wave cheer think shrug phone reach sad facepalm ready crouch sit kneel lie(rot ±π/2) jump fall; `breathe(pose,t,amt,seed)`, `walkPose(phase,{run})`, `posesAt(t,[[t,pose],...])`.
- Ekspresi: neutral happy joy smile surprised shocked scared worried nervous angry determined sad cry smirk sleepy thinking confused awe.
- FX: `rain dust drops rings godRays lightCone pool sparkle fog sun moon skyline windowFrame bed clock lensStreak speedLines`.
- UI: `UI.blueprint(g)`, `UI.bpStroke()`, `UI.badge(g,{str,x,y,size,a})`, `UI.readout(g,{label,value,x,y,align,a})`; warna `S().ui.gold/cream/accent`.
- Transisi: cut flash dip dipWhite zoom whip swipe swipeBack (swipe = feed ke atas). SFX: whoosh swish impact hit riser freeze tick clock heartbeat pop blip counter ding shimmer stinger footstep phonebuzz thunder; ambience: rain wind roomtone city.
- **Zona aman TikTok/Reels (1080×1920), wajib:** UI aplikasi menutup header atas (y < 150), kolom tombol kanan (x > 870, y 860–1560) dan deskripsi bawah (y > 1480). Caption otomatis di pita y ±1300–1390 (pusat 1344, posisi baku ACC user), x 75–875 (`engine/ui2d.js`, maks 3 kata). Teks papan/angka taruh di y 150–1260, **jangan di pita caption**; di y > 860 jangan lewat x 870. Badge pojok kanan atas: x = `E.W - V(90,110)`, y = `V(110,300)` (di bawah ikon search). `produksi.sh sheet` menghasilkan `safe.png` (merah = tertutup UI); pastikan tidak ada teks di area merah.

## Hemat token: aturan singkat
1. Jangan pernah membaca output JSON mentah; pakai `scrape_ringkas.py` / `jq`.
2. Tulis file sekali dengan Write; perbaikan kecil dengan sed/Edit, bukan menulis ulang.
3. Cek visual hanya lewat 1 contact sheet; jangan membuka still satu per satu.
4. Panggilan independen dikirim paralel (search, komentar, TTS).
5. Render penuh selalu di background; jangan polling, tunggu notifikasi.
