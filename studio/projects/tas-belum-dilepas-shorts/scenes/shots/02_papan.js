// 02_papan.js — riset sebagai kartu feed (blueprint di dalam kartu): penelitian, 43%, pintu->sofa->HP, studi televisi.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];
function card(g, t, info, draw) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD;
  g.save(); rr(g, x, 1440, w, 600, 50); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill(); g.restore();
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g);
  const z = 1 + 0.02 * ease.inOut(t / info.dur); g.translate(E.W / 2, y + h / 2); g.scale(z, z); g.translate(-E.W / 2, -(y + h / 2));
  draw(g, ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 4; g.stroke();
}
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const SRC = 'Wood, Quinn & Kashy, 2002';

// s09 — "Ada penelitian yang nyuruh orang nyatet kegiatannya tiap jam." 24 jam, satu catatan per jam
registerShot('s09', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    text(g, 'ADA PENELITIAN', E.W / 2, 340, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.05, 0.4)) });
    const t0 = 0.5, step = 0.09;
    for (let i = 0; i < 24; i++) { const c = i % 6, r = Math.floor(i / 6), x = 235 + c * 122, y = 520 + r * 150, k = ease.outBack(prog(t, t0 + i * step, t0 + 0.22 + i * step)); if (k <= 0) continue;
      g.save(); g.translate(x, y); g.scale(k, k); rr(g, -48, -52, 96, 104, 16); g.fillStyle = alpha(bp, 0.14); g.fill(); g.strokeStyle = alpha(bp, 0.7); g.lineWidth = 3; g.stroke();
      text(g, String(i + 6).padStart(2, '0'), 0, -4, { size: 38, color: ui.cream, font: FONTS.ui, weight: 900 });
      seg(g, [[-24, 26], [24, 26]], 4, alpha(bp, 0.8)); g.restore(); }
    text(g, 'TIAP JAM: LAGI NGAPAIN?', E.W / 2, 1160, { size: 46, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, t0 + 2.0, t0 + 2.4)) });
  });
} });

// s10 — "Wendy Wood nemu sekitar 43 persen tindakan harian itu kebiasaan yang jalan sendiri"
registerShot('s10', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tw = rel('Wendy', info, 0.9), tn = rel('43', info, 3.6), tk = rel('kebiasaan', info, 4.4);
    text(g, 'WENDY WOOD', E.W / 2, 330, { size: 72, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, tw - 0.1, tw + 0.3)) });
    text(g, SRC, E.W / 2, 405, { size: 32, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tw + 0.1, tw + 0.5)) });
    // 100 orang kecil, 43 menyala
    const n0 = tn - 1.2;
    for (let i = 0; i < 100; i++) { const c = i % 20, r = Math.floor(i / 20), x = 150 + c * 40, y = 520 + r * 52, on = i < 43 * clamp(ease.out(prog(t, tn - 0.3, tn + 1.0)));
      const k = ease.outBack(prog(t, n0 + i * 0.008, n0 + 0.2 + i * 0.008)); if (k <= 0) continue; const col = on ? ui.gold : alpha(bp, 0.55), s = 0.7 * k;
      circle(g, x, y - 12 * s, 8 * s, col); seg(g, [[x, y - 3 * s], [x, y + 14 * s]], 5 * s, col); seg(g, [[x - 8 * s, y + 26 * s], [x, y + 14 * s], [x + 8 * s, y + 26 * s]], 4 * s, col); }
    const a = pop(t, tn); g.save(); g.translate(E.W / 2, 905); g.scale(a, a);
    text(g, '43%', 0, 0, { size: 240, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.7) }); g.restore();
    text(g, 'KEBIASAAN OTOMATIS', E.W / 2, 1090, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tk - 0.2, tk + 0.3)) });
    text(g, 'sambil kepala mikirin hal lain', E.W / 2, 1160, { size: 36, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tk + 1.6, tk + 2.0)) });
  });
} });

