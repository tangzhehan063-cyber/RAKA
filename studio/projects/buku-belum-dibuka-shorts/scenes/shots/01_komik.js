// 01_komik.js — #18 "Buku Belum Dibuka": komik terang, vonis di awal, 18 shot.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { HERO } from '../cast.js';

const INK = '#14121a';
// palet per gaya (dipilih user lewat produksi.sh palet): a = latar utama, b = latar kedua, c = pink/aksen, d = hijau/aksen, hot = merah, blue = biru, night = latar malam
const PALS = {
  komik: { a: '#ffd400', b: '#4cc9f0', c: '#ff7ab6', d: '#7cf29c', hot: '#ff4d2e', blue: '#2f6bff', night: '#3b2f8f', paper: '#fffbe8' },
  komikMalam: { a: '#2b1b6b', b: '#6a3df0', c: '#ff3d9a', d: '#b6ff3d', hot: '#ffd400', blue: '#46d2ff', night: '#120a3a', paper: '#fff3d6' },
  komikJingga: { a: '#ff8a5b', b: '#2ec4b6', c: '#ffd166', d: '#b8f26b', hot: '#e63946', blue: '#1d4ed8', night: '#1b3a4b', paper: '#fff6e5' },
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


// ---------- helper khusus #18 ----------
const covers = () => { const c = P(); return [c.hot, c.blue, c.c, c.d, c.b, c.a]; };
// buku tertutup menghadap depan; k = skala animasi
const book = (g, cx, cy, w, h, col, k = 1, rot = 0, ttl = null, tsize = 0) => {
  if (k <= 0) return; g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(k, k);
  rr(g, -w / 2 + 12, -h / 2 + 14, w, h, 14); g.fillStyle = INK; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  g.fillStyle = alpha(INK, 0.28); g.fillRect(-w / 2 + 6, -h / 2 + 6, w * 0.1, h - 12);
  rr(g, -w / 2 + w * 0.2, -h / 2 + h * 0.12, w * 0.6, h * 0.1, 6); g.fillStyle = alpha('#fffbe8', 0.9); g.fill();
  rr(g, -w / 2 + w * 0.2, -h / 2 + h * 0.27, w * 0.4, h * 0.06, 5); g.fillStyle = alpha('#fffbe8', 0.7); g.fill();
  rr(g, -w / 2 + 14, h / 2 - 22, w - 28, 12, 6); g.fillStyle = '#fff'; g.fill();
  if (ttl) text(g, ttl, w * 0.05, h * 0.18, { size: tsize || w * 0.16, color: onBg(col), font: FONTS.ui, weight: 900 });
  g.restore();
};
const openBook = (g, cx, cy, w, h, k = 1) => {
  if (k <= 0) return; g.save(); g.translate(cx, cy); g.scale(k, k);
  const pg = (sg) => [[0, -h / 2 + 24 * 0], [sg * w / 2, -h / 2 - 26], [sg * w / 2, h / 2 - 26], [0, h / 2]];
  poly(g, pg(-1).map(([x, y]) => [x - 12, y + 16]), INK); poly(g, pg(1).map(([x, y]) => [x + 12, y + 16]), INK);
  poly(g, pg(-1), '#fffbe8'); g.lineWidth = 8; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  poly(g, pg(1), '#fffbe8'); g.stroke();
  g.strokeStyle = alpha(INK, 0.45); g.lineWidth = 8; g.lineCap = 'round';
  for (let i = 0; i < 6; i++) for (const sg of [-1, 1]) { const y0 = -h / 2 + 70 + i * (h / 8); g.beginPath(); g.moveTo(sg * 50, y0 + sg * -4); g.lineTo(sg * (w / 2 - 50), y0 - 24 * 0 + sg * 6 - 22); g.stroke(); }
  g.restore();
};
const eye = (g, x, y, r, lx, ly, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); circle(g, 5, 7, r, INK); circle(g, 0, 0, r, '#fff'); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, r, 0, 6.3); g.stroke(); circle(g, lx * r * 0.4, ly * r * 0.4, r * 0.42, INK); circle(g, lx * r * 0.4 - r * 0.12, ly * r * 0.4 - r * 0.14, r * 0.12, '#fff'); g.restore(); };
const gauge = (g, cx, cy, r, v, c) => {   // v 0..1
  const cols = [c.d, c.a, c.hot]; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(cx, cy, r, Math.PI + i * Math.PI / 3, Math.PI + (i + 1) * Math.PI / 3); g.lineWidth = 56; g.strokeStyle = INK; g.stroke(); g.lineWidth = 40; g.strokeStyle = cols[i]; g.stroke(); }
  const a = Math.PI + clamp(v, 0, 1) * Math.PI; seg(g, [[cx, cy], [cx + Math.cos(a) * (r + 10), cy + Math.sin(a) * (r + 10)]], 16, INK); circle(g, cx, cy, 30, INK); circle(g, cx, cy, 14, '#fff');
};
const cam = (g, x, y, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -110 + 8, -70 + 10, 220, 140, 26); g.fillStyle = INK; g.fill(); rr(g, -110, -70, 220, 140, 26); g.fillStyle = '#d9d6e0'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); circle(g, 0, 6, 46, INK); circle(g, 0, 6, 32, '#46d2ff'); rr(g, -70, -96, 56, 30, 8); g.fillStyle = INK; g.fill(); g.restore(); };
const cross = (g, x, y, s, col, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-s, -s], [s, s]], 26, INK); seg(g, [[s, -s], [-s, s]], 26, INK); seg(g, [[-s, -s], [s, s]], 14, col); seg(g, [[s, -s], [-s, s]], 14, col); g.restore(); };
const floorBg = (g, col, y, c) => { g.fillStyle = shade(col, -0.12); g.fillRect(0, y, E.W, E.H - y); g.fillStyle = INK; g.fillRect(0, y, E.W, 10); };
const shelf = (g, x0, x1, y, th = 26) => { rr(g, x0 + 8, y + 10, x1 - x0, th, 8); g.fillStyle = INK; g.fill(); rr(g, x0, y, x1 - x0, th, 8); g.fillStyle = '#c98a4b'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); };

