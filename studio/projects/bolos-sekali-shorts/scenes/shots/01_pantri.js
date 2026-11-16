// 01_pantri.js — "Bolos Sekali": pantri kantor. Rani duduk kiri meja, kotak bekal merah-oranye (maskot) di meja.
import { E, V, S, registerShot, layer, blurLayer, veil, mood, backdrop, ease, prog, clamp, lerp, wordTime, alpha, shade, glow, rr, seg, circle, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { RANI, DITO, BEKAL } from '../cast.js';

export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const badge = (g, str, a = 1, color) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a, color });
const GY = () => E.H * V(0.8, 0.68);
const TYPE = { ...POSES.sit, head: [10, -178], sh: [4, -146], eF: [34, -112], hF: [66, -118], eB: [28, -110], hB: [60, -114] };
const REACH = { ...POSES.sit, head: [12, -180], sh: [6, -146], eF: [48, -150], hF: [80, -168], eB: [28, -110], hB: [60, -114] };
const EAT = { ...POSES.sit, head: [14, -178], sh: [6, -146], eF: [40, -160], hF: [34, -200], eB: [28, -110], hB: [60, -114] };
const CHEER = { ...POSES.sit, head: [6, -184], sh: [2, -150], eF: [36, -196], hF: [44, -250], eB: [-26, -194], hB: [-30, -250] };

