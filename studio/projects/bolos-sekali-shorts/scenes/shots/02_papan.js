// 02_papan.js — riset sebagai kartu feed (blueprint): Herman & Mack 1975, milkshake -> es krim, Polivy "what the hell".
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { rel } from './01_pantri.js';

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
const mini = (g, x, y, s, col) => { circle(g, x, y - 12 * s, 8 * s, col); seg(g, [[x, y - 3 * s], [x, y + 14 * s]], 5 * s, col); seg(g, [[x - 8 * s, y + 26 * s], [x, y + 14 * s], [x + 8 * s, y + 26 * s]], 4 * s, col); };
const SRC = 'Herman & Mack, 1975';
function glass(g, x, y, s, col) {   // gelas milkshake: isi bergelombang, krim kocok, sedotan
  g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-50, -170); g.lineTo(50, -170); g.lineTo(36, 0); g.quadraticCurveTo(0, 12, -36, 0); g.closePath(); g.fillStyle = alpha(col, 0.12); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
  g.beginPath(); g.moveTo(-47, -132); g.quadraticCurveTo(-24, -146, 0, -132); g.quadraticCurveTo(24, -118, 47, -132); g.lineTo(35, -6); g.quadraticCurveTo(0, 6, -35, -6); g.closePath(); g.fillStyle = alpha(col, 0.34); g.fill();
  for (const [dy, w] of [[-176, 52], [-198, 38], [-216, 22]]) { g.beginPath(); g.ellipse(0, dy, w, 14, 0, 0, Math.PI * 2); g.fillStyle = alpha('#fff', 0.85); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke(); }
  seg(g, [[14, -190], [40, -268]], 9, '#fff'); seg(g, [[14, -190], [40, -268]], 5, col); g.restore();
}
function cone(g, x, y, s, col) {   // es krim: kerucut wafel berpola kotak-kotak + dua bola dengan lelehan
  g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-40, -76); g.lineTo(40, -76); g.lineTo(0, 6); g.closePath(); g.fillStyle = alpha(col, 0.3); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
  g.save(); g.beginPath(); g.moveTo(-40, -76); g.lineTo(40, -76); g.lineTo(0, 6); g.closePath(); g.clip();
  for (let i = -3; i <= 3; i++) { seg(g, [[i * 16 - 30, -76], [i * 16 + 30, 6]], 2.5, alpha(col, 0.8)); seg(g, [[i * 16 + 30, -76], [i * 16 - 30, 6]], 2.5, alpha(col, 0.8)); } g.restore();
  g.beginPath(); g.arc(0, -100, 36, 0, Math.PI * 2); g.fillStyle = alpha(col, 0.28); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
  g.beginPath(); g.moveTo(-46, -78); for (let i = 0; i < 4; i++) g.quadraticCurveTo(-46 + i * 23 + 6, -60 - (i % 2) * 8, -46 + (i + 1) * 23, -78); g.fillStyle = alpha(col, 0.35); g.fill(); g.stroke();
  g.beginPath(); g.arc(0, -150, 30, 0, Math.PI * 2); g.fillStyle = alpha(col, 0.28); g.fill(); g.stroke(); circle(g, 0, -184, 6, col); g.restore();
}

