# Script engine (STEP 5–6): retention dulu

Menggantikan "Pukulan ke-99" sebagai aturan wajib (kerangka lama tetap boleh sebagai salah satu opsi, `brand/kerangka-cerita.md`).

## Kerangka longgar
HOOK → pengalaman yang relate / eskalasi → REVEAL / penjelasan → PAYOFF. Ini bukan aturan. Pilihan bentuk: cold open, kontradiksi, cerita, pertanyaan, misteri visual, eksperimen, fakta tak terduga, observasi langsung, demonstrasi, perbandingan.

## Prinsip
1. Frame pertama sudah menarik; tidak ada salam, logo, definisi, intro.
2. Hindari "Pernahkah kamu…" bila ada hook yang lebih kuat.
3. Hook konkret, bukan abstrak ("Alarm sudah bunyi tiga kali. Kamu masih snooze." bukan "Disiplin itu sulit").
4. Kalimat pendek. Tiap kalimat harus menambah **informasi, emosi, curiosity, atau visual**; kalau tidak, hapus.
5. Tidak mengulang informasi, tidak akademis, tidak ada moral yang tidak diperlukan.
6. **Tidak dipaksakan:** happy ending, loop, CTA, kalimat tanda tangan ("X bukan soal A, tapi B"), clickbait yang tidak dibayar isi.
7. Hook menjanjikan sesuatu yang benar-benar dibayar.
8. Klaim hanya dari kolom "boleh dikatakan" di research brief; bukti campur ditulis campur.
9. Bahasa: lisan, tidak terdengar AI (lihat daftar di `.claude/skills/retention-scriptwriter`; lewatkan `humanizer` sebelum final).

## Sistem hook: minimal 5 alternatif per ide
| Kode | Jenis | Ciri |
|---|---|---|
| A | VERDICT | pernyataan yang mengganggu asumsi |
| B | CONTRADICTION | berlawanan dengan intuisi |
| C | RELATABLE CONFESSION | pengalaman yang langsung familiar |
| D | CURIOSITY | pertanyaan/misteri belum terjawab |
| E | VISUAL HOOK | adegan yang menarik tanpa suara |
Uji hook: (1) dipahami dalam 1–2 dtk, (2) konkret, (3) memunculkan pertanyaan, (4) tanpa konteks panjang, (5) dibayar di akhir. Pilih satu; sebutkan alasan. Boleh uji A/B di video berbeda (`analitik/eksperimen.md`).

## 3 pendekatan naskah (untuk ide terpilih)
1. **Story-driven:** satu tokoh, satu kejadian, penjelasan masuk lewat kejadian.
2. **Curiosity-driven:** pertanyaan terbuka lalu dijawab berlapis (setiap jawaban memunculkan pertanyaan kecil).
3. **Direct/punchy:** vonis di awal, 3–4 fakta cepat, selesai.
Tulis ketiganya singkat (hook + garis besar + 1 paragraf VO contoh), pilih satu dan jelaskan alasan (retensi, kecocokan visual, kejujuran bukti). Hanya versi terpilih yang dikembangkan penuh.

## Durasi
Default short-form 25–45 dtk (±2,5–3 kata/dtk bahasa lisan Indonesia ≈ 65–130 kata). Pendek/panjang boleh bila topik meminta. Data internal: video 2:10–2:37 tidak menang; vonis + pendek menang (#12, #17 belum ada data).

## Isi naskah final (`templates/naskah.md`)
Voiceover per kalimat · teks layar · waktu perkiraan · isyarat visual · isyarat SFX bila perlu · kutipan riset (mengacu ke brief) · alasan retensi · payoff.
Teks TTS: angka jadi kata ("enam puluh enam"), tanpa tag `[whispering]`; untuk `align_teks.py` teks tanpa tag (lihat STATUS pelajaran #17).

## Pemeriksa otomatis
`python3 tools/cek-naskah.py naskah/<slug>.md`: salam di awal, "Pernahkah kamu", frasa AI, kalimat >18 kata, kata/dtk, angka tanpa sumber di brief, hook >12 kata. Ini lint, bukan penilai kualitas.
