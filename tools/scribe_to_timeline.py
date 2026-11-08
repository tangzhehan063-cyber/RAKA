#!/usr/bin/env python3
"""ElevenLabs Scribe words.json -> GrowKaz timeline script.json
- drops eleven_v4 audio tags like [calm, slow] / [whispering]
- turns spoken Indonesian numbers into numerals for captions ("enam puluh enam" -> "66", "ke-sembilan" -> "ke-9")
Usage: python3 scribe_to_timeline.py scribe_words.json out_script.json
Then:  python3 tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.json
"""
import json, re, sys

UNIT = {"nol": 0, "satu": 1, "dua": 2, "tiga": 3, "empat": 4, "lima": 5, "enam": 6, "tujuh": 7, "delapan": 8, "sembilan": 9}
SPECIAL = {"sepuluh": 10, "sebelas": 11, "seratus": 100, "seribu": 1000}
MULT = {"belas": None, "puluh": 10, "ratus": 100, "ribu": 1000, "juta": 1_000_000}
NUMWORDS = set(UNIT) | set(SPECIAL) | set(MULT)

def split_punct(t):
    m = re.match(r'^(["\'(]*)(.*?)([.,!?…:;"\')]*)$', t)
    return m.group(1), m.group(2), m.group(3)

def parse_num(tokens):
    total, cur, last = 0, 0, 0
    for w in tokens:
        if w in UNIT: cur += UNIT[w]; last = UNIT[w]
        elif w in ("sepuluh", "sebelas"): cur += SPECIAL[w]; last = 0
        elif w == "seratus": cur += 100; last = 0
        elif w == "seribu": total += 1000; last = 0
        elif w == "belas": cur += 10; last = 0
        elif w == "puluh": cur += last * 9; last = 0          # dua puluh = 2 -> 20
        elif w == "ratus": cur += last * 99; last = 0         # dua ratus = 2 -> 200
        elif w in ("ribu", "juta"): total += (cur or 1) * MULT[w]; cur = 0; last = 0
    return total + cur

def main(src, dst):
    d = json.load(open(src)); ws = d["words"] if isinstance(d, dict) else d
    words, skip = [], False
    for w in ws:
        if w.get("type", "word") != "word": continue
        t = (w.get("text") or w.get("word") or "").strip()
        if t.startswith("["): skip = not t.endswith("]"); continue
        if skip:
            if t.endswith("]"): skip = False
            continue
        words.append({"word": t.replace('"', ''), "start": w["start"], "end": w["end"]})
    out, i = [], 0
    while i < len(words):
        pre, core, post = split_punct(words[i]["word"]); low = core.lower()
        prefix = ""
        if low.startswith("ke-"): prefix, low = core[:3], low[3:]
        if low in NUMWORDS and low not in ("belas", "puluh", "ratus", "ribu", "juta"):
            seq, j, tail = [low], i, post
            while not tail and j + 1 < len(words):
                p2, c2, t2 = split_punct(words[j + 1]["word"])
                if c2.lower() in NUMWORDS: seq.append(c2.lower()); j += 1; tail = t2
                else: break
            val = parse_num(seq)
            if len(seq) == 1 and not prefix and val < 10: out.append(words[i]); i += 1; continue
            out.append({"word": f"{pre}{prefix}{val}{tail}", "start": words[i]["start"], "end": words[j]["end"]}); i = j + 1
        else:
            out.append(words[i]); i += 1
    json.dump({"words": out}, open(dst, "w"), ensure_ascii=False, indent=0)
    print(" ".join(w["word"] for w in out))

if __name__ == "__main__": main(sys.argv[1], sys.argv[2])
