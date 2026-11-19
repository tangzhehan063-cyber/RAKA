// _util.js — pembantu bersama (diawali "_" jadi tidak dimuat sebagai shot).
import { E, V, S, wordTime, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
export const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
// gelembung chat (ekor kiri bawah); str dua baris dipisah "\n"
export function bub(g, x, y, w, h, col, str = null, a = 1, size = null) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y);
  glow(g, 0, 0, Math.max(w, h) * 1.2, col, 0.25);
  rr(g, -w / 2, -h / 2, w, h, h / 3); g.fillStyle = col; g.fill();
  g.beginPath(); g.moveTo(-w * 0.3, h / 2 - 3); g.lineTo(-w * 0.4, h / 2 + h * 0.3); g.lineTo(-w * 0.12, h / 2 - 3); g.closePath(); g.fill();
  if (str) { const L = str.split('\n'), sz = size || Math.min(h * (L.length > 1 ? 0.3 : 0.4), w / (Math.max(...L.map((s) => s.length)) * 0.62)); L.forEach((s, i) => text(g, s, 0, (i - (L.length - 1) / 2) * sz * 1.2, { size: sz, color: '#fff', font: FONTS.ui, weight: 900, spacing: 1 })); }
  g.restore();
}
// HP besar menghadap kamera (layar menyala), dipegang tangan dari kiri bawah
export function hpBesar(g, hx, hy, s, screenCol, draw) {
  seg(g, [[hx - 60 * s, hy + 150 * s], [-300, hy + 480 * s]], 110 * s, '#0b0f1a');
  rr(g, hx - 130 * s, hy - 250 * s, 260 * s, 480 * s, 34 * s); g.fillStyle = '#0a0d16'; g.fill();
  rr(g, hx - 116 * s, hy - 236 * s, 232 * s, 452 * s, 26 * s); g.fillStyle = screenCol; g.fill();
  glow(g, hx, hy, 460, screenCol, 0.22);
  if (draw) draw(g, hx, hy, s);
  for (let i = 0; i < 4; i++) seg(g, [[hx + 130 * s, hy + (150 - i * 38) * s], [hx + 188 * s - i * 8 * s, hy + (112 - i * 40) * s]], 34 * s, '#0b0f1a');
}
export const hening = (g, t, L, y = E.H * 0.42) => {
  const ui = S().ui, n = Math.floor(clamp((t - 0.15) / 1.0) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, y, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.45) });
};
