// 01_kursi.js — #21 "Kursi Prioritas": format Potong di Puncak (cerita -> TERPUTUS -> riset -> lanjut), komik, 19 shot, ±70 dtk. Helper dari #20.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
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
const belly = (g, x, y, s, f = 1) => { const bx = x + 26 * f * s, by = y - 118 * s; circle(g, bx + 3, by + 4, 30 * s, INK); circle(g, bx, by, 30 * s, '#e8553a'); g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(bx, by, 30 * s, 0, 6.3); g.stroke(); };
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

// s01 0.0-2.6: vonis
registerShot('s01', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const tl = rel('sopan', info, 1.6), [sx, sy] = shk(t, tl, 0.25, 14); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.42, 340, 520, 14, c.c, t * 0.1);
  sticker(g, 'MINTA KURSI', E.W / 2, E.H * 0.15, 130, '#fffbe8', -0.03, pop(t, 0.1, 0.25));
  sticker(g, 'PRIORITAS', E.W / 2, E.H * 0.26, 150, '#fffbe8', 0.02, pop(t, rel('prioritas', info, 0.6), 0.25));
  sticker(g, 'NGGAK', E.W / 2, E.H * 0.39, 190, c.hot, 0.03, slamK(t, rel('nggak', info, 1.1)));
  sticker(g, 'SOPAN?', E.W / 2, E.H * 0.51, 230, c.hot, -0.03, slamK(t, tl));
  g.restore(); } });

// s02 2.6-6.0: salah menebak reaksi
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); floorBg(g, c.b, GY, c);
  const ts = rel('salah', info, 1.2);
  fig(g, { x: 330, y: GY, s: 2.6, outfit: HERO, pose: breathe(POSES.think, t, 0.5, 3), expr: t < ts ? 'worried' : 'shocked' });
  think(g, 700, 440, 520, 260, pop(t, 0.2, 0.3));
  sticker(g, 'PASTI', 700, 395, 64, c.hot, 0, pop(t, 0.35, 0.2)); sticker(g, 'DITOLAK', 700, 470, 84, c.hot, 0, pop(t, 0.5, 0.2));
  cross(g, 700, 440, 200, c.hot, 0);
  if (t > ts) { stamp(g, 'SALAH TEBAK', 540, 900, 110, c.hot, -0.05, slamK(t, ts)); }
  } });

// s03 6.0-8.5: KRL penuh jam enam sore
registerShot('s03', { draw(g, t, info) {
  const c = P(); gerbong(g, c, t, { bench: false }); crowd(g, c, t, 760, 8, 7);
  clockFace(g, 880, 190, 100, 0, c); label(g, '18:00', 880, 340, 56, c.d, INK, 0.02, pop(t, 0.1, 0.22));
  sticker(g, 'KRL PENUH', 540, 1010, 150, '#fffbe8', -0.03, slamK(t, rel('penuh', info, 1.3))); } });

// s04 8.5-13.0: Bu Wati berdiri depan kursi prioritas, cowok headphone duduk
registerShot('s04', { draw(g, t, info) {
  const c = P(); gerbong(g, c, t);
  const sp = POSES.sit; fig(g, { x: 440, y: GY - 6, s: 2.2, outfit: COWOK(c), pose: sp, expr: 'sleepy' }); { const [hx, hy] = headAt(sp, 440, GY - 6, 2.2); phones(g, hx, hy, 2.2, c.hot); }
  const wp = breathe(POSES.relaxed, t, 0.5, 3), wx = 220; fig(g, { x: wx, y: GY, s: 2.3, outfit: WATI(), pose: wp, expr: t > rel('tujuh', info, 1.2) ? 'worried' : 'neutral' }); belly(g, wx, GY, 2.3);
  label(g, 'BU WATI', 220, 860, 56, c.paper, INK, -0.03, pop(t, rel('wati', info, 0.1) - 0.05, 0.22));
  label(g, 'HAMIL 7 BULAN', 300, 1250, 56, c.c, INK, 0.02, pop(t, rel('hamil', info, 0.6) - 0.05, 0.22)); } });

