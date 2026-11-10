// cover.js — cover video #5: night bedroom, hero lying with the phone, giant "52 HARI DIBUANG", red marker.
// Text sits in the middle band so the 3:4 profile-grid crop still shows it.
import { E, V, S, registerShot, layer, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import { bedroom } from '../sets/bedroom.js';
import { marker } from '../sets/kalender.js';
import { KAMU } from '../cast.js';

registerShot('c01', { draw(g, t) {
  const cam = { z: 1.15, x: V(-160, -160), y: V(40, 20) };
  const { GY, M } = bedroom(g, 0.4, cam, { mood: 'night', day: 52 });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: 200, y: GY + 40, s: 1.25, rot: -Math.PI / 2, facing: 1, outfit: KAMU, pose: POSES.lie, expr: 'smile', look: [0.6, -0.6], rim: { color: M.rim, dir: [0.2, -1] }, shadow: false });
    marker(g, E.W / 2 + 40, GY + 60, 0.15, 0.9, false); });
  const cy = E.H * 0.42, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.7)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  glow(g, E.W / 2, cy - 90, 540, ui.gold, 0.35);
  text(g, 'NUNGGU 1 JANUARI?', E.W / 2, cy - 330, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: 0.92 });
  text(g, '52 HARI', E.W / 2, cy - 100, { size: 230, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'DIBUANG', E.W / 2, cy + 140, { size: 130, color: '#ff6a52', font: FONTS.ui, weight: 900, spacing: 4, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
}});
