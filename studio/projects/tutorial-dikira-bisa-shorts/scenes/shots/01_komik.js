// 01_komik.js — #19 "Tutorial Dikira Sudah Bisa": komik, vonis di awal, 16 shot. UJI Motion Intelligence (draf nonaktif): shot s08 dan s13 punya varian A (gaya biasa) dan B (dipandu skill) lewat config.motionVariant.
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

// s01 0.0-3.5: vonis 20X
registerShot('s01', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.28); const [sx, sy] = shk(t, rel('20', info, 1.1), 0.25, 14); g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.40, 330, 520, 14, c.c, t * 0.1);
  sticker(g, 'NONTON TUTORIAL', E.W / 2, E.H * 0.13, 84, '#fffbe8', -0.04, pop(t, 0.1, 0.25));
  sticker(g, '20X', E.W / 2, E.H * 0.34, 330, '#fffbe8', 0.03, slamK(t, rel('20', info, 1.1)));
  const tn = rel('nggak', info, 1.8); label(g, 'BIKIN JAGO?', E.W / 2, E.H * 0.60, 120, c.paper, INK, -0.03, pop(t, tn - 0.05, 0.25)); cross(g, E.W / 2 + 330, E.H * 0.60, 70, c.hot, ease.outBack(prog(t, tn + 0.25, tn + 0.5)));
  g.restore(); } });

// s02 3.5-5.9: merasa jago
registerShot('s02', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.35); floorBg(g, c.b, GY, c);
  burst(g, 540, 640, 300, 470, 12, c.c, -t * 0.1);
  drawFigure(g, { x: 400, y: GY, s: 2.7, facing: 1, outfit: HERO, pose: breathe(POSES.cheer, t, 0.8, 3), expr: 'smirk', rim: null, shadow: false });
  sticker(g, 'MERASA', 640, E.H * 0.2, 170, '#fffbe8', -0.05, pop(t, rel('merasa', info, 0.5) - 0.05, 0.25));
  sticker(g, 'JAGO', 640, E.H * 0.2 + 190, 220, c.hot, 0.04, slamK(t, rel('jago', info, 1.4)));
  } });

// s03 5.9-8.5: Rafi nonton di sofa
registerShot('s03', { draw(g, t, info) {
  const c = P(); bg(g, c.paper, c.b, 0.25); floorBg(g, c.paper, GY, c);
  rr(g, 70, GY - 440, 160, 430, 36); g.fillStyle = shade(c.c, -0.1); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  drawFigure(g, { x: 300, y: GY - 12, s: 2.6, facing: 1, outfit: HERO, pose: breathe(POSES.sit, t, 0.6, 2), expr: 'smile', look: [0.9, -0.2], rim: null, shadow: false });
  rr(g, 80, GY - 190, 520, 190, 40); g.fillStyle = c.c; g.fill(); g.stroke();
  hpBody(g, 710, 820, 340, 600, c.night); skater(g, 710, 940, 0.75, t, c);
  label(g, 'SKATEBOARD', 520, 330, 100, c.d, INK, -0.03, pop(t, rel('skateboard', info, 0.7) - 0.1, 0.25));
  } });

// s04 8.5-12.7: HP besar, ollie
registerShot('s04', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); const tg = rel('kelihatannya', info, 0.9);
  hpBody(g, 540, 780, 640, 940, c.night); skater(g, 540, 1020, 1.45, t, c);
  if (t < tg - 0.05) sticker(g, 'OLLIE', 540, 220, 190, '#fffbe8', -0.04, pop(t, rel('ollie', info, 0.1) - 0.05, 0.25));
  else sticker(g, 'GAMPANG', 540, 220, 170, c.hot, 0.04, slamK(t, tg));
  } });

