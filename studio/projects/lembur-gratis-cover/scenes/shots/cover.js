// cover #22 "Lembur Gratis": SAMPUL KOMIK malam (spotlight, bubble pesan atasan, empat meja berlaptop menyala, masthead, badge). Teks utama di pita tengah (aman crop 3:4).
import { E, registerShot, alpha, shade, rr, poly, circle, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
const INK = '#14121a';
const C = { a: '#2b1b6b', b: '#6a3df0', c: '#ff3d9a', d: '#b6ff3d', hot: '#ffd400', blue: '#46d2ff', night: '#120a3a', paper: '#fff3d6' };
const sticker = (g, str, x, y, size, col, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore(); };
const box = (g, x, y, w, h, fill, rot = 0, r = 22) => { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2 + 9, -h / 2 + 11, w, h, r); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.restore(); };
const label = (g, str, x, y, size, col, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, 0, 3); g.restore(); };
const bub = (g, x, y, w, lines, fill, tcol, size, tail) => { const lh = size * 1.25, h = lines.length * lh + 44; g.save(); g.translate(x, y); rr(g, -w / 2 + 8, -h / 2 + 10, w, h, 34); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, 34); g.fillStyle = fill; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  poly(g, [[tail[0] - 30, h / 2 - 4], [tail[0] - 70, h / 2 + 70], [tail[0] + 20, h / 2 - 4]], fill); g.stroke(); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; lines.forEach((l, i) => g.fillText(l, 0, -h / 2 + 22 + lh * (i + 0.5) + 2)); g.restore(); };
const meja = (g, x, y, sc) => { g.save(); g.translate(x, y); g.scale(sc, sc); rr(g, -66, -296, 132, 150, 66); g.fillStyle = shade(C.night, -0.3); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); circle(g, 0, -322, 44, shade(C.night, -0.2)); g.beginPath(); g.arc(0, -322, 44, 0, 6.3); g.stroke();
  rr(g, -112, -150, 224, 26, 8); g.fillStyle = shade(C.paper, -0.3); g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(-92, -124, 14, 124); g.fillRect(78, -124, 14, 124);
  g.fillStyle = alpha(C.blue, 0.3); g.beginPath(); g.ellipse(0, -190, 150, 90, 0, 0, 6.3); g.fill(); rr(g, -74, -250, 148, 104, 12); g.fillStyle = C.blue; g.fill(); g.stroke(); g.fillStyle = alpha('#fff', 0.75); for (let i = 0; i < 4; i++) g.fillRect(-56, -232 + i * 20, 70 - (i % 2) * 22, 8); g.restore(); };
registerShot('c01', { draw(g) {
  const W = E.W, H = E.H, GYc = 1500;
  g.fillStyle = shade(C.a, -0.35); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 24; i++) { const a0 = i * Math.PI / 12, a1 = a0 + Math.PI / 24; poly(g, [[540, 1000], [540 + Math.cos(a0) * 2200, 1000 + Math.sin(a0) * 2200], [540 + Math.cos(a1) * 2200, 1000 + Math.sin(a1) * 2200]], alpha(C.b, 0.22)); }
  g.fillStyle = alpha(C.c, 0.2); for (let y = 0; y < H; y += 40) for (let x = ((y / 40) % 2) * 20; x < W; x += 40) { g.beginPath(); g.arc(x, y, 3 + 5 * (y / H), 0, 6.3); g.fill(); }
  // spotlight dari atas jatuh ke Raka
  const gr = g.createLinearGradient(0, 120, 0, GYc); gr.addColorStop(0, 'rgba(255,243,214,0.7)'); gr.addColorStop(1, 'rgba(255,243,214,0.2)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(300, 120); g.lineTo(480, 120); g.lineTo(760, GYc + 20); g.lineTo(-60, GYc + 20); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,243,214,0.5)'; g.beginPath(); g.ellipse(350, GYc + 14, 420, 56, 0, 0, 6.3); g.fill();
  circle(g, 390, 118, 46, C.paper); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(390, 118, 46, 0, 6.3); g.stroke(); rr(g, 350, 60, 80, 36, 10); g.fillStyle = INK; g.fill();
  g.fillStyle = alpha(INK, 0.4); g.fillRect(0, GYc + 40, W, H - GYc - 40);
  // empat meja berlaptop menyala di kanan
  [[560, 0.62], [720, 0.62], [880, 0.62], [1040, 0.62]].forEach(([x, s]) => meja(g, x, GYc + 20, s));
  // Raka: tas, ponsel di tangan
  const rx = 300, rs = 3.2; rr(g, rx - 44 * rs + 6, GYc - 178 * rs + 8, 46 * rs, 84 * rs, 18); g.fillStyle = INK; g.fill(); rr(g, rx - 44 * rs, GYc - 178 * rs, 46 * rs, 84 * rs, 18); g.fillStyle = C.blue; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  drawFigure(g, { x: rx, y: GYc, s: rs, facing: 1, outfit: { top: 'hoodie', color: '#d64a33', head: 'none' }, pose: POSES.phone, expr: 'worried', rim: null, shadow: false });
  // bubble pesan atasan
  bub(g, 730, 830, 600, ['Malam ini stay dulu ya,', 'demi tim'], C.paper, INK, 48, [-150, 0]);
  bub(g, 730, 1070, 580, ['Uang lembur nggak ada,', 'tapi dicatat kok'], C.c, INK, 46, [-120, 0]);
  // masthead + badge
  box(g, 330, 220, 540, 130, C.hot, -0.03); label(g, 'RAKA', 250, 205, 96, C.a, -0.03); label(g, 'EDISI KOMIK', 400, 252, 34, INK, -0.03);
  g.save(); g.translate(930, 235); g.rotate(0.12); circle(g, 8, 10, 86, INK); circle(g, 0, 0, 86, C.c); g.lineWidth = 9; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 86, 0, 6.3); g.stroke(); g.restore(); sticker(g, '#22', 930, 235, 76, C.paper, 0.12);
  // judul di pita tengah
  sticker(g, 'LEMBUR', 540, 400, 190, C.paper, -0.04); sticker(g, 'GRATIS?', 540, 590, 205, C.hot, 0.025);
  box(g, 540, 1600, 900, 110, C.paper, -0.015); label(g, 'KAMU PULANG ATAU STAY?', 540, 1602, 52, C.c, -0.015);
} });
