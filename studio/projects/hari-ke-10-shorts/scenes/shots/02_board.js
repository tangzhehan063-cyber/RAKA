// 02_board.js — the science: 21 is a myth, UCL 2009, median 66, range 18–254, one missed day doesn't matter.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const zoomIn = (g, t, dur, amt = 0.05) => { const z = 1 + amt * ease.inOut(t / dur); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };

// s05 — "21 hari" ... then stamped MYTH?
registerShot('s05', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur);
  const t21 = rel('21', info, 1.3), tStamp = rel('kebiasaan', info, 3.2);
  const p = ease.outBack(prog(t, t21 - 0.1, t21 + 0.35));
  const cy = E.H * V(0.45, 0.42);
  ring(g, E.W / 2, cy, V(260, 300) * (0.6 + 0.4 * p), 4, alpha(bp, 0.4 * p));
  g.save(); g.translate(E.W / 2, cy); g.scale(p, p);
  text(g, '21', 0, 0, { size: V(300, 360), color: ui.cream, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(bp, 0.6) });
  g.restore();
  text(g, 'HARI', E.W / 2, cy + V(220, 260), { size: V(56, 64), color: bp, font: FONTS.ui, weight: 900, spacing: 8, alpha: clamp(p) });
  text(g, 'KATANYA...', E.W / 2, cy - V(250, 300), { size: V(40, 48), color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  const s = ease.outBack(prog(t, tStamp, tStamp + 0.25));
  if (s > 0) { g.save(); g.translate(E.W / 2 + V(160, 120), cy + V(40, 60)); g.rotate(-0.22); g.scale(1.6 - 0.6 * s, 1.6 - 0.6 * s); g.globalAlpha *= clamp(s);
    rr(g, -V(220, 230), -V(70, 80), V(440, 460), V(140, 160), 18); g.strokeStyle = ui.accent; g.lineWidth = 10; g.stroke();
    text(g, 'MITOS?', 0, 4, { size: V(100, 110), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  g.restore();
} });

// s06 — UCL 2009: 96 people tracked
registerShot('s06', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.06);
  const cols = 8, rows = 12, x0 = V(560, 150), x1 = E.W - V(560, 150), y0 = E.H * V(0.3, 0.27), y1 = E.H * V(0.82, 0.66);
  const tMid = rel('tengahnya', info, 4.5);
  text(g, 'UNIVERSITY COLLEGE LONDON', E.W / 2, E.H * V(0.14, 0.16), { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.7)) });
  for (let i = 0; i < cols * rows; i++) {
    const c = i % cols, r = Math.floor(i / cols), k = ease.outBack(prog(t, 0.3 + i * 0.022, 0.6 + i * 0.022)); if (k <= 0) continue;
    const x = lerp(x0, x1, c / (cols - 1)), y = lerp(y0, y1, r / (rows - 1));
    const mid = (r === 5 || r === 6) && (c === 3 || c === 4), on = mid && t > tMid;
    { const col = on ? ui.gold : alpha(bp, 0.8), sc = k; circle(g, x, y - 18 * sc, 10 * sc, col); seg(g, [[x, y - 6 * sc], [x, y + 16 * sc]], 5 * sc, col); seg(g, [[x - 11 * sc, y + 2 * sc], [x, y - 4 * sc], [x + 11 * sc, y + 2 * sc]], 4 * sc, col); seg(g, [[x - 8 * sc, y + 32 * sc], [x, y + 16 * sc], [x + 8 * sc, y + 32 * sc]], 4 * sc, col); }
    if (on) glow(g, x, y, 60, ui.gold, 0.5);
  }
  const n = Math.min(96, Math.floor(clamp((t - 0.3) / (96 * 0.022)) * 96));
  UI.readout(g, { label: 'PESERTA', value: String(n), x: E.W / 2, y: E.H * V(0.9, 0.73), align: 'center', a: ease.out(prog(t, 0.3, 0.6)) });
  const t09 = rel('2009', info, 2.7);
  UI.badge(g, { str: '2009', x: E.W - V(90, 110), y: V(110, 250), a: ease.out(prog(t, t09 - 0.1, t09 + 0.3)) });
  g.restore();
} });

// s07 — 66 HARI (flash + impact)
registerShot('s07', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  const cy = E.H * V(0.45, 0.42), p = ease.outBack(prog(t, 0.0, 0.35));
  glow(g, E.W / 2, cy, V(500, 520), ui.gold, 0.35 * p);
  FX.rings(g, E.W / 2, cy, t, { count: 2, r0: 200, r1: 520, color: ui.gold, a: 0.35, speed: 0.9 });
  g.save(); g.translate(E.W / 2, cy); const s = p * (1 + 0.04 * t); g.scale(s, s);
  text(g, '66', 0, 0, { size: V(340, 420), color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) }); g.restore();
  text(g, 'HARI', E.W / 2, cy + V(240, 290), { size: V(60, 70), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: clamp(p) });
  // the old myth, crossed out
  const mx = E.W / 2, my = E.H * V(0.16, 0.2), a = ease.out(prog(t, 0.3, 0.6));
  text(g, '21', mx, my, { size: V(80, 100), color: alpha(bp, 0.5), font: FONTS.ui, weight: 900, alpha: a });
  seg(g, [[mx - 80, my + 30], [mx - 80 + 160 * ease.out(prog(t, 0.5, 0.8)), my - 30]], 9, ui.accent);
  text(g, 'MEDIAN', E.W / 2, cy - V(250, 300), { size: V(36, 42), color: alpha(bp, 0.85), font: FONTS.ui, weight: 900, spacing: 6, alpha: a });
} });

