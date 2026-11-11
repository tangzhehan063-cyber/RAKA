// chibi.js — Stick.Tales rig: big round white head, thin black stick limbs, full-colour costume (hanfu), white mitten hands.
import { alpha, circle, seg, poly, rr, linGrad, text, FONTS, glow } from '/engine/core.js';
const OL = '#1b1b1f';
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = (c) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k))); return `rgb(${f(r)},${f(g)},${f(b)})`; };
export const OUT = {
  prince:  { robe: '#e8b33a', trim: '#b8322a', inner: '#f6efe0', hat: 'crown', hair: '#1b1b1f' },
  emperor: { robe: '#c9302a', trim: '#e8b33a', inner: '#f6efe0', hat: 'mian', hair: '#1b1b1f', beard: true },
  brother: { robe: '#2f6f8a', trim: '#e8b33a', inner: '#f6efe0', hat: 'bun', hair: '#1b1b1f' },
  brother2:{ robe: '#5a4a8a', trim: '#e8b33a', inner: '#f6efe0', hat: 'bun', hair: '#1b1b1f' },
  official:{ robe: '#2e7a5a', trim: '#1b1b1f', inner: '#f6efe0', hat: 'wusha', hair: '#1b1b1f', beard: true },
  kid:     { robe: '#8aa86a', trim: '#5a7040', inner: '#f6efe0', hat: 'buns', hair: '#2a1a12' },
  assassin:{ robe: '#16161c', trim: '#16161c', inner: '#16161c', hat: 'mask', hair: '#0c0c10' },
};
// arms: [angle deg from straight-down, elbow bend deg]; 0 = hanging; 90 = forward; 160 = up
export function chibi(g, o) {
  const { x, y, s = 1, out = OUT.prince, expr = 'neutral', look = [0, 0], armL = [12, 8], armR = [12, -8], facing = 1, sweat = false, blink = false, kid = false, alphaA = 1, legs = 'stand', hands = 'mitt' } = o;
  const k = s * (kid ? 0.85 : 1), H = 70 * k, bodyH = (kid ? 150 : 190) * k, legH = (kid ? 70 : 95) * k;
  const hipY = y - legH, shY = hipY - bodyH * 0.72, headY = shY - H * 0.95;
  g.save(); g.globalAlpha *= alphaA;
  // shadow
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x, y + 4, 60 * k, 10 * k, 0, 0, Math.PI * 2); g.fill();
  // legs + shoes
  const lw = 7 * k;
  for (const sx of [-1, 1]) { const fx = x + sx * 16 * k + (legs === 'walk' ? sx * 10 * k : 0); seg(g, [[x + sx * 12 * k, hipY], [fx, y - 6 * k]], lw, OL); rr(g, fx - 12 * k + sx * 4 * k, y - 12 * k, 26 * k, 12 * k, 6 * k); g.fillStyle = OL; g.fill(); }
  // arms (behind robe sleeves are drawn after robe)
  const arm = (side, [a, b]) => { const r = (deg) => deg * Math.PI / 180, sx = x + side * 30 * k, L1 = 62 * k, L2 = 56 * k;
    const ex = sx + side * Math.sin(r(a)) * L1, ey = shY + 8 * k + Math.cos(r(a)) * L1, hx = ex + side * Math.sin(r(a + b)) * L2, hy = ey + Math.cos(r(a + b)) * L2;
    // wide hanfu sleeve
    g.fillStyle = shade(out.robe, -0.08); g.beginPath(); g.moveTo(sx - side * 6 * k, shY + 2 * k); g.lineTo(ex + side * 4 * k, ey - 14 * k); g.lineTo(ex + side * 4 * k + side * Math.sin(r(a + b)) * 22 * k, ey + 26 * k); g.lineTo(sx - side * 6 * k, shY + 44 * k); g.closePath(); g.fill();
    g.strokeStyle = OL; g.lineWidth = 4 * k; g.stroke();
    seg(g, [[ex, ey], [hx, hy]], lw, OL);
    if (hands === 'mitt') { circle(g, hx, hy, 15 * k, '#ffffff'); g.strokeStyle = OL; g.lineWidth = 4 * k; g.beginPath(); g.arc(hx, hy, 15 * k, 0, Math.PI * 2); g.stroke(); }
    return [hx, hy]; };
  // robe (A-line hanfu)
  const top = shY - 4 * k, bot = y - 22 * k, wT = 34 * k, wB = (kid ? 58 : 66) * k;
  g.fillStyle = out.robe; g.beginPath(); g.moveTo(x - wT, top); g.lineTo(x + wT, top); g.lineTo(x + wB, bot); g.quadraticCurveTo(x, bot + 10 * k, x - wB, bot); g.closePath(); g.fill(); g.strokeStyle = OL; g.lineWidth = 4.5 * k; g.stroke();
  // hem trim + cross collar + sash
  g.save(); g.clip(); g.fillStyle = out.trim; g.fillRect(x - wB - 10, bot - 14 * k, wB * 2 + 20, 20 * k); g.restore();
  poly(g, [[x - 18 * k, top], [x + 18 * k, top], [x + 4 * k, top + 46 * k]], out.inner); seg(g, [[x - 20 * k, top], [x + 10 * k, top + 52 * k]], 9 * k, out.trim); seg(g, [[x + 20 * k, top], [x - 2 * k, top + 30 * k]], 9 * k, out.trim);
  rr(g, x - wT - 6 * k, top + 66 * k, (wT + 6 * k) * 2, 16 * k, 4 * k); g.fillStyle = out.trim; g.fill(); g.strokeStyle = OL; g.lineWidth = 3 * k; g.stroke();
  const hL = arm(-1, armL), hR = arm(1, armR);
  // head
  const hx = x + look[0] * 4 * k, hy = headY;
  if (out.hair && out.hat !== 'mask') { circle(g, hx, hy - 4 * k, H * 1.02, out.hair); }
  circle(g, hx, hy, H, '#ffffff'); g.strokeStyle = OL; g.lineWidth = 5 * k; g.beginPath(); g.arc(hx, hy, H, 0, Math.PI * 2); g.stroke();
  if (out.hair && out.hat !== 'mask') { g.save(); g.beginPath(); g.arc(hx, hy, H, 0, Math.PI * 2); g.clip(); g.fillStyle = out.hair; g.beginPath(); g.ellipse(hx, hy - H * 0.95, H * 1.05, H * 0.42, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  face(g, hx, hy, H, expr, look, blink, out, k);
  hat(g, hx, hy, H, out.hat, k);
  if (sweat) { g.fillStyle = '#6ec6ff'; g.beginPath(); g.moveTo(hx + H * 0.7, hy - H * 0.55); g.quadraticCurveTo(hx + H * 0.85, hy - H * 0.25, hx + H * 0.7, hy - H * 0.2); g.quadraticCurveTo(hx + H * 0.55, hy - H * 0.25, hx + H * 0.7, hy - H * 0.55); g.fill(); }
  g.restore();
  return { head: [hx, hy, H], hands: [hL, hR], shY, hipY };
}
function face(g, x, y, H, expr, look, blink, out, k) {
  const ex = H * 0.32, ey = y - H * 0.05, lx = look[0] * H * 0.08, ly = look[1] * H * 0.06, er = H * 0.085;
  const brow = { neutral: [0, 0], happy: [-4, 0], angry: [14, 1], worried: [-14, 1], scared: [-16, -0.4], sad: [-12, 1], smirk: [8, 0], shock: [-6, -0.5] }[expr] || [0, 0];
  for (const s of [-1, 1]) {
    if (blink) seg(g, [[x + s * ex - er, ey], [x + s * ex + er, ey]], 4 * k, OL);
    else { const big = expr === 'scared' || expr === 'shock'; if (big) { circle(g, x + s * ex + lx, ey + ly, er * 1.8, '#fff'); g.strokeStyle = OL; g.lineWidth = 3 * k; g.beginPath(); g.arc(x + s * ex + lx, ey + ly, er * 1.8, 0, Math.PI * 2); g.stroke(); }
      circle(g, x + s * ex + lx, ey + ly, er, OL); circle(g, x + s * ex + lx + er * 0.3, ey + ly - er * 0.35, er * 0.3, '#fff'); }
    const by = ey - H * 0.25 - (brow[1] < 0 ? H * 0.08 : 0), tilt = brow[0] * s * k * 0.9;
    seg(g, [[x + s * (ex - H * 0.16), by + tilt * 0.5], [x + s * (ex + H * 0.16), by - tilt * 0.5]], 7 * k, OL);
  }
  const my = y + H * 0.38; g.strokeStyle = OL; g.lineWidth = 5 * k; g.lineCap = 'round'; g.beginPath();
  if (expr === 'happy') { g.arc(x, my - H * 0.08, H * 0.22, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
  else if (expr === 'smirk') { g.moveTo(x - H * 0.18, my); g.quadraticCurveTo(x + H * 0.05, my + H * 0.08, x + H * 0.22, my - H * 0.08); g.stroke(); }
  else if (['sad', 'worried'].includes(expr)) { g.arc(x, my + H * 0.14, H * 0.18, 1.2 * Math.PI, 1.8 * Math.PI); g.stroke(); }
  else if (['scared', 'shock'].includes(expr)) { g.fillStyle = OL; g.ellipse(x, my, H * 0.1, H * 0.13, 0, 0, Math.PI * 2); g.fill(); }
  else if (expr === 'angry') { g.moveTo(x - H * 0.16, my + 4); g.lineTo(x + H * 0.16, my + 4); g.stroke(); }
  else { g.moveTo(x - H * 0.12, my); g.lineTo(x + H * 0.12, my); g.stroke(); }
  if (out.beard) { g.fillStyle = '#5a3a22'; g.beginPath(); g.moveTo(x - H * 0.3, my - H * 0.12); g.quadraticCurveTo(x, my - H * 0.02, x + H * 0.3, my - H * 0.12); g.quadraticCurveTo(x, my - H * 0.24, x - H * 0.3, my - H * 0.12); g.fill(); g.beginPath(); g.moveTo(x - H * 0.06, my + H * 0.18); g.lineTo(x + H * 0.06, my + H * 0.18); g.lineTo(x, my + H * 0.5); g.fill(); }
}
function hat(g, x, y, H, kind, k) {
  g.lineWidth = 4 * k; g.strokeStyle = OL;
  if (kind === 'crown') { // small gold guan on a topknot
    circle(g, x, y - H * 1.02, H * 0.26, '#1b1b1f'); g.fillStyle = '#e8b33a'; g.beginPath(); g.moveTo(x - H * 0.32, y - H * 0.98); g.lineTo(x - H * 0.36, y - H * 1.32); g.lineTo(x - H * 0.15, y - H * 1.18); g.lineTo(x, y - H * 1.42); g.lineTo(x + H * 0.15, y - H * 1.18); g.lineTo(x + H * 0.36, y - H * 1.32); g.lineTo(x + H * 0.32, y - H * 0.98); g.closePath(); g.fill(); g.stroke();
    circle(g, x, y - H * 1.12, H * 0.07, '#c9302a'); seg(g, [[x - H * 0.55, y - H * 1.08], [x + H * 0.55, y - H * 1.08]], 4 * k, '#e8b33a'); }
  if (kind === 'mian') { // emperor's flat-top crown with bead strings
    rr(g, x - H * 0.25, y - H * 1.3, H * 0.5, H * 0.38, 4 * k); g.fillStyle = '#1b1b1f'; g.fill(); rr(g, x - H * 0.85, y - H * 1.42, H * 1.7, H * 0.16, 4 * k); g.fillStyle = '#1b1b1f'; g.fill(); g.strokeStyle = '#e8b33a'; g.lineWidth = 3 * k; g.stroke();
    for (let i = -4; i <= 4; i++) { const bx = x + i * H * 0.19; for (let j = 0; j < 4; j++) circle(g, bx, y - H * 1.2 + j * H * 0.14, H * 0.04, i % 2 ? '#e8b33a' : '#c9302a'); } }
  if (kind === 'bun') { circle(g, x, y - H * 1.02, H * 0.28, '#1b1b1f'); seg(g, [[x - H * 0.4, y - H * 1.05], [x + H * 0.4, y - H * 1.0]], 4 * k, '#e8b33a'); }
  if (kind === 'buns') { circle(g, x - H * 0.6, y - H * 0.8, H * 0.24, '#2a1a12'); circle(g, x + H * 0.6, y - H * 0.8, H * 0.24, '#2a1a12'); }
  if (kind === 'wusha') { rr(g, x - H * 0.5, y - H * 1.25, H, H * 0.4, H * 0.18); g.fillStyle = '#1b1b1f'; g.fill(); for (const s of [-1, 1]) { rr(g, x + s * H * 0.5 + (s < 0 ? -H * 0.75 : 0), y - H * 1.12, H * 0.75, H * 0.12, 4); g.fill(); } }
  if (kind === 'mask') { g.save(); g.beginPath(); g.arc(x, y, H, 0, Math.PI * 2); g.clip(); g.fillStyle = '#16161c'; g.fillRect(x - H, y - H, 2 * H, H * 0.75); g.fillRect(x - H, y + H * 0.12, 2 * H, H); g.restore(); }
}
// caption 1–2 words, white rounded bold + dark outline, keyword yellow
export function cap(g, words, y, keyIdx = -1) {
  const size = 92; g.save(); g.font = `700 ${size}px "Fredoka"`; const sp = size * 0.3; const ws = words.map(w => g.measureText(w).width); const tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = 475 - tot / 2; words.forEach((w, i) => { text(g, w, cx + ws[i] / 2, y, { size, font: 'Fredoka', weight: 700, color: i === keyIdx ? '#ffd23a' : '#ffffff', stroke: size * 0.14, strokeColor: '#1b1b1f' }); cx += ws[i] + sp; }); g.restore();
}
