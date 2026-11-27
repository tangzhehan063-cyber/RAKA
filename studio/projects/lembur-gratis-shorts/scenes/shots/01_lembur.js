// 01_lembur.js — #22 "Lembur Gratis": opening layar HP (bukan vonis raksasa), perpindahan webtoon + balik halaman di TERPUTUS. Helper dari #20/#21.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose } from '/engine/rig2d.js';
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
const eye = (g, x, y, r, lx, ly, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); circle(g, 5, 7, r, INK); circle(g, 0, 0, r, '#fff'); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, r, 0, 6.3); g.stroke(); circle(g, lx * r * 0.4, ly * r * 0.4, r * 0.42, INK); circle(g, lx * r * 0.4 - r * 0.12, ly * r * 0.4 - r * 0.14, r * 0.12, '#fff'); g.restore(); };
const gauge = (g, cx, cy, r, v, c) => {   // v 0..1
  const cols = [c.d, c.a, c.hot]; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(cx, cy, r, Math.PI + i * Math.PI / 3, Math.PI + (i + 1) * Math.PI / 3); g.lineWidth = 56; g.strokeStyle = INK; g.stroke(); g.lineWidth = 40; g.strokeStyle = cols[i]; g.stroke(); }
  const a = Math.PI + clamp(v, 0, 1) * Math.PI; seg(g, [[cx, cy], [cx + Math.cos(a) * (r + 10), cy + Math.sin(a) * (r + 10)]], 16, INK); circle(g, cx, cy, 30, INK); circle(g, cx, cy, 14, '#fff');
};
const cam = (g, x, y, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -110 + 8, -70 + 10, 220, 140, 26); g.fillStyle = INK; g.fill(); rr(g, -110, -70, 220, 140, 26); g.fillStyle = '#d9d6e0'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); circle(g, 0, 6, 46, INK); circle(g, 0, 6, 32, '#46d2ff'); rr(g, -70, -96, 56, 30, 8); g.fillStyle = INK; g.fill(); g.restore(); };
const cross = (g, x, y, s, col, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-s, -s], [s, s]], 26, INK); seg(g, [[s, -s], [-s, s]], 26, INK); seg(g, [[-s, -s], [s, s]], 14, col); seg(g, [[s, -s], [-s, s]], 14, col); g.restore(); };
const floorBg = (g, col, y, c) => { g.fillStyle = shade(col, -0.12); g.fillRect(0, y, E.W, E.H - y); g.fillStyle = INK; g.fillRect(0, y, E.W, 10); };

const GY = 1130;
const MV = () => (E.cfg.motionVariant || 'B');   // uji: A = gaya biasa (kontrol), B = dipandu draf skill
const FRIENDO = (c) => ({ top: 'tshirt', color: c.blue, head: 'cap', headColor: c.a });
const board = (g, x, y, rot, c) => { g.save(); g.translate(x, y); g.rotate(rot || 0);
  rr(g, -150 + 7, -26 + 9, 300, 26, 13); g.fillStyle = INK; g.fill();
  rr(g, -150, -26, 300, 26, 13); g.fillStyle = c.hot; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  for (const wx of [-95, 95]) { circle(g, wx, 14, 22, INK); circle(g, wx, 14, 9, '#fff'); } g.restore(); };
const puff = (g, x, y, k, col) => { if (k <= 0) return; for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.1 + i * 0.2), r = 60 * k, px = x + Math.cos(a) * 160 * k * (i % 2 ? 0.8 : 1.1), py = y + Math.sin(a) * 90 * k; circle(g, px, py, r * (0.7 + 0.1 * i), alpha(col, 0.9 * (1 - k * 0.7))); g.lineWidth = 6; g.strokeStyle = alpha(INK, 0.8 * (1 - k * 0.6)); g.beginPath(); g.arc(px, py, r * (0.7 + 0.1 * i), 0, 6.3); g.stroke(); } };
// pemain skateboard kecil di layar HP (ollie berulang)
const skater = (g, cx, cy, sc, t, c) => {
  const T = 2.4, u = t % T; const k = prog(u, 1.05, 1.55), jy = Math.sin(Math.PI * k) * 150, bt = -0.4 * Math.sin(Math.PI * k);
  g.save(); g.translate(cx, cy); g.scale(sc, sc);
  g.fillStyle = INK; g.fillRect(-300, 0, 600, 8);
  board(g, 0, -36 - jy * 0.9, bt, c);
  drawFigure(g, { x: 0, y: -62 - jy * 0.9, s: 0.9, facing: 1, outfit: FRIENDO(c), pose: posesAt(u, [[0, 'stand'], [0.7, 'crouch'], [1.05, 'jump'], [1.6, 'stand']], 0.12), expr: 'happy', rim: null, shadow: false });
  g.restore(); };