// ---- benda ------------------------------------------------------------------------------------------
// kotak bekal: x tengah, y permukaan meja. open 0..1 (tutup terangkat), dust 0..1
export function kotak(g, x, y, s = 1, o = {}) {
  const open = o.open || 0, w = 190 * s, h = 96 * s, col = o.color || BEKAL;
  g.save(); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x, y + 2, w * 0.58, 10 * s, 0, 0, Math.PI * 2); g.fill(); g.restore();
  rr(g, x - w / 2, y - h, w, h, 14 * s); g.fillStyle = shade(col, -0.18); g.fill();
  if (open > 0.05) {   // isi: sayur + ayam
    rr(g, x - w / 2 + 10 * s, y - h + 6 * s, w - 20 * s, h * 0.5, 10 * s); g.fillStyle = '#f4ead6'; g.fill();
    for (let i = 0; i < 6; i++) circle(g, x - w / 2 + (30 + i * 26) * s, y - h + (26 + (i % 2) * 6) * s, 12 * s, i % 3 === 2 ? '#7db36a' : '#5c9a52');
    g.save(); g.translate(x + 30 * s, y - h + 28 * s); g.rotate(-0.3); rr(g, -36 * s, -14 * s, 72 * s, 28 * s, 14 * s); g.fillStyle = '#c98a4a'; g.fill(); g.restore();
  }
  g.save(); g.translate(x - w / 2 - 6 * s - open * 20 * s, y - h - 4 * s - open * 64 * s); g.rotate(-open * 0.18);
  rr(g, 0, -22 * s, w + 12 * s, 26 * s, 12 * s); g.fillStyle = col; g.fill();
  rr(g, w / 2 - 16 * s, -12 * s, 44 * s, 10 * s, 5 * s); g.fillStyle = shade(col, 0.35); g.fill(); g.restore();
  if (o.dust) { g.save(); g.globalAlpha *= 0.55 * o.dust; rr(g, x - w / 2, y - h - 20 * s, w, h + 20 * s, 14 * s); g.fillStyle = '#d8d2c6'; g.fill(); g.restore(); }
}
export function gorengan(g, x, y, s = 1, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.beginPath(); g.ellipse(0, 0, 34, 20, 0, 0, Math.PI * 2); g.fillStyle = '#e0a23a'; g.fill();
  g.beginPath(); g.ellipse(-6, -5, 20, 9, 0, 0, Math.PI * 2); g.fillStyle = '#f0c05a'; g.fill();
  circle(g, 12, 3, 5, '#c07a22'); circle(g, -14, 6, 4, '#c07a22'); g.restore();
}
export function boxGorengan(g, x, y, s = 1, n = 6) {
  g.save(); g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.ellipse(x, y + 2, 120 * s, 10 * s, 0, 0, Math.PI * 2); g.fill(); g.restore();
  for (let i = 0; i < n; i++) gorengan(g, x - 70 * s + (i % 3) * 70 * s, y - 36 * s - Math.floor(i / 3) * 26 * s, s, ((i * 37) % 9 - 4) / 18);
  rr(g, x - 110 * s, y - 54 * s, 220 * s, 54 * s, 8 * s); g.fillStyle = '#b98a58'; g.fill();
  rr(g, x - 110 * s, y - 54 * s, 220 * s, 12 * s, 6 * s); g.fillStyle = '#d0a672'; g.fill();
}
export function bungkus(g, x, y, n, s = 1) {   // gumpalan kertas minyak
  for (let i = 0; i < n; i++) { const k = ease.outBack(clamp(n - i)); if (k <= 0) continue; const px = x + ((i * 53) % 150 - 75) * s, py = y - ((i * 31) % 70) * s - 14 * s;
    circle(g, px, py, 24 * s * k, '#e9d9b8'); circle(g, px - 6 * s, py - 6 * s, 12 * s * k, '#f6ecd4'); seg(g, [[px - 14 * s, py + 4 * s], [px + 12 * s, py - 6 * s]], 3 * s, alpha('#9a8460', 0.7)); }
}
export function geprek(g, x, y, s = 1) {
  rr(g, x - 100 * s, y - 70 * s, 200 * s, 70 * s, 12 * s); g.fillStyle = '#f7f4ee'; g.fill();
  g.beginPath(); g.ellipse(x - 30 * s, y - 52 * s, 50 * s, 20 * s, 0, 0, Math.PI * 2); g.fillStyle = '#fffdf6'; g.fill();
  g.save(); g.translate(x + 42 * s, y - 50 * s); g.rotate(0.15); rr(g, -48 * s, -18 * s, 96 * s, 36 * s, 16 * s); g.fillStyle = '#c4812f'; g.fill(); g.restore();
  circle(g, x + 70 * s, y - 62 * s, 9 * s, '#b83a2a');
}
// deret kotak kecil penghitung hari; broken = kotak ke-7 retak
export function dayRow(g, x, y, n, o = {}) {
  const w = 54, gap = 14, tot = n * w + (n - 1) * gap;
  for (let i = 0; i < Math.ceil(n); i++) { const k = ease.outBack(clamp(n - i)); if (k <= 0) continue; const bx = x - tot / 2 + i * (w + gap), brk = o.broken && i === 6;
    g.save(); g.translate(bx + w / 2, y); g.scale(k, k); rr(g, -w / 2, -22, w, 44, 8); g.fillStyle = brk ? '#9a9aa4' : BEKAL; g.fill(); rr(g, -w / 2, -26, w, 12, 5); g.fillStyle = brk ? '#b6b6c0' : shade(BEKAL, 0.3); g.fill();
    if (brk) seg(g, [[-6, -26], [4, -8], [-4, 4], [6, 22]], 4, '#3a3a44');
    g.restore(); }
  if (o.label) text(g, o.label, x, y - 56, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: o.la ?? 1 });
}

