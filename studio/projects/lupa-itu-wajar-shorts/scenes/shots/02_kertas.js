// 02_kertas.js — adegan datar berwarna token: kalender, kertas ujian, wajah besar (ingatan memudar), kalender jeda, ujian lancar.
import { E, V, S, registerShot, blurLayer, veil, mood, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rel, hud, buku, stabilo, kamar, CAMD, TYPE } from './01_kamar.js';
import { NADIA, STABILO } from '../cast.js';

const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const bg = (g) => { const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H); };
function lembar(g, x, y, w, h, rot = 0) {   // lembar kertas (panel kartu)
  const ui = S().ui; g.save(); g.translate(x, y); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,.22)'; g.shadowBlur = 36; g.shadowOffsetY = 12; rr(g, -w / 2, -h / 2, w, h, 18); g.fillStyle = alpha(ui.blueprint, 0.16); g.fill(); g.shadowColor = 'transparent'; g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 4; g.stroke(); return { ...ui, text: ui.cream, sub: alpha(ui.cream, 0.7) };
}
function kalenderBaris(g, y, n, crossed, marks = {}, ujian = true) {   // baris kotak hari; crossed = jumlah hari dicoret; marks {i: label}
  const ui = S().ui, w = 96, gap = 14, N = n + (ujian ? 1 : 0), tot = N * w + (N - 1) * gap, x0 = E.W / 2 - tot / 2;
  for (let i = 0; i < N; i++) { const x = x0 + i * (w + gap), last = ujian && i === N - 1; rr(g, x, y, w, 120, 14); g.fillStyle = last ? alpha(STABILO, 0.15) : alpha(ui.blueprint, 0.14); g.fill(); g.strokeStyle = last ? STABILO : alpha(ui.blueprint, 0.55); g.lineWidth = last ? 6 : 3; g.stroke();
    text(g, last ? 'UJIAN' : String(i + 1), x + w / 2, y + 40, { size: last ? 22 : 38, color: last ? STABILO : ui.cream, font: FONTS.ui, weight: 900 });
    const c = clamp(crossed - i); if (c > 0 && !last) seg(g, [[x + 16, y + 70], [x + 16 + (w - 32) * c, y + 70 + 28 * c]], 8, ui.sub);
    if (marks[i]) { const a = ease.outBack(clamp(marks[i].k)); g.save(); g.translate(x + w / 2, y + 84); g.scale(a, a); rr(g, -34, -14, 68, 28, 10); g.fillStyle = STABILO; g.fill(); text(g, marks[i].s, 0, 2, { size: 18, color: '#fff', font: FONTS.ui, weight: 900 }); g.restore(); } }
}
// s04 7.0–9.5: seminggu kemudian, ujian tengah semester
registerShot('s04', { draw(g, t, info) {
  bg(g); const ui = S().ui, c = lerp(0, 7, ease.out(prog(t, 0.1, 1.6)));
  text(g, 'SEMINGGU KEMUDIAN', E.W / 2, 560, { size: 62, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.0, 0.4)) });
  kalenderBaris(g, 720, 7, c);
  const tu = rel('ujian', info, 1.5), a = pop(t, tu, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1000); g.scale(a, a); text(g, 'UJIAN TENGAH SEMESTER', 0, 0, { size: 58, color: ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); }
  hud(g, `HARI ${Math.max(1, Math.ceil(c))}`, 1);
} });
// s05 9.5–11.5: soal dari bab yang sama
registerShot('s05', { draw(g, t, info) {
  bg(g); const ui = lembar(g, E.W / 2, 800, 780, 920, -0.02);
  text(g, 'UJIAN TENGAH SEMESTER', 0, -370, { size: 40, color: ui.text, font: FONTS.ui, weight: 900, spacing: 2 });
  ['BAB 1', 'BAB 2', 'BAB 3'].forEach((s, i) => { const a = pop(t, 0.2 + i * 0.4, 0.3); if (a <= 0) return; g.save(); g.translate(0, -190 + i * 190); g.scale(a, a);
    text(g, `SOAL ${i + 1}`, -300, 0, { size: 40, color: ui.sub, font: FONTS.ui, weight: 900, align: 'left' }); rr(g, -120, -44, 360, 88, 18); g.fillStyle = alpha(STABILO, 0.16); g.fill(); g.strokeStyle = STABILO; g.lineWidth = 5; g.stroke(); text(g, s, 60, 4, { size: 54, color: STABILO, font: FONTS.ui, weight: 900 }); g.restore(); });
  g.restore();
} });
// s06 11.5–14.4: menatap kertas, kosong
registerShot('s06', { draw(g, t, info) {
  bg(g); const ui = lembar(g, E.W / 2, 800, 780, 920, 0.01), tk = rel('Kosong', info, 2.1);
  for (let i = 0; i < 7; i++) seg(g, [[-300, -280 + i * 90], [300, -280 + i * 90]], 4, alpha(ui.sub, 0.5));
  const a = pop(t, tk, 0.4); if (a > 0) { g.save(); g.scale(a, a); text(g, 'KOSONG', 0, 20, { size: 150, color: STABILO, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(STABILO, 0.4) }); g.restore(); }
  g.restore();
  const k = Math.sin(t * 3) * 8; seg(g, [[760 + k, 520], [820 + k, 360]], 14, ui.cream); seg(g, [[760 + k, 520], [752 + k, 548]], 6, ui.gold);   // pensil menggantung
} });
// s07 14.4–17.4: ingat pernah belajar, halaman memudar
registerShot('s07', { draw(g, t, info) {
  bg(g); const ui = S().ui, cx = E.W / 2 - 20, cy = 820, r = 260, tp = rel('pernah', info, 1.9);
  glow(g, cx, cy, 700, ui.blueprint, 0.1);
  bigFace(g, cx, cy, r, { outfit: NADIA, expr: 'confused', blink: (t % 3.2) > 3.08, look: [0.2, 0.4], rimColor: ui.cream, rimSide: 1, tilt: 0.03 });
  ['BAB 1', 'BAB 2', 'BAB 3'].forEach((s, i) => { const a = ease.out(prog(t, tp - 0.4 + i * 0.2, tp + 0.1 + i * 0.2)) * (1 - ease.inOut(prog(t, tp + 0.6 + i * 0.25, tp + 1.8 + i * 0.25)) * 0.95); if (a <= 0.01) return;
    g.save(); g.globalAlpha *= a; g.translate(cx - 300 + i * 300, 300 - (i % 2) * 40 - ease.inOut(prog(t, tp + 0.6, 3)) * 30); g.rotate((i - 1) * 0.1); buku(g, 0, 0, 130, 160, i, s); g.restore(); });
} });
// s08 17.4–22.6: otakku bocor, nggak pintar
registerShot('s08', { draw(g, t, info) {
  bg(g); const ui = S().ui, cx = E.W / 2 - 20, cy = 800, r = 260, tb = rel('bocor', info, 1.9), tn = rel('pintar', info, 4.6);
  bigFace(g, cx, cy, r, { outfit: NADIA, expr: t > tn - 1 ? 'sad' : 'worried', blink: (t % 3.2) > 3.08, look: [0.3, 0.5], rimColor: ui.cream, rimSide: 1, tilt: 0.04 });
  for (let i = 0; i < 6; i++) { const k = prog(t, tb + i * 0.18, tb + i * 0.18 + 0.9); if (k <= 0 || k >= 1) continue; circle(g, cx - 120 + i * 50, cy - r - 10 + k * 120, 12 * (1 - k * 0.4), ui.blueprint); }
  const a = pop(t, tb, 0.35); if (a > 0) { g.save(); g.translate(E.W / 2, 1160); g.scale(a, a); text(g, 'OTAKKU BOCOR?', 0, 0, { size: 90, color: ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); }
  const b = pop(t, tn, 0.35); if (b > 0) { g.save(); g.translate(E.W / 2, 1000); g.scale(b, b); text(g, 'NGGAK PINTAR?', 0, 0, { size: 78, color: ui.cream, font: FONTS.ui, weight: 900 }); g.restore(); }
} });
// s16 56.0–60.5: tiga sesi pendek di hari berbeda
registerShot('s16', { draw(g, t, info) {
  bg(g); const ui = S().ui, t3 = rel('tiga', info, 2.0);
  text(g, 'BAGI JADI 3 SESI', E.W / 2, 520, { size: 62, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  const marks = { 0: { s: 'SESI 1', k: (t - (t3 - 0.1)) / 0.4 }, 2: { s: 'SESI 2', k: (t - (t3 + 0.4)) / 0.4 }, 5: { s: 'SESI 3', k: (t - (t3 + 0.9)) / 0.4 } };
  kalenderBaris(g, 700, 7, 0, marks, true);
  const th = rel('berbeda', info, 3.4), a = pop(t, th, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 980); g.scale(a, a); text(g, 'HARI YANG BERBEDA', 0, 0, { size: 58, color: ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); }
  stabilo(g, 540 + Math.sin(t * 2) * 6, 1180, 1.8, -0.2);
} });
// s17 60.5–64.2: ujian berikutnya lancar
registerShot('s17', { draw(g, t, info) {
  bg(g); const ui = lembar(g, E.W / 2, 800, 780, 920, 0.01);
  text(g, 'UJIAN BERIKUTNYA', 0, -380, { size: 40, color: ui.text, font: FONTS.ui, weight: 900, spacing: 2 });
  for (let i = 0; i < 5; i++) { const k = prog(t, 0.2 + i * 0.35, 0.7 + i * 0.35); const y = -250 + i * 120; seg(g, [[-300, y], [-300 + 600 * k, y]], 8, ui.text); if (k >= 1) { seg(g, [[330, y - 4], [346, y + 12], [376, y - 22]], 9, ui.good || '#2f8a57'); } }
  g.restore(); hud(g, 'LANCAR', ease.out(prog(t, 1.4, 1.8)));
} });
