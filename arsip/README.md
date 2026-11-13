# Arsip produksi (semua artifact per video)

Semua file ada di repo ini. Tabel ini menunjukkan di mana tiap artifact disimpan.

| # | Slug | Judul | Video final | Cover | Caption + komentar | Naskah + sumber | Voiceover | Timestamp (Scribe) | ElevenLabs flow |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hari-ke-10 | 21 Hari Itu Mitos. Ini Angka Sebenarnya | `studio/projects/hari-ke-10-shorts/out/Hari_ke-10.mp4` | `caption/hari-ke-10-shorts-cover.png` | `caption/hari-ke-10-shorts.md` | `naskah/hari-ke-10.md` | `studio/projects/hari-ke-10-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | – |
| 2 | jam-tiga-pagi | 91% Ketakutanmu Nggak Pernah Terjadi | `studio/projects/jam-tiga-pagi-shorts/out/Jam_Tiga_Pagi.mp4` | `caption/jam-tiga-pagi-shorts-cover.png` | `caption/jam-tiga-pagi-shorts.md` | `naskah/jam-tiga-pagi.md` | `studio/projects/jam-tiga-pagi-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | `EJ0jCvP3MuctSWcltQzc` |
| 3 | gitar-di-atas-lemari | 76% Orang Menyesali Hal yang Sama | `studio/projects/gitar-di-atas-lemari/out/Gitar_di_Atas_Lemari.mp4` | `caption/gitar-di-atas-lemari-cover.png` | `caption/gitar-di-atas-lemari.md` | `naskah/gitar-di-atas-lemari.md` | `studio/projects/gitar-di-atas-lemari/input/voiceover.mp3` | `.../input/scribe_words.json` | `IrW3jlX2lM4Ht8EzQGR4` |
| 4 | satu-video-lagi | Tidur 6 Jam Itu Cukup? Cek Angka Ini | `studio/projects/satu-video-lagi-shorts/out/Satu_Video_Lagi.mp4` | `caption/satu-video-lagi-shorts-cover.png` | `caption/satu-video-lagi-shorts.md` | `naskah/satu-video-lagi.md` | `studio/projects/satu-video-lagi-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | `NrjCQw7sjvoGeu0OlpA9` |
| 5 | nunggu-1-januari | Nunggu 1 Januari Itu Jebakan | `studio/projects/nunggu-1-januari-shorts/out/Nunggu_1_Januari.mp4` | `caption/nunggu-1-januari-shorts-cover.png` | `caption/nunggu-1-januari-shorts.md` | `naskah/nunggu-1-januari.md` | `studio/projects/nunggu-1-januari-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | `ZmFocW9hyQaJRn6HMIka` |
| 6 | dua-orang-satu-gaji | Gaji Sama, Kok Rasanya Beda? | `studio/projects/dua-orang-satu-gaji-shorts/out/Dua_Orang_Satu_Gaji.mp4` | `caption/dua-orang-satu-gaji-shorts-cover.png` | `caption/dua-orang-satu-gaji-shorts.md` | `naskah/dua-orang-satu-gaji.md` | `studio/projects/dua-orang-satu-gaji-shorts/input/voiceover.mp3` (+ `lines.json`) | `.../input/words_merged.json` | `fMHpwTsx0oB8CfNshoHF` |
| 7 | ditolak-duluan | Kalah 1 Poin di Interview Final | `studio/projects/ditolak-duluan-shorts/out/Ditolak_Duluan.mp4` (Drive) | `caption/ditolak-duluan-shorts-cover.png` | `caption/ditolak-duluan.md` | `naskah/ditolak-duluan.md` | Drive (VO + hening 2 dtk di 29,0) | `.../input/words_gap.json` | `KXNPNAqB27lrxrhpunEQ` |
| 8 | tas-belum-dilepas | Kenapa Kita Duduk Dulu Setelah Pulang Kerja | `studio/projects/tas-belum-dilepas-shorts/out/Tas_Belum_Dilepas.mp4` (dikirim ke user; 45 MB) | `caption/tas-belum-dilepas-shorts-cover.png` | `caption/tas-belum-dilepas-shorts.md` | `naskah/tas-belum-dilepas.md` | VO Gemini (Charon, diambil di sesi; WAV tidak di repo) | `.../input/scribe_words.json` (align_teks) | Hibrid 2D+3D, palet clay/indigo/arctic |

Isi folder proyek: `story/shots.tsv` (shot list ringkas), `story/shots.json`, `story/bible.md`, `scenes/` (kode adegan), `timeline/` (kata + kalimat), `out/` (MP4). Proyek cover: `studio/projects/<slug>-cover/`.
Folder `build/` tidak disimpan (bisa dibuat ulang dengan `tools/produksi.sh`).
Halaman ringkasan (artifact Claude): https://claude.ai/artifact/8zT2UTpuoXUQ3wsdwNvjQC (sumber + pratinjau kecil di `arsip/halaman/`).
Caption TikTok semua video (tombol Salin): https://claude.ai/artifact/GpZBXeEfm3ggEXsbsXKLNj (salinan `caption/tiktok-semua.html`).
