// cover.js — cover #15: menara diktat menjulang, Dimas kecil di sampingnya; teks di pita tengah (aman crop 3:4).
import { E, V, S, registerShot, mood, backdrop, alpha, shade, glow, text, circle, rr, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { DIMAS } from '../cast.js';
import { tumpukan } from '../_util.js';

registerShot('c01', { draw(g, t) {
  const M = mood('dusk'); backdrop(g, [shade(M.wall, 0.15), shade(M.wall, -0.1)]); glow(g, E.W / 2, E.H * 0.75, 1000, '#ffd45a', 0.18);
  const GY = 1820; tumpukan(g, E.W / 2 - 120, GY, 22);
  drawFigure(g, { x: E.W / 2 + 270, y: GY + 8, s: 2.3, facing: -1, outfit: DIMAS, pose: POSES.stand, expr: 'worried', look: [-0.6, -0.8], rim: { color: '#ffe9a8', dir: [-1, -0.2], w: 5 } });
  const cy = E.H * 0.3, grd = g.createLinearGradient(0, cy - 380, 0, cy + 380); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(40,24,12,.82)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = grd; g.fillRect(0, cy - 380, E.W, 760);
  text(g, 'SUDAH', E.W / 2, cy - 110, { size: 130, color: '#fff3dc', font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, 'TERLANJUR', E.W / 2, cy + 50, { size: 168, color: '#ffd45a', font: FONTS.ui, weight: 900, spacing: 3, glow: 22, glowColor: 'rgba(255,170,60,.55)' });
  text(g, '(DI JURUSAN INI)', E.W / 2, cy + 190, { size: 54, color: '#fff3dc', font: FONTS.ui, weight: 900, spacing: 4 });
}});
