// 02_papan.js — the science on the blueprint board: myth, Penn State (29 people), 91%, "zero came true", the one step.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const zoomIn = (g, t, dur, amt = 0.05) => { const z = 1 + amt * ease.inOut(t / dur); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };
const fig = (g, x, y, sc, col) => { circle(g, x, y - 18 * sc, 10 * sc, col); seg(g, [[x, y - 6 * sc], [x, y + 16 * sc]], 5 * sc, col); seg(g, [[x - 11 * sc, y + 2 * sc], [x, y - 4 * sc], [x + 11 * sc, y + 2 * sc]], 4 * sc, col); seg(g, [[x - 8 * sc, y + 32 * sc], [x, y + 16 * sc], [x + 8 * sc, y + 32 * sc]], 4 * sc, col); };
const paper = (g, x, y, s, col, a = 1) => { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); rr(g, -22, -28, 44, 56, 4); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); for (let i = 0; i < 4; i++) seg(g, [[-12, -14 + i * 10], [12 - (i % 2) * 8, -14 + i * 10]], 2.5, col); g.restore(); };

// s05 — the myth: "KHAWATIR = BAHAYA NYATA" ... stamped MITOS?
registerShot('s05', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur);
  const tk = rel('khawatir', info, 1.6), tn = rel('nyata', info, 3.6);
  const cy = E.H * 0.44;
  const a1 = ease.outBack(prog(t, tk - 0.1, tk + 0.3)), a2 = ease.outBack(prog(t, tn - 0.6, tn - 0.2));
  text(g, 'KATANYA...', E.W / 2, cy - V(300, 330), { size: V(40, 46), color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  g.save(); g.translate(E.W / 2, cy - V(110, 120)); g.scale(a1, a1); text(g, 'KHAWATIR', 0, 0, { size: V(130, 140), color: ui.cream, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(bp, 0.6) }); g.restore();
  text(g, '=', E.W / 2, cy + V(20, 20), { size: V(110, 120), color: bp, font: FONTS.ui, weight: 900, alpha: clamp(a2) });
  g.save(); g.translate(E.W / 2, cy + V(160, 170)); g.scale(a2, a2); text(g, 'BAHAYA NYATA', 0, 0, { size: V(104, 112), color: ui.accent, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.accent, 0.5) }); g.restore();
  const tS = tn + 0.15, s = ease.outBack(prog(t, tS, tS + 0.25));
  if (s > 0) { g.save(); g.translate(E.W / 2 + V(120, 110), cy + V(330, 340)); g.rotate(-0.2); g.scale(1.6 - 0.6 * s, 1.6 - 0.6 * s); g.globalAlpha *= clamp(s);
    rr(g, -230, -78, 460, 156, 18); g.strokeStyle = ui.accent; g.lineWidth = 10; g.stroke();
    text(g, 'MITOS?', 0, 4, { size: 110, color: ui.accent, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  g.restore();
} });

// s06 — Penn State: 29 people write down every worry
registerShot('s06', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.06);
  const tps = rel('Penn', info, 0.9), t29 = rel('29', info, 2.1), tcat = rel('mencatat', info, 4.5);
  text(g, 'PENN STATE', E.W / 2, E.H * 0.15, { size: V(64, 70), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, tps - 0.1, tps + 0.3)) });
  text(g, 'BEHAVIOR THERAPY · 2020', E.W / 2, E.H * 0.15 + V(64, 70), { size: V(30, 34), color: alpha(bp, 0.85), font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tps + 0.2, tps + 0.6)) });
  const cols = 5, rows = 6, x0 = V(260, 230), x1 = E.W - V(260, 230), y0 = E.H * 0.26, y1 = E.H * 0.57;
  for (let i = 0; i < 29; i++) {
    const c = i % cols, r = Math.floor(i / cols), k = ease.outBack(prog(t, t29 - 0.2 + i * 0.03, t29 + 0.1 + i * 0.03)); if (k <= 0) continue;
    const x = lerp(x0, x1, c / (cols - 1)), y = lerp(y0, y1, r / (rows - 1));
    fig(g, x, y, k * 1.2, alpha(bp, 0.9));
    const pk = prog(t, tcat + i * 0.04, tcat + 0.4 + i * 0.04);
    if (pk > 0) paper(g, x + 46, y - 6 - 30 * ease.out(pk), 0.75, ui.cream, ease.out(pk));
  }
  const n = Math.min(29, Math.max(0, Math.floor((t - t29 + 0.2) / 0.03)));
  UI.readout(g, { label: 'PESERTA', value: String(n), x: E.W / 2, y: E.H * 0.64, align: 'center', a: ease.out(prog(t, t29 - 0.2, t29 + 0.1)) });
  text(g, 'GANGGUAN KECEMASAN UMUM', E.W / 2, E.H * 0.64 + V(76, 80), { size: V(28, 30), color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, t29 + 0.6, t29 + 1.0)) });
  g.restore();
} });

