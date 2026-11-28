// 01_disuruh.js — #23 "Disuruh Jadi Males": opening INSERT tangan meraih sapu (bukan vonis raksasa / layar HP), Potong di Puncak. Helper dari #20-#22.
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

// s01 0.0-1.3: OPENING INSERT: tangan meraih gagang sapu, cahaya pagi
registerShot('s01', { draw(g, t, info) { const c = P(); g.fillStyle = wallC(c); g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = alpha(shade(c.a, 0.2), 0.6); for (let x = 0; x < E.W; x += 90) g.fillRect(x, 0, 36, E.H); dustBeam(g, c, t, 980, 0);
  const z = 1 + 0.06 * ease.out(prog(t, 0, 1.3)); g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
  sapu(g, 760, 60, 330, 1700, 40);
  const k = ease.out(prog(t, 0.05, 0.6)); fist(g, lerp(1000, 590, k), lerp(1650, 860, k), 1.25, -0.42, prog(t, 0.35, 0.55));
  g.restore(); label(g, '07:00', 230, 260, 64, c.paper, INK, -0.04, pop(t, 0.15, 0.25)); } });

// s02 1.3-2.9: Dio memegang sapu di ruang tamu
registerShot('s02', { draw(g, t, info) { const c = P(); ruang(g, c, t);
  const o = { x: 560, y: GY, s: 2.8, outfit: DIO, pose: breathe(POSES.holdFront, t, 0.6, 2), expr: 'determined' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 200, GY, 1.9);
  label(g, 'DIO', 330, 420, 56, c.d, INK, -0.03, pop(t, 0.1, 0.22)); } });

// s03 2.9-5.4: niat dari semalam (gelembung pikiran: bulan + daftar)
registerShot('s03', { draw(g, t, info) { const c = P(); ruang(g, c, t, { beam: true });
  const o = { x: 600, y: GY, s: 2.8, outfit: DIO, pose: breathe(POSES.holdFront, t, 0.6, 2), expr: 'smile' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 200, GY, 1.9);
  const k = pop(t, 0.1, 0.35); think(g, 470, 330, 640, 330, k);
  if (k > 0.5) { FX.moon(g, 270, 300, 44, '#ffe9a8'); g.font = `900 46px "${FONTS.ui}"`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('BESOK:', 340, 260); g.fillText('BERESIN RUMAH', 340, 330); check(g, 320, 400, 26, c.d, pop(t, 0.9, 0.25)); g.font = `800 38px "${FONTS.ui}"`; g.fillText('sapu, pel, rapiin', 360, 400); }
  label(g, 'NIAT DARI SEMALAM', 540, 640, 50, c.c, INK, 0.02, pop(t, rel('semalam', info, 0.6) - 0.1, 0.22)); } });

// s04 5.4-8.85: satu sapuan, lalu teriakan dari dapur
registerShot('s04', { draw(g, t, info) { const c = P(); const td = rel('dioo', info, 2.4); const f = t > td ? Math.max(0, 1 - (t - td) * 3) : 1; ruang(g, c, t, { glow: t > td ? 1 : 0 });
  const sw = Math.sin(Math.min(t, td) * 4.2) * 90; const o = { x: 600, y: GY, s: 2.8, outfit: DIO, pose: POSES.holdFront, expr: t > td ? 'shocked' : 'happy' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 200 + sw, GY, 1.9);
  if (t < td) FX.dust(g, t, { color: shade(c.c, -0.3) });
  doorShout(g, c, t, td - 0.05, 'DIOO!', 110); } });

// s05 8.85-10.9: "Itu rumah disapu! Main HP mulu!" Dio membeku
registerShot('s05', { draw(g, t, info) { const c = P(); ruang(g, c, t, { glow: 1, hp: true }); const [sx, sy] = shk(t, 0.02, 0.3, 12);
  const o = { x: 640, y: GY, s: 2.8, outfit: DIO, pose: POSES.holdFront, expr: 'shocked' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 150, GY, 1.9);
  bub2(g, 420 + sx, 300 + sy, 600, ['ITU RUMAH DISAPU!'], 'l', c.paper, c.hot, pop(t, rel('itu', info, 0.1) - 0.1, 0.22), 56);
  bub2(g, 400, 500, 520, ['MAIN HP MULU!'], 'l', c.paper, c.hot, pop(t, rel('main', info, 1.3) - 0.1, 0.22), 56); } });

