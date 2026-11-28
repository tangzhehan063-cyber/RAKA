// cover #23 (helper disalin dari 01_disuruh.js) — #23 "Disuruh Jadi Males": opening INSERT tangan meraih sapu (bukan vonis raksasa / layar HP), Potong di Puncak. Helper dari #20-#22.
import { E, S, registerShot, wordTime, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { HERO } from '../cast.js';
const shade2 = shade;
const INK = '#14121a';
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
const shk = (t, at, dur = 0.3, amp = 22) => (t > at && t < at + dur ? shake(t, amp, 40) : [0, 0]);
const floorBg = (g, col, y, c) => { g.fillStyle = shade(col, -0.12); g.fillRect(0, y, E.W, E.H - y); g.fillStyle = INK; g.fillRect(0, y, E.W, 10); };
const GY = 1130;
const check = (g, x, y, s, col, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); seg(g, [[-s, 0], [-s * 0.3, s * 0.7], [s, -s * 0.8]], 24, INK); seg(g, [[-s, 0], [-s * 0.3, s * 0.7], [s, -s * 0.8]], 12, col); g.restore(); };
const bubble = (g, x, y, w, h, str, fill, tcol, k, size = 44, who = null) => {
  if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k);
  rr(g, -w / 2 + 6, -h / 2 + 8, w, h, 36); g.fillStyle = INK; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 36); g.fillStyle = fill; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; g.fillText(str, 0, 3);
  if (who) { g.font = `800 ${size * 0.55}px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = INK; g.fillText(who, -w / 2 + 8, -h / 2 - 22); }
  g.restore(); };
const clockFace = (g, x, y, r, mins, c) => { circle(g, x + 8, y + 10, r, INK); circle(g, x, y, r, c.paper); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.stroke();
  const a = (mins % 60) / 60 * 6.283 - 1.5708, b = ((mins / 60) % 12) / 12 * 6.283 - 1.5708; seg(g, [[x, y], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 8, INK); seg(g, [[x, y], [x + Math.cos(b) * r * 0.5, y + Math.sin(b) * r * 0.5]], 12, INK); circle(g, x, y, 10, c.hot); };
const fig = (g, o) => drawFigure(g, { facing: 1, rim: null, shadow: false, ...o });
const sweat = (g, x, y, k) => { if (k <= 0) return; g.save(); g.translate(x, y + 30 * (1 - k)); g.scale(k, k); poly(g, [[0, -34], [-16, 4], [16, 4]], '#7fd4ff'); circle(g, 0, 8, 16, '#7fd4ff'); g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.arc(0, 8, 16, 0, 6.3); g.stroke(); g.restore(); };
const stamp = (g, str, x, y, size, col, rot, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.font = `900 ${size}px "${FONTS.ui}"`; const w = g.measureText(str).width + size * 0.8, h = size * 1.4; g.lineWidth = 12; g.strokeStyle = col; rr(g, -w / 2, -h / 2, w, h, 18); g.stroke(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, 0, 3); g.restore(); };
const think = (g, x, y, w, h, k) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); circle(g, -w * 0.34, h * 0.72, 12, INK); circle(g, -w * 0.28, h * 0.5, 20, INK); g.beginPath(); g.ellipse(6, 8, w / 2, h / 2, 0, 0, 6.3); g.fillStyle = INK; g.fill(); g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 6.3); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); circle(g, -w * 0.34, h * 0.72, 9, '#fffbe8'); circle(g, -w * 0.28, h * 0.5, 15, '#fffbe8'); g.restore(); };
const bub2 = (g, x, y, w, lines, side, fill, tcol, k, size = 40, who = null) => { if (k <= 0) return; const lh = size * 1.25, h = lines.length * lh + 44;
  g.save(); g.translate(x, y); g.scale(k, k); rr(g, -w / 2 + 6, -h / 2 + 8, w, h, 30); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, 30); g.fillStyle = fill; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  poly(g, side === 'l' ? [[-w / 2 + 40, h / 2 - 4], [-w / 2 + 12, h / 2 + 34], [-w / 2 + 80, h / 2 - 4]] : [[w / 2 - 40, h / 2 - 4], [w / 2 - 12, h / 2 + 34], [w / 2 - 80, h / 2 - 4]], fill); g.stroke();
  g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tcol; lines.forEach((l, i) => g.fillText(l, 0, -h / 2 + 22 + lh * (i + 0.5) + 2));
  if (who) { g.font = `800 ${size * 0.62}px "${FONTS.ui}"`; g.textAlign = 'left'; g.fillStyle = shade(fill, -0.55); g.fillText(who, -w / 2 + 8, -h / 2 - 22); } g.restore(); };
const hand = (g, x, y, k = 1, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); rr(g, -26 + 6, -80 + 8, 52, 130, 26); g.fillStyle = INK; g.fill(); rr(g, -26, -80, 52, 130, 26); g.fillStyle = '#f2c9a0'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.restore(); };

// ---------- set & properti #23 ----------
const DIO = { top: 'tshirt', color: '#d64a33', head: 'none' };
const SKIN = '#f2c9a0', WOOD = '#c98a4b', STRAW = '#e8b04a';
const wallC = (c) => shade(c.a, 0.55);
const handW = (o) => { const p = o.pose, s = o.s, f = o.facing ?? 1; return [o.x + p.hF[0] * f * s, o.y + p.hF[1] * s]; };
// sapu: gagang dari (x0,y0) ke ujung (x1,y1), ijuk di ujung bawah
const sapu = (g, x0, y0, x1, y1, w = 14) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux;
  seg(g, [[x0, y0], [x1, y1]], w + 10, INK); seg(g, [[x0, y0], [x1, y1]], w, WOOD);
  const bx = x1 - ux * w * 0.6, by = y1 - uy * w * 0.6; seg(g, [[bx - px * w * 1.2, by - py * w * 1.2], [bx + px * w * 1.2, by + py * w * 1.2]], w * 1.3, '#d64a33');   // ikatan merah
  const a = [x1 - px * w * 1.6, y1 - py * w * 1.6], b = [x1 + px * w * 1.6, y1 + py * w * 1.6], cc = [x1 + px * w * 4.2 + ux * w * 5, y1 + py * w * 4.2 + uy * w * 5], d = [x1 - px * w * 4.2 + ux * w * 5, y1 - py * w * 4.2 + uy * w * 5];
  poly(g, [a, b, cc, d], STRAW); g.lineWidth = 6; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  g.lineWidth = 3; for (let i = 1; i < 6; i++) { const k = i / 6; g.beginPath(); g.moveTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); g.lineTo(lerp(d[0], cc[0], k), lerp(d[1], cc[1], k)); g.stroke(); } };
// sapu yang dipegang: lewat tangan menuju titik lantai (fx, fy)
const sapuPegang = (g, hx, hy, fx, fy, sc = 1) => { const dx = fx - hx, dy = fy - hy, L = Math.hypot(dx, dy) || 1; const up = 120 * sc; sapu(g, hx - dx / L * up, hy - dy / L * up, fx - dx / L * 40 * sc, fy - dy / L * 40 * sc, 12 * sc); };
// kepalan tangan besar (insert)
const fist = (g, x, y, s, rot, close) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -70 + 8, -10 + 10, 150, 300, 60); g.fillStyle = INK; g.fill(); rr(g, -70, -10, 150, 300, 60); g.fillStyle = '#d64a33'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();   // lengan kaos
  rr(g, -80, -150, 160, 170, 60); g.fillStyle = SKIN; g.fill(); g.stroke();
  for (let i = 0; i < 4; i++) { const fx = -60 + i * 40, L = lerp(120, 40, close); rr(g, fx - 18, -150 - L, 36, L + 30, 18); g.fillStyle = SKIN; g.fill(); g.stroke(); }
  rr(g, 60, -110, 70, 36, 18); g.fillStyle = SKIN; g.fill(); g.stroke(); g.restore(); };
const window_ = (g, c, x, y, w, h, t) => { rr(g, x + 10, y + 12, w, h, 16); g.fillStyle = INK; g.fill(); rr(g, x, y, w, h, 16); g.fillStyle = shade(c.b, 0.35); g.fill();
  g.save(); rr(g, x, y, w, h, 16); g.clip(); circle(g, x + w * 0.7, y + h * 0.35, 60, c.c); g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(x + w * 0.7, y + h * 0.35, 60, 0, 6.3); g.stroke(); g.fillStyle = alpha('#fff', 0.8); g.beginPath(); g.ellipse(x + w * 0.3 + Math.sin(t * 0.3) * 20, y + h * 0.62, 90, 26, 0, 0, 6.3); g.fill(); g.restore();
  g.lineWidth = 10; g.strokeStyle = INK; rr(g, x, y, w, h, 16); g.stroke(); seg(g, [[x + w / 2, y], [x + w / 2, y + h]], 9, INK); seg(g, [[x, y + h / 2], [x + w, y + h / 2]], 9, INK); };
const pintuDapur = (g, c, t, glow = 0) => { const x = 40, w = 230, top = 470; rr(g, x - 16, top - 16, w + 32, GY - top + 16, 12); g.fillStyle = shade(c.a, -0.35); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  g.fillStyle = shade(c.night, -0.1); g.fillRect(x, top, w, GY - top); g.fillStyle = alpha(c.c, 0.35 + 0.35 * glow); g.fillRect(x, top, w, GY - top);
  rr(g, x + 40, top + 60, 150, 26, 8); g.fillStyle = alpha(shade(c.c, -0.3), 0.8); g.fill(); g.font = `900 34px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = alpha(INK, 0.75); g.fillText('DAPUR', x + w / 2, top - 46); };