const dartBoard = (g, x, y, r, c, k = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k);
  circle(g, 8, 10, r, INK); const cols = [c.paper, c.hot, c.paper, c.blue, c.hot];
  for (let i = 0; i < 5; i++) { circle(g, 0, 0, r * (1 - i * 0.2), cols[i]); g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, r * (1 - i * 0.2), 0, 6.3); g.stroke(); }
  g.restore(); };
const darts = (g, x, y, r, n, k, col) => { const pts = [[-0.45, -0.3], [0.2, 0.35], [-0.1, 0.1], [0.5, -0.2], [-0.3, 0.5]];
  for (let i = 0; i < Math.min(n, 5); i++) { const q = clamp(k * 5 - i, 0, 1); if (q <= 0) continue; const [px, py] = pts[i]; circle(g, x + px * r, y + py * r, 14 * ease.outBack(q), INK); circle(g, x + px * r, y + py * r, 8 * ease.outBack(q), col); } };
const check = (g, x, y, s, col, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-s, 0], [-s * 0.3, s * 0.7], [s, -s * 0.8]], 24, INK); seg(g, [[-s, 0], [-s * 0.3, s * 0.7], [s, -s * 0.8]], 12, col); g.restore(); };
const fmt = (n) => String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');


// gelembung chat: side 'r' = kiri-dikirim Dimas (kanan), 'l' = dari teman
const bubble = (g, x, y, w, h, str, fill, tcol, k, size = 44, who = null) => {
  if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k);
  rr(g, -w / 2 + 6, -h / 2 + 8, w, h, 36); g.fillStyle = INK; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 36); g.fillStyle = fill; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; g.fillText(str, 0, 3);
  if (who) { g.font = `800 ${size * 0.55}px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = INK; g.fillText(who, -w / 2 + 8, -h / 2 - 22); }
  g.restore(); };
const ticks = (g, x, y, s, col, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); for (const dx of [0, 22]) { seg(g, [[-s + dx, 0], [-s * 0.3 + dx, s * 0.6], [s * 0.9 + dx, -s * 0.7]], 14, INK); seg(g, [[-s + dx, 0], [-s * 0.3 + dx, s * 0.6], [s * 0.9 + dx, -s * 0.7]], 7, col); } g.restore(); };
const clockFace = (g, x, y, r, mins, c) => { circle(g, x + 8, y + 10, r, INK); circle(g, x, y, r, c.paper); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.stroke();
  const a = (mins % 60) / 60 * 6.283 - 1.5708, b = ((mins / 60) % 12) / 12 * 6.283 - 1.5708; seg(g, [[x, y], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 8, INK); seg(g, [[x, y], [x + Math.cos(b) * r * 0.5, y + Math.sin(b) * r * 0.5]], 12, INK); circle(g, x, y, 10, c.hot); };
const chair = (g, x, y, col) => { rr(g, x - 60, y - 200, 120, 130, 20); g.fillStyle = col; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); rr(g, x - 70, y - 80, 140, 24, 12); g.fillStyle = col; g.fill(); g.stroke(); seg(g, [[x - 40, y - 56], [x - 40, y]], 10, INK); seg(g, [[x + 40, y - 56], [x + 40, y]], 10, INK); };
const WATI = () => ({ top: 'dress', color: '#d64a33', head: 'bun' });
const COWOK = (c) => ({ top: 'tshirt', color: c.blue, head: 'none' });
const ORANG = (col, head = 'cap', hc = null) => ({ top: 'tshirt', color: col, head, headColor: hc || col });
const fig = (g, o) => drawFigure(g, { facing: 1, rim: null, shadow: false, ...o });
const headAt = (pose, x, y, s, f = 1) => [x + pose.head[0] * f * s, y + pose.head[1] * s];
// headphone: band di atas kepala + dua bantalan telinga
const phones = (g, hx, hy, s, col, down = false) => {
  if (down) { g.lineWidth = 8 * s; g.strokeStyle = INK; g.beginPath(); g.arc(hx, hy + 26 * s, 24 * s, 0.1, Math.PI - 0.1); g.stroke(); g.lineWidth = 4.5 * s; g.strokeStyle = col; g.stroke(); return; }
  g.lineCap = 'round'; g.lineWidth = 9 * s; g.strokeStyle = INK; g.beginPath(); g.arc(hx, hy, 31 * s, Math.PI * 1.02, Math.PI * 1.98); g.stroke();
  g.lineWidth = 5 * s; g.strokeStyle = col; g.stroke();
  for (const dx of [-31, 31]) { rr(g, hx + dx * s - 8 * s, hy - 12 * s, 16 * s, 26 * s, 6 * s); g.fillStyle = INK; g.fill(); rr(g, hx + dx * s - 5.5 * s, hy - 9.5 * s, 11 * s, 21 * s, 4 * s); g.fillStyle = col; g.fill(); }
};
const belly = (g, x, y, s, f = 1) => { const bx = x + 22 * f * s, by = y - 112 * s, br = 27 * s; circle(g, bx, by, br, '#d64a33'); g.lineWidth = 7; g.lineCap = 'round'; g.strokeStyle = shade('#d64a33', -0.38); g.beginPath(); if (f > 0) g.arc(bx, by, br, -1.05, 1.15); else g.arc(bx, by, br, Math.PI - 1.15, Math.PI + 1.05); g.stroke(); };   // menyatu dengan gaun (bukan bola berkontur hitam)
const note = (g, x, y, k, col) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.font = `900 70px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('♪', 4, 5); g.fillStyle = col; g.fillText('♪', 0, 0); g.restore(); };
const sweat = (g, x, y, k) => { if (k <= 0) return; g.save(); g.translate(x, y + 30 * (1 - k)); g.scale(k, k); poly(g, [[0, -34], [-16, 4], [16, 4]], '#7fd4ff'); circle(g, 0, 8, 16, '#7fd4ff'); g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.arc(0, 8, 16, 0, 6.3); g.stroke(); g.restore(); };
const stamp = (g, str, x, y, size, col, rot, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.font = `900 ${size}px "${FONTS.ui}"`; const w = g.measureText(str).width + size * 0.8, h = size * 1.4; g.lineWidth = 12; g.strokeStyle = col; rr(g, -w / 2, -h / 2, w, h, 18); g.stroke(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, 0, 3); g.restore(); };
const think = (g, x, y, w, h, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); circle(g, -w * 0.34, h * 0.72, 12, INK); circle(g, -w * 0.28, h * 0.5, 20, INK); g.beginPath(); g.ellipse(6, 8, w / 2, h / 2, 0, 0, 6.3); g.fillStyle = INK; g.fill(); g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 6.3); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); circle(g, -w * 0.34, h * 0.72, 9, '#fffbe8'); circle(g, -w * 0.28, h * 0.5, 15, '#fffbe8'); g.restore(); };