// s06 10.95-13.3: INSERT: HP tergeletak di sofa, jauh dari Dio
registerShot('s06', { draw(g, t, info) { const c = P(); bg(g, shade(c.blue, 0.25), c.paper, 0.25);
  g.save(); g.translate(540, 1250); g.scale(2.3, 2.3); sofa(g, c, 0, 0); hpTergeletak(g, -10, -130, 1); g.restore();
  for (let i = 0; i < 3; i++) { const k = pop(t, 0.5 + i * 0.25, 0.25); sticker(g, 'z', 640 + i * 70, 820 - i * 80, 70 + i * 16, c.paper, 0.1, k); }
  label(g, 'DARI TADI DI SINI', 540, 420, 64, c.d, INK, -0.03, pop(t, 0.15, 0.25)); seg(g, [[540, 500], [520, 760]], 14, INK); poly(g, [[480, 740], [560, 740], [515, 800]], INK); } });

// s07 13.3-16.65: sapu disenderin ke tembok, bar NIAT turun
registerShot('s07', { draw(g, t, info) { const c = P(); ruang(g, c, t, { beam: false }); const kd = ease.inOut(prog(t, 0.2, 1.8));
  const o = { x: lerp(560, 600, kd), y: GY, s: 2.8, outfit: DIO, pose: posesAt(t, [[0, 'holdFront'], [1.6, 'sad']], 0.4), expr: kd > 0.6 ? 'sad' : 'neutral' };
  const [hx, hy] = handW({ ...o, pose: POSES.holdFront }); const tx = lerp(hx + 160, 1000, kd), ty = lerp(GY, GY, kd); if (kd < 1) sapuPegang(g, lerp(hx, 980, kd), lerp(hy, 560, kd), tx, ty, 1.6); else sapu(g, 960, 520, 1010, GY - 40, 19);
  fig(g, o); g.fillStyle = alpha('#3b3550', 0.18 * kd); g.fillRect(0, 0, E.W, E.H);
  const v = 1 - ease.inOut(prog(t, rel('hilang', info, 2.3) - 0.3, rel('hilang', info, 2.3) + 0.6));
  label(g, 'NIAT', 220, 300, 56, c.paper, INK, 0, 1); rr(g, 330 + 8, 262 + 10, 520, 76, 20); g.fillStyle = INK; g.fill(); rr(g, 330, 262, 520, 76, 20); g.fillStyle = c.paper; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); rr(g, 342, 274, Math.max(20, 496 * (0.08 + 0.92 * v)), 52, 14); g.fillStyle = v > 0.4 ? c.d : c.hot; g.fill(); } });

// s08 16.65-20.45: bigFace menatap penonton: disuruh, malah males
registerShot('s08', { draw(g, t, info) { const c = P(); bg(g, c.a, c.paper, 0.25); const tm = rel('males', info, 3.4), tdi = rel('disuruh', info, 2.4);
  bigFace(g, 540, 760, 230, { outfit: DIO, expr: t > tm ? 'sleepy' : 'smirk', look: [0, 0], blink: 0 });
  label(g, 'UDAH MAU', 300, 240, 56, c.d, INK, -0.04, pop(t, rel('udah', info, 1.6) - 0.1, 0.22));
  label(g, 'DISURUH', 760, 330, 56, c.hot, '#fffbe8', 0.04, pop(t, tdi - 0.1, 0.22));
  sticker(g, 'MALES', 540, 1130, 150, c.paper, -0.03, slamK(t, tm - 0.1)); } });

// s09 20.45-23.65: TERPUTUS: wajah membeku, hening
registerShot('s09', { draw(g, t, info) { const c = P(); bg(g, c.a, c.paper, 0.25); bigFace(g, 540, 760, 230, { outfit: DIO, expr: 'sleepy', look: [0, 0], blink: 0 }); sticker(g, 'MALES', 540, 1130, 150, c.paper, -0.03, 1);
  const r = rng(Math.floor(t * 14) + 3); g.fillStyle = alpha(INK, 0.55); g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 6; i++) { g.fillStyle = alpha(i % 2 ? c.hot : c.blue, 0.4); g.fillRect(r() * 200 - 100, r() * E.H, E.W, 6 + r() * 24); }
  stamp(g, 'TERPUTUS', 540, 620, 140, c.hot, -0.06, slamK(t, 0.25));
  label(g, 'KENAPA BISA GITU?', 540, 930, 54, c.d, INK, 0.03, pop(t, 1.3, 0.3)); } });

