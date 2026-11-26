---
name: motion-intelligence
description: "[DRAFT v0.3-uji, NONAKTIF, belum disetujui user. Jangan dipakai di produksi.] Lapisan prinsip dan keputusan gerak untuk video RAKA (engine 2D GrowKaz, 24 fps, deterministik, CPU): maksud gerak, timing, spacing, bobot dan momentum, antisipasi, follow-through, arc, hierarki, staging, kamera, ritme, diam, kontinuitas."
disable-model-invocation: true
---

# Motion Intelligence (DRAFT v0.3-uji, 25 Nov 2026)

> **Status: draf untuk review manusia** (`research/motion-intelligence-audit.md`). Belum terhubung ke `CLAUDE.md`, `WORKFLOW.md`, `growkaz-style`, `sutradara`, maupun `remotion-fitur`; tidak ada skill lain yang merujuknya. Aktifkan hanya atas persetujuan user.

**Cara membaca angka di skill ini.** Setiap angka punya label status:
- **[R]** konvensi tertulis RAKA yang sudah ada (pemiliknya dokumen lain; skill ini tidak menambah kewajiban).
- **[E]** nilai yang tertanam di kode komik. `pop`, `slamK`, `shk` dipakai di #17 dan #18; pantulan dan impact frame hanya ada di `uji-komik`. **Bukan standar**: arah gerak komik diputuskan user (23 Nov), tetapi angkanya belum pernah di-ACC.
- **[T]** fakta teknis engine.
- Tanpa label = tidak ada angka; keputusan diambil dari konteks.
Semua angka hanyalah rujukan awal. Durasi dan intensitas bergantung pada aksi, hierarki visual, konteks adegan, dan arah gerak yang dituju.

## 1. Tujuan dan ruang lingkup
Satu pertanyaan: **bagaimana sebuah gerakan dieksekusi supaya terbaca, terasa wajar, dan melayani cerita.** Skill ini tidak menentukan *apa* yang digambar atau *kapan* cerita bergerak.

| Wilayah skill ini | Wilayah dokumen lain (tidak diulang) |
|---|---|
| timing, spacing, bobot, antisipasi, follow-through, arc, hierarki gerak, kontinuitas, kapan boleh diam | identitas visual, palet, tokoh, cahaya (`dna-video`, `growkaz-style`, `palet-emosi`) |
| memilih kurva dan tempo menurut niat | cerita, momen khas, hening puncak (`kerangka-cerita`, `sutradara`) |
| catatan singkat biaya sebuah keputusan gerak | API, helper, render (`engine-api.md`, `WORKFLOW.md`); zona aman (`tools/safezone.py`) |

**Bila bertabrakan:** DNA dan cerita → keterbacaan → maksud gerak → kewajaran fisik → rujukan gaya → biaya. Bila ragu, kurangi gerak.

## 2. Kepribadian gerak
Ada dua kecenderungan gerak: **Sinematik** dan **Komik**. Keduanya adalah arah perilaku, **bukan resep dan bukan templat wajib**.

**Dipilih dari arah gerak video atau adegan** (apa yang ingin dirasakan penonton dan bagaimana aksinya paling terbaca), **bukan dari palet atau style warna.** Palet menentukan warna; kepribadian menentukan bagaimana benda bergerak. Keduanya keputusan terpisah dan tidak ada langkah baru di workflow: kepribadian cukup dijadikan pertimbangan saat menulis adegan. Satu video boleh berpindah kecenderungan bila maksud adegan memintanya, selama pengalaman visualnya tetap koheren.

**Sinematik:** tempo terkendali; percepatan dan perlambatan alami; gerak halus bila memang cukup; kontinuitas visual; tahan yang bermakna; kamera bergerak karena ada tujuan; menghindari gerak yang tidak perlu.

**Komik:** pose jelas; gerak boleh dilebih-lebihkan bila membantu; kontras tempo yang kuat; antisipasi bila berguna; benturan dan reaksi; transisi cepat bila lelucon atau aksinya diuntungkan; tahan yang disengaja. Unsur yang sudah diputuskan user untuk arah komik (`STATUS.md`, 23 Nov): vonis raksasa dan burst, squash/stretch, speed lines, impact frame, panel terbagi. Semuanya alat yang tersedia, bukan kewajiban tiap adegan.

**Nama:** "Sinematik" dan "Komik" di sini adalah kecenderungan gerak, **bukan** style id (`komik`, `komikMalam`, dll.). Gaya warna apa pun boleh bergerak dengan kecenderungan mana pun yang diminta adegan.

