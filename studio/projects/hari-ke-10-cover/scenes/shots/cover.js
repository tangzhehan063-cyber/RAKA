// cover.js — TikTok/Shorts cover: rainy night room (day 9), Raka on the bed, big "66, BUKAN 21".
// Text sits in the middle band so the 3:4 profile-grid crop still shows it.
import { E, V, S, registerShot, layer, veil, alpha, glow, seg, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { bedroom } from '../sets/bedroom.js';
import { HERO } from '../cast.js';

registerShot('c01', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: V(0, -120) };
  const { GY, M } = bedroom(g, 0.4, cam, { mood: 'night', rain: true, day: 9, calGlow: 0.7 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(190, 120), y: GY, s: V(1.25, 1.45), facing: 1, outfit: HERO, pose: POSES.sit,
    expr: 'worried', look: [1, 0.4], rim: { color: M.rim, dir: [-0.4, -1] } }));
  FX.drops(g, 0.4, { count: 40, rMin: 3, rMax: 12, color: M.rim });
  // dark band behind the title for legibility
  const cy = E.H * 0.47, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 420, 0, cy + 420);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.62)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 420, E.W, 840);
  glow(g, E.W / 2, cy - 110, 520, ui.gold, 0.35);
  text(g, '66,', E.W / 2, cy - 120, { size: 330, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'BUKAN 21', E.W / 2, cy + 140, { size: 150, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
  seg(g, [[E.W / 2 + 120, cy + 190], [E.W / 2 + 330, cy + 90]], 14, ui.accent);   // strike through "21"
  text(g, 'HARI', E.W / 2, cy - 330, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 14, alpha: 0.9 });
}});
