// 05_papan.js — segmen blueprint (riset): s17–s23, s25–s28. Warna dari token UI.
import { E, V, S, registerShot, ease, prog, clamp, lerp, alpha, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rel, pop, ketik, hening } from '../_util.js';

const fig = (g, x, y, s, o = {}) => UI.lineFigure(g, { x, y, s, pose: o.pose || POSES.stand, color: o.color || S().ui.blueprint, facing: o.facing ?? 1 });
const lab = (g, str, x, y, a = 1, size = 46, col = null) => { if (a > 0) text(g, str, x, y, { size, color: col || S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: a }); };
const bg = (g) => UI.blueprint(g);
// dorongan kamera pelan (tidak ada shot yang diam): zoom 1 -> 1.05 di sekitar pusat
const reg = (id, fn) => registerShot(id, { draw(g, t, info) { const z = 1 + 0.05 * clamp(t / info.dur); g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); fn(g, t, info); g.restore(); } });

// s17 44.2–48.4: 1997, dua psikolog
reg('s17', (g, t, info) => {
  const ui = S().ui; bg(g);
  const y = pop(t, 0.3, 0.4); g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(y, y); text(g, '1997', 0, 0, { size: 230, color: ui.gold, font: FONTS.ui, weight: 900, glow: 28, glowColor: alpha(ui.gold, 0.5) }); g.restore();
  fig(g, E.W * 0.32, E.H * 0.54, 1.7, { pose: POSES.explain }); fig(g, E.W * 0.68, E.H * 0.54, 1.7, { pose: POSES.talk, facing: -1 });
  lab(g, 'GOLLWITZER', E.W * 0.32, E.H * 0.6, ease.out(prog(t, rel('gollwitzer', info, 3.0), rel('gollwitzer', info, 3.0) + 0.4)), 44);
  lab(g, 'BRANDSTÄTTER', E.W * 0.7, E.H * 0.6, ease.out(prog(t, rel('brandst', info, 3.9), rel('brandst', info, 3.9) + 0.4)), 44);
  lab(g, 'PSIKOLOG', E.W / 2, E.H * 0.34, ease.out(prog(t, 1.0, 1.5)), 38, alpha(ui.cream, 0.6));
});
// s18 48.4–52.0: mahasiswa
reg('s18', (g, t, info) => {
  const ui = S().ui; bg(g);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c, a = ease.out(prog(t, 0.1 + i * 0.07, 0.4 + i * 0.07)); g.save(); g.globalAlpha *= a; fig(g, E.W * 0.17 + c * E.W * 0.22, E.H * 0.32 + r * 270 + 30 * (1 - a), 0.95, { pose: i % 3 ? POSES.relaxed : POSES.think }); g.restore(); }
  const a = pop(t, rel('mahasiswa', info, 1.5), 0.3); if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.6); g.scale(a, a); text(g, 'MAHASISWA', 0, 0, { size: 110, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 5, glow: 22, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
});
// s19 52.0–57.5: laporan malam Natal, 2 hari
reg('s19', (g, t, info) => {
  const ui = S().ui; bg(g);
  const a = ease.outBack(prog(t, 0.1, 0.6)); g.save(); g.translate(E.W / 2, E.H * 0.34); g.scale(a, a);
  rr(g, -330, -300, 660, 560, 24); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
  text(g, 'LAPORAN', 0, -200, { size: 90, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, 'MALAM NATAL', 0, -90, { size: 76, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 18, glowColor: alpha(ui.gold, 0.4) });
  for (let i = 0; i < 4; i++) seg(g, [[-250, 0 + i * 56], [250 - (i % 2) * 90, 0 + i * 56]], 5, alpha(ui.blueprint, 0.5)); g.restore();
  const t0 = rel('dua', info, 3.8) - 1.2, y = E.H * 0.62;
  lab(g, '24 DES', E.W * 0.22, y - 60, ease.out(prog(t, 0.8, 1.2)), 52); lab(g, '26 DES', E.W * 0.78, y - 60, ease.out(prog(t, t0 + 0.6, t0 + 1.0)), 52);
  UI.dimension(g, t, { x1: E.W * 0.22, y1: y, x2: E.W * 0.78, y2: y, str: '2 HARI', start: t0 + 0.4 });
});
// s20 57.5–59.7: semua punya niat yang sama
reg('s20', (g, t, info) => {
  const ui = S().ui; bg(g); const at = rel('niat', info, 0.9);
  for (let i = 0; i < 10; i++) { const x = E.W * 0.12 + (i % 5) * E.W * 0.19, y = E.H * 0.42 + Math.floor(i / 5) * 420; fig(g, x, y, 1.0, { pose: POSES.think });
    const a = pop(t, at + (i % 5) * 0.05, 0.25); if (a > 0) { g.save(); g.translate(x + 20, y - 330); g.scale(a, a); UI.bubble(g, 0, 0, { w: 150, h: 70, color: alpha(ui.cream, 0.92), dots: true, str: 'NIAT' }); g.restore(); } }
});
// s21 59.7–65.4: separuhnya + kalimat kapan & di mana
reg('s21', (g, t, info) => {
  const ui = S().ui; bg(g); const sp = ease.inOut(prog(t, 0.5, 1.2)), cx = E.W / 2;
  seg(g, [[cx, E.H * 0.18], [cx, E.H * 0.18 + 1000 * sp]], 4, alpha(ui.cream, 0.4));
  for (let i = 0; i < 10; i++) { const left = i < 5, x = (left ? E.W * 0.1 : E.W * 0.58) + (i % 5) * (left ? 0.0 : 0) + (left ? (i % 2) * 120 : (i % 2) * 120), y = E.H * 0.24 + Math.floor((i % 5)) * 150;
    fig(g, x + 20, y + 110, 0.62, { pose: POSES.think }); }
  lab(g, 'NIAT SAJA', E.W * 0.26, E.H * 0.2, ease.out(prog(t, 1.1, 1.5)), 52);
  lab(g, 'NIAT + 1 KALIMAT', E.W * 0.74, E.H * 0.2, ease.out(prog(t, 1.1, 1.5)), 52, ui.gold);
  const at = rel('kapan', info, 2.8), a = pop(t, at - 0.1, 0.3); if (a > 0) { g.save(); g.translate(E.W * 0.7, E.H * 0.6); g.scale(a, a); rr(g, -300, -80, 600, 190, 22); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 3; g.stroke();
    text(g, 'KAPAN?', 0, -20, { size: 76, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4 }); text(g, 'DI MANA?', 0, 70, { size: 76, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
});
// bar vertikal 32% / 71%
function bars(g, t, info, show71) {
  const ui = S().ui; bg(g); const base = E.H * 0.62, H = 700, x1 = E.W * 0.3, x2 = E.W * 0.7, w = 250;
  seg(g, [[E.W * 0.1, base], [E.W * 0.9, base]], 4, alpha(ui.cream, 0.5));
  const t32 = rel('32', info, 1.4), p1 = ease.out(prog(t, t32 - 0.3, t32 + 0.9));
  rr(g, x1 - w / 2, base - H * 0.32 * p1, w, Math.max(2, H * 0.32 * p1), 12); g.fillStyle = alpha(ui.blueprint, 0.9); g.fill();
  lab(g, 'NIAT SAJA', x1, base + 64, 1, 42);
  if (p1 > 0.05) text(g, Math.round(32 * p1) + '%', x1, base - H * 0.32 * p1 - 60, { size: 130, color: ui.cream, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.cream, 0.3) });
  if (show71) {
    const t71 = rel('71', info, 1.4), p2 = ease.out(prog(t, t71 - 0.3, t71 + 1.0));
    rr(g, x2 - w / 2, base - H * 0.71 * p2, w, Math.max(2, H * 0.71 * p2), 12); g.fillStyle = ui.gold; g.fill(); glow(g, x2, base - H * 0.71 * p2, 360, ui.gold, 0.3 * p2);
    lab(g, 'NIAT + RENCANA', x2, base + 64, 1, 42, ui.gold);
    if (p2 > 0.05) text(g, Math.round(71 * p2) + '%', x2, base - H * 0.71 * p2 - 60, { size: 150, color: ui.gold, font: FONTS.ui, weight: 900, glow: 22, glowColor: alpha(ui.gold, 0.5) });
  }
  text(g, 'MENGUMPULKAN LAPORAN', E.W / 2, E.H * 0.14, { size: 46, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 4 });
}
reg('s22', (g, t, info) => { bars(g, t, info, false); });
reg('s23', (g, t, info) => { bars(g, t, info, true); });
// s25 77.6–83.8: 94 penelitian digabung
reg('s25', (g, t, info) => {
  const ui = S().ui; bg(g);
  const at = rel('94', info, 1.6);
  UI.dataCard(g, t, { title: '2006 · META-ANALISIS', subtitle: 'PENELITIAN DIGABUNG', from: 0, to: 94, decimals: 0, unit: '', start: at - 0.6, dur: 2.0, labels: [[1, '94']], shape: 1.4, total: info.dur });
});
// s26 83.8–89.3: hitung ulang, efek lebih kecil (ilustrasi tanpa skala)
reg('s26', (g, t, info) => {
  const ui = S().ui; bg(g); const at = rel('tinjauan', info, 0.4);
  text(g, 'SEBERAPA BESAR EFEKNYA?', E.W / 2, E.H * 0.2, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  [['DUGAAN AWAL', 0.92, ui.blueprint, 0.1], ['HITUNG ULANG', 0.5, ui.gold, 0.8]].forEach(([lb, v, col, d], i) => {
    const y = E.H * (0.32 + i * 0.17), p = ease.out(prog(t, at + d, at + d + 0.9)), w = 800;
    text(g, lb, 140, y - 44, { size: 46, color: i ? ui.gold : ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    rr(g, 140, y, w, 64, 32); g.fillStyle = alpha(ui.blueprint, 0.14); g.fill();
    rr(g, 140, y, Math.max(8, w * v * p), 64, 32); g.fillStyle = col; g.fill(); if (i) glow(g, 140 + w * v * p, y + 32, 200, ui.gold, 0.3 * p);
  });
  const a = ease.out(prog(t, rel('lebih', info, 3.5), rel('lebih', info, 3.5) + 0.4)); lab(g, 'LEBIH KECIL', E.W / 2, E.H * 0.64, a, 90, ui.accent);
  lab(g, 'ilustrasi, bukan skala', E.W / 2, E.H * 0.26, 1, 32, alpha(ui.cream, 0.5));
});
// s27 89.3–91.6: efeknya sedang
reg('s27', (g, t, info) => {
  const ui = S().ui; bg(g); const at = rel('sedang', info, 1.6), segs = ['KECIL', 'SEDANG', 'BESAR'];
  segs.forEach((s, i) => { const on = i === 1, a = ease.out(prog(t, 0.1 + i * 0.12, 0.4 + i * 0.12)), x = E.W / 2, y = E.H * 0.32 + i * 250; g.save(); g.globalAlpha *= a;
    rr(g, x - 380, y - 80, 760, 160, 28); g.fillStyle = on && t > at - 0.2 ? alpha(ui.gold, 0.9) : alpha(ui.blueprint, 0.18); g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 3; g.stroke();
    text(g, s, x, y + 6, { size: 96, color: on && t > at - 0.2 ? '#14213a' : ui.cream, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); });
  text(g, 'EFEK', E.W / 2, E.H * 0.2, { size: 60, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 8 });
});
// s28 91.6–95.0: hening, teks diketik di layar
reg('s28', (g, t, info) => {
  const ui = S().ui; g.fillStyle = '#000'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.4, 700, ui.gold, 0.06);
  hening(g, t, 'Niat bilang mau.', E.H * 0.36);
  if (t > 1.5) { const n = Math.floor(clamp((t - 1.5) / 1.3) * 21); text(g, 'Rencana bilang kapan.'.slice(0, n) + ((t * 2 % 1) < 0.6 ? '|' : ''), E.W / 2, E.H * 0.46, { size: 86, color: ui.cream, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.cream, 0.3) }); }
  FX.dust(g, t * 0.3, { count: 40, color: '#9fb8ff', a: 0.35 });
});
