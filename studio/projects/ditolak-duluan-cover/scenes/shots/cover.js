// cover.js — cover video #7: papan skor 87 vs 86 + surat penolakan berbingkai; teks di pita tengah (aman crop 3:4).
import { E, S, registerShot, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import { letter } from './01_cerita.js';
import { HERO } from '../cast.js';

registerShot('c01', { draw(g, t) {
  g.fillStyle = '#070b12'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W / 2, 900, 1000, '#8fe8ff', 0.14);
  letter(g, E.W * 0.72, 1460, 1.5, { frame: 1, rot: 0.06 });
  drawFigure(g, { x: E.W * 0.28, y: 1820, s: 2.6, facing: 1, outfit: HERO, pose: POSES.sad, expr: 'sad', look: [1, -0.3], blink: false, rim: { color: '#8fe8ff', dir: [1, -1] } });
  const cy = 820, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 450, 0, cy + 450);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.75)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 450, E.W, 900);
  text(g, 'SANDI', E.W * 0.28, cy - 330, { size: 52, color: '#7fb3ff', font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, 'BIMA', E.W * 0.72, cy - 330, { size: 52, color: '#ff8a6b', font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, '87', E.W * 0.28, cy - 140, { size: 260, color: '#e8f2ff', font: FONTS.ui, weight: 900, glow: 30, glowColor: 'rgba(140,230,255,.6)' });
  text(g, '86', E.W * 0.72, cy - 140, { size: 260, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) });
  text(g, 'KALAH 1 POIN', E.W / 2, cy + 160, { size: 130, color: '#ff6f61', font: FONTS.ui, weight: 900, spacing: 3, stroke: 16, strokeColor: 'rgba(0,0,0,.85)', glow: 26, glowColor: 'rgba(255,111,97,.5)' });
  text(g, 'sial atau untung?', E.W / 2, cy + 300, { size: 62, color: ui.cream, font: FONTS.ui, weight: 800 });
}});