// s01 0.0–2.4: BUKU DISIPLIN
registerShot('s01', { draw(g, t) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const [sx, sy] = shk(t, 0.2, 0.5, 16); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.36, 380, 580, 14, c.hot, t * 0.12);
  sticker(g, 'BUKU', E.W / 2, E.H * 0.17, 250, '#fffbe8', -0.05, slamK(t, 0.2));
  book(g, E.W / 2, E.H * 0.385, 480, 640, c.blue, ease.outBack(prog(t, 0.5, 0.85)), 0.06, 'RAJIN', 110);
  sticker(g, 'DISIPLIN', E.W / 2, E.H * 0.6, 190, c.blue, 0.04, slamK(t, 1.2));
  g.restore();
} });

// s02 2.4–4.7: buku bersegel + stempel MERASA DISIPLIN
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.22); const k = ease.outBack(prog(t, 0, 0.35));
  book(g, E.W / 2, 700, 520, 700, c.c, k, -0.05, 'RAJIN', 120);
  const bk = pop(t, 0.35, 0.28); if (bk > 0) { g.save(); g.translate(E.W / 2, 560); g.rotate(-0.28); g.scale(bk, bk); rr(g, -380 + 10, -62 + 12, 760, 124, 18); g.fillStyle = INK; g.fill(); rr(g, -380, -62, 760, 124, 18); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); text(g, 'BELUM DIBUKA', 0, 4, { size: 76, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
  const at = rel('merasa', info, 0.9), [sx, sy] = shk(t, at, 0.3, 22); g.save(); g.translate(sx, sy);
  const sk = slamK(t, at); if (sk > 0) { burst(g, E.W / 2, 1100, 190 * clamp(sk, 0, 1), 340 * clamp(sk, 0, 1), 12, c.d, 0.2); sticker(g, 'MERASA DISIPLIN', E.W / 2, 1100, 92, c.hot, -0.07, sk); }
  g.restore(); if (t > at && t < at + 0.07) { g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); }
} });

