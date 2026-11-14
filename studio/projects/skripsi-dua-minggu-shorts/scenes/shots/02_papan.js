// 02_papan.js — riset sebagai kartu feed (blueprint): Buehler 1994, tiang 34 / 49 / 55, ±30%, jalan rencana vs kenyataan.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];
function card(g, t, info, draw, o = {}) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD;
  g.save(); rr(g, x, 1440, w, 600, 50); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill(); g.restore();
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g);
  const z = 1 + 0.02 * ease.inOut(t / info.dur); g.translate(E.W / 2, y + h / 2); g.scale(z, z); g.translate(-E.W / 2, -(y + h / 2));
  draw(g, ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 4; g.stroke();
  if (o.over) o.over(g, ui, UI.bpStroke());   // digambar di luar clip (tiang yang menembus kartu)
}
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const SRC = 'Buehler, Griffin & Ross, 1994';
const mini = (g, x, y, s, col) => { circle(g, x, y - 12 * s, 8 * s, col); seg(g, [[x, y - 3 * s], [x, y + 14 * s]], 5 * s, col); seg(g, [[x - 8 * s, y + 26 * s], [x, y + 14 * s], [x + 8 * s, y + 26 * s]], 4 * s, col); };

// s09 — "Tahun 94, Roger Buehler nanya ke 37 mahasiswa tugas akhir: kelarnya kapan?"
registerShot('s09', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tr = rel('Roger', info, 1.2), tn = rel('37', info, 3.0), tk = rel('kelarnya', info, 5.6);
    text(g, '1994', E.W / 2, 320, { size: 90, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.05, 0.4)) });
    text(g, 'ROGER BUEHLER', E.W / 2, 420, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tr - 0.1, tr + 0.3)) });
    text(g, SRC, E.W / 2, 485, { size: 30, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tr + 0.2, tr + 0.6)) });
    for (let i = 0; i < 37; i++) { const c = i % 10, r = Math.floor(i / 10), x = 230 + c * 69, y = 610 + r * 92, k = ease.outBack(prog(t, tn - 0.3 + i * 0.03, tn - 0.1 + i * 0.03)); if (k <= 0) continue; mini(g, x, y, 1.15 * k, ui.cream); }
    const n = Math.round(37 * clamp(prog(t, tn - 0.3, tn + 1.0))); if (n > 0) text(g, `${n} MAHASISWA`, E.W / 2, 1010, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
    const a = pop(t, tk); if (a > 0) { g.save(); g.translate(E.W / 2, 1140); g.scale(a, a); text(g, '"KELARNYA KAPAN?"', 0, 0, { size: 66, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  });
} });

// tiang hari: x tengah, nilai v (hari), skala px/hari, warna
const BASE = 1120, PX = 13.5;
function pillar(g, x, v, k, col, label, ui, o = {}) {
  if (k <= 0) return; const h = v * PX * ease.out(clamp(k)), w = 170;
  g.save(); rr(g, x - w / 2, BASE - h, w, h, 14); g.fillStyle = alpha(col, 0.28); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke(); g.restore();
  glow(g, x, BASE - h, 120, col, 0.25 * clamp(k));
  text(g, String(Math.round(v * clamp(k))), x, BASE - h - (o.numIn ? -70 : 56), { size: 84, color: col, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(col, 0.5) });
  text(g, label, x, BASE + 52, { size: 32, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(k * 2) });
}
const axis = (g, bp) => { seg(g, [[130, BASE], [950, BASE]], 5, alpha(bp, 0.8)); };

// s10 — "Rata-rata nebak 34 hari. Kenyataannya 55 hari."
registerShot('s10', { draw(g, t, info) {
  const t1 = rel('34', info, 1.0), t2 = rel('55', info, 3.0);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'HARI SAMPAI SELESAI', E.W / 2, 300, { size: 48, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.0, 0.3)) });
    axis(g, bp);
    pillar(g, 300, 34, prog(t, t1 - 0.3, t1 + 0.6), ui.cream, 'TEBAKAN', ui);
  }, { over: (g, ui) => pillar(g, 780, 55, prog(t, t2 - 0.4, t2 + 0.9), ui.gold, 'KENYATAAN', ui, { numIn: true }) });
} });

