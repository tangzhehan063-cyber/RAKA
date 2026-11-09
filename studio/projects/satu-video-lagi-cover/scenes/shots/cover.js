// cover.js — cover video #4: face under the red-orange blanket lit by the phone, big gold "6 JAM" + "CUKUP?".
// Text sits in the middle band so the 3:4 profile-grid crop still shows it.
import { E, S, registerShot, blurLayer, veil, alpha, glow, rr, text, FONTS } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import { kamar } from '../sets/kamar.js';
import { KAMU_FACE } from '../cast.js';

const SCREEN = '#bfe4ff';
registerShot('c01', { draw(g, t) {
  const cam = { z: 1.1 }, ui = S().ui;
  blurLayer(g, 14, (g) => kamar(g, 0.4, cam, { mood: 'night', clock: '02:06', rain: true }), cam, 0.5);
  veil(g, '#000', 0.45);
  const cx = E.W / 2, cy = 1300, r = 240;
  glow(g, cx, cy + r, r * 2.4, SCREEN, 0.3);
  bigFace(g, cx, cy, r, { outfit: KAMU_FACE, expr: 'sleepy', blink: false, look: [0.1, 0.8], rimColor: SCREEN, rimSide: 1, tilt: 0.03 });
  g.save(); g.translate(cx + 40, cy + r * 1.42); rr(g, -115, -165, 230, 330, 30); g.fillStyle = '#0b1013'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.85); g.lineWidth = 6; g.stroke(); g.restore();
  const ty = 700;
  const grd = g.createLinearGradient(0, ty - 420, 0, ty + 420);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.6)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, ty - 420, E.W, 840);
  glow(g, cx, ty, 520, ui.gold, 0.35);
  text(g, 'TIDUR', cx, ty - 250, { size: 76, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
  text(g, '6 JAM', cx, ty - 40, { size: 300, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'CUKUP?', cx, ty + 190, { size: 130, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
}});
