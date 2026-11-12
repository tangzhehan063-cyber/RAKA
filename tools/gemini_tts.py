#!/usr/bin/env python3
"""Draf suara gratis/murah: naskah/*.txt -> audio/*.wav lewat Gemini TTS (atau edge-tts).

ElevenLabs hanya untuk versi final (lihat "Aturan hemat ElevenLabs" di CLAUDE.md).
Hanya pustaka standar Python (edge-tts opsional).

Pakai:
  GEMINI_API_KEY=... python3 tools/gemini_tts.py naskah/hari-ke-10.txt
  python3 tools/gemini_tts.py --all                # semua naskah/*.txt yang teksnya berubah
  python3 tools/gemini_tts.py --engine edge naskah/x.txt   # tanpa API key (edge-tts)

Variabel lingkungan (opsional):
  GEMINI_TTS_MODEL  model TTS; bila kosong dicoba berurutan dari daftar MODELS di bawah
  GEMINI_TTS_VOICE  nama suara Gemini (bawaan "Charon")
  GEMINI_TTS_STYLE  arahan gaya baca yang ditaruh di depan teks
  EDGE_TTS_VOICE    suara edge-tts (bawaan "id-ID-ArdiNeural")

File teks yang tidak berubah dilewati (hash di audio/.tts-hash.json), jadi kuota tidak terbuang.
"""
import argparse
import base64
import glob
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
import wave

MODELS = ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-pro-preview-tts"]
API = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
RATE = 24000
CHUNK = 900  # karakter per permintaan; naskah panjang dipecah di batas paragraf/kalimat


def clean(text):
    text = re.sub(r"\[[^\]]*\]", "", text)          # buang tag arahan ElevenLabs, mis. [calm, slow]
    text = "\n".join(l for l in text.splitlines() if not l.lstrip().startswith("#"))
    return re.sub(r"[ \t]+", " ", text).strip()


def chunks(text):
    parts, cur = [], ""
    for sent in re.split(r"(?<=[.!?])\s+|\n+", text):
        if not sent.strip():
            continue
        if cur and len(cur) + len(sent) + 1 > CHUNK:
            parts.append(cur)
            cur = sent
        else:
            cur = (cur + " " + sent).strip()
    if cur:
        parts.append(cur)
    return parts


def _post(url, key, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "x-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.load(r)


def _pcm_from_response(res):
    part = res["candidates"][0]["content"]["parts"][0]["inlineData"]
    raw = base64.b64decode(part["data"])
    if raw[:4] == b"RIFF":  # sebagian model mengirim WAV utuh
        data_at = raw.find(b"data")
        return raw[data_at + 8:] if data_at > 0 else raw[44:]
    return raw              # PCM 16-bit mono 24 kHz


def gemini_pcm(text, key, voice, model_pref):
    models = [model_pref] if model_pref else MODELS
    voice_shapes = [{"prebuiltVoiceConfig": {"voiceName": voice}}, {"voice": voice}]
    last = None
    for model in models:
        for vc in voice_shapes:
            body = {"contents": [{"parts": [{"text": text}]}],
                    "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": vc}}}
            try:
                return _pcm_from_response(_post(API.format(model=model), key, body)), model
            except urllib.error.HTTPError as e:
                last = f"{model}: HTTP {e.code} {e.read()[:300].decode(errors='replace')}"
                if e.code in (401, 403, 429):
                    raise SystemExit(f"Gemini menolak ({last}). Cek GEMINI_API_KEY / kuota.")
            except (KeyError, IndexError) as e:
                last = f"{model}: respons tanpa audio ({e})"
    raise SystemExit(f"Semua model Gemini TTS gagal. Terakhir: {last}\nSet GEMINI_TTS_MODEL ke model TTS yang aktif.")


def write_wav(path, pcm):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm)


def edge_wav(text, path, voice):
    mp3 = path[:-4] + ".edge.mp3"
    subprocess.run([sys.executable, "-m", "edge_tts", "--voice", voice, "--text", text, "--write-media", mp3], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ac", "1", "-ar", str(RATE), path], check=True)
    os.remove(mp3)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*")
    ap.add_argument("--all", action="store_true", help="proses semua naskah/*.txt")
    ap.add_argument("--out-dir", default="audio")
    ap.add_argument("--engine", choices=["gemini", "edge"], default="gemini")
    ap.add_argument("--force", action="store_true", help="buat ulang walau teks tidak berubah")
    a = ap.parse_args()

    files = sorted(set(a.files + (glob.glob("naskah/*.txt") if a.all else [])))
    if not files:
        ap.error("beri file naskah .txt atau --all")
    voice = os.environ.get("GEMINI_TTS_VOICE", "Charon") if a.engine == "gemini" else os.environ.get("EDGE_TTS_VOICE", "id-ID-ArdiNeural")
    style = os.environ.get("GEMINI_TTS_STYLE", "").strip()
    model = os.environ.get("GEMINI_TTS_MODEL", "").strip()
    key = os.environ.get("GEMINI_API_KEY", "")
    if a.engine == "gemini" and not key:
        raise SystemExit("GEMINI_API_KEY belum di-set (di GitHub: Settings > Secrets > Actions).")

    hash_path = os.path.join(a.out_dir, ".tts-hash.json")
    hashes = json.load(open(hash_path)) if os.path.exists(hash_path) else {}
    made = 0
    for f in files:
        name = os.path.splitext(os.path.basename(f))[0]
        out = os.path.join(a.out_dir, name + ".wav")
        text = clean(open(f, encoding="utf-8").read())
        if not text:
            print(f"lewati {f}: kosong")
            continue
        h = hashlib.sha256(f"{a.engine}|{voice}|{model}|{style}|{text}".encode()).hexdigest()
        if not a.force and hashes.get(name) == h and os.path.exists(out):
            print(f"lewati {f}: teks tidak berubah")
            continue
        if a.engine == "edge":
            edge_wav(text, out, voice)
            used = "edge-tts"
        else:
            pcm, used = b"", model
            for part in chunks(text):
                p, used = gemini_pcm((style + "\n" + part).strip() if style else part, key, voice, model)
                pcm += p + b"\x00\x00" * int(RATE * 0.25)  # jeda 0,25 dtk antar potongan
            write_wav(out, pcm)
        hashes[name] = h
        made += 1
        print(f"✓ {out} ({used}, suara {voice})")
    os.makedirs(a.out_dir, exist_ok=True)
    json.dump(hashes, open(hash_path, "w"), indent=1, sort_keys=True)
    print(f"selesai: {made} file dibuat")


if __name__ == "__main__":
    main()
