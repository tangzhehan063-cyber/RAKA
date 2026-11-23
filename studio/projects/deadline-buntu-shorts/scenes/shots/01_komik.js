// 01_komik.js — #18 "Deadline Buntu": komik terang, hook kejadian (eksperimen E2), 13 shot.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, bigFace, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { HERO } from '../cast.js';

const INK = '#14121a';
// palet per gaya (dipilih user lewat produksi.sh palet): a = latar utama, b = latar kedua, c = pink/aksen, d = hijau/aksen, hot = merah, blue = biru, night = latar malam
const PALS = {
  komik: { a: '#ffd400', b: '#4cc9f0', c: '#ff7ab6', d: '#7cf29c', hot: '#ff4d2e', blue: '#2f6bff', night: '#3b2f8f', paper: '#fffbe8' },
  komikMalam: { a: '#2b1b6b', b: '#6a3df0', c: '#ff3d9a', d: '#b6ff3d', hot: '#ffd400', blue: '#46d2ff', night: '#120a3a', paper: '#fff3d6' },
  komikMint: { a: '#b8f2d8', b: '#ffd6a5', c: '#ff9eb5', d: '#fff27a', hot: '#ff5a36', blue: '#2563eb', night: '#2b3a67', paper: '#fffdf5' },
};
const P = () => PALS[E.styleId] || PALS.komik;
const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const pop = (t, at, d = 0.28) => ease.outBack(prog(t, at, at + d));
const lite = (c) => { const m = c.match(/#(..)(..)(..)/); return m ? (parseInt(m[1], 16) * 299 + parseInt(m[2], 16) * 587 + parseInt(m[3], 16) * 114) / 1000 > 140 : true; };
const onBg = (bg) => (lite(bg) ? INK : '#fffbe8');

const bg = (g, col, ht = null, a = 0.3, step = 36) => {
  g.fillStyle = col; g.fillRect(0, 0, E.W, E.H);
  if (ht) { g.save(); g.fillStyle = alpha(ht, a); for (let y = 0; y < E.H; y += step) for (let x = ((y / step) % 2) * step / 2; x < E.W; x += step) { g.beginPath(); g.arc(x, y, 3 + 4 * (y / E.H), 0, 6.3); g.fill(); } g.restore(); }
};
const burst = (g, cx, cy, r0, r1, n, col, rot = 0) => {
  const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r0 : r1; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  poly(g, pts, col); g.lineWidth = 10; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
};
// teks tebal bergaris hitam; k = skala animasi (0..1)
const sticker = (g, str, x, y, size, col, rot = 0, k = 1) => {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
  g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 9, 11); g.fillStyle = INK; g.fillText(str, 9, 11);
  g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
const slamK = (t, at) => { const k = prog(t, at, at + 0.2); return k <= 0 ? 0 : k < 1 ? lerp(2.4, 1, ease.outBack(k)) : 1; };
const label = (g, str, x, y, size, fill, tcol, rot = 0, k = 1) => {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
  g.font = `900 ${size}px "${FONTS.ui}"`; const w = g.measureText(str).width + size * 0.9, h = size * 1.5;
  rr(g, -w / 2 + 8, -h / 2 + 9, w, h, size * 0.3); g.fillStyle = INK; g.fill();
  rr(g, -w / 2, -h / 2, w, h, size * 0.3); g.fillStyle = fill; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; g.fillText(str, 0, 3); g.restore();
};
const hpBody = (g, cx, cy, w, h, screen) => {
  rr(g, cx - w / 2 + 14, cy - h / 2 + 16, w, h, 70); g.fillStyle = INK; g.fill();
  rr(g, cx - w / 2, cy - h / 2, w, h, 70); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  rr(g, cx - w / 2 + 26, cy - h / 2 + 30, w - 52, h - 60, 46); g.fillStyle = screen; g.fill();
  rr(g, cx - 60, cy - h / 2 + 12, 120, 14, 7); g.fillStyle = INK; g.fill();
};
const lines = (g, t, y0, y1, n, col, seed) => { g.save(); g.strokeStyle = alpha(col, 0.9); g.lineWidth = 8; g.lineCap = 'round'; const r = rng(seed); for (let i = 0; i < n; i++) { const x = 60 + r() * (E.W - 120), l = 150 + r() * 260, o = ((t * 2400 + r() * 900) % 1300); g.beginPath(); g.moveTo(x, y0 + o - l); g.lineTo(x, y0 + o); g.stroke(); } g.restore(); };
const shk = (t, at, dur = 0.3, amp = 22) => (t > at && t < at + dur ? shake(t, amp, 40) : [0, 0]);
const hhmm = (m) => { m = Math.floor(m) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };


// ---- helper #18 ----
const bulb = (g, x, y, r, on) => {
  if (on) { g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35); g.lineTo(x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75); g.stroke(); } g.restore(); }
  circle(g, x + 6, y + 8, r, INK); circle(g, x, y, r, on ? '#ffe94a' : '#9a97a8'); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.stroke();
  rr(g, x - r * 0.45, y + r * 0.85, r * 0.9, r * 0.6, 8); g.fillStyle = INK; g.fill();
};
const laptop = (g, cx, cy, w, scr, inner) => {
  const h = w * 0.62;
  rr(g, cx - w / 2 + 14, cy - h / 2 + 16, w, h, 34); g.fillStyle = INK; g.fill();
  rr(g, cx - w / 2, cy - h / 2, w, h, 34); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  rr(g, cx - w / 2 + 24, cy - h / 2 + 24, w - 48, h - 48, 18); g.fillStyle = scr; g.fill();
  if (inner) { g.save(); g.beginPath(); g.rect(cx - w / 2 + 24, cy - h / 2 + 24, w - 48, h - 48); g.clip(); inner(cx - w / 2 + 24, cy - h / 2 + 24, w - 48, h - 48); g.restore(); }
  rr(g, cx - w * 0.58 + 12, cy + h / 2 + 6, w * 1.16, 46, 20); g.fillStyle = INK; g.fill(); rr(g, cx - w * 0.58, cy + h / 2 - 6, w * 1.16, 46, 20); g.fillStyle = '#bfbccb'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
};
const star = (g, x, y, r, col, rot = 0) => { const p = []; for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4, rr_ = i % 2 ? r * 0.38 : r; p.push([x + Math.cos(a) * rr_, y + Math.sin(a) * rr_]); } poly(g, p, col); g.lineWidth = 6; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); };
const hbar = (g, x, y, w, h, frac, col) => { rr(g, x + 10, y - h / 2 + 12, w, h, h / 2); g.fillStyle = INK; g.fill(); rr(g, x, y - h / 2, w, h, h / 2); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); if (frac > 0.02) { rr(g, x + 8, y - h / 2 + 8, Math.max(h - 16, (w - 16) * clamp(frac, 0, 1)), h - 16, (h - 16) / 2); g.fillStyle = col; g.fill(); } };

