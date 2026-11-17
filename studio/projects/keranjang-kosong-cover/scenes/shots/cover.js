// cover.js — cover video #11: dinding produk skincare kembar memudar, teks di pita tengah (aman crop 3:4), keranjang kosong 0 di bawah.
import { E, S, registerShot, alpha, glow, text, rr, circle, FONTS } from '/engine/core.js';
import { kartu, cart } from './01_kamar.js';

registerShot('c01', { draw(g, t) {
  g.fillStyle = '#ece5d6'; g.fillRect(0, 0, E.W, E.H);
  for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) kartu(g, 150 + c * 260 + (r % 2) * 40, 120 + r * 300, 220, 270, 3 + r * 5 + c * 2);
  const cy = E.H * 0.34, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(255,250,240,0)'); grd.addColorStop(0.5, 'rgba(255,250,240,.94)'); grd.addColorStop(1, 'rgba(255,250,240,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  text(g, 'CUMA MAU BELI SATU', E.W / 2, cy - 330, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: 0.95 });
  text(g, '2.000', E.W / 2, cy - 130, { size: 230, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, 'PILIHAN', E.W / 2, cy + 100, { size: 190, color: '#c0392b', font: FONTS.ui, weight: 900, spacing: 2 });
  rr(g, E.W / 2 - 260, 1180, 520, 220, 110); g.fillStyle = 'rgba(255,253,248,.96)'; g.fill(); g.strokeStyle = 'rgba(43,47,58,.16)'; g.lineWidth = 4; g.stroke();
  cart(g, E.W / 2 - 110, 1292, 1.7, 0); text(g, '0', E.W / 2 + 130, 1296, { size: 170, color: '#d64a33', font: FONTS.ui, weight: 900 });
}});