// s07 — checking each worry: did it actually happen? (ticks tumble in, riser into the reveal)
registerShot('s07', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.07);
  text(g, 'TERJADI?', E.W / 2, E.H * 0.17, { size: V(80, 90), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.4)) });
  const rows = 8, x0 = V(200, 170), w = E.W - 2 * x0, y0 = E.H * 0.27, rh = V(118, 120);
  const happened = [false, false, false, true, false, false, false, false];
  for (let i = 0; i < rows; i++) {
    const k = ease.out(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)); if (k <= 0) continue;
    const y = y0 + i * rh;
    g.save(); g.globalAlpha *= k; g.translate((1 - k) * 60, 0);
    rr(g, x0, y, w, rh - 22, 12); g.strokeStyle = alpha(bp, 0.4); g.lineWidth = 2; g.stroke();
    paper(g, x0 + 50, y + (rh - 22) / 2, 0.7, alpha(bp, 0.8));
    seg(g, [[x0 + 100, y + 34], [x0 + w * 0.55, y + 34]], 6, alpha(bp, 0.45)); seg(g, [[x0 + 100, y + 60], [x0 + w * 0.4, y + 60]], 6, alpha(bp, 0.3));
    const v = ease.outBack(prog(t, 0.6 + i * 0.22, 0.85 + i * 0.22));
    if (v > 0) { const cx = x0 + w - 80, cy = y + (rh - 22) / 2;
      g.save(); g.translate(cx, cy); g.scale(v, v);
      if (happened[i]) text(g, 'YA', 0, 4, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900 });
      else { seg(g, [[-22, -22], [22, 22]], 8, ui.accent); seg(g, [[22, -22], [-22, 22]], 8, ui.accent); }
      g.restore(); }
    g.restore();
  }
  g.restore();
  const th = rel('Hasilnya', info, 2.9);
  if (t > th) { g.fillStyle = alpha('#000', 0.45 * ease.in(prog(t, th, info.dur))); g.fillRect(0, 0, E.W, E.H); }
} });

// s08 — 91% (flash + impact) ... "tidak pernah terjadi"
registerShot('s08', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  const cy = E.H * 0.43, p = ease.outBack(prog(t, 0.05, 0.4));
  glow(g, E.W / 2, cy, V(520, 560), ui.gold, 0.35 * p);
  FX.rings(g, E.W / 2, cy, t, { count: 2, r0: 220, r1: 560, color: ui.gold, a: 0.35, speed: 0.9 });
  g.save(); g.translate(E.W / 2, cy); const s = p * (1 + 0.035 * t); g.scale(s, s);
  text(g, '91%', 0, 0, { size: V(300, 330), color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) }); g.restore();
  const tt = rel('tidak', info, 1.9);
  const a = ease.outBack(prog(t, tt - 0.05, tt + 0.3));
  g.save(); g.translate(E.W / 2, cy + V(250, 270)); g.scale(clamp(a), clamp(a));
  text(g, 'TIDAK PERNAH', 0, 0, { size: V(76, 84), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, 'TERJADI', 0, V(92, 100), { size: V(76, 84), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore();
  text(g, 'DARI SEMUA KEKHAWATIRAN YANG DICATAT', E.W / 2, cy - V(250, 270), { size: V(28, 32), color: alpha(bp, 0.85), font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, 0.3, 0.7)) });
  text(g, 'LaFreniere & Newman, 2020', E.W / 2, E.H * 0.86, { size: V(26, 30), color: alpha(bp, 0.7), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.5, 0.9)) });
} });

// s09 — "for many participants, not a single one came true": the 29 again, many light up with a 0
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.05);
  const cols = 5, rows = 6, x0 = V(260, 230), x1 = E.W - V(260, 230), y0 = E.H * 0.24, y1 = E.H * 0.54;
  const tz = rel('satu', info, 2.0);
  const zero = new Set([0, 2, 3, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23, 24, 26, 27]);
  for (let i = 0; i < 29; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = lerp(x0, x1, c / (cols - 1)), y = lerp(y0, y1, r / (rows - 1));
    const on = zero.has(i), k = on ? ease.outBack(prog(t, tz - 0.4 + (i % 7) * 0.06, tz - 0.1 + (i % 7) * 0.06)) : 0;
    fig(g, x, y, 1.4, k > 0.5 ? ui.gold : alpha(bp, 0.55));
    if (k > 0) { glow(g, x, y, 70, ui.gold, 0.35 * clamp(k)); text(g, '0', x + 44, y - 30, { size: 40 * k, color: ui.gold, font: FONTS.ui, weight: 900 }); }
  }
  const a = ease.outBack(prog(t, tz + 0.2, tz + 0.6));
  g.save(); g.translate(E.W / 2, E.H * 0.63); g.scale(clamp(a), clamp(a));
  text(g, '0 YANG TERJADI', 0, 0, { size: V(80, 88), color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.6) }); g.restore();
  text(g, 'HASIL PALING SERING PER ORANG', E.W / 2, E.H * 0.63 + V(80, 86), { size: V(28, 30), color: alpha(bp, 0.85), font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(a) });
  g.restore();
} });

// s17 — the one small step: write one fear tonight -> check in 7 days
registerShot('s17', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke();
  g.save(); zoomIn(g, t, info.dur, 0.05);
  const tt = rel('tulis', info, 1.0);
  text(g, 'MALAM INI', E.W / 2, E.H * 0.2, { size: V(56, 62), color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, 0.05, 0.4)) });
  const p = ease.outBack(prog(t, tt - 0.1, tt + 0.3));
  paper(g, E.W / 2, E.H * 0.36, 3.2 * clamp(p), ui.cream);
  text(g, 'TULIS 1', E.W / 2, E.H * 0.5, { size: V(96, 104), color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.6), alpha: clamp(p) });
  text(g, 'KETAKUTAN', E.W / 2, E.H * 0.5 + V(100, 108), { size: V(80, 88), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(p) });
  const a2 = ease.out(prog(t, tt + 0.9, tt + 1.3));
  text(g, 'CEK LAGI 7 HARI KEMUDIAN', E.W / 2, E.H * 0.67, { size: V(36, 40), color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 3, alpha: a2 });
  g.restore();
} });
