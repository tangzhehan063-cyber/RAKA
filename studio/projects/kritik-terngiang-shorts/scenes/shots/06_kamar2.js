// 06_kamar2.js — shot kamar/insert: s07, s08, s15, s17, s20. (export rel untuk shot lain)
import { E, V, S, registerShot, layer, blurLayer, veil, mood, ease, prog, clamp, lerp, wordTime, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from './02_kamar.js';
import { rapat } from '../sets/rapat.js';
import { BAYU, KRITIK, PUJI } from '../cast.js';
import { bub, lengan } from '../_util.js';

export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const SIT = { ...POSES.sit, head: [24, -158], sh: [14, -130], eF: [30, -100], hF: [58, -96] };
function bayuKamar(g, t, cam, o = {}) {
  const { G, CX, M } = kamar(g, t, cam, { mood: o.mood || 'night' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX + 20, y: G - 4, s: 1.5, facing: 1, outfit: BAYU, pose: breathe(o.pose || SIT, t, 0.5, 6), expr: o.expr || 'worried', look: [0.6, -0.5], blink: (t % 3.3) > 3.2, rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    if (o.bubbles) o.bubbles(g, t, G, CX, M);
  });
  FX.dust(g, t, { count: 22, color: M.rim, a: 0.22 }); FX.fog(g, G - 140, 240, M.fog, 0.25);
  return { G, CX, M };
}
// s07 16.7–18.3: sembilan pujian tadi? (memudar), satu merah tetap
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.2, 1.35, k), x: lerp(-20, 10, k), y: 20 };
  bayuKamar(g, t, cam, { bubbles: (g, t, G, CX) => {
    bub(g, CX + 90, G - 640 + Math.sin(t * 1.6) * 8, 300, 140, KRITIK, 'KURANG\nMEYAKINKAN', 1);
    for (let i = 0; i < 9; i++) { const a = 1 - ease.inOut(prog(t, 0.2 + i * 0.06, 1.3 + i * 0.04)); bub(g, CX - 220 + (i % 3) * 120, G - 860 + Math.floor(i / 3) * 62, 96, 46, PUJI, null, a * 0.9); }
  } });
} });
// s08 18.3–19.7: sudah lupa isinya (pujian terurai jadi debu)
registerShot('s08', { draw(g, t, info) {
  const cam = { z: 1.35, x: 10, y: 20 };
  bayuKamar(g, t, cam, { expr: 'sad', bubbles: (g, t, G, CX, M) => {
    bub(g, CX + 90, G - 640, 300, 140, KRITIK, 'KURANG\nMEYAKINKAN', 1);
    for (let i = 0; i < 9; i++) { const u = prog(t, 0.0 + i * 0.05, 1.1); for (let k = 0; k < 5; k++) { const a = i * 2.1 + k * 1.3, d = u * (70 + k * 30); circle(g, CX - 220 + (i % 3) * 120 + Math.cos(a) * d, G - 860 + Math.floor(i / 3) * 62 - u * 80 + Math.sin(a) * d * 0.6, 6 * (1 - u), alpha(PUJI, 0.9 * (1 - u))); } }
  } });
} });
// s15 40.9–42.0: Bayu nggak lebay (pagi, lega)
registerShot('s15', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.2, 1.32, k), x: -20, y: 20 };
  bayuKamar(g, t, cam, { mood: 'golden', expr: 'smile', pose: posesAt(t, [[0, SIT], [0.7, POSES.relaxed]]), bubbles: (g, t, G, CX) => { const r = lerp(1, 0.35, ease.inOut(prog(t, 0.1, 1.0))); bub(g, CX + 120, G - 640, 300 * r, 140 * r, KRITIK, r > 0.7 ? 'KURANG\nMEYAKINKAN' : null, 1); } });
  FX.lensStreak(g, E.W / 2, 500, E.W, '#fff3dc', 0.2, 3);
} });
// s17 44.3–47.0: INSERT menulis 10 komentar di satu kertas (tangan raksasa + pena)
registerShot('s17', { draw(g, t, info) {
  const ui = S().ui, M = mood('golden');
  blurLayer(g, 14, (g) => rapat(g, t, { z: 1.6, x: -80, y: 60 }, { mood: 'golden' }), null, 1); veil(g, '#000', 0.35);
  const px = E.W / 2, py = E.H * 0.52;
  g.save(); g.translate(px, py); g.rotate(-0.04); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 40; g.shadowOffsetY = 16; rr(g, -380, -430, 760, 860, 18); g.fillStyle = shade(M.wall, 0.7); g.fill(); g.shadowColor = 'transparent';
  for (let i = 0; i < 10; i++) { const k = prog(t, 0.2 + i * 0.22, 0.5 + i * 0.22); const y = -340 + i * 78; circle(g, -320, y, 14, i === 9 ? KRITIK : PUJI); seg(g, [[-280, y], [-280 + 560 * ease.out(k), y]], 8, shade(M.dark, -0.2)); }
  g.restore();
  const wi = clamp(t / 2.4), hx = px - 330 + 560 * (wi * 10 % 1), hy = py - 340 + Math.min(9, Math.floor(wi * 10)) * 78;
  lengan(g, hx + 80, hy + 80, 1.1); seg(g, [[hx, hy], [hx + 160, hy - 60]], 16, '#0b0f1a'); seg(g, [[hx, hy], [hx - 6, hy + 14]], 6, KRITIK);
  FX.dust(g, t, { count: 16, color: '#ffe9c0', a: 0.25 });
} });
// s20 52.3–54.5: INSERT sembilan pujian dibaca ulang (HP hangat)
registerShot('s20', { draw(g, t, info) {
  const M = mood('golden');
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.7, x: -200, y: 40 }, { mood: 'golden' }), null, 1); veil(g, '#000', 0.25);
  const k = ease.inOut(prog(t, 0, 0.7)), hx = E.W * 0.52, hy = E.H * 0.52 + (1 - k) * 160, s = 1.35;
  lengan(g, hx, hy, s);
  rr(g, hx - 130 * s, hy - 250 * s, 260 * s, 480 * s, 34 * s); g.fillStyle = '#0a0d16'; g.fill(); rr(g, hx - 116 * s, hy - 236 * s, 232 * s, 452 * s, 26 * s); g.fillStyle = shade(M.sky[1] || '#e6c8a0', 0.1); g.fill();
  glow(g, hx, hy, 460, M.key, 0.3);
  const words = ['BAGUS', 'RAPI', 'JELAS', 'KEREN', 'OKE', 'MANTAP', 'PAS', 'SIP', 'JOSS'];
  words.forEach((w, i) => { const a = ease.outBack(prog(t, 0.2 + i * 0.16, 0.5 + i * 0.16)); if (a > 0) { g.save(); g.translate(hx, hy - 190 * s + i * 46 * s); g.scale(a, a); bub(g, 0, 0, 180 * s, 36 * s, PUJI, w, 1, 22 * s); g.restore(); } });
  for (let i = 0; i < 4; i++) seg(g, [[hx + 130 * s, hy + (150 - i * 38) * s], [hx + 188 * s - i * 8 * s, hy + (112 - i * 40) * s]], 34 * s, '#0b0f1a');
  FX.rings(g, hx, hy - 40, t, { count: 3, r0: 200, r1: 520, speed: 0.35, color: M.key, a: 0.3 }); FX.dust(g, t, { count: 22, color: '#ffe9c0', a: 0.3 });
} });
