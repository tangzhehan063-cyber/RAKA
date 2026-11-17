// 01_kamar.js — "Keranjang Kosong": kamar Dewi (meja, kursi, laptop, jam dinding) + layar marketplace.
import { E, V, S, registerShot, layer, blurLayer, veil, mood, backdrop, ease, prog, clamp, lerp, wordTime, alpha, shade, glow, rr, seg, circle, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { DEWI, TEMAN2, KERANJANG } from '../cast.js';

export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
export const rnd = (i, seed = 1) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
const GY = () => E.H * V(0.8, 0.68);
const TYPE = { ...POSES.sit, head: [10, -178], sh: [4, -146], eF: [34, -112], hF: [66, -118], eB: [28, -110], hB: [60, -114] };
const SLUMP = { ...POSES.sit, head: [22, -160], sh: [14, -130], eF: [30, -100], hF: [60, -96], eB: [24, -100], hB: [54, -100] };
const CHEER = { ...POSES.sit, head: [6, -184], sh: [2, -150], eF: [36, -196], hF: [44, -250], eB: [-26, -194], hB: [-30, -250] };

// ---- ikon & benda ---------------------------------------------------------------------------------------
export function cart(g, x, y, s = 1, n = 0, o = {}) {   // ikon keranjang belanja merah-oranye (maskot); n = isi
  g.save(); g.translate(x, y); g.scale(s, s); if (o.a != null) g.globalAlpha *= o.a;
  seg(g, [[-60, -50], [-40, -50], [-24, 22], [46, 22]], 9, KERANJANG);
  g.beginPath(); g.moveTo(-36, -30); g.lineTo(62, -30); g.lineTo(46, 8); g.lineTo(-26, 8); g.closePath(); g.fillStyle = alpha(KERANJANG, 0.22); g.fill(); g.strokeStyle = KERANJANG; g.lineWidth = 8; g.lineJoin = 'round'; g.stroke();
  circle(g, -12, 44, 10, KERANJANG); circle(g, 38, 44, 10, KERANJANG);
  if (n > 0) { circle(g, 52, -42, 24, '#fff'); circle(g, 52, -42, 20, '#2f8a57'); text(g, String(n), 52, -42, { size: 28, color: '#fff', font: FONTS.ui, weight: 900 }); }
  g.restore();
}
const PAL = ['#f4c6c6', '#f2dca6', '#cfe4d2', '#c9d8ee', '#e2cdea', '#f6e0c8', '#d6e6e2', '#f0d0dc'];
export function produk(g, x, y, s, seed) {   // pelembap/serum: toples, tube, atau botol pump (digambar mirip aslinya)
  const c = PAL[seed % PAL.length], k = seed % 3; g.save(); g.translate(x, y); g.scale(s, s);
  if (k === 0) { rr(g, -44, -30, 88, 58, 12); g.fillStyle = shade(c, -0.04); g.fill(); rr(g, -48, -52, 96, 26, 10); g.fillStyle = '#fffdf8'; g.fill(); g.strokeStyle = shade(c, -0.25); g.lineWidth = 3; g.stroke(); seg(g, [[-24, -2], [24, -2]], 5, '#fffdf8'); seg(g, [[-16, 12], [16, 12]], 4, alpha('#fffdf8', 0.8)); }
  else if (k === 1) { g.beginPath(); g.moveTo(-26, -58); g.lineTo(26, -58); g.lineTo(34, 40); g.lineTo(-34, 40); g.closePath(); g.fillStyle = shade(c, -0.04); g.fill(); rr(g, -22, -76, 44, 22, 6); g.fillStyle = '#fffdf8'; g.fill(); g.strokeStyle = shade(c, -0.25); g.lineWidth = 3; g.stroke(); seg(g, [[-16, -20], [16, -20]], 5, '#fffdf8'); seg(g, [[-12, -6], [12, -6]], 4, alpha('#fffdf8', 0.8)); }
  else { rr(g, -28, -50, 56, 92, 14); g.fillStyle = shade(c, -0.04); g.fill(); rr(g, -8, -72, 16, 24, 4); g.fillStyle = '#fffdf8'; g.fill(); rr(g, -8, -82, 34, 12, 5); g.fill(); g.strokeStyle = shade(c, -0.25); g.lineWidth = 3; g.stroke(); rr(g, -18, -24, 36, 40, 8); g.fillStyle = '#fffdf8'; g.fill(); seg(g, [[-10, -10], [10, -10]], 4, shade(c, -0.15)); seg(g, [[-8, 2], [8, 2]], 3, shade(c, -0.15)); }
  g.restore();
}
export function kartu(g, x, y, w, h, seed, o = {}) {   // kartu produk marketplace
  rr(g, x - w / 2, y - h / 2, w, h, 20); g.fillStyle = '#fffdf8'; g.fill(); g.strokeStyle = o.line || 'rgba(43,47,58,.14)'; g.lineWidth = o.lw || 3; g.stroke();
  produk(g, x, y - h * 0.12, Math.min(w, h) / 200 * 1.1, seed);
  text(g, `Rp ${49 + (seed * 37) % 160}rb`, x, y + h * 0.3, { size: Math.round(w * 0.11), color: '#2b2f3a', font: FONTS.ui, weight: 900 });
  const st = 3 + (seed % 3); text(g, '★'.repeat(st) + '☆'.repeat(5 - st), x, y + h * 0.4, { size: Math.round(w * 0.09), color: '#e0a23a', font: FONTS.ui, weight: 900 });
}
// layar laptop penuh (untuk adegan UI): draw(g, ui) menggambar di area layar (x 90..990, y 230..1210)
export function layar(g, draw, o = {}) {
  g.fillStyle = '#ece5d6'; g.fillRect(0, 0, E.W, E.H);
  rr(g, 60, 190, 960, 1060, 44); g.fillStyle = '#2b2f3a'; g.fill();
  g.save(); rr(g, 90, 222, 900, 996, 18); g.clip(); g.fillStyle = '#f6f2ea'; g.fillRect(90, 222, 900, 996); draw(g); g.restore();
  g.beginPath(); g.moveTo(20, 1262); g.lineTo(1060, 1262); g.lineTo(1000, 1296); g.lineTo(80, 1296); g.closePath(); g.fillStyle = '#c9c2b4'; g.fill();
  if (o.cart != null) cart(g, 860, 190, 0.6, o.cart);
}
export const clockStr = (h) => `${String(h).padStart(2, '0')}:00`;

// ---- set kamar ---------------------------------------------------------------------------------------------
const CAMD = (z, fx = 520, fy = 1130, sx = 540, sy = 1100) => { const zz = 1 + (z - 1) * 0.85; return { z, x: (fx - 540 - (sx - 540) / zz) / 0.85, y: (fy - 960 - (sy - 960) / zz) / 0.85 }; };
export { CAMD };
export function kamar(g, t, cam, o = {}) {
  const md = o.mood || 'day', M = mood(md), G = GY(), CX = E.W / 2, wall = shade(M.wall, 0.04);
  const wx = CX - 380, wy = G - 1010, ww = 470, wh = 480;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.04), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(wall, -0.22), bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(shade(M.sky[0], -0.12), 0.55), windowColor: alpha(M.practical, 0.35), lit: 0.1, seed: 5 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, M.key, 0.2);
    // jam dinding analog
    const cx = CX + 250, cy = G - 640, hr = (o.hour ?? 20) % 12;
    circle(g, cx, cy, 78, '#fffdf8'); g.strokeStyle = '#8a8276'; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, 78, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.sin(a) * 64, cy - Math.cos(a) * 64], [cx + Math.sin(a) * 72, cy - Math.cos(a) * 72]], 4, '#8a8276'); }
    const ah = hr / 12 * Math.PI * 2; seg(g, [[cx, cy], [cx + Math.sin(ah) * 38, cy - Math.cos(ah) * 38]], 8, '#2b2f3a'); seg(g, [[cx, cy], [cx, cy - 58]], 5, '#2b2f3a');
    if (o.wall) o.wall(g, G);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.06), shade(M.floor, -0.1)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, wx + ww * 0.6, G + 60, ww * 0.7, 60, M.key, 0.2);
    const tx = CX + 90, top = G - 150, tw = 560;
    rr(g, tx - tw / 2, top, tw, 20, 8); g.fillStyle = '#d9b88e'; g.fill();
    seg(g, [[tx - tw / 2 + 26, top + 14], [tx - tw / 2 + 26, G]], 12, '#b8966c'); seg(g, [[tx + tw / 2 - 26, top + 14], [tx + tw / 2 - 26, G]], 12, '#b8966c');
    const bx = CX - 210;
    seg(g, [[bx - 40, G - 86], [bx + 34, G - 86]], 12, '#a9a6b6'); seg(g, [[bx - 36, G - 86], [bx - 42, G - 200]], 10, '#a9a6b6');
    seg(g, [[bx - 30, G - 80], [bx - 34, G]], 7, '#a9a6b6'); seg(g, [[bx + 28, G - 80], [bx + 32, G]], 7, '#a9a6b6');
    if (o.dewi !== false) { const r = o.dewi || {}; drawFigure(g, { x: bx, y: G, s: 1.25, facing: 1, outfit: DEWI, pose: r.pose || breathe(TYPE, t, 0.5, 3), expr: r.expr || 'neutral', look: r.look || [0.9, 0.1], blink: (t % 3.4) > 3.27, rim: { color: M.key, dir: [1, -0.2], w: 3 } }); }
    if (o.teman) { const d = o.teman; drawFigure(g, { x: d.x, y: G, s: 1.25, facing: -1, outfit: TEMAN2, pose: d.pose || breathe(POSES.stand, t, 0.5, 7), expr: d.expr || 'smile', look: [-0.9, 0], blink: (t % 3.9) > 3.8, rim: { color: M.key, dir: [-1, -0.2], w: 3 } }); }
    // laptop menghadap penonton (seperti video #9): alas trapesium + layar
    const lx = tx - 70, w = 200, h = 136, sc = o.screenColor || '#cfe6ff';
    g.beginPath(); g.moveTo(lx - w / 2 - 14, top); g.lineTo(lx + w / 2 + 14, top); g.lineTo(lx + w / 2, top - 10); g.lineTo(lx - w / 2, top - 10); g.closePath(); g.fillStyle = '#4a4f5e'; g.fill();
    rr(g, lx - w / 2, top - 10 - h, w, h, 8); g.fillStyle = '#4a4f5e'; g.fill();
    rr(g, lx - w / 2 + 8, top - 2 - h, w - 16, h - 16, 4); g.fillStyle = alpha(sc, o.screen ?? 0.95); g.fill();
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { rr(g, lx - w / 2 + 18 + c * 42, top - h + 8 + r * 50, 34, 42, 5); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill(); rr(g, lx - w / 2 + 25 + c * 42, top - h + 18 + r * 50, 20, 20, 4); g.fillStyle = PAL[(c + r * 4) % PAL.length]; g.fill(); }
    glow(g, lx, top - 10 - h / 2, 220, sc, 0.14);
    if (o.items) o.items(g, top, tx);
  });
  return { G, top: G - 150, tx: CX + 90, bx: CX - 210, M };
}
export function hudCart(g, n = 0, a = 1) {   // penghitung keranjang di pojok kanan atas (posisi badge baku, aman dari UI TikTok)
  const x = E.W - 190, y = 292; g.save(); g.globalAlpha *= a;
  rr(g, x - 130, y - 52, 260, 104, 52); g.fillStyle = 'rgba(255,253,248,.9)'; g.fill(); g.strokeStyle = 'rgba(43,47,58,.14)'; g.lineWidth = 3; g.stroke();
  cart(g, x - 62, y + 2, 0.62, 0); text(g, String(n), x + 58, y + 4, { size: 70, color: n > 0 ? '#2f8a57' : KERANJANG, font: FONTS.ui, weight: 900 }); g.restore();
}
export const hud = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a, color: '#8a4f0c' });