// gerbong KRL: dinding, jendela bergeser, bangku, tanda KURSI PRIORITAS, gantungan tangan
const gerbong = (g, c, t, o = {}) => {
  g.fillStyle = c.paper; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = shade(c.paper, -0.1); g.fillRect(0, 0, E.W, 250);
  rr(g, 40, 300, E.W - 80, 340, 28); g.fillStyle = c.b; g.fill();
  g.save(); g.beginPath(); rr(g, 40, 300, E.W - 80, 340, 28); g.clip();
  const r = rng(5); for (let i = 0; i < 9; i++) { const w = 90 + r() * 120, h = 90 + r() * 170, x = ((i * 190 - t * (o.scroll ?? 260)) % 1400 + 1400) % 1400 - 160; g.fillStyle = alpha(shade(c.b, -0.28), 0.8); g.fillRect(x, 640 - h, w, h); }
  g.restore(); g.lineWidth = 10; g.strokeStyle = INK; rr(g, 40, 300, E.W - 80, 340, 28); g.stroke(); g.fillStyle = INK; g.fillRect(E.W / 2 - 5, 300, 10, 340);
  g.fillStyle = shade(c.a, -0.18); g.fillRect(0, GY, E.W, E.H - GY); g.fillStyle = INK; g.fillRect(0, GY, E.W, 10);
  if (o.bench !== false) {
    g.fillStyle = shade(c.paper, -0.22); rr(g, -40, GY - 470, 700, 220, 20); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();   // sandaran
    rr(g, -40, GY - 250, 700, 70, 18); g.fillStyle = c.hot; g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(40, GY - 180, 20, 180); g.fillRect(540, GY - 180, 20, 180);
    rr(g, 60, 700, 520, 90, 18); g.fillStyle = c.d; g.fill(); g.stroke(); g.font = `900 46px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('KURSI PRIORITAS', 320, 747);
  }
  for (const sx of [760, 900, 1020]) { const sw = Math.sin(t * 2.2 + sx) * 10 * (o.sway ?? 1); g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.moveTo(sx, 250); g.lineTo(sx + sw, 420); g.stroke(); g.lineWidth = 8; g.beginPath(); g.arc(sx + sw, 450, 30, 0, 6.3); g.stroke(); }
};
// kerumunan siluet (bahu + kepala) di bawah
const crowd = (g, c, t, y0, n, seed) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = 40 + (i / n) * (E.W - 80) + r() * 40, y = y0 + r() * 140, sc = 0.8 + r() * 0.5, bob = Math.sin(t * 2 + i) * 6; const col = [c.blue, c.hot, c.c, c.d, c.b][i % 5];
  rr(g, x - 70 * sc, y + bob, 140 * sc, 400, 60 * sc); g.fillStyle = shade(col, -0.25); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); circle(g, x, y - 38 * sc + bob, 48 * sc, shade(col, -0.1)); g.beginPath(); g.arc(x, y - 38 * sc + bob, 48 * sc, 0, 6.3); g.stroke(); } };


const RAKA = { top: 'hoodie', color: '#d64a33', head: 'none' };
const nightBg = (c) => shade(c.night, -0.1);
// bubble multi-baris: lines = ['baris1','baris2'], side 'l' (masuk) / 'r' (keluar)
const bub2 = (g, x, y, w, lines, side, fill, tcol, k, size = 40, who = null) => { if (k <= 0) return; const lh = size * 1.25, h = lines.length * lh + 44;
  g.save(); g.translate(x, y); g.scale(k, k); rr(g, -w / 2 + 6, -h / 2 + 8, w, h, 30); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, 30); g.fillStyle = fill; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  poly(g, side === 'l' ? [[-w / 2 + 40, h / 2 - 4], [-w / 2 + 12, h / 2 + 34], [-w / 2 + 80, h / 2 - 4]] : [[w / 2 - 40, h / 2 - 4], [w / 2 - 12, h / 2 + 34], [w / 2 - 80, h / 2 - 4]], fill); g.stroke();
  g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; lines.forEach((l, i) => g.fillText(l, 0, -h / 2 + 22 + lh * (i + 0.5) + 2));
  if (who) { g.font = `800 ${size * 0.62}px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = shade(fill, -0.55); g.fillText(who, -w / 2 + 8, -h / 2 - 22); } g.restore(); };
