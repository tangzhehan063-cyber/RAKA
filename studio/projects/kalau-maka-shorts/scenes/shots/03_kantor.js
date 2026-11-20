// 03_kantor.js — kantor sore (satu lokasi, dipakai dua kali): s13 (over-the-shoulder) s14 (mengangguk).
import { E, V, S, mood, registerShot, layer, blurLayer, veil, ease, prog, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kantor } from '../sets/kantor.js';
import { BAYU, TEMAN } from '../cast.js';
import { rel, pop } from '../_util.js';

// s13 31.7–35.3: temannya bilang "kurang disiplin" (bahu temannya buram di latar depan)
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.05, 1.2, k), x: 60, y: 30 };
  const { GY, M } = kantor(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.66, y: GY + 8, s: 1.9, facing: -1, outfit: BAYU, pose: breathe(POSES.stand, t, 0.5, 2), expr: t > 2.2 ? 'sad' : 'neutral', look: [-0.8, 0.2], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [-1, -0.2], w: 4 } }));
  blurLayer(g, 12, (h) => drawFigure(h, { x: E.W * 0.08, y: GY + 380, s: 4.4, facing: 1, outfit: TEMAN, pose: breathe(POSES.talk, t, 0.5, 5), expr: 'smirk', ink: S().ink, rim: { color: M.rim, dir: [1, -0.4], w: 6 }, shadow: false }), cam, 1.7);
  const a = pop(t, rel('kurang', info, 2.3), 0.3); if (a > 0) { g.save(); g.translate(E.W * 0.36, E.H * 0.3); g.scale(a, a); UI.bubble(g, 0, 0, { w: 640, h: 110, color: '#f4efe6', dots: true, str: 'KURANG DISIPLIN' }); g.restore(); }
  FX.dust(g, t, { count: 22, color: M.key, a: 0.25 });
} });
// s14 35.3–37.2: Bayu mengangguk
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.25, 1.35, k), x: 40, y: 30 };
  const { GY, M } = kantor(g, t, cam, { mood: 'dusk', dim: 0.15 });
  const nod = Math.sin(t * 9) * 7 * (t < 1.1 ? 1 : 0.3);
  const pose = breathe({ ...POSES.sad, head: [12, -192 + nod] }, t, 0.4, 1);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.55, y: GY + 8, s: 2.0, facing: -1, outfit: BAYU, pose, expr: 'sad', look: [-0.2, 0.7], blink: (t % 3.2) > 3.08, rim: { color: M.rim, dir: [-1, -0.2], w: 4 } }));
  blurLayer(g, 14, (h) => { for (let i = 0; i < 6; i++) seg(h, [[E.W * 0.9, E.H * 0.95], [E.W * 0.9 + (i - 2.5) * 70, E.H * 0.62 - (i % 2) * 90]], 44, shade(M.grass || '#3f6a55', -0.3)); }, cam, 1.7);
  FX.dust(g, t, { count: 22, color: M.key, a: 0.25 });
} });
