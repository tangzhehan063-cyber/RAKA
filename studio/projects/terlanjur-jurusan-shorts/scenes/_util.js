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
// tembok diktat: n buku (susunan batu bata, baris naik). x tengah, GY lantai. pTop = buku teratas yang baru muncul (0..1 skala pop)
const BK = ['#7a4a3a', '#3a5f7a', '#8a7a3a', '#5a3a6a', '#3f6a55', '#8a4a5a'];
export function tembok(g, x, GY, n, o = {}) {
  const w = o.w || 170, h = o.h || 36, per = o.per || 4, hole = o.hole;
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), c = i % per, off = (r % 2) * (w / 2), bx = x - (per * w) / 2 + c * w + off, by = GY + 8 - (r + 1) * h;
    let k = 1; if (i === n - 1 && o.pop != null) k = o.pop; if (k <= 0) continue;
    if (hole === i) continue;
    g.save(); g.translate(bx + w / 2, by + h / 2); g.scale(k, k); rr(g, -w / 2, -h / 2, w - 4, h - 3, 4); g.fillStyle = shade(BK[(i * 7 + r) % BK.length], -0.12); g.fill();
    rr(g, -w / 2 + 6, -h / 2 + 5, w - 16, 4, 2); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill(); g.restore();
  }
  return Math.ceil(n / per) * h;
}

// tumpukan buku (menara): buku berbaring bertumpuk, tebal/lebar beda, sedikit miring; punggung buku menghadap kamera.
const fr = (i, k) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
export function tumpukanGeom(n, x, GY) {
  const out = []; let y = GY + 8;
  for (let i = 0; i < n; i++) { const w = 200 + fr(i, 1) * 100, h = 34 + fr(i, 2) * 20; y -= h; out.push({ i, w, h, cx: x + (fr(i, 3) - 0.5) * 40, cy: y + h / 2, rot: (fr(i, 4) - 0.5) * 0.05 }); }
  return out;
}
export function tumpukan(g, x, GY, n, o = {}) {
  const geo = tumpukanGeom(n, x, GY); const hole = o.hole;
  g.save(); g.globalAlpha *= 0.35; g.fillStyle = '#000'; g.beginPath(); g.ellipse(x, GY + 14, 190, 16, 0, 0, Math.PI * 2); g.fill(); g.restore();
  geo.forEach((b) => {
    if (hole === b.i) return;
    const k = (b.i === n - 1 && o.pop != null) ? o.pop : 1; if (k <= 0) return; const col = BK[(b.i * 5 + 1) % BK.length];
    g.save(); g.translate(b.cx, b.cy - (1 - k) * 60); g.rotate(b.rot); g.scale(k, k);
    rr(g, -b.w / 2, -b.h / 2, b.w, b.h, 5); g.fillStyle = shade(col, -0.1); g.fill();
    rr(g, b.w / 2 - 22, -b.h / 2 + 4, 20, b.h - 8, 3); g.fillStyle = '#f1e8d2'; g.fill();                       // sisi halaman
    for (let j = 0; j < 3; j++) seg(g, [[b.w / 2 - 20, -b.h / 2 + 8 + j * ((b.h - 16) / 2)], [b.w / 2 - 4, -b.h / 2 + 8 + j * ((b.h - 16) / 2)]], 1.5, 'rgba(0,0,0,.18)');
    seg(g, [[-b.w / 2 + 14, -b.h / 2 + 7], [-b.w / 2 + 14, b.h / 2 - 7]], 3, 'rgba(255,220,140,.55)');             // pita emas punggung
    rr(g, -b.w / 2 + 34, -b.h / 2 + 9, b.w * 0.42, b.h - 18, 3); g.fillStyle = 'rgba(255,240,200,.82)'; g.fill();   // label judul
    seg(g, [[-b.w / 2 + 44, 0], [-b.w / 2 + 34 + b.w * 0.42 - 12, 0]], 3, 'rgba(60,40,30,.55)');
    rr(g, -b.w / 2 + 3, -b.h / 2 + 3, b.w - 30, 4, 2); g.fillStyle = 'rgba(255,255,255,.2)'; g.fill(); g.restore();
  });
  return geo.length ? GY + 8 - geo[geo.length - 1].cy + geo[geo.length - 1].h / 2 : 0;
}
