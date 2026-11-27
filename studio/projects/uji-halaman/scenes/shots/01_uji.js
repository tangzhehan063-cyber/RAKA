// uji-halaman: halaman komik 3 panel bertahap -> webtoon -> balik halaman. Warna komikMint.
import { E, registerShot, alpha, shade, rr, poly, circle, FONTS, ease, prog, lerp } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
const INK = '#14121a';
const C = { mint: '#b8f2d8', peach: '#ffd6a5', pink: '#ff9eb5', yel: '#fff27a', hot: '#ff5a36', blue: '#2563eb', paper: '#fffdf5' };
const pop = (t, at, d = 0.28) => ease.outBack(prog(t, at, at + d));
const WATI = { top: 'dress', color: '#d64a33', head: 'bun' };
const COWOK = { top: 'tshirt', color: C.blue, head: 'none' };
const txt = (g, str, x, y, size, col, rot = 0, outline = true) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; if (outline) { g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 8, 10); g.fillStyle = INK; g.fillText(str, 8, 10); g.strokeText(str, 0, 0); } g.fillStyle = col; g.fillText(str, 0, 0); g.restore(); };
const bubble = (g, x, y, w, h, str, size, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -w / 2 + 7, -h / 2 + 9, w, h, 34); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, 34); g.fillStyle = C.paper; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); poly(g, [[-w * 0.25, h / 2 - 4], [-w * 0.4, h / 2 + 50], [-w * 0.1, h / 2 - 4]], C.paper); g.stroke(); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText(str, 0, 3); g.restore(); };
const page = (g) => { g.fillStyle = C.paper; g.fillRect(0, 0, E.W, E.H); g.fillStyle = alpha(C.pink, 0.3); for (let y = 0; y < E.H; y += 44) for (let x = ((y / 44) % 2) * 22; x < E.W; x += 44) { g.beginPath(); g.arc(x, y, 3, 0, 6.3); g.fill(); } };
// satu panel berbingkai: pop dari tengah, isi digambar di koordinat lokal (0..w, 0..h)
const panel = (g, x, y, w, h, bgc, k, inner) => { if (k <= 0) return; g.save(); g.translate(x + w / 2, y + h / 2); g.scale(k, k); g.translate(-w / 2, -h / 2);
  rr(g, 10, 12, w, h, 10); g.fillStyle = INK; g.fill(); rr(g, 0, 0, w, h, 10); g.fillStyle = bgc; g.fill(); g.save(); rr(g, 0, 0, w, h, 10); g.clip(); inner(g, w, h); g.restore(); g.lineWidth = 11; g.strokeStyle = INK; rr(g, 0, 0, w, h, 10); g.stroke(); g.restore(); };
const floor = (g, w, h, y, col) => { g.fillStyle = col; g.fillRect(0, y, w, h - y); g.fillStyle = INK; g.fillRect(0, y, w, 8); };

registerShot('s01', { draw(g, t) {
  page(g);
  panel(g, 50, 170, 980, 520, C.mint, pop(t, 0.15), (g, w, h) => { floor(g, w, h, 430, shade(C.mint, -0.15)); drawFigure(g, { x: 260, y: 430, s: 1.7, facing: 1, outfit: WATI, pose: POSES.relaxed, expr: 'worried', rim: null, shadow: false }); txt(g, 'JAM ENAM SORE', 640, 130, 62, C.hot); txt(g, 'KRL PENUH', 640, 220, 82, C.paper); });
  panel(g, 50, 740, 470, 560, C.peach, pop(t, 0.9), (g, w, h) => { const sp = POSES.sit; drawFigure(g, { x: 235, y: 540, s: 2.2, facing: 1, outfit: COWOK, pose: sp, expr: 'sleepy', rim: null, shadow: false }); const hx = 235 + sp.head[0] * 2.2, hy = 540 + sp.head[1] * 2.2; g.lineCap = 'round'; g.lineWidth = 20; g.strokeStyle = INK; g.beginPath(); g.arc(hx, hy, 68, Math.PI * 1.02, Math.PI * 1.98); g.stroke(); g.lineWidth = 11; g.strokeStyle = C.hot; g.stroke(); txt(g, 'MATA MEREM', 235, 70, 52, C.paper); });
  panel(g, 560, 740, 470, 560, C.pink, pop(t, 1.6), (g, w, h) => { drawFigure(g, { x: 150, y: 560, s: 2.2, facing: 1, outfit: WATI, pose: POSES.reach, expr: 'nervous', rim: null, shadow: false }); bubble(g, 290, 150, 300, 110, 'Mas...', 70, pop(t, 2.0)); });
  txt(g, 'HALAMAN 1', 540, 1420, 64, C.hot, -0.02); } });

registerShot('s02', { draw(g, t) {
  g.fillStyle = C.mint; g.fillRect(0, 0, E.W, E.H); floor(g, E.W, E.H, 1130, shade(C.mint, -0.15));
  rr(g, 560, 884, 600, 56, 16); g.fillStyle = C.hot; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.fillRect(610, 940, 18, 190);
  const sp = POSES.sit; drawFigure(g, { x: 820, y: 1100, s: 2.6, facing: 1, outfit: COWOK, pose: sp, expr: 'sleepy', rim: null, shadow: false });
  drawFigure(g, { x: 330, y: 1130, s: 3.0, facing: 1, outfit: WATI, pose: POSES.reach, expr: 'worried', rim: null, shadow: false });
  bubble(g, 540, 460, 420, 140, 'Mas...', 88, pop(t, 0.3));
  if (t > 1.5) txt(g, 'BERSAMBUNG...', 540, 1330, 120, C.hot, -0.04); } });

registerShot('s03', { draw(g, t) {
  g.fillStyle = C.peach; g.fillRect(0, 0, E.W, E.H); floor(g, E.W, E.H, 1130, shade(C.peach, -0.15));
  drawFigure(g, { x: 560, y: 1130, s: 3.4, facing: 1, outfit: COWOK, pose: POSES.shrug, expr: 'worried', rim: null, shadow: false });
  bubble(g, 540, 420, 920, 140, 'Aduh, maaf Bu. Saya nggak lihat.', 48, pop(t, 0.5)); txt(g, 'HALAMAN 2', 540, 1330, 90, C.hot, 0.03); } });
