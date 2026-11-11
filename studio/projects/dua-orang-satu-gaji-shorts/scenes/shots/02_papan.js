// 02_papan.js — penjelasan (narator, style ember): Luttmer 2005, grafik, CUKUP -> DIBANDING SIAPA, dua pilihan.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, text, FONTS, veil } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { HERO } from '../cast.js';
import { phone } from './01_cerita.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];   // berakhir y=1270, di atas pita caption
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const WARM = '#ffb36b', ICE = '#8fe8ff';

function card(g, draw) {
  g.fillStyle = '#0d0504'; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD;
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g); draw(g, S().ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(S().ui.blueprint, 0.4); g.lineWidth = 4; g.stroke();
}

// s12 — Luttmer 2005, hampir 9.000 orang
registerShot('s12', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    text(g, 'RISET', E.W / 2, 290, { size: 40, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 10 });
    const a = pop(t, rel('Erzo', info, 1.0));
    g.save(); g.translate(E.W / 2, 420); g.scale(a, a);
    text(g, 'LUTTMER (2005)', 0, 0, { size: 84, color: ui.cream, font: FONTS.ui, weight: 900 });
    text(g, 'Quarterly Journal of Economics', 0, 70, { size: 34, color: alpha(ui.cream, 0.7), font: FONTS.serif, italic: true }); g.restore();
    // crowd of dots that counts up to 9.000
    const tc = rel('hampir', info, 2.9), p = ease.out(prog(t, tc, tc + 1.6));
    const n = Math.floor(220 * p);
    for (let i = 0; i < n; i++) { const c = i % 20, r = Math.floor(i / 20); circle(g, 170 + c * 39, 600 + r * 36, 11, alpha(i % 9 === 0 ? ui.gold : bp, 0.85)); }
    if (p > 0) text(g, '±' + Math.round(9000 * p).toLocaleString('id-ID') + ' ORANG', E.W / 2, 1060 + 0, { size: 92, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) });
    text(g, 'AS, 1987–1994', E.W / 2, 1170, { size: 34, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 4, alpha: p });
  });
  badge(g, 'HARVARD');
} });

// s13 — grafik: tetangga naik, bahagia turun, gaji sendiri tetap
registerShot('s13', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    const x0 = 160, x1 = E.W - 160, yTop = 380, yBot = 1000;
    seg(g, [[x0, yTop - 40], [x0, yBot], [x1, yBot]], 4, alpha(bp, 0.6));
    const L = (from, to, at, col, lab) => { const p = ease.inOut(prog(t, at, at + 1.4)); if (p <= 0) return;
      const yA = lerp(yBot, yTop, from), yB = lerp(yBot, yTop, to), xe = lerp(x0, x1, p), ye = lerp(yA, yB, p);
      seg(g, [[x0, yA], [xe, ye]], 12, col); circle(g, xe, ye, 16, col);
      text(g, lab, xe - 10, ye - 46, { size: 38, color: col, font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(p * 3 - 2) }); };
    L(0.2, 0.9, rel('tetangga', info, 0.2), ui.gold, 'GAJI TETANGGA ↑');
    L(0.75, 0.25, rel('bahagia', info, 2.4), '#ff6f61', 'BAHAGIAMU ↓');
    L(0.5, 0.5, rel('gajinya', info, 4.1), alpha(ui.cream, 0.85), 'GAJIMU: TETAP');
    text(g, 'WAKTU →', x1, yBot + 50, { size: 30, color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, align: 'right' });
    text(g, 'berkaitan, bukan bukti sebab-akibat', E.W / 2, 1180, { size: 30, color: alpha(ui.cream, 0.55), font: FONTS.serif, italic: true });
  });
  badge(g, 'LUTTMER 2005');
} });

// s14 — CUKUP dicoret -> DIBANDING SIAPA?
registerShot('s14', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    text(g, 'OTAK KITA MENGUKUR...', E.W / 2, 320, { size: 46, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 4 });
    const a = pop(t, rel('cukup', info, 1.0)), x = rel('Otak', info, 2.3) > 1.5 ? rel('mengukur', info, 2.4) : 2.4;
    const tx = rel('dibanding', info, 3.0), strike = ease.out(prog(t, tx - 0.4, tx));
    g.save(); g.translate(E.W / 2, 600); g.scale(a, a);
    text(g, '"CUKUP"', 0, 0, { size: 130, color: alpha(ui.cream, 1 - 0.5 * strike), font: FONTS.ui, weight: 900 });
    if (strike > 0) seg(g, [[-280, 0], [-280 + 560 * strike, -10]], 16, '#ff6f61');
    g.restore();
    const b = pop(t, tx);
    if (b > 0) { g.save(); g.translate(E.W / 2, 900); g.scale(b, b); text(g, '"DIBANDING', 0, -60, { size: 110, color: ui.gold, font: FONTS.ui, weight: 900, glow: 22, glowColor: alpha(ui.gold, 0.5) }); text(g, 'SIAPA?"', 0, 70, { size: 110, color: ui.gold, font: FONTS.ui, weight: 900, glow: 22, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
    void x;
  });
} });

// s15 — gajimu yang kurang... atau layarmu yang terlalu ramai?
function wallet(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -110, -70, 220, 140, 20); g.fillStyle = '#7a4a2a'; g.fill(); rr(g, 20, -30, 110, 60, 16); g.fillStyle = '#5e3820'; g.fill(); circle(g, 70, 0, 12, '#e8c070'); g.restore(); }
registerShot('s15', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    const a = pop(t, rel('gajimu', info, 2.2)), b = pop(t, rel('layarmu', info, 4.5));
    text(g, 'DADA SESAK?', E.W / 2, 300, { size: 58, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
    if (a > 0) { g.save(); g.translate(E.W * 0.28, 640); g.scale(a, a); wallet(g, 0, 0, 1.2); text(g, 'GAJI KURANG?', 0, 190, { size: 44, color: WARM, font: FONTS.ui, weight: 900 }); g.restore(); }
    if (b > 0) { g.save(); g.translate(E.W * 0.72, 620); g.scale(b, b); phone(g, 0, 0, 4, 1, ICE); text(g, 'LAYAR RAMAI?', 0, 210, { size: 44, color: ICE, font: FONTS.ui, weight: 900 }); g.restore();
      text(g, 'ATAU', E.W / 2, 650, { size: 40, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900 }); }
    const k = ease.out(prog(t, rel('ramai', info, 5.8), rel('ramai', info, 5.8) + 0.5));
    if (k > 0) { rr(g, E.W * 0.72 - 210, 380, 420, 560, 30); g.strokeStyle = alpha(ui.gold, k); g.lineWidth = 8; g.stroke(); }
  });
} });
