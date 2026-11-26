// 01_komik.js — #20 "Kerja Kelompok": komik, vonis di awal, 16 shot, ±60 dtk. Pola helper dari #19.
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

const MATE = (col, head) => ({ top: 'tshirt', color: col, head: 'cap', headColor: head });
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
const NAMES = ['DIMAS', 'ANDI', 'BUDI', 'CITRA', 'DEWI'];
const TCOL = (c) => [c.hot, c.blue, c.d, c.c, c.paper];

// s01 0.0-5.0: vonis
registerShot('s01', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const tl = rel('lebih', info, 2.2), [sx, sy] = shk(t, tl, 0.25, 14); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.42, 340, 520, 14, c.c, t * 0.1);
  sticker(g, 'NGAJAK ORANG', E.W / 2, E.H * 0.14, 96, '#fffbe8', -0.04, pop(t, 0.1, 0.25));
  sticker(g, 'LAIN', E.W / 2, E.H * 0.24, 130, '#fffbe8', 0.02, pop(t, 0.35, 0.25));
  sticker(g, 'LEBIH', E.W / 2, E.H * 0.38, 190, '#fffbe8', 0.03, slamK(t, tl));
  sticker(g, 'LAMA', E.W / 2, E.H * 0.50, 300, c.hot, -0.03, slamK(t, rel('lama', info, 2.7)));
  g.restore(); } });

// s01b 2.95-5.0: daripada ngerjain sendiri
registerShot('s01b', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); floorBg(g, c.b, GY, c); const ts = rel('sendiri', info, 1.2);
  drawFigure(g, { x: 320, y: GY, s: 2.7, facing: 1, outfit: HERO, pose: breathe(POSES.relaxed, t, 0.5, 3), expr: 'smirk', rim: null, shadow: false });
  label(g, 'DARIPADA', 640, 330, 80, c.paper, INK, -0.02, pop(t, rel('daripada', info, 0.1) - 0.05, 0.25));
  sticker(g, 'SENDIRI', 640, 560, 150, '#fffbe8', 0.03, slamK(t, ts)); } });

// s02 5.0-6.57: ada penelitiannya
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.35);
  const k = pop(t, 0.05, 0.3); g.save(); g.translate(540, 700); g.rotate(-0.04); g.scale(k, k);
  rr(g, -330 + 12, -400 + 14, 660, 800, 36); g.fillStyle = INK; g.fill(); rr(g, -330, -400, 660, 800, 36); g.fillStyle = c.paper; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  for (let i = 0; i < 6; i++) { rr(g, -250, -300 + i * 90, i % 3 === 2 ? 300 : 500, 30, 15); g.fillStyle = shade(c.paper, -0.18); g.fill(); }
  g.restore(); label(g, 'ADA PENELITIANNYA', 540, 1080, 70, c.d, INK, 0.02, pop(t, 0.35, 0.25)); } });

// s03 6.57-9.73: lima orang, deadline
registerShot('s03', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.25); floorBg(g, c.paper, GY, c); const cols = TCOL(c);
  NAMES.forEach((n, i) => { const x = 110 + i * 175, a = 0.15 + i * 0.12; if (t < a) return;
    drawFigure(g, { x, y: GY, s: 1.25, facing: 1, outfit: i === 0 ? HERO : MATE(cols[i], c.paper), pose: breathe(i === 0 ? POSES.talk : POSES.relaxed, t, 0.4, i + 2), expr: i === 0 ? 'smile' : 'neutral', rim: null, shadow: false });
    label(g, n, x, GY + 70, 34, c.paper, INK, 0, pop(t, a + 0.1, 0.2)); });
  sticker(g, '5', 300, 330, 300, c.hot, -0.04, slamK(t, rel('lima', info, 1.0))); label(g, 'ORANG SEKELOMPOK', 640, 330, 62, c.d, INK, 0.02, pop(t, rel('lima', info, 1.0) + 0.1, 0.22));
  const td = rel('deadline', info, 1.9); label(g, 'DEADLINE BESOK', 540, 560, 100, c.hot, '#fffbe8', -0.03, pop(t, td - 0.05, 0.25));
  } });

