# RAKA: channel stickman "penjelas perilaku sehari-hari"

Repo ini hanya untuk channel stickman RAKA. Channel pengetahuan ("fakta rumah", editorial 3D) ada di repo **`tangzhehan063-cyber/Channel-Penjelasan`**; jangan campur gaya. Komunikasi dengan user: **Bahasa Indonesia**.

## Identitas
Positioning v2 (23 Nov 2026): "hal yang kita lakukan, pikirkan, rasakan, dan alami sehari-hari ternyata punya penjelasan yang menarik." 6 pilar (Brain & Habits, Social, Memory & Perception, Decisions & Money, Work & Modern Life, Human Behavior). Bukan akun motivasi generik. Detail: `brand/strategi-channel.md`.

## Masuk di sini
1. **Awal sesi:** baca `STATUS.md` dan `WORKFLOW.md` (STEP 0–18). `git fetch origin`, merge cabang `claude/*` yang belum masuk. Container baru: `tools/produksi.sh setup`.
2. Kerjakan video dengan `WORKFLOW.md` + `tools/produksi.sh`; perbarui `STATUS.md` setiap ada kemajuan.

## Batas keras (tidak boleh dilanggar)
- Riset bersumber: tanpa studi/DOI/angka karangan; korelasi ≠ sebab; bukti campur ditulis campur (`brand/riset.md`).
- Tanpa AI image/video generation, tanpa API AI visual baru, tanpa provider baru. Visual dibuat dengan kode (engine GrowKaz `studio/`, Remotion/Three.js di `remotion-3d/`).
- VO: **tanya user Gemini TTS atau ElevenLabs sebelum membuat VO final**; Gemini dibuat Claude sendiri; ElevenLabs 1 take, hanya naskah final (`brand/aturan-operasional.md`). Tanpa `[whispering]`.
- Teks publik (naskah, caption, judul, komentar) lewat skill `anthropic-skills:humanizer`. Caption TikTok ≤150 karakter total.
- Zona aman 9:16 dan posisi caption baku: `tools/safezone.py` (jangan diubah per video).
- Jangan menyentuh secrets/`.env`. Hasil video (MP4/MP3/PNG) di Google Drive, bukan di GitHub.
- **Commit/push/PR hanya dengan izin user.** Pengecualian lama: setelah video selesai atas permintaan user, PR ke `main` lalu merge sendiri (`KEPUTUSAN.md` 16 Nov).
- Engine tetap GrowKaz; jangan mengganti arsitektur tanpa benchmark dan alasan teknis. Patch engine yang ada (lihat `brand/aturan-operasional.md`) jangan ditimpa.

## Gerbang persetujuan user
G1 topik · G2 angle riset · G3 naskah final · G4 suara (+ storyboard/palet bila arah berubah) · G5 contact sheet sebelum render final. Tahap teknis lain jalan sendiri. Jangan render final sebelum G3 dan G5, kecuali user meminta mode autonomous.

## Routing skill
| Tahap | Skill |
|---|---|
| ide, topik | `content-strategist` |
| riset | `psychology-researcher` |
| hook, naskah | `retention-scriptwriter` |
| kritik retensi | `retention-editor` |
| storyboard, animatic | `storyboard-director` (+ `sutradara`, `growkaz-style`) |
| kode adegan, render, QC teknis | `video-engineer` (+ `remotion-fitur` untuk 3D/Remotion) |
| analitik, eksperimen | `performance-analyst` |

## File penting
`STATUS.md` posisi terakhir · `WORKFLOW.md` alur · `KEPUTUSAN.md` keputusan user (menang bila bentrok) · `brand/` (strategi-channel, sistem-ide, riset, naskah-engine, retention, storyboard-visual, audio, qc, produksi-teknis, aturan-operasional, dna-video, palet-emosi, gaya-growkaz, cek-bug) · `templates/` · `analitik/` · `riset/` · `naskah/` · `caption/`.

## Perintah
`tools/produksi.sh {setup|init|timeline|shots|cek|palet|sheet|stills|final|qc|cover}` · `python3 tools/skor-ide.py ide.json` · `python3 tools/cek-naskah.py naskah/<slug>.md --brief riset/<slug>.md --durasi N` · `python3 tools/qc-teknis.py <mp4> --durasi N` · `python3 tools/analitik.py --by <kolom>` · render dari `studio/` selalu dengan `CHROMIUM_PATH=/opt/pw-browsers/chromium`.

## Aturan user setelah reengineering (menang atas isi lama bila bentrok)
- **Opening berganti tiap video** (27 Nov): jangan buka dengan vonis raksasa + burst seperti video 17-21, dan jangan ulang bentuk pembuka video sebelumnya.
- **Cover** (27 Nov): adegan stickman dari video (tokoh + latar) + teks 2-4 kata di pita tengah, dengan warna komik video itu (template `studio/projects/hari-ke-10-cover/` atau cover Disuruh Jadi Males).
- **Tanpa nomor episode** (28 Nov): jangan tampilkan angka episode ("#23", "Hari ke-", dsb.) di video, cover, judul, maupun caption. Penomoran hanya untuk catatan internal (arsip, STATUS, nama folder Drive).

