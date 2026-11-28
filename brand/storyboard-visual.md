# Storyboard & arah visual (STEP 10–11)

## Format scene (`templates/storyboard.md`)
SCENE · TIME · VOICEOVER · VISUAL · CAMERA · MOTION · TRANSITION · TEXT · SFX · RETENTION PURPOSE · **KENAPA VISUAL INI** (satu kalimat).
Tiap scene harus melayani minimal satu fungsi: **menjelaskan, menarik perhatian, menunjukkan konflik, memperkuat emosi, membuat konsep abstrak jadi konkret, reveal, payoff.** Visual yang hanya dekoratif dibuang.

## Pilih visual karena kebutuhan, bukan kewajiban
Tidak ada yang wajib: 3D, rotasi kamera, zoom tiap scene, glitch, freeze-frame, swipe, partikel, shake, motion blur, lampu sinematik, banyak layer. Pakai bila fungsinya jelas.

| Kebutuhan | Pilihan visual | Sudah ada di engine/library |
|---|---|---|
| Situasi sehari-hari | stickman + set | `library/cast.js`, `sets/` (bedroom, kamar, street) |
| Angka / perbandingan | counter, bar, kartu data | `UI.readout`, `compareBars`, `dataCard`, `UI.blueprint` |
| Proses/waktu | timeline, jam, kalender | `clock`, `tumpukan()`, kalender (proyek #5) |
| Konsep abstrak | metafora benda (HP raksasa, jurang, jembatan) | `tangan()` raksasa, `_util.js` proyek lama |
| Layar/feed/chat | UI simulasi | swipe, kartu feed; gelembung komentar |
| Reveal | kamera dorong, pecah panel, stempel | `speedLines`, burst/panel (style `komik`, `uji-komik`) |
| Emosi | `bigFace`, hening + teks diketik | `bigFace`, caption |
| Nuansa 3D nyata | satu shot 3D | `three-kit.js` (`kind:'3d'`) |
Gaya dasar berganti antar video (`brand/palet-emosi.md`, `studio/engine/styles.js`; style `komik` terang untuk formula baru).

## Identitas RAKA yang tetap (minimum)
Stickman "kamu" dengan satu item `#d64a33` bila ada tokoh; caption kata-per-kata di zona aman (posisi baku); angka kunci di papan/kartu yang jelas; konsistensi per video. Sisanya fleksibel.

## Animatic / prototipe timing (STEP 11)
`python3 tools/animatic.py <slug>` (storyboard + timestamp VO). Periksa: tiap pergantian gambar jatuh di awal kata (±0,35 dtk), shot >5,5 dtk berubah di dalamnya, pita caption y 1300–1390 kosong. `tools/produksi.sh cek <slug>` menjalankan `cek-sutradara.py`.

## Perpustakaan komponen visual
Jangan membuat komponen demi jumlah. Aturan: komponen baru dibuat hanya bila dipakai ≥2 video atau menghemat >30 menit. Daftar yang sudah ada dan celah yang disarankan ada di `.claude/skills/video-engineer/SKILL.md` (§Katalog). Komponen baru masuk `studio/library/` dengan parameter timing dan tanpa `Math.random()` tanpa seed.
