// 01_komik.js — #17 "Lima Menit": komik terang, vonis di awal, 12 shot.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
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

// s01 0.0–3.0: CUMA LIMA MENIT
registerShot('s01', { draw(g, t) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const [sx, sy] = shk(t, 0.22, 0.6, 16); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.42, 360, 560, 14, c.hot, t * 0.12);
  const tc = '#fffbe8';
  sticker(g, 'CUMA', E.W / 2, E.H * 0.31, 250, tc, -0.06, slamK(t, 0.22));
  sticker(g, 'LIMA', E.W / 2, E.H * 0.43, 250, tc, 0.05, slamK(t, 0.43));
  sticker(g, 'MENIT', E.W / 2, E.H * 0.55, 250, c.blue, -0.04, slamK(t, 0.64));
  g.restore();
} });

// s02 3.0–6.4: tokoh di kasur + stempel BOHONG
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.22); const gy = E.H * 0.6, at = rel('kebohongan', info, 0.1);
  rr(g, 90, gy - 40, E.W - 180, 90, 20); g.fillStyle = shade(c.c, 0.1); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  rr(g, 90, gy + 50, E.W - 180, 150, 20); g.fillStyle = c.c; g.fill(); g.stroke();
  rr(g, 100, gy - 210, 230, 190, 40); g.fillStyle = c.paper; g.fill(); g.stroke();   // bantal
  drawFigure(g, { x: 560, y: gy - 30, s: 2.5, facing: -1, outfit: HERO, pose: breathe(POSES.sit, t, 0.8, 1), expr: 'smirk', look: [-0.6, 0.3], rim: null, shadow: false });
  rr(g, 350, gy - 330, 110, 190, 24); g.fillStyle = '#ffe94a'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();  // HP menyala di tangan
  FX.rings(g, 405, gy - 235, t * 0.4, { count: 3, r0: 70, r1: 220, color: '#fff', a: 0.5, w: 6 });
  const [sx, sy] = shk(t, at, 0.25, 26); g.save(); g.translate(sx, sy);
  const k = slamK(t, at); if (k > 0) { burst(g, E.W / 2, E.H * 0.17, 200 * clamp(k, 0, 1), 330 * clamp(k, 0, 1), 12, c.a, 0.2); sticker(g, 'BOHONG!', E.W / 2, E.H * 0.17, 190, c.hot, -0.1, k); }
  g.restore(); if (t > at && t < at + 0.08) { g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); }
} });

// s03 6.4–9.0: HP raksasa 23:00 + notif
registerShot('s03', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const k = ease.out(prog(t, 0, 0.4)), cx = E.W / 2, cy = E.H * 0.45 + (1 - k) * 700;
  hpBody(g, cx, cy, 640, 1000, '#171a3d');
  text(g, hhmm(23 * 60), cx, cy - 190, { size: 190, color: '#ffe94a', font: FONTS.ui, weight: 900 });
  text(g, 'MALAM', cx, cy - 60, { size: 56, color: alpha('#fff', 0.75), font: FONTS.ui, weight: 900, spacing: 8 });
  const at = rel('notifikasi', info, 1.6), nk = pop(t, at, 0.3);
  if (nk > 0) { g.save(); g.translate(cx + 220, cy - 400); g.scale(nk, nk); circle(g, 8, 10, 90, INK); circle(g, 0, 0, 90, c.hot); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 90, 0, 6.3); g.stroke(); text(g, '1', 0, 6, { size: 120, color: '#fff', font: FONTS.ui, weight: 900 }); g.restore();
    rr(g, cx - 260, cy + 60, 520, 120, 30); g.fillStyle = '#fff'; g.fill(); text(g, 'ada 1 notifikasi', cx, cy + 122, { size: 48, color: INK, font: FONTS.ui, weight: 900 }); }
  FX.dust(g, t, { count: 24, color: '#ffe94a', a: 0.5 });
} });