// s03 4.7–8.9: kasir, GAJIAN, dada tegak
registerShot('s03', { draw(g, t, info) {
  const c = P(); bg(g, c.d, '#fff', 0.2); const gy = 1250; floorBg(g, c.paper, gy, c);
  const heroPose = breathe(POSES.stand, t, 0.8, 2);
  drawFigure(g, { x: 770, y: gy, s: 2.6, facing: -1, outfit: { top: 'tshirt', color: c.blue, head: 'cap', headColor: c.a }, pose: breathe(POSES.talk || POSES.stand, t, 0.5, 5), expr: 'happy', rim: null, shadow: false });
  rr(g, 470 + 14, 960 + 16, 560, 290, 20); g.fillStyle = INK; g.fill(); rr(g, 470, 960, 560, 290, 20); g.fillStyle = c.c; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  const bk = pop(t, 0.5, 0.3); book(g, 640, 905, 120, 150, c.blue, bk, 0.1);
  const chest = ease.out(prog(t, rel('dada', info, 2.4) - 0.1, rel('dada', info, 2.4) + 0.4));
  drawFigure(g, { x: 270, y: gy + 4 * Math.sin(t * 3) * chest, s: 2.8, facing: 1, outfit: HERO, pose: chest > 0.2 ? { ...heroPose, head: [heroPose.head[0], heroPose.head[1] - 6] } : heroPose, expr: chest > 0.2 ? 'smirk' : 'happy', rim: null, shadow: false });
  label(g, 'GAJIAN!', E.W / 2 - 40, 270, 112, '#ffd400', INK, -0.04, pop(t, 0.05, 0.3));
  label(g, 'DADA TEGAK', 290, 650, 58, '#fff', INK, -0.06, pop(t, rel('dada', info, 2.4), 0.3));
  for (let i = 0; i < 4; i++) { const k = pop(t, 1.2 + i * 0.12, 0.25); if (k > 0) { g.save(); g.translate(620 + i * 90, 820 - 40 * Math.sin(i + t * 3)); g.rotate(0.2 * i - 0.3); g.scale(k, k); rr(g, -50, -26, 100, 52, 8); g.fillStyle = '#7cf29c'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); circle(g, 0, 0, 12, INK); g.restore(); } }
} });

// s04 8.9–11.35: rak, sampul menghadap keluar
registerShot('s04', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.2); const cv = covers();
  label(g, 'DI RAK', E.W / 2, 250, 96, '#fff', INK, -0.03, pop(t, 0.05, 0.3));
  shelf(g, 100, 980, 1160); shelf(g, 100, 980, 740);
  const old = [[0, 4, 0.5], [1, 2, 0.7], [2, 1, 0.9]];
  [[180, 1160], [340, 1160], [800, 1160], [260, 740], [440, 740], [830, 740]].forEach(([x, y], i) => book(g, x, y - 105, 130, 190, cv[(i + 2) % 6], pop(t, 0.1 + i * 0.07, 0.3), (i % 3 - 1) * 0.03));
  const nk = pop(t, rel('Bukunya', info, 0.4) + 0.1, 0.35); book(g, 600, 1160 - 135, 190, 270, c.hot, nk, 0.0, 'RAJIN', 54);
  label(g, 'SAMPUL KE DEPAN', 600, 880 - 130, 54, '#fff', INK, 0.04, pop(t, rel('menghadap', info, 1.4), 0.3));
} });