// s05 12.7-18.0: penghitung putar ulang
registerShot('s05', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3);
  const t1 = rel('sekali', info, 2.0), t5 = rel('lima', info, 3.2), t20 = rel('20', info, 4.4);
  const stage = t >= t20 ? 3 : t >= t5 ? 2 : t >= t1 ? 1 : 0, txt = ['', '1X', '5X', '20X'][stage], at = [0, t1, t5, t20][stage], sz = [0, 300, 380, 520][stage];
  const tp = rel('putar', info, 0.7); label(g, 'PUTAR ULANG', 540, 230, 100, c.paper, INK, 0.02, pop(t, tp - 0.05, 0.25));
  if (stage === 0) { g.save(); g.translate(540, 820); g.rotate(t * 5); g.beginPath(); g.arc(0, 0, 150, 0.6, 5.5); g.lineWidth = 46; g.strokeStyle = INK; g.stroke(); g.lineWidth = 28; g.strokeStyle = c.hot; g.stroke(); g.restore(); }
  else { const [sx, sy] = stage === 3 ? shk(t, at, 0.2, 12) : [0, 0]; sticker(g, txt, 540 + sx, 800 + sy, sz, '#fffbe8', 0.03, slamK(t, at)); }
  const n = stage === 0 ? 0 : [0, 1, 5, 20][stage]; for (let i = 0; i < n; i++) { const x = 540 + (i - (Math.min(n, 20) - 1) / 2) * 38; circle(g, x, 1100, 12, INK); circle(g, x, 1100, 7, c.hot); }
  } });

// s06 18.0-20.5: hafal
registerShot('s06', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); floorBg(g, c.b, GY, c);
  drawFigure(g, { x: 290, y: GY, s: 2.7, facing: 1, outfit: HERO, pose: breathe(POSES.talk, t, 0.5, 4), expr: 'smirk', rim: null, shadow: false });
  const rows = ['LUTUT TEKUK', 'NGEPOP', 'MENDARAT'], t0 = rel('hafal', info, 0.9) - 0.5;
  rows.forEach((r, i) => { const a = t0 + i * 0.22; label(g, r, 740, 470 + i * 190, 58, c.paper, INK, i % 2 ? 0.02 : -0.02, pop(t, a, 0.22)); check(g, 450, 470 + i * 190, 34, c.d, pop(t, a + 0.15, 0.2)); });
  } });

// s07 20.5-22.3: naik ke papan (tahan)
registerShot('s07', { draw(g, t, info) {
  const c = P(); bg(g, c.a, null); floorBg(g, c.a, GY, c);
  const up = ease.out(prog(t, rel('naik', info, 0.3), rel('naik', info, 0.3) + 0.3));
  board(g, 420, GY - 36, 0, c);
  drawFigure(g, { x: 420, y: GY - 2 - 24 * up, s: 2.6, facing: 1, outfit: HERO, pose: breathe(POSES.ready, t, 0.25, 6), expr: 'determined', rim: null, shadow: false });
  } });