// s04 9.73-12.98: chat grup, centang dua
registerShot('s04', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); hpBody(g, 540, 740, 640, 1000, c.paper);
  label(g, 'GRUP KELOMPOK', 540, 330, 54, c.d, INK, 0, 1);
  const tg = rel('grup', info, 0.6), tc = rel('centang', info, 2.0);
  bubble(g, 640, 560, 440, 100, 'bagi tugas yuk', c.blue, '#fffbe8', pop(t, tg + 0.1, 0.25), 44);
  ticks(g, 800, 640, 26, '#9aa0a6', pop(t, tg + 0.3, 0.2)); if (t > tc) ticks(g, 800, 640, 26, c.blue, 1);
  if (t > tc) sticker(g, 'CENTANG 2', 540, 1040, 130, '#fffbe8', -0.03, slamK(t, tc));
  } });

// s05 12.98-17.1: sejam / dua jam
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.18); hpBody(g, 540, 760, 640, 1000, c.paper);
  const t1 = rel('sejam', info, 0.2), t2 = rel('dua', info, 1.9);
  bubble(g, 640, 450, 440, 100, 'bagi tugas yuk', c.blue, '#fffbe8', 1, 40);
  label(g, '+1 JAM', 540, 600, 66, c.d, INK, -0.02, pop(t, t1, 0.22));
  bubble(g, 440, 720, 330, 100, 'oke bro', c.paper, INK, pop(t, rel('oke', info, 1.0), 0.25), 44, 'ANDI');
  label(g, '+2 JAM', 540, 880, 66, c.hot, '#fffbe8', 0.02, pop(t, t2 - 0.1, 0.22));
  bubble(g, 500, 1040, 460, 100, 'aku bagian apa?', c.paper, INK, pop(t, rel('bagian', info, 2.7) - 0.15, 0.25), 44, 'BUDI');
  clockFace(g, 880, 280, 86, 60 + (t / 4) * 60, c); } });

// s06 17.1-20.8: lagi di jalan, stiker
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.18); hpBody(g, 540, 760, 640, 1000, c.paper);
  bubble(g, 510, 460, 440, 100, 'lagi di jalan', c.paper, INK, pop(t, rel('jalan', info, 1.0) - 0.3, 0.25), 44, 'CITRA');
  const ts = rel('stiker', info, 2.0);
  if (t > ts - 0.5) { const k = pop(t, ts - 0.5, 0.3); g.save(); g.translate(480, 820); g.scale(k, k); rr(g, -150 + 8, -140 + 10, 300, 280, 40); g.fillStyle = INK; g.fill(); rr(g, -150, -140, 300, 280, 40); g.fillStyle = c.paper; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
    poly(g, [[-80, -60], [-70, -120], [-30, -80]], c.c); poly(g, [[80, -60], [70, -120], [30, -80]], c.c); circle(g, 0, 0, 90, c.c); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 90, 0, 6.3); g.stroke(); circle(g, -30, -10, 10, INK); circle(g, 30, -10, 10, INK); seg(g, [[-16, 30], [0, 42], [16, 30]], 7, INK); g.restore();
    label(g, 'DEWI: STIKER DOANG', 540, 1080, 52, c.d, INK, 0.02, pop(t, ts, 0.22)); } } });