Rujukan numerik yang ada: **[R]** `sutradara.md` (ditulis sebelum gaya komik; belum dinyatakan apakah berlaku untuk komik): masuk ease-out 10–18 frame, keluar ease-in lebih singkat. **[E]** kode komik #17/#18: `pop` 0,28 dtk `outBack`, slam skala 2,4→1 dalam 0,2 dtk, `shake` 0,3 dtk amp 22, pantulan `e^(−5Δt)·cos(22Δt)`, impact frame ±0,12 dtk di `uji-komik`. Nilai-nilai ini tidak dibakukan di sini.

## 3. Maksud gerak
Sebelum menggerakkan sesuatu, tentukan fungsinya: **aksi, arahkan mata, emosi, bobot/momentum, sebab-akibat, perubahan, transisi, atau atmosfer.**
- Gerak tanpa fungsi → jangan dibuat. "Engine sanggup" bukan alasan.
- Satu gerak boleh punya dua fungsi; bila butuh banyak alasan untuk membenarkannya, mungkin itu hiasan.

## 4. Timing dan spacing
Tempo ditentukan dari jenis aksi, bobot, jarak, intensitas, emosi, urgensi, kata VO, dan hierarki visual. Tidak ada durasi universal.
- Satuan kerja: detik atau frame **[T]** 24 fps, 1 frame ≈ 42 ms.
- Jarak dan massa yang lebih besar biasanya butuh waktu lebih panjang agar terbaca; seberapa panjang diputuskan dengan mata.
- Gerak penting biasanya jatuh pada kata yang relevan (`wordTime()`); jangan menyamakan durasi tiga gerak berurutan tanpa alasan.

Kurva (kurva yang ada di engine: `linear, in, out, inOut, sine, outBack, outElastic`, serta rumus osilasi teredam tertutup yang dipakai `uji-komik`). Pilih dari niat:

| Niat | Kecenderungan kurva |
|---|---|
| tiba dan mengendap | ease-out |
| pergi atau terlepas | ease-in |
| berpindah tetapi tetap di layar; kamera | ease-in-out / sine |
| ditarik gravitasi | percepatan sampai benturan, bukan ease-in-out |
| pop, penekanan, vonis | `outBack` atau overshoot lain bila karakternya memang begitu |
| pantulan setelah benturan | osilasi teredam sesuai kekuatan benturan |
| gerak konstan (putaran, progress) | linear; **[R]** skill `sutradara` (larangan B10) menghindari linear di luar itu |

Tidak ada batas jumlah kurva. Cukup waspada bila setiap gerak memakai kurva berbeda tanpa alasan: itu tanda tidak ada satu "tangan".

## 5. Bobot dan momentum
Bobot terbaca dari **sebab dan akibat**, bukan dari kecepatan. Tanyakan:
- **Gaya:** apa yang mendorong atau menarik benda ini, dan seberapa kuat?
- **Percepatan dan perlambatan:** bagaimana kecepatan berubah? Benda berat bisa melesat cepat (jatuh oleh gravitasi, dilempar keras); benda ringan bisa bergerak pelan (ditahan, dikendalikan, melayang).
- **Momentum:** setelah gaya berhenti, seberapa lama benda terus bergerak? Benda bermomentum besar sulit dihentikan dan sulit dibelokkan.
- **Hambatan:** apakah ada yang menahan (tangan, gesekan, udara, tali)? Hambatan mengubah kesan bobot lebih besar daripada massa itu sendiri.
- **Benturan:** bagaimana energi dilepas saat berhenti: memantul, menancap, menggeser, tidak bereaksi sama sekali?
- **Pemulihan:** siapa atau apa yang kembali stabil, dan seberapa cepat?
- **Lingkungan:** apa yang ikut bereaksi (debu, tokoh lain, kamera, benda di dekatnya)?

Jangan menyamakan berat dengan lambat atau ringan dengan cepat. Batu yang jatuh bisa cepat dan berat; kertas yang ditarik pelan bisa ringan dan lambat. Bobot terasa bila sebab dan akibatnya konsisten.

