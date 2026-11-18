// 06_kelas.js — ruang ujian (parallax): siswa lain menulis (lengan bergerak), Nadia membeku lalu lancar. Kamera mendorong pelan.
import { E, V, S, registerShot, layer, mood, backdrop, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { NADIA } from '../cast.js';
import { rel, hud, TYPE } from './01_kamar.js';

const GY = () => E.H * V(0.8, 0.68);
const SISWA = [{ top: 'tshirt', color: '#b88a6a', head: 'none' }, { top: 'tshirt', color: '#8aa87a', head: 'none' }, { top: 'tshirt', color: '#a88ab8', head: 'none' }, { top: 'tshirt', color: '#c9a45a', head: 'none' }];
const WR = (t, k = 1, seed = 0) => ({ ...POSES.sit, head: [18, -172], sh: [8, -142], eF: [40, -118], hF: [74 + Math.sin(t * 13 + seed) * 6 * k, -108 + Math.cos(t * 10 + seed) * 3 * k], eB: [30, -106], hB: [60, -110] });
function meja(g, x, y, M, s = 1) { rr(g, x - 110 * s, y - 150 * s, 220 * s, 16 * s, 6); g.fillStyle = shade(M.floor, 0.12); g.fill(); seg(g, [[x - 96 * s, y - 136 * s], [x - 96 * s, y]], 8 * s, shade(M.floor, -0.1)); seg(g, [[x + 96 * s, y - 136 * s], [x + 96 * s, y]], 8 * s, shade(M.floor, -0.1)); }
function kelas(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), G = GY(), CX = E.W / 2;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(M.wall, -0.06), M.wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: CX - 420, y: G - 980, w: 520, h: 460, cols: 3, rows: 2, frame: shade(M.wall, -0.25), bar: 12 }, (g, x, y, w, h) => { backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.5, y + h * 0.8, 46, '#fff3dc', M.key, 4); });
    glow(g, CX - 160, G - 750, 500, M.key, 0.2);
    rr(g, CX + 180, G - 900, 300, 190, 8); g.fillStyle = shade(M.dark, 0.1); g.fill(); text(g, 'UJIAN', CX + 330, G - 805, { size: 56, color: shade(M.dark, 0.7), font: FONTS.ui, weight: 900, spacing: 4 });
    FX.godRays(g, CX - 160, G - 700, { count: 8, angle: Math.PI * 0.5, spread: 1.0, len: 1400, a: 0.05, t });
  });
  layer(g, cam, 0.7, (g) => {   // siswa lain di belakang (lebih kecil, lengan menulis)
    g.fillStyle = shade(M.floor, 0.02); g.fillRect(-E.W, G - 60, E.W * 3, E.H);
    [[CX + 200, 0], [CX + 470, 1], [CX + 330, 3]].forEach(([x, i]) => { meja(g, x + 40, G - 60, M, 0.9); drawFigure(g, { x: x - 30, y: G - 60, s: 1.05, facing: 1, outfit: SISWA[i], pose: o.semua ? WR(t, 1, i) : WR(t, 1, i), expr: 'neutral', look: [0.9, 0.5], blink: (t % 3.5) > 3.4 }); });
  });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.06), shade(M.floor, -0.12)]); g.fillRect(-E.W, G - 10, E.W * 3, E.H * 2);
    const bx = CX - 230; meja(g, bx + 150, G - 10, M, 1.15);
    rr(g, bx + 90, G - 188, 120, 8, 3); g.fillStyle = '#fffdf8'; g.fill();   // kertas ujian di meja
    drawFigure(g, { x: bx, y: G - 10, s: 1.3, facing: 1, outfit: NADIA, pose: o.pose, expr: o.expr || 'neutral', look: [0.9, 0.6], blink: (t % 3.2) > 3.1, rim: { color: M.key, dir: [1, -0.2], w: 3 } });
    if (o.after) o.after(g, bx, G - 10);
  });
  FX.dust(g, t, { count: 14, color: '#fff2d0', a: 0.15 });
  return { G, M };
}
// s06 11.5–14.4: Nadia menatap kertas, kosong (kamera mendorong, siswa lain menulis)
registerShot('s06', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tk = rel('Kosong', info, 2.1), z = lerp(1.25, 2.0, k), tr = Math.sin(t * 4) * 1.5;
  const m = kelas(g, t, { z, x: lerp(0, -70, k), y: lerp(-20, 120, k) }, { pose: { ...POSES.sit, head: [14, -176], sh: [6, -146], eF: [38, -126], hF: [66 + tr, -128], eB: [28, -110], hB: [60, -114] }, expr: 'worried',
    after: (g, bx, gy) => { for (let i = 0; i < 3; i++) { const u = ((t - 0.5) * 0.7 + i * 0.3) % 1; if (t > 0.5) circle(g, bx + 34 + i * 6, gy - 330 + u * 90, 8 * (1 - u * 0.4), alpha('#9fd0ff', 0.85 * (1 - u))); } } });
  const a = ease.outBack(prog(t, tk - 0.1, tk + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 560); g.scale(a, a); text(g, 'KOSONG', 0, 0, { size: 150, color: '#d64a33', font: FONTS.ui, weight: 900, glow: 18, glowColor: 'rgba(0,0,0,.4)' }); g.restore(); }
} });
// s17 60.5–64.2: ujian berikutnya, menulis lancar
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kelas(g, t, { z: lerp(1.2, 1.55, k), x: lerp(0, -40, k), y: 0 }, { pose: WR(t, 1.6, 5), expr: 'happy', mood: 'golden',
    after: (g, bx, gy) => { for (let i = 0; i < 4; i++) { const at = 0.5 + i * 0.7, u = prog(t, at, at + 0.9); if (u > 0 && u < 1) { g.save(); g.globalAlpha *= 1 - u; g.translate(bx + 150 + i * 30, gy - 260 - u * 160); seg(g, [[-14, 0], [-4, 12], [18, -16]], 8, '#2f8a57'); g.restore(); } } } });
  hud(g, 'LANCAR', ease.out(prog(t, 1.4, 1.8)));
} });
