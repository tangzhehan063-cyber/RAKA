---
name: retention-scriptwriter
description: Menulis hook dan naskah short-form RAKA yang mengutamakan retensi (STEP 5-6): minimal 5 hook (verdict, contradiction, confession, curiosity, visual), 3 pendekatan naskah (story, curiosity, direct), pilih satu, tulis naskah lengkap dengan teks layar, isyarat visual/SFX, kutipan riset. Pakai setelah research brief jadi dan sebelum retention-editor.
---
# retention-scriptwriter

**Input:** research brief (hanya kolom "boleh dikatakan"), platform, durasi target (default 25–45 dtk). **Output:** `naskah/<slug>.md` dari `templates/naskah.md` + teks TTS polos. **Batas:** tidak menambah fakta di luar brief; tidak memutuskan visual detail (storyboard-director). Prinsip lengkap: `brand/naskah-engine.md`.

## Langkah
1. Tulis ≥5 hook (A verdict, B kontradiksi, C pengakuan relate, D rasa ingin tahu, E visual). Uji: paham 1–2 dtk, konkret, memicu pertanyaan, dibayar di akhir. Pilih satu + alasan.
2. Tulis 3 pendekatan singkat (story/curiosity/direct): hook + garis besar + contoh VO. Pilih satu, jelaskan alasan (retensi, visual, kejujuran bukti).
3. Kembangkan versi terpilih: kalimat pendek, tiap kalimat menambah informasi/emosi/curiosity/visual. Tidak ada salam, logo, definisi, nasihat tak perlu. **Tidak wajib** happy ending, loop, CTA, kalimat tanda tangan.
4. Bahasa lisan Indonesia. Hindari: "Pernahkah kamu…" (bila ada hook lebih kuat), "bukan X tapi Y", "—", "tahukah kamu", "ternyata" berlebihan, triad paksa. Lewatkan skill `anthropic-skills:humanizer`.
5. Angka di teks TTS jadi kata; tanpa tag untuk `align_teks`. Jalankan `python3 tools/cek-naskah.py naskah/<slug>.md --brief riset/<slug>.md --durasi <dtk>` dan perbaiki GAGAL.
6. Serahkan ke retention-editor. Setelah revisi → **Gerbang 3** (user ACC naskah final).

## Quality gate
Hook ≤12 kata atau satu gambar jelas; setiap angka ada di brief; cek-naskah tanpa GAGAL; durasi sesuai kecepatan baca 2,2–3,4 kata/dtk; payoff menjawab core question.
