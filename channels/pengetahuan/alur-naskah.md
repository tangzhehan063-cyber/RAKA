# Alur naskah: STYLE PENGETAHUAN (seri "fakta rumah")

Alur ini meneruskan cara kerja 4 video pertama (referensi di `referensi/`), dengan tambahan dari ScriptForge. Visual lama (origami) TIDAK dipakai lagi; semua adegan diterjemahkan ke visual editorial 3D di `style.md`.

## Identitas konten (dari video #1–#4)
- Seri **"fakta rumah"**: benda & sistem di rumah sehari-hari (bata, semen, meteran listrik, keramik → berikutnya: pipa, atap, kabel, kulkas, cat, kloset, genteng, dsb.).
- Audiens **35+** (pemilik rumah, tukang, bapak-ibu). Bahasa **santai**: "nggak", "kayak", "Nah", "-mu", "Pernah perhatiin?". Tanpa istilah teknis yang tidak dijelaskan.
- Durasi **±38–45 detik**, **8–10 beat**, 9:16. Penomoran video berlanjut (berikutnya **#5**).
- Penutup tetap: **"Follow buat fakta rumah berikutnya!"**

## Tahap 1: Ide
1. Beri **10 ide** dalam seri fakta rumah (format ScriptForge langkah 2: judul ≤ 60 karakter + satu baris hook/alasan orang klik). Campur format: "kenapa…", "cara … bekerja", "mitos vs fakta", "bahaya yang nggak kelihatan".
2. **Cek tren** untuk ide unggulan: cari video serupa di TikTok/YouTube (tool ScrapeMedsos bila tersedia) dan catat judul + jumlah tayangan sebagai bukti. Jangan mengarang angka tayangan.
3. User memilih satu.

## Tahap 2: Storyboard draft (artifact/halaman, seperti video #1–#4)
Header: `STORYBOARD · VIDEO #N · TAHAP 2 · DRAFT`, durasi sementara, "VO Bahasa Indonesia santai · audiens 35+ · CTA follow · seri fakta rumah", catatan safe zone (15% atas, 20% bawah; subtitle tepat di atas garis bawah).

**Bagian "Fakta, tren & asumsi"** (wajib, sebelum beat):
- Tren (judul video serupa + jumlah tayangan).
- Setiap angka/klaim + sumbernya (standar, jurnal, lembaga, tarif resmi beserta periodenya).
- Mana yang **perkiraan** (ditandai "(perkiraan)" di layar), mana yang **penyederhanaan visual**, apa yang **sengaja tidak dibahas** supaya singkat.
- Kalimat VO yang sengaja dibuat aman ("sekitar seribu empat ratusan").

**Tabel beat:** `# | detik | judul | teks layar | VO | visual | SFX`.

### Rumus beat (pola dari 4 video + ScriptForge)
| Beat | Fungsi | Pola VO |
|---|---|---|
| 1 | **Hook** (≤ 3 dtk, tanpa intro) | Klaim mengejutkan tentang benda di rumahmu, atau "Pernah perhatiin? …" |
| 2 | **Bingkai ulang** / buka rasa penasaran | "Ini bukan mistis. Ini fisika." / "Kenapa, ya?" |
| 3–6 | **Mekanisme** bertahap, tiap beat 1 ide + 1 angka konkret | Kalimat pendek; angka dengan kartu; tutup beat dengan transisi/mini-cliffhanger ("Tapi…", "Nah…", "Penyebab kedua:") |
| 1 beat | **Mitos dipatahkan** | "Banyak yang kira … Salah! …" / "… rusak? Bukan!" |
| 1 beat | **Twist/payoff** (ScriptForge) | Fakta paling mengejutkan disimpan di sini, bukan di awal |
| 8 | **Solusi praktis** | "Biar aman: …" (2–3 langkah, centang) |
| 9 | **Ajakan cek di rumah** | "Coba ketuk/lihat/hitung … di rumahmu. Ada yang …?" (memancing komentar) |
| 10 | **CTA** | "Follow buat fakta rumah berikutnya!" |

**Teks layar** selalu 2 baris: `kalimat kecil / KATA BESAR` (contoh: `Kena panas, keramik / MEMUAI`), opsional kartu angka (`± 1 mm memanjang`).

## Tahap 3: Naskah final + suara
- Rapikan VO jadi teks TTS (angka ditulis sebagai kata). Suara: ElevenLabs (default Riri Rida) **atau** Google AI Studio bila user memilih; suara dipakai **tanpa diolah**, lalu **animasi mengikuti suara** (durasi beat diambil dari timestamp kata).
- Timestamp: ElevenLabs Scribe → `tools/scribe_to_timeline.py` (angka jadi numeral di subtitle).

## Tahap 4–5: Animasi & render (style pengetahuan)
Terjemahan visual origami → editorial 3D:
| Dulu (origami) | Sekarang (editorial 3D) |
|---|---|
| Benda dari kertas lipat | Benda 3D glossy koral `#f27a63` dibuat prosedural (bata, keramik, meteran, pipa…) di atas latar kertas putih |
| Penampang kertas | Penampang 3D terbelah (cutaway) dengan label garis tipis |
| Kartu kertas kuning / ledakan "DUK!" | Kartu label bersih (Inter), angka besar tinta gelap, kata kunci koral |
| Papan judul terlipat ulang | Judul Inter Black yang ganti dengan slide/fade halus |
| SFX kertas (crease, refold) | SFX halus: klik, whoosh lembut, pop kecil, chime |

## Setelah render (wajib)
Caption posting (TikTok/Reels, YouTube Shorts, komentar pin) + **cover** + dari ScriptForge: **3 judul alternatif, teks cover 2–4 kata, 5 tag, estimasi durasi**.