// s01 0.0–3.2: Jam 10 malam. Deadline besok.
registerShot('s01', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const [sx, sy] = shk(t, 0.22, 0.5, 14); g.save(); g.translate(sx, sy);
  g.save(); g.translate(E.W / 2, 400); const k = slamK(t, 0.22); g.scale(Math.max(k, 0.001), Math.max(k, 0.001));
  rr(g, -420 + 14, -150 + 16, 840, 300, 50); g.fillStyle = INK; g.fill(); rr(g, -420, -150, 840, 300, 50); g.fillStyle = '#12151f'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#fffbe8'; g.stroke();
  text(g, '22:00', 0, 8, { size: 250, color: '#ffe94a', font: FONTS.ui, weight: 900 }); g.restore(); g.restore();
  const at = rel('Deadline', info, 1.9); label(g, 'DEADLINE BESOK', E.W / 2, 690, 92, c.hot, '#fffbe8', -0.04, pop(t, at - 0.05, 0.3));
  laptop(g, E.W / 2, 960, 760, '#fffdf5', (x, y, w, h) => { if (Math.floor(t * 2.4) % 2 === 0) { g.fillStyle = INK; g.fillRect(x + 70, y + 90, 12, 70); } g.fillStyle = alpha(INK, 0.15); g.fillRect(x + 70, y + 30, w * 0.35, 14); });
} });

// s02 3.2–6.2: bigFace yakin, bohlam meledak, MODE JENIUS
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const at = rel('puncak', info, 1.8);
  burst(g, E.W / 2, 700, 330, 520, 14, c.c, t * 0.1);
  bigFace(g, E.W / 2, 740, 290, { outfit: HERO, expr: t > at ? 'joy' : 'smirk', look: [0.1, -0.25], blink: 0 });
  const k = pop(t, 0.1, 0.35); bulb(g, E.W / 2 + 40, 250, 80 * k * (1 + 0.1 * Math.sin(t * 8)), true);
  const [sx, sy] = shk(t, at, 0.3, 18); g.save(); g.translate(sx, sy); label(g, 'MODE JENIUS', E.W / 2, 1150, 110, '#fffbe8', INK, -0.04, pop(t, at - 0.05, 0.3)); g.restore();
  if (t > at && t < at + 0.07) { g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); }
} });