// s11 — "Tebakan skenario paling buruknya, 49 hari, itu pun kelewat."
registerShot('s11', { draw(g, t, info) {
  const t1 = rel('49', info, 1.4), tk = rel('kelewat', info, 3.1);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'HARI SAMPAI SELESAI', E.W / 2, 300, { size: 48, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4 });
    axis(g, bp);
    pillar(g, 230, 34, 1, alpha(ui.cream, 0.6), 'TEBAKAN', ui);
    pillar(g, 540, 49, prog(t, t1 - 0.3, t1 + 0.6), ui.accent || '#ff6a50', 'TERBURUK', ui);
    const a = pop(t, tk, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 380); g.scale(a, a); text(g, 'ITU PUN KELEWAT', 0, 0, { size: 70, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  }, { over: (g, ui) => { const k = 1 + 0.35 * ease.out(prog(t, tk - 0.2, tk + 0.8)); g.save(); g.translate(850, BASE); g.scale(1, k); g.translate(-850, -BASE); pillar(g, 850, 55, 1, ui.gold, 'KENYATAAN', ui, { numIn: true }); g.restore(); } });
} });

// s12 — "Cuma sekitar 30 persen yang selesai sesuai tebakannya."
registerShot('s12', { draw(g, t, info) {
  const tn = rel('30', info, 1.0);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'SELESAI SESUAI TEBAKAN', E.W / 2, 330, { size: 46, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 3 });
    for (let i = 0; i < 10; i++) { const c = i % 5, r = Math.floor(i / 5), x = 220 + c * 160, y = 520 + r * 200, on = i < 3 && t > tn + 0.2 + i * 0.25; mini(g, x, y, 3.2, on ? ui.gold : alpha(bp, 0.55)); if (on) glow(g, x, y, 110, ui.gold, 0.2); }
    const a = pop(t, tn, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1010); g.scale(a, a); text(g, '±30%', 0, 0, { size: 200, color: ui.gold, font: FONTS.ui, weight: 900, glow: 36, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
    text(g, '(sekitar)', E.W / 2, 1150, { size: 34, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tn + 0.5, tn + 0.9)) });
  });
} });

// s14 — "Otaknya bikin rencana pakai jalan yang paling mulus, terus lupa sama pengalamannya sendiri."
registerShot('s14', { draw(g, t, info) {
  const tj = rel('jalan', info, 1.6), tl = rel('lupa', info, 4.0), tp = rel('pengalamannya', info, 4.6);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'CARA OTAK BIKIN RENCANA', E.W / 2, 300, { size: 44, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 3 });
    const x0 = 170, x1 = 900, ya = 560, yb = 900;
    // RENCANA: garis lurus mulus
    const k1 = ease.inOut(prog(t, tj - 0.6, tj + 0.6)); if (k1 > 0) { seg(g, [[x0, ya], [lerp(x0, x1, k1), ya]], 14, ui.cream); circle(g, lerp(x0, x1, k1), ya, 18, ui.cream);
      text(g, 'RENCANA', x0, ya - 60, { size: 40, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); }
    // KENYATAAN: berliku, bolak-balik
    const k2 = ease.inOut(prog(t, tj + 0.4, tl + 0.6)); if (k2 > 0) { const pts = []; for (let i = 0; i <= 60 * k2; i++) { const u = i / 60; pts.push([lerp(x0, x1, u) - Math.sin(u * 19) * 46 * u, yb + Math.sin(u * 13) * 70 + Math.cos(u * 7) * 30]); }
      seg(g, pts, 12, ui.gold); const e = pts[pts.length - 1]; circle(g, e[0], e[1], 18, ui.gold);
      text(g, 'KENYATAAN', x0, yb - 120, { size: 40, color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); }
    // folder PENGALAMAN pudar
    const a = ease.out(prog(t, tp - 0.3, tp + 0.3)), fade = 1 - 0.75 * ease.inOut(prog(t, tp + 0.4, tp + 1.4));
    if (a > 0) { g.save(); g.globalAlpha *= a * fade; g.translate(E.W / 2, 1110); rr(g, -190, -60, 380, 120, 16); g.strokeStyle = ui.cream; g.lineWidth = 5; g.setLineDash([14, 10]); g.stroke(); g.setLineDash([]);
      text(g, 'PENGALAMAN', 0, 4, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
  });
} });
