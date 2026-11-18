// 01_rapat.js — s01 (establishing wide ruang rapat), moodboard: Bayu kecil di depan layar, peserta siluet, latar depan buram, debu dan sinar.
import { E, V, S, registerShot, layer, ease, prog, clamp, lerp, alpha, shade, glow, rr, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rapat, kursiDepan } from '../sets/rapat.js';
import { BAYU, KRITIK, PUJI } from '../cast.js';

registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.04, 1.16, k), x: lerp(-30, 20, k), y: 0 };
  const { G, CX, M } = rapat(g, t, cam, { mood: 'golden', slide: 'PRESENTASI' });
  layer(g, cam, 0.85, (g) => {   // peserta duduk (siluet, tanpa warna)
    [-380, -190, 0, 190, 380].forEach((x, i) => drawFigure(g, { x: CX + x, y: G - 5, s: 0.95, facing: i % 2 ? 1 : -1, outfit: { top: 'tshirt', color: S().ink, head: 'none' }, pose: breathe(POSES.sit, t, 0.6, i + 2), expr: 'neutral', rim: { color: M.rim, dir: [0, -1], w: 4 } }));
  });
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX + 330, y: G + 18, s: 1.25, facing: -1, outfit: BAYU, pose: breathe(posesAt(t, [[0, POSES.relaxed], [1.2, POSES.explain]]), t, 0.7, 4), expr: 'smile', rim: { color: M.rim, dir: [-0.6, -0.6], w: 5 } }));
  kursiDepan(g, cam, M, G);
  FX.dust(g, t, { count: 26, color: '#ffe9c0', a: 0.3 }); FX.fog(g, G - 120, 260, M.fog, 0.2);
} });