const tas = (g, x, y, s, col) => { rr(g, x - 44 * s + 5, y - 178 * s + 6, 46 * s, 84 * s, 14 * s); g.fillStyle = INK; g.fill(); rr(g, x - 44 * s, y - 178 * s, 46 * s, 84 * s, 14 * s); g.fillStyle = col; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); };
// meja kerja + laptop menyala + siluet orang di belakang
const meja = (g, x, y, sc, c, on = true, t = 0) => { g.save(); g.translate(x, y); g.scale(sc, sc);
  rr(g, -66, -296, 132, 150, 66); g.fillStyle = shade(c.night, -0.45); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); circle(g, 0, -322, 44, shade(c.night, -0.35)); g.beginPath(); g.arc(0, -322, 44, 0, 6.3); g.stroke();
  rr(g, -112 + 8, -150 + 10, 224, 26, 8); g.fillStyle = INK; g.fill(); rr(g, -112, -150, 224, 26, 8); g.fillStyle = shade(c.paper, -0.2); g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(-92, -124, 14, 124); g.fillRect(78, -124, 14, 124);
  rr(g, -74, -250, 148, 104, 12); g.fillStyle = on ? c.b : '#333'; g.fill(); g.stroke(); if (on) { g.fillStyle = alpha('#fff', 0.7); for (let i = 0; i < 4; i++) g.fillRect(-56, -232 + i * 20, 70 - (i % 2) * 22, 8); g.fillStyle = alpha(c.b, 0.18 + 0.05 * Math.sin(t * 3 + x)); g.beginPath(); g.ellipse(0, -140, 130, 36, 0, 0, 6.3); g.fill(); } g.restore(); };
const kantor = (g, c, t, opt = {}) => { g.fillStyle = nightBg(c); g.fillRect(0, 0, E.W, E.H);
  rr(g, 60, 230, E.W - 120, 330, 22); g.fillStyle = shade(c.hot, -0.1); g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.fillStyle = alpha(c.night, 0.65); for (let i = 0; i < 7; i++) { const w = 80 + (i * 53) % 90, h = 90 + (i * 71) % 150; g.fillRect(90 + i * 135, 550 - h, w, h); }
  g.fillStyle = shade(c.night, -0.32); g.fillRect(0, GY, E.W, E.H - GY); g.fillStyle = INK; g.fillRect(0, GY, E.W, 10);
  if (opt.desks !== false) (opt.xs || [440, 640, 840, 1040]).forEach((x, i) => meja(g, x, GY, opt.sc ?? 0.78, c, opt.on !== false, t)); };
