// moodboard v2 — 6 keyframes, bright flat illustration (referensi handwashing-doctor)
import { E, registerShot, alpha, circle, seg, poly, rr, linGrad, radGrad, text, glow, veil, blurLayer } from '/engine/core.js';
import { chibi, OUT, cap } from '../chibi.js';
const OL = '#1b1b1f', W = 1080, H = 1920, FL = 1250;
function wall(g, c1 = '#f3e2c0', c2 = '#e9d2a8') { g.fillStyle = linGrad(g, 0, 0, 0, FL, [c1, c2]); g.fillRect(0, 0, W, FL); }
function floor(g, a = '#b8874f', b = '#a4733f') { g.fillStyle = a; g.fillRect(0, FL, W, H - FL); g.strokeStyle = b; g.lineWidth = 4; for (let i = 0; i < 9; i++) { const y = FL + i * i * 10 + i * 20; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(W / 2 + i * 60, FL); g.lineTo(W / 2 + i * 260, H); g.stroke(); } }
function pillar(g, x, w = 90) { rr(g, x - w / 2, -20, w, FL + 40, 0); g.fillStyle = linGrad(g, x - w / 2, 0, x + w / 2, 0, ['#a82a22', '#d0402f', '#a02620']); g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke(); rr(g, x - w / 2 - 12, FL - 30, w + 24, 50, 6); g.fillStyle = '#7a4a2a'; g.fill(); g.stroke(); rr(g, x - w / 2 - 8, 120, w + 16, 26, 4); g.fillStyle = '#e8b33a'; g.fill(); g.stroke(); }
function lattice(g, x, y, w, h, sky = true) { rr(g, x, y, w, h, 12); g.fillStyle = sky ? linGrad(g, 0, y, 0, y + h, ['#8fc8ee', '#d9eefa']) : '#c9a77a'; g.fill(); g.strokeStyle = '#7a3a1e'; g.lineWidth = 7; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x + i * w / 4, y); g.lineTo(x + i * w / 4, y + h); g.stroke(); } for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(x, y + i * h / 5); g.lineTo(x + w, y + i * h / 5); g.stroke(); } g.lineWidth = 14; rr(g, x, y, w, h, 12); g.stroke(); }
function lantern(g, x, y, s = 1) { seg(g, [[x, 0], [x, y - 50 * s]], 4, OL); g.fillStyle = '#d63a2a'; g.beginPath(); g.ellipse(x, y, 40 * s, 50 * s, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); rr(g, x - 22 * s, y - 58 * s, 44 * s, 14 * s, 3); g.fillStyle = '#e8b33a'; g.fill(); g.stroke(); rr(g, x - 22 * s, y + 44 * s, 44 * s, 14 * s, 3); g.fill(); g.stroke(); seg(g, [[x, y + 58 * s], [x, y + 100 * s]], 6, '#e8b33a'); glow(g, x, y, 120 * s, '#ffb050', 0.25); }
function wainscot(g, c = '#8a4a26') { rr(g, 0, FL - 260, W, 260, 0); g.fillStyle = c; g.fill(); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); for (let i = 0; i < 6; i++) { rr(g, 20 + i * 180, FL - 230, 150, 190, 8); g.strokeStyle = '#6a3418'; g.lineWidth = 5; g.stroke(); } }
function throne(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -170, -360, 340, 300, 40); g.fillStyle = '#e8b33a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 6; g.stroke(); circle(g, 0, -250, 60, '#c9302a'); g.stroke(); rr(g, -190, -90, 380, 70, 14); g.fillStyle = '#c99528'; g.fill(); g.stroke(); rr(g, -150, -20, 300, 40, 8); g.fillStyle = '#7a4a2a'; g.fill(); g.stroke(); g.restore(); }
function board(g, x, y, w, h, lines) { rr(g, x - 16, y - 16, w + 32, h + 32, 14); g.fillStyle = '#7a4a2a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke(); rr(g, x, y, w, h, 6); g.fillStyle = '#f3ead2'; g.fill(); g.stroke(); lines.forEach(([s, c, sz], i) => text(g, s, x + w / 2, y + 80 + i * 92, { size: sz || 64, font: 'Fredoka', weight: 700, color: c || OL })); }
function palace(g) { wall(g); lattice(g, 120, 330, 300, 460); lattice(g, 660, 330, 300, 460); wainscot(g); floor(g); pillar(g, 40); pillar(g, W - 40); lantern(g, 540, 220); }
const blurBG = (g, fn, desat = 0, dark = 0) => { g.save(); g.filter = `blur(14px) saturate(${1 - desat})`; fn(g); g.restore(); if (dark) veil(g, '#1c2638', dark); };

// M1 — throne room: little prince, emperor looking away
registerShot('m1', { draw(g) { palace(g); throne(g, 540, FL - 20, 1.1);
  chibi(g, { x: 760, y: 1560, s: 1.7, out: OUT.emperor, expr: 'angry', look: [1, 0], armL: [20, 10], armR: [70, 40] });
  chibi(g, { x: 290, y: 1600, s: 1.9, kid: true, out: OUT.prince, expr: 'worried', look: [1, -0.6], armL: [10, 0], armR: [10, 0] });
  cap(g, ['FIRSTBORN'], 1400, 0); } });
// M2 — study room: AGE 5 board
registerShot('m2', { draw(g) { wall(g, '#eef0ea', '#dfe2d8'); board(g, 160, 260, 760, 470, [['AGE 5', '#c9302a', 90], ['History', OL], ['Politics', OL], ['War', OL]]); wainscot(g, '#6a4a32'); floor(g, '#9a7a56', '#88694a');
  rr(g, 200, 1380, 680, 60, 10); g.fillStyle = '#7a4a2a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke();
  chibi(g, { x: 540, y: 1600, s: 2.0, kid: true, out: OUT.prince, expr: 'sad', look: [0, 0.8], armL: [80, 20], armR: [80, -20], sweat: true });
  rr(g, 260, 1350, 180, 34, 6); g.fillStyle = '#f3ead2'; g.fill(); g.stroke(); rr(g, 640, 1350, 180, 34, 6); g.fill(); g.stroke();
  cap(g, ['AGE', 'FIVE'], 1400, 1); } });
// M3 — poison close-up: blurred + desaturated background, jade glow
registerShot('m3', { draw(g) { blurBG(g, palace, 0.6, 0.35);
  const r = chibi(g, { x: 540, y: 2050, s: 2.6, out: OUT.prince, expr: 'scared', look: [0, 0.4], armL: [40, 60], armR: [40, 60], sweat: true });
  const bx = 540, by = 1600; g.fillStyle = '#f6f2e8'; g.beginPath(); g.ellipse(bx, by, 130, 30, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(bx - 130, by); g.quadraticCurveTo(bx, by + 150, bx + 130, by); g.fill(); g.strokeStyle = OL; g.lineWidth = 6; g.stroke(); g.fillStyle = '#5fbf7a'; g.beginPath(); g.ellipse(bx, by, 115, 22, 0, 0, Math.PI * 2); g.fill(); glow(g, bx, by - 40, 260, '#7affa0', 0.45);
  for (let i = 0; i < 3; i++) { circle(g, bx - 40 + i * 40, by - 60 - i * 40, 14, alpha('#7affa0', 0.6)); }
  cap(g, ['POISON'], 1000, 0); } });
// M4 — brothers smiling, daggers behind backs
registerShot('m4', { draw(g) { palace(g);
  chibi(g, { x: 230, y: 1600, s: 1.55, out: OUT.brother, expr: 'smirk', look: [1, 0], armL: [-30, -20], armR: [20, 10] });
  chibi(g, { x: 850, y: 1600, s: 1.55, out: OUT.brother2, expr: 'smirk', look: [-1, 0], armL: [20, 10], armR: [-30, -20] });
  for (const [dx, s] of [[120, -1], [960, 1]]) { g.save(); g.translate(dx, 1290); g.rotate(s * 0.4); poly(g, [[0, -8], [0, 8], [s * 110, 0]], '#dfe6ee'); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); seg(g, [[-s * 40, 0], [0, 0]], 14, '#7a4a2a'); g.restore(); }
  chibi(g, { x: 540, y: 1660, s: 1.75, out: OUT.prince, expr: 'worried', look: [0.6, 0], sweat: true });
  cap(g, ['NOBODY'], 1400, 0); } });
// M5 — time card on blurred background
registerShot('m5', { draw(g) { blurBG(g, palace, 0.2, 0.25);
  text(g, 'AGE 12', 540, 800, { size: 190, font: 'Fredoka', weight: 700, color: '#ffd23a', stroke: 26, strokeColor: OL });
  text(g, 'nobody can be trusted', 540, 960, { size: 64, font: 'Fredoka', weight: 700, color: '#fff', stroke: 12, strokeColor: OL }); } });
// M6 — ending: alone on the throne, desaturated red, chains
registerShot('m6', { draw(g) { blurBG(g, (g) => { palace(g); throne(g, 540, FL - 20, 1.1); }, 0.75, 0.45); veil(g, '#7a1010', 0.18, 'multiply');
  throne(g, 540, 1500, 1.25);
  const pr = chibi(g, { x: 540, y: 1500, s: 1.8, out: OUT.prince, expr: 'sad', look: [0, 0.6], armL: [150, 10], armR: [150, -10] });
  for (const sx of [-1, 1]) for (let i = 0; i < 9; i++) { g.strokeStyle = '#c9a24a'; g.lineWidth = 9; g.beginPath(); i % 2 ? g.ellipse(pr.hands[sx < 0 ? 0 : 1][0], pr.hands[sx < 0 ? 0 : 1][1] - 30 - i * 48, 8, 26, 0, 0, Math.PI * 2) : g.ellipse(pr.hands[sx < 0 ? 0 : 1][0], pr.hands[sx < 0 ? 0 : 1][1] - 30 - i * 48, 22, 28, 0, 0, Math.PI * 2); g.stroke(); }
  cap(g, ['A', 'SENTENCE'], 1400, 1); } });