// s07 20.8-25.9: jam 11 malam, ngetik sendiri
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.night, c.blue, 0.15); floorBg(g, c.night, GY, c);
  [150, 330].forEach((x, i) => chair(g, x, GY, shade(c.paper, -0.1 - i * 0.05))); chair(g, 740 + 0, GY - 0, c.paper);
  rr(g, 420, GY - 330, 600, 28, 10); g.fillStyle = shade(c.b, -0.3); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); rr(g, 450, GY - 302, 24, 302, 6); g.fillStyle = shade(c.b, -0.3); g.fill(); g.stroke();
  rr(g, 520, GY - 480, 260, 150, 14); g.fillStyle = '#d9d6e0'; g.fill(); g.stroke(); rr(g, 540, GY - 466, 220, 110, 8); g.fillStyle = c.b; g.fill();
  const tl = rel('laptop', info, 2.0); const shake2 = t > tl ? Math.sin(t * 40) * 3 : 0;
  drawFigure(g, { x: 300 + 0, y: GY - 12, s: 2.5, facing: 1, outfit: HERO, pose: breathe(POSES.sit, t, 0.5, 4), expr: t < tl ? 'sleepy' : 'determined', look: [0.9, 0], rim: null, shadow: false });
  const min = 23 * 60 + Math.floor(t * 8); label(g, hhmm(min), 540, 280, 140, c.hot, '#fffbe8', -0.02, pop(t, 0.1, 0.25)); label(g, 'JAM 11 MALAM', 540, 440, 58, c.paper, INK, 0.02, pop(t, rel('11', info, 0.4), 0.22));
  label(g, 'NGETIK SENDIRI', 640, 1190, 60, c.d, INK, 0.02, pop(t, rel('sendiri', info, 4.2) - 0.1, 0.25)); void shake2; } });

// s08 25.9-28.4: jam 2 pagi kelar, kirim
registerShot('s08', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2); floorBg(g, c.a, GY, c);
  const tk = rel('kelar', info, 0.9), tg = rel('grup', info, 1.8);
  drawFigure(g, { x: 340, y: GY, s: 2.6, facing: 1, outfit: HERO, pose: breathe(t < tk ? POSES.sad : POSES.cheer, t, 0.5, 5), expr: t < tk ? 'sleepy' : 'happy', rim: null, shadow: false });
  label(g, '02:00', 540, 280, 140, c.hot, '#fffbe8', -0.02, pop(t, 0.05, 0.25)); sticker(g, 'KELAR', 740, 500, 170, '#fffbe8', 0.04, slamK(t, tk));
  const k = ease.out(prog(t, tg - 0.1, tg + 0.6)); if (k > 0) { g.save(); g.translate(540 + 300 * k, 900 - 420 * k); g.rotate(-0.4 * k); rr(g, -50, -64, 100, 128, 14); g.fillStyle = c.paper; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); seg(g, [[-26, -20], [26, -20]], 8, INK); seg(g, [[-26, 6], [26, 6]], 8, INK); g.restore(); } } });

// s09 28.4-30.9: semua langsung balas
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); hpBody(g, 540, 760, 640, 1000, c.paper);
  const tm = rel('mantap', info, 0.6) - 0.3; const rs = ['mantap, Dim', 'mantap bro', 'thx Dim', 'mantul'];
  bubble(g, 660, 450, 400, 90, 'laporan.docx', c.blue, '#fffbe8', 1, 40);
  rs.forEach((r, i) => bubble(g, 490, 600 + i * 150, 420, 100, r, c.paper, INK, pop(t, tm + i * 0.12, 0.2), 44, NAMES[i + 1]));
  sticker(g, 'LANGSUNG', 540, 1190, 80, c.hot, -0.03, pop(t, tm + 0.5, 0.25)); } });

// s10 30.9-37.5: 1979, Latane, teriak sendirian lalu ramai
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.d, c.paper, 0.3); floorBg(g, c.d, GY, c); const tr = rel('ramai-ramai', info, 5.64);
  sticker(g, '1979', 540, 190, 210, c.hot, -0.03, slamK(t, rel('1979', info, 0.1))); label(g, 'LATANÉ & TIM', 540, 380, 70, c.paper, INK, 0.02, pop(t, rel('latané', info, 0.7), 0.22));
  label(g, 'TERIAK SEKENCANG MUNGKIN', 540, 500, 56, c.c, INK, -0.01, pop(t, rel('berteriak', info, 2.4) - 0.1, 0.22));
  const n = t < tr ? 1 : 6;
  for (let i = 0; i < n; i++) { const x = n === 1 ? 540 : 170 + i * 150, a = n === 1 ? 0 : (t - tr) * 9 - i * 0.5;
    if (n > 1 && a < 0) continue; drawFigure(g, { x, y: GY, s: n === 1 ? 3.0 : 1.1, facing: 1, outfit: i === 0 ? HERO : MATE(TCOL(c)[i % 5], c.paper), pose: breathe(POSES.talk, t, 0.7, i), expr: 'surprised', rim: null, shadow: false });
    if (n === 1) lines(g, t, 560, 1000, 8, alpha(INK, 0.7), 9); }
  } });