// s03 6.2–8.7: ngebut ngetik, ide beterbangan
registerShot('s03', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.2); lines(g, t, -200, E.H, 20, '#fff', 3);
  const r = rng(4); const cx = E.W / 2, cy = 900, w = 820, h = w * 0.62;
  laptop(g, cx, cy, w, '#fffdf5', (x, y, ww, hh) => { const n = Math.floor(t * 12); for (let i = 0; i < Math.min(n, 12); i++) { g.fillStyle = INK; g.fillRect(x + 50, y + 40 + i * 38, 140 + ((i * 97) % 300), 16); } });
  const bob = Math.sin(t * 34) * 14; circle(g, cx - 140, cy + h / 2 + 12 + bob, 38, INK); circle(g, cx + 140, cy + h / 2 + 12 - bob, 38, INK);
  for (let i = 0; i < 6; i++) { const ph = (t * 1.3 + i / 6) % 1, x = 170 + i * 120 + r() * 30; sticker(g, ['IDE!', '!!', 'NAH', 'IDE!', '!!', 'AHA'][i], x, 720 - ph * 420, 70, i % 2 ? '#fff' : c.hot, (i - 3) * 0.12, clamp(ph * 5, 0, 1)); }
} });

// s04 8.7–11.5: versi terbaik
registerShot('s04', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.22); const bob = Math.sin(t * 5) * 6;
  for (let i = 0; i < 6; i++) { const a = i * 1.05 + 0.4, rad = 360 + 40 * Math.sin(t * 3 + i); star(g, E.W / 2 + Math.cos(a) * rad, 760 + Math.sin(a) * rad * 0.8, 46 + 14 * Math.sin(t * 6 + i), i % 2 ? '#ffe94a' : '#fff', t * 0.8 + i); }
  drawFigure(g, { x: E.W / 2 - 40, y: 1220 + bob * 0, s: 3.1, facing: 1, outfit: HERO, pose: breathe(POSES.cheer, t, 1.2, 2), expr: 'joy', rim: null, shadow: false });
  label(g, 'VERSI TERBAIK', E.W / 2, 300, 96, '#fffbe8', INK, -0.04, pop(t, rel('terbaik', info, 1.8) - 0.1, 0.3));
} });

// s05 11.5–13.4: catatan harian
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.18, 40); const cols = [c.hot, c.blue, c.d, c.c];
  for (let i = 0; i < 4; i++) { const k = ease.outBack(prog(t, 0.1 + i * 0.22, 0.55 + i * 0.22)), x = E.W / 2 + (i % 2 ? 24 : -24), y = 1000 - i * 150 - (1 - k) * 600; if (k <= 0) continue;
    rr(g, x - 330 + 12, y - 70 + 14, 660, 140, 14); g.fillStyle = INK; g.fill(); rr(g, x - 330, y - 70, 660, 140, 14); g.fillStyle = cols[i]; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
    rr(g, x - 300, y - 40, 40, 80, 8); g.fillStyle = alpha('#fff', 0.6); g.fill(); g.fillStyle = INK; g.fillRect(x - 220, y - 8, 280, 14); }
  label(g, 'CATATAN HARIAN', E.W / 2, 280, 96, '#ffd400', INK, 0.03, pop(t, rel('catatan', info, 0.8) - 0.05, 0.3));
} });

// s06 13.4–15.8: 177 karyawan
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.18, 40);
  label(g, 'AMABILE DKK · 2002', E.W / 2, 230, 70, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  const cols = 12, gx = (E.W - cols * 66) / 2 + 33, gy = 380, n = 177, tf = prog(t, 0.1, 1.3);
  for (let i = 0; i < n; i++) { const a = clamp(tf * (n + 14) - i, 0, 1); if (a <= 0) continue; const x = gx + (i % cols) * 66, y = gy + Math.floor(i / cols) * 58, s = 1.2 * ease.outBack(a), col = i % 7 === 3 ? c.hot : INK;
    g.save(); g.translate(x, y); g.scale(s, s); circle(g, 0, -12, 9, col); seg(g, [[0, -3], [0, 14]], 6, col); seg(g, [[-9, 4], [9, 4]], 5, col); seg(g, [[0, 14], [-7, 26]], 5, col); seg(g, [[0, 14], [7, 26]], 5, col); g.restore(); }
  const [sx, sy] = shk(t, 0.06, 0.3, 14); g.save(); g.translate(sx, sy); sticker(g, '177', E.W / 2, 640, 250, c.hot, -0.04, slamK(t, 0.06)); sticker(g, 'KARYAWAN', E.W / 2, 840, 110, c.blue, 0.03, slamK(t, rel('karyawan', info, 1.2) - 0.05)); g.restore();
} });

