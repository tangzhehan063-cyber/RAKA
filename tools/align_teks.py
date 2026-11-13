#!/usr/bin/env python3
"""Timestamp kata tanpa Scribe (untuk VO Gemini/edge-tts): teks naskah + jeda hening di audio.

Pakai: python3 tools/align_teks.py <audio.wav> <teks.txt> <out words.json>

Cara kerja: ffmpeg silencedetect memotong audio jadi potongan bicara; teks dipotong di tanda baca.
Keduanya dicocokkan dengan DP (urutan tetap, satu kelompok teks = satu kelompok potongan audio,
biaya = selisih proporsi durasi vs proporsi panjang huruf). Di dalam kelompok, waktu kata dibagi
menurut jumlah huruf. Akurasi ±0,1–0,3 dtk: cukup untuk subtitle & beat, cek still sebelum render.
Format keluaran sama dengan words.json video lama ({"words": [{word, start, end}]}).
"""
import json, re, subprocess, sys

def speech_chunks(wav, noise='-35dB', d='0.18'):
    out = subprocess.run(['ffmpeg', '-i', wav, '-af', f'silencedetect=noise={noise}:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    h, mi, se = re.search(r'Duration: (\d+):(\d+):([\d.]+)', out).groups(); dur = int(h) * 3600 + int(mi) * 60 + float(se)
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    chunks, cur = [], 0.0
    for s, e in zip(st, en):
        if s - cur > 0.05: chunks.append((cur, s))
        cur = e
    if dur - cur > 0.05: chunks.append((cur, dur))
    return chunks

def weight(s):
    return max(1, len(re.sub(r'[^0-9A-Za-zÀ-ÿ]', '', s)))

def align(texts, chunks, maxk=4):
    n, m = len(texts), len(chunks)
    tw = [weight(t) for t in texts]; T = sum(tw)
    cd = [b - a for a, b in chunks]; D = sum(cd)
    INF = float('inf'); dp = [[INF] * (m + 1) for _ in range(n + 1)]; bk = {}
    dp[0][0] = 0
    for i in range(n + 1):
        for j in range(m + 1):
            if dp[i][j] == INF: continue
            for a in range(1, maxk + 1):
                for b in range(1, maxk + 1):
                    if i + a > n or j + b > m or (a > 1 and b > 1): continue
                    c = (sum(tw[i:i + a]) / T - sum(cd[j:j + b]) / D) ** 2 * 1e4 + 0.5 * (a + b - 2)
                    if dp[i][j] + c < dp[i + a][j + b]:
                        dp[i + a][j + b] = dp[i][j] + c; bk[(i + a, j + b)] = (i, j)
    groups, ij = [], (n, m)
    while ij != (0, 0):
        pi, pj = bk[ij]; groups.append((texts[pi:ij[0]], chunks[pj:ij[1]])); ij = (pi, pj)
    return groups[::-1]

def main():
    wav, txt, out = sys.argv[1:4]
    text = open(txt, encoding='utf-8').read().strip()
    texts = [t for t in re.split(r'(?<=[.,?!:])\s+', text) if t]
    words = []
    for tg, cg in align(texts, speech_chunks(wav)):
        ws = ' '.join(tg).split()
        # waktu bicara dalam kelompok (jeda di antara potongan audio diabaikan)
        spans = [(a, b) for a, b in cg]; total = sum(b - a for a, b in spans)
        wt = [weight(w) for w in ws]; W = sum(wt); acc = 0.0
        def at(x):  # posisi 0..total → detik nyata
            for a, b in spans:
                if x <= b - a: return a + x
                x -= b - a
            return spans[-1][1]
        for w, k in zip(ws, wt):
            s = at(acc); acc += total * k / W; e = at(acc)
            words.append({'word': w, 'start': round(s, 3), 'end': round(e, 3)})
    json.dump({'words': words}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'{len(words)} kata, {len(texts)} potongan teks; akhir {words[-1]["end"]} dtk → {out}')

if __name__ == '__main__':
    main()
