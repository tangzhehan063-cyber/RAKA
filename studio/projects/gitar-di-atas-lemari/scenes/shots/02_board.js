// 02_board.js — the science: myth "biggest regret = mistakes", Cornell 2018 (Davidai & Gilovich), 76% = the self they never chased.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const zoomIn = (g, t, dur, amt = 0.05) => { const z = 1 + amt * ease.inOut(t / dur); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };
const B = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 150), y: V(110, 280), a });
// tiny person icon (blueprint)
const person = (g, x, y, sc, col) => { circle(g, x, y - 18 * sc, 10 * sc, col); seg(g, [[x, y - 6 * sc], [x, y + 16 * sc]], 5 * sc, col); seg(g, [[x - 11 * sc, y + 2 * sc], [x, y - 4 * sc], [x + 11 * sc, y + 2 * sc]], 4 * sc, col); seg(g, [[x - 8 * sc, y + 32 * sc], [x, y + 16 * sc], [x + 8 * sc, y + 32 * sc]], 4 * sc, col); };

// s05 — "Kita sering dengar: penyesalan terbesar adalah kesalahan yang kita buat." -> stamp MITOS?
registerShot('s05', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur);
  const tP = rel('penyesalan', info, 1.2), tK = rel('kesalahan', info, 2.8), tS = rel('buat', info, 3.8);
  const cy = E.H * 0.43;
  text(g, 'KATANYA...', E.W / 2, cy - V(300, 330), { size: V(40, 44), color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  const a1 = ease.out(prog(t, tP - 0.1, tP + 0.4));
  text(g, 'PENYESALAN', E.W / 2, cy - V(170, 190), { size: V(70, 76), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: a1 });
  text(g, 'TERBESAR  =', E.W / 2, cy - V(90, 100), { size: V(52, 56), color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3, alpha: a1 });
  const p = ease.outBack(prog(t, tK - 0.1, tK + 0.35));
  g.save(); g.translate(E.W / 2, cy + V(60, 70)); g.scale(p, p);
  text(g, 'KESALAHAN', 0, 0, { size: V(118, 120), color: ui.cream, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(bp, 0.6) }); g.restore();
  // little "X" mistake icons
  for (let i = 0; i < 5; i++) { const k = ease.outBack(prog(t, tK + 0.2 + i * 0.08, tK + 0.5 + i * 0.08)); if (k <= 0) continue; const x = E.W / 2 + (i - 2) * V(110, 120), y = cy + V(200, 220);
    g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-16, -16], [16, 16]], 6, alpha(bp, 0.6)); seg(g, [[16, -16], [-16, 16]], 6, alpha(bp, 0.6)); g.restore(); }
  const s = ease.outBack(prog(t, tS, tS + 0.25));
  if (s > 0) { g.save(); g.translate(E.W / 2 + V(150, 90), cy + V(80, 110)); g.rotate(-0.2); g.scale(1.6 - 0.6 * s, 1.6 - 0.6 * s); g.globalAlpha *= clamp(s);
    rr(g, -V(220, 200), -V(70, 74), V(440, 400), V(140, 148), 18); g.strokeStyle = ui.accent; g.lineWidth = 10; g.stroke();
    text(g, 'MITOS?', 0, 4, { size: V(100, 100), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  g.restore();
} });

// s06 — Cornell University 2018: hundreds of people, each asked for their single biggest regret
registerShot('s06', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.06);
  const cols = 10, rows = 10, x0 = V(560, 150), x1 = E.W - V(560, 170), y0 = E.H * V(0.33, 0.33), y1 = E.H * V(0.82, 0.64);
  const tC = rel('Cornell', info, 0.9), tQ = rel('menanyakan', info, 3.8), tR = rel('ratusan', info, 6.0);
  const aT = ease.out(prog(t, tC - 0.1, tC + 0.4));
  text(g, 'CORNELL UNIVERSITY', E.W / 2, E.H * V(0.14, 0.17), { size: V(46, 52), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: aT });
  text(g, 'Davidai & Gilovich · jurnal Emotion', E.W / 2, E.H * V(0.2, 0.205), { size: V(28, 30), color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: aT });
  for (let i = 0; i < cols * rows; i++) {
    const c = i % cols, r = Math.floor(i / cols), k = ease.outBack(prog(t, tQ - 0.6 + i * 0.02, tQ - 0.3 + i * 0.02)); if (k <= 0) continue;
    person(g, lerp(x0, x1, c / (cols - 1)), lerp(y0, y1, r / (rows - 1)), k * V(1, 0.95), alpha(bp, 0.8));
  }
  // a question bubble over the crowd
  const qa = ease.outBack(prog(t, tQ, tQ + 0.4));
  if (qa > 0) { g.save(); g.translate(E.W / 2, E.H * V(0.28, 0.285)); g.scale(qa, qa);
    rr(g, -V(330, 330), -46, V(660, 660), 92, 46); g.fillStyle = alpha(ui.bpBg, 0.95); g.fill(); g.strokeStyle = ui.cream; g.lineWidth = 3; g.stroke();
    text(g, '"Penyesalan terbesarmu?"', 0, 2, { size: V(40, 40), color: ui.cream, font: FONTS.serif, weight: 900, italic: true }); g.restore(); }
  UI.readout(g, { label: 'PESERTA', value: 'RATUSAN', x: E.W / 2, y: E.H * V(0.9, 0.7), align: 'center', a: ease.out(prog(t, tR - 0.1, tR + 0.3)) });
  const t18 = rel('2018', info, 2.4);
  B(g, '2018', ease.out(prog(t, t18 - 0.1, t18 + 0.3)));
  g.restore();
} });

