// cover #21 "Kursi Prioritas": komik mint, teks di pita tengah (aman untuk crop 3:4).
import { E, registerShot, alpha, rr, poly, circle, FONTS } from '/engine/core.js';
const INK = '#14121a';
const sticker = (g, str, x, y, size, col, rot = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
registerShot('c01', { draw(g) {
  g.fillStyle = '#b8f2d8'; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = alpha('#ff9eb5', 0.35); for (let y = 0; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18; x < E.W; x += 36) { g.beginPath(); g.arc(x, y, 3 + 4 * (y / E.H), 0, 6.3); g.fill(); }
  const cx = E.W / 2, cy = 830, pts = []; for (let i = 0; i < 28; i++) { const a = 0.1 + i * Math.PI / 14, r = i % 2 ? 400 : 590; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  poly(g, pts, '#ffd6a5'); g.lineWidth = 12; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  sticker(g, 'MINTA KURSI', cx, 500, 135, '#fffdf5', -0.05);
  sticker(g, 'SOPAN?', cx, 790, 205, '#ff5a36', 0.03);
  g.save(); g.translate(cx, 1090); g.rotate(-0.05); rr(g, -420 + 10, -90 + 12, 840, 180, 36); g.fillStyle = INK; g.fill(); rr(g, -420, -90, 840, 180, 36); g.fillStyle = '#fffdf5'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.font = `900 68px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff5a36'; g.fillText('BU WATI: TERPUTUS...', 0, 6); g.restore();
} });
