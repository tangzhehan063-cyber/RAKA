// 01_kamar.js — kamar kos Dimas: s01 s02 s07 s14 s15 s16 s23 s33 s38 s44 s45.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, deskPos } from '../sets/kamar.js';
import { DIMAS } from '../cast.js';
import { rel, pop, tumpukan, tumpukanGeom } from '../_util.js';
const SCR = '#bfe4ff';

function dudukMeja(g, t, GY, M, o = {}) {
  const [dx] = deskPos(), s = o.s ?? 2.0, x = dx - 210, hipY = GY + 8 - 71 * s;
  seg(g, [[x - 62 * s * 0.55, hipY + 8], [x - 62 * s * 0.55, hipY - 120 * s * 0.55]], 12, shade(M.wall, -0.5));
  rr(g, x - 52, hipY + 6, 118, 14, 6); g.fillStyle = shade(M.wall, -0.45); g.fill();
  seg(g, [[x - 36, hipY + 18], [x - 40, GY + 8]], 8, shade(M.wall, -0.55)); seg(g, [[x + 50, hipY + 18], [x + 54, GY + 8]], 8, shade(M.wall, -0.55));
  const pose = breathe({ ...POSES.sit, head: [14, -170], eF: [30, -108], hF: [58, -112], eB: [24, -104], hB: [52, -108] }, t, 0.5, 4);
  drawFigure(g, { x, y: GY + 8, s, facing: 1, outfit: DIMAS, pose, expr: o.expr || 'sad', look: o.look || [0.7, 0.5], blink: (t % 3.5) > 3.38, rim: { color: o.rim || SCR, dir: [1, 0.1], w: 4 } });
  return [x, GY - 150];
}
const ALASAN = ['UKT', 'DIKTAT', 'IBU', 'GENGSI', 'NANGGUNG', '2 TAHUN'];

