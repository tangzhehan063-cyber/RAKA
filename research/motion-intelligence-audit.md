# Audit Motion Intelligence untuk RAKA (25 Nov 2026)

Tahap: RESEARCH → AUDIT → DESIGN → DRAFT. Tidak ada integrasi. Draf skill: `.claude/skills/motion-intelligence/SKILL.md` (**v0.3-uji**, nonaktif; v0.2 direvisi minor setelah review 25 Nov).

> **Catatan versi.** Dokumen ini ditulis untuk v0.1 dan direvisi untuk v0.2 (25 Nov 2026). Bagian 0 merangkum perubahan. Bagian lain tetap sebagai catatan audit asli; baris yang terdampak diberi tanda **[v0.2]**. Nomor bagian `SKILL.md` berubah di v0.2, jadi rujukan "§" ke SKILL.md pada tabel lama merujuk susunan v0.1.

## 0. Revisi v0.2

### 0.1 Apa yang berubah dari v0.1
| # | Perubahan | Alasan |
|---|---|---|
| 1 | **Kepribadian gerak dilepas dari palet/style warna.** v0.1 menulis "gaya yang dipilih lewat `produksi.sh palet` menentukan kepribadian" dan memetakan nama style (emerald, `komik*`) ke kepribadian. Dihapus. Kepribadian dipilih dari arah gerak video/adegan; tidak ada langkah workflow baru dan tidak ada mekanisme pemilihan baru. | Workflow RAKA tidak menetapkan hubungan itu; `palet` hanya mengatur warna. Korelasi historis (komik dipakai sejak #17) bukan aturan. |
| 2 | Sinematik dan Komik dideskripsikan sebagai **perilaku**, bukan tabel angka. Tidak ada kepribadian ketiga; boleh berpindah dalam satu video bila maksud adegan memintanya. | Menghindari templat wajib. |
| 3 | **Bobot** ditulis ulang sebagai sebab-akibat (gaya, percepatan, momentum, hambatan, benturan, pemulihan, lingkungan). Persamaan berat=lambat/ringan=cepat dihapus. | v0.1 tabel "berat: mulai lambat" keliru secara fisik. |
| 4 | **Arc** menjadi prinsip bersyarat; breakdown pose pindah ke "opsional/implementasi". Tidak ada kewajiban keyframe tambahan atau kerja engine. | Menghindari kompleksitas yang tidak perlu. |
| 5 | **Diam** diperlakukan sebagai keputusan gerak yang sah (fokus, bobot emosi, pemahaman, ketegangan, timing, punchline, kontras), untuk kamera maupun adegan. | Permintaan review; menghindari kesan kamera/adegan harus selalu bergerak. |
| 6 | Hit-stop, animasi "di dua", stagger, remap waktu, pose antara dikumpulkan di satu tabel **teknik opsional/eksperimental** (§14 SKILL). | Belum teruji di video RAKA. |
| 7 | Seluruh angka diberi label status [R]/[E]/[T]/tanpa angka. Bagian duplikat (contoh numerik, daftar biaya panjang) dipadatkan. | Keterbacaan dan kejujuran sumber angka. |
| 8 | Dikeluarkan dari skill: bayangan menyusut menurut tinggi, daftar `trail ≤3`, batas jumlah kurva, "maks 2 pendukung", jeda kamera 4–8 frame, selang stagger, durasi antisipasi aksi besar/reveal, langkah pemulihan, offset gambar-ke-kata 1–3 frame, "linear satu-satunya", durasi tambahan 30–50%. | Lihat 0.2. |

### 0.2 Klasifikasi angka v0.1 → v0.2
Kategori: **R** = konvensi tertulis RAKA; **E** = ekstraksi dari kode #17/#18/`uji-komik` (bukan standar); **C** = contoh ilustratif; **U** = tidak berdasar (preskripsi tanpa bukti).
| Preskripsi v0.1 | Kategori | Nasib di v0.2 |
|---|---|---|
| Overshoot sinematik 0–3%, komik 8–25% | U (hanya 2,4→1 yang E) | **Dihapus**; overshoot disebut sebagai pilihan karakter, tanpa persen |
| Masuk ease-out 10–18 frame; keluar 40–50% lebih singkat | R (`sutradara.md`) | Tetap dirujuk, berlabel R; tidak dibakukan skill ini |
| Pop komik 5–8 frame; slam 2,4→1 dalam ±5 frame; `shake` 0,3 dtk amp 22; pantulan `e^(−5Δt)cos(22Δt)`; impact frame 0,12 dtk | E | Disebut sebagai "implementasi yang tertanam di #17/#18", berlabel E, bukan standar |
| Pindah pose 0,35–0,7 dtk / 0,15–0,3 dtk | U/E campur (0,35 = default `posesAt` [T]) | **Dihapus** |
| Durasi +30–50% bila jarak/massa berlipat | U (heuristik sumber luar) | **Diganti** kalimat kualitatif |
| Gerak pendukung 50–70% jarak, mulai 3–5 frame; "maks 2 pendukung" | R untuk 50–70%/3–5 frame (`sutradara.md`); U untuk "maks 2" | R tetap dirujuk sebagai titik awal; batas jumlah **dihapus** |
| Stagger 2–4 frame (v0.1 matriks baris 5) | U | **Dihapus**; stagger ada di tabel eksperimental tanpa angka |
| Antisipasi aksi besar 4–8 frame; reveal 4–6 frame / kamera 2–3% | U | **Dihapus** |
| Antisipasi 3 frame, skala 1,0→1,08→1,0 dalam 6 frame | R (angka/stempel) | Tetap, berlabel R, dibatasi ke angka/stempel |
| Jeda kamera mengikuti 4–8 frame | U | **Dihapus** |
| Maks ±3–4 kurva per video; "linear satu-satunya" | U | **Dihapus** / dilunakkan (DNA linear tetap dirujuk sebagai R) |
| Pemulihan 6–8 frame, langkah berhenti 3–5, napas 0→0,5 dalam 0,4 dtk | U (C pada contoh) | **Dihapus** |
| SFX 1 frame setelah gambar | R (`sutradara.md`) | Dirujuk saja, tanpa aturan tambahan; offset gambar-ke-kata 1–3 frame **dihapus** |
| Riser 1–2 dtk sebelum reveal; hening ±2 dtk | R (GrowKaz/DNA) | Tidak diulang di skill |
| Bayangan menyusut menurut tinggi | usulan audit | **Dikeluarkan dari skill**; tetap kandidat terpisah (0.5) |
| 24 fps, 1 frame ≈ 42 ms | T | Dipertahankan |
| Cut "saat ada aksi" | prinsip dari sumber | Dilunakkan: waktu potong diputuskan ritme dan kata, bukan persentase aksi |

### 0.3 Yang tetap eksperimental
Hit-stop; animasi "di dua"; selang stagger; remap waktu lokal; pose antara sebagai solusi arc; nilai komik [E] (belum di-ACC). Semuanya hipotesis, tidak ada pengujian visual di video RAKA, dan tidak boleh dijadikan standar sebelum uji.

### 0.4 Temuan audit yang belum terselesaikan
- **K1:** `growkaz-style`/`style-bible` mengatakan "kamera tidak pernah diam"; SKILL v0.2 mengizinkan diam sebagai prinsip, tetapi dokumen resmi belum disentuh. Butuh keputusan Anda.
- **K4/K2:** angka `sutradara.md` dikalibrasi untuk sinematik; belum ada dokumen yang menjelaskan angka mana berlaku untuk komik. Skill hanya menyebut, tidak menyelesaikan.
- **K8:** ambang 3,5 vs 5,5 dtk.
- Klaim "tanpa `cam`" hanya dicek pada #17.
- Apakah ambience `mix.py` bisa menjembatani cut belum diverifikasi.

### 0.5 Temuan engine/QC yang tetap di luar revisi ini (kandidat implementasi terpisah, tidak dikerjakan)
1. `blendPose` interpolasi sendi lurus (rig2d.js:40).
2. Bayangan `drawFigure` tidak merespons ketinggian.
3. `cek-sutradara.py` tidak mengevaluasi gaya komik (regex `cam = {`, kata kunci antisipasi).
4. Inkonsistensi ambang durasi shot (3,5 vs 5,5 dtk).
5. Kemungkinan perbaikan lain di engine/QC.
Tidak ada yang dimasukkan sebagai kewajiban di SKILL v0.2; kecuali satu catatan teknis singkat tentang `blendPose` pada §15 SKILL, sebagai informasi.

### 0.6 Yang perlu dievaluasi sebelum persetujuan integrasi
1. Apakah dua kecenderungan gerak cukup jelas dibaca tanpa tabel angka (uji coba memakai skill pada satu adegan, hanya membandingkan dengan mata).
2. Apakah teknik eksperimental (hit-stop, di dua, stagger, pose antara) layak diuji; bila ya, pada video mana dan bagaimana dicatat di `eksperimen.md`.
3. Apakah angka [E] komik perlu dibakukan di dokumen lain, atau dibiarkan sebagai kebiasaan kode.
4. Keputusan K1 (kamera diam) dan K8 (ambang durasi).
5. Apakah draf perlu dipangkas lagi (target: dapat dibaca satu putaran saat produksi).
6. Letak file (tetap di `.claude/skills/` dengan `disable-model-invocation: true` atau dipindah).

### 0.8 Revisi minor pasca-review (v0.3-uji)
Dikerjakan atas persetujuan user untuk persiapan uji video #19. Perubahan di `SKILL.md`:
1. **K1 dilaporkan netral.** Konflik juga mencakup `dna-video.md` §4 ("gerak kamera di setiap shot"), yang tidak tercantum di audit v0.1. §10 tidak lagi menyatakan "sah"; §16C tidak lagi berbunyi "aturan lama menang". Produksi sementara mengikuti aturan tertulis RAKA sebagai status quo, bukan penilaian.
2. **Label [R] diperbaiki:** klaim "dikalibrasi untuk sinematik" dihapus; diganti "ditulis sebelum gaya komik; belum dinyatakan berlaku untuk komik". Legenda [E] dikoreksi (pantulan dan impact frame hanya di `uji-komik`).
3. **Pose antara** ditandai BELUM DIVERIFIKASI (alasan dari pembacaan `posesAt`).
4. **Unsur komik** keputusan user 23 Nov ditambahkan sebagai alat; nama kepribadian dibedakan dari style id.
5. Lainnya: atribusi linear ke skill `sutradara`; "kiri menghadap kanan" dibatasi ke medium two-shot; frasa "Wajib" di §15 diganti; §16/§17 ditegaskan tidak wajib per elemen; butir checklist dan contoh reveal dilunakkan.
Koreksi pada audit lama: K3 menulis "DNA melarang linear", yang benar adalah skill `sutradara` B10; K2/K4 yang menyebut angka `sutradara.md` "dikalibrasi sinematik" adalah inferensi, belum diverifikasi.

### 0.7 Hasil validasi v0.2
`SKILL.md` dan dokumen ini dibaca ulang penuh setelah revisi. Hasil: setiap angka di SKILL berlabel [R]/[E]/[T] atau data pengamatan; palet dan kepribadian gerak dipisah (§2 SKILL); diam eksplisit diizinkan (§10–11); Sinematik/Komik berupa perilaku, bukan resep; hit-stop, di dua, stagger, remap, pose antara hanya di tabel eksperimental (§14); temuan engine/QC (0.5) tidak dikerjakan; `git status` menunjukkan hanya dua berkas yang diizinkan.

## 1. Ringkasan eksekutif
- **Kesimpulan: layak dengan revisi.** Sebagai lapisan *pengetahuan* (bukan kode), Motion Intelligence layak. Tetapi hanya sebagian kecil isi Motion Skills yang benar-benar menambah nilai; sisanya redundan, tidak cocok dengan engine 2D GrowKaz dan VO-driven timing, atau tidak bersumber.
- **RAKA sudah kuat** di: lapisan kedalaman, kosakata kamera, transisi bermakna, waktu baca, sinkron kata (`wordTime`), SFX, zona aman, determinisme engine, dan alat cek otomatis.
- **Kekurangan nyata (bukan kosmetik):**
  1. Gaya **komik** (inti formula sejak #17) tidak punya angka gerak tertulis; angkanya hidup hanya di kode `01_komik.js`/`uji-komik`.
  2. Angka di `brand/sutradara.md` dikalibrasi untuk gaya **sinematik** (ease-out 10–18 frame, overshoot 1,08), sedangkan komik memakai slam 2,4→1 dalam ±5 frame. Dua dunia, satu aturan.
  3. **Bobot, arc, follow-through, diam/hold** tidak punya panduan. Kebalikannya "kamera tidak pernah diam" menjadi aturan keras.
  4. `cek-sutradara.py` mendeteksi kamera lewat regex `cam = {…}`; di `lima-menit-shorts/.../01_komik.js` hasilnya **0 kecocokan** (tidak ada `cam` sama sekali), sehingga video komik akan terbaca "kamera diam 0%" padahal geraknya ada di objek. Cek antisipasi hanya mencari kata `overshoot|back(|antisip`.
  5. Fakta engine: `blendPose` meng-interpolasi sendi lurus (tangan bergerak garis lurus, lengan menyusut di tengah blend); bayangan `drawFigure` berupa elips tetap, tidak merespons ketinggian.
- **Temuan penting tentang sumber:** repo `motion-skills` hanya **indeks** (README, GIF, skrip verifikasi). Isi `SKILL.md` ada di repo terpisah `iart-ai/*`. Saya mengkloning *read-only* tiga paket ke `/home/user/iart-ai/` (di luar repo RAKA) agar bisa membaca path yang Anda sebut. Tidak ada yang ditulis ke repo itu.
- Draf skill **[v0.2]**: 18 bagian, berbasis prinsip; dua kecenderungan gerak (sinematik, komik) sebagai perilaku, dipisah dari palet; angka berlabel status; kerangka keputusan dengan jawaban "tidak perlu" yang sah. (v0.1: ±200 baris dengan tabel angka.)

## 2. Cara audit dan batasan
- Git: repo RAKA di cabang `claude/great-clarke-ln684h`, `git status` bersih sebelum dan sesudah audit selain dua file baru (laporan + draf). Tidak ada commit/push.
- Dibaca penuh: `CLAUDE.md`, `WORKFLOW.md`, `STATUS.md` (bagian awal), tiga skill, `brand/dna-video.md`, `brand-kit.md`, `gaya-growkaz.md`, `sutradara.md`, `kerangka-cerita.md`, `eksperimen.md`, `formula.md`, `cek-bug.md`, `brand/growkaz/style-bible.md` (bagian kamera), `engine/core.js`, `player.js`, bagian `rig2d.js`, `tools/cek-sutradara.py` (bagian kamera/animasi), `audio/mix.py` (bagian ambience), `lima-menit-shorts/.../01_komik.js` (bagian helper).
- Sumber Motion Skills dibaca penuh: `animation-principles`, `motion-art-direction`, `shot-composition`, `beat-sync-editing`, `short-form-video`; sebagian: `remotion-video`, `explainer-video`. File `references/*` tidak dibaca.
- **Tidak diverifikasi:** hasil render nyata (tidak boleh render), `palet-emosi.md` (hanya warna), isi video lama, file `STATUS.md` setelah 5 KB pertama. Klaim "komik #18 tanpa `cam`" tidak dicek; hanya #17.
- Statistik di `short-form-video` (70% view-through, 87% putuskan dalam 3 dtk, 58% vs 41%) **tanpa sumber**; tidak dipakai.

## 3. Sistem gerak RAKA saat ini

### 3.1 Peta per kategori
| Kategori | Yang sudah ada | Sumber |
|---|---|---|
| A. Identitas visual | stickman hitam + rim light + maskot `#d64a33`; gelap-terang 60–75% bingkai tengah gelap; parallax 0,1–0,2 / 0,3–0,4 / 0,5–0,6 / 0,8–0,9 / 1,0 / 1,5–1,8; latar depan buram; atmosfer; busur cahaya malam→fajar; **gaya komik terang sejak #17** | `dna-video`, `gaya-growkaz`, `styles.js` |
| B. Cerita | hook frame 0 / vonis di awal; Pukulan ke-99 (cermin, konflik, twist riset, hening, aksi nyata, loop); satu tokoh satu perubahan; momen khas; arahan per kalimat | `kerangka-cerita`, `sutradara.md`, `STATUS.md` (reset 23 Nov) |
| C. Gerak | lihat 3.2 | `sutradara.md`, `gaya-growkaz`, `style-bible`, engine |
| D. Teknis | engine canvas 2D deterministik (`renderFrame(f)`), 24 fps, `t`-driven, `rng(seed)`/`noise`, CPU, Remotion hanya untuk `remotion-3d/` | `core.js`, `player.js`, `remotion-fitur` |

### 3.2 Aturan gerak yang ada (diaudit: fungsi dan konteks)
| # | Aturan | Fungsi | Konteks tepat | Penilaian |
|---|---|---|---|---|
| 1 | Satu aksi utama per shot; pendukung 50–70% jarak, mulai 3–5 frame (100–200 ms) lebih lambat; gerak latar <5% | hierarki | semua gaya | Fungsi benar. "Gerak latar <5%" **ambigu** (5% dari apa?). |
| 2 | Masuk ease-out 10–18 frame, keluar ease-in 40–50% lebih singkat | mendarat lembut | sinematik | Terlalu lambat untuk komik (pop 5–8 frame); bukan salah, tapi tidak universal. |
| 3 | Angka/stempel: antisipasi 3 frame, 1,0→1,08→1,0 dalam 6 frame | penekanan angka | sinematik, angka kunci | Cakupan sudah disebut ("angka/stempel"); tapi `cek-sutradara` memperlakukannya sebagai kehadiran kata kunci; komik memakai 2,4→1. Risiko **mekanis bila diseragamkan**. |
| 4 | Kamera tidak pernah diam; tahan pun didorong ≤2% | hidup, anti-datar | GrowKaz sinematik | Fungsinya valid; sebagai larangan mutlak **bertentangan dengan stillness** dan tidak relevan untuk komik. |
| 5 | Ganti gambar tiap 2–3,5 dtk; shot >3,5 dtk harus berubah di dalamnya (`sutradara.md`) vs >5,5 dtk (`sutradara` skill, cek) | retensi | umum | **Tidak konsisten** (3,5 vs 5,5). #17 rata-rata 3,9 dtk/shot, #18 3,6 dtk/shot. |
| 6 | Teks tahan ≥0,3 dtk/kata+0,5; teks tidak bergerak saat dibaca; dorongan maks 2% | keterbacaan | semua | Kuat, jelas, tepat. |
| 7 | SFX 1 frame setelah gambar; flash ≤3×/dtk | sinkron/keamanan | semua | Kuat. Flash = keselamatan fotosensitif, jangan dilonggarkan. |
| 8 | Dilarang: semua masuk bersamaan; fade-naik tiap elemen; easing linear (kecuali putaran) | anti-mekanis | semua | Kuat. Kurang pasangan positif (**stagger berapa**?). |
| 9 | `breathe(pose, t, amt, seed)` sin 1,6 px, periode ±3 dtk, fase beda per seed | hidup | semua | Dipakai otomatis; **seragam**, tidak pernah dimodulasi emosi; `amt` ada tapi tak ada panduan. |
| 10 | `posesAt(..., blend=0.35)` + `blendPose` `ease.inOut` | pindah pose | semua | Durasi/kurva sama untuk melempar dan duduk; interpolasi lurus (tanpa arc). |
| 11 | Hening ±2 dtk di puncak emosi + teks diketik | emosi | Pukulan ke-99 | Bagian DNA; status di formula komik **dilonggarkan** (reset 23 Nov). |
| 12 | `walkPose(phase,…)` dengan `stride, lift, bob, arm, lean` | jalan | semua | Parameter ada; kecepatan fase konstan; awal/akhir langkah tak diatur. |

Bagian paling kuat: kosakata kamera + parallax + latar depan buram; waktu baca; sinkron kata; larangan anti-mekanis; determinisme engine.
Bagian paling lemah: gaya komik tanpa dokumen gerak; bobot/arc/settle/diam; cek otomatis untuk gerak.

## 4. Analisis sumber Motion Skills
| Skill | Nilai nyata | Catatan/kehati-hatian |
|---|---|---|
| `animation-principles` | peta kurva↔niat; **durasi menyesuaikan jarak/berat**; stagger; 1/3 rule; antisipasi/follow-through/arc; diagnosis "kaku/melayang/murahan" | angka dalam ms dan cubic-bezier CSS; contoh UI; "Linear reserve for loops" sejalan dengan RAKA |
| `motion-art-direction` | **motion personality** (nama, durasi, overshoot), motion hierarchy hero/support/texture, restraint, spec bahasa gerak | 4 preset UI-sentris; "two eases max" dan "one wow" terlalu kaku untuk komik |
| `shot-composition` | peran kedalaman, "one shot one intent", enter/exit searah baca | grid 12 kolom, rule of thirds, restack 16:9→9:16, zona aman (angka lebih longgar dari RAKA) tidak relevan |
| `beat-sync-editing` | cut on action, J/L-cut, hold setelah klimaks, kontur ritme | seluruh matematika BPM→frame tidak berlaku (musik di bawah VO) |
| `short-form-video` | frame 0 = hook, loop, gerak berbasis frame | formula retensi tanpa sumber; ganti visual 2–4 dtk (RAKA sudah punya versi sendiri) |
| `remotion-video` | pola frame-driven, clamp interpolate | RAKA tidak memakai Remotion untuk video utama (keputusan user 14 Nov); `remotion-fitur` sudah ada |
| `explainer-video` | 1 ide per scene; 2,3 kata/dtk | format explainer ≠ RAKA; duplikat arahan per kalimat |

## 5. Matriks perbandingan
Keterangan: **Existing** = di RAKA saat ini; **Gap** = apa yang belum ada; **Conflict** = bentrok dengan aturan RAKA (K# = §7).

| # | Principle | Source | Existing RAKA | Gap | Conflict | Decision | Reason |
|---|---|---|---|---|---|---|---|
| 1 | Peta kurva menurut niat (enter ease-out, exit ease-in, move inOut) | animation-principles | sutradara #8: masuk ease-out, keluar ease-in; style-bible: inOut gerak, out untuk snap | tidak ada peta untuk jatuh, pantulan, pop, pose blend | – | **ADAPT** | prinsip sudah ada sebagian; tambah peta niat→kecenderungan kurva dari 7 kurva engine saja |
| 2 | Tiga pilar (emosi/narasi/kerajinan) | animation-principles | logline + arahan per kalimat ("kenapa orang tetap nonton") | – | – | **KEEP** | duplikat struktur sutradara |
| 3 | Tiga lapisan gerak primer/sekunder/ambient | animation-principles, motion-art-direction | hierarki sutradara B8 | definisi "<5%" ambigu | K6 | **KEEP** (+ADAPT definisi) | sudah ada; perbaiki dengan "gerak yang merebut perhatian" |
| 4 | Durasi menurut jarak/berat/ukuran | animation-principles | tidak ada | seluruhnya | – | **ADD** | gap nyata; heuristik murah, netral biaya |
| 5 | Stagger 40–80 ms, cap ±700 ms | animation-principles | larangan "semua masuk bersamaan" tanpa angka | angka stagger | – | **ADAPT** | 40–80 ms = 1–2 frame @24, nyaris tak terlihat; **[v0.2]** angka usulan dihapus; stagger menjadi teknik eksperimental tanpa selang |
| 6 | 1/3 rule: jarak | animation-principles, shot-composition | – | – | transisi swipe/whip menempuh layar penuh | **ADAPT** | berlaku untuk elemen dalam adegan, bukan transisi |
| 7 | 1/3 rule: simultan | animation-principles | "setiap shot ada kamera+atmosfer+parallax" | definisi gerak yang dihitung | K6 | **ADAPT** | hitung hanya gerak yang merebut perhatian |
| 8 | Antisipasi 60–120 ms | animation-principles | 3 frame (125 ms) untuk angka | skala menurut aksi | K2 | **ADAPT** | angka sama; jadikan proporsional dan opsional |
| 9 | Follow-through/overlap | animation-principles | hanya jeda pendukung 3–5 frame | settle untuk bagian terpisah (properti, bayangan, FX) | – | **ADAPT** | rig tak punya kain/rambut; terapkan hanya pada yang sudah digambar terpisah |
| 10 | Arc | animation-principles | tidak ada; blend lurus (terverifikasi) | seluruhnya | – | **ADAPT** | solusi via breakdown pose di kode adegan; fix engine = usulan terpisah (K12) |
| 11 | Spring vs durasi | animation-principles | `outBack`, `outElastic`, pegas teredam `exp·cos` di komik | penamaan resmi | – | **KEEP** | rumus tertutup deterministik sudah dipakai; angka stiffness/damping Framer ditolak |
| 12 | Diagnosis kegagalan (kaku, melayang, murahan, mekanis) | animation-principles | cek-sutradara parsial | checklist gerak | – | **ADAPT** | masuk Daftar Periksa Kualitas |
| 13 | Beat sync: pukul tepat beat | animation-principles, beat-sync | kata VO (`wordTime`), SFX +1 frame, musik −17 dB | – | K5 | **ADAPT** | metronom = VO, bukan musik |
| 14 | Motion personality bernama | motion-art-direction | tidak ada; sinematik dan komik hidup berdampingan tanpa dokumen | gap terbesar | K3, K4 | **ADAPT** | **[v0.2]** dua kecenderungan perilaku, dipilih dari arah gerak (bukan palet), bukan empat preset UI |
| 15 | Spec bahasa gerak (1 easing family, 1 base unit, stagger, hold) | motion-art-direction | – | – | "two eases max" vs komik | **ADAPT** | **[v0.2]** batas jumlah kurva dihapus; cukup waspada kurva acak tanpa alasan |
| 16 | Hierarki hero/support/texture | motion-art-direction | B8 + GrowKaz | – | – | **KEEP** | duplikat |
| 17 | Restraint ("one wow", tak ada overshoot di konten serius) | motion-art-direction | larangan partikel hiasan, flash, linear | daftar restraint tertulis | K3 | **ADAPT** | restraint ya; "one wow" ganti dengan momen khas yang sudah ada |
| 18 | Hold discipline (rest setelah beat) | motion-art-direction | waktu baca; napas ≥5 dtk; hening | tahan setelah benturan | – | **ADAPT** | tulis sebagai ritme kontras di komik |
| 19 | Pacing: tegang→lepas | motion-art-direction, beat-sync | ritme tidak rata, CV ≥0,25 | – | – | **KEEP** | sudah ada, terukur |
| 20 | Grid 12 kolom, baseline 8 px | shot-composition | tata letak lewat `V()`, safe zone | – | – | **REJECT** | engine prosedural 1080×1920; tidak relevan |
| 21 | Rule of thirds (power point) | shot-composition | tokoh di depan area terang; kiri→kanan; pita CC tetap | – | staging berbasis cahaya + CC | **REJECT** (sebagai aturan) | aturan RAKA lebih spesifik dan berbasis cahaya |
| 22 | Hierarki visual: ukuran > kontras > warna > posisi | shot-composition | `cek-visual` kontras ≥1,8; siluet terbaca | – | – | **KEEP** | sudah terukur |
| 23 | Ruang negatif | shot-composition | 60–75% gelap (sinematik) | komik: tak disebut | – | **ADAPT** | satu kalimat staging komik di draf |
| 24 | Lapisan bg/mid/fg + kecepatan parallax | shot-composition | 6 lapisan, latar depan 1,5–1,8 | – | – | **KEEP** | RAKA lebih kaya (angka 0,2/0,6/1,2 ditolak) |
| 25 | Satu shot satu niat kamera | shot-composition | B4 "kamera beralasan, ≥4 jenis" | izinkan diam | K1 | **ADAPT** | satu niat boleh dua sumbu; diam diizinkan (butuh persetujuan) |
| 26 | Resep kamera (push-in 1,0→1,10, whip, orbit, dolly-zoom) | shot-composition | push 1,05–1,10, roll, shake, orbit 3D | – | – | **KEEP** | sudah ada |
| 27 | Enter/exit searah baca | shot-composition | tokoh utama kiri→kanan, swipe ke atas | kontinuitas arah gerak antar cut | – | **ADAPT** | satu baris kontinuitas |
| 28 | Zona aman 9:16 | shot-composition, short-form | `tools/safezone.py` | – | K7 | **REJECT** | satu sumber angka RAKA, lebih ketat |
| 29 | Restack bukan crop | shot-composition | native 9:16 | – | – | **REJECT** | tak relevan |
| 30 | BPM→frame, cut per frasa 2/4/8 beat | beat-sync | cut di awal kata, shot dibuka 0,1–0,2 dtk sebelum frasa | – | K5 | **REJECT** | musik di bawah VO |
| 31 | Cut on action, cocokkan arah/kecepatan | beat-sync | tidak tertulis; match cut di backlog `eksperimen.md` | cut-on-action | – | **ADAPT** | berlaku bila dua shot sama-sama bergerak; match cut tetap backlog |
| 32 | Hard cut default, transisi bermotif | beat-sync | cut ≥80% | – | – | **KEEP** | sudah ada |
| 33 | J-cut / L-cut | beat-sync | ambience per shot, fade 0,4 dtk; VO mulai ≤0,5 dtk | audio menjembatani cut | – | **ADAPT** (perlu verifikasi) | `mix.py` punya ambience per shot; belum dicek apakah bed bisa lintas shot tanpa fade |
| 34 | Speed ramp/time remap | beat-sync | freeze-frame, impact frame; tanpa slow-mo | tahan benturan, remap `t` | K10 | **ADAPT** | `draw(g,t)` murni fungsi `t`, jadi remap lokal gratis; optical flow/blur ditolak |
| 35 | Arc energi (Establish→Climax→Resolve) | beat-sync | kerangka-cerita | – | – | **KEEP** | duplikat |
| 36 | Hook frame 0, tanpa fade-up | short-form | frame 0 gambar jadi; `fadeIn 0` | – | – | **KEEP** | sudah baku (catatan: `player.js` default `fadeIn ?? 0.5`, pastikan config selalu `fadeIn: 0`) |
| 37 | Pattern interrupt tiap 2–4 dtk, tak seragam | short-form | 2–3,5 dtk, CV ≥0,25 | – | K8 | **KEEP** | sudah ada; tidak dijadikan kewajiban baru |
| 38 | Punch-in 1,12 pada beat | short-form | kamera maks 2% di teks | – | K9 | **ADAPT** | hanya komik, tidak saat teks dibaca |
| 39 | Loop first=last frame | short-form | ending melingkar | – | – | **KEEP** | sudah ada |
| 40 | Statistik retensi (70%, 87%, 58/41) | short-form | `formula.md` mengukur data sendiri | – | – | **REJECT** | tanpa sumber; data user lebih bernilai |
| 41 | Semua nilai dari frame, tanpa `Date.now`/`Math.random` | short-form, remotion-video | engine deterministik; `rng(seed)` | – | – | **KEEP** | sudah dijamin |
| 42 | Remotion `spring/interpolate/Sequence` | remotion-video | `remotion-fitur` untuk sisipan | – | K13 | **REJECT** | duplikat; engine utama bukan Remotion |
| 43 | Satu ide/scene, pemetaan VO→visual, 2,3 kata/dtk | explainer-video | arahan per kalimat; ≤3,4 kata/dtk | – | – | **REJECT** | RAKA bukan explainer; duplikat |
| 44 | Pilih satu analogi | explainer-video | satu metafora fisik per video | – | – | **KEEP** | sudah ada |

**Tambahan dari audit RAKA (bukan dari Motion Skills):**
| # | Principle | Existing | Gap | Decision | Reason |
|---|---|---|---|---|---|
| 45 | Bayangan mengecil saat benda naik (isyarat bobot) | `drawFigure` elips tetap (terverifikasi) | tak ada panduan | **ADD → [v0.2] dikeluarkan dari skill** | kandidat implementasi terpisah (0.5) |
| 46 | Pose antara (breakdown) untuk arc | `posesAt` mendukung | tak didokumentasikan | **ADD → [v0.2] opsional** | hanya bila hasilnya sepadan; bukan syarat arc |
| 47 | Tahan benturan (hit-stop) | impact frame putih ±3 frame di komik | belum dinamai/diuji | **ADD → [v0.2] eksperimental** | angka frame dihapus; belum ada bukti efek |
| 48 | Awal/akhir langkah (ease pada `phase`) | `walkPose` fase konstan | – | **ADD → [v0.2] contoh saja** | tertulis kualitatif di contoh berjalan |
| 49 | Napas bermodulasi/nol di momen hening | `breathe amt` ada | panduan nilai | **ADD → [v0.2] kualitatif** | "dapat dikurangi atau dimatikan", tanpa nilai |

**Hitungan keputusan (44 baris dari sumber):** KEEP 15 · ADAPT 20 · ADD 1 · REJECT 8 (+ 5 tambahan ADD dari audit internal). Angka ADD kecil karena sebagian besar prinsip sudah ada dalam bentuk lain.

## 6. Bukti verifikasi
- `drawFigure`: bayangan `ellipse(o.x, o.y+2, 34*s, 6*s)` tetap; dimatikan bila `o.rot` (rig2d.js:199).
- `blendPose` = `mixVal` per sendi dengan `ease.inOut` (rig2d.js:40); lengan digambar polyline `sh→e→h` dari posisi tersebut, tanpa IK. IK hanya untuk kaki di `walkPose`.
- `cek-sutradara.py:61` mencari `cam = {…}`; `grep -c` pada `lima-menit-shorts/scenes/shots/01_komik.js` = 0, dan kata `cam` tak muncul sama sekali.
- `cek-sutradara.py:127` antisipasi = regex `overshoot|back\(|antisip`.
- Helper gerak komik didefinisikan lokal per proyek: `pop` (0,28 dtk, `outBack`), `slamK` (0,2 dtk, 2,4→1), `shk` (0,3 dtk, amp 22) di `lima-menit-shorts`; pantulan `exp(-5Δt)·cos(22Δt)` dan impact frame 0,12 dtk di `uji-komik`.
- Biaya: `WORKFLOW.md` (sinematik 56 dtk ±10 mnt) vs `STATUS.md` #18 (komik 64 dtk ±1,5 mnt); kondisi mesin mungkin berbeda, jadi indikatif.

## 7. Analisis konflik
Format: (1) aturan existing · (2) prinsip referensi · (3) sebab · (4) risiko bila referensi diterapkan · (5) rekomendasi · (6) perlu persetujuan?

**K1. Kamera tidak pernah diam vs stillness**
1. `growkaz-style` #3, `style-bible` "Every shot moves", `sutradara` B4, `cek-sutradara` ≥50% adegan. 2. `shot-composition` (kamera bergerak hanya bila bertujuan), `motion-art-direction` (diam sebagai keputusan). 3. GrowKaz asli dibuat agar tidak datar; komik dan momen hening tidak memerlukannya. 4. Memaksa gerak mengacaukan hening dan teks dibaca (sudah dibatasi 2%). 5. Draf (v0.2: diam sebagai keputusan sah, dengan catatan keselarasan) menyebutnya sebagai **usulan**, aturan lama tetap menang selama belum disetujui; "drift ≤2%" sudah efektif mendekati diam. 6. **Ya.**

**K2. Antisipasi 3 frame dan skala 1,0→1,08→1,0 vs "sesuaikan aksi"**
1. `sutradara` B9, `sutradara.md`. 2. `animation-principles` (60–120 ms, tak semua butuh). 3. Aturan RAKA bercakupan "angka/stempel" tapi tertulis seperti hukum; komik memakai 2,4→1. 4. Seragamnya gerak = mekanis; cek regex mendorong menaruh kata kunci. 5. Dalam draf angka dipertahankan dalam cakupannya, ditambah "proporsional dan opsional". 6. **Ya** bila ingin merevisi dokumen sutradara; **tidak** untuk draf.

**K3. Kosakata easing: "dua kurva saja / tanpa overshoot di konten serius" vs komik `outBack`/`outElastic`**
1. DNA melarang linear; komik memakai overshoot. 2. `motion-art-direction`. 3. Sumbernya kalibrasi UI korporat. 4. Memaksa dua kurva menghapus karakter komik. 5. **REJECT** batas dua kurva; **[v0.2]** tidak ada batas pengganti. 6. Tidak (hanya draf).

**K4. Angka durasi: ease-out 10–18 f (420–750 ms) vs UI 200–400 ms; komik 5–8 f vs "energetic" 100–250 ms**
1. `sutradara.md`. 2. `animation-principles`/personality. 3. Dua gaya, satu tabel. 4. Menyeragamkan ke angka luar = salah satu gaya terasa lambat/cepat. 5. **[v0.2]** Dua kecenderungan perilaku tanpa tabel angka (draf §2); angka tertulis hanya berlabel [R]/[E] sebagai rujukan, bukan standar. 6. **Ya** (menamai kecenderungan di dokumen resmi; angka [E] tetap belum di-ACC).

**K5. Beat/BPM grid vs VO-driven timing**
1. musik −17 dB di bawah VO, cut di awal kata (`cek-sutradara` potongan jatuh di awal kata), shot dibuka 0,1–0,2 dtk sebelum frasa. 2. `beat-sync-editing`. 3. Sumber dibuat untuk video bermusik; RAKA bernarasi. 4. Memaksa sinkron musik merusak sinkron kata. 5. **REJECT**; pertahankan `wordTime`. 6. Tidak.

**K6. 1/3 rule simultan vs "setiap shot bergerak" (kamera+atmosfer+parallax)**
1. GrowKaz checklist §6; larangan tidak ada elemen bergerak. 2. `animation-principles`. 3. Definisi "bergerak". 4. Menerapkan literal menghapus atmosfer GrowKaz. 5. Hitung hanya gerak yang merebut perhatian. 6. Tidak (interpretasi di draf), disarankan konfirmasi.

**K7. Zona aman**
1. `tools/safezone.py` satu sumber angka. 2. MS: bawah ±320 px, atas ±120, kanan ±120 (lebih longgar). 3. Perbedaan sumber. 4. Teks tertutup UI TikTok (bug #2 pernah terjadi). 5. **REJECT** angka MS. 6. Tidak.

**K8. Pergantian visual 2–4 dtk, "no dead air" vs hening ±2 dtk dan shot ≥5 dtk**
1. DNA hening; sutradara napas ≥5 dtk. 2. `short-form-video`. 3. Sumber retensi generik. 4. Hening hilang. 5. Aturan RAKA menang. Sekaligus catat **inkonsistensi internal**: shot "harus berubah" di >3,5 dtk (`sutradara.md`) vs >5,5 dtk (skill, cek). 6. **Ya** untuk menyelaraskan angka itu, tetapi di luar scope task ini.

**K9. Punch-in 112% pada beat vs dorongan kamera ≤2% saat teks dibaca**
1. `sutradara.md`. 2. `short-form-video`. 3. Teks CC tetap di posisi baku. 4. Teks goyang saat dibaca. 5. Boleh hanya di komik dan sebelum teks muncul. 6. Tidak.

**K10. Motion blur / speed ramp optical-flow vs CPU dan engine**
1. engine tanpa motion blur; `trail`, `speedLines` sebagai pengganti. 2. `beat-sync-editing`. 3. Beda mesin (NLE/Remotion). 4. Render ×N, `CameraMotionBlur` hanya untuk potongan pendek di `remotion-3d`. 5. **REJECT** sebagai default; remap `t` lokal sebagai ganti. 6. Tidak.

**K11. Satu kepribadian per proyek vs palet/gaya berganti per video**
1. gaya berganti antar video; maks 2–3 palet per video. 2. `motion-art-direction` ("pilih satu, komit"). 3. RAKA memilih gaya per video. 4. Mencampur kepribadian mengaburkan kesatuan. 5. **[v0.2]** Kepribadian **tidak** mengikuti gaya/palet. Dipilih dari arah gerak; boleh berpindah dalam satu video bila maksud adegan memintanya dan pengalaman visual tetap koheren. 6. Tidak.

**K12. Pose blending lurus vs arc/bobot**
1. `blendPose`/`posesAt`. 2. `animation-principles` arcs. 3. Keterbatasan engine, bukan aturan. 4. Memperbaiki di engine = mengubah engine (dilarang). 5. Solusi di kode adegan (breakdown pose); perbaikan IK engine hanya sebagai usulan terpisah. 6. **Ya** bila ingin menyentuh engine.

**K13. Remotion `spring()` vs engine GrowKaz**
1. `STATUS.md`: uji Remotion untuk RAKA ditolak (14 Nov); `remotion-fitur` hanya `remotion-3d/`. 2. `remotion-video`. 3. Beda engine. 4. Duplikasi/pindah engine. 5. **REJECT**. 6. Tidak.

## 8. Analisis gap (berurutan menurut dampak)
| # | Gap | Bukti | Dampak | Tindakan di draf |
|---|---|---|---|---|
| G1 | Gaya komik tanpa panduan gerak | angka hanya di kode lokal tiap proyek | tiap video mengarang ulang helper dan angka | §2 tabel kepribadian |
| G2 | Cek otomatis buta pada komik | regex `cam = {` → 0; antisipasi = kata | video komik gagal/lolos karena alasan salah | dicatat saja; tidak mengubah alat |
| G3 | Bobot tidak dibahas | tidak ada di dokumen | benda berat dan ringan bergerak sama | §6 |
| G4 | Arc dan pose blend lurus | rig2d.js:40 | aksi lengan terlihat kaku di shot dekat | §9 breakdown pose |
| G5 | Diam/hold tak punya kebijakan | K1; `breathe` otomatis | momen hening dihias berlebihan | §12 |
| G6 | Settle/follow-through | hanya jeda pendukung | benda berhenti serentak | §8 |
| G7 | Bayangan tidak merespons tinggi | drawFigure | isyarat bobot paling murah terlewat | **[v0.2]** tidak dibahas di skill; kandidat terpisah |
| G8 | Angka tidak konsisten/ambigu | 3,5 vs 5,5; "<5%" | keputusan ad hoc | dicatat K8, definisi di §10 |
| G9 | Awal/akhir langkah, kamera mengikuti | `walkPose` fase konstan | jalan seperti loop | §18 contoh |
| G10 | Stagger tanpa angka | larangan tanpa pasangan | kartu muncul serentak atau acak | **[v0.2]** teknik eksperimental tanpa selang |

**Bukan gap (jangan disentuh):** parallax, kosakata shot, transisi, SFX, waktu baca, zona aman, determinisme.

## 9. Ide di luar arus utama (dievaluasi, bukan dipaksakan)
Kerangka tanya "apa yang dilewatkan semua orang": Motion Skills berasal dari dunia UI/after-effects; RAKA adalah *stickman 2D prosedural dengan VO sebagai metronom*. Karena itu:
1. **Tahan benturan (hit-stop)** dari anime/gim pertarungan: tahan `t` 2–3 frame pada benturan. Netral biaya; menambah rasa berat lebih murah daripada squash. *Belum ada bukti di video RAKA; usulan uji kecil.*
2. **Animasi "di dua" untuk komik**: kuantisasi `t` tokoh ke 12 pose/dtk, kamera tetap halus. Mengatasi kesan interpolasi mulus-mekanis dan memberi nuansa "liar". *Hipotesis; risiko judder dengan caption; hanya bisa dinilai dari video, bukan still.*
3. **Bayangan sebagai sensor bobot**: 1 elips menjual tinggi lompatan dan hentakan; nol dependensi. *Verifikasi cepat lewat still.*
4. **Remap waktu lokal sebagai pengganti motion blur dan speed ramp NLE.** Karena shot adalah fungsi `t`, slow-in menjelang reveal gratis.
5. **Restraint** sebagai pembatas, bukan kreatif tambahan: hampir semua ide mahal di Motion Skills berujung "tambah efek"; di RAKA hasil terbesar datang dari **mengurangi**. **[v0.2]** hitungan "maks 1 primer + 2 pendukung" dihapus; ukurannya keterbacaan.
Yang saya **tolak** walau terdengar canggih: motion blur default, fisika, partikel, grid/rule-of-thirds, retime optical-flow, preset empat kepribadian.

## 10. Arsitektur usulan
| Lapis | Pemilik | Skill motion boleh? |
|---|---|---|
| 1 DNA & identitas | `dna-video`, `brand-kit`, `growkaz-style`, palet | **tidak** menyentuh |
| 2 Cerita & arahan | `kerangka-cerita`, `sutradara` | **tidak** menentukan kapan bergerak/diam; hanya cara |
| 3 Motion Intelligence | draf ini | timing, spacing, bobot, antisipasi, follow-through, arc, hierarki, staging, kamera, ritme, kontinuitas |
| 4 Engine & implementasi | `engine-api.md`, `core.js`, `rig2d.js`, `remotion-fitur` | kompatibel; tanpa ubah |
| 5 QC | `cek-sutradara.py`, `cek-visual.py`, `cek-bug.md` | draf menyumbang daftar periksa (tertulis, bukan kode) |

**Sumber aturan utama bila tumpang tindih:** DNA/cerita > `growkaz-style` (tampilan) > `sutradara` (angka + alat cek) > `motion-intelligence` (cara eksekusi, hanya mengisi celah) > `remotion-fitur` (hanya `remotion-3d/`).

## 11. Rancangan integrasi (BELUM dijalankan)
Hanya bila disetujui, bertahap:
1. Pilih **mode**: (A) skill referensi opsional dipanggil manual; (B) tambah satu baris rujukan di `sutradara` Tahap 5 dan checklist `gaya-growkaz` §6; (C) mode B + tulis helper gerak komik ke dokumen `brand/` (tanpa kode).
2. Uji pada **satu** video berikutnya: bandingkan hanya dengan mata, tanpa mengubah engine; catat di `brand/eksperimen.md` (aturan "1–2 eksperimen per video").
3. Hanya jika berguna: revisi angka `sutradara.md` dan harmonisasi 3,5 vs 5,5.
4. **Terakhir, dan hanya atas ACC terpisah:** perbaikan alat cek (regex kamera komik) dan helper bersama; perbaikan IK `blendPose`. Ini mengubah kode dan di luar scope audit ini.
Tidak ada perubahan `CLAUDE.md`/`WORKFLOW.md` yang disarankan pada tahap awal.

## 12. Pertimbangan biaya render
| Kategori | Prinsip |
|---|---|
| **Netral** | kurva, durasi, stagger, settle, breakdown pose, remap `t`, hit-stop, bayangan 1 elips, `shake`, impact frame, ritme/tahan, kontinuitas |
| **Tambah kecil (ukur)** | `trail` (N+1 gambar tokoh), `speedLines` padat, parallax tambahan |
| **Perlu evaluasi/ACC** | `blurLayer` tambahan (blur kanvas), shot 3D tambahan, bloom/grain/grade berat, `CameraMotionBlur` ×N |
Titik data (indikatif): sinematik ±10 mnt/56 dtk vs komik ±1,5 mnt/64 dtk. Biaya dipicu **lapisan**, bukan gerak. Draf mendorong ekspresi lewat kurva waktu.

## 13. Validasi draf (menilai v0.1; hasil v0.2 di §0)
**Review A — Redundansi.** Draf **tidak** menyalin: palet/tokoh/rim light (DNA, GrowKaz), struktur naskah (kerangka), API (`engine-api`), zona aman, SFX. Tumpang tindih disengaja dan diberi rujukan: hierarki (§10) mengikuti sutradara B8, antisipasi angka (§7) merujuk sutradara B9, waktu baca tidak diulang. Risiko duplikasi sedang di §2: angka sinematik berasal dari `sutradara.md`; bila angka itu direvisi, draf harus disinkronkan (pemilik: `sutradara.md`).
**Review B — Konflik.** Draf tidak mengubah identitas, cerita, urutan produksi, tokoh, palet. Dua titik sentuh yang butuh persetujuan: "kamera boleh diam" (K1, ditandai usulan) dan penamaan kepribadian (K4). Tidak memaksa audio sync, kamera, atau motion tertentu; menambahkan frasa "Bila ragu: kurangi".
**Review C — Praktis.** Ya bisa dipakai: tabel angka berdasar kode nyata, kerangka keputusan 12 pertanyaan dengan keluar dini, lima contoh. Istilah ambigu yang tersisa: "merebut perhatian" (definisi ada, ukuran mata), "stagger 2–4 frame" dan "durasi ±30–50% saat jarak berlipat" adalah **heuristik belum diuji**; ditandai. Panjang ±200 baris, di atas target "ringkas" bila dibaca penuh; dapat dipotong ke §2, §6, §10, §16 sebagai inti.
**Review D — Biaya.** Seluruh isi draf netral biaya kecuali baris yang ditandai di §15 draf (trail, speedLines, blurLayer, 3D, bloom, motion blur). Tidak ada rekomendasi yang memaksa penambahan lapisan.
**Uji lima contoh (apakah draf memberi arahan kontekstual):**
| Contoh | Hasil |
|---|---|
| Lempar batu | beda sesuai framing dan gaya: wide sinematik pakai antisipasi+arc+recovery; insert komik melewatkan tubuh. Lulus. |
| Berjalan | memakai parameter `walkPose` yang ada, ease `phase` di awal/akhir, kamera mengikuti. Lulus; **kelemahan:** tidak ada panduan batas `lean/bob` untuk emosi (angka belum ada). |
| Berhenti dan diam | napas turun, kamera ≤2%/terkunci, tanpa partikel baru. Lulus; butuh ACC K1 untuk "terkunci". |
| Reveal | jenis reveal bergilir; antisipasi + tahan baca. Lulus; tidak mendefinisikan katalog reveal (sengaja). |
| Banyak elemen | 1 primer + ≤2 pendukung, redam sisanya, atau pecah jadi dua shot. Lulus. |

## 14. Rekomendasi
**Layak dengan revisi.**
- Layak karena celah di gaya komik, bobot, arc, diam, dan konsistensi angka itu nyata (G1–G10) dan dapat ditutup **tanpa kode, tanpa dependensi, tanpa biaya render**.
- **[v0.2]** Revisi sebagian sudah dikerjakan (0.1); sisanya: (1) pangkas ke inti bila terlalu panjang, (2) teknik eksperimental harus divalidasi dengan satu video uji, (3) K1 dan K4 harus diputuskan Anda, (4) alat cek tidak disentuh dulu.
- Tidak disarankan: mengadopsi Motion Skills secara utuh, empat preset, grid/thirds, sinkron BPM, motion blur default.

## 15. Pertanyaan yang butuh persetujuan Anda
1. **K1:** Boleh ada shot tanpa gerak kamera (momen hening/komik/teks dibaca), menggantikan "tidak pernah diam"? Atau tetap larangan mutlak?
2. **K4 [v0.2]:** Setuju dua kecenderungan gerak (sinematik, komik) sebagai konsep perilaku, dipilih dari arah gerak (bukan palet), tanpa membakukan angka [E]?
3. **Mode integrasi (§11):** A (manual), B (rujukan di sutradara/growkaz), atau C?
4. **Uji lapangan [v0.2]:** boleh satu video berikutnya dipakai uji terbatas teknik eksperimental (hit-stop, di dua, stagger, pose antara) dan dicatat di `eksperimen.md`?
5. **K8:** Setuju menyelaraskan ambang 3,5 vs 5,5 dtk di dokumen nanti?
6. **Engine/alat cek:** apakah boleh membuka tahap terpisah untuk (a) regex kamera komik di `cek-sutradara`, (b) IK pada `blendPose`? Saat ini **tidak** saya sarankan sebelum tahap uji.
7. **Draf SKILL.md** memakai `disable-model-invocation: true` dan deskripsi bertanda DRAFT agar tidak terpicu otomatis; setuju tetap di `.claude/skills/` atau dipindah ke `research/` sampai disetujui?
