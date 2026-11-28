# WORKFLOW RAKA (v2, 23 Nov 2026): dari audiens sampai post-mortem

Satu video ≈ satu chat. Semua perintah dari root repo. Bahasa Indonesia. Detail teknis engine/render/distribusi: `brand/produksi-teknis.md` (workflow lama langkah 4–7 dipindah ke sana, tidak dihapus).
**Gerbang persetujuan user (hanya 5):** G1 topik · G2 angle riset · G3 naskah final · G4 suara (mesin + hasil) & storyboard/palet bila arah berubah · G5 contact sheet sebelum render final (kecuali user minta mode autonomous). Selebihnya Claude jalan sendiri; jangan minta ACC untuk hal kecil.
Setiap tahap: **INPUT → PROSES → OUTPUT → GATE (kualitas) → NEXT**.

| # | Tahap | Skill | Input → Output | Quality gate |
|---|---|---|---|---|
| 0 | Inisialisasi sesi | – | `git fetch origin` + merge cabang `claude/*` yang belum masuk; baca `STATUS.md`, `analitik/video.csv`; container baru: `tools/produksi.sh setup` → konteks siap | STATUS terbaca, repo bersih, tahu video berikutnya |
| 1 | Audience discovery | content-strategist | strategi + data + (ScrapeMedsos ≤4 kredit) → daftar pain konkret (hipotesis bila tanpa data) | semua pain berupa kejadian sehari-hari |
| 2 | Ideasi | content-strategist | pain → 10 ide `templates/ide.md`, skor `tools/skor-ide.py` | ≥4 pilar, riset dicek awal |
| 3 | Pemilihan topik | content-strategist | 10 ide → 3 terbaik + 1 eksperimental → **G1** | gate riset lolos |
| 4 | Riset | psychology-researcher | topik → `riset/<slug>.md` (research brief) → **G2** | Tier 1 + replikasi dicek, 8 larangan lolos |
| 5 | Eksplorasi hook | retention-scriptwriter | brief → ≥5 hook (A–E), 1 terpilih | hook paham 1–2 dtk, konkret, dibayar |
| 6 | Penulisan naskah | retention-scriptwriter | brief + hook → 3 pendekatan → pilih 1 → `naskah/<slug>.md` + teks TTS | `tools/cek-naskah.py` tanpa GAGAL, humanizer |
| 7 | Retention review | retention-editor | naskah → retention map, potongan, revisi | tak ada segmen skor 5 |
| 8 | Persetujuan naskah | – | **G3** user ACC; caption + komentar pertama menyusul (`CLAUDE.md`) | user ACC |
| 9 | Produksi audio | (audio.md) | teks TTS → tanya mesin (Gemini/ElevenLabs) **G4** → VO → timestamp (`align_teks.py`/Scribe) → `produksi.sh timeline` | VO jelas, jeda wajar, timeline benar |
| 10 | Storyboard | storyboard-director | naskah + timeline → `shots.tsv`, storyboard, pilihan palet (`produksi.sh palet`) | tiap scene punya fungsi + alasan; `produksi.sh cek` tanpa GAGAL |
| 11 | Animatic | storyboard-director | `python3 tools/animatic.py <slug>` → cek timing | potongan jatuh di awal kata |
| 12 | Implementasi video | video-engineer | storyboard → kode adegan → `produksi.sh sheet` → **G5** | `safe.png` bersih, `brand/cek-bug.md` |
| 13 | QC teknis | video-engineer | render → `python3 tools/qc-teknis.py <mp4> --durasi N` | tanpa GAGAL |
| 14 | QC konten | retention-editor | video + `templates/qc-konten.md` | semua poin lolos; gagal → kembali ke 6/10 |
| 15 | Render final | video-engineer | `tools/produksi.sh final <slug>` (background) → MP4 | QC teknis ulang bila ada render ulang |
| 16 | Persiapan publish | – | cover (`produksi.sh cover`), caption ≤150 karakter (+YouTube Shorts bila diminta), arsip, Drive, STATUS; distribusi per `brand/produksi-teknis.md` §7 | caption tak lebih kuat dari video; humanizer |
| 17 | Analitik | performance-analyst | data dari user (24–48 jam) → `analitik/video.csv` → `tools/analitik.py` | kolom tak tersedia dibiarkan kosong |
| 18 | Post-mortem | performance-analyst | `templates/post-mortem.md` → eksperimen berikutnya `analitik/eksperimen.md` | satu variabel, n disebut |

## Aturan lintas tahap
- **Provider tidak berubah:** VO = Gemini TTS atau ElevenLabs (pilih user tiap video); aturan hemat ElevenLabs di `CLAUDE.md`. Tanpa AI image/video generation, tanpa API baru.
- **Render final sebelum naskah dan storyboard/sheet disetujui:** dilarang, kecuali user minta mode autonomous secara eksplisit.
- **Commit/push/PR hanya bila diizinkan.** Aturan lama "video selesai → PR → merge sendiri" tetap berlaku untuk distribusi video yang diminta user (`KEPUTUSAN.md` 16 Nov); perubahan sistem (dokumen/skill/tools) memerlukan izin eksplisit.
- Hemat token: jangan baca JSON mentah (pakai `tools/scrape_ringkas.py`/`jq`); jangan baca engine/kode video lama bila contekan cukup; panggilan independen paralel; render penuh di background tanpa polling.
- Panel Studio (artifact) dan alur `db_write`: tetap tersedia, lihat `brand/produksi-teknis.md` dan STATUS lama; bukan wajib.
- Mode cepat konfirmasi lama (3 titik ACC) digantikan 5 gerbang di atas.
- Dry run contoh (tanpa render/kredit): `naskah/dry-run-buka-hp.md`.
