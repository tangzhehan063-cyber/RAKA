// 01_room.js — the bedroom shots: night/rain (day 9), the freeze, the inner voice, and dawn (day 10).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, shoes, calendar } from '../sets/bedroom.js';
import { RAKA } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const sitOnBed = (g, GY, M, t, o = {}) => drawFigure(g, { x: E.W / 2 - V(190, 120), y: GY, s: V(1.25, 1.45), facing: 1, outfit: RAKA,
  pose: breathe(o.pose || POSES.sit, t, 1, 2), expr: o.expr || 'sad', look: [1, 0.4], blink: (t % 3.3) > 3.15, rim: { color: M.rim, dir: [-0.4, -1] } });

// s01 — establishing: night, rain, Raka on the bed edge staring at his shoes. (s19 ends on this exact frame -> loop)
function establishing(g, t, z) {
  const cam = { z, x: 0 };
  const { GY, M } = bedroom(g, t, cam, { mood: 'night', rain: true, day: 9, calGlow: 0.6 });
  layer(g, cam, 1, (g) => sitOnBed(g, GY, M, t, { expr: 'worried' }));
  FX.dust(g, t, { count: 30, color: M.rim, a: 0.3 });
  return M;
}
registerShot('s01', { draw(g, t, info) {
  establishing(g, t, 1 + 0.05 * ease.inOut(t / info.dur));
  if (t < 0.35) veil(g, '#cfe0ff', 0.35 * (1 - t / 0.35), 'lighter');        // lightning flicker on the thunder
  UI.badge(g, { str: 'HARI 9', x: E.W - V(90, 110), y: V(110, 250), a: ease.out(prog(t, 0.3, 0.7)) });
} });

// s02 — insert: rain on the glass, shoes waiting on the floor
registerShot('s02', { draw(g, t, info) {
  const cam = { z: 1.55 + 0.08 * ease.inOut(t / info.dur), x: V(-120, 40), y: V(120, 260) };
  const { M } = bedroom(g, t, cam, { mood: 'night', rain: true, day: 9 });
  FX.rain(g, t, { count: 80, a: 0.25, color: M.rim, len: 70 });
  FX.drops(g, t, { count: 26, rMin: 4, rMax: 12, color: M.rim, area: [0, 0, E.W, E.H * 0.55] });
} });

// s03 — big face, eyes close, the blanket rises over him
registerShot('s03', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0 };
  blurLayer(g, 12, (g) => bedroom(g, t, cam, { mood: 'night', rain: true, day: 9 }), cam, 0.5);
  veil(g, '#000', 0.35);
  const M = { rim: S().ui.blueprint };
  const k = ease.inOut(prog(t, 0.7, info.dur));
  const cy = E.H * V(0.56, 0.5) + k * V(60, 120);
  bigFace(g, E.W / 2, cy, V(260, 300), { outfit: RAKA, expr: t < 0.8 ? 'worried' : 'sleepy', blink: t > 1.0, look: [0.3, 0.6], rimColor: '#7dffb0', rimSide: -1, tilt: -0.05 });
  // blanket
  const by = lerp(E.H * 1.05, cy + V(20, 40), k);
  g.fillStyle = '#16281f'; g.beginPath(); g.moveTo(-50, E.H + 50); g.lineTo(-50, by + 40); g.quadraticCurveTo(E.W / 2, by - 70, E.W + 50, by + 30); g.lineTo(E.W + 50, E.H + 50); g.fill();
  g.strokeStyle = alpha('#7dffb0', 0.35); g.lineWidth = 4; g.beginPath(); g.moveTo(-50, by + 40); g.quadraticCurveTo(E.W / 2, by - 70, E.W + 50, by + 30); g.stroke();
} });

// s04 — FREEZE. Rain hangs in the air. Day 9 is where habits are actually decided.
registerShot('s04', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.05 * ease.inOut(t / info.dur), r: 0.012 * Math.sin(t * 0.5) };
  const { GY, M } = bedroom(g, t, cam, { mood: 'night', rain: true, frozen: true, day: 9, blanket: true, calGlow: 0.9 + 0.3 * Math.sin(t * 3) });
  FX.drops(g, t * 0.3, { count: 80, rMin: 3, rMax: 16, color: M.rim, drift: 6 });
  veil(g, '#4a90ff', 0.12, 'color');
  const tk = rel('kebiasaan', info, 1.9);
  FX.rings(g, E.W / 2 + V(380, 330), GY - V(480, 775), t, { color: '#ffd45a', a: 0.5 * ease.out(prog(t, tk - 0.2, tk + 0.3)), r0: 80, r1: 220 });
  UI.badge(g, { str: 'HARI 9', x: E.W - V(90, 110), y: V(110, 250) });
} });

