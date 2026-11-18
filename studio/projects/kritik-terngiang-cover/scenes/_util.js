// _util.js — pembantu bersama (tidak dimuat sebagai shot karena diawali "_").
import { E, V, S, layer, blurLayer, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { KRITIK, PUJI, BAYU } from './cast.js';

// gelembung komentar: rr + ekor + teks (otomatis muat); str boleh dua baris dipisah "\n"
export function bub(g, x, y, w, h, col, str = null, a = 1, size = null) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y);
  glow(g, 0, 0, Math.max(w, h) * 1.4, col, 0.28);
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = col; g.fill();
  g.beginPath(); g.moveTo(-w * 0.2, h / 2 - 3); g.lineTo(-w * 0.34, h / 2 + h * 0.42); g.lineTo(-w * 0.02, h / 2 - 3); g.closePath(); g.fill();
  if (str) { const L = str.split('\n'), sz = size || Math.min(h * (L.length > 1 ? 0.34 : 0.46), w / (Math.max(...L.map((s) => s.length)) * 0.62)); L.forEach((s, i) => text(g, s, 0, (i - (L.length - 1) / 2) * sz * 1.15, { size: sz, color: '#fff', font: FONTS.ui, weight: 900, spacing: 1 })); }
  g.restore();
}
// lengan raksasa dari kiri-bawah menuju (hx, hy): lengan baju berwarna + lengan hitam
export function lengan(g, hx, hy, s = 1.35, sleeve = BAYU.color) {
  seg(g, [[hx - 60 * s, hy + 150 * s], [-300, hy + 480 * s]], 110 * s, '#0b0f1a'); seg(g, [[hx - 200 * s, hy + 230 * s], [-300, hy + 480 * s]], 150 * s, sleeve);
}