## 6. Antisipasi
Antisipasi membantu bila aksi perlu terbaca lebih jelas atau terasa lebih kuat. Lewati bila aksinya sudah terbaca, bila kejutan adalah poinnya, atau bila gaya komik memang "menghantam" tanpa aba-aba.
- Bentuknya mengikuti aksi (jongkok, ayun belakang, menahan napas, kamera menahan sejenak); panjangnya mengikuti kekuatan aksi, bukan angka tunggal.
- **[R]** satu-satunya rujukan angka tertulis: untuk angka/stempel, antisipasi 3 frame dan skala 1,0→1,08→1,0 dalam 6 frame (`sutradara.md`). Cakupannya angka/stempel, bukan semua gerak; belum dinyatakan apakah berlaku untuk komik.
- Tidak ada kewajiban antisipasi sebelum setiap reveal.

## 7. Follow-through dan overlap
Bagian-bagian sebuah gerakan tidak harus berhenti pada saat yang sama: badan, tangan, benda yang dipegang, label yang menempel, dan efek lingkungan dapat berhenti berurutan.
- Terapkan pada bagian yang memang terpisah di adegan (properti, label, efek). Rig stickman tidak punya kain atau rambut; jangan membuat simulasi.
- Tidak setiap benda memerlukannya. Benda kaku (papan data, kartu) boleh berhenti bersih. Banyak overlap sekaligus merusak keterbacaan gerak utama.

## 8. Arc
- Gerak organik (lengan, lemparan, kepala) sering terasa lebih wajar bila lintasannya melengkung; gerak mekanis, UI, atau komik yang patah boleh lurus. Arc dipakai **bila aksinya menuntut**, bukan di setiap gerakan.
- Tidak ada kewajiban menambah keyframe atau pose antara. Bila lintasan lurus tampak kaku pada aksi yang ditonton lama, itu pertimbangan; solusinya pilihan implementasi yang **belum terbukti** (lihat §14 dan §15), bukan syarat.

## 9. Hierarki gerak
Susun prioritas: **primer** (yang harus dilihat) → **pendukung** (membantu primer mendarat) → **ambient** (hidupnya latar).
- Primer tetap fokus; gerak lain tidak boleh mengganggu keterbacaannya. Bila dua elemen sama-sama merebut mata, turunkan salah satu.
- Berapa banyak gerak pendukung yang pantas bergantung pada adegan: adegan padat memang boleh punya banyak gerak jika arah matanya jelas; adegan lain nyaris tanpa gerak. Ukurannya keterbacaan, bukan hitungan.
- **[R]** referensi lama di `sutradara.md`: pendukung ±50–70% jarak primer, mulai 3–5 frame lebih lambat; dijadikan titik awal, bukan batas.
- Meredam: dim/`veil`, kurangi amplitudo, atau diamkan elemen yang tidak perlu.

## 10. Staging dan kamera
- Siluet dan titik fokus jelas; posisi di luar pita CC dan zona aman (`tools/safezone.py`).
- **Kamera bergerak bila ada tujuan:** reveal, penekanan, mengikuti aksi, memperlihatkan skala, mengubah sudut pandang, menambah beban emosi, mendukung transisi.
- **Diam sebagai pilihan kamera** layak dipertimbangkan bila meningkatkan fokus, bobot emosi, pemahaman, ketegangan, timing, kejutan visual, atau kontras dengan gerak di sekitarnya. Menggerakkan kamera hanya karena "harus bergerak" adalah dekorasi.
- Panduan gerak kamera yang berguna tetap berlaku (dorong, tarik, geser, ikuti, roll, guncang pada benturan, orbit 3D); satu shot sebaiknya punya satu niat kamera, boleh memakai lebih dari satu sumbu.
- Bila kamera mengikuti tokoh, jeda pengikutan memberi rasa bobot; besar jeda ditentukan dari kecepatan dan emosi adegan.
- **Konflik aktual yang belum diputuskan user:** `dna-video.md` §4 ("gerak kamera di setiap shot"), `growkaz-style` #3 dan checklist §6, `style-bible` ("Every shot moves"), dan `sutradara` B4 ("tidak ada kamera diam total") bertentangan dengan butir di atas. Skill ini tidak menentukan mana yang benar. Sampai user memutuskan, produksi tetap mengikuti aturan RAKA yang tertulis (itu status quo, bukan penilaian); butir di atas hanya pertimbangan.

