// 08_jalan.js — s16: Bayu berjalan ke kantor pagi (kamera mengikuti, parallax street), gelembung kritik mengecil. Gaya GrowKaz: langkah, parallax, kabut, sinar.
import { E, V, S, registerShot, layer, ease, prog, clamp, lerp, alpha, glow, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { BAYU, KRITIK } from '../cast.js';
import { bub } from '../_util.js';

registerShot('s16', { draw(g, t, info) {
  const speed = 250, runX = E.W / 2 - 200 + t * speed, cam = { z: 1.3, x: runX - E.W / 2, y: 0 };
  const { GY, M } = street(g, t, cam, { mood: 'golden', sunY: 0.3, lamps: true, rays: 1.2 });
  const s = V(1.5, 1.85);
  layer(g, cam, 1, (g) => drawFigure(g, { x: runX, y: GY + 20, s, facing: 1, outfit: BAYU, pose: walkPose(t * Math.PI * 2 * 1.3, { stride: 26, lift: 12, arm: 16 }), expr: 'determined', look: [0.9, 0], blink: (t % 3.1) > 2.98, rim: { color: M.rim, dir: [0.6, -0.8], w: 3 } }));
  FX.fog(g, GY - 160, 260, M.fog, 0.28); FX.dust(g, t, { count: 22, color: '#ffe9c0', a: 0.22 });
  const r = lerp(1, 0.3, ease.inOut(prog(t, 0.2, 2.0))), hy = GY + 20 - 210 * s * 0.9;
  bub(g, E.W / 2 + 120, hy - 220 + Math.sin(t * 2) * 6, 300 * r, 140 * r, KRITIK, r > 0.7 ? 'KURANG\nMEYAKINKAN' : null, 1 - 0.3 * prog(t, 1.5, 2.3));
} });