const sofa = (g, c, x, y) => { rr(g, x - 200 + 10, y - 230 + 12, 400, 230, 40); g.fillStyle = INK; g.fill(); rr(g, x - 200, y - 230, 400, 150, 40); g.fillStyle = shade(c.blue, 0.1); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); rr(g, x - 210, y - 120, 420, 90, 30); g.fillStyle = c.blue; g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(x - 180, y - 30, 22, 30); g.fillRect(x + 158, y - 30, 22, 30); };
const hpTergeletak = (g, x, y, s = 1) => { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -70 + 6, -20 + 8, 140, 40, 12); g.fillStyle = INK; g.fill(); rr(g, -70, -20, 140, 40, 12); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#111'; g.fillRect(-56, -12, 112, 24); g.restore(); };
const dustBeam = (g, c, t, x0 = 800, y0 = 300) => { FX.lightCone(g, x0, y0, { angle: Math.PI * 0.68, spread: 0.45, len: 1100, color: c.c, a: 0.22 }); FX.dust(g, t, { color: '#fffbe8' }); };
const ruang = (g, c, t, o = {}) => {
  g.fillStyle = wallC(c); g.fillRect(0, 0, E.W, GY);
  g.fillStyle = alpha(shade(c.a, 0.2), 0.6); for (let x = 0; x < E.W; x += 90) g.fillRect(x, 0, 36, GY);   // motif dinding
  window_(g, c, 600, 240, 380, 420, t); clockFace(g, 420, 330, 70, o.mins ?? 420, c);
  pintuDapur(g, c, t, o.glow || 0);
  g.fillStyle = shade(c.c, -0.08); g.fillRect(0, GY, E.W, E.H - GY); g.fillStyle = INK; g.fillRect(0, GY, E.W, 10);
  g.strokeStyle = alpha(INK, 0.25); g.lineWidth = 4; for (let x = -200; x < E.W + 200; x += 160) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x + (x - 540) * 0.8, E.H); g.stroke(); }
  g.save(); g.beginPath(); g.ellipse(520, GY + 170, 470, 95, 0, 0, 6.3); g.fillStyle = INK; g.fill(); g.beginPath(); g.ellipse(520, GY + 160, 460, 88, 0, 0, 6.3); g.fillStyle = c.b; g.fill(); g.lineWidth = 6; g.strokeStyle = alpha('#fff', 0.5); g.beginPath(); g.ellipse(520, GY + 160, 380, 62, 0, 0, 6.3); g.stroke(); g.restore();   // karpet
  if (o.sofa !== false) sofa(g, c, 870, GY); if (o.hp) hpTergeletak(g, 900, GY - 130, 0.8);
  if (o.beam !== false) dustBeam(g, c, t); };
