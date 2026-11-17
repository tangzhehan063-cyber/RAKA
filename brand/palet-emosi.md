# Palet warna menurut emosi cerita (riset 13 Nov 2026)

Tujuan: palet tidak lagi hijau-neon di semua video, tapi dipilih dari emosi cerita. Pindah palet = `"style": "<id>"` di `config.json` (satu video) atau di satu shot di `story/shots.json` (per adegan).

## Yang didukung penelitian
- **Valdez & Mehrabian (1994), *J. Exp. Psychology: General* 123(4):394-409** ([PubMed](https://pubmed.ncbi.nlm.nih.gov/7996122/)): kecerahan dan saturasi lebih kuat memengaruhi emosi daripada hue. Persamaan terstandar: Pleasure = .69B + .22S; Arousal = -.31B + .60S; Dominance = -.76B + .32S.
  - Terang = lebih senang, lebih tenang, merasa kurang "dikuasai". Gelap = lebih tegang / berat.
  - Saturasi tinggi = lebih bergairah dan menyenangkan. Saturasi rendah = datar, lesu.
  - Hue paling menyenangkan: biru, hijau-biru, ungu. Paling kurang menyenangkan: kuning, kuning-hijau.
- **Thorstenson dkk., *Psychological Science* (2015)** ([Time](https://time.com/4018860/sadness-color-perception)): peserta yang menonton klip sedih kurang akurat membedakan warna pada sumbu biru-kuning (±300 mahasiswa; ini soal persepsi, bukan selera penonton).
- **Jonauskaite dkk. (2020), *Psychological Science*** ([ringkasan](https://infoscience.epfl.ch/record/280269)): 4.598 orang, 30 negara. Asosiasi warna-emosi sangat mirip lintas budaya (r = .88), dengan perbedaan lokal. Jadi aturan umum aman dipakai untuk penonton Indonesia, tapi bukan hukum mutlak.
  - Catatan: pasangan spesifik (sedih-abu, marah-merah, dst.) dari tabel makalah belum sempat saya verifikasi (PDF diblokir); kolom "kesan" di bawah memakai praktik sinematografi, bukan angka makalah.

## Yang hanya praktik sinematografi (bukan bukti lab)
Warna dingin + desaturasi terasa serius/dingin, warna hangat terasa dekat/nostalgia, palet cerah terasa ringan. Sumber: [Noam Kroll](https://noamkroll.com/the-psychology-of-color-grading-its-emotional-impact-on-your-audience/). Anggap sebagai titik awal, bukan fakta.

## Gaya rumah (14 Nov 2026): `lembut`
Keputusan user: video RAKA berikutnya memakai gaya **`lembut`** (Lembut Terang) sebagai dasar: dunia terang pastel, kontras halus (0,93), saturasi 0,84, tanpa neon, tanpa rim/garis tepi bercahaya (2D dan 3D, `outline3D: false`), bloom hampir nol, tokoh arang lembut. Palet di tabel bawah dipakai per adegan hanya bila emosinya menuntut (maks 2 palet per video). **Jangan isi `"style"` per shot kalau tidak perlu**: style per shot mengalahkan style video.

## Peta emosi → palet RAKA
Aturan turunan: **terang/saturasi = naik-turun mood; hue = penanda suasana**. Sedih = turunkan saturasi + kecerahan, bukan sekadar "biru".

| Emosi adegan | Palet utama | Alasan | Catatan |
|---|---|---|---|
| Sedih, kehilangan, penyesalan | `clay` malam / `retro` / `arctic` | Saturasi rendah, tanpa glow; arctic untuk dingin-hampa | Hindari bloom besar (glow = energi tinggi) |
| Cemas, overthinking, insomnia | `indigo` | Biru pekat, kontras tinggi, kuning marigold sebagai titik tekanan | Cocok untuk adegan jam 3 pagi |
| Hangat, pulih, kebiasaan baru | `clay` / `sakura` / `paper` | Terang + hangat = pleasure naik, dominance turun (merasa aman) | Pakai untuk adegan fajar/akhir cerita |
| Marah, frustrasi, ditolak | `ember` | Merah-oranye saturasi tinggi = arousal tinggi | Pakai sebentar, bukan seluruh video |
| Harapan, awal baru | `paper` / `golden` mood di style hangat | Kecerahan tinggi = pleasure | Pastikan adegan terang tidak membuat tokoh oranye hilang |
| Tenang, refleksi | `lavender` | Ungu/biru lembut, saturasi sedang | |
| Riset/sains (papan data) | `arctic` / `indigo` | Netral-dingin, fokus ke angka | Angka emas tetap jadi titik fokus |
| Gelap-hijau neon (`emerald`) | Hanya bila perlu "teknologi/peringatan" | Saturasi + glow = arousal tinggi, cocok untuk momen kejutan | Jangan jadi default |

## Pola arc warna (cerita sedih → pulih)
`kesulitan` = gelap, saturasi rendah (clay/indigo malam) → `pukulan riset` = kontras naik, 1 warna aksen → `perubahan` = terang + hangat (clay/paper pagi). Pergantian palet itu sendiri menjadi bagian cerita (mis. malam indigo → fajar clay).

## Aturan praktis
1. Tokoh selalu tetap oranye `#d64a33` (maskot); cek ia tetap menonjol di palet baru.
2. Maksimal 2 palet per video (3 bila ada adegan riset).
3. Cek `brand/cek-bug.md` dan contact sheet (`--styles a,b,c --at t1,t2`) sebelum memilih.
4. `paper` malam masih kusam (abu); gunakan hanya untuk adegan siang.

## Matriks emosi × waktu (uji 13 Nov, shot kamar malam vs pagi dari video #3)
Prinsip pembeda: **emosi memilih keluarga palet, waktu memilih terang/gelap-nya**. Jadi malam dan pagi dari emosi yang sama tetap satu keluarga warna, tapi beda kecerahan (Valdez & Mehrabian: terang = lebih senang & aman).

| Emosi \ Waktu | Malam | Pagi / siang |
|---|---|---|
| Sedih / sepi | `arctic` (dingin, hampa) atau `clay` (cokelat redup) | `clay` terang rendah; `paper` untuk pagi yang pucat |
| Cemas / takut | `indigo` (biru pekat, titik kuning) | `indigo` mood `golden` (belum diuji) |
| Pulih / hangat | `lavender` atau `sakura` (lembut) | `clay` / `paper` (hangat terang) |
| Marah / frustrasi | `ember` | `ember` mood `golden` |
| Riset / data | `arctic` atau `indigo` | `paper` |

Hasil lihat mata: malam `indigo` paling sinematik dan beda jelas dari emerald; `clay` malam kusam-cokelat (cocok untuk sedih, kurang untuk cemas); `retro` malam terlalu zaitun/kotor, jangan dipakai untuk malam; `paper` pagi paling terang dan jelas beda dari malam. Cara pakai per adegan: tambah `"style": "<id>"` pada shot di `story/shots.json`.

**Batas yang ditemukan:** adegan 3D (orbit/teras) punya pencahayaan sendiri sehingga pagi 3D tetap gelap di semua palet. Untuk adegan pagi 3D, naikkan terang lampu di adegannya, bukan hanya ganti palet.

## Aturan rotasi gaya dasar (keputusan user 17 Nov 2026)
- Gaya dasar **berganti tiap video**; `lembut` bukan lagi default tunggal. Alasan: #10 dan #11 sama-sama lembut, risiko monoton dan "tidak enak dilihat" bila terus sama.
- Pilih gaya dasar dari tabel emosi di atas sesuai topik/suasana video (paper, clay, lavender, arctic, sakura, retro, ember, indigo, lembut). **Jangan memakai gaya dasar yang sama dua video berturut-turut.**
- Per adegan tetap boleh pindah palet lewat `"style"` di `shots.json` untuk emosi (sedih, riset, klimaks).
- `produksi.sh init` menulis `style='lembut'`; ubah `style` di `config.json` proyek setelah init, dan cek kontras/neon dengan `python3 tools/cek-visual.py frame ...` (gaya gelap seperti indigo/lavender butuh set yang tidak ditulis dengan warna lembut tetap di kode).
- Riwayat: #1–#7 emerald/campur, #8–#9 paper/indigo/arctic/clay, #10–#11 lembut.
- **Koreksi (17 Nov, user):** warna mengikuti **tema video**, tidak harus ganti per adegan. Pindah palet per adegan hanya bila memang ada pergeseran emosi besar, dan tetap dalam batas `cek-sutradara` (maks 2 palet, 3 bila ada adegan riset/papan). Yang harus dihindari: gaya dasar yang sama berulang antar video berturut-turut.