// s08 22.3-25.8: papan lari, jatuh. Varian A/B (uji motion)
registerShot('s08', { draw(g, t, info) {
  const c = P(), B = MV() === 'B'; bg(g, c.a, null); floorBg(g, c.a, GY, c);
  const ts = rel('papannya', info, 0.2), imp = rel('keras', info, 1.76), S8 = 2.6;
  let sh = [0, 0], fx = 0;
  if (B) {
    // dipandu draf: sebab-akibat. Papan dipercepat (ease.in), badan tertinggal (momentum), jatuh dipercepat gravitasi, benturan, tahan, diam.
    const bx = 420 + 900 * ease.in(prog(t, ts, ts + 1.0)), lean = -0.30 * ease.in(prog(t, ts + 0.15, ts + 0.85));
    const fall = ease.in(prog(t, ts + 0.85, imp)), rot = lean + (-Math.PI / 2 * 0.97 - lean) * fall;
    const tt = t < imp ? t : (t < imp + 0.125 ? imp : t - 0.125);   // tahan benturan 3 frame (eksperimental)
    const fk = ease.in(prog(tt, ts + 0.85, imp)), ground = ease.out(prog(tt, ts + 0.2, ts + 0.6));
    const x = 420 + 70 * ease.in(prog(tt, ts + 0.1, ts + 0.9)), yFeet = lerp(GY - 26, GY, ground) + 78 * S8 * fk;
    board(g, bx, GY - 36, -0.04 * ease.in(prog(t, ts, ts + 0.5)), c);
    sh = shk(t, imp, 0.15, 8); g.save(); g.translate(sh[0], sh[1]);
    drawFigure(g, { x, y: yFeet, s: S8, facing: 1, outfit: HERO, pose: t < imp ? POSES.fall : POSES.lie, rot, expr: t < imp ? 'shocked' : 'confused', rim: null, shadow: false });
    puff(g, x - 120, GY, ease.out(prog(t, imp, imp + 0.6)), c.paper); g.restore();
  } else {
    // A: gaya biasa #17/#18: papan menyentak, tokoh jatuh cepat, guncang besar, stiker DUK, impact frame, speed lines
    const bx = 420 + 900 * ease.out(prog(t, ts, ts + 0.35)), k = ease.out(prog(t, ts + 0.1, imp));
    board(g, bx, GY - 36, 0, c); sh = shk(t, imp, 0.3, 22); g.save(); g.translate(sh[0], sh[1]);
    if (t > ts && t < imp) lines(g, t, 200, 1100, 14, alpha('#fff', 0.8), 5);
    drawFigure(g, { x: 480, y: GY + 78 * S8 * k - 24 * (1 - ease.out(prog(t, ts, ts + 0.2))), s: S8, facing: 1, outfit: HERO, pose: POSES.fall, rot: -Math.PI / 2 * 0.97 * k, expr: t < imp ? 'shocked' : 'confused', rim: null, shadow: false });
    if (t > imp) { burst(g, 400, GY - 80, 90 * clamp((t - imp) * 6), 200 * clamp((t - imp) * 6), 10, c.c, 0.2); sticker(g, 'DUK!', 560, 560, 260, '#fffbe8', -0.08, slamK(t, imp)); }
    g.restore(); if (t > imp && t < imp + 0.12) { g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); }
  }
  } });

// s09 25.8-30.6: kartu peneliti
registerShot('s09', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3);
  const kk = pop(t, 0.05, 0.3); g.save(); g.translate(540, 760); g.rotate(-0.03); g.scale(kk, kk);
  rr(g, -410 + 12, -300 + 14, 820, 600, 40); g.fillStyle = INK; g.fill(); rr(g, -410, -300, 820, 600, 40); g.fillStyle = c.paper; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); g.restore();
  sticker(g, '2018', 540, 560, 250, c.hot, -0.03, slamK(t, rel('2018', info, 0.4)));
  label(g, 'KARDAS', 330, 840, 90, c.d, INK, -0.04, pop(t, rel('kardas', info, 2.2) - 0.05, 0.22));
  label(g, "O'BRIEN", 690, 960, 90, c.c, INK, 0.04, pop(t, rel("o'brien", info, 3.0) - 0.05, 0.22));
  label(g, 'PSYCHOLOGICAL SCIENCE', 540, 330, 54, c.paper, INK, 0, pop(t, 0.5, 0.25));
  } });

// s10 30.6-34.8: 6 eksperimen, 2.225 orang
registerShot('s10', { draw(g, t, info) {
  const c = P(); bg(g, c.d, c.paper, 0.3);
  sticker(g, '6', 300, 460, 380, '#fffbe8', -0.04, slamK(t, rel('enam', info, 0.1)));
  label(g, 'EKSPERIMEN', 640, 640, 90, c.paper, INK, 0.03, pop(t, rel('eksperimen', info, 0.5) - 0.05, 0.22));
  const t2 = rel('2225', info, 1.7), n = 2225 * ease.out(prog(t, t2, t2 + 1.0));
  sticker(g, fmt(n), 540, 860, 230, c.hot, 0.02, pop(t, t2 - 0.1, 0.2));
  const shown = Math.floor(clamp(n / 2225) * 120); for (let i = 0; i < shown; i++) { const x = 150 + (i % 20) * 38, y = 1010 + Math.floor(i / 20) * 38; circle(g, x, y, 13, INK); }
  } });

