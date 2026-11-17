// 02_layar.js — adegan layar laptop: marketplace, tab, ulasan, catatan 3 syarat, perbandingan, loop.
import { E, V, S, registerShot, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { layar, kartu, produk, cart, rel, rnd, hud } from './01_kamar.js';
import * as FX from '/engine/fx2d.js';

const INK = '#2b2f3a', SUB = '#6b7190', ACC = '#d64a33';
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
function header(g, q = 'pelembap wajah', n = 0) {
  g.fillStyle = '#fffdf8'; g.fillRect(90, 222, 900, 130);
  rr(g, 120, 250, 640, 74, 37); g.fillStyle = '#efe9db'; g.fill(); text(g, q, 160, 288, { size: 34, color: INK, font: FONTS.ui, weight: 800, align: 'left' });
  rr(g, 786, 250, 74, 74, 37); g.fillStyle = '#e0574a'; g.fill(); text(g, '⌕', 823, 286, { size: 40, color: '#fff', font: FONTS.ui, weight: 900 });
  cart(g, 930, 292, 0.42, n);
}
function grid(g, scroll = 0, cols = 3, fadeA = 1) {
  g.save(); g.beginPath(); g.rect(90, 360, 900, 860); g.clip();
  for (let r = -1; r < 6; r++) for (let c = 0; c < cols; c++) { const x = 270 + c * 270, y = 560 + r * 372 - (scroll % 372), seed = Math.floor((scroll - (scroll % 372)) / 372 * cols) + r * cols + c + 40; kartu(g, x, y, 244, 340, ((seed % 997) + 997) % 997); }
  g.restore();
}
// s02: budget
registerShot('s02', { draw(g, t, info) {
  const tb = rel('bawah', info, 1.9);
  layar(g, (g) => { header(g, 'pelembap wajah', 0); grid(g, 0);
    const a = pop(t, tb, 0.4); if (a > 0) { g.save(); g.translate(540, 760); g.scale(a, a); rr(g, -340, -80, 680, 160, 40); g.fillStyle = '#fffdf8'; g.fill(); g.strokeStyle = ACC; g.lineWidth = 8; g.stroke(); text(g, 'HARGA ≤ Rp150.000', 0, 4, { size: 58, color: ACC, font: FONTS.ui, weight: 900, spacing: 1 }); g.restore(); }
  }, { cart: 0 });
} });
// s03: jam 8 malam, buka marketplace, ketik pencarian
registerShot('s03', { draw(g, t, info) {
  layar(g, (g) => { g.fillStyle = '#fffdf8'; g.fillRect(90, 222, 900, 996); const L = 'pelembap wajah', n = Math.floor(clamp((t - 0.7) / 1.0) * L.length);
    text(g, 'MARKETPLACE', 540, 520, { size: 70, color: ACC, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.1, 0.5)) });
    rr(g, 160, 640, 760, 100, 50); g.fillStyle = '#efe9db'; g.fill(); text(g, L.slice(0, n) + ((t * 2 % 1) < 0.6 ? '|' : ''), 210, 692, { size: 44, color: INK, font: FONTS.ui, weight: 800, align: 'left' });
  }, { cart: 0 });
  hud(g, '20:00', ease.out(prog(t, 0.1, 0.5)));
} });
// s04: 2.000+ hasil, dinding produk kembar memenuhi layar
registerShot('s04', { draw(g, t, info) {
  const th = rel('Hasilnya', info, 0.1), th2 = rel('2000', info, 0.7), n = Math.round(2000 * ease.out(prog(t, th2 - 0.1, th2 + 0.9)));
  layar(g, (g) => { header(g, 'pelembap wajah', 0); grid(g, t * 260, 3); }, { cart: 0 });
  const a = pop(t, th2, 0.4); if (a > 0) { g.save(); g.translate(540, 1000); g.scale(a, a); rr(g, -330, -92, 660, 184, 40); g.fillStyle = 'rgba(255,253,248,.94)'; g.fill(); text(g, `${n.toLocaleString('id-ID')}+`, 0, -10, { size: 104, color: ACC, font: FONTS.ui, weight: 900 }); text(g, 'HASIL', 0, 62, { size: 40, color: SUB, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); }
} });
// s05: tab bertambah sampai 23
registerShot('s05', { draw(g, t, info) {
  const t3 = rel('23', info, 3.4), n = Math.min(23, 1 + Math.floor(prog(t, 0.2, t3 + 0.3) * 22));
  layar(g, (g) => {
    g.fillStyle = '#d9d2c2'; g.fillRect(90, 222, 900, 90); const w = Math.max(24, 880 / n);
    for (let i = 0; i < n; i++) { rr(g, 100 + i * w, 238, w - 4, 74, 10); g.fillStyle = i === n - 1 ? '#fffdf8' : '#ece5d6'; g.fill(); circle(g, 100 + i * w + w / 2, 275, Math.min(14, w / 3), PAL[i % PAL.length]); }
    g.fillStyle = '#fffdf8'; g.fillRect(90, 312, 900, 906);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) kartu(g, 270 + c * 270, 560 + r * 372, 244, 340, 3 + n * 7 + r * 3 + c);
  }, { cart: 0 });
  const a = pop(t, 0.5, 0.3); g.save(); g.translate(540, 1110); g.scale(a || 0.01, a || 0.01); rr(g, -260, -80, 520, 160, 40); g.fillStyle = 'rgba(255,253,248,.95)'; g.fill();
  text(g, String(n), -110, 0, { size: 120, color: ACC, font: FONTS.ui, weight: 900 }); text(g, 'TAB', 90, 8, { size: 70, color: INK, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore();
} });
const PAL = ['#f4c6c6', '#f2dca6', '#cfe4d2', '#c9d8ee', '#e2cdea', '#f6e0c8', '#d6e6e2', '#f0d0dc'];
// s06: ulasan bertentangan
registerShot('s06', { draw(g, t, info) {
  const ta = rel('glowing', info, 1.8), tb = rel('jerawatan', info, 4.4);
  layar(g, (g) => {
    g.fillStyle = '#fffdf8'; g.fillRect(90, 222, 900, 996); produk(g, 540, 520, 1.9, 0);
    const card = (y, ok, str, a) => { if (a <= 0) return; g.save(); g.translate(540, y); g.scale(a, a); rr(g, -380, -110, 760, 220, 30); g.fillStyle = ok ? '#e5f2e4' : '#f8e0dc'; g.fill(); g.strokeStyle = ok ? '#2f8a57' : '#d64a33'; g.lineWidth = 6; g.stroke();
      text(g, ok ? '★★★★★' : '★☆☆☆☆', 0, -50, { size: 52, color: '#e0a23a', font: FONTS.ui, weight: 900 }); text(g, str, 0, 28, { size: 56, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); };
    card(870, true, '"Bikin glowing banget!"', pop(t, ta, 0.4)); card(1100, false, '"Bikin jerawatan."', pop(t, tb, 0.4));
  }, { cart: 0 });
} });
// s15 60.0–63.2: tiga syarat di kertas, dua toko
registerShot('s15', { draw(g, t, info) {
  const T1 = rel('tiga', info, 0.4), T2 = rel('dua', info, 1.9);
  g.fillStyle = '#ece5d6'; g.fillRect(0, 0, E.W, E.H); glow(g, 540, 700, 700, '#fff0cc', 0.4);
  g.save(); g.translate(540, 760); g.rotate(-0.03); g.shadowColor = 'rgba(0,0,0,.18)'; g.shadowBlur = 40; g.shadowOffsetY = 14; rr(g, -380, -420, 760, 840, 20); g.fillStyle = '#fffdf8'; g.fill(); g.shadowColor = 'transparent';
  text(g, 'SYARAT', 0, -340, { size: 60, color: ACC, font: FONTS.ui, weight: 900, spacing: 6 });
  ['JENIS KULIT', 'KANDUNGAN', 'HARGA'].forEach((s, i) => { const at = T1 + 0.2 + i * 0.4, a = ease.out(prog(t, at, at + 0.3)), y = -190 + i * 170;
    rr(g, -300, y - 36, 72, 72, 12); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); if (a > 0) { seg(g, [[-290, y], [-268, y + 22], [-232, y - 24]].map(([a2, b]) => [a2, b]), 10, '#2f8a57'); }
    text(g, s, -190, y + 4, { size: 54, color: INK, font: FONTS.ui, weight: 900, align: 'left', alpha: a }); });
  g.restore();
  const b = pop(t, T2, 0.4); if (b > 0) { g.save(); g.translate(540, 1240); g.scale(b, b); text(g, '2 TOKO', 0, 0, { size: 90, color: ACC, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
} });
// s16 63.2–67.0: bandingkan tiga produk, checkout 15 menit
registerShot('s16', { draw(g, t, info) {
  const t3 = rel('tiga', info, 0.5), tc = rel('checkout', info, 2.3), n = t > tc + 0.5 ? 1 : 0;
  layar(g, (g) => { g.fillStyle = '#fffdf8'; g.fillRect(90, 222, 900, 996); text(g, 'BANDINGKAN', 540, 300, { size: 54, color: SUB, font: FONTS.ui, weight: 900, spacing: 6 });
    [0, 1, 2].forEach((i) => { const a = pop(t, t3 + i * 0.25, 0.3); if (a <= 0) return; const sel = i === 1 && t > tc - 0.2; g.save(); g.translate(240 + i * 300, 700); g.scale(a * (sel ? 1.08 : 1), a * (sel ? 1.08 : 1)); kartu(g, 0, 0, 260, 380, [3, 6, 9][i] + 40, { line: sel ? '#2f8a57' : undefined, lw: sel ? 10 : 3 }); g.restore(); });
    const c = pop(t, tc, 0.4); if (c > 0) { g.save(); g.translate(540, 1080); g.scale(c, c); rr(g, -300, -70, 600, 140, 36); g.fillStyle = ACC; g.fill(); text(g, 'CHECKOUT', 0, 4, { size: 64, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  }, { cart: n });
  hud(g, '15 MENIT', ease.out(prog(t, 0.2, 0.6)));
} });
// s19 73.2–76.28: loop, hasil 2.000+ lagi
registerShot('s19', { draw(g, t, info) {
  const th = rel('Hasilnya', info, 1.4), n = Math.round(2000 * ease.out(prog(t, th, th + 0.8)));
  layar(g, (g) => { header(g, 'pelembap wajah', 0); grid(g, t * 260, 3); }, { cart: 0 });
  const a = pop(t, th, 0.4); if (a > 0) { g.save(); g.translate(540, 1000); g.scale(a, a); rr(g, -330, -92, 660, 184, 40); g.fillStyle = 'rgba(255,253,248,.94)'; g.fill(); text(g, `${n.toLocaleString('id-ID')}+`, 0, -10, { size: 104, color: ACC, font: FONTS.ui, weight: 900 }); text(g, 'HASIL', 0, 62, { size: 40, color: SUB, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); }
} });
