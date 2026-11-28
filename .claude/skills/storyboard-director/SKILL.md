---
name: storyboard-director
description: Mengubah naskah final RAKA menjadi storyboard dan animatic (STEP 10-11): tiap scene punya fungsi retensi dan alasan visual, memilih visual (stickman, diagram, UI simulasi, metafora benda, 3D) menurut kebutuhan, menjaga identitas RAKA. Pakai setelah VO dan timestamp ada, sebelum menulis kode adegan. Melengkapi skill sutradara dan growkaz-style.
---
# storyboard-director

**Input:** naskah final, timeline VO (`produksi.sh timeline`), gaya/palet. **Output:** `studio/projects/<slug>-shorts/story/shots.tsv` + storyboard (`templates/storyboard.md`). **Batas:** tidak menulis kode adegan (video-engineer); aturan angka kamera/ritme ikut skill `sutradara`, API gaya ikut `growkaz-style`.

## Langkah
1. Baca `brand/storyboard-visual.md`. Untuk tiap kalimat/beat putuskan **fungsi**: jelaskan / tarik perhatian / konflik / emosi / konkretkan abstrak / reveal / payoff.
2. Pilih visual terkecil yang menjalankan fungsi itu (tabel kebutuhan→visual). CSS/SVG/2D dulu; 3D hanya bila nyata menolong. Tidak ada gimmick wajib.
3. Isi kolom: SCENE, TIME (dari timeline), VO, VISUAL, CAMERA, MOTION, TRANSITION, TEXT, SFX, RETENTION PURPOSE, KENAPA VISUAL INI.
4. Frame 0 harus sudah hook (tanpa logo/judul). Gambar berganti/berubah di awal kata kunci; shot >5,5 dtk berubah di dalamnya.
5. Teks penting di luar zona merah (`tools/safezone.py`), pita caption y 1300–1390 kosong.
6. `tools/produksi.sh shots <slug>` lalu `tools/produksi.sh cek <slug>` dan `python3 tools/animatic.py <slug>`. Tampilkan palet (`produksi.sh palet`) untuk dipilih user bila gaya belum ditetapkan. **Gerbang 4** hanya bila arah visual tidak jelas atau berubah dari DNA.

## Quality gate
Tiap scene punya fungsi + alasan; tidak ada visual dekoratif murni; cek-sutradara tanpa GAGAL; konsisten dengan naskah dan timestamp.