// s11 — "pintu rumah itu pemicunya: masuk, duduk, HP, sepaket"
registerShot('s11', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tp = rel('pintu', info, 0.8), tm = rel('masuk', info, 2.0), td = rel('duduk', info, 3.0), th = rel('HP', info, 3.7), ts = rel('sepaket', info, 4.2);
    text(g, 'PEMICUNYA', E.W / 2, 330, { size: 56, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.0, 0.3)) });
    const nodes = [[250, 620, 'PINTU', tm], [E.W / 2, 620, 'DUDUK', td], [830, 620, 'HP', th]];
    nodes.forEach(([x, y, label, at], i) => { const k = pop(t, i === 0 ? tp : at); if (k <= 0) return;
      g.save(); g.translate(x, y); g.scale(k, k); rr(g, -110, -110, 220, 220, 36); g.fillStyle = alpha(bp, 0.12); g.fill(); g.strokeStyle = i === 0 ? ui.gold : alpha(bp, 0.85); g.lineWidth = 6; g.stroke();
      if (i === 0) { rr(g, -34, -64, 68, 128, 6); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke(); circle(g, 18, 0, 6, ui.cream); }
      if (i === 1) { rr(g, -56, -4, 112, 40, 12); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke(); rr(g, -56, -56, 112, 52, 12); g.stroke(); }
      if (i === 2) { rr(g, -30, -58, 60, 116, 10); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke(); }
      g.restore(); text(g, label, x, y + 160, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(k) }); });
    [[360, tm - 0.5, td - 0.05], [650, td - 0.5, th - 0.05]].forEach(([x, a0, a1]) => { const k = ease.out(prog(t, a0, a1)); if (k > 0) seg(g, [[x, 620], [x + 70 * k, 620]], 8, ui.gold); });
    const b = pop(t, ts, 0.4); if (b > 0) { g.save(); g.translate(E.W / 2, 1010); g.scale(b, b); text(g, 'SATU PAKET', 0, 0, { size: 120, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
    text(g, 'jalan sendiri', E.W / 2, 1130, { size: 42, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, ts + 0.4, ts + 0.8)) });
  });
} });

// s12 — "Studi lama soal televisi: makin lama duduk, makin ngantuk dan makin susah bangun"
registerShot('s12', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tt = rel('televisi', info, 0.9), tl = rel('lama', info, 3.0), tn = rel('ngantuk', info, 4.0), tb = rel('bangun', info, 5.4);
    text(g, 'STUDI LAMA · TELEVISI · 1990', E.W / 2, 330, { size: 40, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tt - 0.2, tt + 0.3)) });
    const x0 = 190, x1 = 890, y0 = 1060, y1 = 470;
    seg(g, [[x0, y0], [x1, y0]], 5, alpha(bp, 0.8)); seg(g, [[x0, y0], [x0, y1]], 5, alpha(bp, 0.8));
    text(g, 'LAMA DUDUK →', x1, y0 + 50, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, align: 'right', alpha: ease.out(prog(t, tl - 0.3, tl + 0.2)) });
    const draw = (from, to, col, label, ly) => { const k = ease.inOut(prog(t, from, from + 1.4)); if (k <= 0) return;
      const pts = []; for (let i = 0; i <= 40 * k; i++) { const u = i / 40; pts.push([lerp(x0 + 20, x1 - 20, u), to(u)]); } seg(g, pts, 10, col);
      const e = pts[pts.length - 1]; circle(g, e[0], e[1], 14, col); text(g, label, e[0] - 14, e[1] + ly, { size: 40, color: col, font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(k * 2) }); };
    draw(tn - 0.3, (u) => lerp(y0 - 90, y1 + 40, u * u), ui.gold, 'NGANTUK', -50);
    draw(tb - 0.5, (u) => lerp(y1 + 70, y0 - 70, u), ui.accent, 'SUSAH BANGUN', 64);
    text(g, '(TV, bukan HP · pola, bukan vonis)', E.W / 2, 1180, { size: 30, color: alpha(bp, 0.8), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tb + 0.3, tb + 0.7)) });
  });
} });