const hand = (g, x, y, k = 1, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); rr(g, -26 + 6, -80 + 8, 52, 130, 26); g.fillStyle = INK; g.fill(); rr(g, -26, -80, 52, 130, 26); g.fillStyle = '#f2c9a0'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.restore(); };
// layar chat di dalam HP (cx,cy,w,h = bodi HP): header "PAK BOS", daftar pesan, kolom ketik
const chatScreen = (g, c, cx, cy, w, h, opt = {}) => { const top = cy - h / 2;
  rr(g, cx - w / 2 + 26, top + 30, w - 52, h - 60, 46); g.fillStyle = c.paper; g.fill();
  g.save(); rr(g, cx - w / 2 + 26, top + 30, w - 52, h - 60, 46); g.clip(); g.fillStyle = shade(c.blue, -0.05); g.fillRect(cx - w / 2 + 26, top + 30, w - 52, 100);
  circle(g, cx - w / 2 + 90, top + 80, 30, c.hot); g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.arc(cx - w / 2 + 90, top + 80, 30, 0, 6.3); g.stroke(); g.font = `900 38px "${FONTS.ui}"`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#fffbe8'; g.fillText('PAK BOS', cx - w / 2 + 140, top + 80);
  if (opt.input !== false) { rr(g, cx - w / 2 + 50, cy + h / 2 - 150, w - 100, 80, 40); g.fillStyle = shade(c.paper, -0.12); g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); if (opt.typed != null) { g.font = `800 36px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = INK; const s = opt.typed + ((Math.floor((opt.t || 0) * 2.4) % 2) ? '|' : ''); g.fillText(s, cx - w / 2 + 84, cy + h / 2 - 110); } }
  g.restore(); };

// s01 0.0-3.3: OPENING BARU: layar HP gelap, jam 17:58, HP berbunyi
registerShot('s01', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); const tb = rel('bunyi', info, 2.0) - 0.05, [sx, sy] = shk(t, tb, 1.2, 10);
  g.save(); g.translate(sx, sy); hpBody(g, 540, 880, 640, 1060, shade(c.night, -0.55));
  g.font = `900 190px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = alpha('#fffbe8', 0.95 * pop(t, 0.15, 0.3)); g.fillText('17:58', 540, 760);
  g.font = `800 40px "${FONTS.ui}"`; g.fillStyle = alpha('#fffbe8', 0.55 * pop(t, 0.5, 0.3)); g.fillText('JUMAT', 540, 640);
  if (t > tb) { const k = pop(t, tb, 0.22); g.save(); g.translate(540, 1000); g.scale(k, k); rr(g, -280 + 6, -64 + 8, 560, 128, 30); g.fillStyle = INK; g.fill(); rr(g, -280, -64, 560, 128, 30); g.fillStyle = c.paper; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); circle(g, -216, 0, 34, c.hot); g.font = `900 40px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = INK; g.fillText('PAK BOS', -160, -16); g.font = `700 34px "${FONTS.ui}"`; g.fillStyle = '#555'; g.fillText('Raka', -160, 28); g.restore(); }
  g.restore(); } });

// s02 3.3-10.2: pesan atasan masuk satu per satu
registerShot('s02', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); hpBody(g, 540, 880, 700, 1100, c.paper); chatScreen(g, c, 540, 880, 700, 1100, { input: false });
  bub2(g, 430, 520, 340, ['Raka'], 'l', c.paper, INK, pop(t, rel('chat', info, 0.1) - 0.05, 0.25), 42);
  bub2(g, 470, 680, 520, ['Malam ini stay dulu ya,', 'demi tim'], 'l', c.paper, INK, pop(t, rel('stay', info, 1.7) - 0.3, 0.25), 38);
  bub2(g, 480, 880, 540, ['Uang lembur nggak ada,', 'tapi dicatat kok'], 'l', c.c, INK, pop(t, rel('uang', info, 4.4) - 0.1, 0.25), 38);
  clockFace(g, 860, 250, 76, 118, c); label(g, '17:59', 860, 360, 44, c.d, INK, 0.02, 1); } });

// s03 10.2-12.0: Raka sudah pakai tas
registerShot('s03', { draw(g, t, info) {
  const c = P(); kantor(g, c, t, { xs: [560, 740, 920, 1100], sc: 0.7 }); tas(g, 230, GY, 2.6, c.blue);
  fig(g, { x: 230, y: GY, s: 2.6, outfit: RAKA, pose: breathe(POSES.relaxed, t, 0.5, 3), expr: 'neutral' });
  label(g, 'JAM PULANG', 300, 300, 54, c.d, INK, -0.03, pop(t, 0.1, 0.22)); } });

// s04 12.0-17.7: jempol di atas layar, mengetik satu huruf
registerShot('s04', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); const ts = rel('huruf', info, 4.0), tn = rel('napas', info, 1.9);
  hpBody(g, 540, 820, 720, 1200, c.paper); chatScreen(g, c, 540, 820, 720, 1200, { typed: t > ts + 0.5 ? 'S' : '', t });
  bub2(g, 470, 380, 520, ['Malam ini stay dulu ya,', 'demi tim'], 'l', c.paper, INK, 1, 34); bub2(g, 480, 540, 540, ['Uang lembur nggak ada,', 'tapi dicatat kok'], 'l', c.c, INK, 1, 34);
  const dip = prog(t, ts, ts + 0.35); hand(g, 650, 1190 - 120 + dip * 70 + Math.sin(t * 3) * 6, 1.5, -0.35);
  if (t > tn) puff(g, 170, 1040, prog(t, tn, tn + 1.0), c.paper);
  label(g, 'SATU HURUF', 540, 250, 60, c.d, INK, -0.02, pop(t, ts - 0.2, 0.22)); } });

// s05 17.7-20.3: membeku, TERPUTUS + sudut halaman terlipat (isyarat balik halaman)
registerShot('s05', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); hpBody(g, 540, 820, 720, 1200, c.paper); chatScreen(g, c, 540, 820, 720, 1200, { typed: 'S', t: 0 });
  bub2(g, 470, 380, 520, ['Malam ini stay dulu ya,', 'demi tim'], 'l', c.paper, INK, 1, 34); bub2(g, 480, 540, 540, ['Uang lembur nggak ada,', 'tapi dicatat kok'], 'l', c.c, INK, 1, 34); hand(g, 650, 1190 - 50, 1.5, -0.35);
  const r = rng(Math.floor(t * 14) + 5); g.fillStyle = alpha(INK, 0.5); g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 6; i++) { g.fillStyle = alpha(i % 2 ? c.hot : c.blue, 0.4); g.fillRect(r() * 200 - 100, r() * E.H, E.W, 6 + r() * 24); }
  const k = pop(t, 0.15, 0.3); g.save(); g.translate(300, 260); g.rotate(-0.04); g.scale(k, k); rr(g, -250 + 8, -60 + 10, 500, 120, 6); g.fillStyle = INK; g.fill(); rr(g, -250, -60, 500, 120, 6); g.fillStyle = c.d; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.font = `900 46px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('BERSAMBUNG...', 0, 4); g.restore();
  stamp(g, 'TERPUTUS', 540, 1000, 140, c.hot, -0.06, slamK(t, 0.3));
  const f = pop(t, 0.9, 0.5); g.save(); poly(g, [[E.W - 260 * f, E.H], [E.W, E.H - 260 * f], [E.W, E.H]], c.paper); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); poly(g, [[E.W - 260 * f, E.H], [E.W - 140 * f, E.H - 140 * f], [E.W, E.H - 260 * f]], shade(c.paper, -0.25)); g.restore(); } });

