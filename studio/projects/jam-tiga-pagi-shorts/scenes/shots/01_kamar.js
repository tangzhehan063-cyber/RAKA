// 01_kamar.js — the bedroom at 3 AM: lying awake, Si Ramalan whispering, the freeze, the lamp, sleep, dawn, loop.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, ramalan, note, digiClock } from '../sets/kamar.js';
import { NARA } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const BX = () => E.W / 2 - V(330, 250);   // where Nara lies on the bed
export function score(g, ram, ter, a = 1) {
  const x = E.W - V(90, 70), y = V(110, 230);
  text(g, 'RAMALAN ' + ram, x, y, { size: V(34, 40), color: S().ui.cream, align: 'right', font: FONTS.ui, weight: 900, spacing: 2, alpha: a, glow: 12, glowColor: alpha('#000', 0.6) });
  text(g, 'TERJADI ' + ter, x, y + V(48, 56), { size: V(34, 40), color: S().ui.gold, align: 'right', font: FONTS.ui, weight: 900, spacing: 2, alpha: a, glow: 16, glowColor: alpha(S().ui.gold, 0.6) });
}
const lying = (g, GY, M, t, o = {}) => drawFigure(g, { x: BX(), y: GY + 18, s: V(1.2, 1.35), rot: -Math.PI / 2, facing: 1, outfit: NARA,
  pose: breathe(POSES.lie, t, 0.6, 3), expr: o.expr || 'worried', look: [0.2, -1], blink: o.blink ?? ((t % 3.4) > 3.25), rim: { color: M.rim, dir: [0.2, -1] }, shadow: false });

// establishing night frame (s01 starts on it, s18 ends on it -> loop)
function night(g, t, z) {
  const cam = { z, x: 0 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', rain: true });
  layer(g, cam, 1, (g) => lying(g, GY, M, t, { blink: false }));
  FX.dust(g, t, { count: 30, color: M.rim, a: 0.3 });
  return M;
}
registerShot('s01', { draw(g, t, info) {
  night(g, t, 1 + 0.05 * ease.inOut(t / info.dur));
  if (t < 0.3) veil(g, '#cfe0ff', 0.3 * (1 - t / 0.3), 'lighter');
  UI.badge(g, { str: 'JAM 3 PAGI', x: E.W - V(90, 70), y: V(110, 230), a: ease.out(prog(t, 0.2, 0.6)) });
} });

// s02 — big face, eyes open, staring at the ceiling (CLOSE-UP)
registerShot('s02', { draw(g, t, info) {
  const cam = { z: 1.1 };
  blurLayer(g, 12, (g) => kamar(g, t, cam, { mood: 'night', rain: true }), cam, 0.5);
  veil(g, '#000', 0.4);
  const z = 1 + 0.07 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  bigFace(g, E.W / 2, E.H * 0.53, V(270, 300), { outfit: NARA, expr: 'worried', blink: (t % 2.8) > 2.68, look: [0, -0.9], rimColor: '#7dffb0', rimSide: -1, tilt: -0.04 });
  g.restore();
  // ceiling light from the window sliding across
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#7dffb0', 0.05); g.fillRect(lerp(-300, E.W, (t / info.dur)), 0, 220, E.H); g.restore();
  UI.badge(g, { str: 'JAM 3 PAGI', x: E.W - V(90, 70), y: V(110, 230) });
} });

// s03 — Si Ramalan rises from the wall and whispers: "Besok presentasimu bakal kacau."
registerShot('s03', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.04 * ease.inOut(t / info.dur), x: V(-60, -40) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', rain: true, dim: 0.15 });
  const k = ease.out(prog(t, 0.0, 1.0));
  layer(g, cam, 0.95, (g) => ramalan(g, t, BX() + V(170, 120), GY - 40, V(1.7, 1.9) * (0.6 + 0.4 * k), { a: k, pose: POSES.point, facing: -1, look: [1, 0.6] }));
  layer(g, cam, 1, (g) => lying(g, GY, M, t, { expr: 'scared' }));
  const hx = E.W / 2 - V(560, 400), hy = GY - V(120, 110);
  FX.rings(g, hx + V(60, 60), hy - 40, t, { count: 3, r0: 30, r1: 180, color: '#7dffb0', a: 0.35 * k, speed: 0.9 });
  UI.badge(g, { str: 'JAM 3 PAGI', x: E.W - V(90, 70), y: V(110, 230) });
} });

