# Produksi teknis (engine GrowKaz, shot, render, distribusi)

> Dipindah dari WORKFLOW.md lama (23 Nov 2026). Dipakai di STEP 10–16 pada `WORKFLOW.md` baru. Isi tidak diubah selain penomoran; perintah `tools/produksi.sh` tetap sama.

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