// s04 9.0–12.0: jam berputar 23:00 → 01:07
registerShot('s04', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.2); const k = ease.inOut(prog(t, 0.2, 1.7)), m = lerp(23 * 60, 25 * 60 + 7, k), done = k >= 1;
  lines(g, t, -200, E.H, 18, '#fff', 5);
  const [sx, sy] = shk(t, 1.75, 0.4, 24); g.save(); g.translate(sx, sy);
  rr(g, 90 + 14, 520 + 16, E.W - 180, 420, 60); g.fillStyle = INK; g.fill();
  rr(g, 90, 520, E.W - 180, 420, 60); g.fillStyle = '#12151f'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  text(g, hhmm(m), E.W / 2, 735, { size: 270, color: done ? c.hot : '#ffe94a', font: FONTS.ui, weight: 900 });
  g.restore();
  label(g, 'JAM SATU LEWAT', E.W / 2, 330, 84, '#ffd400', INK, -0.04, pop(t, rel('jam', info, 1.2) + 0.3, 0.3));
  label(g, 'BESOK HARUS BANGUN', E.W / 2, 1130, 62, '#fff', INK, 0.03, pop(t, 2.2, 0.3));
} });

// s05 12.0–15.5: HP raksasa, nasi goreng dilempar, alarm besok
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const cx = E.W / 2 - 40, cy = E.H * 0.47;
  hpBody(g, cx, cy, 700, 1060, '#ffe9b0');
  const fl = Math.sin(t * 5), px = cx, py = cy + 220;                         // wajan
  g.save(); g.translate(px, py); g.rotate(-0.25 * fl * 0.6);
  seg(g, [[170, 20], [420, 60]], 34, INK);
  g.beginPath(); g.ellipse(0, 0, 210, 70, 0, 0, 6.3); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.beginPath(); g.ellipse(0, -14, 180, 48, 0, 0, 6.3); g.fillStyle = '#ffcf5a'; g.fill(); g.restore();
  const r = rng(9); for (let i = 0; i < 26; i++) { const ph = (t * 1.6 + r()) % 1, x = px + (r() - 0.5) * 260, h = 4 * ph * (1 - ph) * (380 + r() * 220); circle(g, x + (r() - 0.5) * 80 * ph, py - 30 - h, 13, i % 5 ? '#ffe9a8' : c.hot); }
  text(g, 'NASI GORENG', cx, cy - 330, { size: 70, color: INK, font: FONTS.ui, weight: 900 });
  const [sx, sy] = shk(t, rel('bangun', info, 2.2), 0.35, 20); g.save(); g.translate(sx, sy);
  label(g, 'ALARM 06:00', E.W - 330, 250, 70, c.hot, '#fff', 0.06, pop(t, rel('bangun', info, 2.2) - 0.2, 0.3)); g.restore();
} });

// s06 15.5–20.0: BEDTIME PROCRASTINATION + definisi
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.25); const [sx, sy] = shk(t, rel('bedtime', info, 1.2), 0.6, 14); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, 560, 330, 520, 16, c.a, t * 0.1);
  sticker(g, 'BEDTIME', E.W / 2, 470, 170, '#fffbe8', -0.05, slamK(t, rel('bedtime', info, 1.2) - 0.05));
  sticker(g, 'PROCRASTINATION', E.W / 2, 650, 92, c.blue, 0.04, slamK(t, rel('procrastination', info, 1.7) - 0.05));
  g.restore();
  const k = pop(t, rel('menunda', info, 2.2) - 0.1, 0.3);
  label(g, 'menunda tidur', E.W / 2, 1000, 80, '#fff', INK, -0.03, k);
  label(g, 'padahal tahu harus tidur', E.W / 2, 1140, 60, c.d, INK, 0.03, pop(t, rel('padahal', info, 3.2) - 0.1, 0.3));
  sticker(g, 'z', 160, 250, 140, '#fff', -0.2, 0.6 + 0.3 * Math.sin(t * 3)); sticker(g, 'Z', 280, 170, 180, '#fff', -0.1, 0.8 + 0.3 * Math.sin(t * 3 + 1));
} });

