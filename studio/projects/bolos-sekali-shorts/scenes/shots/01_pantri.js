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

// ---- benda (digambar mirip aslinya) -----------------------------------------------------------------
const rnd = (i, seed = 1) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
// gumpalan tak beraturan yang mulus (kurva kuadrat lewat titik tengah)
function blob(g, rx, ry, seed = 1, wob = 0.14, n = 12) {
  const P = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 + (rnd(i, seed) - 0.5) * 2 * wob; P.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]); }
  g.beginPath(); const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let st = m(P[n - 1], P[0]); g.moveTo(st[0], st[1]);
  for (let i = 0; i < n; i++) { const e = m(P[i], P[(i + 1) % n]); g.quadraticCurveTo(P[i][0], P[i][1], e[0], e[1]); } g.closePath();
}
function broccoli(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -6, -4, 12, 22, 4); g.fillStyle = '#a9cf86'; g.fill();
  for (const [dx, dy, r] of [[-14, -12, 13], [0, -22, 15], [14, -12, 13], [0, -8, 12]]) circle(g, dx, dy, r, '#4f9a4a');
  for (const [dx, dy] of [[-16, -14], [-4, -26], [10, -22], [16, -10], [2, -10], [-8, -4]]) circle(g, dx, dy, 3.4, '#3b7f3c');
  circle(g, -2, -28, 4, '#79bd6e'); g.restore();
}
function drumstick(g, x, y, s = 1, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, 24, -7, 36, 14, 7); g.fillStyle = '#f5ecd8'; g.fill(); circle(g, 61, -7, 8, '#f5ecd8'); circle(g, 61, 7, 8, '#f5ecd8');
  g.beginPath(); g.moveTo(-36, 2); g.bezierCurveTo(-42, -32, 8, -42, 30, -14); g.bezierCurveTo(38, -2, 32, 12, 20, 20); g.bezierCurveTo(0, 34, -36, 28, -36, 2); g.closePath();
  g.fillStyle = '#c98230'; g.fill(); g.strokeStyle = '#8f5518'; g.lineWidth = 3.5; g.stroke();
  g.beginPath(); g.moveTo(-26, -8); g.bezierCurveTo(-24, -26, 2, -32, 18, -16); g.strokeStyle = '#e8b062'; g.lineWidth = 6; g.lineCap = 'round'; g.stroke();
  for (let i = 0; i < 9; i++) circle(g, -24 + rnd(i, 3) * 48, -8 + rnd(i, 7) * 26, 2.4, '#9a5d1c');
  g.restore();
}
function pisang(g, x, y, s, rot) {   // pisang goreng: melengkung, ujung lancip, kulit tepung bergelombang
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.beginPath(); g.moveTo(-56, 8); g.bezierCurveTo(-48, -22, 10, -34, 56, -10); g.bezierCurveTo(58, -4, 52, 2, 44, 4); g.bezierCurveTo(8, -6, -24, 6, -50, 18); g.bezierCurveTo(-56, 18, -58, 14, -56, 8); g.closePath();
  g.fillStyle = '#e3a843'; g.fill(); g.strokeStyle = '#b3752a'; g.lineWidth = 3.5; g.lineJoin = 'round'; g.stroke();
  g.beginPath(); g.moveTo(-40, 2); g.bezierCurveTo(-24, -14, 10, -20, 38, -8); g.strokeStyle = '#f6d27c'; g.lineWidth = 5; g.lineCap = 'round'; g.stroke();
  for (let i = 0; i < 12; i++) { const u = rnd(i, 5); circle(g, -46 + u * 92, -14 + rnd(i, 9) * 18 - u * 6, 2.2, '#b9792a'); }
  g.restore();
}
function bakwan(g, x, y, s, rot) {   // bakwan sayur: gumpalan bergerigi dengan potongan wortel & daun bawang
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  blob(g, 40, 30, 11, 0.2, 14); g.fillStyle = '#d6923a'; g.fill(); g.strokeStyle = '#a56a22'; g.lineWidth = 3.5; g.stroke();
  blob(g, 24, 15, 4, 0.2, 10); g.translate(-6, -8); g.fillStyle = '#ebb560'; g.fill(); g.translate(6, 8);
  for (let i = 0; i < 7; i++) { const px = -26 + rnd(i, 2) * 52, py = -16 + rnd(i, 6) * 32; seg(g, [[px, py], [px + 9, py - 5 + rnd(i, 4) * 10]], 3.4, '#6fa05a'); }
  for (let i = 0; i < 4; i++) circle(g, -22 + rnd(i, 8) * 44, -14 + rnd(i, 1) * 28, 3.6, '#e98a3c');
  g.restore();
}
function tahu(g, x, y, s, rot) {   // tahu isi: kotak membulat, belahan di atas dan cabai hijau
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -34, -28, 68, 56, 14); g.fillStyle = '#dca048'; g.fill(); g.strokeStyle = '#a8701f'; g.lineWidth = 3.5; g.stroke();
  rr(g, -26, -22, 52, 24, 10); g.fillStyle = '#efbd6a'; g.fill();
  seg(g, [[-20, -6], [20, -6]], 5, '#8c5a1a'); g.save(); g.translate(14, -10); g.rotate(-0.4); g.beginPath(); g.ellipse(0, 0, 20, 7, 0, 0, Math.PI * 2); g.fillStyle = '#4f9a3c'; g.fill(); g.restore();
  for (let i = 0; i < 8; i++) circle(g, -26 + rnd(i, 3) * 52, 4 + rnd(i, 5) * 18, 2.2, '#a8701f'); g.restore();
}
function mendoan(g, x, y, s, rot) {   // tempe mendoan: tipis lebar, tepi bergelombang, bintik daun bawang
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.beginPath(); g.moveTo(-44, 10); for (let i = 0; i <= 12; i++) { const u = i / 12; g.lineTo(-44 + u * 88, -22 * Math.sin(u * Math.PI) * 0.7 + 10 - 22 * Math.sin(u * Math.PI) * 0.4 + Math.sin(u * 30) * 2); }
  for (let i = 12; i >= 0; i--) { const u = i / 12; g.lineTo(-44 + u * 88, 18 + Math.sin(u * 22) * 2.4); } g.closePath();
  g.fillStyle = '#ecd277'; g.fill(); g.strokeStyle = '#b8932f'; g.lineWidth = 3.2; g.stroke();
  for (let i = 0; i < 12; i++) circle(g, -34 + rnd(i, 4) * 68, -2 + rnd(i, 2) * 16, 2.6, '#5e9a44'); g.restore();
}
const JENIS = [pisang, bakwan, tahu, mendoan, pisang, bakwan];
export function gorengan(g, x, y, s = 1, rot = 0, k = 0) { JENIS[k % JENIS.length](g, x, y, s, rot); }
export function boxGorengan(g, x, y, s = 1, n = 6) {   // nampan kertas cokelat berisi gorengan campur
  g.save(); g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 2, 126 * s, 10 * s, 0, 0, Math.PI * 2); g.fill(); g.restore();
  const POS = [[-62, -52], [4, -62], [66, -50], [-30, -34], [38, -30], [-84, -30]];
  for (let i = 0; i < Math.min(n, 6); i++) gorengan(g, x + POS[i][0] * s, y + POS[i][1] * s, 0.78 * s, (rnd(i, 9) - 0.5) * 0.5, i);
  g.beginPath(); g.moveTo(x - 118 * s, y - 34 * s); g.lineTo(x + 118 * s, y - 34 * s); g.lineTo(x + 100 * s, y); g.lineTo(x - 100 * s, y); g.closePath(); g.fillStyle = '#c79a66'; g.fill();
  g.beginPath(); g.moveTo(x - 118 * s, y - 34 * s); g.lineTo(x + 118 * s, y - 34 * s); g.lineTo(x + 114 * s, y - 24 * s); g.lineTo(x - 114 * s, y - 24 * s); g.closePath(); g.fillStyle = '#dcb584'; g.fill();
  for (let i = 0; i < 4; i++) { g.save(); g.globalAlpha *= 0.28; g.beginPath(); g.ellipse(x - 70 * s + i * 46 * s, y - 14 * s, 14 * s, 6 * s, 0, 0, Math.PI * 2); g.fillStyle = '#e0a23a'; g.fill(); g.restore(); }
}
// kotak bekal: x tengah, y permukaan meja. open 0..1 (tutup terangkat), dust 0..1
export function kotak(g, x, y, s = 1, o = {}) {
  const open = o.open || 0, w = 190 * s, h = 96 * s, col = o.color || BEKAL;
  g.save(); g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.ellipse(x, y + 2, w * 0.58, 10 * s, 0, 0, Math.PI * 2); g.fill(); g.restore();
  rr(g, x - w / 2, y - h, w, h, 14 * s); g.fillStyle = shade(col, -0.12); g.fill();
  if (open > 0.05) {   // isi: dua sekat, brokoli + irisan wortel, ayam goreng paha
    rr(g, x - w / 2 + 8 * s, y - h + 6 * s, w - 16 * s, h * 0.62, 10 * s); g.fillStyle = '#fbf4e6'; g.fill();
    seg(g, [[x + 2 * s, y - h + 10 * s], [x + 2 * s, y - h + h * 0.62]], 3 * s, '#e3d6bb');
    broccoli(g, x - 44 * s, y - h + 40 * s, 0.9 * s); broccoli(g, x - 14 * s, y - h + 42 * s, 0.75 * s);
    for (const [dx, dy] of [[-62, 52], [-30, 56]]) { circle(g, x + dx * s, y - h + (dy - 8) * s, 8 * s, '#f0983e'); circle(g, x + dx * s, y - h + (dy - 8) * s, 3.4 * s, '#f8c47a'); }
    drumstick(g, x + 38 * s, y - h + 44 * s, 0.72 * s, -0.25);
  }
  if (open > 0.05) {   // tutup terbuka ke belakang: trapesium bertumpu pada tepi atas kotak
    const lh = 62 * s * open;
    g.save(); g.globalCompositeOperation = 'source-over';
    g.beginPath(); g.moveTo(x - w / 2 - 4 * s, y - h); g.lineTo(x + w / 2 + 4 * s, y - h); g.lineTo(x + w / 2 - 6 * s, y - h - lh); g.lineTo(x - w / 2 + 6 * s, y - h - lh); g.closePath();
    g.fillStyle = shade(col, 0.08); g.fill(); g.beginPath(); g.moveTo(x - w / 2 + 14 * s, y - h - 6 * s); g.lineTo(x + w / 2 - 14 * s, y - h - 6 * s); g.lineTo(x + w / 2 - 18 * s, y - h - lh + 8 * s); g.lineTo(x - w / 2 + 18 * s, y - h - lh + 8 * s); g.closePath(); g.fillStyle = shade(col, -0.1); g.fill(); g.restore();
  } else {
    rr(g, x - w / 2 - 6 * s, y - h - 22 * s, w + 12 * s, 26 * s, 12 * s); g.fillStyle = col; g.fill();
    rr(g, x - 22 * s, y - h - 12 * s, 44 * s, 10 * s, 5 * s); g.fillStyle = shade(col, 0.35); g.fill();
  }
  if (o.dust) { g.save(); g.globalAlpha *= 0.5 * o.dust; rr(g, x - w / 2, y - h - 20 * s, w, h + 20 * s, 14 * s); g.fillStyle = '#d8d2c6'; g.fill(); g.restore(); }
}
export function bungkus(g, x, y, n, s = 1) {   // gumpalan kertas minyak: bentuk lunak tak beraturan, lipatan melengkung, noda minyak
  for (let i = 0; i < Math.ceil(n); i++) { const k = ease.outBack(clamp(n - i)); if (k <= 0) continue; const px = x + ((i * 53) % 150 - 75) * s, py = y - ((i * 31) % 60) * s - 20 * s;
    g.save(); g.translate(px, py); g.scale(k * s, k * s); g.rotate(rnd(i, 3) * 3);
    blob(g, 27, 22, i + 3, 0.2, 11); g.fillStyle = '#ecdfbd'; g.fill();
    g.save(); blob(g, 27, 22, i + 3, 0.2, 11); g.clip();
    for (let j = 0; j < 4; j++) { const a = rnd(j + i * 5, 2) * 6, r = 6 + rnd(j, 4) * 14; g.beginPath(); g.arc(Math.cos(a) * 10, Math.sin(a) * 8, r, a, a + 1.9); g.strokeStyle = 'rgba(150,126,78,.55)'; g.lineWidth = 2.6; g.lineCap = 'round'; g.stroke(); }
    g.beginPath(); g.ellipse(7, 6, 11, 7, 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(214,160,60,.28)'; g.fill();
    g.beginPath(); g.ellipse(-8, -9, 9, 5, -0.5, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.4)'; g.fill(); g.restore();
    blob(g, 27, 22, i + 3, 0.2, 11); g.strokeStyle = '#bba873'; g.lineWidth = 2.4; g.stroke(); g.restore(); }
}
export function geprek(g, x, y, s = 1) {   // boks styrofoam: nasi, ayam geprek renyah + sambal, irisan timun
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-104, -52); g.lineTo(104, -52); g.lineTo(92, 0); g.lineTo(-92, 0); g.closePath(); g.fillStyle = '#f4f1ea'; g.fill(); g.strokeStyle = '#d6d0c2'; g.lineWidth = 3; g.stroke();
  rr(g, -98, -60, 196, 20, 8); g.fillStyle = '#fffdf8'; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-84, -56); g.bezierCurveTo(-84, -112, -18, -112, -18, -56); g.closePath(); g.fillStyle = '#fffdf5'; g.fill(); g.strokeStyle = '#e4dcc8'; g.lineWidth = 2.5; g.stroke();
  for (let i = 0; i < 12; i++) seg(g, [[-76 + rnd(i, 1) * 52, -64 - rnd(i, 2) * 38], [-72 + rnd(i, 1) * 52, -60 - rnd(i, 2) * 38]], 2.4, '#e2d9c1');
  g.save(); g.translate(40, -70); blob(g, 56, 24, 21, 0.18, 14); g.fillStyle = '#c98a36'; g.fill(); g.strokeStyle = '#8f5a1a'; g.lineWidth = 3.5; g.stroke(); g.restore();
  for (let i = 0; i < 14; i++) circle(g, -8 + rnd(i, 3) * 96, -82 + rnd(i, 4) * 26, 3.2, '#e8b45c');
  g.save(); g.translate(46, -78); blob(g, 28, 12, 5, 0.25, 10); g.fillStyle = '#c0301c'; g.fill(); g.restore();
  for (let i = 0; i < 6; i++) circle(g, 28 + rnd(i, 6) * 36, -84 + rnd(i, 7) * 12, 2.2, '#f0d890');
  for (const dx of [-20, -2]) { circle(g, dx, -38, 12, '#8fbf6a'); circle(g, dx, -38, 8, '#c9e2a8'); } g.restore();
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
  const md = o.mood || 'day', M = mood(md), G = GY(), CX = E.W / 2, wall = shade(M.wall, 0.04);
  const wx = CX - 380, wy = G - 1010, ww = 470, wh = 480;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.04), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(wall, -0.22), bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(shade(M.sky[0], -0.12), 0.55), windowColor: alpha(M.practical, 0.35), lit: 0.1, seed: 11 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, M.key, 0.2);
    if (o.wall) o.wall(g, G);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.06), shade(M.floor, -0.1)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, wx + ww * 0.6, G + 60, ww * 0.7, 60, M.key, 0.2);
    const tx = CX + 90, top = G - 150, tw = 560;   // meja
    rr(g, tx - tw / 2, top, tw, 20, 8); g.fillStyle = '#d9b88e'; g.fill();
    seg(g, [[tx - tw / 2 + 26, top + 14], [tx - tw / 2 + 26, G]], 12, '#b8966c'); seg(g, [[tx + tw / 2 - 26, top + 14], [tx + tw / 2 - 26, G]], 12, '#b8966c');
    const bx = CX - 210;   // kursi Rani
    seg(g, [[bx - 40, G - 86], [bx + 34, G - 86]], 12, '#a9a6b6'); seg(g, [[bx - 36, G - 86], [bx - 42, G - 200]], 10, '#a9a6b6');
    seg(g, [[bx - 30, G - 80], [bx - 34, G]], 7, '#a9a6b6'); seg(g, [[bx + 28, G - 80], [bx + 32, G]], 7, '#a9a6b6');
    if (o.rani !== false) { const r = o.rani || {}; drawFigure(g, { x: bx, y: G, s: 1.25, facing: 1, outfit: RANI, pose: r.pose || breathe(TYPE, t, 0.5, 3), expr: r.expr || 'neutral', look: r.look || [0.9, 0.1], blink: (t % 3.4) > 3.27, rim: { color: M.key, dir: [1, -0.2], w: 3 } }); }
    if (o.dito) { const d = o.dito; drawFigure(g, { x: d.x, y: G, s: 1.25, facing: -1, outfit: DITO, pose: d.pose || breathe(POSES.stand, t, 0.5, 7), expr: d.expr || 'smile', look: [-0.9, 0], blink: (t % 3.9) > 3.8, rim: { color: M.key, dir: [-1, -0.2], w: 3 } }); }
    if (o.items) o.items(g, top, tx);
  });
  return { G, top: G - 150, tx: CX + 90, bx: CX - 210, M };
}