// s10 23.65-28.95: 1966, Jack Brehm, REAKTANSI
registerShot('s10', { draw(g, t, info) { const c = P(); bg(g, c.paper, c.b, 0.3); const tr = rel('reaktansi', info, 4.2);
  sticker(g, '1966', 540, 290, 160, c.hot, -0.03, pop(t, 0.1, 0.25));
  g.save(); g.translate(540, 690); g.rotate(-0.05); rr(g, -230 + 10, -160 + 12, 460, 320, 20); g.fillStyle = INK; g.fill(); rr(g, -230, -160, 460, 320, 20); g.fillStyle = c.blue; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = shade(c.blue, -0.3); g.fillRect(-230, -160, 46, 320); g.font = `900 40px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fffbe8'; g.fillText('A THEORY OF', 20, -50); g.fillText('PSYCHOLOGICAL', 20, 4); g.fillText('REACTANCE', 20, 58); g.restore();
  label(g, 'JACK BREHM, PSIKOLOG', 540, 930, 46, c.d, INK, 0.02, pop(t, rel('jack', info, 1.8) - 0.1, 0.22));
  sticker(g, 'REAKTANSI', 540, 1110, 124, c.c, -0.03, slamK(t, tr - 0.1)); } });

// s11 28.95-32.7: kebebasan memilih diambil, kita rebut balik
registerShot('s11', { draw(g, t, info) { const c = P(); bg(g, c.b, c.paper, 0.25); const ta = rel('diambil', info, 1.5), tb = rel('ngerebutnya', info, 2.4);
  const pull = ease.inOut(prog(t, ta - 0.2, ta + 0.3)) - ease.inOut(prog(t, tb - 0.1, tb + 0.4)); const ly = 640 - pull * 260;
  g.save(); g.translate(540, ly); g.lineWidth = 34; g.strokeStyle = INK; g.beginPath(); g.arc(0, -120, 90, Math.PI, 0); g.stroke(); g.lineWidth = 18; g.strokeStyle = '#d9d6e0'; g.stroke(); rr(g, -150 + 10, -120 + 12, 300, 240, 30); g.fillStyle = INK; g.fill(); rr(g, -150, -120, 300, 240, 30); g.fillStyle = c.c; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.font = `900 46px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('PILIHAN', 0, -10); g.fillText('KAMU', 0, 50); g.restore();
  if (t > ta - 0.3) { g.save(); g.translate(540, ly - 260); g.rotate(Math.PI); hand(g, 0, 0, 2.2, 0); g.restore(); }
  const o = { x: 300, y: 1150, s: 1.6, outfit: DIO, pose: t > tb ? POSES.reach : POSES.stand, expr: t > tb ? 'determined' : 'worried' }; fig(g, o);
  label(g, 'TERASA DIAMBIL', 540, 220, 54, c.hot, '#fffbe8', -0.03, pop(t, ta - 0.1, 0.22));
  if (t > tb) sticker(g, 'REBUT BALIK!', 700, 1000, 70, c.d, 0.04, slamK(t, tb)); } });

