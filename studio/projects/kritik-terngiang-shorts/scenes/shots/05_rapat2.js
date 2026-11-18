// 05_rapat2.js — shot di ruang rapat: s02 (10 komentar), s03 (9 pujian), s19 (slide dirapikan), s21 (loop wide), s22 (10 komentar lagi).
import { E, V, S, registerShot, layer, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rapat, mejaRapat, kursiDepan } from '../sets/rapat.js';
import { BAYU, TEMAN4, KRITIK, PUJI } from '../cast.js';
import { bub } from '../_util.js';
import { rel } from './06_kamar2.js';

const ink = () => ({ top: 'tshirt', color: S().ink, head: 'none' });
function orang(g, t, G, CX, M, s) { [100, 260, 420].forEach((x, i) => { FX.chair(g, CX + x + 36, G, s, shade(M.dark, -0.4)); drawFigure(g, { x: CX + x, y: G - 6, s, facing: -1, outfit: i === 1 ? TEMAN4 : ink(), pose: breathe(POSES.sit, t, 0.6, i + 2), expr: 'neutral', look: [-0.9, 0], blink: (t % 3.3 + i) > 3.2, rim: { color: M.rim, dir: [0.7, -0.5], w: 4 } }); }); }
function medium(g, t, info, o = {}) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.22, 1.34, k), x: lerp(-30, 10, k), y: 20 };
  const { G, CX, M } = rapat(g, t, cam, { mood: 'golden', slide: o.slide || 'PRESENTASI' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX - 250, y: G + 6, s: 1.55, facing: 1, outfit: o.outfit || BAYU, pose: breathe(o.pose || POSES.explain, t, 0.6, 4), expr: o.expr || 'smile', rim: { color: M.rim, dir: [0.4, -1], w: 5 } });
    orang(g, t, G, CX, M, 1.35); mejaRapat(g, G, CX, M, t);
    if (o.bubbles) o.bubbles(g, t, G, CX, M);
  });
  kursiDepan(g, cam, M, G); FX.dust(g, t, { count: 24, color: '#ffe9c0', a: 0.28 });
}
const pos = (i, G, CX, n = 5) => [CX + 50 + (i % n) * 100, G - 470 - Math.floor(i / n) * 72 + Math.sin(i * 1.7) * 8];
// s02 2.3–4.15: 10 orang memberi komentar
registerShot('s02', { draw(g, t, info) {
  medium(g, t, info, { bubbles: (g, t, G, CX) => { let n = 0; for (let i = 0; i < 10; i++) { const a = ease.outBack(prog(t, 0.1 + i * 0.12, 0.4 + i * 0.12)); if (a > 0) n++; const [x, y] = pos(i, G, CX); bub(g, x, y + Math.sin(t * 1.5 + i) * 5, 90, 44, i === 9 ? KRITIK : PUJI, null, clamp(a * 1.2)); } } });
  UI.badge(g, { str: 'KOMENTAR 10', a: ease.out(prog(t, 0.4, 0.8)), size: 38 });
} });
// s03 4.15–7.3: sembilan bilang bagus, rapi, jelas
registerShot('s03', { draw(g, t, info) {
  const tb = rel('bagus', info, 0.6), tr = rel('rapi', info, 1.4), tj = rel('jelas', info, 2.1);
  medium(g, t, info, { expr: 'happy', bubbles: (g, t, G, CX) => {
    for (let i = 0; i < 9; i++) { const [x, y] = pos(i, G, CX, 3); bub(g, x - 10, y + 30 + Math.sin(t * 1.4 + i) * 5, 84, 40, PUJI, null, 0.55); }
    [['BAGUS', tb, CX + 40, G - 700], ['RAPI', tr, CX + 190, G - 770], ['JELAS', tj, CX + 330, G - 700]].forEach(([s, at, x, y]) => { const a = ease.outBack(prog(t, at - 0.1, at + 0.25)); if (a > 0) { g.save(); g.translate(x, y); g.scale(a, a); bub(g, 0, 0, 190, 88, PUJI, s, 1); g.restore(); } });
  } });
} });
// s19 50.3–52.3: slide empat dia rapikan (zoom ke layar, bar menyejajar)
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(2.2, 2.45, k), x: -580, y: -480 }, u = ease.inOut(prog(t, 0.2, 1.4));
  rapat(g, t, cam, { mood: 'golden', slide: 'SLIDE 4', bars: [lerp(0.5, 0.6, u), lerp(0.8, 0.6, u), lerp(0.35, 0.6, u), lerp(0.65, 0.6, u)], screenGlow: 1.6 });
  const ui = S().ui; if (u > 0.95) UI.badge(g, { str: 'RAPI', a: ease.out(prog(t, 1.4, 1.8)), size: 44 });
  FX.dust(g, t, { count: 18, color: '#ffe9c0', a: 0.3 });
} });
// s21 54.5–57.5: loop, establishing wide lagi, tokoh kuning
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.18, 1.3, k), x: lerp(-20, 20, k), y: 40 };
  const { G, CX, M } = rapat(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: CX - 300, y: G + 6, s: 1.3, facing: 1, outfit: TEMAN4, pose: breathe(posesAt(t, [[0, POSES.relaxed], [1.2, POSES.explain]]), t, 0.7, 4), expr: 'smile', rim: { color: M.rim, dir: [0.2, -1], w: 5 } }); orang(g, t, G, CX, M, 1.15); mejaRapat(g, G, CX, M, t); });
  kursiDepan(g, cam, M, G); FX.dust(g, t, { count: 30, color: '#ffe9c0', a: 0.3 }); FX.lensStreak(g, CX - 200, G - V(700, 900), E.W, M.key, 0.18, 3); FX.fog(g, G - 120, 260, M.fog, 0.2);
} });
// s22 57.5–60.88: 10 komentar masuk, sembilan bilang bagus
registerShot('s22', { draw(g, t, info) {
  medium(g, t, info, { outfit: TEMAN4, expr: 'smile', bubbles: (g, t, G, CX) => { for (let i = 0; i < 10; i++) { const a = ease.outBack(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)); const [x, y] = pos(i, G, CX); bub(g, x, y + Math.sin(t * 1.5 + i) * 5, 90, 44, i === 9 ? KRITIK : PUJI, null, clamp(a * 1.2)); } } });
  UI.badge(g, { str: 'KOMENTAR 10', a: ease.out(prog(t, 0.2, 0.6)), size: 38 });
} });
