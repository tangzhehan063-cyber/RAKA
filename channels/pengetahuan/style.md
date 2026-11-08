# STYLE PENGETAHUAN: channel pengetahuan (editorial 3D bersih)

Channel terpisah dari channel stickman. Gunakan profil ini bila prompt menyebut **"style pengetahuan"** / "channel pengetahuan" / "style 3D bersih".
Contoh frame: `channels/pengetahuan/contoh-frame.png`. Kode: `remotion-3d/src/pengetahuan/` (komposisi `PengetahuanTest`).
Objek tidak harus otak: bata, keramik, meteran, pipa, dll. dibuat 3D koral glossy dengan cara yang sama.
Terinspirasi estetika "clean medical/editorial 3D"; JANGAN meniru branding, handle, atau tata letak persis kreator lain.

## Niche & isi
- Channel pengetahuan, seri utama **"fakta rumah"** (video #1–#4: bata, semen, meteran listrik, keramik; berikutnya #5). Audiens 35+, bahasa santai.
- **Alur naskah WAJIB mengikuti `channels/pengetahuan/alur-naskah.md`** (Tahap 1 ide + tren → Tahap 2 storyboard dengan "Fakta, tren & asumsi" → Tahap 3 naskah final + suara → animasi mengikuti suara). Contoh naskah: `channels/pengetahuan/referensi/`.
- Visual origami lama sudah DIGANTI dengan style editorial 3D di bawah ini.

## Visual (wajib sama setiap video)
| Elemen | Aturan |
|---|---|
| Latar | Kertas off-white `#f3f2ef` → `#e4e3df`, gradien radial lembut. Tidak pernah gelap. |
| Tekstur | Grid titik + garis putus-putus (kertas teknik) memudar ke kanan; 1–2 lengkungan abu-abu besar yang blur. |
| Objek utama | SATU objek 3D glossy per adegan, warna **koral `#f27a63`** (MeshPhysical: clearcoat, sheen). Dibuat prosedural dengan kode (tanpa model berlisensi). Sering **dipotong berani di tepi layar**. |
| Teks latar | 2–3 kata serif miring (Playfair Display Italic) raksasa, sangat samar `rgba(28,28,30,.055)`, diawali "·". |
| Label | Titik hitam + garis tipis + label Inter Bold, sub-label abu-abu. Muncul tergambar. |
| Judul/hook di layar | Inter Black, rapat (letter-spacing −2), tinta `#1c1c1e`, **kata kunci berwarna koral**. |
| Caption | Inter Bold tinta gelap, kata aktif koral, tanpa outline tebal; di sepertiga bawah. |
| Gerak | Pelan & mewah: objek berputar perlahan, kamera dolly halus, easing cubic; tidak ada shake/flash. |
| Transisi | Objek berganti dengan morph/zoom ke detail (makro), atau geser lembut; bukan cut keras. |

## Suara & audio
- Voice default: ElevenLabs **Riri Rida – Documentary & News** (`tCKeP99grYL9wZRg6sQ9`), `eleven_v4`, tenang dan berwibawa (berbeda dari channel stickman). Ganti hanya bila user minta.
- Musik: ambient/minimal piano, sangat pelan; SFX halus (whoosh lembut, tick, pop kecil). Master −14 LUFS.

## Produksi
- Engine: **Remotion + three.js** (`remotion-3d/`), render: `npx remotion render <Komposisi> out/<slug>.mp4` (config sudah pakai `swangle` untuk container tanpa GPU).
- Format: 9:16 1080×1920, 30 fps, 45–60 dtk untuk Shorts; 16:9 untuk versi panjang.
- Timestamp & caption: sama seperti channel stickman (ElevenLabs Scribe → `tools/scribe_to_timeline.py`), lalu dipakai oleh `@remotion/captions`.
- **Wajib setelah video selesai:** caption posting + cover (cover = frame objek koral + judul Inter Black 2–5 kata).

## Belum diputuskan (tanyakan user saat video pertama)
- Nama channel & handle. Realisme objek: prosedural (sekarang) atau model 3D CC0/public domain bila tersedia.
