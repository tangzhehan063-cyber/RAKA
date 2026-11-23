// uji gaya KOMIK TERANG: vonis raksasa, squash/stretch, speed lines, impact frame, panel terbagi.
import { E, V, S, registerShot, ease, prog, lerp, clamp, alpha, shade, rr, seg, circle, poly, text, FONTS, shake, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { HERO } from '../cast.js';
const INK = '#14121a';
const halftone = (g, col, a, step = 34, r = 7) => { g.save(); g.fillStyle = alpha(col, a); for (let y = 0; y < E.H; y += step) for (let x = ((y / step) % 2) * step / 2; x < E.W; x += step) { g.beginPath(); g.arc(x, y, r * (0.4 + 0.6 * (y / E.H)), 0, 6.3); g.fill(); } g.restore(); };
const burst = (g, cx, cy, r0, r1, n, col, rot = 0) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r0 : r1; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } poly(g, pts, col); g.lineWidth = 10; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); };
const slam = (g, str, x, y, size, t, at, col = '#fffbe8', rot = -0.05) => {
  const k = prog(t, at, at + 0.22); if (k <= 0) return; const sc = k < 1 ? lerp(2.4, 1, ease.outBack(k)) : 1;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
  for (const [dx, dy] of [[10, 12], [-6, 8]]) text(g, str, dx, dy, { size, color: INK, font: FONTS.ui, weight: 900 });
  g.lineWidth = size * 0.16; g.strokeStyle = INK; g.lineJoin = 'round'; g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeText(str, 0, 0);
  text(g, str, 0, 0, { size, color: col, font: FONTS.ui, weight: 900 }); g.restore();
};
const ground = (g, y, col) => { g.fillStyle = col; g.fillRect(-200, y, E.W + 400, E.H); g.fillStyle = INK; g.fillRect(-200, y, E.W + 400, 10); };
// s01: HOOK = vonis. "KAMU NGGAK MALAS."
registerShot('s01', { draw(g, t) {
  g.fillStyle = '#ffd400'; g.fillRect(0, 0, E.W, E.H); halftone(g, '#ff8a00', 0.35);
  const [sx, sy] = t > 0.18 && t < 0.45 ? shake(t, 26, 40) : [0, 0]; g.save(); g.translate(sx, sy);
  burst(g, E.W / 2, E.H * 0.44, 380, 560, 14, '#ff4d2e', t * 0.15);
  slam(g, 'KAMU', E.W / 2, E.H * 0.34, 250, t, 0.1, '#fffbe8', -0.06);
  slam(g, 'NGGAK', E.W / 2, E.H * 0.47, 250, t, 0.45, '#fffbe8', 0.05);
  slam(g, 'MALAS.', E.W / 2, E.H * 0.60, 270, t, 0.85, '#2f6bff', -0.04);
  g.restore();
  const k = prog(t, 1.6, 2.0); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.76); g.scale(ease.outBack(k), ease.outBack(k)); rr(g, -330, -60, 660, 120, 30); g.fillStyle = INK; g.fill(); text(g, 'otakmu yang licik.', 0, 4, { size: 66, color: '#ffd400', font: FONTS.ui, weight: 900 }); g.restore(); }
} });
// s02: stickman gepeng-melar kena beban, speed lines, impact frame putih
registerShot('s02', { draw(g, t) {
  g.fillStyle = '#4cc9f0'; g.fillRect(0, 0, E.W, E.H); halftone(g, '#ffffff', 0.25, 40, 8);
  const gy = E.H * 0.78; ground(g, gy, '#fffbe8');
  const hit = 0.9, fall = ease.in(prog(t, 0, hit)), sq = t < hit ? 0 : Math.exp(-(t - hit) * 5) * Math.cos((t - hit) * 22);   // pantulan
  const y = lerp(-500, gy, fall), sx = 1 + 0.45 * sq + (t < hit ? -0.12 * fall : 0), sy = 1 - 0.5 * sq + (t < hit ? 0.25 * fall : 0);
  if (t < hit) { g.save(); g.strokeStyle = alpha('#fff', 0.9); g.lineWidth = 8; g.lineCap = 'round'; const r = rng(4); for (let i = 0; i < 12; i++) { const x = E.W / 2 - 220 + r() * 440, l = 160 + r() * 260; g.beginPath(); g.moveTo(x, y - 380 - l); g.lineTo(x, y - 380); g.stroke(); } g.restore(); }
  g.save(); g.translate(E.W / 2, gy); g.scale(sx, sy); g.translate(-E.W / 2, -gy);
  drawFigure(g, { x: E.W / 2, y: y, s: 2.3, facing: 1, outfit: HERO, pose: t < hit ? POSES.stand : breathe(POSES.sad, t, 0.6, 2), expr: t < hit ? 'shocked' : 'sad', rim: null }); g.restore();
  if (t > hit && t < hit + 0.12) { g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); }           // impact frame
  if (t > hit) { burst(g, E.W / 2, gy - 40, 150 * clamp((t - hit) * 6), 260 * clamp((t - hit) * 6), 10, '#ffd400', 0.2); }
  slam(g, 'BRUK!', E.W / 2 + 260, E.H * 0.24, 210, t, hit + 0.05, '#ff4d2e', 0.12);
} });
// s03: panel terbagi: TUGAS vs OTAK (diagonal), angka sumber
registerShot('s03', { draw(g, t) {
  const k = ease.outBack(prog(t, 0, 0.35)); g.fillStyle = INK; g.fillRect(0, 0, E.W, E.H);
  const panel = (pts, col, f) => { g.save(); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); g.fillStyle = col; g.fillRect(0, 0, E.W, E.H); f(); g.restore(); };
  const gap = 24, mid = E.H * 0.5, off = (1 - k) * 1300;
  panel([[0, 0], [E.W, 0], [E.W, mid - 90 - gap / 2], [0, mid + 90 - gap / 2]].map(([x, y]) => [x, y - off]), '#ff7ab6', () => { halftone(g, '#fff', 0.3, 36); slam(g, 'TUGAS', E.W / 2, mid * 0.62 - off, 230, t, 0.25, '#fffbe8', -0.04); });
  panel([[0, mid + 90 + gap / 2], [E.W, mid - 90 + gap / 2], [E.W, E.H], [0, E.H]].map(([x, y]) => [x, y + off]), '#7cf29c', () => { halftone(g, '#fff', 0.3, 36); slam(g, 'OTAK', E.W / 2, mid * 1.45 + off, 230, t, 0.45, '#fffbe8', 0.04); });
  const a = prog(t, 1.0, 1.3); if (a > 0) { g.save(); g.translate(E.W / 2, mid); g.rotate(-0.07); g.scale(ease.outBack(a), ease.outBack(a)); rr(g, -300, -80, 600, 160, 24); g.fillStyle = '#ffd400'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); text(g, 'VS', 0, 8, { size: 130, color: INK, font: FONTS.ui, weight: 900 }); g.restore(); }
} });