// s05 11.35–12.87: rebahan
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.08); const gy = 1200; g.fillStyle = shade(c.night, 0.18); g.fillRect(0, gy, E.W, E.H - gy); g.fillStyle = INK; g.fillRect(0, gy, E.W, 10);
  const k = ease.out(prog(t, 0, 0.3));
  drawFigure(g, { x: 760, y: gy - 30, s: 2.6, facing: 1, outfit: HERO, pose: POSES.lie, rot: -Math.PI / 2 * k, expr: 'sleepy', rim: null, shadow: false });
  sticker(g, 'REBAHAN', E.W / 2, 520, 190, '#fffbe8', -0.05, slamK(t, 0.1));
  const z = Math.sin(t * 3); sticker(g, 'z', 330, 880 - 20 * z, 120, '#fff', -0.2, 0.7 + 0.2 * z); sticker(g, 'Z', 220, 760 - 30 * z, 160, '#fff', -0.1, 0.9);
} });

// s06 12.87–15.6: 3 bulan, tiga buku
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.2); const cv = covers(); const n = Math.min(2, Math.floor(t / 0.45)); const k = ease.outBack(prog(t, 0, 0.3));
  g.save(); g.translate(E.W / 2, 520); g.scale(k, k); rr(g, -330 + 12, -220 + 14, 660, 440, 28); g.fillStyle = INK; g.fill(); rr(g, -330, -220, 660, 440, 28); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  rr(g, -330, -220, 660, 110, 28); g.fillStyle = c.hot; g.fill(); g.stroke(); text(g, 'BULAN ' + (n + 1), 0, 20, { size: 150, color: INK, font: FONTS.ui, weight: 900 }); text(g, 'KEMUDIAN', 0, -165, { size: 62, color: '#fff', font: FONTS.ui, weight: 900 }); g.restore();
  [[0, 1.05, -0.04, 500], [1, 1.45, 0.05, 330], [2, 1.85, -0.03, 190]].forEach(([i, at, r, off]) => book(g, E.W / 2 + (i - 1) * 40 + (i % 2) * 18, 1180 - (i * 150) - 90, 520, 130, cv[i], pop(t, at, 0.28), r));
  label(g, 'x3 BUKU', E.W / 2 + 230, 880, 68, '#ffd400', INK, 0.06, pop(t, 1.9, 0.3));
} });

// s07 15.6–18.5: kursus daring 0%, planner tanggal 3
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.2);
  const lk = pop(t, 0.2, 0.3); g.save(); g.translate(E.W / 2 - 20, 470); g.scale(lk, lk);
  rr(g, -330 + 12, -210 + 14, 660, 420, 24); g.fillStyle = INK; g.fill(); rr(g, -330, -210, 660, 420, 24); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  rr(g, -300, -182, 600, 364, 12); g.fillStyle = '#fff'; g.fill(); text(g, 'KURSUS DARING', 0, -120, { size: 60, color: INK, font: FONTS.ui, weight: 900 });
  rr(g, -240, -20, 480, 54, 27); g.fillStyle = '#ddd'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); text(g, '0%', 0, 90, { size: 90, color: c.hot, font: FONTS.ui, weight: 900 }); g.restore();
  const pk = pop(t, 1.3, 0.3); g.save(); g.translate(E.W / 2, 1010); g.rotate(-0.03); g.scale(pk, pk);
  rr(g, -330 + 12, -230 + 14, 660, 460, 20); g.fillStyle = INK; g.fill(); rr(g, -330, -230, 660, 460, 20); g.fillStyle = c.paper; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  text(g, 'PLANNER', 0, -180, { size: 66, color: INK, font: FONTS.ui, weight: 900 });
  for (let i = 0; i < 7; i++) { const x = -250 + (i % 4) * 165, y = -90 + Math.floor(i / 4) * 150 + 40 * 0, filled = i < 3; rr(g, x - 60, y - 45, 120, 100, 14); g.fillStyle = filled ? c.d : '#fff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); text(g, String(i + 1), x, y + 4, { size: 54, color: INK, font: FONTS.ui, weight: 900 }); if (filled) seg(g, [[x - 30, y + 24], [x - 8, y + 42], [x + 34, y - 10]], 10, INK); }
  g.restore();
  label(g, 'BARU SAMPAI 3', E.W / 2, 1320 - 20, 56, '#fff', INK, 0.03, pop(t, rel('tiga', info, 1.9), 0.3));
} });