// s11 37.5-41.5: 6 orang < 3x satu orang
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3);
  const t1 = rel('satu', info, 3.0), t6 = 0.2;
  const bar = (cx, h, col, k, dash = false) => { const hh = h * k; if (hh <= 0) return; if (dash) { g.save(); g.setLineDash([22, 16]); g.lineWidth = 9; g.strokeStyle = INK; rr(g, cx - 80, 1150 - hh, 160, hh, 20); g.stroke(); g.restore(); return; }
    rr(g, cx - 80 + 8, 1150 - hh + 10, 160, hh, 20); g.fillStyle = INK; g.fill(); rr(g, cx - 80, 1150 - hh, 160, hh, 20); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); };
  bar(200, 200, c.blue, ease.out(prog(t, t1, t1 + 0.4))); bar(480, 600, c.paper, ease.out(prog(t, rel('tiga', info, 2.4), rel('tiga', info, 2.4) + 0.4)), true); bar(760, 470, c.hot, ease.out(prog(t, t6, t6 + 0.6)));
  sticker(g, '6 ORANG', 760, 1225, 70, '#fffbe8', 0, pop(t, 0.2, 0.2)); sticker(g, '3X', 480, 1225, 70, '#fffbe8', 0, pop(t, rel('tiga', info, 2.4), 0.2)); sticker(g, '1 ORANG', 200, 1225, 70, '#fffbe8', 0, pop(t, t1, 0.2));
  sticker(g, 'KURANG DARI', 540, 250, 100, '#fffbe8', -0.03, pop(t, rel('kurang', info, 1.8) - 0.1, 0.25)); sticker(g, '3X!', 540, 400, 200, c.hot, 0.03, slamK(t, rel('tiga', info, 2.4)));
  } });

// s12 41.5-44.4: tiap orang ngirit tenaga
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); const t0 = rel('makin', info, 0.1);
  label(g, 'TIAP ORANG', 540, 250, 90, c.paper, INK, -0.02, pop(t, 0.05, 0.25)); const tg = rel('ngirit', info, 1.7); label(g, 'NGIRIT TENAGA', 540, 410, 90, c.hot, '#fffbe8', 0.02, pop(t, tg - 0.1, 0.25));
  const hs = [440, 390, 340, 295, 255, 220];
  hs.forEach((h, i) => { const x = 120 + i * 135, a = ease.out(prog(t, t0 + i * 0.1, t0 + i * 0.1 + 0.4)), cur = lerp(440, h, ease.out(prog(t, tg - 0.2, tg + 0.8)));
    rr(g, x - 50 + 7, 1100 - 440 + 9, 100, 440, 18); g.fillStyle = INK; g.fill(); rr(g, x - 50, 1100 - 440, 100, 440, 18); g.fillStyle = c.paper; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
    const hh = (i === 0 ? 440 : cur) * a; rr(g, x - 40, 1100 - hh + 10, 80, Math.max(hh - 20, 0), 12); g.fillStyle = c.d; g.fill();
    circle(g, x, 1190, 38, INK); circle(g, x, 1190, 31, c.paper); circle(g, x - 11, 1186, 5, INK); circle(g, x + 11, 1186, 5, INK); });
  } });

