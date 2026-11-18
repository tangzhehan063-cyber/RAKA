# Panduan memakai gaya GrowKaz secara maksimal (RAKA)

Dibuat 18 Nov 2026 setelah membaca panduan resmi di dalam plugin (`brand/growkaz/style-bible.md` dan kawan-kawannya) dan mengukur video #9–#12 terhadapnya. Pakai panduan ini **sebelum menulis adegan** (WORKFLOW langkah 5) dan **sebelum contact sheet** (langkah 6).

## 1. Apa yang membuat video aslinya bagus
Intinya satu kalimat dari style bible: *"film stickman yang disinari sinematografer: bentuk sederhana, cahaya canggih."* Detailnya:

| # | Bahan | Aturan praktis |
|---|---|---|
| 1 | **Struktur nilai gelap-terang** | 60–75% bingkai tengah-gelap, 1–3 titik terang (jendela, lampu, layar, matahari terbenam). Tokoh hitam **diposisikan di depan area paling terang** supaya siluetnya terbaca. |
| 2 | **Satu cahaya utama per shot, dan terlihat** | Tampilkan sumbernya (jendela/lampu/matahari) lalu tumpahkan: `glow`, `FX.pool` di lantai, `FX.lightCone`, `FX.godRays`. |
| 3 | **Rim light di setiap tokoh yang tersinari** | `rim: { color: M.rim, dir: [dx, dy] }`; `dir` menunjuk dari tokoh ke cahaya. Tanpa rim, hitam-di-gelap tidak terbaca. |
| 4 | **Lapisan kedalaman + latar depan buram** | Langit 0,1–0,2 → gedung 0,3–0,4 → dinding 0,5–0,6 → lantai/properti 0,8–0,9 → tokoh 1,0 → **latar depan buram 1,5–1,8** (`blurLayer(g, 8–14, fn, cam, 1.7)`). Hampir semua shot menengah punya sesuatu yang lembut di depan (gelas, tanaman, bahu tokoh lain). |
| 5 | **Atmosfer di nyaris setiap shot** | Debu (`FX.dust`), hujan, kabut, tetesan, bintang, `lensStreak`, god rays. |
| 6 | **Kamera tidak pernah diam** | Dorong pelan (z 1,0→1,05–1,10), geser (x ±20–60), tarik untuk reveal, roll ±0,02 untuk gelisah, `shake` untuk benturan. |
| 7 | **Kosakata shot yang bervariasi** | Lihat §3; maksimal 3 shot berturut-turut dengan jenis/bingkai sama. |
| 8 | **Transisi bermakna** | `cut` ≥80%; `flash` (putih) ke momen beku/realisasi besar; `dip` untuk lompat waktu; `whip` untuk pindah tempat; `zoom` masuk ke penjelasan. |
| 9 | **Grafik tersinkron kata** | Setiap angka yang diucapkan muncul di layar dan beranimasi tepat saat kata (`wordTime()`); `ease.outBack` + SFX `pop`/`blip`; maksimal 1–2 label pendek sekaligus. |
| 10 | **Letterbox** | `bars`: `wide` (2:1) default, `scope` (2,39:1) untuk klimaks/beku/close-up intens, `none` untuk UI penuh. Di 9:16 default `none`, `scope` = bar tipis. |
| 11 | **Warna dari token, bukan tertulis** | Semua warna dari `mood()` / `S()` / cast, supaya grade gaya (lift/gamma/gain, vignette, grain, bloom) bekerja. |
| 12 | **Tempo** | Median shot 2–3,5 dtk, aksi cepat 0,8–2 dtk, tahan emosional 4–8 dtk, jangan >10 dtk tanpa gerak baru. **15–25 shot per menit.** Shot dibuka 0,1–0,2 dtk sebelum frasa. |
| 13 | **Suara** | Ambience di sebagian besar shot (−18 s.d. −28 dB), SFX per konvensi (§5), jangan menumpuk >2 cue sekaligus. |

## 2. Skor video kita terhadap standar (diukur 18 Nov)
| Video | Shot | Shot/menit (target 15–25) | Median (target 2–3,5 dtk) | Transisi | `blurLayer` | `bigFace` | `bars` | Helper UI bawaan |
|---|---|---|---|---|---|---|---|---|
| #9 Skripsi | 19 | 13,8 | 4,5 | cut/dip/swipe | 1 | 1 | tidak | 0 |
| #10 Bolos Sekali | 19 | 18,2 | 3,2 | cut/dip/swipe | 2 | 2 | tidak | 0 |
| #11 Keranjang Kosong | 19 | 14,9 | 3,4 (maks 10,3 dtk) | cut/dip/swipe | 1 | 1 | tidak | 0 |
| #12 Lupa Itu Wajar | 19 | 16,4 | 3,0 (maks 7,9 dtk) | cut/dip/swipe | 0 | 1 | tidak | 0 |