## 11. Ritme, diam, dan restraint
- Ritme lahir dari kontras: cepat dan pelan, gerak dan tahan, benturan dan pemulihan. Tahan setelah benturan atau pengungkapan memberi waktu bagi mata.
- **Diam adalah keputusan gerak yang sah**, baik untuk satu elemen maupun seluruh adegan: fokus, bobot emosi, pemahaman, ketegangan, timing, punchline visual, atau kontras. Adegan boleh nyaris tanpa gerak; adegan lain boleh sangat ramai bila cerita memintanya, asal tetap terbaca.
- Hindari gerak yang tidak melayani cerita: semua elemen bergerak, overshoot di konten yang menuntut kesan serius, guncang tanpa benturan, partikel atau blur tanpa alasan. Kehidupan idle (`breathe`) cukup sampai terasa hidup; di momen hening ia dapat dikurangi atau dimatikan.
- Hening/puncak emosi dan momen khas dimiliki `kerangka-cerita`/`sutradara`; skill ini hanya membantu mengeksekusinya.

## 12. Waktu audio-visual
- Metronom RAKA adalah **VO**, bukan beat musik. Jangan menyinkronkan gerak ke BPM.
- Hubungan SFX-gambar dan gambar-kata dijaga oleh konvensi RAKA yang sudah ada (**[R]** SFX jatuh 1 frame setelah gambar, `sutradara`); skill ini tidak menetapkan offset tambahan. Cukup pastikan gerak penting, bunyinya, dan kata yang relevan terasa satu kejadian.
- Menyiapkan reveal dengan bunyi atau jeda sebelumnya adalah pilihan, bukan kewajiban.

## 13. Kontinuitas
- Arah layar, arah gerak, pakaian, properti, dan posisi benda konsisten dalam satu adegan. (Aturan RAKA "tokoh utama kiri menghadap kanan" hanya untuk shot medium two-shot, `gaya-growkaz` §3.)
- Memotong ketika ada aksi dapat menyamarkan potongan **bila** kedua shot memang punya gerak yang sepadan; kapan tepatnya diputuskan oleh ritme dan kata, bukan persentase aksi. Cut tetap transisi default; transisi lain harus bermakna (**[R]** `growkaz-style`).

## 14. Teknik opsional dan eksperimental
Belum terbukti di RAKA. Bukan standar, bukan aturan, dan tidak boleh dipakai sebagai alasan menolak gerak lain.
| Teknik | Gagasan | Status |
|---|---|---|
| Tahan benturan (hit-stop) | menahan waktu sesaat tepat di benturan | eksperimental, belum diuji di video RAKA |
| Animasi "di dua"/stepped | tokoh diperbarui lebih jarang dari frame rate untuk kesan gambar tangan | eksperimental, hipotesis; dampak ke caption tidak diketahui |
| Stagger pada kelompok elemen | elemen sejenis masuk bergantian bukan serentak | prinsip umum (hindari serentak sudah **[R]**); selang waktu belum ditentukan, uji dengan mata |
| Remap waktu lokal | memperlambat atau mempercepat `t` dalam satu shot | fisibel secara teknis karena shot adalah fungsi `t`; belum diuji |
| Pose antara (breakdown) | satu pose tambahan agar lintasan melengkung | **BELUM DIVERIFIKASI.** Dari kode `posesAt`: tiap segmen memakai `ease.inOut` (kecepatan nol di setiap pose kunci) dan pose kunci yang jaraknya kurang dari `blend` tertunda. Bisa menghasilkan jeda, bukan arc; uji visual dulu |

