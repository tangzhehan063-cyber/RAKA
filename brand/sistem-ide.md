# Sistem ide (audience-first)

Mulai dari pengalaman konkret, bukan topik luas. "Disiplin / motivasi / mindset" bukan ide; "kenapa alarm kedua selalu kita matikan" adalah ide.

## Alur (STEP 1–3 di WORKFLOW)
1. **Gali (audience discovery):** ScrapeMedsos hemat (≤4 kredit): `v1_tiktok_search_keyword` region ID untuk keluhan sehari-hari + komentar video teratas; catat kata yang dipakai orang. Tanpa kredit: pakai daftar pain di `strategi-channel.md` dan tandai **hipotesis**. Jangan membuat statistik audience.
2. **Hasilkan 10 ide** memakai `templates/ide.md` (12 field). Sebar lintas pilar (min 4 pilar).
3. **Skor** dengan `python3 tools/skor-ide.py <file ide.json|md>` (lihat bawah).
4. **Pilih 3 terbaik + 1 eksperimental** (ide tak biasa: format, sudut, atau pilar baru; tetap lolos gerbang riset). **Gerbang keputusan 1: user memilih topik.**

## 12 field per ide
TITLE · AUDIENCE PAIN · REAL-LIFE SITUATION · CORE QUESTION · UNEXPECTED ANGLE · HOOK · PSYCHOLOGICAL/SCIENTIFIC EXPLANATION · VISUAL CONCEPT · RESEARCH RISK · SHARE POTENTIAL · SCORE · RECOMMENDATION.
Field 10 audiens/potensi dan 9 risiko ditulis jujur; "belum tahu" lebih baik daripada angka karangan.

## Skor (alat keputusan editorial, BUKAN formula ilmiah)
Setiap faktor 1–5:
| Faktor | Bobot | Pertanyaan |
|---|---|---|
| Relatability | 25% | Apakah 8 dari 10 orang target pernah mengalaminya minggu ini? |
| Hook potential | 25% | Bisa jadi kalimat/gambar 1–2 dtk yang membuat berhenti scroll? |
| Curiosity gap | 20% | Jawabannya tidak bisa ditebak dari judul? |
| Visual potential | 15% | Bisa ditunjukkan dengan stickman/objek/diagram tanpa narasi? |
| Research quality | 15% | Ada studi/tinjauan yang bisa dicek, dengan batas yang jelas? |

Skor total = Σ(skor × bobot) / 5 × 100.
**Research quality = GATE:** skor riset ≤2 → ide **ditolak/ditahan** berapa pun skor totalnya (`skor-ide.py` menandai GATE GAGAL). Skor riset diisi setelah pengecekan sumber minimum (1 pencarian: ada studi utama yang bisa disebut peneliti + tahun?). Bila belum dicek, tulis `riset: ?` dan ide hanya boleh masuk "3 terbaik" setelah dicek.

## Larangan
- Statistik audience/viral palsu. Tanpa data platform tulis "hipotesis".
- Ide yang hanya cocok dengan satu kalimat motivasi.
- Dua ide teratas dari pilar yang sama.

## Format keluaran ke user (ringkas)
Tabel 10 ide (judul, pilar, skor, gate) → 3 terbaik dengan 12 field penuh → 1 eksperimental → rekomendasi 1 pilihan dengan alasan. Minta pilih (AskUserQuestion).