// ---- set pantri ---------------------------------------------------------------------------------------
// o { mood, rani:{pose,expr,look}|false, dito:{x,pose}|false, items:fn(g,top,tx), who:'rani'|'dito' }
const CAMD = (z, fx = 520, fy = 1180, sx = 540, sy = 1100) => { const zz = 1 + (z - 1) * 0.85; return { z, x: (fx - 540 - (sx - 540) / zz) / 0.85, y: (fy - 960 - (sy - 960) / zz) / 0.85 }; };
export function pantri(g, t, cam, o = {}) {
  const md = o.mood || 'day', M = mood(md), G = GY(), CX = E.W / 2, wall = shade(M.wall, -0.1);
  const wx = CX - 380, wy = G - 1010, ww = 470, wh = 480;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.15), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(wall, -0.4), bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(shade(wall, -0.5), 0.85), windowColor: alpha(M.practical, 0.4), lit: 0.1, seed: 11 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, M.key, 0.2);
    if (o.wall) o.wall(g, G);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, -0.05), shade(M.dark, -0.15)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, wx + ww * 0.6, G + 60, ww * 0.7, 60, M.key, 0.2);
    const tx = CX + 90, top = G - 150, tw = 560;   // meja
    rr(g, tx - tw / 2, top, tw, 20, 8); g.fillStyle = shade(wall, -0.35); g.fill();
    seg(g, [[tx - tw / 2 + 26, top + 14], [tx - tw / 2 + 26, G]], 12, shade(wall, -0.5)); seg(g, [[tx + tw / 2 - 26, top + 14], [tx + tw / 2 - 26, G]], 12, shade(wall, -0.5));
    const bx = CX - 210;   // kursi Rani
    seg(g, [[bx - 40, G - 86], [bx + 34, G - 86]], 12, shade(wall, -0.55)); seg(g, [[bx - 36, G - 86], [bx - 42, G - 200]], 10, shade(wall, -0.55));
    seg(g, [[bx - 30, G - 80], [bx - 34, G]], 7, shade(wall, -0.55)); seg(g, [[bx + 28, G - 80], [bx + 32, G]], 7, shade(wall, -0.55));
    if (o.rani !== false) { const r = o.rani || {}; drawFigure(g, { x: bx, y: G, s: 1.25, facing: 1, outfit: RANI, pose: r.pose || breathe(TYPE, t, 0.5, 3), expr: r.expr || 'neutral', look: r.look || [0.9, 0.1], blink: (t % 3.4) > 3.27, rim: { color: M.key, dir: [1, -0.2], w: 3 } }); }
    if (o.dito) { const d = o.dito; drawFigure(g, { x: d.x, y: G, s: 1.25, facing: -1, outfit: DITO, pose: d.pose || breathe(POSES.stand, t, 0.5, 7), expr: d.expr || 'smile', look: [-0.9, 0], blink: (t % 3.9) > 3.8, rim: { color: M.key, dir: [-1, -0.2], w: 3 } }); }
    if (o.items) o.items(g, top, tx);
  });
  return { G, top: G - 150, tx: CX + 90, bx: CX - 210, M };
}

const items = (o = {}) => (g, top, tx) => {
  if (o.kotak !== false) kotak(g, tx - 130 + (o.kx || 0), top, 1, { open: o.open, dust: o.dust });
  if (o.gor) boxGorengan(g, tx + 120, top, 1, o.gor);
  if (o.geprek) { geprek(g, tx + 110, top, 0.8); geprek(g, tx + 190, top - 6, 0.7); }
  if (o.bungkus) bungkus(g, tx + 30, top, o.bungkus);
  if (o.extra) o.extra(g, top, tx);
};
const wallRow = (n, o = {}) => (g, G) => dayRow(g, E.W / 2 + 60, G - 640, n, o);