// s08 18.5–21.8: Gollwitzer 2009
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.2, 40); const [sx, sy] = shk(t, 0.3, 0.4, 14); g.save(); g.translate(sx, sy);
  label(g, 'PETER GOLLWITZER', E.W / 2, 380, 84, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  burst(g, E.W / 2, 800, 250, 400, 14, c.c, t * 0.1); sticker(g, '2009', E.W / 2, 800, 280, c.hot, 0.04, slamK(t, rel('2009', info, 2.4) - 0.1));
  label(g, 'PSYCHOLOGICAL SCIENCE', E.W / 2, 1140, 54, '#fff', INK, 0.02, pop(t, 1.2, 0.3)); g.restore();
} });

// s09 21.8–27.97: identitas rajin, niat diketahui, bertindak lebih sedikit
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.a, '#fff', 0.2); const gy = 1250; floorBg(g, c.paper, gy, c);
  const slow = ease.inOut(prog(t, rel('sedikit', info, 4.2) - 0.3, rel('sedikit', info, 4.2) + 0.5));
  const k = rel('diketahui', info, 3.6) - 0.1;
  drawFigure(g, { x: 340 + (t < k ? 40 * Math.sin(t * 2) : 0), y: gy, s: 3.0, facing: 1, outfit: HERO, pose: breathe(slow > 0.3 ? POSES.sad : POSES.explain || POSES.stand, t, 0.8, 4), expr: slow > 0.3 ? 'worried' : 'determined', rim: null, shadow: false });
  label(g, 'ORANG RAJIN', 340, 400, 72, c.d, INK, -0.05, pop(t, rel('rajin', info, 2.2) - 0.2, 0.3));
  for (const [i, [ex, ey, r, lx, ly]] of [[620, 520, 70, -1, 0.6], [790, 440, 80, -1, 0.7], [720, 700, 66, -0.9, 0.9], [870, 640, 60, -1, 0.8]].entries()) eye(g, ex, ey, r, lx, ly, pop(t, k + i * 0.12, 0.25));
  label(g, 'DIKETAHUI ORANG', 700, 330, 56, '#fff', INK, 0.05, pop(t, k, 0.3));
  label(g, 'BERTINDAK LEBIH SEDIKIT', E.W / 2 - 20, 1160, 56, c.hot, '#fff', -0.02, pop(t, rel('sedikit', info, 4.2) - 0.1, 0.3));
} });

// s10 27.97–34.59: bar RAHASIA 2,7 vs DIKETAHUI 1,9
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.18, 40); const by = 1040;
  label(g, 'DALAM SEMINGGU', E.W / 2, 260, 82, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  g.fillStyle = INK; g.fillRect(120, by, E.W - 240, 10);
  const bars = [['RAHASIA', 2.7, c.d, 330, 0.6, 2.2], ['DIKETAHUI', 1.9, c.hot, 750, 4.1, 5.4]];
  for (const [nm, v, col, x, a0, a1] of bars) { const k = ease.out(prog(t, a0, a1)), h = (v / 2.7) * 470 * k;
    if (h > 2) { rr(g, x - 130 + 12, by - h + 14, 260, h, 16); g.fillStyle = INK; g.fill(); rr(g, x - 130, by - h, 260, h, 16); g.fillStyle = col; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); text(g, (v * k).toFixed(1).replace('.', ','), x, by - h - 70, { size: 130, color: INK, font: FONTS.ui, weight: 900 }); }
    label(g, nm, x, by + 90, 52, '#fff', INK, 0, pop(t, a0 - 0.1, 0.3)); }
  text(g, 'HARI BERTINDAK', E.W / 2, by + 175, { size: 50, color: INK, font: FONTS.ui, weight: 900 });
} });

