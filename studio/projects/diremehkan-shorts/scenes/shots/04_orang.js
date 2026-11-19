// 04_orang.js — s18 pilihan ahli/asal bicara, s20 hapus tangkapan layar + target 10 pesanan (jalan, parallax street).
import { E, V, S, registerShot, layer, veil, mood, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, walkPose, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { street } from '../sets/street.js';
import { RIZAL, TEMAN, HINA } from '../cast.js';
import { rel, pop, bub, hpBesar } from '../_util.js';
// s18 55.7–61.5: Rizal bertanya: ahli atau asal bicara?
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.15, 1.3, k), x: V(-60, -60), y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:20', lamp: 1 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - 200, y: GY + 8, s: 1.75, facing: 1, outfit: RIZAL, pose: breathe(POSES.think, t, 0.5, 3), expr: 'thinking', look: [0.6, -0.3], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [0.8, -0.4], w: 4 } });
    const a = pop(t, 1.2, 0.4), b = pop(t, 2.8, 0.4);
    if (a > 0) { g.save(); g.translate(E.W / 2 + 160, GY - 620); g.scale(a, a); bub(g, 0, 0, 300, 110, '#3a6ea5', 'AHLI?', 1); g.restore(); }
    if (b > 0) { g.save(); g.translate(E.W / 2 + 230, GY - 470); g.scale(b, b); bub(g, 0, 0, 380, 110, HINA, 'ASAL BICARA?', 1); g.restore(); }
  });
  FX.dust(g, t, { count: 22, color: M.rim, a: 0.2 });
} });
// s20 62.8–69.3: hapus tangkapan layar, tulis target, lalu berjalan
registerShot('s20', { draw(g, t, info) {
  const ui = S().ui, tTarget = rel('target', info, 3.0);
  if (t < 3.0) {   // HP raksasa: tangkapan layar terhapus
    const M = mood('night'); veil(g, '#070b12', 1); const hx = E.W * 0.5, hy = E.H * 0.5, s = 1.5, del = prog(t, 0.6, 1.8);
    hpBesar(g, hx, hy, s, '#141c2c', (g, hx, hy, s) => { g.save(); g.globalAlpha *= 1 - del; g.translate(hx, hy - 40 * s); g.scale(1 - 0.4 * del, 1 - 0.4 * del); bub(g, 0, 0, 215 * s, 118 * s, HINA, 'KAMU NGGAK\nBAKAL SANGGUP', 1, 24 * s); g.restore(); if (del > 0.85) text(g, 'TERHAPUS', hx, hy + 120 * s, { size: 30 * s, color: '#ffffff', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 1.6, 2.0)) }); });
    FX.dust(g, t, { count: 16, color: M.rim, a: 0.22 });
  } else {         // berjalan di jalan dengan target
    const t2 = t - 3.0, speed = 250, runX = E.W / 2 - 200 + t2 * speed, cam = { z: 1.3, x: runX - E.W / 2, y: 0 };
    const { GY, M } = street(g, t2, cam, { mood: 'golden', sunY: 0.3, lamps: true, rays: 1.2 });
    const s = V(1.5, 1.85);
    layer(g, cam, 1, (g) => drawFigure(g, { x: runX, y: GY + 20, s, facing: 1, outfit: RIZAL, pose: walkPose(t2 * Math.PI * 2 * 1.3, { stride: 26, lift: 12, arm: 16 }), expr: 'determined', look: [0.9, 0], blink: (t2 % 3.1) > 2.98, rim: { color: M.rim, dir: [0.6, -0.8], w: 3 } }));
    FX.fog(g, GY - 160, 260, M.fog, 0.28); FX.dust(g, t2, { count: 22, color: '#ffe9c0', a: 0.22 });
    const a = ease.outBack(prog(t, tTarget - 0.1, tTarget + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 400); g.scale(a, a); rr(g, -330, -100, 660, 200, 20); g.fillStyle = '#f3e6a8'; g.fill(); text(g, 'TARGET', 0, -40, { size: 36, color: '#3a3040', font: FONTS.ui, weight: 900, spacing: 4 }); text(g, '10 PESANAN', 0, 20, { size: 74, color: '#d64a33', font: FONTS.ui, weight: 900 }); text(g, 'sebelum Jumat', 0, 68, { size: 30, color: '#3a3040', font: FONTS.ui, weight: 800 }); g.restore(); }
  }
} });