## 15. Catatan teknis dan biaya render
- **Syarat gerak:** fungsi dari `t`/frame; acak hanya lewat `rng(seed)`/`noise`; tanpa `Math.random`, `Date.now`, delta-time, fisika real-time (**[R]** determinisme engine, `remotion-fitur`). Skill ini sendiri tidak mensyaratkan dependensi baru atau perubahan engine.
- Pengaruh biaya secara umum: perubahan kurva, durasi, jeda, dan urutan gerak tidak menambah biaya. Biaya naik karena lapisan: `blurLayer`, 3D, grade berat, banyak salinan tokoh (`trail`), partikel padat, dan motion blur (terutama `CameraMotionBlur` di `remotion-3d`). Tidak ada rekomendasi di skill ini yang menambah lapisan.
- Data pengamatan (bukan aturan): render sinematik ±10 mnt untuk 56 dtk (`WORKFLOW.md`) vs komik ±1,5 mnt untuk 64 dtk (`STATUS.md` #18), kondisi mesin mungkin berbeda.
- **[T]** Keterbatasan engine yang relevan (dicatat, bukan dikerjakan di sini): `blendPose` meng-interpolasi sendi secara lurus. Bila gerak lengan terasa kaku pada aksi yang ditonton dekat, pose antara lewat `posesAt` adalah salah satu percobaan (belum terbukti, §14); perbaikan di engine adalah kandidat terpisah di luar skill ini.
- Keterbatasan alat cek (mis. deteksi kamera di kode komik) juga kandidat terpisah.

## 16. Kerangka keputusan
Jawaban **"tidak perlu" selalu valid.** Dipakai untuk gerak yang menentukan, bukan untuk setiap elemen. Berhenti begitu gerbang A menjawab diam.

**A. Perlu bergerak?** Apa tujuan gerak ini? Apa yang harus dilihat penonton, dan apakah gerak ini membantu atau menutupinya? Apakah ada yang justru harus diam? Apakah ini mendukung cerita?
**B. Bagaimana?** Apa primernya? Pendukung apa yang benar-benar dibutuhkan? Apa sebab dan akibat gerakannya (§5)? Bagaimana tempo dan percepatan yang sesuai (§4)? Perlukah antisipasi, follow-through, arc? Apakah kamera membantu atau diam lebih baik?
**C. Bisa dan layak?** Bisa deterministik dari `t` tanpa dependensi? Biaya sebanding dengan manfaat? Bertentangan dengan DNA/skill lain? Bila ya, laporkan selisihnya ke user; jangan memutuskan sendiri (lihat §10).

## 17. Daftar periksa kualitas gerak
Panduan untuk menilai hasil, bukan syarat yang harus dipenuhi semuanya di tiap adegan.
- [ ] Setiap gerak punya fungsi; yang tidak punya sudah dihapus atau didiamkan.
- [ ] Fokus jelas; gerak lain tidak menutupi primer.
- [ ] Bobot terbaca dari sebab-akibat (percepatan, benturan, reaksi), bukan hanya kecepatan.
- [ ] Tempo mengikuti aksinya (bukan satu durasi untuk semua, juga bukan variasi buatan).
- [ ] Diam, tahan, atau hening dipakai di tempat yang menguatkan; tidak diisi gerak hiasan.
- [ ] Kontinuitas arah, kostum, properti terjaga; potongan jatuh di kata atau aksi yang masuk akal.
- [ ] Gerak terasa koheren dengan maksud adegan (bukan diturunkan dari warna).
- [ ] Tidak ada lapisan baru yang menambah biaya tanpa manfaat jelas.

## 18. Contoh kontekstual
Contoh bersifat ilustrasi arah berpikir, bukan resep.

**Melempar batu.** Tahap dipilih dari framing dan intensitas. Bila tubuh tokoh menjadi fokus, beberapa dari persiapan, antisipasi, pindah berat, pelepasan, lintasan, benturan, reaksi lingkungan, dan pemulihan bisa berguna; sering tidak semuanya. Bila fokus hanya pada batu atau hasilnya, tubuh bisa dilewatkan dan cerita dimulai dari benturan. Tentukan tahap dari apa yang ingin dipahami penonton, bukan dari daftar.

**Berjalan.** Berat badan, kontak kaki, keseimbangan, dan ritme langkah menyampaikan keadaan tokoh (lelah, ringan, ragu). Awal dan berhentinya langkah punya percepatan; kamera dan latar bisa mengikuti sesuai suasana. Siluet lengan dan kaki harus terbaca; hindari siklus yang terasa seperti loop tanpa emosi.

**Berhenti dan diam.** Perlambatan menjadi diam, mengendap, lalu kehidupan kecil (napas) bila cerita membutuhkan. Di jeda emosional, kurangi gerak sampai yang dibutuhkan saja; kamera dan elemen lain bisa ikut diam atau tetap bila kontras dengan tokoh yang diam itu bermakna.

**Reveal (termasuk angka, stempel, kartu).** Bentuk dan waktunya mengikuti apa yang diungkap dan kata VO; boleh dengan persiapan, boleh tiba-tiba. Setelah terungkap, beri waktu lihat.

**Adegan banyak elemen.** Tentukan primer dan arah mata; sisanya mendukung, diredam, atau diam. Bila adegan tetap terlalu padat, pertimbangkan membaginya menjadi dua shot.

---
*Skill ini sengaja berfokus pada prinsip dan keputusan. Sumber, keputusan per prinsip, dan temuan engine/QC yang masih terpisah ada di `research/motion-intelligence-audit.md`.*