// s07 20.0–25.7: Kroese 2014, 177 orang
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.18, 40);
  label(g, 'KROESE · 2014', E.W / 2, 230, 96, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  const cols = 12, rows = 15, gx = (E.W - cols * 66) / 2 + 33, gy = 380, n = 177, tf = prog(t, 0.4, 3.3), t177 = rel('177', info, 3.5) - 0.05;
  for (let i = 0; i < n; i++) {
    const a = clamp(tf * (n + 14) - i, 0, 1); if (a <= 0) continue;
    const x = gx + (i % cols) * 66, y = gy + Math.floor(i / cols) * 58, s = 1.2 * ease.outBack(a), col = i % 7 === 3 ? c.hot : INK;
    g.save(); g.translate(x, y); g.scale(s, s); circle(g, 0, -12, 9, col); seg(g, [[0, -3], [0, 14]], 6, col); seg(g, [[-9, 4], [9, 4]], 5, col); seg(g, [[0, 14], [-7, 26]], 5, col); seg(g, [[0, 14], [7, 26]], 5, col); g.restore();
  }
  const [sx, sy] = shk(t, t177, 0.3, 14); g.save(); g.translate(sx, sy); sticker(g, '177 ORANG', E.W / 2, 700, 150, c.hot, -0.04, slamK(t, t177)); g.restore();
} });

// s08 25.7–30.9: rantai tiga panel + stiker KORELASI
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.d, '#fff', 0.2); const items = [['SUSAH ATUR DIRI', c.a, 0.2], ['LEBIH SERING TUNDA TIDUR', c.c, 1.9], ['LEBIH SERING KURANG TIDUR', c.b, 4.0]];
  items.forEach(([str, col, at], i) => {
    const k = pop(t, at, 0.3), y = 330 + i * 330; if (k <= 0) return;
    g.save(); g.translate(E.W / 2, y); g.scale(k, k); rr(g, -440 + 12, -120 + 14, 880, 240, 36); g.fillStyle = INK; g.fill(); rr(g, -440, -120, 880, 240, 36); g.fillStyle = col; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
    const sz = str.length > 20 ? 50 : 76; text(g, str, 0, 6, { size: sz, color: onBg(col), font: FONTS.ui, weight: 900 }); g.restore();
    if (i < 2) { const ak = pop(t, at + 1.0, 0.25); if (ak > 0) { g.save(); g.translate(E.W / 2, y + 165); g.scale(ak, ak); poly(g, [[-45, -35], [45, -35], [45, 5], [75, 5], [0, 55], [-75, 5], [-45, 5]], INK); g.restore(); } }
  });
  label(g, 'KORELASI', E.W - 230, 170, 62, '#fff', INK, 0.1, pop(t, 4.4, 0.3));
} });

// s09 30.9–38.0: baterai tenaga kemauan menyusut
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.08); const k = ease.inOut(prog(t, 0.6, 5.2)), lv = lerp(1, 0.06, k), cx = E.W / 2, cy = 720, w = 700, h = 330;
  text(g, 'TENAGA KEMAUAN', cx, 300, { size: 92, color: '#fffbe8', font: FONTS.ui, weight: 900 });
  const flick = lv < 0.2 && Math.sin(t * 22) > 0.2; rr(g, cx + w / 2 + 6, cy - 60, 48, 120, 16); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  rr(g, cx - w / 2 + 14, cy - h / 2 + 16, w, h, 40); g.fillStyle = INK; g.fill(); rr(g, cx - w / 2, cy - h / 2, w, h, 40); g.fillStyle = '#12151f'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#fff'; g.stroke();
  const fw = (w - 50) * lv; rr(g, cx - w / 2 + 25, cy - h / 2 + 25, Math.max(20, fw), h - 50, 22); g.fillStyle = lv > 0.5 ? c.d : lv > 0.22 ? c.a : (flick ? '#fff' : c.hot); g.fill();
  text(g, hhmm(23 * 60), 690, 1040, { size: 150, color: '#ffe94a', font: FONTS.ui, weight: 900 });
  drawFigure(g, { x: 230, y: 1290, s: 1.55, facing: 1, outfit: HERO, pose: breathe(POSES.sad, t, 0.6, 3), expr: 'sleepy', rim: null, shadow: false });
  label(g, 'DUGAAN', E.W - 260, 462, 74, '#ffd400', INK, 0.08, pop(t, rel('Dugaannya', info, 0.4), 0.3));
} });