// s10 28.6–33.1: "Tahun 75, Herman dan Mack ngasih milkshake ke orang yang lagi diet."
registerShot('s10', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tr = rel('Herman', info, 1.8), td = rel('diet', info, 3.8);
    text(g, '1975', E.W / 2, 320, { size: 90, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.05, 0.4)) });
    text(g, 'HERMAN & MACK', E.W / 2, 420, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tr - 0.1, tr + 0.3)) });
    text(g, SRC, E.W / 2, 485, { size: 30, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tr + 0.2, tr + 0.6)) });
    for (let i = 0; i < 12; i++) { const c = i % 6, r = Math.floor(i / 6), x = 220 + c * 128, y = 700 + r * 130, k = ease.outBack(prog(t, tr + 0.6 + i * 0.05, tr + 0.9 + i * 0.05)); if (k > 0) mini(g, x, y, 1.9 * k, ui.cream); }
    const a = pop(t, td, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1060); g.scale(a, a); text(g, 'ORANG YANG LAGI DIET', 0, 0, { size: 62, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  });
} });
// s11 33.1–36.8: "Katanya tes rasa. Habis itu mereka ditawari es krim."
registerShot('s11', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t1 = rel('tes', info, 0.5), t2 = rel('Habis', info, 1.9), t3 = rel('es', info, 2.5);
    const a = ease.outBack(prog(t, t1 - 0.2, t1 + 0.3)); if (a > 0) { glass(g, 330, 880, 1.6 * a, ui.cream); text(g, '"TES RASA"', 330, 960, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); }
    const k = ease.out(prog(t, t2 - 0.2, t2 + 0.3)); if (k > 0) seg(g, [[470, 640], [470 + 140 * k, 640]], 8, alpha(bp, 0.9));
    const b = ease.outBack(prog(t, t3 - 0.2, t3 + 0.3)); if (b > 0) { cone(g, 760, 880, 1.8 * b, ui.gold); text(g, 'ES KRIM', 760, 960, { size: 54, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3 }); }
    text(g, 'DIUKUR: BERAPA YANG DIMAKAN', E.W / 2, 1090, { size: 38, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, t3 + 0.5, t3 + 0.9)) });
  });
} });
const BASE = 1080, PX = 5.6;
function bar(g, x, v, k, col, label, ui, o = {}) {
  if (k <= 0) return; const h = v * PX * ease.out(clamp(k)), w = 200;
  g.save(); rr(g, x - w / 2, BASE - h, w, h, 14); g.fillStyle = alpha(col, 0.28); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke(); g.restore();
  glow(g, x, BASE - h, 120, col, 0.22 * clamp(k));
  text(g, label, x, BASE + 48, { size: 32, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(k * 2) });
  if (o.sub) text(g, o.sub, x, BASE + 88, { size: 26, color: alpha(col, 0.9), font: FONTS.ui, weight: 800, alpha: clamp(k * 2) });
}
// s12 36.8–39.9: milkshake -> es krim lebih banyak
registerShot('s12', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t1 = rel('minum', info, 0.9), t2 = rel('lebih', info, 2.0);
    text(g, 'ES KRIM YANG DIMAKAN', E.W / 2, 310, { size: 46, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 3 });
    seg(g, [[130, BASE], [950, BASE]], 5, alpha(bp, 0.8));
    bar(g, 330, 70, prog(t, 0.2, 1.0), ui.cream, 'TANPA', ui, { sub: 'MILKSHAKE' });
    bar(g, 750, 130, prog(t, t1, t1 + 0.9), ui.gold, 'SESUDAH', ui, { sub: 'MILKSHAKE' });
    const a = pop(t, t2, 0.4); if (a > 0) { g.save(); g.translate(540, 470); g.scale(a, a); text(g, 'LEBIH BANYAK', 0, 0, { size: 76, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  });
} });
// s13 39.9–42.8: satu milkshake ~ dua milkshake
registerShot('s13', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t1 = rel('dua', info, 2.0);
    text(g, 'ES KRIM YANG DIMAKAN', E.W / 2, 310, { size: 46, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 3 });
    seg(g, [[130, BASE], [950, BASE]], 5, alpha(bp, 0.8));
    bar(g, 330, 128, prog(t, 0.1, 0.9), ui.gold, '1 MILKSHAKE', ui);
    bar(g, 750, 134, prog(t, t1 - 0.4, t1 + 0.5), ui.gold, '2 MILKSHAKE', ui);
    const a = pop(t, t1 + 0.3, 0.4); if (a > 0) { g.save(); g.translate(540, 520); g.scale(a, a); text(g, 'HAMPIR SAMA', 0, 0, { size: 80, color: ui.cream, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  });
} });
// s14 42.8–45.95: Polivy, efek "what the hell"
registerShot('s14', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tp = rel('Polivy', info, 0.8), tw = rel('what', info, 2.0);
    text(g, 'JANET POLIVY', E.W / 2, 400, { size: 70, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tp - 0.1, tp + 0.3)) });
    text(g, 'MENYEBUTNYA', E.W / 2, 480, { size: 36, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, spacing: 3, alpha: ease.out(prog(t, tp + 0.3, tp + 0.7)) });
    const a = pop(t, tw, 0.45); if (a > 0) { g.save(); g.translate(E.W / 2, 800); g.scale(a, a); text(g, 'WHAT', 0, -80, { size: 190, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) }); text(g, 'THE HELL', 0, 90, { size: 190, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
    text(g, 'EFEK', E.W / 2, 1090, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, tw + 0.5, tw + 0.9)) });
  });
} });
// s15 45.95–47.1: hening, teks diketik
registerShot('s15', { draw(g, t, info) {
  g.fillStyle = '#10131c'; g.fillRect(0, 0, E.W, E.H);
  const ui = S().ui, L = 'sudah telanjur', n = Math.floor(clamp((t - 0.05) / 0.75) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, 780, { size: 100, color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.4) });
} });
