---
name: video-engineer
description: Implementasi video RAKA di engine GrowKaz (studio/) dan Remotion/Three.js (remotion-3d/): kode adegan, render deterministik, pipeline produksi.sh, katalog komponen visual yang sudah ada, QC teknis. Pakai di STEP 12-15 setelah storyboard disetujui. Tanpa API gambar/video AI; semua visual dibuat dengan kode.
---
# video-engineer

**Input:** storyboard + `shots.tsv` + timeline VO + gaya. **Output:** kode adegan di `studio/projects/<slug>-shorts/scenes/`, render, MP4 + QC teknis. **Batas:** tidak mengganti engine tanpa benchmark dan alasan teknis; tidak membuat API baru; tidak memakai layanan AI visual eksternal. Detail teknis & contekan API: `brand/produksi-teknis.md`; gaya: skill `growkaz-style`; Remotion/3D: skill `remotion-fitur`.

## Aturan teknis
1. Visual dengan kode saja (canvas/SVG/CSS/three.js/Remotion). Tanpa AI image/video generation. Tanpa network fetch saat render.
2. Animasi berbasis frame/waktu `t` (deterministik). Random hanya dengan seed. Parameter timing diambil dari timeline kata (`wordTime`).
3. Sederhana dulu: bila CSS/2D cukup, jangan 3D.
4. Mobile-first 1080×1920, 24 fps, zona aman (`tools/safezone.py`).
5. Pakai ulang `studio/library/` (cast, sets) dan helper; komponen baru hanya bila dipakai ≥2 video (taruh di `studio/library/`, parameterisasi timing).

## Katalog komponen (yang sudah ada; cari dulu sebelum membuat)
Karakter/ekspresi (`drawFigure`, `bigFace`, `POSES`, `walkPose`), set (bedroom, kamar, street), teks/angka (`UI.readout`, `UI.badge`, `dataCard`, `compareBars`, `callout`, `UI.blueprint`), objek (`tangan()` raksasa, `tumpukan()`, jam, kalender), FX (`speedLines`, `rain`, `dust`, `fog`, `sparkle`, `godRays`), transisi (`cut flash dip zoom whip swipe`), 3D (`three-kit.js`), style/palet (`engine/styles.js`, mis. `komik`), caption kata-per-kata (`engine/ui2d.js`).
Celah yang layak dibuat bila dibutuhkan 2 video: chat UI, counter angka generik, diagram sebab-akibat, split screen parameter. Jangan dibuat spekulatif.

## Langkah
1. `tools/produksi.sh setup` (container baru). Cek `produksi.sh cek <slug>`.
2. Tulis adegan; `produksi.sh sheet <slug>` → cek `safe.png` + `brand/cek-bug.md`.
3. `produksi.sh final <slug>` (background) → mix → `python3 tools/qc-teknis.py <mp4> --durasi <dtk>`.
4. Laporkan hasil QC teknis apa adanya; GAGAL harus diperbaiki sebelum konten QC.

## Quality gate
Render deterministik (dua render yang sama menghasilkan durasi sama), QC teknis tanpa GAGAL, tidak ada aset hilang, tidak ada file sementara di `out/`, tidak ada ketergantungan baru.
