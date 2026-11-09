// cover.js — cover video #2: night room, Dimas on the bed looking up at the dusty guitar on the wardrobe. "76% / BUKAN KESALAHANMU".
// Text sits in the middle band so the 3:4 profile-grid crop still shows it.
import { E, V, S, registerShot, layer, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { kamar } from '../sets/kamar.js';
import { DIMAS } from '../cast.js';

registerShot('c01', { draw(g, t) {
  const cam = { z: 1.2, x: V(0, 60), y: V(0, 330) };
  const { GY, M } = kamar(g, 0.4, cam, { mood: 'night', rain: true, dust: 1, gGlow: 0.8 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(200, 250), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS, pose: { ...POSES.sit, head: [10, -184] },
    expr: 'sad', look: [1, -0.8], rim: { color: M.rim, dir: [-0.6, -1] } }));
  FX.dust(g, 0.4, { count: 50, color: '#cfe0ff', a: 0.35 });
  const cy = E.H * 0.54, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 400, 0, cy + 400);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.62)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 400, E.W, 800);
  glow(g, E.W / 2, cy - 90, 520, ui.gold, 0.35);
  text(g, '76%', E.W / 2, cy - 100, { size: 300, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'BUKAN', E.W / 2, cy + 120, { size: 110, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, stroke: 16, strokeColor: 'rgba(0,0,0,.85)' });
  text(g, 'KESALAHANMU', E.W / 2, cy + 240, { size: 112, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, stroke: 16, strokeColor: 'rgba(0,0,0,.85)' });
  text(g, 'PENYESALAN TERBESAR', E.W / 2, cy - 320, { size: 52, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: 0.9 });
}});
