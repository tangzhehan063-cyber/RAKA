// 04_jurang.js — s16: jurang antara NIAT dan AKSI (momen visual khas video ini).
import { E, V, S, mood, registerShot, layer, ease, prog, lerp, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { jurang } from '../sets/jurang.js';
import { BAYU } from '../cast.js';
import { rel, pop } from '../_util.js';
registerShot('s16', { draw(g, t, info) {
  const ui = S().ui, k = ease.inOut(t / info.dur), cam = { z: lerp(1.0, 1.18, k), x: 0, y: lerp(0, 30, k) };
  const { GY, M, L, R } = jurang(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: L - 150, y: GY + 8, s: 2.0, facing: 1, outfit: BAYU, pose: breathe(POSES.sad, t, 0.5, 3), expr: 'sad', look: [0.9, 0.2], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [0.8, -0.5], w: 4 } });
    const a = pop(t, rel('niat', info, 2.2), 0.3);
    if (a > 0) { g.save(); g.translate(L - 150, GY - 560); g.scale(a, a); text(g, 'NIAT', 0, 0, { size: 118, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 24, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
    const b = pop(t, 0.5, 0.3); if (b > 0) { g.save(); g.translate(R + 150, GY - 480); g.scale(b, b); text(g, 'AKSI', 0, 0, { size: 118, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, glow: 20, glowColor: alpha(ui.cream, 0.3) }); g.restore(); }
  });
  FX.dust(g, t, { count: 28, color: M.rim, a: 0.3 });
} });