// s08 — range: 18 ... 66 ... 254 (estimate)
registerShot('s08', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.04);
  const x0 = V(220, 110), x1 = E.W - V(220, 110), y = E.H * V(0.5, 0.45), X = (v) => lerp(x0, x1, v / 254);
  const t18 = rel('18', info, 0.35), t254 = rel('254', info, 3.1);
  seg(g, [[x0, y], [x1, y]], 4, alpha(bp, 0.35));
  for (const v of [0, 50, 100, 150, 200, 250]) { seg(g, [[X(v), y + 20], [X(v), y + 40]], 3, alpha(bp, 0.5)); text(g, String(v), X(v), y + 75, { size: V(26, 30), color: alpha(bp, 0.7), font: FONTS.ui, weight: 800 }); }
  const lo = 18, hi = lerp(66, 254, ease.inOut(prog(t, t254 - 0.6, t254 + 0.3)));
  const aBar = ease.out(prog(t, t18 - 0.1, t18 + 0.4));
  rr(g, X(lo), y - 14, Math.max(4, (X(hi) - X(lo)) * aBar), 28, 14); g.fillStyle = alpha(ui.gold, 0.35); g.fill();
  const mark = (v, label, col, a, up = true, size = V(64, 72)) => { if (a <= 0) return; const x = X(v);
    circle(g, x, y, 14 * a, col); glow(g, x, y, 60, col, 0.6 * a);
    text(g, label, x, y + (up ? -V(90, 100) : V(150, 170)), { size, color: col, font: FONTS.ui, weight: 900, alpha: a, glow: 16, glowColor: alpha(col, 0.5) }); };
  mark(66, '66', ui.gold, 1, false, V(80, 90));
  mark(18, '18', ui.cream, ease.outBack(prog(t, t18 - 0.1, t18 + 0.3)));
  const a254 = ease.outBack(prog(t, t254 - 0.1, t254 + 0.3));
  mark(254, '254', ui.accent, a254);
  text(g, 'PERKIRAAN', X(254) - V(20, 30), y - V(170, 190), { size: V(28, 32), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 3, align: 'right', alpha: clamp(a254) });
  text(g, 'HARI SAMPAI OTOMATIS', E.W / 2, E.H * V(0.22, 0.26), { size: V(40, 46), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  g.restore();
} });

// s10 — the 66-day calendar: box 9 gets an X, everything else keeps going
registerShot('s10', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.05);
  const cols = 6, rows = 11, bw = V(110, 128), bh = V(70, 72), gap = 12;
  const W = cols * bw + (cols - 1) * gap, x0 = (E.W - W) / 2, y0 = E.H * V(0.16, 0.17);
  const tX = rel('satu', info, 0.7);
  for (let i = 0; i < 66; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = x0 + c * (bw + gap), y = y0 + r * (bh + gap);
    rr(g, x, y, bw, bh, 10); g.strokeStyle = alpha(bp, 0.35); g.lineWidth = 2; g.stroke();
    text(g, String(i + 1), x + 16, y + 20, { size: 18, color: alpha(bp, 0.5), font: FONTS.ui, weight: 800, align: 'left' });
    const cx = x + bw / 2, cy = y + bh / 2 + 4;
    if (i === 8) { const k = ease.outBack(prog(t, tX, tX + 0.3)); if (k > 0) { g.save(); g.translate(cx, cy); g.scale(k, k);
        seg(g, [[-24, -24], [24, 24]], 9, ui.accent); seg(g, [[24, -24], [-24, 24]], 9, ui.accent); g.restore(); glow(g, cx, cy, 70, ui.accent, 0.4 * clamp(k)); } continue; }
    const k = ease.out(prog(t, 0.05 + i * 0.045, 0.25 + i * 0.045)); if (k <= 0) continue;
    g.save(); g.globalAlpha *= k; seg(g, [[cx - 20, cy], [cx - 6, cy + 14], [cx + 22, cy - 16]], 7, ui.gold); g.restore();
  }
  const done = Math.max(0, Math.min(65, Math.floor((t - 0.05) / 0.045)));
  UI.readout(g, { label: 'TETAP JALAN', value: done + ' / 66', x: E.W / 2, y: E.H * V(0.92, 0.72), align: 'center', a: ease.out(prog(t, 0.2, 0.5)) });
  g.restore();
} });