// s06 20.3-25.5: halaman riset: WHO + ILO, data jam kerja banyak negara
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.3); const tw = rel('who', info, 1.8), ti = rel('ilo', info, 2.4);
  sticker(g, '2021', 540, 300, 150, c.hot, -0.03, pop(t, 0.1, 0.25));
  g.save(); g.translate(540, 820); circle(g, 8, 10, 320, INK); circle(g, 0, 0, 320, c.b); g.lineWidth = 9; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 320, 0, 6.3); g.stroke(); g.lineWidth = 5; for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(0, 0, 320 * Math.cos(i * 0.5), 320, 0, 0, 6.3); g.stroke(); } for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(-320 * Math.cos(i * 0.5), i * 120); g.lineTo(320 * Math.cos(i * 0.5), i * 120); g.stroke(); } const r = rng(4); for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = r() * 250; circle(g, Math.cos(a) * d, Math.sin(a) * d, 12 * pop(t, 0.6 + i * 0.1, 0.2), c.hot); } g.restore();
  label(g, 'WHO', 250, 1240, 70, c.d, INK, -0.04, pop(t, tw - 0.1, 0.22)); label(g, 'ILO', 680, 1240, 70, c.c, INK, 0.04, pop(t, ti - 0.1, 0.22)); } });

// s07 25.5-34.5: 55 jam+, stroke +35%, jantung +17%
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.25); const base = 1110, t35 = rel('35', info, 3.5), t17 = rel('17', info, 7.0), tj = rel('lima', info, 0.2);
  label(g, '55 JAM+ / MINGGU', 540, 280, 70, c.hot, '#fffbe8', -0.03, pop(t, tj - 0.1, 0.25));
  const bar = (x, h, col, ttl, k) => { const hh = h * k; rr(g, x - 100 + 10, base - hh + 12, 200, hh, 18); g.fillStyle = INK; g.fill(); rr(g, x - 100, base - hh, 200, hh, 18); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); label(g, ttl, x, base + 70, 38, c.paper, INK, 0, k > 0.1 ? 1 : 0); };
  bar(250, 300, c.blue, 'NORMAL', ease.out(prog(t, 0.2, 0.8))); bar(500, 405, c.hot, 'STROKE', ease.out(prog(t, t35 - 0.4, t35 + 0.3))); bar(750, 351, c.c, 'JANTUNG', ease.out(prog(t, t17 - 0.4, t17 + 0.3)));
  if (t > t35 - 0.2) sticker(g, '+35%', 470, base - 480, 80, '#fffbe8', -0.04, slamK(t, t35 - 0.2)); if (t > t17 - 0.2) sticker(g, '+17%', 790, base - 420, 80, '#fffbe8', 0.04, slamK(t, t17 - 0.2)); } });

