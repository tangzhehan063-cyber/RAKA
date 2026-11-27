// cover #21 "Kursi Prioritas": SAMPUL KOMIK (spotlight, kerumunan, masthead, badge nomor). Teks utama di pita tengah (aman crop 3:4).
import { E, registerShot, alpha, shade, rr, poly, circle, seg, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
const INK = '#14121a';
const C = { mint: '#b8f2d8', peach: '#ffd6a5', pink: '#ff9eb5', yel: '#fff27a', hot: '#ff5a36', blue: '#2563eb', night: '#2b3a67', paper: '#fffdf5' };
const sticker = (g, str, x, y, size, col, rot = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
const box = (g, x, y, w, h, fill, rot = 0, r = 22) => { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2 + 9, -h / 2 + 11, w, h, r); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.restore(); };
const label = (g, str, x, y, size, col, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, 0, 3); g.restore(); };
registerShot('c01', { draw(g) {
  const W = E.W, H = E.H, GYc = 1500;
  // latar redup (teal gelap) + sinar radial + halftone
  g.fillStyle = shade(C.mint, -0.4); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 24; i++) { const a0 = i * Math.PI / 12, a1 = a0 + Math.PI / 24; poly(g, [[540, 1000], [540 + Math.cos(a0) * 2200, 1000 + Math.sin(a0) * 2200], [540 + Math.cos(a1) * 2200, 1000 + Math.sin(a1) * 2200]], alpha(C.night, 0.28)); }
  g.fillStyle = alpha(C.pink, 0.22); for (let y = 0; y < H; y += 40) for (let x = ((y / 40) % 2) * 20; x < W; x += 40) { g.beginPath(); g.arc(x, y, 3 + 5 * (y / H), 0, 6.3); g.fill(); }
  // kerumunan siluet di tepi (ramai)
  const r = rng(11); for (let i = 0; i < 12; i++) { const side = i % 2 ? 1 : -1, x = 540 + side * (330 + r() * 260), y = 1180 + r() * 150, sc = 0.9 + r() * 0.6, col = [C.blue, C.hot, C.pink, C.yel][i % 4];
    rr(g, x - 62 * sc, y, 124 * sc, 420, 56 * sc); g.fillStyle = shade(col, -0.55); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); circle(g, x, y - 36 * sc, 46 * sc, shade(col, -0.45)); g.beginPath(); g.arc(x, y - 36 * sc, 46 * sc, 0, 6.3); g.stroke(); }
  // spotlight: kerucut dari atas + kolam cahaya di lantai
  const gr = g.createLinearGradient(0, 120, 0, GYc); gr.addColorStop(0, 'rgba(255,253,235,0.78)'); gr.addColorStop(1, 'rgba(255,253,235,0.22)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(450, 120); g.lineTo(630, 120); g.lineTo(1010, GYc + 20); g.lineTo(70, GYc + 20); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,253,235,0.55)'; g.beginPath(); g.ellipse(540, GYc + 14, 470, 58, 0, 0, 6.3); g.fill();
  circle(g, 540, 118, 46, C.paper); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(540, 118, 46, 0, 6.3); g.stroke(); rr(g, 500, 60, 80, 36, 10); g.fillStyle = INK; g.fill();
  // lantai + bangku prioritas
  g.fillStyle = alpha(INK, 0.35); g.fillRect(0, GYc + 40, W, H - GYc - 40);
  rr(g, 560, 1284, 600, 56, 16); g.fillStyle = C.hot; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.fillRect(610, 1340, 18, 160); g.fillRect(1040, 1340, 18, 160);
  label(g, 'PRIORITAS', 700, 1313, 34, C.paper, 0);
  // tokoh: Bu Wati (reach) dan cowok headphone (duduk, mata merem)
  const wx = 300, sp = POSES.sit, cx = 840;
  drawFigure(g, { x: wx, y: GYc, s: 3.0, facing: 1, outfit: { top: 'dress', color: '#d64a33', head: 'bun' }, pose: POSES.reach, expr: 'worried', rim: null, shadow: false });
  const bx = wx + 22 * 3.0, by = GYc - 112 * 3.0, br = 27 * 3.0; circle(g, bx, by, br, '#d64a33'); g.lineWidth = 9; g.lineCap = 'round'; g.strokeStyle = shade('#d64a33', -0.38); g.beginPath(); g.arc(bx, by, br, -1.05, 1.15); g.stroke();   // perut menyatu dengan gaun: warna sama, kontur hanya di sisi depan
  drawFigure(g, { x: cx, y: GYc - 56, s: 2.7, facing: 1, outfit: { top: 'tshirt', color: C.blue, head: 'none' }, pose: sp, expr: 'sleepy', rim: null, shadow: false });
  { const hx = cx + sp.head[0] * 2.7, hy = GYc - 56 + sp.head[1] * 2.7, s = 2.7; g.lineCap = 'round'; g.lineWidth = 9 * s; g.strokeStyle = INK; g.beginPath(); g.arc(hx, hy, 31 * s, Math.PI * 1.02, Math.PI * 1.98); g.stroke(); g.lineWidth = 5 * s; g.strokeStyle = C.hot; g.stroke();
    for (const dx of [-31, 31]) { rr(g, hx + dx * s - 8 * s, hy - 12 * s, 16 * s, 26 * s, 6 * s); g.fillStyle = INK; g.fill(); rr(g, hx + dx * s - 5.5 * s, hy - 9.5 * s, 11 * s, 21 * s, 4 * s); g.fillStyle = C.hot; g.fill(); } }
  // gelembung "Mas..." + efek komik
  g.save(); g.translate(580, 760); rr(g, -180 + 8, -62 + 10, 360, 124, 40); g.fillStyle = INK; g.fill(); rr(g, -180, -62, 360, 124, 40); g.fillStyle = C.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); poly(g, [[-120, 60], [-190, 130], [-70, 62]], C.paper); g.stroke(); g.restore();
  label(g, 'Mas...', 580, 764, 80, INK, 0);
  sticker(g, '♪', 780, 860, 90, C.pink, 0.2); sticker(g, 'Zzz', 1000, 880, 70, C.yel, -0.1);
  // masthead (kiri atas) + badge nomor (kanan atas)
  box(g, 330, 220, 540, 130, C.yel, -0.03); label(g, 'RAKA', 250, 205, 96, C.hot, -0.03); label(g, 'EDISI KOMIK', 400, 252, 34, INK, -0.03);
  g.save(); g.translate(930, 235); g.rotate(0.12); circle(g, 8, 10, 86, INK); circle(g, 0, 0, 86, C.hot); g.lineWidth = 9; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 86, 0, 6.3); g.stroke(); g.restore(); sticker(g, '#21', 930, 235, 76, C.paper, 0.12);
  // judul di pita tengah (aman crop 3:4)
  sticker(g, 'MINTA KURSI', 540, 410, 138, C.paper, -0.04);
  sticker(g, 'SOPAN?', 540, 570, 205, C.hot, 0.025);
  // pita bawah
  box(g, 540, 1600, 900, 110, C.paper, -0.015); label(g, 'BU WATI: CERITA TERPUTUS DI SINI...', 540, 1602, 46, C.hot, -0.015);
} });
