# Audio & sound design (STEP 9)

Provider tidak berubah: **Gemini TTS** (`tools/gemini_tts.py`) atau **ElevenLabs**, dipilih user tiap video. Tidak ada provider baru.

## Alur
1. Naskah final disetujui (gerbang 3).
2. **Tanya user: Gemini TTS atau ElevenLabs?** (AskUserQuestion; jangan pilih sendiri). Gemini dipilih → Claude buat sendiri (suara bawaan Charon; model `gemini-3.1-flash-tts-preview` bila 429). ElevenLabs → aturan hemat di CLAUDE.md (1 take, naskah final dulu, 1 flow per video).
3. Inspeksi VO: dengarkan/ukur durasi, jeda, kata salah baca (angka, singkatan), clipping.
4. Timing: Gemini → `tools/align_teks.py` (teks TANPA tag), ElevenLabs → Scribe → `scribe_to_timeline.py`.
5. Sinkronkan storyboard ke timestamp (gerbang ritme `cek-sutradara`).
6. Musik: `@music` di `shots.tsv` (`studio/audio/music.py`).
7. SFX: `studio/audio/sfx.py` lewat kolom sfx.
8. Mix: `python3 studio/audio/mix.py --project projects/<slug>-shorts`.
9. QC audio: `tools/qc-teknis.py`.

## Prinsip
- Kejelasan suara dulu. Musik tidak boleh menutupi VO (ducking bawaan mix; musik ≤ −18 dB relatif VO).
- SFX punya fungsi (transisi, angka kunci, momen komedi), bukan di tiap kalimat. Cek: ≥ sebagian kalimat tanpa SFX itu normal.
- Musik tidak terlalu dramatis untuk topik ringan; gaya `komik` terang pakai musik ringan.
- **Hening** adalah alat: dipakai bila ada momen emosi atau pembalikan, bukan kewajiban.
- Tanpa `[whispering]`. Tanpa tag arahan di teks untuk `align_teks`.
- Target: −14 LUFS terintegrasi, true peak ≤ −1 dBTP, tidak ada clipping, sinkron kata-gambar ≤0,35 dtk.