// s13 44.4-48.8: 10 jalur obrolan
registerShot('s13', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2); const cx = 540, cy = 720, R = 270, cols = TCOL(c);
  const pts = [0, 1, 2, 3, 4].map((i) => [cx + Math.cos(-Math.PI / 2 + i * 1.2566) * R, cy + Math.sin(-Math.PI / 2 + i * 1.2566) * R]);
  const pairs = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([i, j]);
  const t0 = rel('10', info, 0.6) - 0.1; const shown = Math.min(10, Math.floor((t - t0) * 4.5) + 1);
  pairs.forEach(([a, b], i) => { if (i >= shown || t < t0) return; seg(g, [pts[a], pts[b]], 14, INK); seg(g, [pts[a], pts[b]], 6, i % 3 === 1 && t > rel('macet', info, 3.4) ? c.hot : '#fffbe8'); });
  pts.forEach(([x, y], i) => { circle(g, x + 7, y + 9, 56, INK); circle(g, x, y, 56, i === 0 ? c.hot : cols[i]); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, 56, 0, 6.3); g.stroke(); circle(g, x - 17, y - 6, 8, INK); circle(g, x + 17, y - 6, 8, INK); });
  sticker(g, String(Math.max(0, Math.min(10, shown))), 540, 1050, 200, '#fffbe8', 0, 1); label(g, 'JALUR OBROLAN', 540, 260, 80, c.paper, INK, -0.02, pop(t, 0.1, 0.25));
  const tm = rel('macet', info, 3.4); if (t > tm) { label(g, 'MACET', 540, 1250 - 40, 80, c.hot, '#fffbe8', 0.03, pop(t, tm, 0.22)); } } });

// s14 48.8-52.5: Steiner, process loss
registerShot('s14', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); const tp = rel('process', info, 1.9);
  label(g, 'PSIKOLOG', 540, 230, 56, c.paper, INK, -0.02, pop(t, 0.05, 0.22)); label(g, 'IVAN STEINER', 540, 380, 100, c.d, INK, 0.02, pop(t, rel('steiner', info, 0.9) - 0.1, 0.25));
  const [sx, sy] = shk(t, tp, 0.25, 16); g.save(); g.translate(sx, sy); burst(g, 540, 800, 250, 380, 12, c.c, t * 0.08);
  sticker(g, 'PROCESS', 540, 740, 150, '#fffbe8', -0.03, slamK(t, tp)); sticker(g, 'LOSS', 540, 920, 240, c.hot, 0.03, slamK(t, rel('loss', info, 2.4))); g.restore(); } });

// s15 52.5-56.7: nggak lebay, sendiri lebih cepat
registerShot('s15', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); floorBg(g, c.c, GY, c); const tl = rel('lebay', info, 1.0), tc = rel('cepat', info, 3.4);
  drawFigure(g, { x: 230, y: GY, s: 2.7, facing: 1, outfit: HERO, pose: breathe(t < tl ? POSES.shrug : POSES.relaxed, t, 0.5, 6), expr: t < tl ? 'confused' : 'smirk', rim: null, shadow: false });
  label(g, 'KAMU NGGAK LEBAY', 640, 330, 70, c.paper, INK, -0.02, pop(t, 0.05, 0.25));
  sticker(g, 'SENDIRI', 640, 620, 120, '#fffbe8', 0.03, pop(t, rel('sendiri', info, 1.9) - 0.1, 0.25)); sticker(g, 'LEBIH CEPAT', 600, 790, 84, c.hot, -0.03, slamK(t, tc)); check(g, 840, 790, 36, c.d, pop(t, tc + 0.2, 0.2)); } });

// s16 56.7-60.2: sampul laporan, nama lima (loop)
registerShot('s16', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2); floorBg(g, c.a, GY, c); const tn = rel('namanya', info, 1.4);
  const k = pop(t, 0.05, 0.3); g.save(); g.translate(540, 620); g.rotate(-0.02); g.scale(k, k);
  rr(g, -330 + 12, -400 + 14, 660, 800, 30); g.fillStyle = INK; g.fill(); rr(g, -330, -400, 660, 800, 30); g.fillStyle = c.paper; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); g.restore();
  label(g, 'LAPORAN KELOMPOK', 540, 360, 52, c.d, INK, 0, pop(t, 0.2, 0.22));
  NAMES.forEach((n, i) => label(g, n, 540, 490 + i * 100, 50, i === 0 ? c.hot : c.paper, i === 0 ? '#fffbe8' : INK, i % 2 ? 0.02 : -0.02, pop(t, tn - 0.2 + i * 0.18, 0.2)));
  sticker(g, 'TETAP 5', 540, 1090, 120, c.hot, -0.03, slamK(t, tn + 1.0)); } });