// s11 34.59–37.17: otak mencentang sebagian tujuan
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.1); const cx = E.W / 2, cy = 760;
  label(g, 'TUJUAN: DISIPLIN', cx, 330, 76, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  const k = pop(t, 0.1, 0.35); g.save(); g.translate(cx, cy); g.scale(k, k); rr(g, -230 + 14, -230 + 16, 460, 460, 36); g.fillStyle = INK; g.fill(); rr(g, -230, -230, 460, 460, 36); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 12; g.strokeStyle = INK; g.stroke();
  const tk = ease.out(prog(t, 0.6, 1.3)); if (tk > 0) { const pts = [[-130, 10], [-40, 110], [150, -120]]; const L1 = 0.35; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = c.d; g.lineWidth = 46; g.beginPath(); g.moveTo(...pts[0]); const a = clamp(tk / L1), b = clamp((tk - L1) / (1 - L1)) * 0.5; g.lineTo(pts[0][0] + (pts[1][0] - pts[0][0]) * a, pts[0][1] + (pts[1][1] - pts[0][1]) * a); if (tk > L1) g.lineTo(pts[1][0] + (pts[2][0] - pts[1][0]) * b, pts[1][1] + (pts[2][1] - pts[1][1]) * b); g.stroke(); }
  g.restore();
  label(g, 'BARU SEBAGIAN', cx, 1130, 68, '#fff', INK, 0.03, pop(t, 1.5, 0.3));
} });

// s12 37.17–41.36: studi kecil, bukan soal buku, mirip rak
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.d, '#fff', 0.2); const cv = covers();
  sticker(g, 'STUDI KECIL', E.W / 2, 300, 140, '#fffbe8', -0.05, slamK(t, rel('kecil', info, 1.0) - 0.4));
  label(g, 'BUKAN SOAL BUKU', E.W / 2, 520, 78, '#fff', INK, 0.03, pop(t, rel('buku,', info, 1.9) - 0.1, 0.3));
  shelf(g, 160, 920, 1040); [0, 1, 2, 3].forEach((i) => book(g, 260 + i * 160, 1040 - 100, 130, 180, cv[i], pop(t, 2.3 + i * 0.1, 0.28)));
  label(g, 'POLANYA MIRIP RAK KAMU', E.W / 2, 1180, 52, c.hot, '#fff', -0.02, pop(t, rel('rak', info, 3.4) - 0.1, 0.3));
} });

// s13 41.36–45.23: Kappes & Oettingen 2011
registerShot('s13', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.c, 0.2, 40); const [sx, sy] = shk(t, 0.3, 0.4, 14); g.save(); g.translate(sx, sy);
  label(g, 'KAPPES & OETTINGEN', E.W / 2, 380, 72, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  burst(g, E.W / 2, 800, 250, 400, 14, c.b, -t * 0.1); sticker(g, '2011', E.W / 2, 800, 280, c.blue, -0.04, slamK(t, rel('2011', info, 1.9) - 0.1));
  label(g, 'JOURNAL OF EXP. SOCIAL PSYCH.', E.W / 2, 1140, 44, '#fff', INK, 0.02, pop(t, 1.5, 0.3)); g.restore();
} });

