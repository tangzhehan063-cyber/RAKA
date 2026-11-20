// _util.js — pembantu bersama #16 (diawali "_" jadi tidak dimuat sebagai shot).
import { E, V, S, wordTime, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
export const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
export const GOLD = () => S().ui.gold;
// ketik teks per huruf dalam jendela waktu [a,b]
export const ketik = (str, t, a, b) => str.slice(0, Math.floor(clamp((t - a) / (b - a)) * str.length));
export const hening = (g, t, L, y = E.H * 0.42) => {
  const ui = S().ui, n = Math.floor(clamp((t - 0.15) / 1.4) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, y, { size: 86, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.45) });
};
// tangan raksasa: lengan baju (warna maskot) masuk dari tepi layar, tangan hitam. kind: 'jempol' | 'pena' | 'buka'
export function tangan(g, o) {
  const { x, y, ang = -2.3, s = 1, sleeve = '#d64a33', kind = 'buka', t = 0 } = o, ink = S().ink;
  const dx = Math.cos(ang), dy = Math.sin(ang);
  g.save(); g.translate(x, y); g.rotate(ang);                       // sumbu +x = arah dari pergelangan ke ujung jari
  seg(g, [[0, 0], [-1400 * s, 0]], 150 * s, shade(sleeve, -0.1));
  seg(g, [[-10 * s, 0], [-10 * s, 0.01]], 160 * s, shade(sleeve, -0.28));
  rr(g, -40 * s, -82 * s, 70 * s, 164 * s, 28 * s); g.fillStyle = shade(sleeve, 0.08); g.fill();    // manset
  g.beginPath(); g.ellipse(80 * s, 0, 100 * s, 78 * s, 0, 0, Math.PI * 2); g.fillStyle = ink; g.fill();    // telapak
  if (kind === 'jempol') {
    seg(g, [[100 * s, 40 * s], [220 * s, 70 * s]], 48 * s, ink); seg(g, [[60 * s, -50 * s], [170 * s, -90 * s]], 40 * s, ink);
    seg(g, [[90 * s, -10 * s], [210 * s, -30 * s]], 40 * s, ink);
  } else if (kind === 'pena') {
    seg(g, [[120 * s, 0], [250 * s, 20 * s]], 44 * s, ink); seg(g, [[100 * s, -50 * s], [230 * s, -20 * s]], 38 * s, ink);
    seg(g, [[160 * s, 4 * s], [420 * s, 60 * s]], 15 * s, '#e9e2d6'); seg(g, [[400 * s, 56 * s], [450 * s, 66 * s]], 7 * s, '#222');
  } else {
    for (let i = 0; i < 4; i++) seg(g, [[130 * s, (-50 + i * 34) * s], [(260 - Math.abs(i - 1.5) * 20) * s, (-60 + i * 40) * s]], 36 * s, ink);
    seg(g, [[70 * s, 66 * s], [150 * s, 130 * s]], 40 * s, ink);
  }
  g.restore();
}
// halaman buku catatan
export function halaman(g, x, y, w, h, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  g.fillStyle = 'rgba(0,0,0,.35)'; rr(g, -w / 2 + 10, -h / 2 + 14, w, h, 14); g.fill();
  rr(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = o.color || '#efe6cf'; g.fill();
  for (let i = 1; i < 9; i++) seg(g, [[-w / 2 + 30, -h / 2 + i * (h / 9.5)], [w / 2 - 30, -h / 2 + i * (h / 9.5)]], 2, 'rgba(60,80,120,.25)');
  seg(g, [[-w / 2 + 70, -h / 2 + 12], [-w / 2 + 70, h / 2 - 12]], 2.5, 'rgba(200,70,60,.4)');
  g.restore();
}
// sticky note kuning
export function sticky(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-190 + 10, -190 + 14, 380, 380);
  g.fillStyle = o.color || '#f6d54a'; g.fillRect(-190, -190, 380, 380);
  g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-190, -190, 380, 40);
  if (o.crumple) { for (let i = 0; i < 9; i++) seg(g, [[-190 + i * 47, -190 + ((i * 53) % 90)], [-120 + i * 33, 190 - ((i * 37) % 120)]], 3, 'rgba(120,80,0,.25)'); }
  g.restore();
}
// HP besar menghadap kamera
export function hp(g, x, y, s, o = {}) {
  rr(g, x - 190 * s, y - 360 * s, 380 * s, 720 * s, 52 * s); g.fillStyle = '#0a0d16'; g.fill();
  rr(g, x - 170 * s, y - 340 * s, 340 * s, 680 * s, 40 * s); g.fillStyle = o.screen || '#10172a'; g.fill();
  glow(g, x, y, 520 * s, o.glow || '#6fa8ff', 0.25);
}

// tangan + pena dengan ujung pena tepat di (wx, wy)
export function penTangan(g, wx, wy, sc = 0.6, sleeve = '#d64a33') {
  const ang = -0.7, d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]];
  const tip = [(450 * d[0] + 66 * n[0]) * sc, (450 * d[1] + 66 * n[1]) * sc];
  tangan(g, { x: wx - tip[0], y: wy - tip[1], ang, s: sc, sleeve, kind: 'pena' });
}