// s01 0–2.9: enam hari bawa bekal
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.5, 1.7, k));
  pantri(g, t, cam, { mood: 'day', wall: wallRow(clamp(lerp(0, 6, prog(t, 0.5, 2.3)), 0, 6), { label: 'HARI BAWA BEKAL', la: ease.out(prog(t, 0.3, 0.7)) }), items: items({ kotak: true }),
    rani: { pose: posesAt(t, [[0, TYPE], [0.8, TYPE]], 0.4), expr: 'smile' } });
  FX.dust(g, t, { count: 10, color: '#fff2d0', a: 0.1 });
} });
// s02 2.9–6.2: tutup dibuka, sayur dan ayam
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(3.0, 3.4, k), 560, 1090, 540, 1080), to = rel('berisi', info, 1.0);
  pantri(g, t, cam, { mood: 'day', wall: wallRow(6), items: items({ open: ease.out(prog(t, to - 0.3, to + 0.3)) }), rani: { expr: 'happy', pose: posesAt(t, [[0, TYPE], [to - 0.2, REACH], [to + 0.8, TYPE]], 0.4) } });
} });
// s03 6.2–8.8: hari ketujuh, Dito datang membawa gorengan
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.5, 1.65, k)), dx = lerp(1250, 900, ease.out(prog(t, 0.2, 1.5)));
  pantri(g, t, cam, { mood: 'day', wall: wallRow(7, { broken: true }), items: items({ open: 0 }), dito: { x: dx, pose: POSES.stand }, rani: { expr: 'surprised', look: [1, 0] },
    });
  const a = ease.out(prog(t, 0.5, 1.0)); if (a > 0) { g.save(); g.translate(dx - 120, E.H * V(0.8, 0.68) - 150 - 280 * 1.0); g.restore(); }
  FX.dust(g, t, { count: 8, color: '#fff2d0', a: 0.1 });
  badge(g, 'HARI 7', ease.out(prog(t, 0.2, 0.6)), '#c07a22');
} });
// s04 8.8–11.1: ambil satu, enak banget
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.2, 2.5, k), 500, 1130, 540, 1100), te = rel('banget', info, 1.2);
  pantri(g, t, cam, { mood: 'day', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, REACH], [0.5, REACH], [0.9, EAT]], 0.3), expr: t > te - 0.3 ? 'joy' : 'smile', look: [0.7, -0.1] },
    items: (g, top, tx) => { items({ gor: 5 })(g, top, tx); const f = ease.inOut(prog(t, 0.2, 0.9)), x = lerp(tx + 70, 400, f), y = lerp(top - 40, top - 250, f); if (f < 1 || t < 1.6) gorengan(g, x, y, 0.8, -0.3); } });
} });
// s05 11.1–14.7: "ya sudah, sudah gagal" (wajah besar)
registerShot('s05', { draw(g, t, info) {
  const tf = rel('gagal', info, 2.8), cx = E.W / 2 - 20, cy = 800, r = 270;
  blurLayer(g, 10, (g) => pantri(g, t, { z: 2.0, x: 120, y: 250 }, { mood: 'day', rani: false, items: items({ gor: 4 }) }), null, 1);
  veil(g, '#f2e6d0', 0.25);
  bigFace(g, cx, cy, r, { outfit: RANI, expr: t > tf ? 'sad' : 'thinking', blink: (t % 3.2) > 3.08, look: [0.8, 0.3], rimColor: '#ffe6b0', rimSide: 1, tilt: 0.04 });
  const a = ease.outBack(prog(t, tf - 0.1, tf + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 1160); g.rotate(-0.05); g.scale(a, a); text(g, 'SUDAH GAGAL', 0, 0, { size: 120, color: '#e0574a', font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
} });
// s06 14.7–17.4: gorengan kedua, ketiga, keempat; stempel TELANJUR
registerShot('s06', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.9, 2.1, k), 500, 1130, 540, 1100), n = 6 - Math.floor(clamp(t / 0.7) * 3 + 0.001), nb = 1 + prog(t, 0.2, 2.2) * 5;
  pantri(g, t, cam, { mood: 'day', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, EAT], [0.5, REACH], [0.8, EAT], [1.4, REACH], [1.7, EAT]], 0.3), expr: 'joy' }, items: items({ gor: Math.max(1, n), bungkus: nb }) });
  [['KEDUA', 0.2], ['KETIGA', 1.0], ['KEEMPAT', 1.8]].forEach(([w, a0], i) => { const a = ease.outBack(prog(t, a0, a0 + 0.3)); if (a <= 0) return; g.save(); g.translate(E.W / 2 + (i - 1) * 40, 760 + i * 110); g.rotate((i - 1) * 0.07); g.scale(a, a);
    text(g, `GORENGAN ${w}`, 0, 0, { size: 62, color: '#b8321f', font: FONTS.ui, weight: 900, spacing: 2, glow: 8, glowColor: alpha('#fff', 0.5) }); g.restore(); });
} });
// s07 17.4–20.5: sorenya pesan ayam geprek dua porsi
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.7, 1.9, k), 500, 1130, 540, 1100);
  pantri(g, t, cam, { mood: 'dusk', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, TYPE], [1.0, EAT]], 0.4), expr: 'determined' }, items: items({ geprek: 1, bungkus: 6, kx: -60, dust: 0.2 }) });
  const a = ease.outBack(prog(t, 1.0, 1.4)); if (a > 0) { g.save(); g.translate(E.W / 2, 800); g.scale(a, a); text(g, '2 PORSI', 0, 0, { size: 110, color: '#b8321f', font: FONTS.ui, weight: 900, spacing: 4, glow: 12, glowColor: alpha('#fff', 0.4) }); g.restore(); }
} });
// s09 24.5–28.6: "dasar nggak punya tekad"
registerShot('s09', { draw(g, t, info) {
  const tp = rel('tekad', info, 3.2), cx = E.W / 2 - 20, cy = 800, r = 270;
  blurLayer(g, 12, (g) => pantri(g, t, { z: 2.0, x: 120, y: 250 }, { mood: 'dusk', rani: false, items: items({ bungkus: 6, dust: 0.6, kx: -60 }) }), null, 1);
  veil(g, '#2c3250', 0.35);
  bigFace(g, cx, cy, r, { outfit: RANI, expr: 'sad', blink: (t % 3.2) > 3.08, look: [0.2, 0.6], rimColor: '#9fb4e8', rimSide: 1, tilt: 0.05 });
  const a = ease.outBack(prog(t, tp - 0.3, tp + 0.2)); if (a > 0) { g.save(); g.translate(E.W / 2, 1160); g.scale(a, a); text(g, 'NGGAK PUNYA TEKAD?', 0, 0, { size: 84, color: '#ff8a78', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
} });
// s16 47.1–51.6: tekad cukup; stempel TELANJUR membelah
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.8, 2.0, k), 500, 1130, 540, 1100), ts = rel('telanjur', info, 2.3);
  pantri(g, t, cam, { mood: 'golden', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, TYPE], [0.6, POSES.sit]], 0.5), expr: 'smile' }, items: items({ bungkus: 6 }) });
  const a = ease.outBack(prog(t, ts - 0.4, ts)), s = clamp((t - (ts + 1.1)) / 0.8); if (a > 0) { g.save(); g.translate(E.W / 2, 600); g.rotate(-0.1); g.scale(a, a); g.globalAlpha *= 1 - s;
    const ofs = s * 90; g.save(); g.beginPath(); g.rect(-400, -100, 800, 100); g.clip(); g.translate(-ofs, -ofs * 0.4); g.rotate(-s * 0.2);
    text(g, 'SUDAH TELANJUR', 0, 0, { size: 90, color: '#e0574a', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
    g.save(); g.beginPath(); g.rect(-400, 0, 800, 100); g.clip(); g.translate(ofs, ofs * 0.4); g.rotate(s * 0.2); text(g, 'SUDAH TELANJUR', 0, 0, { size: 90, color: '#e0574a', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); g.restore(); }
} });
// s17 51.6–56.8: besoknya, kotak bekal dibuka lagi (pagi emas)
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.0, 2.4, k), 500, 1120, 540, 1090), to = rel('buka', info, 1.0), tm = rel('makan', info, 3.3);
  pantri(g, t, cam, { mood: 'golden', wall: wallRow(7 + ease.out(prog(t, tm, tm + 0.6)), { broken: true }), items: items({ open: ease.out(prog(t, to, to + 0.5)) }),
    rani: { pose: posesAt(t, [[0, TYPE], [to - 0.2, REACH], [to + 0.8, TYPE], [tm, EAT], [tm + 0.6, TYPE]], 0.4), expr: t > tm ? 'happy' : 'determined' } });
  FX.dust(g, t, { count: 14, color: '#ffe9b0', a: 0.18 });
} });
// s18 56.8–60.3: Dito juga enam hari bawa bekal (meja Dito, bingkai sama s01)
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.5, 1.7, k));
  pantri(g, t, cam, { mood: 'day', wall: wallRow(clamp(lerp(0, 6, prog(t, 0.4, 2.4)), 0, 6), { label: 'HARI BAWA BEKAL', la: 1 }), items: items({ kotak: true }), rani: { pose: TYPE, expr: 'smile' } });
  FX.dust(g, t, { count: 10, color: '#fff2d0', a: 0.1 });
} });
// s19 60.3–62.76: ada yang bawa gorengan (loop ke s03)
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.5, 1.65, k)), dx = lerp(1250, 900, ease.out(prog(t, 0.1, 1.3)));
  pantri(g, t, cam, { mood: 'day', wall: wallRow(6), items: items({ gor: 6 }), dito: { x: dx }, rani: { expr: 'surprised', look: [1, 0] } });
  badge(g, 'HARI 7', ease.out(prog(t, 0.3, 0.7)), '#c07a22');
} });
