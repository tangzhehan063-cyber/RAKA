// 07_papan2.js — blueprint dan grafik (token warna): s10 Baumeister 2001, s11 bidang, s13 cepat terbentuk/sulit dihapus, s14 freeze-frame hening, s18 data setara.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, ring, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { KRITIK, PUJI } from '../cast.js';
import { rel } from './06_kamar2.js';

const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
// s10 22.8–29.1: 2001 Baumeister dkk meninjau banyak penelitian
registerShot('s10', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), tb = rel('Baumeister', info, 2.6), tp = rel('penelitian', info, 4.6);
  text(g, '2001', E.W / 2, 420, { size: 170, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, 0.1, 0.5)), glow: 24, glowColor: alpha(ui.gold, 0.4) });
  text(g, 'BAUMEISTER DKK.', E.W / 2, 600, { size: 72, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tb - 0.1, tb + 0.3)) });
  text(g, 'Review of General Psychology', E.W / 2, 670, { size: 32, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tb + 0.2, tb + 0.6)) });
  for (let i = 0; i < 24; i++) { const k = pop(t, tp - 0.8 + i * 0.05, 0.25); if (k <= 0) continue; const c = i % 8, r = Math.floor(i / 8), x = 200 + c * 100, y = 860 + r * 100; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -34, -42, 68, 84, 8); g.strokeStyle = bp; g.lineWidth = 4; g.stroke(); for (let j = 0; j < 3; j++) seg(g, [[-20, -18 + j * 16], [20, -18 + j * 16]], 3, alpha(bp, 0.7)); g.restore(); }
  const a = pop(t, tp, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1180); g.scale(a, a); text(g, 'BANYAK PENELITIAN', 0, 0, { size: 56, color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
} });
// s11 29.1–31.3: konsisten di banyak bidang (callout)
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), cx = E.W / 2, cy = 760;
  UI.lineFigure(g, { x: cx, y: cy + 150, s: 1.5, pose: POSES.stand, color: alpha(ui.cream, 0.9) });
  [['HUBUNGAN', -1, -1], ['BELAJAR', 1, -1], ['EMOSI', -1, 1], ['UMPAN BALIK', 1, 1]].forEach(([s, sx, sy], i) => { const at = 0.1 + i * 0.4, p = ease.out(prog(t, at, at + 0.5)); if (p <= 0) return; const ex = cx + sx * 240, ey = cy + sy * 230; seg(g, [[cx, cy], [lerp(cx, ex, p), lerp(cy, ey, p)]], 3, alpha(bp, 0.7)); const a = pop(t, at + 0.25, 0.3); if (a > 0) { g.save(); g.translate(ex + sx * 110, ey); g.scale(a, a); rr(g, -120, -34, 240, 68, 34); g.strokeStyle = ui.gold; g.lineWidth = 4; g.stroke(); text(g, s, 0, 2, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); } });
  text(g, 'POLA YANG SAMA', cx, 1180, { size: 54, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 1.2, 1.7)) });
} });
// s13 35.2–38.9: kesan buruk cepat terbentuk, sulit dihapus (dua kurva)
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), tc = rel('cepat', info, 1.6), ts = rel('sulit', info, 2.6);
  const panel = (y, title, col, f, k) => {
    text(g, title, 150, y - 120, { size: 44, color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    seg(g, [[150, y + 160], [150, y - 80], [150, y + 160], [930, y + 160]], 5, alpha(bp, 0.85));
    const pts = []; for (let i = 0; i <= 70 * k; i++) { const u = i / 70; pts.push([170 + u * 740, y + 160 - f(u) * 220]); }
    if (pts.length > 1) { seg(g, pts, 11, col); const e = pts[pts.length - 1]; circle(g, e[0], e[1], 14, col); glow(g, e[0], e[1], 80, col, 0.35); }
  };
  panel(560, 'KESAN BURUK: TERBENTUK CEPAT', KRITIK, (u) => 1 - Math.exp(-6 * u), ease.inOut(prog(t, 0.2, tc + 0.9)));
  panel(1000, 'DAN SULIT DIHAPUS', ui.gold, (u) => 0.92 - 0.12 * ease.inOut(u), ease.inOut(prog(t, ts - 0.4, ts + 0.9)));
  const ee = prog(t, ts + 0.6, ts + 1.2); if (ee > 0) { g.save(); g.translate(560 + 200 * ee, 1000 + 160 * 0 - 60); rr(g, -60, -22, 120, 44, 10); g.fillStyle = alpha(ui.cream, 0.85); g.fill(); text(g, 'HAPUS', 0, 2, { size: 24, color: ui.bpBg, font: FONTS.ui, weight: 900 }); g.restore(); }
} });
// s14 38.9–40.9: FREEZE-FRAME hening: partikel menggantung, tint dingin, teks diketik
registerShot('s14', { draw(g, t, info) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H);
  const gr = g.createRadialGradient(E.W / 2, E.H * 0.42, 40, E.W / 2, E.H * 0.42, 900); gr.addColorStop(0, alpha(ui.blueprint, 0.22)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  FX.drops(g, 0.7, { count: 70, color: '#d8e4ff', rMax: 11, drift: 3 });
  FX.rings(g, E.W / 2, E.H * 0.42, t, { count: 3, r0: 140, r1: 520, speed: 0.3, color: ui.cream, a: 0.35 });
  const L = 'otak memang begitu.', n = Math.floor(clamp((t - 0.15) / 1.4) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, E.H * 0.42, { size: 90, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.45) });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(100,130,255,.3)'; g.fillRect(0, 0, E.W, E.H); g.restore();
} });
// s18 47.0–50.3: kritik dan pujian sama-sama jadi data (kertas, 10 baris setara)
registerShot('s18', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), td = rel('data', info, 2.4);
  text(g, 'DATA', E.W / 2, 330, { size: 120, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 10, alpha: ease.out(prog(t, td - 0.4, td + 0.2)), glow: 24, glowColor: alpha(ui.gold, 0.4) });
  for (let i = 0; i < 10; i++) { const k = ease.out(prog(t, 0.1 + i * 0.16, 0.5 + i * 0.16)), y = 470 + i * 70, col = i === 9 ? KRITIK : PUJI; text(g, String(i + 1), 150, y, { size: 34, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900 }); rr(g, 200, y - 20, 700, 40, 20); g.fillStyle = alpha(col, 0.12); g.fill(); rr(g, 200, y - 20, Math.max(40, 700 * 0.8 * k), 40, 20); g.fillStyle = col; g.fill(); if (k > 0.98) glow(g, 200 + 560, y, 50, col, 0.3); }
  const a = pop(t, td, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1250); g.scale(a, a); text(g, 'SAMA BESAR', 0, 0, { size: 58, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
} });
