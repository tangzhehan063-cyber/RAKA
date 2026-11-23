#!/usr/bin/env bash
# tools/produksi.sh — satu pintu untuk semua tahap produksi Shorts stickman (hemat token: output ringkas saja).
# Jalankan dari root repo. <slug> tanpa akhiran "-shorts" (mis. jam-tiga-pagi).
#
#   tools/produksi.sh setup                         # container baru: npm + numpy/scipy (sekali)
#   tools/produksi.sh init     <slug> <url|mp3>     # unduh VO, buat proyek, salin library, default Shorts
#   tools/produksi.sh timeline <slug> <words_url|json>  # Scribe words.json -> timeline (angka jadi digit)
#   tools/produksi.sh shots    <slug>               # story/shots.tsv -> story/shots.json
#   tools/produksi.sh cek      <slug>               # cek sutradara (ritme, transisi, kamera, waktu baca, suara, palet, animasi); GAGAL wajib diperbaiki
#   tools/produksi.sh palet    <slug> [gaya,gaya,..] [t1,t2]  # perbandingan gaya warna untuk pilihan user (WAJIB sebelum sheet) -> build/styles/style_grid.png
#   tools/produksi.sh sheet    <slug>               # cek sutradara + contact sheet 0.5x + overlay zona aman TikTok -> build/sheets/safe.png (CEK DENGAN MATA)
#   tools/produksi.sh stills   <slug> 1.2,30.5      # still tertentu 0.5x -> build/stills/sheet_01.png
#   tools/produksi.sh final    <slug>               # render penuh + mix + QC (jalankan di background)
#   tools/produksi.sh qc       <slug>               # durasi, audio, LUFS, contact sheet video jadi
#   tools/produksi.sh cover    <slug>               # proyek <slug>-cover -> caption/<slug>-shorts-cover.png
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; ST="$ROOT/studio"; export CHROMIUM_PATH="${CHROMIUM_PATH:-/opt/pw-browsers/chromium}"
WORKERS="${WORKERS:-$(( $(nproc) > 2 ? $(nproc) - 1 : 1 ))}"
cmd="${1:-}"; slug="${2:-}"; P="projects/${slug}-shorts"; PA="$ST/$P"
tmp="${TMPDIR:-/tmp}/raka-$$"; mkdir -p "$tmp"

case "$cmd" in
setup)
  (cd "$ST" && npm install --silent) && pip install -q numpy scipy 2>/dev/null; echo "setup ok" ;;
init)
  src="$3"; if [[ "$src" == http* ]]; then mkdir -p "$tmp/dl"; curl -sS -o "$tmp/dl/vo.mp3" "$src"; src="$tmp/dl/vo.mp3"; fi
  cd "$ST" && python3 tools/new_project.py --name "${slug}-shorts" --voice "$src" --aspect 9:16 --resolution 1080p --fps 24 --title "$slug" --captions
  cp library/cast.js "$P/scenes/" && cp library/sets/*.js "$P/scenes/sets/"
  python3 - "$P/config.json" <<'EOF'
import json,sys
p=sys.argv[1]; c=json.load(open(p))
# gaya awal 'lembut' (default); ganti sesuai pilihan user lewat produksi.sh palet
c.update(fadeIn=0, fadeOut=0.3, style=c.get('style_pilihan','lembut'))
json.dump(c,open(p,'w'),indent=1)
EOF
  echo "init ok: $P" ;;
timeline)
  src="$3"; dst="$PA/input/scribe_words.json"
  if [[ "$src" == http* ]]; then curl -sS -o "$dst" "$src"; else cp "$src" "$dst"; fi
  python3 "$ROOT/tools/scribe_to_timeline.py" "$dst" "$PA/input/script.json" > /dev/null
  cd "$ST" && python3 tools/parse_script.py --project "$P" --script "$P/input/script.json" | tail -1
  python3 - "$PA/timeline/sentences.json" <<'EOF'
import json,sys
for s in json.load(open(sys.argv[1])): print(f"{s['start']:6.2f} {s['end']:6.2f}  {s['text']}")
EOF
  ;;
shots)
  python3 "$ROOT/tools/shots_tsv.py" "$PA/story/shots.tsv" "$PA" ;;
cek) python3 "$ROOT/tools/cek-sutradara.py" "$slug" ;;
palet)
  styles="${3:-paper,clay,lembut,sakura,lavender,indigo,arctic,ember}"
  times="${4:-$(python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); n=d["duration"]; print("%.1f,%.1f" % (n*0.12, n*0.62))' "$PA/story/shots.json")}"
  cd "$ST" && node render.mjs --project "$P" --styles "$styles" --at "$times" 2>&1 | grep -iE "error|wrote" | tail -2
  echo "$PA/build/styles/style_grid.png (urutan atas-bawah: $styles; kolom = $times dtk)" ;;
sheet)
  python3 "$ROOT/tools/cek-sutradara.py" "$slug" || echo "!! cek-sutradara: ada GAGAL, perbaiki dulu"
  cd "$ST" && node render.mjs --project "$P" --sheet --scale 0.5 --workers "$WORKERS" 2>&1 | grep -iE "error|wrote" | tail -3
  python3 "$ROOT/tools/safezone.py" "$PA/build/sheets/safe.png" $(ls "$PA"/build/sheets/s[0-9][0-9]_*.png | sort -V) ;;   # sheet + zona aman TikTok
stills)
  cd "$ST" && node render.mjs --project "$P" --stills "$3" --scale 0.5 2>&1 | grep -iE "error|wrote" | tail -3
  python3 "$ROOT/tools/safezone.py" "$PA/build/stills/safe.png" $(ls "$PA"/build/stills/*s_*.png | sort -V) ;;
final)
  cd "$ST" && node render.mjs --project "$P" --workers "$WORKERS" 2>&1 | grep -iE "error|done" | tail -3
  python3 audio/mix.py --project "$P" 2>&1 | tail -1
  exec "$ROOT/tools/produksi.sh" qc "$slug" ;;
qc)
  f=$(ls "$PA"/out/*.mp4 | head -1)
  ffprobe -v error -show_entries stream=codec_type,width,height:format=duration -of compact "$f" | tr '\n' ' '; echo
  ffmpeg -hide_banner -i "$f" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | tail -1
  python3 "$ROOT/tools/qc-teknis.py" "$f" --out-dir "$PA/out" || echo "!! qc-teknis: ada GAGAL (lihat di atas)"
  ffmpeg -v error -y -i "$f" -vf "fps=1/3.5,scale=216:-1,tile=8x2" -frames:v 1 "$PA/build/qc.png"; echo "$PA/build/qc.png" ;;
cover)
  C="projects/${slug}-cover"; cd "$ST"
  node render.mjs --project "$C" --stills 0.5 --scale 1 2>&1 | grep -iE "error|wrote" | tail -2
  mkdir -p "$ST/$C/out" && cp "$ST/$C/build/stills/0.5s_0.50.png" "$ST/$C/out/cover.png" && cp "$ST/$C/out/cover.png" "$ROOT/caption/${slug}-shorts-cover.png"
  echo "caption/${slug}-shorts-cover.png" ;;
*) sed -n 2,14p "$0"; exit 1 ;;
esac