// s14 45.23–48.9: membayangkan masa depan indah, tekanan darah turun
registerShot('s14', { draw(g, t, info) {
  const c = P(); bg(g, c.c, '#fff', 0.2); const gy = 1250; floorBg(g, c.paper, gy, c);
  drawFigure(g, { x: 300, y: gy, s: 2.7, facing: 1, outfit: HERO, pose: breathe(POSES.think || POSES.stand, t, 0.6, 7), expr: 'happy', look: [0.5, -0.7], rim: null, shadow: false });
  const bk = pop(t, 0.3, 0.35); if (bk > 0) { g.save(); g.translate(300, 440); g.scale(bk, bk); circle(g, 8, 10, 190, INK); circle(g, 0, 0, 190, '#fff'); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 190, 0, 6.3); g.stroke(); circle(g, 0, 20, 90, '#ffd400'); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t; seg(g, [[Math.cos(a) * 110, 20 + Math.sin(a) * 110], [Math.cos(a) * 140, 20 + Math.sin(a) * 140]], 10, '#ffd400'); } g.restore(); }
  label(g, 'MASA DEPAN INDAH', 300, 205, 46, '#fff', INK, -0.03, pop(t, 0.6, 0.3));
  const gv = lerp(0.5, 0.12, ease.inOut(prog(t, rel('lebih', info, 1.8), rel('lebih', info, 1.8) + 0.9)));
  gauge(g, 760, 840, 170, gv, c); label(g, 'TEKANAN DARAH', 760, 600, 52, '#fff', INK, 0.04, pop(t, 0.9, 0.3));
  label(g, 'LEBIH RENDAH', 760, 990, 62, c.d, INK, -0.03, pop(t, rel('lebih', info, 1.8) + 0.4, 0.3));
} });

// s15 48.9–52.48: tenaga turun vs memikirkan hambatan
registerShot('s15', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.08); const cx = E.W / 2, w = 560, h = 240, cy = 430;
  const lv = lerp(0.6, 0.1, ease.inOut(prog(t, 0.2, 1.5))), flick = lv < 0.2 && Math.sin(t * 22) > 0.2;
  rr(g, cx + w / 2 + 6, cy - 44, 40, 88, 14); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  rr(g, cx - w / 2 + 14, cy - h / 2 + 16, w, h, 34); g.fillStyle = INK; g.fill(); rr(g, cx - w / 2, cy - h / 2, w, h, 34); g.fillStyle = '#12151f'; g.fill(); g.lineWidth = 9; g.strokeStyle = '#fff'; g.stroke();
  rr(g, cx - w / 2 + 20, cy - h / 2 + 20, Math.max(18, (w - 40) * lv), h - 40, 18); g.fillStyle = lv > 0.3 ? c.a : (flick ? '#fff' : c.hot); g.fill();
  label(g, 'TENAGA TURUN', cx, 230, 78, '#fffbe8', INK, -0.03, pop(t, 0.1, 0.3));
  const hk = rel('hambatannya', info, 2.0) - 0.4, gy = 1250; floorBg(g, shade(c.night, 0.3), gy, c);
  drawFigure(g, { x: 270, y: gy, s: 2.5, facing: 1, outfit: HERO, pose: breathe(POSES.ready, t, 0.8, 3), expr: 'determined', rim: null, shadow: false });
  const gk = pop(t, hk, 0.3); if (gk > 0) { g.save(); g.translate(740, 880); g.scale(gk, gk); gauge(g, 0, 140, 170, lerp(0.5, 0.75, ease.out(prog(t, hk, hk + 0.7))), c); g.restore(); }
  label(g, 'MIKIR HAMBATAN', 500, 680 + 10, 56, '#fff', INK, 0.03, pop(t, hk - 0.1, 0.3));
} });

// s16 52.48–56.34: BUKA SATU
registerShot('s16', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const [sx, sy] = shk(t, 0.1, 0.5, 18); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.4, 360, 560, 14, c.d, -t * 0.12);
  sticker(g, 'BUKA', E.W / 2, E.H * 0.21, 240, '#fffbe8', -0.05, slamK(t, 0.1));
  sticker(g, 'SATU', E.W / 2, E.H * 0.34, 240, c.hot, 0.04, slamK(t, 0.9)); g.restore();
  openBook(g, E.W / 2, 1010, 760, 380, pop(t, 1.5, 0.35));
  label(g, 'YANG SUDAH ADA', E.W / 2, 1230, 60, '#fff', INK, -0.03, pop(t, rel('sudah', info, 2.6), 0.3));
} });