// s12 32.7-35.25: caranya: kebalikannya
registerShot('s12', { draw(g, t, info) { const c = P(); bg(g, c.c, c.paper, 0.25); floorBg(g, c.c, GY, c); const tk = rel('kebalikannya', info, 1.5);
  g.save(); g.translate(700, 520); rr(g, -260 + 10, -80 + 12, 520, 160, 24); g.fillStyle = INK; g.fill(); rr(g, -260, -80, 520, 160, 24); g.fillStyle = c.paper; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.font = `900 64px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('DISURUH →', 0, 4); g.restore(); seg(g, [[700, 600], [700, GY]], 18, INK);
  const x = lerp(560, 200, ease.inOut(prog(t, 0.2, 2.4))); fig(g, { x, y: GY, s: 2.0, facing: -1, outfit: DIO, pose: walkPose(t * 2.2), expr: 'smirk' });
  sticker(g, '← KEBALIKANNYA', 470, 300, 84, c.hot, -0.03, slamK(t, tk - 0.1)); } });

// s13 35.25-39.25: 2007, Duke, tes teka-teki kata
registerShot('s13', { draw(g, t, info) { const c = P(); bg(g, c.night, c.blue, 0.2); sticker(g, '2007', 300, 270, 130, c.c, -0.04, pop(t, 0.1, 0.25)); label(g, 'DUKE', 760, 280, 62, c.d, INK, 0.04, pop(t, rel('duke', info, 1.0) - 0.1, 0.22));
  rr(g, 120 + 10, 430 + 12, 840, 560, 30); g.fillStyle = INK; g.fill(); rr(g, 120, 430, 840, 560, 30); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); rr(g, 160, 470, 760, 480, 18); g.fillStyle = c.paper; g.fill();
  const word = 'SAPU', mix = ['UPAS', 'PUSA', 'ASUP', 'SAPU']; const w = t < 3 ? mix[Math.floor(t * 3) % 3] : 'SAPU';
  for (let i = 0; i < 4; i++) { const k = pop(t, 0.4 + i * 0.12, 0.22); if (k <= 0) continue; g.save(); g.translate(270 + i * 180, 710); g.scale(k, k); rr(g, -70 + 6, -70 + 8, 140, 140, 18); g.fillStyle = INK; g.fill(); rr(g, -70, -70, 140, 140, 18); g.fillStyle = c.a; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.font = `900 90px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText(w[i], 0, 6); g.restore(); }
  label(g, 'TES TEKA-TEKI KATA', 540, 1100, 52, c.c, INK, -0.02, pop(t, rel('teka', info, 2.2) - 0.1, 0.22)); } });

// s14 39.25-44.6: nama orang terdekat muncul sekilas, terlalu cepat untuk disadari
registerShot('s14', { draw(g, t, info) { const c = P(); bg(g, c.night, c.blue, 0.2); const tn = rel('nama', info, 1.6), tc = rel('cepet', info, 3.2);
  rr(g, 120 + 10, 300 + 12, 840, 560, 30); g.fillStyle = INK; g.fill(); rr(g, 120, 300, 840, 560, 30); g.fillStyle = '#2a2733'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); rr(g, 160, 340, 760, 480, 18); g.fillStyle = c.paper; g.fill();
  const ph = (t - tn) % 1.4, on = t > tn && ph < 0.12; if (on) { g.font = `900 150px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = c.hot; g.fillText('IBU', 540, 590); } else if (t > tn && ph < 0.4) { g.font = `900 150px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = alpha(c.hot, 0.12 * (1 - (ph - 0.12) / 0.28)); g.fillText('IBU', 540, 590); }
  g.font = `900 40px "${FONTS.ui}"`; g.textAlign = 'center'; g.fillStyle = alpha(INK, 0.5); g.fillText('+', 540, 760);
  label(g, 'NAMA ORANG TERDEKAT', 540, 220, 50, c.d, INK, -0.02, pop(t, tn - 0.3, 0.22));
  label(g, 'TERLALU CEPAT BUAT DISADARI', 520, 1040, 46, c.c, INK, 0.02, pop(t, tc - 0.1, 0.22)); } });

// s15 44.6-50.3: nyuruh kerja keras vs nyuruh santai: hasilnya lebih jelek
registerShot('s15', { draw(g, t, info) { const c = P(); bg(g, c.paper, c.a, 0.25); const base = 1080, tk = rel('kerja', info, 1.4), tj = rel('jelek', info, 2.9), ts = rel('santai', info, 4.8);
  label(g, 'HASIL TES', 540, 230, 64, c.d, INK, -0.03, pop(t, 0.1, 0.22));
  const bar = (x, h, col, ttl, k, kb) => { if (k <= 0) return; label(g, ttl, x, 420, 50, col, '#fffbe8', 0, k); const hh = Math.max(10, h * kb); rr(g, x - 120 + 10, base - hh + 12, 240, hh, 20); g.fillStyle = INK; g.fill(); rr(g, x - 120, base - hh, 240, hh, 20); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); };
  bar(290, 230, c.hot, '"KERJA KERAS!"', pop(t, tk - 0.2, 0.25), ease.out(prog(t, tj - 0.4, tj + 0.3)));
  bar(720, 500, c.blue, '"SANTAI AJA"', pop(t, tj + 0.4, 0.25), ease.out(prog(t, tj + 0.5, tj + 1.1)));
  g.fillStyle = INK; g.fillRect(100, base, 880, 10);
  if (t > tj) sticker(g, 'LEBIH JELEK', 300, base - 330, 62, c.paper, -0.04, slamK(t, tj)); } });