// s10 38.0–40.0: PUTUSKAN DARI SORE
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.3); const [sx, sy] = shk(t, 0.1, 0.5, 20); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.38, 350, 560, 14, c.d, -t * 0.12);
  sticker(g, 'PUTUSKAN', E.W / 2, E.H * 0.31, 165, '#fffbe8', -0.05, slamK(t, 0.1));
  sticker(g, 'DARI SORE', E.W / 2, E.H * 0.45, 175, c.hot, 0.04, slamK(t, 0.9));
  g.restore();
} });

// s11 40.0–44.0: charger di luar kamar
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.2); const fy = 1160;
  g.fillStyle = shade(c.paper, -0.12); g.fillRect(0, fy, E.W, E.H - fy); g.fillStyle = INK; g.fillRect(0, fy, E.W, 10);
  const dk = pop(t, 0.1, 0.35); g.save(); g.translate(300, fy); g.scale(1, dk);   // pintu
  rr(g, -190 + 12, -760 + 14, 380, 760, 14); g.fillStyle = INK; g.fill(); rr(g, -190, -760, 380, 760, 14); g.fillStyle = c.c; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  circle(g, 120, -360, 24, '#ffe94a'); g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.arc(120, -360, 24, 0, 6.3); g.stroke(); g.restore();
  label(g, 'KAMAR', 300, 372, 56, '#fff', INK, -0.04, pop(t, 0.3, 0.3));
  const k1 = pop(t, rel('charger', info, 0.3), 0.3);                         // colokan + kabel + HP
  if (k1 > 0) { g.save(); g.translate(720, fy - 330); g.scale(k1, k1); rr(g, -50, -70, 100, 140, 18); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); circle(g, -14, -14, 9, INK); circle(g, 14, -14, 9, INK); rr(g, -22, 18, 44, 14, 6); g.fillStyle = INK; g.fill(); g.restore();
    g.strokeStyle = INK; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(720, fy - 330 + 40); g.bezierCurveTo(720, fy - 100, 640, fy - 30, 560, fy - 40); g.stroke(); }
  const k2 = pop(t, rel('luar', info, 1.0) + 0.1, 0.3);
  if (k2 > 0) { g.save(); g.translate(500, fy - 70); g.rotate(-0.15); g.scale(k2, k2); rr(g, -60 + 8, -100 + 10, 120, 200, 24); g.fillStyle = INK; g.fill(); rr(g, -60, -100, 120, 200, 24); g.fillStyle = '#ffe94a'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
    poly(g, [[8, -60], [-26, 6], [-2, 6], [-10, 64], [28, -8], [4, -8]], c.hot); g.restore(); }
  label(g, 'CHARGER DI LUAR', E.W / 2, 260, 88, '#ffd400', INK, 0.03, pop(t, 0.9, 0.3));
  label(g, 'HP JAUH DARI KASUR', E.W / 2, 1218, 52, '#fff', INK, -0.03, pop(t, rel('jauhkan', info, 2.2), 0.3));
} });

// s12 44.0–47.25: HP malam, bubble diketik, fade kuning ke s01 (loop)
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const cx = E.W / 2, cy = E.H * 0.46;
  hpBody(g, cx, cy, 640, 1000, '#171a3d'); text(g, hhmm(23 * 60), cx, cy - 250, { size: 170, color: '#ffe94a', font: FONTS.ui, weight: 900 });
  const full = 'cuma lima menit', a = rel('cuma', info, 1.8), n = Math.floor(clamp((t - a) / 1.0) * full.length), bk = pop(t, a - 0.1, 0.3);
  if (bk > 0) { g.save(); g.translate(cx, cy + 40); g.scale(bk, bk); rr(g, -330 + 8, -80 + 10, 660, 150, 40); g.fillStyle = INK; g.fill(); rr(g, -330, -80, 660, 150, 40); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); poly(g, [[-40, 70], [-10, 130], [30, 70]], '#fff'); text(g, full.slice(0, n), 0, 0, { size: 68, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
  const f = prog(t, info.dur - 0.45, info.dur); if (f > 0) { g.fillStyle = alpha(c.a, f); g.fillRect(0, 0, E.W, E.H); }
} });