// s05 13.0-15.8: close-up cowok headphone
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.2); const sp = POSES.sit, x = 520, y = 1330, s = 3.6;
  fig(g, { x, y, s, outfit: COWOK(c), pose: breathe(sp, t, 0.3, 2), expr: 'sleepy' }); { const [hx, hy] = headAt(sp, x, y, s); phones(g, hx, hy + Math.sin(t * 2) * 1.5, s, c.hot); }
  for (let i = 0; i < 3; i++) note(g, 760 + i * 70 + Math.sin(t * 3 + i) * 12, 560 - ((t * 120 + i * 90) % 280), pop(t, 0.2 + i * 0.25, 0.2), [c.d, c.c, c.a][i]);
  label(g, 'COWOK HEADPHONE', 540, 300, 64, c.d, INK, -0.02, pop(t, 0.05, 0.22));
  sticker(g, 'MATA MEREM', 540, 1000, 110, '#fffbe8', 0.03, slamK(t, rel('merem', info, 1.6))); } });

// s06 15.8-18.5: tidur beneran atau pura-pura
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); const sp = POSES.sit;
  const panel = (x, ttl, k, peek) => { g.save(); g.translate(x, 700); g.scale(k, k); rr(g, -230 + 10, -300 + 12, 460, 600, 32); g.fillStyle = INK; g.fill(); rr(g, -230, -300, 460, 600, 32); g.fillStyle = c.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore();
    if (k < 1) return; fig(g, { x, y: 940, s: 1.9, outfit: COWOK(c), pose: sp, expr: 'sleepy' }); const [hx, hy] = headAt(sp, x, 940, 1.9); phones(g, hx, hy, 1.9, c.hot);
    if (peek) { circle(g, hx + 12, hy - 4, 7.5, INK); g.fillStyle = c.paper; g.fillRect(hx + 4, hy - 7, 16, 6); }
    label(g, ttl, x, 470, 46, peek ? c.hot : c.d, peek ? '#fffbe8' : INK, 0, 1); };
  panel(300, 'TIDUR', pop(t, 0.1, 0.25) > 0.99 ? 1 : 0, false); panel(780, 'PURA-PURA', pop(t, rel('pura', info, 1.2) - 0.1, 0.25) > 0.99 ? 1 : 0, true);
  if (t > 0.1) { g.font = `900 70px "${FONTS.ui}"`; g.textAlign = 'center'; g.fillStyle = INK; g.fillText('Z z', 300, 520 + Math.sin(t * 4) * 8); }
  sticker(g, '?', 540, 1080, 260, c.hot, 0.04, slamK(t, rel('ada', info, 2.2))); } });

// s07 18.5-20.4: kaki gemetar
registerShot('s07', { draw(g, t, info) {
  const c = P(); gerbong(g, c, t, { sway: 0.4 }); const x = 520 + Math.sin(t * 38) * 4, s = 3.1, tg = rel('gemetar', info, 0.5);
  fig(g, { x, y: GY + 120, s, outfit: WATI(), pose: POSES.relaxed, expr: 'worried' }); belly(g, x, GY + 120, s);
  for (let i = 0; i < 4; i++) seg(g, [[x - 120 - i * 28, GY + 20 + i * 24], [x - 160 - i * 28, GY + 10 + i * 24]], 8, INK);
  label(g, 'KAKI GEMETAR', 540, 330, 72, c.hot, '#fffbe8', -0.02, pop(t, tg - 0.1, 0.22)); } });

// s08 20.4-23.0: narik napas, membuka mulut
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.hot, 0.14); const tm = rel('membuka', info, 1.7), z = 1 + 0.06 * prog(t, 0, 2.6);
  g.save(); g.translate(540, 900); g.scale(z, z); g.translate(-540, -900);
  fig(g, { x: 520, y: 1500, s: 4.4, outfit: WATI(), pose: breathe(POSES.stand, t, 0.8, 1), expr: t < tm ? 'nervous' : 'surprised' }); g.restore();
  const tb = rel('napas', info, 0.7); puff(g, 330, 760, prog(t, tb, tb + 0.9), c.paper);
  label(g, 'NARIK NAPAS', 360, 320, 64, c.d, INK, -0.03, pop(t, tb - 0.1, 0.22)); } });