// s07 — 76% (flash + impact): ring chart fills to 76
registerShot('s07', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  const cy = E.H * 0.42, p = ease.outBack(prog(t, 0.0, 0.35)), R = V(300, 330);
  glow(g, E.W / 2, cy, V(520, 540), ui.gold, 0.35 * p);
  ring(g, E.W / 2, cy, R, 26, alpha(bp, 0.18));
  const fill = 0.76 * ease.out(prog(t, 0.05, 0.9));
  g.strokeStyle = ui.gold; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.arc(E.W / 2, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fill); g.stroke();
  FX.rings(g, E.W / 2, cy, t, { count: 2, r0: R, r1: R * 1.6, color: ui.gold, a: 0.3, speed: 0.9 });
  g.save(); g.translate(E.W / 2, cy); const s = p * (1 + 0.03 * t); g.scale(s, s);
  text(g, '76%', 0, 0, { size: V(230, 250), color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) }); g.restore();
  const tM = rel('mirip', info, 1.6);
  text(g, 'JAWABANNYA MIRIP', E.W / 2, cy + R + V(110, 120), { size: V(48, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tM - 0.4, tM)) });
} });

// s08 — "Bukan salah langkah. Tapi diri yang tidak pernah mereka kejar." 24 vs 76
registerShot('s08', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.04);
  const tL = rel('salah', info, 0.3), tD = rel('diri', info, 1.7);
  const base = E.H * V(0.78, 0.55), H = V(520, 500), bw = V(230, 250);
  const bar = (x, v, a, col, lab1, lab2, big) => { if (a <= 0) return; const h = H * v / 0.76 * ease.out(a);
    rr(g, x - bw / 2, base - h, bw, h, 18); g.fillStyle = alpha(col, big ? 0.9 : 0.55); g.fill();
    if (big) glow(g, x, base - h / 2, 300, col, 0.3 * a);
    text(g, Math.round(v * 100 * clamp(a)) + '%', x, base - h - V(60, 66), { size: V(84, 90), color: col, font: FONTS.ui, weight: 900, alpha: clamp(a), glow: big ? 22 : 0, glowColor: alpha(col, 0.6) });
    text(g, lab1, x, base + V(56, 58), { size: V(36, 38), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(a) });
    text(g, lab2, x, base + V(100, 102), { size: V(28, 30), color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: clamp(a) }); };
  const xl = E.W / 2 - V(200, 180), xr = E.W / 2 + V(200, 160);
  seg(g, [[V(300, 120), base], [E.W - V(300, 160), base]], 4, alpha(bp, 0.4));
  bar(xl, 0.24, prog(t, tL - 0.1, tL + 0.6), ui.accent, 'KEWAJIBAN', 'yang dilanggar', false);
  bar(xr, 0.76, prog(t, tD - 0.1, tD + 0.7), ui.gold, 'DIRI IDEAL', 'yang tak dikejar', true);
  text(g, 'PENYESALAN TERBESAR', E.W / 2, E.H * V(0.15, 0.2), { size: V(44, 46), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  g.restore();
} });

// s09 — "Kenapa awet? Karena kewajiban yang gagal biasanya cepat kita tebus." two tracks: duty closes fast, dream stays open
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.04);
  const tW = rel('kewajiban', info, 1.0), tT = rel('tebus', info, 3.4);
  text(g, 'KENAPA AWET?', E.W / 2, E.H * V(0.2, 0.22), { size: V(72, 74), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.05, 0.4)) });
  const x0 = V(380, 130), x1 = E.W - V(380, 170);
  const track = (y, label, col, end, aIn, closed) => { if (aIn <= 0) return;
    text(g, label, x0, y - V(56, 60), { size: V(38, 40), color: col, font: FONTS.ui, weight: 900, spacing: 2, align: 'left', alpha: aIn });
    seg(g, [[x0, y], [x1, y]], 4, alpha(bp, 0.3 * aIn));
    const xe = lerp(x0, x1, end); seg(g, [[x0, y], [xe, y]], 10, alpha(col, aIn)); circle(g, x0, y, 12, col);
    if (closed > 0) { const k = ease.outBack(closed); g.save(); g.translate(xe, y); g.scale(k, k); circle(g, 0, 0, 34, col); seg(g, [[-14, 0], [-4, 12], [16, -12]], 7, ui.bpBg); g.restore(); }
    else { for (let i = 0; i < 3; i++) circle(g, xe + 30 + i * 26, y, 6, alpha(col, 0.5 + 0.5 * Math.sin(t * 4 + i))); } };
  const aW = ease.out(prog(t, tW - 0.2, tW + 0.3));
  track(E.H * 0.42, 'KEWAJIBAN', ui.accent, lerp(0, 0.45, ease.out(prog(t, tW, tT))), aW, prog(t, tT - 0.1, tT + 0.25));
  track(E.H * 0.58, 'MIMPI', ui.gold, lerp(0, 0.62, ease.out(prog(t, tW + 0.4, info.dur))), ease.out(prog(t, tW + 0.2, tW + 0.6)), 0);
  const aDone = ease.out(prog(t, tT, tT + 0.3));
  text(g, 'cepat ditebus', lerp(x0, x1, 0.45) + 50, E.H * 0.42 + V(70, 72), { size: V(30, 32), color: alpha(ui.cream, 0.85), font: FONTS.ui, weight: 800, align: 'left', alpha: aDone });
  text(g, 'dibiarkan menggantung', x0, E.H * 0.58 + V(70, 72), { size: V(30, 32), color: alpha(ui.cream, 0.85), font: FONTS.ui, weight: 800, align: 'left', alpha: aDone });
  g.restore();
} });