// s08 34.5-39.7: datanya korelasi, satu malam belum tentu berbahaya
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); const tk = rel('korelasi', info, 0.3), ts = rel('satu', info, 2.4);
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M']; days.forEach((d, i) => { const x = 130 + i * 130, k = pop(t, 0.2 + i * 0.08, 0.2); if (k <= 0) return; g.save(); g.translate(x, 560); g.scale(k, k); rr(g, -50 + 6, -60 + 8, 100, 120, 14); g.fillStyle = INK; g.fill(); rr(g, -50, -60, 100, 120, 14); g.fillStyle = c.hot; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.font = `900 44px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fffbe8'; g.fillText(d, 0, 4); g.restore(); });
  label(g, 'SEMINGGU PENUH LEMBUR', 540, 420, 52, c.paper, INK, -0.02, pop(t, 0.2, 0.22));
  stamp(g, 'KORELASI', 540, 800, 110, c.paper, -0.05, slamK(t, tk));
  label(g, 'SATU MALAM', 340, 1030, 52, c.d, INK, 0.02, pop(t, ts - 0.1, 0.22)); sticker(g, '?', 700, 1030, 150, c.hot, 0.05, slamK(t, ts + 0.5)); } });

// s09 39.7-46.9: PP 35/2021, 4 jam sehari, 18 jam seminggu
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.2); const th = rel('empat', info, 3.4), tm = rel('delapan', info, 5.0);
  label(g, 'PP 35/2021', 540, 270, 72, c.d, INK, -0.03, pop(t, 0.1, 0.25));
  const card = (y, big, sm, k, col) => { if (k <= 0) return; g.save(); g.translate(500, y); g.scale(k, k); rr(g, -400 + 10, -170 + 12, 800, 340, 34); g.fillStyle = INK; g.fill(); rr(g, -400, -170, 800, 340, 34); g.fillStyle = c.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore(); sticker(g, big, 280, y, 200, col, -0.03, k); label(g, sm, 640, y + 10, 46, col, '#fffbe8', 0.02, k); };
  card(640, '4', 'JAM / HARI', pop(t, th - 0.2, 0.28), c.hot); card(1040, '18', 'JAM / MINGGU', pop(t, tm - 0.2, 0.28), c.blue); } });

// s10 46.9-55.0: persetujuan, upah wajib, pengecualian jabatan, cek perjanjian kerja
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); const t1 = rel('persetujuan', info, 0.2), t2 = rel('upahnya', info, 3.0), t3 = rel('pengecualian', info, 4.5), t4 = rel('cek', info, 7.0);
  const card = (y, ttl, mark, col, k) => { if (k <= 0) return; g.save(); g.translate(540, y); g.scale(k, k); rr(g, -440 + 10, -100 + 12, 880, 200, 30); g.fillStyle = INK; g.fill(); rr(g, -440, -100, 880, 200, 30); g.fillStyle = c.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); circle(g, -340, 0, 60, col); g.lineWidth = 7; g.beginPath(); g.arc(-340, 0, 60, 0, 6.3); g.stroke(); g.font = `900 70px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fffbe8'; g.fillText(mark, -340, 6); g.font = `900 36px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = INK; g.fillText(ttl, -255, 6); g.restore(); };
  card(420, 'HARUS SETUJU PEKERJA', '✓', c.d, pop(t, t1 - 0.1, 0.25)); card(680, 'UPAH WAJIB DIBAYAR', 'Rp', c.blue, pop(t, t2 - 0.3, 0.25)); card(940, 'ADA PENGECUALIAN JABATAN', '*', c.hot, pop(t, t3 - 0.1, 0.25));
  label(g, 'CEK PERJANJIAN KERJAMU', 540, 1190, 52, c.hot, '#fffbe8', -0.02, pop(t, t4 - 0.1, 0.25)); } });

