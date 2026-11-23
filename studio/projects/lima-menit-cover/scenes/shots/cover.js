// cover #17 "Lima Menit": komik kuning, teks di pita tengah (aman untuk crop 3:4).
import { E, registerShot, alpha, rr, poly, FONTS } from '/engine/core.js';
const INK = '#14121a';
const sticker = (g, str, x, y, size, col, rot = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
registerShot('c01', { draw(g) {
  g.fillStyle = '#ffd400'; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = alpha('#ff4d2e', 0.28); for (let y = 0; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18; x < E.W; x += 36) { g.beginPath(); g.arc(x, y, 3 + 4 * (y / E.H), 0, 6.3); g.fill(); }
  const cx = E.W / 2, cy = 860, pts = []; for (let i = 0; i < 28; i++) { const a = 0.1 + i * Math.PI / 14, r = i % 2 ? 400 : 590; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  poly(g, pts, '#ff4d2e'); g.lineWidth = 12; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  sticker(g, 'LIMA', cx, 690, 270, '#fffbe8', -0.05); sticker(g, 'MENIT', cx, 910, 270, '#2f6bff', 0.04);
  g.save(); g.translate(cx, 1190); g.rotate(-0.04); rr(g, -340 + 10, -85 + 12, 680, 170, 36); g.fillStyle = INK; g.fill(); rr(g, -340, -85, 680, 170, 36); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.font = `900 120px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff4d2e'; g.fillText('BOHONG!', 0, 6); g.restore();
} });
