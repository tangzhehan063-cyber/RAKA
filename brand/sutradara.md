# Sutradara retensi RAKA (diadaptasi dari repo Motion-videos, 9 Nov 2026)
> **Cara pakai + alat cek otomatis: skill `.claude/skills/sutradara/SKILL.md`** (14 Nov 2026). File ini = angka dan aturan detail yang dirujuk skill.
Permintaan user: Motion-videos jadi "sutradara" supaya retensi naik; naskah dan karakter tetap gaya lama. **DNA di `brand/dna-video.md` tetap menang kalau bertabrakan.** File ini dipakai di STEP 6 (naskah), 10 (storyboard) dan 12 (adegan) `WORKFLOW.md` v2, dan terus diperbaiki per video.
Sumber: `lab/prompts/01-template.md`, `03-banned.md`, `04-numbers.md`, `skills/lemomo-ai__lemo-opuscar/DIRECTOR.md`, `skills/LottieFiles__motion-design-skill/.../narrative-structure.md`. Itu aturan penyutradaraan; Motion-videos tidak punya naskah narasi.

## Naskah (kata tetap ScriptForge + DNA)
1. **Satu tokoh, satu keinginan, satu perubahan.** Akhirnya beda dari awalnya.
2. **Frame 0 sudah hook**: gambar langsung jadi, tanpa fade, tanpa logo.
3. **Tulis 1 pertanyaan terbuka di 3 detik pertama**, jawab paling cepat di tengah video.
4. **Re-hook tiap ±12 dtk**: kalimat pembalik/pertanyaan pendek ("Tapi…", "Kenapa…?", "Yang paling seram?").
5. **Akhir menggema ke awal**: kalimat terakhir menyambung ke kalimat pertama.
6. **Buang yang perlu dijelaskan.** Satu gagasan yang terbaca di layar HP lebih kuat dari tiga.

## Arahan per kalimat (kolom wajib di storyboard)
`detik | VO | 1 aksi utama | masuk lewat | kenapa orang tetap nonton`
Dilarang menulis kata sifat ("keren", "dramatis"); terjemahkan ke angka.

## Angka gerak (24 fps)
- Satu aksi utama per shot. Aksi pendukung 50–70% jarak, mulai 100–200 ms (3–5 frame) setelahnya. Gerak latar < 5%.
- Masuk ease-out 10–18 frame, keluar ease-in 40–50% lebih pendek. Kamera paling lembut, ease-in-out.
- Angka/stempel: antisipasi 3 frame, skala 1,0→1,08→1,0 selama 6 frame, puncak pas di kata.
- Ganti gambar (cut, swipe, atau gerak kamera besar) tiap 2–3,5 dtk; shot > 3,5 dtk harus punya perubahan di dalamnya.
- Teks tahan ≥ 0,3 dtk/kata + 0,5 dtk. Teks tidak bergerak saat sedang dibaca; dorongan kamera maks 2%.
- SFX jatuh 1 frame SETELAH gambarnya. Flash maks 3×/dtk.

## Momen khas
Tiap video punya **1 momen yang cuma bisa terjadi di video ini**, diletakkan di puncak emosi, dan ditulis di storyboard.

## Larangan tambahan
Semua muncul bersamaan; fade-naik di tiap elemen; teks karangan di luar naskah; partikel hanya sebagai hiasan (freeze-frame DNA boleh); UI meniru logo/merek aplikasi asli; ikon palsu di kolom kanan (bertabrakan dengan tombol TikTok asli).

## Cara mengukur (formula dicari bertahap)
Setelah video tayang, catat di `brand/eksperimen.md`: retensi 3 dtk, rata-rata % ditonton, titik penonton turun. Yang menaikkan angka dipertahankan, yang tidak dibuang.
