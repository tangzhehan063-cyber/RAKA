// 06_jalan.js — Bayu berjalan/berlari di gang pagi emas, kamera mengikuti (parallax): s35 s36.
import { E, V, S, mood, registerShot, layer, blurLayer, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, walkPose, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { BAYU } from '../cast.js';
import { rel, pop } from '../_util.js';
const gaya = (t, ph) => { const run = (t < 1.25 || t > 2.2) ? 1 : 0, k = run ? 1 : 0; return { run: !!run, pose: walkPose(ph, { run: !!run, lean: run ? 14 : 4 }) }; };
registerShot('s35', { draw(g, t, info) {
  const sp = 260, cam = { z: 1.15, x: t * sp, y: 40 }, ph = t * 2 * Math.PI * (t < 1.25 || t > 2.2 ? 2.1 : 1.3);
  const { GY, M } = street(g, t, cam, { mood: 'golden', sunY: 0.15, rays: 1 });
  const { pose } = gaya(t, ph);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.38 + cam.x, y: GY + 8, s: 1.9, facing: 1, outfit: BAYU, pose, expr: 'determined', look: [0.9, 0], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [0.8, -0.3], w: 5 }, trail: (t < 1.25 ? { count: 3, dx: -26, a: 0.18 } : null) }));
  blurLayer(g, 12, (h) => { for (let i = 0; i < 3; i++) { const x = E.W * 1.2 + i * 1400; rr(h, x, E.H * 0.3, 120, E.H * 0.8, 40); h.fillStyle = shade(M.dark, -0.4); h.fill(); } }, cam, 1.7);
  FX.dust(g, t, { count: 34, color: M.key, a: 0.4 }); FX.lensStreak(g, E.W * 0.78, E.H * 0.34, E.W, '#ffe6cc', 0.3);
  const a = pop(t, rel('300', info, 0.7), 0.3); if (a > 0) { g.save(); g.translate(E.W - 160, E.H * 0.1); g.scale(a, a); text(g, '300 M', 0, 0, { size: 70, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 18, glowColor: alpha(S().ui.gold, 0.5) }); g.restore(); }
} });
registerShot('s36', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.2, 0.85, k), x: 780 + t * 70, y: lerp(40, -40, k) }, ph = t * 2 * Math.PI * 1.2;
  const { GY, M } = street(g, t, cam, { mood: 'golden', sunY: lerp(0.15, 0.3, k), rays: 1.4 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.44 + cam.x, y: GY + 8, s: 1.6, facing: 1, outfit: BAYU, pose: walkPose(ph, { stride: 24 }), expr: 'smile', look: [0.9, -0.1], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [0.8, -0.3], w: 5 } }));
  FX.dust(g, t, { count: 40, color: M.key, a: 0.45 }); FX.lensStreak(g, E.W * 0.66, E.H * 0.3, E.W, '#ffe6cc', 0.4);
} });