// s07 15.8–20.4: tekanan naik, bohlam padam
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2); const f = ease.inOut(prog(t, 0.3, 3.4));
  label(g, 'TEKANAN', 330, 250, 54, c.hot, '#fffbe8', -0.03, pop(t, 0.1, 0.3)); label(g, 'IDE KREATIF', 705, 250, 46, '#fffbe8', INK, 0.03, pop(t, 0.2, 0.3));
  const x0 = 235, y0 = 1150, hh = 800; rr(g, x0 + 12, y0 - hh + 14, 190, hh, 30); g.fillStyle = INK; g.fill(); rr(g, x0, y0 - hh, 190, hh, 30); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  const fh = (hh - 20) * f; if (fh > 6) { rr(g, x0 + 10, y0 - 10 - fh, 170, fh, 22); g.fillStyle = c.hot; g.fill(); }
  const pos = [[560, 520], [760, 520], [560, 760], [760, 760], [560, 1000], [760, 1000]];
  pos.forEach(([x, y], i) => bulb(g, x, y, 62, t < 1.0 + i * 0.4));
  const at = rel('jarang', info, 3.3); sticker(g, 'LEBIH JARANG', E.W / 2, 1200, 100, '#fffbe8', -0.04, slamK(t, at - 0.05));
} });

// s08 20.4–26.0: rasa naik vs hasil turun
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.d, 0.2, 40); const up = ease.inOut(prog(t, 0.4, 3.0)), dn = 1 - 0.75 * ease.inOut(prog(t, 2.2, 4.4));
  label(g, 'RASA KREATIF', E.W / 2, 360, 70, '#fffbe8', INK, -0.02, pop(t, 0.1, 0.3)); hbar(g, 110, 480, 760, 120, 0.12 + 0.85 * up, c.d);
  label(g, 'HASIL NYATA', E.W / 2, 640, 70, '#fffbe8', INK, 0.02, pop(t, rel('Anehnya,', info, 0.1) + 1.6, 0.3)); hbar(g, 110, 760, 760, 120, dn, c.hot);
  label(g, 'ADA INDIKASI', E.W - 270, 215, 56, '#ffd400', INK, 0.08, pop(t, rel('indikasi', info, 1.2), 0.3));
  drawFigure(g, { x: 300, y: 1235, s: 1.55, facing: 1, outfit: HERO, pose: breathe(POSES.cheer, t, 1, 3), expr: t > 3.2 ? 'confused' : 'smirk', rim: null, shadow: false });
} });

// s09 26.0–28.0: tidak selalu merusak
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.blue, 0.22); const [sx, sy] = shk(t, 0.1, 0.4, 18); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, 560, 330, 520, 14, c.d, t * 0.1);
  sticker(g, 'TIDAK', E.W / 2, 440, 230, '#fffbe8', -0.05, slamK(t, 0.1)); sticker(g, 'SELALU', E.W / 2, 650, 190, c.blue, 0.04, slamK(t, 0.35)); g.restore();
  label(g, 'MERUSAK', E.W / 2, 980, 120, '#fffbe8', INK, 0, pop(t, 0.7, 0.3)); const k = prog(t, 1.2, 1.55); if (k > 0) { g.fillStyle = INK; g.fillRect(250, 975, 580 * k, 20); }
} });

// s10 28.0–32.4: fokus penuh pada satu hal
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.d, '#fff', 0.2); const cx = E.W / 2, cy = 680, cols = ['#fffbe8', c.hot, '#fffbe8', c.hot];
  label(g, 'SATU HAL PENTING', E.W / 2, 240, 64, '#ffd400', INK, -0.02, pop(t, 0.1, 0.3));
  [380, 290, 200, 110].forEach((r, i) => { circle(g, cx + 8, cy + 10, r, INK); circle(g, cx, cy, r, cols[i]); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(cx, cy, r, 0, 6.3); g.stroke(); });
  const dk = pop(t, 1.0, 0.3); if (dk > 0) { g.save(); g.translate(cx, cy); g.scale(dk, dk); star(g, 0, 0, 90, '#ffe94a', t * 0.5); g.restore(); }
  for (let i = 0; i < 5; i++) { const ph = (t * 0.75 + i * 0.2) % 1, a = i * 1.26 + 0.3, rad = 700 - 330 * Math.abs(Math.sin(ph * Math.PI)); const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad * 0.85; if (x < 60 || x > 860) continue;
    circle(g, x + 5, y + 7, 40, INK); circle(g, x, y, 40, c.c); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, 40, 0, 6.3); g.stroke(); sticker(g, '!', x, y + 2, 44, '#fffbe8', 0, 1); }
  label(g, 'FOKUS PENUH', E.W / 2, 1150, 104, '#fffbe8', INK, 0.03, pop(t, rel('Fokus', info, 0) + 0.1, 0.3));
} });