// s16 50.3-52.2: nggak sadar lagi ngelawan (bayangan berbalik arah)
registerShot('s16', { draw(g, t, info) { const c = P(); bg(g, shade(c.night, 0.1), null); g.fillStyle = shade(c.night, -0.2); g.fillRect(0, GY, E.W, E.H - GY);
  FX.lightCone(g, 200, 200, { angle: Math.PI * 0.3, spread: 0.6, len: 1400, color: c.c, a: 0.25 });
  g.save(); g.globalAlpha = 0.5; fig(g, { x: 760, y: GY, s: 2.6, facing: -1, outfit: { top: 'tshirt', color: '#000', head: 'none' }, pose: POSES.crossArms, expr: 'angry', ink: '#000' }); g.restore();
  fig(g, { x: 380, y: GY, s: 2.8, facing: 1, outfit: DIO, pose: breathe(POSES.stand, t, 0.5, 2), expr: 'neutral' });
  label(g, 'NGGAK SADAR', 540, 300, 72, c.d, INK, -0.03, pop(t, rel('sadar', info, 0.9) - 0.1, 0.22)); } });

// s17 52.2-55.35: LANJUT: besok paginya, jam 07:00 lagi
registerShot('s17', { draw(g, t, info) { const c = P(); const ts = rel('suara', info, 1.5); ruang(g, c, t, { glow: t > ts ? 0.6 + 0.4 * Math.sin(t * 6) : 0 });
  const o = { x: 600, y: GY, s: 2.8, outfit: DIO, pose: breathe(POSES.holdFront, t, 0.6, 2), expr: t > ts ? 'thinking' : 'happy' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 200 + Math.sin(t * 4) * 60 * (t < ts ? 1 : 0), GY, 1.9);
  sticker(g, 'LANJUT', 540, 240, 120, c.paper, -0.04, slamK(t, 0.05) * (1 - prog(t, 1.0, 1.3)));
  label(g, 'BESOKNYA', 540, 240, 64, c.d, INK, 0.03, pop(t, 1.3, 0.22));
  bub2(g, 380, 400, 280, ['Dio...'], 'l', c.paper, c.hot, pop(t, ts + 0.3, 0.22), 54); } });

// s18 55.35-60.5: Dio jawab duluan
registerShot('s18', { draw(g, t, info) { const c = P(); ruang(g, c, t, { glow: 0.5 }); const tj = rel('iya', info, 1.7);
  const o = { x: 640, y: GY, s: 2.8, facing: -1, outfit: DIO, pose: t > tj ? breathe(POSES.talk, t, 0.5, 2) : POSES.holdFront, expr: t > tj ? 'smile' : 'neutral' }; fig(g, o);
  const [hx, hy] = handW({ ...o, pose: POSES.holdFront }); sapuPegang(g, hx + 30, hy + 20, hx + 200, GY, 1.9);
  bub2(g, 380, 400, 280, ['Dio...'], 'l', c.paper, c.hot, 1 - prog(t, tj - 0.2, tj + 0.2), 54);
  bub2(g, 560, 300, 560, ['Iya, Bu.', 'Aku mulai dari', 'kamar dulu, ya.'], 'r', c.d, INK, pop(t, tj - 0.1, 0.25), 48);
  label(g, 'JAWAB DULUAN', 250, 800, 56, c.c, INK, -0.03, pop(t, rel('duluan', info, 0.9) - 0.1, 0.22)); } });