// s04 — "Dan dia percaya." Nara curls up sitting on the bed; score 1 / 0
registerShot('s04', { draw(g, t, info) {
  const cam = { z: 1.22 + 0.06 * ease.inOut(t / info.dur), x: V(-200, -130), y: V(60, 80) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', rain: true });
  layer(g, cam, 0.95, (g) => ramalan(g, t, E.W / 2 - V(40, 10), GY - 20, V(1.9, 2.0), { a: 0.75, pose: POSES.think, facing: -1 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(260, 170), y: GY - 60, s: V(1.25, 1.4), facing: 1, outfit: NARA,
    pose: breathe(POSES.crouch, t, 1.4, 5), expr: 'scared', look: [1, -0.2], blink: (t % 2.4) > 2.3, rim: { color: M.rim, dir: [-0.4, -1] } }));
  score(g, 1, 0, ease.out(prog(t, 0.2, 0.5)));
} });

// s10 — FREEZE. Every night the voice comes back. Giant face + Si Ramalan looming; rain hangs in the air.
registerShot('s10', { draw(g, t, info) {
  const cam = { z: 1.12, r: 0.01 * Math.sin(t * 0.5) };
  blurLayer(g, 10, (g) => kamar(g, t, cam, { mood: 'night', rain: true, frozen: true }), cam, 0.5);
  veil(g, '#000', 0.35);
  FX.drops(g, t * 0.25, { count: 90, rMin: 3, rMax: 15, color: '#7dffb0', drift: 6 });
  const tv = rel('suara', info, 1.7);
  const grow = ease.inOut(prog(t, tv - 0.3, tv + 1.2));
  // the shadow towers behind the face
  ramalan(g, t, E.W / 2 + V(380, 290), E.H * 1.02, V(2.6, 2.9) * (0.85 + 0.3 * grow), { a: 1, pose: POSES.point, facing: -1, look: [-1, 0.5] });
  const [sx, sy] = shake(t, 2, 2, 7) || [0, 0];
  const R = V(220, 240);
  bigFace(g, E.W / 2 - V(170, 150) + (sx || 0), E.H * 0.62 + (sy || 0), R, { outfit: NARA, expr: 'scared', blink: false, look: [0.6, -0.5], rimColor: '#7dffb0', rimSide: 1 });
  FX.rings(g, E.W / 2 + V(60, 60), E.H * 0.45, t, { count: 3, r0: 60, r1: 260, color: '#7dffb0', a: 0.3 * grow, speed: 0.7 });
  veil(g, '#4a90ff', 0.12, 'color');
  const grd = g.createRadialGradient(E.W / 2, E.H / 2, E.H * lerp(0.6, 0.3, grow), E.W / 2, E.H / 2, E.H * lerp(0.9, 0.6, grow));
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.85)'); g.fillStyle = grd; g.fillRect(0, 0, E.W, E.H);
  const n = Math.round(lerp(12, 47, ease.inOut(prog(t, 0.2, info.dur - 0.5)))), m = Math.round(lerp(1, 4, ease.inOut(prog(t, 0.2, info.dur - 0.5))));
  score(g, n, m);
} });

// s11 — the lamp clicks on (first gold light). Nara at the desk; the shadow shrinks.
registerShot('s11', { draw(g, t, info) {
  const tl = rel('lampu', info, 1.9), L = ease.out(prog(t, tl - 0.15, tl + 0.25));
  const cam = { z: 1.2 + 0.06 * ease.inOut(t / info.dur), x: V(220, 170), y: V(40, 80) };
  const { GY, M, desk } = kamar(g, t, cam, { mood: 'night', rain: true, lamp: L, dim: 0.25 * (1 - L) });
  layer(g, cam, 0.95, (g) => ramalan(g, t, desk[0] - V(220, 200), GY - 10, V(1.9, 2.0) * lerp(1, 0.45, L), { a: lerp(0.8, 0.35, L), pose: POSES.stand, facing: 1 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: desk[0] - V(110, 100), y: GY + 10, s: V(1.25, 1.4), facing: 1, outfit: NARA,
    pose: t < tl ? POSES.reach : breathe(POSES.stand, t, 1, 2), expr: t < tl + 0.3 ? 'worried' : 'neutral', look: [1, 0], blink: (t % 3) > 2.85, rim: { color: L > 0.5 ? '#ffd45a' : M.rim, dir: [1, -0.5] } }));
  score(g, 47, 4);
} });

// s13 — "Lalu tidur." lamp off, the note pinned on the wall, Nara asleep
registerShot('s13', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.04 * ease.inOut(t / info.dur), x: V(-40, -20) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', rain: false, notes: [{}], clock: '03:24' });
  layer(g, cam, 1, (g) => lying(g, GY, M, t, { expr: 'sleepy', blink: true }));
  FX.dust(g, t * 0.5, { count: 30, color: '#cfe0ff', a: 0.25 });
  text(g, 'z', E.W / 2 - V(520, 380) + 20 * Math.sin(t * 2), GY - V(260, 260) - t * 40, { size: 56, color: alpha('#cfe0ff', 0.6 * clamp(1 - t / info.dur)), font: FONTS.ui, weight: 900 });
} });