// ---- shot kamar ---------------------------------------------------------------------------------------------
const kc = (o = {}) => undefined;   // keranjang kini HUD pojok kanan atas (hudCart)
// s01 0–2.4: Dewi mau beli satu pelembap
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kamar(g, t, CAMD(lerp(1.5, 1.7, k)), { mood: 'dusk', hour: 20, dewi: { expr: 'smile', pose: TYPE } });
  FX.dust(g, t, { count: 10, color: '#fff2d0', a: 0.1 }); hudCart(g, 0, ease.out(prog(t, 0.4, 0.8)));
} });
// s07 20.5–23.9: jam 11, keranjang masih kosong
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kamar(g, t, CAMD(lerp(1.7, 1.9, k)), { mood: 'interiorCool', hour: 23, dewi: { pose: SLUMP, expr: 'sad', look: [0.5, 0.4] }, screenColor: '#9fb4e8' });
  hudCart(g, 0, 1);
} });
// s08 23.9–29.3: wajah besar, "kenapa susah milih?"
registerShot('s08', { draw(g, t, info) {
  const tq = rel('kenapa', info, 2.6), cx = E.W / 2 - 20, cy = 800, r = 270;
  blurLayer(g, 12, (g) => kamar(g, t, { z: 2.0, x: 120, y: 250 }, { mood: 'interiorCool', hour: 23, dewi: false }), null, 1);
  veil(g, '#e8e0f0', 0.28);
  bigFace(g, cx, cy, r, { outfit: DEWI, expr: t > tq ? 'confused' : 'sad', blink: (t % 3.2) > 3.08, look: [0.3, 0.5], rimColor: '#9fb4e8', rimSide: 1, tilt: 0.05 });
  for (let i = 0; i < 4; i++) { const a = ease.outBack(prog(t, tq + i * 0.25, tq + i * 0.25 + 0.3)); if (a > 0) { g.save(); g.translate(cx + 330 - i * 170, cy - 330 - (i % 2) * 90); g.scale(a, a); text(g, '?', 0, 0, { size: 130 - i * 14, color: '#ff8a78', font: FONTS.ui, weight: 900 }); g.restore(); } }
} });
// s14 57.5–60.0: pagi, lega ("wajar")
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kamar(g, t, CAMD(lerp(1.7, 1.9, k)), { mood: 'golden', hour: 9, dewi: { pose: posesAt(t, [[0, SLUMP], [0.8, TYPE]], 0.5), expr: 'smile' } });
  FX.dust(g, t, { count: 14, color: '#ffe9b0', a: 0.18 }); hud(g, 'WAJAR', ease.out(prog(t, 0.5, 0.9)));
} });
// s17 67.0–70.6: paket sampai, pelembap dipakai
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tp = rel('sampai', info, 0.8), td = rel('dipakai', info, 2.6);
  kamar(g, t, CAMD(lerp(1.6, 1.8, k), 520, 1130, 540, 1100), { mood: 'golden', hour: 11, dewi: { pose: posesAt(t, [[0, TYPE], [td - 0.3, { ...POSES.sit, head: [14, -178], sh: [6, -146], eF: [40, -160], hF: [34, -200], eB: [28, -110], hB: [60, -114] }]], 0.4), expr: t > td ? 'joy' : 'smile' },
    items: (g, top, tx) => {
      const a = ease.outBack(prog(t, tp - 0.3, tp + 0.2)); if (a > 0) { g.save(); g.translate(tx + 100, top); g.scale(a, a); rr(g, -50, -64, 100, 64, 6); g.fillStyle = '#c79a66'; g.fill(); rr(g, -50, -64, 100, 14, 4); g.fillStyle = '#dcb584'; g.fill(); seg(g, [[0, -64], [0, 0]], 8, '#efe3c4'); g.restore(); }
      if (t > tp + 0.7) produk(g, tx + 20, top - 4, 0.62 * ease.outBack(prog(t, tp + 0.7, tp + 1.0)), 0); } });
  FX.dust(g, t, { count: 12, color: '#ffe9b0', a: 0.18 }); hudCart(g, 1, 1);
} });
// s18 70.6–73.2: kamar sebelah, bingkai sama s01
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kamar(g, t, CAMD(lerp(1.5, 1.7, k)), { mood: 'dusk', hour: 20, dewi: { expr: 'smile', pose: TYPE } });
  FX.dust(g, t, { count: 10, color: '#fff2d0', a: 0.1 }); hudCart(g, 0, 1);
} });
