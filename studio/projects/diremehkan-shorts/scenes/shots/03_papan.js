// 03_papan.js — blueprint riset (token warna): s10 Nurmohamed 2020, s11 performa naik, s12 membuktikan salah, s13/s14 syarat kredibilitas, s15 pedang bermata dua, s16 bensin habis, s17 hening, s19 stempel.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, ring, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { HINA } from '../cast.js';
import { rel, pop, hening } from '../_util.js';
const GOOD = '#4fb3a5';
const head = (g, t, big, small, tk = 0.1) => { const ui = S().ui, bp = UI.bpStroke(); text(g, big, E.W / 2, 420, { size: big.length > 8 ? 118 : 150, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)), glow: 24, glowColor: alpha(ui.gold, 0.4) }); if (small) text(g, small, E.W / 2, 560, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tk, tk + 0.4)) }); };
const bar = (g, t, x, y, w, v, col, label, at) => { const ui = S().ui, k = ease.out(prog(t, at, at + 0.9)); text(g, label, x, y - 60, { size: 36, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x, y - 36, w, 56, 12); g.strokeStyle = alpha(UI.bpStroke(), 0.8); g.lineWidth = 4; g.stroke(); rr(g, x + 6, y - 30, Math.max(0, (w - 12) * v * k), 44, 8); g.fillStyle = col; g.fill(); };

// s10 24.5–29.2: Nurmohamed 2020
registerShot('s10', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), tn = rel('Nurmohamed', info, 1.2);
  head(g, t, '2020', null);
  text(g, 'SAMIR NURMOHAMED', E.W / 2, 620, { size: 62, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tn - 0.1, tn + 0.3)) });
  text(g, 'Academy of Management Journal', E.W / 2, 690, { size: 32, color: alpha(bp, 0.95), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tn + 0.3, tn + 0.7)) });
  const a = pop(t, 2.4, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1000); g.scale(a, a); text(g, 'UNDERDOG EFFECT', 0, 0, { size: 76, color: HINA, font: FONTS.ui, weight: 900, spacing: 3, glow: 16, glowColor: alpha(HINA, 0.5) }); g.restore(); }
} });
// s11 29.2–32.0: diremehkan → performa naik
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'DIREMEHKAN', 'performa naik');
  bar(g, t, 160, 900, 760, 0.45, alpha(UI.bpStroke(), 0.9), 'DIHARAPKAN TINGGI', 0.4);
  bar(g, t, 160, 1080, 760, 0.8, GOOD, 'DIREMEHKAN', 0.9);
} });
// s12 32.0–36.2: penyebabnya satu: membuktikan salah
registerShot('s12', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, tm = rel('membuktikan', info, 2.0);
  text(g, 'PENYEBABNYA', cx, 400, { size: 70, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.1, 0.5)) });
  [['DIREMEHKAN', 300, 700], ['MEMBUKTIKAN SALAH', cx, 880], ['PERFORMA NAIK', 780, 1060]].forEach(([s, x, y], i) => { const k = pop(t, 0.5 + i * 0.9 + (i === 1 ? tm - 1.4 : 0) * 0, 0.4); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); text(g, s, 0, 0, { size: i === 1 ? 64 : 48, color: i === 1 ? S().ui.gold : ui.cream, font: FONTS.ui, weight: 900, spacing: 2, glow: i === 1 ? 18 : 0, glowColor: alpha(ui.gold, 0.4) }); g.restore(); });
  [[300, 740, cx - 150, 830], [cx, 920, 780, 1010]].forEach(([x1, y1, x2, y2], i) => { const k = ease.out(prog(t, 0.9 + i * 0.9, 1.5 + i * 0.9)); if (k > 0) seg(g, [[x1, y1], [lerp(x1, x2, k), lerp(y1, y2, k)]], 6, alpha(UI.bpStroke(), 0.9)); });
} });
// s13 36.2–41.7: syarat — peremeh asal bicara → efek jalan
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, tc = rel('kredibel', info, 3.5);
  text(g, 'SYARATNYA', cx, 380, { size: 100, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.6, 1.1)), glow: 20, glowColor: alpha(ui.gold, 0.4) });
  const a = pop(t, 1.9, 0.4); if (a > 0) { g.save(); g.translate(cx, 640); g.scale(a, a); rr(g, -330, -62, 660, 124, 28); g.fillStyle = alpha(HINA, 0.9); g.fill(); text(g, 'PEREMEH TIDAK KREDIBEL', 0, 6, { size: 46, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
  bar(g, t, 160, 1000, 760, 0.85, GOOD, 'EFEK UNDERDOG', tc - 0.2);
  const b = ease.out(prog(t, tc, tc + 0.5)); if (b > 0) text(g, 'JALAN', cx, 1160, { size: 74, color: GOOD, font: FONTS.ui, weight: 900, spacing: 6, alpha: b });
} });
// s14 41.7–46.6: peremeh kredibel → performa turun
registerShot('s14', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2;
  text(g, 'KALAU PEREMEHNYA', cx, 380, { size: 52, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  const a = pop(t, 0.5, 0.4); if (a > 0) { g.save(); g.translate(cx, 560); g.scale(a, a); rr(g, -330, -62, 660, 124, 28); g.fillStyle = alpha('#3a6ea5', 0.95); g.fill(); text(g, 'ORANG YANG PAHAM', 0, 6, { size: 50, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
  const k = ease.inOut(prog(t, 1.4, 3.6)), v = lerp(0.8, 0.28, k);
  text(g, 'PERFORMA', 160, 900, { size: 38, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  rr(g, 160, 940, 760, 56, 12); g.strokeStyle = alpha(UI.bpStroke(), 0.8); g.lineWidth = 4; g.stroke(); rr(g, 166, 946, 748 * v, 44, 8); g.fillStyle = k > 0.3 ? HINA : GOOD; g.fill();
  const b = ease.out(prog(t, 3.5, 4.0)); if (b > 0) text(g, 'TURUN', cx, 1160, { size: 90, color: HINA, font: FONTS.ui, weight: 900, spacing: 8, alpha: b, glow: 20, glowColor: alpha(HINA, 0.5) });
} });
// s15 46.6–50.2: pedang bermata dua
registerShot('s15', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, k = ease.out(prog(t, 0.1, 0.9));
  text(g, 'STUDI LAIN', cx, 390, { size: 76, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.1, 0.5)) });
  g.save(); g.translate(cx, 840); g.rotate(-0.12 * (1 - k)); g.scale(k, k);   // pedang bermata dua
  seg(g, [[0, -300], [0, 220]], 36, alpha(ui.cream, 0.95)); g.fillStyle = alpha(ui.cream, 0.95); g.beginPath(); g.moveTo(0, -380); g.lineTo(-22, -290); g.lineTo(22, -290); g.closePath(); g.fill();
  seg(g, [[-120, 240], [120, 240]], 24, ui.gold); seg(g, [[0, 250], [0, 340]], 26, shade(ui.gold, -0.2)); g.restore();
  const a = pop(t, 1.3, 0.4); if (a > 0) { g.save(); g.translate(cx, 1230); g.scale(a, a); text(g, 'PEDANG BERMATA DUA', 0, 0, { size: 62, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 16, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
} });
// s16 50.2–53.7: bahan bakar cepat habis
registerShot('s16', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, k = ease.inOut(prog(t, 0.3, 3.0)), v = lerp(0.95, 0.04, k);
  text(g, 'BAHAN BAKAR', cx, 400, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)), glow: 20, glowColor: alpha(ui.gold, 0.4) });
  rr(g, cx - 130, 520, 260, 700, 40); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke();
  const h = 660 * v; rr(g, cx - 116, 1206 - h, 232, h, 30); g.fillStyle = v < 0.2 ? HINA : GOOD; g.fill();
  const a = pop(t, 2.0, 0.4); if (a > 0) { g.save(); g.translate(cx, 1300); g.scale(a, a); text(g, 'CUMA BIKIN ORANG DIAM?', 0, 0, { size: 46, color: HINA, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
} });
// s17 53.7–55.7: HENING + teks diketik (freeze-frame)
registerShot('s17', { draw(g, t, info) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H);
  const gr = g.createRadialGradient(E.W / 2, E.H * 0.42, 40, E.W / 2, E.H * 0.42, 900); gr.addColorStop(0, alpha(ui.blueprint, 0.22)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  FX.drops(g, 0.7, { count: 60, color: '#d8e4ff', rMax: 10, drift: 3 }); FX.rings(g, E.W / 2, E.H * 0.42, t, { count: 3, r0: 140, r1: 520, speed: 0.3, color: ui.cream, a: 0.35 });
  hening(g, t, 'tujuannya apa?');
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(100,130,255,.3)'; g.fillRect(0, 0, E.W, E.H); g.restore();
} });
// s19 61.5–62.8: stempel ASAL BICARA
registerShot('s19', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, k = ease.outBack(prog(t, 0.1, 0.5));
  g.save(); g.translate(cx, 880); g.rotate(-0.12); g.scale(2.4 - 1.4 * k, 2.4 - 1.4 * k); g.globalAlpha *= clamp(k);
  rr(g, -360, -110, 720, 220, 24); g.strokeStyle = HINA; g.lineWidth = 14; g.stroke(); text(g, 'ASAL BICARA', 0, 8, { size: 100, color: HINA, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore();
  if (t > 0.5) FX.rings(g, cx, 880, t - 0.5, { count: 2, r0: 200, r1: 560, speed: 0.8, color: HINA, a: 0.3 });
} });
