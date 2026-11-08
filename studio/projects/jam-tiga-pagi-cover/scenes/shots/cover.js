// cover.js — cover video #2: 3 AM room, Nara awake on the bed, Si Ramalan looming, big "91% NGGAK TERJADI".
// Text sits in the middle band so the 3:4 profile-grid crop still shows it.
import { E, V, S, registerShot, layer, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { kamar, ramalan } from '../sets/kamar.js';
import { NARA } from '../cast.js';

registerShot('c01', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: V(0, -60) };
  const { GY, M } = kamar(g, 0.4, cam, { mood: 'night', rain: true });
  layer(g, cam, 0.95, (g) => ramalan(g, 0.4, E.W / 2 + 20, GY - 30, 2.0, { a: 1, pose: POSES.point, facing: -1, look: [1, 0.6], rimW: 7 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 220, y: GY - 60, s: 1.4, facing: 1, outfit: NARA, pose: POSES.crouch,
    expr: 'scared', look: [1, -0.3], rim: { color: M.rim, dir: [-0.4, -1] } }));
  FX.drops(g, 0.4, { count: 40, rMin: 3, rMax: 12, color: M.rim });
  const cy = E.H * 0.42, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.66)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  glow(g, E.W / 2, cy - 90, 540, ui.gold, 0.35);
  text(g, 'KETAKUTANMU', E.W / 2, cy - 330, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: 0.92 });
  text(g, '91%', E.W / 2, cy - 100, { size: 330, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'NGGAK TERJADI', E.W / 2, cy + 140, { size: 104, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
}});
