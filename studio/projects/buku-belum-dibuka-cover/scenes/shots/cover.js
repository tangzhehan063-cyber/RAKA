// cover #18 "Buku Belum Dibuka": komik malam, teks di pita tengah (aman untuk crop 3:4).
import { E, registerShot, alpha, rr, poly, FONTS } from '/engine/core.js';
const INK = '#14121a';
const sticker = (g, str, x, y, size, col, rot = 0) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `900 ${size}px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * 0.17; g.strokeStyle = INK; g.strokeText(str, 10, 12); g.fillStyle = INK; g.fillText(str, 10, 12); g.strokeText(str, 0, 0); g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
};
registerShot('c01', { draw(g) {
  g.fillStyle = '#2b1b6b'; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = alpha('#ff3d9a', 0.3); for (let y = 0; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18; x < E.W; x += 36) { g.beginPath(); g.arc(x, y, 3 + 4 * (y / E.H), 0, 6.3); g.fill(); }
  const cx = E.W / 2, cy = 860, pts = []; for (let i = 0; i < 28; i++) { const a = 0.1 + i * Math.PI / 14, r = i % 2 ? 400 : 590; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  poly(g, pts, '#ffd400'); g.lineWidth = 12; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
  g.save(); g.translate(cx, 900); g.rotate(0.06); rr(g, -250 + 14, -330 + 16, 500, 660, 16); g.fillStyle = INK; g.fill(); rr(g, -250, -330, 500, 660, 16); g.fillStyle = '#46d2ff'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.fillStyle = alpha(INK, 0.25); g.fillRect(-244, -324, 52, 648); rr(g, -150, -250, 320, 60, 8); g.fillStyle = alpha('#fffbe8', 0.9); g.fill(); rr(g, -150, -160, 200, 36, 8); g.fillStyle = alpha('#fffbe8', 0.7); g.fill();
  g.font = `900 100px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = INK; g.fillText('RAJIN', 20, 60); g.restore();
  sticker(g, 'BUKU', cx, 520, 250, '#fffbe8', -0.05);
  g.save(); g.translate(cx, 1130); g.rotate(-0.05); rr(g, -400 + 10, -90 + 12, 800, 180, 36); g.fillStyle = INK; g.fill(); rr(g, -400, -90, 800, 180, 36); g.fillStyle = '#fffbe8'; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
  g.font = `900 88px "${FONTS.ui}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff3d9a'; g.fillText('BELUM DIBUKA', 0, 6); g.restore();
} });
