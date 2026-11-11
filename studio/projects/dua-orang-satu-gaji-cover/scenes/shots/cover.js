// cover.js — cover video #6: layar terbelah hangat|dingin, "5 JUTA = 5 JUTA", "KOK BEDA?". Teks di pita tengah (aman crop 3:4).
import { E, S, registerShot, alpha, glow, text, FONTS } from '/engine/core.js';
import { split } from './01_cerita.js';

registerShot('c01', { draw(g, t) {
  split(g, 0.4, { L: { expr: 'joy', box: true }, R: { expr: 'worried' } });
  const cy = 560, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.72)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  glow(g, E.W / 2, cy - 60, 540, ui.gold, 0.3);
  text(g, 'GAJI SAMA', E.W / 2, cy - 280, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, '5 JUTA', E.W * 0.26, cy - 90, { size: 130, color: '#ffb36b', font: FONTS.ui, weight: 900, glow: 30, glowColor: 'rgba(255,170,90,.7)' });
  text(g, '5 JUTA', E.W * 0.74, cy - 90, { size: 130, color: '#8fe8ff', font: FONTS.ui, weight: 900, glow: 30, glowColor: 'rgba(140,230,255,.7)' });
  text(g, 'KOK BEDA?', E.W / 2, cy + 160, { size: 170, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, stroke: 18, strokeColor: 'rgba(0,0,0,.85)', glow: 30, glowColor: alpha(ui.gold, 0.6) });
}});