// s14 — DAWN, a week later: he crosses the note out
registerShot('s14', { draw(g, t, info) {
  const tc = rel('mencoretnya', info, 1.4), k = ease.inOut(prog(t, tc - 0.1, tc + 0.6));
  const cam = { z: 1.3 + 0.08 * ease.inOut(t / info.dur), x: V(300, 200), y: V(300, 260) };
  const { GY, M, desk } = kamar(g, t, cam, { mood: 'dusk', notes: [{ crossed: k }], clock: '06:12' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: desk[0] - V(260, 230), y: GY + 10, s: V(1.25, 1.4), facing: 1, outfit: NARA,
    pose: k > 0 && k < 1 ? POSES.point : POSES.relaxed, expr: k >= 1 ? 'smile' : 'neutral', look: [1, -0.5], blink: (t % 3) > 2.85, rim: { color: M.key, dir: [-1, -0.4] } }));
  FX.godRays(g, E.W / 2 - V(260, 160), GY - V(500, 760), { count: 8, angle: 0.9, spread: 0.7, len: 1400, a: 0.05, t });
  FX.dust(g, t, { count: 30, color: '#ffe9c0', a: 0.4 });
  UI.badge(g, { str: '7 HARI', x: E.W - V(90, 70), y: V(110, 230), a: ease.out(prog(t, 0.1, 0.5)) }); UI.badge(g, { str: 'KEMUDIAN', x: E.W - V(90, 70), y: V(160, 286), size: V(30, 34), a: ease.out(prog(t, 0.2, 0.6)) });
  if (k >= 1) FX.sparkle(g, E.W / 2, E.H / 2, 30 * ease.outBack(prog(t, tc + 0.6, tc + 0.9)), '#ffd45a');
} });

// s15 — wide dawn: Nara at the open window; Si Ramalan has shrunk to a small, harmless shadow next to him
registerShot('s15', { draw(g, t, info) {
  const cam = { z: 1.06 - 0.04 * ease.inOut(t / info.dur), x: V(-120, -80) };
  const { GY, M, win } = kamar(g, t, cam, { mood: 'dusk', notes: [{ crossed: 1 }, { crossed: 1 }, { crossed: 1 }, {}], clock: '06:30' });
  const nx = win[0] + win[2] * 0.55;
  layer(g, cam, 1, (g) => {
    ramalan(g, t, nx + V(150, 130), GY + 10, V(0.6, 0.7), { a: 0.7, pose: POSES.relaxed, facing: -1, expr: 'neutral', look: [-1, -0.3] });
    drawFigure(g, { x: nx, y: GY + 10, s: V(1.3, 1.45), facing: -1, outfit: NARA, pose: breathe(POSES.relaxed, t, 1, 1), expr: 'smile', look: [-0.6, -0.6], blink: (t % 3.2) > 3.05, rim: { color: M.key, dir: [-1, -0.5], w: 6 } });
  });
  FX.godRays(g, win[0] + win[2] / 2, win[1] + win[3] / 2, { count: 10, angle: 1.2, spread: 0.8, len: 1700, a: 0.06, t });
  FX.dust(g, t, { count: 40, color: '#ffe9c0', a: 0.45 });
  score(g, 47, 4);
} });

// s16 — big face at dawn, a small warm smile (the brain is just trying to protect you)
registerShot('s16', { draw(g, t, info) {
  const cam = { z: 1.1 };
  blurLayer(g, 12, (g) => kamar(g, t, cam, { mood: 'dusk', clock: '06:30' }), cam, 0.5);
  veil(g, '#000', 0.2);
  const z = 1.05 - 0.05 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  bigFace(g, E.W / 2, E.H * 0.53, V(260, 290), { outfit: NARA, expr: t < 0.6 ? 'neutral' : 'smile', blink: (t % 2.9) > 2.78, look: [0, 0], rimColor: '#ffd45a', rimSide: -1 });
  g.restore();
  glow(g, E.W / 2, E.H * 0.53, V(600, 700), '#ffd45a', 0.1 + 0.05 * Math.sin(t * 2));
  FX.dust(g, t, { count: 40, color: '#ffe9c0', a: 0.4 });
} });

// s18 — back to 3 AM (loop): ends exactly on s01's first frame
registerShot('s18', { draw(g, t, info) {
  const z = 1 + 0.08 * (1 - ease.inOut(t / info.dur));
  night(g, t, z);
  const tj = rel('jam', info, 2.7);
  UI.badge(g, { str: 'JAM 3 PAGI', x: E.W - V(90, 70), y: V(110, 230), a: ease.out(prog(t, tj - 0.1, tj + 0.3)) * (1 - prog(t, info.dur - 0.25, info.dur)) });
} });
