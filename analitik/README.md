# Analitik RAKA

Data historis ada di `video.csv` (jangan dihapus; koreksi dicatat di kolom `catatan`). Kolom kosong = tidak tersedia, bukan nol.
- Ringkasan: `python3 tools/analitik.py [--by jenis_topik|hook_tipe|gaya|durasi|pilar]`.
- Tipe hook: A verdict, B kontradiksi, C pengakuan relate, D rasa ingin tahu, E visual.
- Sumber data: tabel/screenshot TikTok Studio dari user. Data yang paling berharga dan belum ada: kurva retensi, rata-rata tonton, % tonton, completion, share, save, follow.
- Prosedur: 24–48 jam setelah tayang minta data → isi baris → `templates/post-mortem.md` → eksperimen berikutnya di `eksperimen.md`.
- Jangan menyimpulkan penyebab dari views saja. n<5 = indikatif. Pola = ≥3 video dengan variabel sama.
- Catatan lama (pembacaan data 23 Nov, hipotesis H1/H2): `brand/formula.md`.