// s09 23.0-26.2: "Mas..." lalu TERPUTUS (hening ±2,8 dtk, musik berhenti)
registerShot('s09', { draw(g, t, info) {
  const c = P(); gerbong(g, c, Math.min(t, 0.7), { sway: 0.2 });
  const sp = POSES.sit; fig(g, { x: 760, y: GY - 6, s: 2.3, outfit: COWOK(c), pose: sp, expr: 'sleepy' }); { const [hx, hy] = headAt(sp, 760, GY - 6, 2.3); phones(g, hx, hy, 2.3, c.hot); }
  fig(g, { x: 340, y: GY, s: 2.6, outfit: WATI(), pose: POSES.reach, expr: 'surprised' }); belly(g, 340, GY, 2.6);
  bubble(g, 340, 400, 420, 130, 'Mas...', c.paper, INK, pop(t, 0.03, 0.2), 78);
  const tc = 0.62; if (t > tc) { const r = rng(Math.floor(t * 14) + 3);
    g.fillStyle = alpha(INK, 0.55 * prog(t, tc, tc + 0.12)); g.fillRect(0, 0, E.W, E.H);
    for (let i = 0; i < 7; i++) { g.fillStyle = alpha(i % 2 ? c.hot : c.blue, 0.45); g.fillRect(r() * 200 - 100, r() * E.H, E.W, 6 + r() * 26); }
    stamp(g, 'TERPUTUS', 540, 960, 150, c.hot, -0.07, slamK(t, tc)); sticker(g, 'tunggu dulu...', 540, 1140, 78, '#fffbe8', 0.02, pop(t, tc + 0.5, 0.3)); } } });

// s10 26.2-31.0: takut minta bantuan, membayangkan ditolak
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); floorBg(g, c.b, GY, c); const tm = rel('menolak', info, 2.0);
  fig(g, { x: 300, y: GY, s: 2.6, outfit: HERO, pose: breathe(POSES.think, t, 0.5, 4), expr: 'nervous' }); sweat(g, 400, 640, pop(t, 0.8, 0.3));
  label(g, 'TAKUT MINTA BANTUAN', 540, 300, 62, c.d, INK, -0.02, pop(t, 0.15, 0.22));
  think(g, 720, 560, 480, 300, pop(t, rel('membayangkan', info, 1.0), 0.3));
  sticker(g, 'NGGAK!', 730, 540, 120, c.hot, -0.05, slamK(t, tm - 0.2)); } });

// s11 31.0-35.6: 2008, Flynn dan Lake
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); floorBg(g, c.c, GY, c); const te = rel('flynn', info, 1.8);
  sticker(g, '2008', 540, 360, 300, '#fffbe8', -0.03, slamK(t, rel('2008', info, 0.3)));
  fig(g, { x: 300, y: GY, s: 2.1, outfit: { top: 'labcoat', face: 'glasses', head: 'none' }, pose: breathe(POSES.explain, t, 0.4, 2), expr: 'smile' });
  fig(g, { x: 780, y: GY, s: 2.1, facing: -1, outfit: { top: 'labcoat', face: 'glasses', head: 'bun' }, pose: breathe(POSES.point, t, 0.4, 5), expr: 'smile' });
  label(g, 'FRANCIS FLYNN', 300, 700, 46, c.paper, INK, -0.02, pop(t, te - 0.1, 0.22)); label(g, 'VANESSA LAKE', 780, 700, 46, c.paper, INK, 0.02, pop(t, rel('vanessa', info, 2.4) - 0.1, 0.22)); } });

// s12 35.6-39.5: menebak, lalu benar-benar meminta
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.16);
  const card = (y, ttl, k, col) => { g.save(); g.translate(540, y); g.scale(k, k); rr(g, -440 + 10, -240 + 12, 880, 480, 34); g.fillStyle = INK; g.fill(); rr(g, -440, -240, 880, 480, 34); g.fillStyle = c.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore(); if (k > 0.99) label(g, ttl, 540, y - 275, 60, col, INK, -0.02, 1); };
  const t1 = rel('menebak', info, 0.4), t2 = rel('meminta', info, 1.9);
  card(560, '1. TEBAK DULU', pop(t, t1 - 0.2, 0.28), c.d); card(1140, '2. LALU MINTA', pop(t, t2 - 0.3, 0.28), c.hot);
  if (t > t1) { fig(g, { x: 230, y: 790, s: 1.6, outfit: HERO, pose: POSES.think, expr: 'thinking' }); bubble(g, 660, 560, 520, 130, 'berapa yang mau?', c.paper, INK, pop(t, t1 + 0.1, 0.25), 44); }
  if (t > t2 - 0.2) { fig(g, { x: 230, y: 1350, s: 1.6, outfit: HERO, pose: POSES.reach, expr: 'smile' }); fig(g, { x: 760, y: 1350, s: 1.6, facing: -1, outfit: ORANG(c.d, 'beanie', c.c), pose: POSES.relaxed, expr: 'neutral' }); bubble(g, 540, 1010, 700, 110, 'Permisi, boleh minta tolong?', c.paper, INK, pop(t, t2 + 0.1, 0.25), 42); } } });

