#!/usr/bin/env bash
# Menyiapkan ulang studio di container baru. Jalankan dari folder konten-kit.
set -e
(cd studio && npm install)
pip install numpy scipy faster-whisper
(cd remotion-3d && npm install)
echo "Siap. Render dari studio/ dengan: CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs --project projects/<slug>"
