# Keputusan user yang berlaku (satu sumber kebenaran)
Tambahkan baris baru di bawah, jangan mengedit yang lama (beri tanggal). Bila dokumen lain bertentangan, file ini menang.

| Tanggal | Keputusan | Sumber |
|---|---|---|
| 9 Nov | Posisi caption baku: pusat y=1344, maks 3 kata | `CLAUDE.md` |
| 11 Nov | Hasil jadi (MP4, cover, info) di Google Drive; GitHub hanya aset yang bisa dipakai ulang | `CLAUDE.md` |
| 12 Nov | Tanpa bisikan di VO; puncak emosi = hening + teks diketik | `CLAUDE.md` langkah 2 |
| 12 Nov | Mode cepat konfirmasi: ACC wajib hanya di 2 titik (naskah dan contact sheet), berlaku semua channel | `WORKFLOW.md` |
| 12 Nov | Hemat ElevenLabs: 1 take, naskah final dulu, revisi per kalimat, 1 flow per video | `CLAUDE.md` |
| 13 Nov | Sebelum VO final selalu tanya user: Gemini TTS atau ElevenLabs; suara tidak dipilih Claude | `CLAUDE.md` langkah 2 |
| 13 Nov | Zona aman: satu sumber angka di `tools/safezone.py` | `CLAUDE.md` |
| 13 Nov | Animatic ringan: `python3 tools/animatic.py <slug>` dicek sebelum kode adegan | `WORKFLOW.md` langkah 5 |
| 13 Nov | Workflow Gemini TTS hanya manual (`workflow_dispatch`), tidak otomatis saat push | `.github/workflows/gemini-tts.yml` |
| 14 Nov | Skill `sutradara` diporting dari Channel-Penjelasan ke RAKA; `tools/cek-sutradara.py` dan `tools/cek-visual.py` memeriksa ritme, kamera, suara, palet, warna | `.claude/skills/sutradara/SKILL.md` |
| 14 Nov | Engine tetap GrowKaz (bukan Remotion); gaya rumah `lembut` untuk video baru | `STATUS.md`, `brand/palet-emosi.md` |
| 16 Nov | Setiap video selesai: PR ke `main` lalu Claude langsung merge sendiri (semua channel); rollback lewat Revert PR | `CLAUDE.md`, `WORKFLOW.md` |