// s13 39.5-46.9: meremehkan, meleset sampai 50 persen
registerShot('s13', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.25); const tr = rel('meremehkan', info, 0.3), tp = rel('persen', info, 3.2), base = 1060;
  const bar = (x, h, col, ttl, k) => { const hh = h * k; rr(g, x - 150 + 10, base - hh + 12, 300, hh, 20); g.fillStyle = INK; g.fill(); rr(g, x - 150, base - hh, 300, hh, 20); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); label(g, ttl, x, base + 80, 52, c.paper, INK, 0, k > 0.1 ? 1 : 0); };
  bar(260, 340, c.blue, 'TEBAKAN', ease.out(prog(t, 0.1, 0.7))); bar(620, 680, c.d, 'KENYATAAN', ease.out(prog(t, tr + 0.1, tr + 0.8)));
  if (t > tr) label(g, 'MEREMEHKAN', 540, 300, 76, c.hot, '#fffbe8', -0.03, pop(t, tr, 0.25));
  if (t > tp - 0.3) { sticker(g, 'SAMPAI 50%', 540, 520, 130, '#fffbe8', 0.03, slamK(t, tp - 0.3)); seg(g, [[260, base - 340], [620, base - 340]], 6, INK); } } });

// s14 46.9-51.5: menolak bikin nggak enak
registerShot('s14', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); floorBg(g, c.c, GY, c); const te = rel('enak', info, 3.0);
  fig(g, { x: 230, y: GY, s: 2.3, outfit: HERO, pose: breathe(POSES.reach, t, 0.4, 2), expr: 'smile' });
  fig(g, { x: 820, y: GY, s: 2.3, facing: -1, outfit: ORANG(c.d, 'beanie', c.b), pose: breathe(POSES.shrug, t, 0.6, 3), expr: t < te - 0.4 ? 'nervous' : 'worried' }); sweat(g, 700, 560, pop(t, 0.6, 0.3)); sweat(g, 930, 600, pop(t, 1.1, 0.3));
  label(g, 'MENOLAK = NGGAK ENAK', 540, 300, 60, c.hot, '#fffbe8', -0.02, pop(t, rel('menolak', info, 1.8) - 0.1, 0.22)); } });

// s15 51.5-57.2: bukan soal kursi; soal salah menebak reaksi
registerShot('s15', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.18); const ts = rel('soal', info, 1.0), tr = rel('reaksi', info, 4.2);
  g.save(); g.translate(540, 780); g.scale(1.3, 1.3); chair(g, 0, 0, c.d); g.restore(); if (t > ts) cross(g, 540, 640, 230, c.hot, pop(t, ts, 0.25));
  label(g, 'BUKAN SOAL KURSI', 540, 330, 82, c.hot, '#fffbe8', -0.03, pop(t, ts - 0.2, 0.25));
  if (t > rel('betapa', info, 3.0) - 0.2) { label(g, 'SALAH TEBAK REAKSI ORANG', 540, 1100, 56, c.d, INK, 0.02, pop(t, rel('betapa', info, 3.0) - 0.2, 0.25)); eye(g, 540, 960, 70, Math.sin(t * 1.5), 0.2, pop(t, rel('betapa', info, 3.0) - 0.2, 0.25)); } } });