// s11 34.8-39.4: 1x vs 20x dart
registerShot('s11', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2);
  const tl = rel('sekali', info, 1.7), tr = rel('lagi', info, 2.8);
  const panel = (cx, k, lbl, col) => { if (k <= 0) return; g.save(); g.translate(cx, 780); g.scale(k, k); rr(g, -190 + 10, -330 + 12, 380, 660, 36); g.fillStyle = INK; g.fill(); rr(g, -190, -330, 380, 660, 36); g.fillStyle = c.paper; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.restore(); };
  panel(270, pop(t, tl - 0.3, 0.3)); panel(690, pop(t, tr - 0.3, 0.3));
  dartBoard(g, 270, 840, 130, c, pop(t, tl - 0.2, 0.3)); dartBoard(g, 690, 840, 130, c, pop(t, tr - 0.2, 0.3));
  sticker(g, '1X', 270, 570, 150, c.blue, -0.04, pop(t, tl - 0.1, 0.25)); sticker(g, '20X', 690, 570, 150, c.hot, 0.04, pop(t, tr - 0.1, 0.25));
  label(g, 'NONTON', 270, 1090, 56, c.d, INK, 0, pop(t, tl, 0.2)); label(g, 'NONTON', 690, 1090, 56, c.d, INK, 0, pop(t, tr, 0.2));
  } });

// s12 39.4-42.3: merasa jauh lebih bisa
registerShot('s12', { draw(g, t, info) {
  const c = P(); bg(g, c.c, c.paper, 0.3); const tm = rel('merasa', info, 0.8);
  label(g, 'MERASA BISA', 540, 300, 100, c.paper, INK, -0.02, pop(t, 0.05, 0.25));
  const bar = (cx, h, col, lbl, a) => { const k = ease.out(prog(t, a, a + 0.5)); const hh = h * k; rr(g, cx - 75 + 8, 1150 - hh + 10, 150, hh, 20); g.fillStyle = INK; g.fill(); rr(g, cx - 75, 1150 - hh, 150, hh, 20); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); };
  bar(300, 170, c.blue, '1X', 0.15); bar(640, 600, c.hot, '20X', tm - 0.1);
  sticker(g, '1X', 300, 1225, 90, '#fffbe8', 0, pop(t, 0.2, 0.2)); sticker(g, '20X', 640, 1225, 90, '#fffbe8', 0, pop(t, tm, 0.2));
  } });

// s13 42.3-44.9: Lemparannya? Sama saja. Varian A/B (uji motion)
registerShot('s13', { draw(g, t, info) {
  const c = P(), B = MV() === 'B'; bg(g, c.b, c.paper, 0.3);
  const tq = rel('lemparannya', info, 0.2), ts = rel('sama', info, 1.3);
  dartBoard(g, 270, 780, 150, c); dartBoard(g, 690, 780, 150, c);
  sticker(g, '1X', 270, 540, 100, c.blue, 0, 1); sticker(g, '20X', 690, 540, 100, c.hot, 0, 1);
  if (B) {
    // dipandu draf: pertanyaan, jeda, lalu dua papan terisi sama persis, tanda sama dengan ease-out tanpa overshoot, tahan tenang
    if (t >= tq && t < ts) sticker(g, '?', 480, 780, 220, '#fffbe8', 0, ease.out(prog(t, tq, tq + 0.2)));
    const k = prog(t, ts, ts + 0.5); darts(g, 270, 780, 150, 5, k, c.hot); darts(g, 690, 780, 150, 5, k, c.hot);
    if (t >= ts) { const e = ease.out(prog(t, ts + 0.2, ts + 0.5)); sticker(g, '=', 480, 780, 220 * e, c.d, 0, e > 0 ? 1 : 0); label(g, 'SAMA SAJA', 480, 1100, 130, c.paper, INK, 0, ease.out(prog(t, ts + 0.3, ts + 0.6))); }
  } else {
    // A: gaya biasa #17/#18: tanda tanya pop, stempel SAMA SAJA slam 2,4→1 + guncang + burst
    const [sx, sy] = shk(t, ts, 0.3, 22); g.save(); g.translate(sx, sy);
    if (t >= tq && t < ts) sticker(g, '?', 480, 780, 220, '#fffbe8', 0, pop(t, tq, 0.25));
    darts(g, 270, 780, 150, 5, 1 * (t > ts ? 1 : 0), c.hot); darts(g, 690, 780, 150, 5, 1 * (t > ts ? 1 : 0), c.hot);
    if (t >= ts) { burst(g, 480, 1100, 170, 320, 12, c.c, 0.1); sticker(g, 'SAMA SAJA', 480, 1100, 150, '#fffbe8', -0.06, slamK(t, ts)); }
    g.restore();
  }
  } });