const items = (o = {}) => (g, top, tx) => {
  if (o.kotak !== false) kotak(g, tx - 160 + (o.kx || 0), top, 0.46, { open: o.open, dust: o.dust });
  if (o.gor) boxGorengan(g, tx + 10, top, 0.62, o.gor);
  if (o.geprek) { geprek(g, tx - 70, top, 0.5); geprek(g, tx + 20, top - 2, 0.46); }
  if (o.bungkus) bungkus(g, tx + 60, top, o.bungkus, 0.7);
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
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(4.0, 4.5, k), 440, 1100, 540, 1000), to = rel('berisi', info, 1.0);
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
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.6, 1.75, k), 500, 1130, 540, 1100), te = rel('banget', info, 1.2);
  pantri(g, t, cam, { mood: 'day', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, REACH], [0.5, REACH], [0.9, EAT]], 0.3), expr: t > te - 0.3 ? 'joy' : 'smile', look: [0.7, -0.1] },
    items: (g, top, tx) => { items({ gor: 5 })(g, top, tx); const f = ease.inOut(prog(t, 0.2, 0.9)), x = lerp(tx + 10, 400, f), y = lerp(top - 40, top - 250, f); if (f < 1 || t < 1.6) gorengan(g, x, y, 0.55, -0.3, 0); } });
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
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.6, 1.8, k), 500, 1130, 540, 1100), n = 6 - Math.floor(clamp(t / 0.7) * 3 + 0.001), nb = 1 + prog(t, 0.2, 2.2) * 5;
  pantri(g, t, cam, { mood: 'day', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, EAT], [0.5, REACH], [0.8, EAT], [1.4, REACH], [1.7, EAT]], 0.3), expr: 'joy' }, items: items({ gor: Math.max(1, n), bungkus: nb }) });
  [['KEDUA', 0.2], ['KETIGA', 1.0], ['KEEMPAT', 1.8]].forEach(([w, a0], i) => { const a = ease.outBack(prog(t, a0, a0 + 0.3)); if (a <= 0) return; g.save(); g.translate(E.W / 2 + (i - 1) * 40, 760 + i * 110); g.rotate((i - 1) * 0.07); g.scale(a, a);
    text(g, `GORENGAN ${w}`, 0, 0, { size: 62, color: '#b8321f', font: FONTS.ui, weight: 900, spacing: 2, glow: 8, glowColor: alpha('#fff', 0.5) }); g.restore(); });
} });
// s07 17.4–20.5: sorenya pesan ayam geprek dua porsi
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.6, 1.75, k), 500, 1130, 540, 1100);
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
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.6, 1.8, k), 500, 1130, 540, 1100), ts = rel('telanjur', info, 2.3);
  pantri(g, t, cam, { mood: 'golden', wall: wallRow(7, { broken: true }), rani: { pose: posesAt(t, [[0, TYPE], [0.6, POSES.sit]], 0.5), expr: 'smile' }, items: items({ bungkus: 6 }) });
  const a = ease.outBack(prog(t, ts - 0.4, ts)), s = clamp((t - (ts + 1.1)) / 0.8); if (a > 0) { g.save(); g.translate(E.W / 2, 600); g.rotate(-0.1); g.scale(a, a); g.globalAlpha *= 1 - s;
    const ofs = s * 90; g.save(); g.beginPath(); g.rect(-400, -100, 800, 100); g.clip(); g.translate(-ofs, -ofs * 0.4); g.rotate(-s * 0.2);
    text(g, 'SUDAH TELANJUR', 0, 0, { size: 90, color: '#e0574a', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
    g.save(); g.beginPath(); g.rect(-400, 0, 800, 100); g.clip(); g.translate(ofs, ofs * 0.4); g.rotate(s * 0.2); text(g, 'SUDAH TELANJUR', 0, 0, { size: 90, color: '#e0574a', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); g.restore(); }
} });
// s17 51.6–56.8: besoknya, kotak bekal dibuka lagi (pagi emas)
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.7, 2.0, k), 500, 1120, 540, 1090), to = rel('buka', info, 1.0), tm = rel('makan', info, 3.3);
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