// s19 60.5-64.95: dia sendiri yang milih urutannya; sapu tetap di tangan
registerShot('s19', { draw(g, t, info) { const c = P(); bg(g, c.paper, c.b, 0.25); const tm = rel('milih', info, 0.8);
  label(g, 'DIA YANG MILIH', 540, 220, 64, c.d, INK, -0.03, pop(t, tm - 0.2, 0.22));
  const rooms = [['KAMAR', 300, 440, 380, 260, c.b], ['RUANG TAMU', 700, 440, 380, 260, c.a], ['DAPUR', 500, 720, 720, 200, c.c]];
  rooms.forEach(([n, x, y, w, h, col], i) => { const k = pop(t, 0.1 + i * 0.12, 0.22); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -w / 2 + 8, -h / 2 + 10, w, h, 20); g.fillStyle = INK; g.fill(); rr(g, -w / 2, -h / 2, w, h, 20); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.font = `900 46px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText(n, 0, 40); g.restore();
    const kn = pop(t, tm + 0.2 + i * 0.5, 0.25); if (kn > 0) { g.save(); g.translate(x, y - 50); g.scale(kn, kn); circle(g, 6, 8, 52, INK); circle(g, 0, 0, 52, c.hot); g.font = `900 64px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fffbe8'; g.fillText(String(i + 1), 0, 4); g.restore(); } });
  const o = { x: 260, y: 1170, s: 1.4, outfit: DIO, pose: POSES.holdFront, expr: 'happy' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 100, 1170, 1); check(g, 500, 1060, 40, c.d, pop(t, rel('disenderin', info, 3.5) - 0.2, 0.25)); } });

// s20 64.95-69.05: jam 09:00, rumah bersih, "Tumben."
registerShot('s20', { draw(g, t, info) { const c = P(); ruang(g, c, t, { mins: 540, glow: 0.4 }); const tt = rel('tumben', info, 2.5);
  for (let i = 0; i < 7; i++) { const k = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7); FX.sparkle(g, 200 + (i * 173) % 800, 760 + (i * 97) % 380, 30 + 20 * k, '#ffffff', 0.9 * k); }
  const o = { x: 640, y: GY, s: 2.8, facing: -1, outfit: DIO, pose: breathe(POSES.holdFront, t, 0.5, 2), expr: t > tt ? 'smirk' : 'happy' }; fig(g, o); const [hx, hy] = handW(o); sapuPegang(g, hx, hy, hx + 90, GY, 1.9);
  label(g, '09:00', 420, 450, 54, c.d, INK, 0.03, pop(t, rel('9', info, 0.2), 0.22)); label(g, 'BERSIH', 330, 1000, 56, c.paper, INK, -0.04, pop(t, rel('bersih', info, 1.1) - 0.1, 0.22));
  bub2(g, 380, 560, 300, ['Tumben.'], 'l', c.paper, INK, pop(t, tt - 0.1, 0.22), 56); } });

// s21 69.05-75.97: yang salah siapa? lalu kembali ke tangan di sapu (loop ke s01)
registerShot('s21', { draw(g, t, info) { const c = P(); const tn = rel('nyuruh', info, 4.3), tk = rel('kamu', info, 5.1), tg = rel('megang', info, 6.0);
  bg(g, c.a, c.paper, 0.25); label(g, 'YANG SALAH SIAPA?', 540, 260, 64, c.paper, INK, -0.02, pop(t, rel('salah', info, 2.6) - 0.1, 0.22));
  fig(g, { x: 540, y: 1150, s: 2.2, outfit: DIO, pose: breathe(POSES.shrug, t, 0.5, 2), expr: 'thinking' });
  sticker(g, 'YANG NYURUH?', 330, 500, 84, c.hot, -0.05, slamK(t, tn - 0.1)); sticker(g, 'KAMU?', 730, 680, 110, c.blue, 0.05, slamK(t, tk - 0.1));
  const k = ease.inOut(prog(t, tg - 0.2, tg + 0.5)); if (k > 0) { g.save(); g.globalAlpha = k; g.fillStyle = wallC(c); g.fillRect(0, 0, E.W, E.H); g.fillStyle = alpha(shade(c.a, 0.2), 0.6); for (let x = 0; x < E.W; x += 90) g.fillRect(x, 0, 36, E.H); dustBeam(g, c, t, 980, 0); sapu(g, 760, 60, 330, 1700, 40); fist(g, 590, 860, 1.25, -0.42, 1); g.restore(); } } });
