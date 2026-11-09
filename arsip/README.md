# Arsip produksi (semua artifact per video)

Semua file ada di repo ini. Tabel ini menunjukkan di mana tiap artifact disimpan.

| # | Slug | Judul | Video final | Cover | Caption + komentar | Naskah + sumber | Voiceover | Timestamp (Scribe) | ElevenLabs flow |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hari-ke-10 | 21 Hari Itu Mitos. Ini Angka Sebenarnya | `studio/projects/hari-ke-10-shorts/out/Hari_ke-10.mp4` | `caption/hari-ke-10-shorts-cover.png` | `caption/hari-ke-10-shorts.md` | `naskah/hari-ke-10.md` | `studio/projects/hari-ke-10-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | – |
| 2 | jam-tiga-pagi | 91% Ketakutanmu Nggak Pernah Terjadi | `studio/projects/jam-tiga-pagi-shorts/out/Jam_Tiga_Pagi.mp4` | `caption/jam-tiga-pagi-shorts-cover.png` | `caption/jam-tiga-pagi-shorts.md` | `naskah/jam-tiga-pagi.md` | `studio/projects/jam-tiga-pagi-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | `EJ0jCvP3MuctSWcltQzc` |
| 3 | gitar-di-atas-lemari | 76% Orang Menyesali Hal yang Sama | `studio/projects/gitar-di-atas-lemari/out/Gitar_di_Atas_Lemari.mp4` | `caption/gitar-di-atas-lemari-cover.png` | `caption/gitar-di-atas-lemari.md` | `naskah/gitar-di-atas-lemari.md` | `studio/projects/gitar-di-atas-lemari/input/voiceover.mp3` | `.../input/scribe_words.json` | `IrW3jlX2lM4Ht8EzQGR4` |
| 4 | satu-video-lagi | Tidur 6 Jam Itu Cukup? Cek Angka Ini | `studio/projects/satu-video-lagi-shorts/out/Satu_Video_Lagi.mp4` | `caption/satu-video-lagi-shorts-cover.png` | `caption/satu-video-lagi-shorts.md` | `naskah/satu-video-lagi.md` | `studio/projects/satu-video-lagi-shorts/input/voiceover.mp3` | `.../input/scribe_words.json` | `NrjCQw7sjvoGeu0OlpA9` |

Isi folder proyek: `story/shots.tsv` (shot list ringkas), `story/shots.json`, `story/bible.md`, `scenes/` (kode adegan), `timeline/` (kata + kalimat), `out/` (MP4). Proyek cover: `studio/projects/<slug>-cover/`.
Folder `build/` tidak disimpan (bisa dibuat ulang dengan `tools/produksi.sh`).
Halaman ringkasan (artifact Claude): https://claude.ai/artifact/8zT2UTpuoXUQ3wsdwNvjQC (sumber + pratinjau kecil di `arsip/halaman/`).
