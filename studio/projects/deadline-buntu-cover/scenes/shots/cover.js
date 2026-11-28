// cover #18 "Deadline Buntu": komik mint, teks di pita tengah (aman untuk crop 3:4).
import { E, registerShot, alpha, rr, poly, FONTS } from '/engine/core.js';
const INK = '#14121a';
const sticker = (g, str, x, y, size, col, rot = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
registerShot('c01', { draw(g) {
  g.fillStyle = '#b8f2d8'; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = alpha('#ff9eb5', 0.5); for (let y = 0; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18; x < E.W; x += 36) { g.beginPath(); g.arc(x, y, 3 + 4 * (y / E.H), 0, 6.3); g.fill(); }
  const cx = E.W / 2, cy = 860, pts = []; for (let i = 0; i < 28; i++) { const a = 0.1 + i * Math.PI / 14, r = i % 2 ? 400 : 590; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  poly(g, pts, '#ff9eb5'); g.lineWidth = 12; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  sticker(g, 'KEPEPET', cx, 690, 200, '#fffbe8', -0.05); sticker(g, 'KREATIF?', cx, 900, 180, '#2563eb', 0.04);
  g.save(); g.translate(cx, 1190); g.rotate(-0.04); rr(g, -340 + 10, -85 + 12, 680, 170, 36); g.fillStyle = INK; g.fill(); rr(g, -340, -85, 680, 170, 36); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.font = `900 100px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff4d2e'; g.fillText('HASILNYA?', 0, 6); g.restore();
} });