// s11 55.0-59.0: LANJUT, Raka menghapus huruf S
registerShot('s11', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); const td = rel('menghapus', info, 1.9);
  hpBody(g, 540, 820, 720, 1200, c.paper); chatScreen(g, c, 540, 820, 720, 1200, { typed: t < td + 0.4 ? 'S' : '', t });
  bub2(g, 470, 380, 520, ['Malam ini stay dulu ya,', 'demi tim'], 'l', c.paper, INK, 1, 34); bub2(g, 480, 540, 540, ['Uang lembur nggak ada,', 'tapi dicatat kok'], 'l', c.c, INK, 1, 34);
  hand(g, 650, 1100 + Math.sin(t * 6) * 6, 1.5, -0.35); sticker(g, 'LANJUT', 540, 250, 120, '#fffbe8', -0.04, slamK(t, 0.05) * (1 - prog(t, 0.9, 1.2))); label(g, 'DIHAPUS', 540, 1260, 56, c.hot, '#fffbe8', 0.02, pop(t, td, 0.22)); } });

// s12 59.0-66.0: Raka mengetik pesan pelan
registerShot('s12', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); hpBody(g, 540, 820, 720, 1200, c.paper); chatScreen(g, c, 540, 820, 720, 1200, { input: false });
  const full = ['Pak, boleh saya lihat', 'ketentuan lemburnya dulu?', 'Kalau ada, malam ini', 'saya stay.']; const n = Math.floor(clamp((t - 0.2) / 5.0, 0, 1) * full.join(' ').length); let left = n; const shown = full.map((l) => { const s = l.slice(0, Math.max(0, left)); left -= l.length + 1; return s; });
  bub2(g, 560, 700, 560, full.map((l, i) => shown[i] || ' '), 'r', c.d, INK, pop(t, 0.1, 0.22), 36);
  label(g, 'DIKETIK PELAN', 540, 190, 56, c.d, INK, -0.02, pop(t, 0.1, 0.22)); } });

// s13 66.0-70.0: balasan atasan singkat
registerShot('s13', { draw(g, t, info) {
  const c = P(); g.fillStyle = shade(c.night, -0.45); g.fillRect(0, 0, E.W, E.H); hpBody(g, 540, 820, 720, 1200, c.paper); chatScreen(g, c, 540, 820, 720, 1200, { input: false });
  bub2(g, 560, 480, 560, ['Pak, boleh saya lihat', 'ketentuan lemburnya dulu?', 'Kalau ada, malam ini', 'saya stay.'], 'r', c.d, INK, 1, 32);
  bub2(g, 450, 780, 560, ['oke, besok kita bahas'], 'l', c.paper, INK, pop(t, rel('oke', info, 0.8) - 0.1, 0.25), 40, 'PAK BOS');
  check(g, 700, 1010, 50, c.d, pop(t, rel('oke', info, 0.8) + 0.6, 0.25)); } });

// s14 70.0-75.5: jam 18:05, Raka pulang, empat laptop masih menyala
registerShot('s14', { draw(g, t, info) {
  const c = P(); kantor(g, c, t, { xs: [100, 280, 460, 640], sc: 0.74 }); const x = lerp(560, 980, ease.inOut(prog(t, 0.2, 4.6))), ph = t * 2.4;
  rr(g, 900, GY - 360, 150, 360, 10); g.fillStyle = shade(c.paper, -0.1); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); label(g, 'EXIT', 975, GY - 400, 40, c.d, INK, 0, 1);
  tas(g, x, GY, 2.2, c.blue); fig(g, { x, y: GY, s: 2.2, facing: 1, outfit: RAKA, pose: walkPose(ph), expr: 'neutral' });
  clockFace(g, 880, 250, 76, 5, c); label(g, '18:05', 880, 360, 44, c.d, INK, 0.02, 1);
  label(g, 'EMPAT LAPTOP MASIH MENYALA', 460, 300, 46, c.hot, '#fffbe8', -0.02, pop(t, rel('laptop', info, 3.0) - 0.5, 0.25)); } });

// s15 75.5-78.9: pulang atau stay? (debat terbuka)
registerShot('s15', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.25); floorBg(g, c.a, GY, c); const tp = rel('pulang', info, 1.6), ts = rel('stay', info, 2.7);
  fig(g, { x: 540, y: GY, s: 2.6, outfit: RAKA, pose: breathe(POSES.shrug, t, 0.5, 3), expr: 'thinking' }); tas(g, 540, GY, 2.6, c.blue);
  sticker(g, 'PULANG?', 300, 330, 120, c.blue, -0.05, slamK(t, tp - 0.1)); sticker(g, 'STAY?', 760, 520, 120, c.hot, 0.05, slamK(t, ts - 0.1)); } });