Temuan jujur:
- **Selalu 19 shot** apa pun durasinya, jadi video panjang melambat. Seharusnya shot mengikuti kalimat (naskah 70 dtk → 18–28 shot).
- **Tidak pernah memakai** `flash`, `whip`, `zoom`, letterbox, freeze-frame, over-the-shoulder, insert/macro, dan top-down.
- **Grafik digambar tangan** padahal `UI.dataCard`, `compareBars`, `callout`, `dimension`, `meter`, `bubble`, `titleCard`, `bigLine` sudah tersedia dan tersinkron kata.
- **Latar depan buram hampir tidak ada** (0–2 pemakaian per video), padahal itu pembeda utama "mahal" dan "datar".
- **`lembut` (#10, #11) bertentangan dengan style bible**: terang, tanpa rim, tanpa bloom, kontras halus. Style bible menyebut "tanpa tokoh hitam tanpa rim" sebagai larangan. #12 (arctic + rim) lebih dekat, tapi masih banyak kartu datar.
- **Set kamar/pantri #10–#11 memakai warna tertulis**, jadi grade gaya tidak ikut bekerja (larangan di style bible).

## 3. Kosakata shot dan proporsinya (isi di kolom `scene` shots.tsv)
1. **Establishing wide (±10%)**: tempat dengan tokoh kecil + dorong pelan; membuka setiap lokasi baru; sering 3D.
2. **Medium two-shot (±25%)**: samping, tokoh saling berhadapan; aksi dan percakapan. Tokoh utama di kiri menghadap kanan.
3. **Over-the-shoulder (±10%)**: siluet buram besar satu tokoh di latar depan (`blurLayer`, depth 1,6), tokoh lain tajam.
4. **Giant face `bigFace` (10–15%)**: reaksi, realisasi, momen "kamu". Latar = lokasi yang diburamkan dan digelapkan (`blurLayer` + `veil`).
5. **Insert/macro (±10%)**: tangan, layar HP, jam, benda; besar, sederhana, latar buram.
6. **Top-down/diagram view (±5%)**: meja dari atas dengan lintasan putus-putus dan label waktu.
7. **Freeze-frame (1–3 per video)**: partikel menggantung, tint dingin, badge pojok, cincin pelan; masuk dengan transisi `flash` + SFX `freeze`.
8. **3D orbit (±1 per menit)**: ruang besar; `three-kit`.
9. **Data card/UI**: angka beranimasi saat diucapkan.
10. **Blueprint**: bagian penjelasan sains (grid navy, garis biru muda, aksen emas).
11. **Title card** dan 12. **End screen**: bila dipakai (judul bercahaya, pertanyaan serif italic, gelembung komentar).

## 4. Resep untuk formula validasi RAKA (babak naskah → shot)
| Babak | Kosakata shot yang disarankan | Cahaya/mood |
|---|---|---|
| Adegan "salah" (hook) | Establishing wide + medium; tokoh melakukan kebiasaan salahnya; latar depan buram | Cahaya hangat tunggal (lampu meja/jendela), rim jelas |
| Cermin | Insert/macro (tangan, kertas, layar), over-the-shoulder, kamera mendorong | Mulai turun ke dingin/gelap |
| Suara di kepala | `bigFace` + latar buram digelapkan; teks "BOCOR?" `bubble`/`callout` | Gelap, satu titik terang |
| Twist riset | Blueprint + `dataCard`/`compareBars`/`dimension`, lalu 1 shot 3D; angka sinkron kata; `scope` bars | `arctic`/`indigo`, kontras naik |
| Hening | **Freeze-frame** (partikel menggantung + teks diketik), masuk lewat `flash` | Tint dingin, rim tipis |
| Aksi dan perubahan nyata | Tokoh **berjalan/melakukan** aksi (walkPose + kamera mengikuti + parallax), insert hasil | Pagi emas, hangat |
| Loop | Bingkai sama dengan shot pertama, tokoh berganti | Sama dengan hook |

## 5. Suara
- Ambience di sebagian besar shot: `roomtone` (interior), `city`/`wind` (luar), `rain`. Level −18 s.d. −28 dB.
- SFX: `whoosh/swish` pada kamera cepat; `pop/blip` saat grafik muncul; `counter` di bawah angka; `riser` 1–2 dtk sebelum reveal lalu `impact/stinger`; `freeze` saat beku; `ding/shimmer` untuk realisasi; `footstep` untuk langkah. Level: UI −12 s.d. −16, normal −6 s.d. −10, momen besar −3 s.d. −6.
- Musik berganti di titik cerita (judul, temuan, bahaya, klimaks, penyelesaian, segmen sains).

## 6. Checklist sebelum contact sheet (centang semua)
- [ ] Jumlah shot sesuai naskah: **15–25 shot/menit**, median 2–3,5 dtk, tidak ada tahan >8 dtk tanpa gerak baru.
- [ ] Setiap lokasi baru dibuka establishing; tidak ada >3 shot berturut-turut dengan jenis/bingkai sama.
- [ ] Ada minimal: 2 `bigFace`, 2 insert/macro, 1 over-the-shoulder, 1 freeze-frame (di momen hening), 1 shot 3D (±1/menit), 1+ data card/dimension.
- [ ] Rim light di setiap tokoh yang tersinari; tokoh diposisikan di depan area terang.
- [ ] Ada latar depan buram pada sebagian besar shot menengah (`blurLayer` depth 1,5–1,8).
- [ ] Setiap shot punya gerak kamera dan atmosfer (debu/kabut/hujan/partikel).
- [ ] Transisi: ≥80% cut; `flash` ke freeze; `dip` lompat waktu; `whip` pindah tempat; `zoom` masuk penjelasan.
- [ ] Semua warna dari `mood()`/`S()`/cast (tidak ada warna pastel tertulis di set).
- [ ] Teks maksimal 1–2 label pendek; angka sinkron `wordTime()`; di dalam zona aman TikTok.
- [ ] Tokoh tetap di lantai dengan bayangan kontak; kostum dan arah layar konsisten dalam satu adegan.
- [ ] Gaya dasar berbeda dari video sebelumnya; pilihan warna sudah disetujui user (`produksi.sh palet`).

## 7. API yang belum terpakai (gunakan!)
`UI.titleCard`, `bigLine`, `badge`, `readout`, `callout`, `dimension`, `dataCard`, `compareBars`, `meter`, `bubble`, `endScreen`; `FX.lensStreak`, `FX.drops` (tetesan beku), `FX.lightning`, `FX.rings`, `FX.speedLines`, `FX.crowd`; `drawFigure` opsi `trail` (bayangan kecepatan), `talk` (kalimat berkutip), `prop`, `dim`; `blendPose`, `headPos`; `T.orbit/dolly`, `T.crowd3D`, `T.building`.

## 8. Keputusan user (18 Nov 2026): CAMPUR
- **Warna fleksibel mengikuti tema dan masalah video** (mata menangkap warna; `lembut`, `arctic`, `indigo`, `clay`, `sakura`, `paper`, `emerald`, dll semua sah, dipilih dari tabel `brand/palet-emosi.md` dan disetujui user lewat `produksi.sh palet`).
- **Identitas channel = style kit**, bukan satu palet: mesin GrowKaz (tokoh stickman, rig, FX, 3D), maskot `#d64a33`, kosakata shot, caption di zona aman, kerangka naskah, formula validasi, dan tulisan/grafik bergaya sama.
- **Cara membuat video**: ikuti panduan GrowKaz (`brand/growkaz/`, §1–§6 di atas, skill `growkaz-style`) **ditambah** skill dan aturan yang sudah kita bangun (`sutradara`, `humanizer`, `brand/cek-bug.md`, `brand/formula.md`, `brand/palet-emosi.md`, `brand/kerangka-cerita.md`, `tools/produksi.sh`, WORKFLOW 0–7).
- Syarat tetap berlaku pada gaya apa pun: rim light bila gaya mendukung, warna dari token (bukan tertulis), struktur nilai gelap-terang yang terbaca, latar depan buram, atmosfer, kamera bergerak, tokoh di zona aman.

## 9. Pelajaran dari contoh asli (18 Nov, setelah #13 pertama dinilai "sangat jelek")
Dirender dari `studio/examples/reaction-time` dan dibandingkan:
- **Satu lokasi kaya detail dipakai berulang** (kafe: fasad bertenda, jendela menyala dengan siluet orang di dalamnya, skyline berlapis). Shot lain = zoom/crop/blur dari lokasi yang sama, bukan set baru yang sepi. Buat set dengan banyak detail (jendela kota, layar, laptop, kursi, plafon), lalu pakai ulang.
- **Tokoh besar di shot menengah** (s 1,5–1,8), bukan siluet kecil di set kosong; warna pakaian + rim ring.
- **Insert ekstrem**: lengan/tangan raksasa (lengan baju berwarna + tangan hitam) memegang benda, latar buram dari set yang sama.
- **`bigFace` dengan cincin cahaya** di atas latar lokasi yang diburamkan dan digelapkan.
- **Grafik bersih**: bar menyala + ikon stickman + skala (blueprint), bukan model 3D benda. **3D = ruang besar dengan figure3D** (kafe/jalan), bukan objek diagram.
- **Tata letak 9:16**: seluruh isi harus muat di lebar 1080 (±540 dari tengah); set 16:9 yang lebar akan terpotong.