// s14 44.9-48.8: mata hafal / badan belum tahu rasanya
registerShot('s14', { draw(g, t, info) {
  const c = P(), tb = rel('badan', info, 2.2);
  if (t < tb) { bg(g, c.d, c.paper, 0.3);
    eye(g, 540, 660, 230, Math.sin(t * 3.0), 0.2, ease.outBack(prog(t, 0, 0.3)));
    ['TEKUK', 'POP', 'MENDARAT'].forEach((r, i) => label(g, r, 170 + i * 300, 1020, 52, c.paper, INK, 0, pop(t, 0.7 + i * 0.25, 0.2)));
    sticker(g, 'MATA', 540, 260, 150, '#fffbe8', -0.03, pop(t, rel('mata', info, 0.1), 0.25));
  } else { bg(g, c.c, c.paper, 0.3); floorBg(g, c.c, GY, c); const k = prog(t, tb, tb + 0.25);
    drawFigure(g, { x: 400, y: GY, s: 2.6, facing: 1, outfit: HERO, pose: POSES.ready, expr: 'worried', rim: null, shadow: false });
    sticker(g, 'BADAN', 700, 330, 150, '#fffbe8', 0.03, pop(t, tb, 0.25)); label(g, 'RASANYA?', 650, 520, 90, c.paper, INK, -0.02, pop(t, tb + 0.45, 0.22)); }
  } });

// s15 48.8-53.4: pegang alatnya, kurang pede
registerShot('s15', { draw(g, t, info) {
  const c = P(); bg(g, c.b, c.paper, 0.3); floorBg(g, c.b, GY, c);
  const p = POSES.reach, s = 2.6, x = 300; drawFigure(g, { x, y: GY, s, facing: 1, outfit: HERO, pose: breathe(p, t, 0.5, 8), expr: 'nervous', rim: null, shadow: false });
  const hx = x + p.hF[0] * s, hy = GY + p.hF[1] * s; g.save(); g.translate(hx + 20, hy - 10); g.rotate(-0.5); rr(g, -14, -90, 28, 180, 14); g.fillStyle = c.hot; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.restore();
  label(g, 'PEGANG ALATNYA', 540, 260, 78, c.paper, INK, -0.02, pop(t, rel('pegang', info, 1.0) - 0.05, 0.25));
  const tn = rel('nggak', info, 3.0); const v = 0.9 - 0.45 * ease.out(prog(t, tn, tn + 0.5));
  gauge(g, 690, 760, 130, v, c); label(g, 'PEDE', 690, 520, 90, c.paper, INK, 0.03, pop(t, rel('pede', info, 3.4) - 0.8, 0.22));
  } });

// s16 53.4-57.5: naik dulu ke papannya
registerShot('s16', { draw(g, t, info) {
  const c = P(); bg(g, c.a, c.hot, 0.2); floorBg(g, c.a, GY, c);
  const tn = rel('naik', info, 1.9), k = ease.out(prog(t, tn, tn + 0.45));
  hpBody(g, 200, GY - 150, 190, 300, c.night); sticker(g, '20X', 200, GY - 150, 70, '#fffbe8', 0, 1);
  board(g, 640, GY - 36, 0, c);
  drawFigure(g, { x: lerp(420, 640, k), y: GY - 26 * k, s: 2.6, facing: 1, outfit: HERO, pose: k < 1 ? POSES.stand : POSES.ready, expr: 'determined', rim: null, shadow: false });
  sticker(g, 'NAIK DULU', 540, 300, 150, '#fffbe8', -0.04, slamK(t, tn - 0.05));
  } });