// s17 56.34–60.86: baca satu halaman dulu, sebelum foto / cerita
registerShot('s17', { draw(g, t, info) {
  const c = P(); bg(g, c.b, '#fff', 0.2); const k = pop(t, 0.05, 0.35); g.save(); g.translate(E.W / 2, 560); g.scale(k, k);
  rr(g, -290 + 14, -330 + 16, 580, 660, 24); g.fillStyle = INK; g.fill(); rr(g, -290, -330, 580, 660, 24); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  text(g, '1', 0, -190, { size: 220, color: c.hot, font: FONTS.ui, weight: 900 });
  g.strokeStyle = alpha(INK, 0.5); g.lineWidth = 10; g.lineCap = 'round'; const fl = prog(t, 0.5, 2.4); for (let i = 0; i < 6; i++) { const f = clamp(fl * 6 - i); g.beginPath(); g.moveTo(-220, -30 + i * 62); g.lineTo(-220 + 440 * f, -30 + i * 62); g.stroke(); }
  g.restore();
  label(g, 'BACA 1 HALAMAN DULU', E.W / 2, 210, 62, '#ffd400', INK, -0.03, pop(t, 0.1, 0.3));
  const ck = rel('foto', info, 2.2); cam(g, 290, 1090, pop(t, ck - 0.2, 0.3)); cross(g, 290, 1090, 110, c.hot, pop(t, ck + 0.35, 0.25));
  const bk = rel('ceritakan', info, 3.2); const sb = pop(t, bk - 0.2, 0.3); if (sb > 0) { g.save(); g.translate(740, 1090); g.scale(sb, sb); rr(g, -150 + 8, -80 + 10, 300, 150, 40); g.fillStyle = INK; g.fill(); rr(g, -150, -80, 300, 150, 40); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); poly(g, [[-40, 66], [-70, 120], [0, 70]], '#fff'); text(g, 'cerita...', 0, -4, { size: 54, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
  cross(g, 740, 1090, 130, c.hot, pop(t, bk + 0.35, 0.25));
} });

// s18 60.86–64.18: toko buku buka, fade kuning ke s01 (loop)
registerShot('s18', { draw(g, t, info) {
  const c = P(); bg(g, c.night, '#fff', 0.08); const gy = 1250; floorBg(g, shade(c.night, 0.25), gy, c);
  label(g, 'BESOK GAJIAN', E.W / 2, 250, 90, '#ffd400', INK, -0.03, pop(t, 0.05, 0.3));
  const k = ease.out(prog(t, 0.3, 0.8)); g.save(); g.translate(E.W / 2 - 70, gy); g.scale(1, k);
  rr(g, -420 + 14, -820 + 16, 840, 820, 14); g.fillStyle = INK; g.fill(); rr(g, -420, -820, 840, 820, 14); g.fillStyle = c.paper; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  rr(g, -420, -820, 840, 160, 14); g.fillStyle = c.hot; g.fill(); g.stroke(); text(g, 'TOKO BUKU', 0, -738, { size: 100, color: '#fff', font: FONTS.ui, weight: 900 });
  for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#fff' : c.a; g.fillRect(-420 + i * 140, -660, 140, 70); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-420 + i * 140, -660, 140, 70); }
  rr(g, -320, -560, 250, 560, 10); g.fillStyle = c.b; g.fill(); g.lineWidth = 9; g.stroke(); circle(g, -110, -280, 18, '#ffd400');
  rr(g, -20, -540, 360, 260, 12); g.fillStyle = shade(c.b, 0.4); g.fill(); g.stroke(); const cv = covers(); [0, 1, 2, 3].forEach((i) => book(g, 20 + i * 85, -330, 60, 100, cv[i], 1, 0));
  g.restore();
  const bk = pop(t, rel('buka', info, 1.9) - 0.2, 0.3); if (bk > 0) { g.save(); g.translate(E.W / 2 + 150, 900); g.rotate(-0.1); g.scale(bk, bk); label(g, 'BUKA', 0, 0, 90, c.d, INK, 0, 1); g.restore(); }
  const f = prog(t, info.dur - 0.45, info.dur); if (f > 0) { g.fillStyle = alpha(c.a, f); g.fillRect(0, 0, E.W, E.H); }
} });