// s11 32.4–37.0: studi lapangan, pola vs sebab
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.18, 40);
  label(g, 'STUDI LAPANGAN', E.W / 2, 250, 84, '#ffd400', INK, -0.03, pop(t, 0.15, 0.3));
  const k1 = pop(t, rel('Polanya', info, 1.6) - 0.1, 0.3), k2 = pop(t, rel('sebabnya', info, 2.5) - 0.1, 0.3);
  const panel = (y, k, col, str, mark) => { if (k <= 0) return; g.save(); g.translate(E.W / 2 - 70, y); g.scale(k, k); rr(g, -380 + 12, -130 + 14, 760, 260, 40); g.fillStyle = INK; g.fill(); rr(g, -380, -130, 760, 260, 40); g.fillStyle = col; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); text(g, str, -60, 6, { size: 56, color: onBg(col), font: FONTS.ui, weight: 900 }); text(g, mark, 300, 10, { size: 170, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); };
  panel(620, k1, c.d, 'POLA TERLIHAT', '✓'); panel(960, k2, c.a, 'SEBAB BELUM PASTI', '?');
  sticker(g, 'KORELASI', E.W / 2, 1190, 120, c.hot, -0.04, slamK(t, rel('belum', info, 3.0)));
} });

// s12 37.0–40.5: simpan dulu
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const at = rel('simpan', info, 2.5), k = ease.inOut(prog(t, at, at + 0.7));
  label(g, 'SIMPAN DULU', E.W / 2, 250, 108, '#ffe94a', INK, -0.03, pop(t, at - 0.1, 0.3));
  const fy = 1000; g.save(); g.translate(E.W / 2, lerp(560, fy - 40, k)); g.rotate(-0.05 * (1 - k)); g.scale(lerp(1, 0.8, k), lerp(1, 0.8, k));
  rr(g, -260 + 12, -330 + 14, 520, 660, 20); g.fillStyle = INK; g.fill(); rr(g, -260, -330, 520, 660, 20); g.fillStyle = '#fffdf5'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  text(g, 'IDE', 0, -110, { size: 130, color: INK, font: FONTS.ui, weight: 900 }); text(g, 'JENIUS?', 0, 40, { size: 112, color: c.hot, font: FONTS.ui, weight: 900 }); for (let i = 0; i < 3; i++) { g.fillStyle = alpha(INK, 0.25); g.fillRect(-190, 150 + i * 44, 380 - i * 60, 14); } g.restore();
  rr(g, E.W / 2 - 400 + 14, fy - 60 + 16, 800, 380, 36); g.fillStyle = INK; g.fill(); rr(g, E.W / 2 - 400, fy - 60, 800, 380, 36); g.fillStyle = c.a; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  text(g, 'BESOK', E.W / 2, fy + 130, { size: 96, color: INK, font: FONTS.ui, weight: 900 });
} });

// s13 40.5–42.0: baca lagi besok pagi
registerShot('s13', { draw(g, t, info) {
  const c = P(); bg(g, c.a, '#fff', 0.25); burst(g, E.W / 2, 560, 330, 560, 16, c.paper, t * 0.15);
  circle(g, E.W / 2 + 12, 572, 260, INK); circle(g, E.W / 2, 560, 260, c.paper); g.lineWidth = 10; g.strokeStyle = INK; g.beginPath(); g.arc(E.W / 2, 560, 260, 0, 6.3); g.stroke();
  text(g, '08:00', E.W / 2, 575, { size: 220, color: INK, font: FONTS.ui, weight: 900 });
  label(g, 'BACA LAGI', E.W / 2, 960, 112, '#fffbe8', INK, -0.03, pop(t, 0.1, 0.3)); label(g, 'BESOK PAGI', E.W / 2, 1100, 96, c.hot, '#fffbe8', 0.03, pop(t, 0.5, 0.3));
} });
