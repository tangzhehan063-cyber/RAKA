// cover.js — cover #16: jurang NIAT/AKSI dengan jembatan papan menyala, Bayu di tepi; teks di pita tengah (aman crop 3:4).
import { E, V, S, registerShot, glow, text, alpha, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { jurang } from '../sets/jurang.js';
import { BAYU } from '../cast.js';

registerShot('c01', { draw(g, t) {
  const ui = S().ui, cam = { z: 1.15, x: 0, y: 40 };
  const { GY, M, L } = jurang(g, 9, cam, { mood: 'night', planks: 6 });
  drawFigureHere(g, GY, L, M);
  FX.dust(g, 3, { count: 40, color: M.rim, a: 0.35 });
  const cy = E.H * 0.3, grd = g.createLinearGradient(0, cy - 380, 0, cy + 380); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(4,12,28,.8)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = grd; g.fillRect(0, cy - 380, E.W, 760);
  text(g, 'KALAU – MAKA', E.W / 2, cy - 150, { size: 96, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, '71%', E.W / 2, cy + 40, { size: 270, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 28, glowColor: alpha(ui.gold, 0.5) });
  text(g, 'vs 32% NIAT SAJA', E.W / 2, cy + 200, { size: 58, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
} });
function drawFigureHere(g, GY, L, M) {
  // Bayu berdiri di papan pertama, menghadap seberang
  const z = 1.15, sx = (x) => (x - (E.W / 2 + 0)) * z + E.W / 2, sy = (y) => (y - (E.H / 2 + 40)) * z + E.H / 2;
  g.save(); g.translate(sx(L + 60), sy(GY - 8)); g.scale(z, z);
  drawFigure(g, { x: 0, y: 0, s: 2.0, facing: 1, outfit: BAYU, pose: POSES.determined || POSES.stand, expr: 'determined', look: [1, 0], rim: { color: M.rim, dir: [0.8, -0.4], w: 5 } });
  g.restore();
}