// s01 0–2.4: wajah besar diterangi layar laptop
registerShot('s01', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: 60, y: 60 }, { mood: 'night', clock: '02:00' }), null, 1); veil(g, '#000', 0.55);
  const cx = E.W / 2, cy = E.H * 0.46, r = 260, z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, SCR, 0.28);
  bigFace(g, cx, cy, r, { outfit: DIMAS, expr: 'sleepy', blink: (t % 3.3) > 3.18, look: [0.1, 0.8], rimColor: SCR, rimSide: 1, tilt: 0.03 });
  g.restore(); FX.dust(g, t, { count: 22, color: SCR, a: 0.25 });
} });
// s02 2.4–4.6: wide, 02.00
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.3, k), x: 130, y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:00', lamp: 1 });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M));
  FX.dust(g, t, { count: 26, color: SCR, a: 0.22 });
  UI.badge(g, { str: '02.00', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) });
} });
// s07 18.0–19.7: wajah ragu
registerShot('s07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: 60, y: 60 }, { mood: 'night', clock: '02:00' }), null, 1); veil(g, '#000', 0.55);
  const cx = E.W / 2, cy = E.H * 0.46, r = 270, z = 1 + 0.1 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, SCR, 0.3);
  bigFace(g, cx, cy, r, { outfit: DIMAS, expr: 'worried', blink: (t % 3.3) > 3.18, look: [0.7, 0.5], rimColor: SCR, rimSide: 1, tilt: -0.03 });
  g.restore(); FX.dust(g, t, { count: 18, color: SCR, a: 0.22 });
} });
// s14 35.68–38.82: tinggal tiga semester, nanggung
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.2, 1.1, k), x: 130, y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:30', lamp: 1 });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M, { expr: 'sad' }));
  UI.badge(g, { str: '3 SEMESTER', x: E.W - V(120, 150), y: V(110, 300), a: ease.out(prog(t, 0.2, 0.6)) });
  FX.dust(g, t, { count: 20, color: SCR, a: 0.2 });
} });
// s15 38.82–42.6: tiap alasan nambah buku di tumpukan (menara tumbuh)
registerShot('s15', { draw(g, t, info) {
  const cam = { z: 1.1, x: -40, y: 20 }; const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:40', lamp: 1 });
  const ts = [0.3, 0.9, 1.5, 2.1, 2.7, 3.3], cnt = ts.filter((x) => t > x).length, n = 3 + cnt * 3, last = ts.filter((x) => t > x).pop() ?? 0, px = E.W / 2 - 300;
  layer(g, cam, 1, (g) => {
    const top = tumpukan(g, px, GY, n, { pop: ease.outBack(prog(t, last, last + 0.25)) });
    drawFigure(g, { x: E.W / 2 + 130, y: GY + 8, s: 1.9, facing: -1, outfit: DIMAS, pose: breathe(POSES.stand, t, 0.5, 2), expr: 'sad', look: [-0.5, 0.2], blink: (t % 3.4) > 3.26, rim: { color: SCR, dir: [-1, 0], w: 4 } });
    if (cnt > 0) { const a = pop(t, last, 0.3); g.save(); g.translate(px, GY - top - 50); g.scale(a, a); text(g, ALASAN[cnt - 1], 0, 0, { size: 50, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 14, glowColor: alpha(S().ui.gold, 0.4) }); g.restore(); }
  });
  FX.dust(g, t, { count: 20, color: SCR, a: 0.2 });
} });
// s16 42.6–46.46: kamera naik, menara buku menjulang, Dimas kecil
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 0.7, k), x: -40, y: lerp(20, -560, k) }; const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:50', lamp: 1 });
  layer(g, cam, 1, (g) => {
    const sway = Math.sin(t * 1.3) * 3 * k; g.save(); g.translate(E.W / 2 - 300, GY); g.rotate(sway * 0.002); g.translate(-(E.W / 2 - 300), -GY);
    tumpukan(g, E.W / 2 - 300, GY, 36); g.restore();
    drawFigure(g, { x: E.W / 2 + 130, y: GY + 8, s: 1.9, facing: -1, outfit: DIMAS, pose: breathe(POSES.stand, t, 0.5, 2), expr: 'worried', look: [-0.6, -0.6], blink: (t % 3.4) > 3.26, rim: { color: SCR, dir: [-1, 0], w: 4 } });
  });
  FX.dust(g, t, { count: 24, color: SCR, a: 0.2 });
} });
// s23 62.5–64.3: freeze-frame wajah Dimas
registerShot('s23', { draw(g, t, info) {
  blurLayer(g, 16, (g) => kamar(g, 0, { z: 1.8, x: 60, y: 60 }, { mood: 'night', clock: '02:00' }), null, 1); veil(g, '#0a1a2f', 0.62);
  const cx = E.W / 2, cy = E.H * 0.46, r = 270;
  glow(g, cx, cy + r * 0.9, r * 2.2, '#8fb4ff', 0.22);
  bigFace(g, cx, cy, r, { outfit: DIMAS, expr: 'sad', blink: false, look: [0.2, 0.9], rimColor: '#8fb4ff', rimSide: 1, tilt: 0.05 });
  FX.dust(g, t * 0.4, { count: 40, color: '#cfe0ff', a: 0.4 });
} });
// s33 103.04–106.72: Dimas bukan satu-satunya (siluet lain muncul)
registerShot('s33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.0, 0.9, k), x: 0, y: 40 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:00', lamp: 1 });
  layer(g, cam, 1, (g) => {
    [[-360, 0.3], [-190, 0.6], [330, 0.9], [500, 1.2]].forEach(([dx, at], i) => { const a = ease.out(prog(t, at, at + 0.5)); if (a > 0) { g.save(); g.globalAlpha *= a * 0.9; drawFigure(g, { x: E.W / 2 + dx, y: GY + 8, s: 1.7, facing: dx < 0 ? 1 : -1, ink: '#0a1018', inkFar: '#05080c', outfit: { top: 'none', head: 'none' }, pose: breathe(POSES.stand, t, 0.5, i), expr: 'neutral', rim: { color: '#9fb8d8', dir: [0, -1], w: 3 }, shadow: false }); g.restore(); } });
    drawFigure(g, { x: E.W / 2 + 70, y: GY + 8, s: 1.9, facing: 1, outfit: DIMAS, pose: breathe(POSES.stand, t, 0.5, 1), expr: t > 1.0 ? 'smile' : 'sad', look: [0, 0], blink: (t % 3.4) > 3.26, rim: { color: SCR, dir: [1, 0], w: 4 } });
  });
  FX.dust(g, t, { count: 20, color: SCR, a: 0.2 });
} });
// s38 124.2–128.82: Dimas menatap tabel
registerShot('s38', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: 60, y: 60 }, { mood: 'night', clock: '23:20', lamp: 1 }), null, 1); veil(g, '#000', 0.5);
  const cx = E.W / 2, cy = E.H * 0.46, r = 270, z = 1 + 0.08 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, '#ffd45a', 0.28);
  bigFace(g, cx, cy, r, { outfit: DIMAS, expr: t > 2.6 ? 'determined' : 'thinking', blink: (t % 3.3) > 3.18, look: [0.2, 0.9], rimColor: '#ffd45a', rimSide: 1, tilt: 0.03 });
  g.restore(); FX.dust(g, t, { count: 22, color: '#ffd45a', a: 0.25 });
} });
// s44 144.81–151.29: Dimas menarik satu buku dari tengah tumpukan, cahaya masuk lewat celahnya
registerShot('s44', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.0, 1.15, k), x: -40, y: -140 }; const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:00', lamp: 1 });
  const tp = rel('pilih', info, 4.8) - 1.6, pull = ease.out(prog(t, tp, tp + 1.4)), bx = E.W / 2 - 300, N = 30, hi = 7, geo = tumpukanGeom(N, bx, GY), hb = geo[hi];
  layer(g, cam, 1, (g) => {
    if (pull > 0) { glow(g, hb.cx, hb.cy, 760, '#fff3c8', 0.55 * pull); FX.godRays(g, hb.cx, hb.cy, { angle: Math.PI * 0.5, spread: 2.6, len: 1500, a: 0.18 * pull, t, color: '#fff3c8', count: 9 }); }
    tumpukan(g, bx, GY, N, { hole: hi });
    if (pull > 0) { g.save(); g.translate(hb.cx + 190 * pull, hb.cy + 250 * pull * pull); g.rotate(0.5 * pull); rr(g, -hb.w / 2, -hb.h / 2, hb.w, hb.h, 5); g.fillStyle = '#8a4a5a'; g.fill(); rr(g, hb.w / 2 - 22, -hb.h / 2 + 4, 20, hb.h - 8, 3); g.fillStyle = '#f1e8d2'; g.fill(); g.restore(); }
    drawFigure(g, { x: bx + 330, y: GY + 8, s: 1.9, facing: -1, outfit: DIMAS, pose: pull > 0.05 ? POSES.reach : breathe(POSES.stand, t, 0.5, 2), expr: pull > 0.3 ? 'determined' : 'thinking', look: [-0.6, -0.3], blink: (t % 3.4) > 3.26, rim: { color: '#ffe9a8', dir: [-1, 0], w: 5 } });
  });
  FX.dust(g, t, { count: 28, color: '#ffe9a8', a: 0.3 });
} });
// s45 151.29–154.82: kamar yang sama, lampu hidup, sketsa
registerShot('s45', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.3, k), x: 130, y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '02:00', lamp: 1 });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M, { expr: 'determined', rim: '#ffd45a' }));
  FX.dust(g, t, { count: 24, color: '#ffd45a', a: 0.22 });
  UI.badge(g, { str: '02.00', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) });
} });