// s16 57.2-61.3: LANJUT, Bu Wati minta, cowok berdiri
registerShot('s16', { draw(g, t, info) {
  const c = P(); gerbong(g, c, 1 + t * 0.3); const tu = rel('langsung', info, 2.2);
  const cp = posesAt(t, [[0, 'sit'], [tu, 'sit'], [tu + 0.4, 'stand']], 0.12); const cs = t < tu + 0.2; const cy = cs ? GY - 6 : GY;
  fig(g, { x: 440, y: cy, s: 2.2, outfit: COWOK(c), pose: cp, expr: t < tu ? 'sleepy' : 'surprised' }); { const [hx, hy] = headAt(cp, 440, cy, 2.2); phones(g, hx, hy, 2.2, c.hot, t > tu + 0.1); }
  fig(g, { x: 190, y: GY, s: 2.3, outfit: WATI(), pose: breathe(POSES.talk, t, 0.5, 2), expr: 'smile' }); belly(g, 190, GY, 2.3);
  bubble(g, 330, 600, 560, 120, 'Mas, boleh saya duduk?', c.paper, INK, pop(t, rel('boleh', info, 0.7) - 0.4, 0.25), 40);
  if (t < 0.7) { g.fillStyle = alpha(INK, 0.6 * (1 - t / 0.7)); g.fillRect(0, 0, E.W, E.H); sticker(g, 'LANJUT', 540, 800, 220, '#fffbe8', -0.05, slamK(t, 0.02) * (1 - prog(t, 0.45, 0.7))); } } });

// s17 61.3-64.0: maaf Bu, saya nggak lihat
registerShot('s17', { draw(g, t, info) {
  const c = P(); gerbong(g, c, 2 + t * 0.3, { sway: 0.5 }); const cp = POSES.shrug;
  fig(g, { x: 650, y: GY, s: 2.3, outfit: COWOK(c), pose: breathe(cp, t, 0.4, 2), expr: 'worried' }); { const [hx, hy] = headAt(cp, 650, GY, 2.3); phones(g, hx, hy, 2.3, c.hot, true); }
  fig(g, { x: 250, y: GY - 6, s: 2.2, outfit: WATI(), pose: POSES.sit, expr: 'smile' });
  bubble(g, 640, 560, 440, 110, 'Aduh, maaf Bu.', c.paper, INK, pop(t, rel('aduh', info, 0.1) - 0.05, 0.25), 48);
  bubble(g, 640, 700, 520, 110, 'Saya nggak lihat.', c.c, INK, pop(t, rel('saya', info, 1.0) - 0.05, 0.25), 48); } });

// s18 64.0-65.6: dia memang nggak lihat
registerShot('s18', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.b, 0.15); const cp = POSES.stand, x = 520, y = 1560, s = 4.0;
  fig(g, { x, y, s, outfit: COWOK(c), pose: breathe(cp, t, 0.3, 2), expr: 'awe' }); { const [hx, hy] = headAt(cp, x, y, s); phones(g, hx, hy, s, c.hot, true); }
  sticker(g, 'BENERAN', 540, 250, 120, '#fffbe8', -0.03, pop(t, 0.2, 0.25)); sticker(g, 'NGGAK LIHAT', 540, 380, 120, c.hot, 0.03, slamK(t, rel('nggak', info, 0.6))); } });

// s19 65.6-70.06: peka atau minta? (debat, tanpa vonis)
registerShot('s19', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.25); const tp = rel('peka', info, 1.4), tm = rel('minta', info, 3.4);
  fig(g, { x: 270, y: GY, s: 2.0, outfit: COWOK(c), pose: breathe(POSES.shrug, t, 0.4, 2), expr: 'smile' });
  fig(g, { x: 810, y: GY, s: 2.0, facing: -1, outfit: WATI(), pose: breathe(POSES.talk, t, 0.4, 3), expr: 'smile' }); belly(g, 810, GY, 2.0, -1);
  sticker(g, 'PEKA?', 300, 430, 130, c.blue, -0.05, slamK(t, tp)); sticker(g, 'MINTA?', 770, 430, 130, c.hot, 0.05, slamK(t, tm));
  burst(g, 540, 640, 70, 120, 10, c.c, t * 0.4); sticker(g, 'VS', 540, 640, 90, '#fffbe8', 0, pop(t, tp + 0.2, 0.2));
  label(g, 'KAMU TIM APA?', 540, 1210, 72, c.paper, INK, -0.02, pop(t, tm + 0.3, 0.25)); } });
