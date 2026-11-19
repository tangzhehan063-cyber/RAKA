// 02_insert.js — shot sisip: s03 HP raksasa + chat hinaan, s05 kepalan tangan, s08 Rizal berpikir, s09 meteran panas.
import { E, V, S, registerShot, layer, blurLayer, veil, mood, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { RIZAL, HINA } from '../cast.js';
import { rel, pop, bub, hpBesar } from '../_util.js';

// s03 4.2–8.5: HP raksasa, chat teman: Kamu nggak bakal sanggup
registerShot('s03', { draw(g, t, info) {
  const M = mood('night'); blurLayer(g, 14, (g) => kamar(g, t, { z: 1.7, x: -200, y: 40 }, { mood: 'night' }), null, 1); veil(g, '#000', 0.45);
  const k = ease.inOut(prog(t, 0, 0.7)), hx = E.W * 0.5, hy = E.H * 0.5 + (1 - k) * 160, s = 1.5, tk = rel('Kamu', info, 2.2);
  hpBesar(g, hx, hy, s, '#141c2c', (g, hx, hy, s) => {
    text(g, 'TEMAN', hx, hy - 200 * s, { size: 22 * s, color: alpha('#fff', 0.7), font: FONTS.ui, weight: 900 });
    const a = pop(t, 0.5, 0.35); if (a > 0) { g.save(); g.translate(hx - 4 * s, hy - 60 * s); g.scale(a, a); bub(g, 0, 0, 205 * s, 90 * s, '#4a5b7a', 'ngomong\nsama kamu?', 1, 22 * s); g.restore(); }
    const b = pop(t, tk, 0.4); if (b > 0) { g.save(); g.translate(hx + 4 * s, hy + 90 * s); g.scale(b, b); bub(g, 0, 0, 215 * s, 118 * s, HINA, 'KAMU NGGAK\nBAKAL SANGGUP', 1, 24 * s); g.restore(); }
  });
  FX.rings(g, hx, hy, t, { count: 3, r0: 200, r1: 520, speed: 0.35, color: M.rim, a: 0.25 }); FX.dust(g, t, { count: 20, color: M.rim, a: 0.25 });
} });
// s05 10.0–12.5: INSERT kepalan tangan (dada panas)
registerShot('s05', { draw(g, t, info) {
  const M = mood('night'); blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: 60, y: 60 }, { mood: 'night' }), null, 1); veil(g, '#000', 0.5);
  const cx = E.W / 2, cy = E.H * 0.48, k = ease.out(prog(t, 0, 0.6)), sh = Math.sin(t * 40) * 3 * prog(t, 0.8, 2.4), s = 2.2 + 0.1 * t;
  glow(g, cx, cy, 700, HINA, 0.18 + 0.12 * Math.sin(t * 5)); FX.rings(g, cx, cy, t, { count: 3, r0: 160, r1: 560, speed: 0.6, color: HINA, a: 0.4 });
  g.save(); g.translate(cx + sh, cy + (1 - k) * 200); g.scale(s, s);
  seg(g, [[-120, 220], [-90, 50]], 56, RIZAL.color); seg(g, [[-90, 50], [-90, 20]], 54, '#0b0f1a');
  rr(g, -84, -70, 168, 128, 44); g.fillStyle = '#f0d2b6'; g.fill();      // kepalan
  for (let i = 0; i < 4; i++) { rr(g, -76 + i * 38, -62, 34, 52, 16); g.strokeStyle = 'rgba(80,40,20,.55)'; g.lineWidth = 4; g.stroke(); }
  rr(g, -36, 10, 118, 40, 18); g.strokeStyle = 'rgba(80,40,20,.55)'; g.stroke(); g.restore();
  FX.dust(g, t, { count: 24, color: HINA, a: 0.3 });
} });
// s08 18.4–22.0: Rizal berpikir; tangkapan layar jadi bahan bakar?
registerShot('s08', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.2, 1.4, k), x: V(-60, -60), y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:00', lamp: 1 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - 60, y: GY + 8, s: 1.5, facing: 1, outfit: RIZAL, pose: breathe(POSES.think, t, 0.5, 3), expr: 'thinking', look: [0.5, -0.6], blink: (t % 3.4) > 3.26, rim: { color: M.rim, dir: [0.8, -0.4], w: 4 } });
    const a = pop(t, rel('bensin', info, 2.2) - 1.0, 0.4), r = 130; if (a > 0) { g.save(); g.translate(E.W / 2 + 120, GY - 700 + Math.sin(t * 1.8) * 8); g.scale(a, a); bub(g, 0, 0, 360, 170, HINA, 'HINAAN =\nBAHAN BAKAR?', 1); g.restore(); }
  });
  FX.dust(g, t, { count: 22, color: M.rim, a: 0.2 });
} });
// s09 22.0–24.5: meteran panas naik (marah = tenaga)
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, k = ease.out(prog(t, 0.1, 1.9)), cx = E.W / 2;
  text(g, 'MARAH', cx, 430, { size: 110, color: HINA, font: FONTS.ui, weight: 900, spacing: 8, glow: 22, glowColor: alpha(HINA, 0.5) });
  rr(g, cx - 120, 540, 240, 720, 40); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke();
  const h = 680 * k; rr(g, cx - 106, 1246 - h, 212, h, 30); g.fillStyle = HINA; g.fill(); glow(g, cx, 1246 - h, 300, HINA, 0.35);
  text(g, 'TENAGA?', cx, 1340, { size: 70, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 1.0, 1.5)) });
} });
