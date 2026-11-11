// istana.js — Stick.Tales "What If": ancient Chinese palace set + props (crown, lanterns, scroll, bowl, dagger, masks).
import { E, V, S, mood, layer, alpha, glow, rr, seg, circle, poly, linGrad, radGrad, text, FONTS, lerp, ease, prog, clamp, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GOLD = '#c9a24a', RED = '#9e1b1b', LAC = '#7a1414', PAPER = '#e9dfc7', JADE = '#5f8f6a', INK = '#0e0f14';
export const PRINCE = { top: 'dress', color: '#2a2018', head: 'none' };       // black robe; the gold crown is drawn on top
export const PRINCE_KID = { ...PRINCE, kid: true };
export const EMPEROR = { top: 'dress', color: '#5a1010', head: 'none' };
export const NOBLE = { top: 'dress', color: '#2a2a3a', head: 'none' };
export const KID = { top: 'tshirt', color: '#6a7a5a', head: 'none', kid: true };

// gold crown (guan) on a head [hx,hy,r]. heavy = 0..1 grows it.
export function crown(g, hx, hy, r, o = {}) {
  const { heavy = 0, color = GOLD, a = 1, tilt = 0 } = o; const s = r / 26 * (1 + heavy * 0.9);
  g.save(); g.globalAlpha *= a; g.translate(hx, hy - r * 0.78); g.rotate(tilt); g.scale(s, s);
  poly(g, [[-22, 0], [22, 0], [26, -16], [14, -8], [8, -26], [0, -12], [-8, -26], [-14, -8], [-26, -16]], color);
  rr(g, -24, -4, 48, 8, 3); g.fillStyle = '#8a6a2a'; g.fill();
  circle(g, 0, -14, 4.2, RED); circle(g, 0, -14, 1.6, '#ffb0a0');
  g.restore(); glow(g, hx, hy - r, r * 1.6, color, 0.18 * a);
}
export function lantern(g, x, y, s = 1, t = 0, a = 1) {
  const sw = Math.sin(t * 1.3 + x) * 0.05; g.save(); g.translate(x, y); g.rotate(sw); g.scale(s, s);
  seg(g, [[0, -120], [0, -38]], 3, '#2a1a10');
  g.fillStyle = linGrad(g, -34, 0, 34, 0, ['#5a0e0e', '#d0402a', '#5a0e0e']); g.beginPath(); g.ellipse(0, 0, 36, 42, 0, 0, Math.PI * 2); g.fill();
  rr(g, -20, -46, 40, 10, 3); g.fillStyle = GOLD; g.fill(); rr(g, -20, 36, 40, 10, 3); g.fill();
  seg(g, [[0, 46], [0, 80]], 4, GOLD); g.restore(); glow(g, x, y, 140 * s, '#ff8a3a', 0.35 * a);
}
// throne hall. o: {dim 0..1, gold 0..1 (saturation of luxury), throne, banners}
export function hall(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), dim = o.dim || 0, GY = E.H * 0.6;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, M.sky); g.fillRect(0, 0, E.W, E.H);
  layer(g, cam, 0.3, (g) => { // far back wall + throne dais
    g.fillStyle = M.wall; g.fillRect(-200, E.H * 0.18, E.W + 400, GY - E.H * 0.18);
    for (let i = 0; i < 7; i++) { const x = E.W / 2 + (i - 3) * 190; rr(g, x - 60, E.H * 0.24, 120, 260, 6); g.fillStyle = alpha('#000', 0.25); g.fill(); seg(g, [[x - 60, E.H * 0.24 + 130], [x + 60, E.H * 0.24 + 130]], 3, alpha(GOLD, 0.25)); }
    if (o.throne !== false) throne(g, E.W / 2, GY - 120, 1.3, M);
    if (o.banners !== false) for (const sx of [-1, 1]) { const x = E.W / 2 + sx * 300; g.fillStyle = LAC; g.fillRect(x - 45, E.H * 0.17, 90, 420); circle(g, x, E.H * 0.17 + 120, 30, alpha(GOLD, 0.7)); }
  });
  layer(g, cam, 0.6, (g) => { // floor
    g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [M.floor, M.dark]); g.fillRect(-300, GY - 30, E.W + 600, E.H);
    FX.floorLines(g, GY - 30, E.H + 200, alpha(GOLD, 0.08));
    rr(g, E.W / 2 - 120, GY - 30, 240, E.H, 0); g.fillStyle = alpha(RED, 0.55); g.fill(); // red carpet
  });
  layer(g, cam, 1.25, (g) => { // red lacquer pillars + lanterns (foreground parallax)
    for (const sx of [-1, 1]) { const x = E.W / 2 + sx * V(800, 470); g.fillStyle = linGrad(g, x - 70, 0, x + 70, 0, ['#3a0808', '#8a1a14', '#2a0606']); g.fillRect(x - 70, -200, 140, E.H + 400);
      seg(g, [[x - 70, E.H * 0.12], [x + 70, E.H * 0.12]], 10, alpha(GOLD, 0.6)); lantern(g, x - sx * 170, E.H * 0.2, 1.1, t, 1 - dim); }
  });
  FX.dust(g, t, { count: 40, color: GOLD, a: 0.35 * (1 - dim) });
  if (dim) { g.fillStyle = alpha('#000', dim * 0.7); g.fillRect(0, 0, E.W, E.H); }
  return { GY, M };
}
export function throne(g, x, y, s = 1, M) { s *= 0.75;
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -150, -40, 300, 160, 8); g.fillStyle = '#2a1a0e'; g.fill();
  rr(g, -110, -250, 220, 230, 30); g.fillStyle = linGrad(g, 0, -250, 0, 0, ['#e8c36a', '#8a6420']); g.fill();
  circle(g, 0, -170, 44, RED); circle(g, 0, -170, 30, alpha(GOLD, 0.8));
  rr(g, -140, -60, 280, 40, 10); g.fillStyle = '#b08a3a'; g.fill(); g.restore();
  glow(g, x, y - 150 * s, 300 * s, '#ffcf6a', 0.25);
}
// classroom: low desk, scrolls, cold blue-grey light
export function classroom(g, t, cam) {
  const GY = E.H * 0.6; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#14181e', '#222830', '#101318']); g.fillRect(0, 0, E.W, E.H);
  layer(g, cam, 0.4, (g) => { for (let i = 0; i < 4; i++) { const x = 140 + i * 240; g.fillStyle = alpha(PAPER, 0.15); g.fillRect(x, E.H * 0.2, 150, 360); for (let k = 0; k < 9; k++) seg(g, [[x + 20 + k * 14, E.H * 0.23], [x + 20 + k * 14, E.H * 0.2 + 330]], 3, alpha('#000', 0.35)); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#0c0e12'; g.fillRect(-200, GY, E.W + 400, E.H); });
  FX.lightCone(g, E.W * 0.8, -50, { angle: Math.PI * 0.62, spread: 0.3, len: 1500, color: '#a8c0d8', a: 0.12 });
  return { GY };
}
export function garden(g, t, cam, warm = 1) {
  const GY = E.H * 0.6; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#3a2a1a', '#c08a4a', '#f0d49a']); g.fillRect(0, 0, E.W, E.H);
  FX.sun(g, E.W * 0.7, E.H * 0.3, 70, '#fff2d0', '#ffcf7a');
  layer(g, cam, 0.5, (g) => { FX.hills(g, { y: E.H * 0.62, color: '#5a5a3a' }); for (let i = 0; i < 4; i++) FX.tree(g, 120 + i * 300, GY, 1.6, '#3a3020'); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#4a5a30'; g.fillRect(-200, GY, E.W + 400, E.H); });
  FX.dust(g, t, { count: 30, color: '#fff2c0', a: 0.4 * warm });
  return { GY };
}
export function bedroom(g, t, cam) {
  const GY = E.H * 0.6; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#05060a', '#0e0e16', '#0a0808']); g.fillRect(0, 0, E.W, E.H);
  layer(g, cam, 0.4, (g) => { // round moon window with lattice
    const cx = E.W * 0.72, cy = E.H * 0.33, r = 190; circle(g, cx, cy, r, '#1a2236'); FX.moon(g, cx + 30, cy - 20, 60, '#d8dcef');
    g.strokeStyle = '#05060a'; g.lineWidth = 10; for (let k = -2; k <= 2; k++) { seg(g, [[cx + k * 70, cy - r], [cx + k * 70, cy + r]], 10, '#05060a'); seg(g, [[cx - r, cy + k * 70], [cx + r, cy + k * 70]], 10, '#05060a'); }
    g.lineWidth = 26; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke(); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#08070a'; g.fillRect(-200, GY, E.W + 400, E.H); });
  FX.lightCone(g, E.W * 0.72, E.H * 0.33, { angle: Math.PI * 0.72, spread: 0.25, len: 1200, color: '#a8b8e8', a: 0.1 });
  return { GY };
}
// aged scroll unrolling (k 0..1); fn draws content in local coords (w,h)
export function scroll(g, cx, cy, w, h, k, fn) {
  const ww = w * ease.inOut(k); g.save();
  rr(g, cx - ww / 2, cy - h / 2, ww, h, 6); g.fillStyle = PAPER; g.fill(); g.clip();
  g.fillStyle = alpha('#8a6a3a', 0.15); for (let i = 0; i < 40; i++) g.fillRect(cx - w / 2 + (i * 97) % w, cy - h / 2 + (i * 53) % h, 3, 3);
  if (fn) { g.translate(cx - w / 2, cy - h / 2); fn(g, w, h); } g.restore();
  for (const sx of [-1, 1]) { rr(g, cx + sx * ww / 2 - 18, cy - h / 2 - 30, 36, h + 60, 14); g.fillStyle = '#4a2a14'; g.fill(); rr(g, cx + sx * ww / 2 - 22, cy - h / 2 - 40, 44, 18, 6); g.fillStyle = GOLD; g.fill(); rr(g, cx + sx * ww / 2 - 22, cy + h / 2 + 22, 44, 18, 6); g.fill(); }
}
export function mask(g, x, y, r, o = {}) { // smiling noble mask, optional crack
  const { crack = 0, a = 1 } = o; g.save(); g.globalAlpha *= a; g.fillStyle = PAPER; g.beginPath(); g.ellipse(x, y, r * 0.8, r, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = INK; g.lineWidth = r * 0.07; g.lineCap = 'round';
  for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * r * 0.32, y - r * 0.15, r * 0.16, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); circle(g, x + s * r * 0.45, y + r * 0.2, r * 0.12, alpha(RED, 0.5)); }
  g.beginPath(); g.arc(x, y + r * 0.2, r * 0.38, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  if (crack > 0) { g.strokeStyle = RED; g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(x + r * 0.1, y - r); const n = 6; for (let i = 1; i <= n * crack; i++) g.lineTo(x + (i % 2 ? -1 : 1) * r * 0.14, y - r + i * (2 * r / n)); g.stroke(); }
  g.restore();
}
export function eyes(g, t, n, o = {}) { // glowing eyes in the dark
  const R = rng(o.seed || 3); for (let i = 0; i < n; i++) { const x = R() * E.W, y = E.H * 0.1 + R() * E.H * 0.55, b = (Math.sin(t * 2 + i * 1.7) > 0.95) ? 0.1 : 1, k = clamp((t - i * 0.15) * 2);
    for (const s of [-1, 1]) { g.fillStyle = alpha(o.color || '#f3e9d2', 0.85 * k); g.beginPath(); g.ellipse(x + s * 22, y, 14, 5 * b, 0, 0, Math.PI * 2); g.fill(); } glow(g, x, y, 60, o.color || GOLD, 0.15 * k); }
}
export function bowl(g, x, y, s = 1, poison = 0, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#e9e2d0'; g.beginPath(); g.ellipse(0, 0, 80, 16, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-80, 0); g.quadraticCurveTo(0, 90, 80, 0); g.fill(); seg(g, [[-70, 20], [70, 20]], 6, alpha('#2a4a8a', 0.6));
  g.fillStyle = poison ? JADE : '#c8a46a'; g.beginPath(); g.ellipse(0, 0, 70, 11, 0, 0, Math.PI * 2); g.fill(); g.restore();
  if (poison) { glow(g, x, y, 200 * s, '#6aff9a', 0.3 * poison); for (let i = 0; i < 4; i++) { const yy = y - ((t * 60 + i * 50) % 200) * s; circle(g, x + Math.sin(t * 2 + i) * 30 * s, yy, 8 * s, alpha('#8affb0', 0.35 * poison * (1 - (y - yy) / (200 * s)))); } }
}
export function dagger(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  poly(g, [[0, -10], [180, 0], [0, 10]], '#d8dce4'); seg(g, [[0, -24], [0, 24]], 10, GOLD); seg(g, [[-70, 0], [0, 0]], 16, '#3a1a0a'); circle(g, -76, 0, 10, RED); g.restore(); }
export function chains(g, x, y, len, t, a = 1) { g.save(); g.globalAlpha *= a; for (let i = 0; i < len; i++) { const yy = y + i * 40; g.strokeStyle = GOLD; g.lineWidth = 9; g.beginPath(); if (i % 2) g.ellipse(x, yy, 7, 22, 0, 0, Math.PI * 2); else g.ellipse(x, yy, 20, 24, 0, 0, Math.PI * 2); g.stroke(); } g.restore(); }
export function ageTag(g, n, a = 1) { // big gold age number, top-left (safe zone)
  text(g, 'AGE', V(120, 110), V(160, 300), { size: 44, color: PAPER, font: FONTS.imperial, weight: 900, align: 'left', alpha: a, spacing: 6 });
  text(g, String(n), V(120, 110), V(260, 420), { size: 190, color: GOLD, font: FONTS.imperial, weight: 900, align: 'left', alpha: a, glow: 30, glowColor: alpha(GOLD, 0.6) });
}
export function brand(g, a = 0.55) { text(g, 'STICK.TALES', V(E.W - 90, 110), V(110, 230), { size: 30, color: PAPER, font: FONTS.imperial, weight: 900, align: 'left', alpha: a, spacing: 5 }); }
