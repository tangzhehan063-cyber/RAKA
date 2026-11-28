# Sistem QC (STEP 13–14)

Dua jenis. **PASS teknis ≠ konten bagus.** Render sukses tidak berarti lolos QC konten.

## A. QC teknis (otomatis sebagian)
Jalankan: `python3 tools/qc-teknis.py <file.mp4> [--durasi 47.2] [--out-dir <folder>]`
Memeriksa: file ada, durasi (±0,3 dtk dari target), resolusi 1080×1920, fps 24, ada audio, LUFS (−14 ±1,5), true peak ≤ −1, clipping, black frame tak sengaja (>0,3 dtk di luar awal/akhir), file sementara di folder output.
Manual (visual): `produksi.sh sheet` → `safe.png`: caption tidak terpotong, teks di luar zona merah, aset tidak hilang, `brand/cek-bug.md`. Sinkron VO-gambar: cek 3 titik (awal, tengah, akhir).

## B. QC konten (manual, oleh editor + user di gerbang)
Checklist `templates/qc-konten.md`:
1. Hook menarik dalam 1–2 dtk? Opening tidak lambat?
2. Naskah mudah dipahami tanpa menjeda?
3. Setiap klaim ada di research brief "boleh dikatakan"? Tidak menyesatkan, korelasi ≠ sebab?
4. Visual mendukung VO (bukan dekorasi)? Setiap pergantian ada alasan?
5. Pacing: tidak ada >5,5 dtk tanpa perubahan; tidak terburu-buru di bagian inti.
6. Payoff sepadan dengan hook. Tidak ada janji kosong.
7. CTA hanya bila relevan. Ending tidak terlalu panjang, tidak dipaksa beres/loop.
8. Bahasa tidak terdengar AI; lewat humanizer.
9. Caption ≤150 karakter (TikTok), tanpa klaim lebih kuat dari video.

## Aturan keputusan
PASS = A lolos + B tanpa poin gagal. Gagal teknis → perbaiki dan ulang QC. Gagal konten → kembali ke STEP 6/10. Catat bug baru di `brand/cek-bug.md`.
Automated QC hanya memeriksa fakta teknis; tidak menilai kualitas isi.