const doorShout = (g, c, t, at, str, size = 96) => { if (t < at) return; const k = slamK(t, at), [sx, sy] = shk(t, at, 0.35, 16); burst(g, 330 + sx, 380 + sy, 150 * k, 220 * k, 14, c.paper, 0.1); sticker(g, str, 330 + sx, 380 + sy, size, c.hot, -0.06, k); poly(g, [[200, 470], [150, 560], [260, 480]], c.paper); };


const box = (g, x, y, w, h, fill, rot = 0, r = 22) => { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2 + 9, -h / 2 + 11, w, h, r); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.restore(); };
const txt = (g, str, x, y, size, col, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(str, 0, 3); g.restore(); };
// SAMPUL KOMIK pagi: ruang tamu, Dio menyandarkan sapu dengan wajah malas, teriakan dari dapur. Judul di pita tengah (aman crop 3:4).
registerShot('c01', { draw(g, t) { const c = P();
  g.fillStyle = wallC(c); g.fillRect(0, 0, E.W, E.H); g.fillStyle = alpha(shade(c.a, 0.2), 0.6); for (let x = 0; x < E.W; x += 90) g.fillRect(x, 0, 36, E.H);
  g.save(); g.translate(0, 330); ruang(g, c, 1.3, { glow: 1 }); g.restore();
  g.fillStyle = shade(c.c, -0.08); g.fillRect(0, GY + 330, E.W, E.H);
  const Y = GY + 330; sapu(g, 960, Y - 620, 1010, Y - 40, 19);
  fig(g, { x: 640, y: Y, s: 3.0, outfit: DIO, pose: POSES.sad, expr: 'sleepy' });
  burst(g, 300, 900, 150, 215, 14, c.paper, 0.1); sticker(g, 'DIOO!', 300, 900, 100, c.hot, -0.06); poly(g, [[180, 990], [140, 1060], [240, 1000]], c.paper);
  box(g, 330, 160, 540, 130, c.c, -0.03); txt(g, 'RAKA', 250, 145, 96, c.hot, -0.03); txt(g, 'EDISI KOMIK', 400, 192, 34, INK, -0.03);
  g.save(); g.translate(930, 175); g.rotate(0.12); circle(g, 8, 10, 86, INK); circle(g, 0, 0, 86, c.b); g.lineWidth = 9; g.strokeStyle = INK; g.beginPath(); g.arc(0, 0, 86, 0, 6.3); g.stroke(); g.restore(); sticker(g, '#23', 930, 175, 76, c.paper, 0.12);
  sticker(g, 'DISURUH,', 540, 420, 180, c.paper, -0.04); sticker(g, 'JADI MALES', 540, 610, 150, c.c, 0.025);
  box(g, 540, 1650, 900, 110, c.paper, -0.015); txt(g, 'SALAH YANG NYURUH ATAU KAMU?', 540, 1652, 46, c.hot, -0.015);
} });