// s09 — big face, thinking: "and this is the most important part"
registerShot('s09', { draw(g, t, info) {
  const cam = { z: 1.15, x: 40 * Math.sin(t * 0.4) };
  blurLayer(g, 12, (g) => bedroom(g, t, cam, { mood: 'night', rain: true, day: 9 }), cam, 0.5);
  veil(g, '#000', 0.3);
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  bigFace(g, E.W / 2 + V(60, 20), E.H * V(0.55, 0.52), V(250, 290), { outfit: RAKA, expr: t < 0.5 ? 'worried' : 'thinking', blink: (t % 2.6) > 2.45, look: [-0.5, -0.4], rimColor: '#7dffb0', rimSide: -1 });
  g.restore();
  FX.sparkle(g, E.W / 2 + V(-180, -200), E.H * V(0.33, 0.33), 26 * ease.outBack(prog(t, 0.2, 0.6)), '#ffd45a');
} });

// s11 — medium: slumped on the bed in the rain-light
registerShot('s11', { draw(g, t, info) {
  const cam = { z: 1.22 + 0.07 * ease.inOut(t / info.dur), x: V(-160, -110), y: V(60, 60) };
  const { GY, M } = bedroom(g, t, cam, { mood: 'night', rain: true, day: 9 });
  layer(g, cam, 1, (g) => sitOnBed(g, GY, M, t, { pose: { ...POSES.sit, head: [16, -168], sh: [6, -140], hF: [40, -96], hB: [32, -94] }, expr: 'worried' }));
  FX.dust(g, t, { count: 25, color: M.rim, a: 0.25 });
} });

// s12 — the inner voice (whispered): big face, darkness closing in
registerShot('s12', { draw(g, t, info) {
  const cam = { z: 1.15, x: 0 };
  blurLayer(g, 14, (g) => bedroom(g, t, cam, { mood: 'night', rain: true, day: 9 }), cam, 0.5);
  veil(g, '#000', 0.45);
  const [sx, sy] = shake(t, 3, 2, 7) || [0, 0];
  const cx = E.W / 2 + (sx || 0), cy = E.H * V(0.54, 0.5) + (sy || 0);
  const R = V(250, 290) * (1 + 0.05 * ease.inOut(t / info.dur));
  FX.rings(g, cx, cy, t, { count: 3, r0: R * 1.05, r1: R * 1.6, color: '#7dffb0', a: 0.25, speed: 0.6 });
  bigFace(g, cx, cy, R, { outfit: RAKA, expr: 'worried', blink: (t % 2.2) > 2.05, look: [0, 0.7], rimColor: '#7dffb0', rimSide: 1 });
  const k = ease.inOut(prog(t, 0.6, info.dur));                                   // darkness closing (radial)
  const grd = g.createRadialGradient(cx, cy, R * lerp(2.4, 1.1, k), cx, cy, R * lerp(3.6, 1.9, k));
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.92)'); g.fillStyle = grd; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
} });

// s13 — insert: the shoes in the corner, light dying, dust settling
registerShot('s13', { draw(g, t, info) {
  const cam = { z: 1.9 + 0.05 * ease.inOut(t / info.dur), x: V(300, 330), y: V(330, 360) };
  const { M } = bedroom(g, t, cam, { mood: 'night', rain: true, day: 9, dim: 0.15 + 0.5 * ease.in(prog(t, 0.3, info.dur)) });
  FX.dust(g, t * 0.4, { count: 60, color: '#cfe0ff', a: 0.35, speed: 6 });
} });

// s14 — DAWN. Day 10. Tying the shoes. No motivation, just doing it.
registerShot('s14', { draw(g, t, info) {
  const cam = { z: 1.12 + 0.05 * ease.inOut(t / info.dur), x: V(120, 90), y: V(40, 60) };
  const { GY, M } = bedroom(g, t, cam, { mood: 'dusk', rain: false, day: 10, calGlow: 0.8 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 + V(210, 190), y: GY + 30, s: V(1.3, 1.5), facing: 1, outfit: RAKA,
    pose: breathe(POSES.crouch, t, 1, 4), expr: 'neutral', blink: (t % 2.9) > 2.75, rim: { color: M.rim, dir: [-1, -0.4] } }));
  FX.godRays(g, E.W / 2 - V(100, 20), GY - V(500, 750), { count: 8, angle: 1.0, spread: 0.7, len: 1400, a: 0.05, t });
  FX.dust(g, t, { count: 35, color: '#ffe9c0', a: 0.4 });
  UI.badge(g, { str: 'HARI 10', x: E.W - V(90, 110), y: V(110, 250), a: ease.out(prog(t, 0.6, 1.0)) });
} });

// s19 — back to day 9 (loop): same composition as s01, ending exactly on s01's first frame.
registerShot('s19', { draw(g, t, info) {
  const z = 1 + 0.08 * (1 - ease.inOut(t / info.dur));
  establishing(g, t, z);
  if (t > 1.4 && t < 1.7) veil(g, '#cfe0ff', 0.3 * (1 - (t - 1.4) / 0.3), 'lighter');
} });
