# Sistem riset (STEP 4)

Tujuan: setiap klaim di naskah bisa dilacak ke sumber dan tidak lebih kuat daripada buktinya. Output = **research brief** (`templates/research-brief.md`) yang jadi satu-satunya bahan penulis naskah.

## Tingkat sumber
- **Tier 1:** studi asli, peer-reviewed, meta-analisis, systematic review, jurnal akademik, lembaga riset resmi.
- **Tier 2:** publikasi universitas, organisasi ilmiah, jurnalisme sains bereputasi.
- **Tier 3:** media umum, blog, media sosial. **Tidak boleh jadi satu-satunya dasar klaim ilmiah.** Boleh untuk menemukan studi, lalu cek ke Tier 1.
Aturan minimal: 1 studi utama Tier 1 + 1 pendukung (tinjauan, replikasi, atau studi lain). Cari juga **replikasi/bantahan** ("<studi> replication", "<efek> failed to replicate").

## Cara kerja (hemat)
1. WebSearch "standard" 2–4 kali: studi utama, tinjauan, replikasi/kritik. Mode "extended" hanya bila hasil tipis.
2. Buka halaman abstrak (PubMed, DOI, publisher). Ambil: penulis, tahun, jurnal, jenis studi, sampel, temuan, batas. **Kutip angka hanya dari abstrak/paper yang benar-benar terbaca;** angka yang hanya terbaca dari artikel berita ditandai `via sekunder`.
3. Isi tabel klaim (field wajib di bawah). Jalankan daftar larangan.
4. Tulis "boleh dikatakan" vs "jangan dikatakan". Naskah hanya boleh memakai kolom "boleh".
5. **Gerbang keputusan 2:** user menyetujui angle riset (ringkas: pertanyaan, jawaban sederhana, 1 studi utama, batas).

## Field wajib per klaim penting
Claim · Source (judul, jurnal) · Author · Year · Study type · Sample/population · Findings · Limitations · **Confidence** (tinggi / sedang / rendah / campur) · Relevance to script.
Jangan mengarang DOI; bila DOI tidak terlihat, tulis `DOI: belum dicek`.

## Dilarang (cek satu per satu sebelum brief dinyatakan selesai)
1. Mengarang studi, DOI, ukuran sampel, persentase.
2. Mengubah korelasi menjadi sebab ("menyebabkan", "membuat") tanpa desain eksperimen.
3. Studi hewan/sel dipakai langsung untuk manusia.
4. Satu studi disebut konsensus ("para ilmuwan sepakat").
5. Istilah neuro sebagai hiasan. Khusus **dopamin**: jangan "dopamin menyebabkan kamu…". Aman: dopamin berperan dalam prediksi/motivasi untuk mencari hadiah; jangan klaim "lonjakan dopamin" dari scrolling kecuali ada studi manusia yang mengukurnya.
6. Menyederhanakan sampai menyesatkan (menghapus syarat/batas yang mengubah makna).
7. Persentase tanpa sumber. Penyebut dan populasi harus jelas.
8. Efek yang gagal direplikasi dipresentasikan sebagai fakta.

## Bukti campur
Tulis di brief dan di naskah: "Masih menjadi perdebatan" / "Evidence mixed". Ini boleh jadi inti video ("populer, tapi belum terbukti").

## Research brief: 10 bagian
1 Main question · 2 Answer in simple language · 3 Evidence (tabel klaim) · 4 Mechanism · 5 Limitations · 6 Misconceptions · 7 What we can safely say · 8 What we should not say · 9 Sources (tier) · 10 Interesting storytelling angles.
Skill: `psychology-researcher`. Pemeriksa otomatis ringan: `tools/cek-naskah.py` mencari angka di naskah yang tidak muncul di brief.
