// 02_kamar.js — s05 (kamar malam, gelembung kritik melayang) dan s09 (bigFace latar buram). Moodboard.
import { E, V, S, registerShot, layer, blurLayer, veil, mood, backdrop, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { BAYU, KRITIK } from '../cast.js';

const GYk = () => E.H * V(0.8, 0.68);
export function kamar(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), G = GYk(), CX = E.W / 2, wall = shade(M.wall, -0.2);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.4), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: CX - 360, y: G - 1000, w: 420, h: 520, cols: 2, rows: 2, frame: shade(wall, -0.5), bar: 12 }, (g, x, y, w, h) => { backdrop(g, M.sky, [x, y, w, h]); FX.moon(g, x + w * 0.7, y + h * 0.26, 34); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.42, color: alpha(shade(M.sky[0], -0.5), 0.9), windowColor: alpha(M.practical, 0.5), lit: 0.12, seed: 21 }); });
    glow(g, CX - 150, G - 740, 520, M.rim, 0.14); FX.godRays(g, CX - 150, G - 740, { count: 8, angle: Math.PI * 0.5, spread: 0.9, len: 1300, a: 0.05, t });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.02), shade(M.floor, -0.4)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, CX - 150, G + 50, 520, 60, M.rim, 0.2);
    FX.bed(g, { x: CX + 140, y: G, w: 640, color: shade(M.wall, 0.12), frame: shade(M.wall, -0.5), pillow: shade(M.rim, -0.1) });
  });
  return { G, CX, M };
}
export const bubble = (g, x, y, r, col, a = 1, str = null) => { g.save(); g.globalAlpha *= a; circle(g, x, y, r, alpha(col, 0.92)); glow(g, x, y, r * 2.2, col, 0.35); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 4; g.stroke(); if (str) text(g, str, x, y + 2, { size: r * 0.34, color: '#fff', font: FONTS.ui, weight: 900, spacing: 1 }); g.restore(); };
// s05 10.5–14.4: malam, Bayu duduk di tepi kasur; gelembung kritik membesar di atasnya
registerShot('s05', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.25, 1.5, k), x: lerp(-40, 20, k), y: lerp(10, 50, k) };
  const { G, CX, M } = kamar(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX + 20, y: G - 4, s: 1.5, facing: 1, outfit: BAYU, pose: breathe({ ...POSES.sit, head: [24, -158], sh: [14, -130], eF: [30, -100], hF: [58, -96] }, t, 0.5, 6), expr: 'worried', look: [0.6, -0.5], blink: (t % 3.3) > 3.2, rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    const r = lerp(40, 150, ease.out(prog(t, 0.2, 2.2))), bob = Math.sin(t * 1.6) * 10;
    bubble(g, CX + 80, G - 640 + bob, r, KRITIK, 1, r > 90 ? 'SLIDE 4' : null);
  });
  blurLayer(g, 12, (g) => { rr(g, -40, G - 160, E.W + 80, 260, 40); g.fillStyle = shade(M.dark, -0.5); g.fill(); }, cam, 1.7);   // selimut/tepi kasur buram di depan
  FX.dust(g, t, { count: 22, color: M.rim, a: 0.22 }); FX.fog(g, G - 140, 240, M.fog, 0.25);
} });
// s09 19.7–22.8: wajah besar, latar kamar buram dan digelapkan
registerShot('s09', { draw(g, t, info) {
  const ui = S().ui, cx = E.W / 2 - 20, cy = 840, r = 300;
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: 80, y: 120 }, { mood: 'night' }), null, 1); veil(g, '#000', 0.5);
  glow(g, cx + r, cy, r * 2, shade(mood('night').rim, 0), 0.22);
  bigFace(g, cx, cy, r, { outfit: BAYU, expr: t > 1.4 ? 'sad' : 'worried', blink: (t % 3.2) > 3.08, look: [0.3, 0.5], rimColor: mood('night').rim, rimSide: 1, tilt: 0.04 });
  for (let i = 0; i < 3; i++) { const a = ease.outBack(prog(t, 0.8 + i * 0.3, 1.1 + i * 0.3)); if (a > 0) { g.save(); g.translate(cx + 340 - i * 120, cy - 360 - (i % 2) * 70); g.scale(a, a); text(g, '?', 0, 0, { size: 130 - i * 16, color: KRITIK, font: FONTS.ui, weight: 900 }); g.restore(); } }
  FX.dust(g, t, { count: 18, color: mood('night').rim, a: 0.2 });
} });
