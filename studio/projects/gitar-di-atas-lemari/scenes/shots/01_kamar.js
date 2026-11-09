// 01_kamar.js — the bedroom: guitar on the wardrobe (night), 1 a.m., the freeze, the whisper, taking it down, first strum at dawn, loop.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, text, FONTS, shake, circle, seg } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, guitar, WARD } from '../sets/kamar.js';
import { DIMAS } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const BX = () => E.W - V(90, 150), BY = () => V(110, 280);               // badge inside the 9:16 safe zone
const B = (g, str, a = 1) => UI.badge(g, { str, x: BX(), y: BY(), a });
const SIT_X = () => E.W / 2 - V(200, 300);
const sitPose = (o = {}) => ({ ...POSES.sit, ...o });
const LOOK_UP = sitPose({ head: [10, -184] });
const GUITAR_SIT = sitPose({ eF: [34, -112], hF: [52, -92], eB: [-6, -128], hB: [-30, -150] });

// camera that frames a point P living on layer `depth` at zoom z
const camOn = (px, py, z, depth = 0.85) => ({ z, x: (px - E.W / 2) / depth, y: (py - E.H / 2) / depth });

// --- INSERT on the guitar atop the wardrobe (s01 starts here; s17 ends exactly on this frame -> loop)
function insertGuitar(g, t, z, o = {}) {
  const W = WARD();
  const cam = camOn(W.cx - V(40, 40), W.top - V(40, 40), z);
  const r = kamar(g, t, cam, { mood: 'night', rain: true, dust: 1, gGlow: o.gGlow || 0, dim: o.dim || 0 });
  FX.dust(g, t, { count: 40, color: '#cfe0ff', a: 0.35, speed: 8 });
  return r;
}
registerShot('s01', { draw(g, t, info) {
  insertGuitar(g, t, 2.2 + 0.08 * ease.inOut(t / info.dur));
} });

// s02 — WIDE: the room, Dimas small on the bed edge, the guitar high on the wardrobe. "12 tahun di atas lemari."
registerShot('s02', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur), x: V(0, 60), y: V(0, -40) };
  const { GY, M, W } = kamar(g, t, cam, { mood: 'night', rain: true, dust: 1 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: SIT_X(), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS,
    pose: breathe(LOOK_UP, t, 1, 2), expr: 'sad', look: [1, -0.6], blink: (t % 3.1) > 2.95, rim: { color: M.rim, dir: [-0.6, -1] } }));
  FX.dust(g, t, { count: 30, color: M.rim, a: 0.3 });
  const t12 = rel('12', info, 0.05);
  B(g, '12 TAHUN', ease.out(prog(t, t12, t12 + 0.4)));
} });

// s03 — INSERT: the phone lights up on the bed: 01:00
registerShot('s03', { draw(g, t, info) {
  const { GY } = { GY: E.H * 0.68 };
  const cam = camOn(E.W / 2 - V(260, 260), GY - 40, 2.4 + 0.1 * ease.inOut(t / info.dur), 0.85);
  const { M } = kamar(g, t, cam, { mood: 'night', rain: true, dust: 1, phone: 1 });
  veil(g, '#000', 0.25);
  // the phone screen, big and readable (lives in the screen plane)
  const cx = E.W / 2 - V(0, 30), cy = E.H * 0.52, k = ease.outBack(prog(t, 0.1, 0.45));
  g.save(); g.translate(cx, cy); g.rotate(-0.08); g.scale(k, k);
  glow(g, 0, 0, 420, '#bcd6ff', 0.35);
  rr(g, -190, -330, 380, 660, 44); g.fillStyle = '#0b0e14'; g.fill();
  rr(g, -172, -312, 344, 624, 34); g.fillStyle = '#16213a'; g.fill();
  text(g, '01:00', 0, -120, { size: 130, color: '#eaf2ff', font: FONTS.ui, weight: 900 });
  text(g, 'SENIN', 0, -20, { size: 34, color: alpha('#eaf2ff', 0.7), font: FONTS.ui, weight: 800, spacing: 6 });
  g.restore();
  B(g, 'JAM 1 PAGI', ease.out(prog(t, 0.2, 0.6)));
} });

// s04 — MEDIUM: Dimas, 31, looking up at the guitar again
registerShot('s04', { draw(g, t, info) {
  const W = WARD(), GY = E.H * 0.68;
  const cam = { z: 1.35 + 0.08 * ease.inOut(t / info.dur), x: V(-200, -150), y: V(40, -60) };
  const { M } = kamar(g, t, cam, { mood: 'night', rain: true, dust: 1, phone: 0.6, gGlow: 0.3 * ease.inOut(prog(t, 1.5, info.dur)) });
  layer(g, cam, 1, (g) => drawFigure(g, { x: SIT_X(), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS,
    pose: breathe(posesAt(t, [[0, sitPose()], [1.6, LOOK_UP]]), t, 1, 3), expr: t < 1.6 ? 'neutral' : 'sad', look: t < 1.6 ? [1, 0.2] : [1, -0.8], blink: (t % 2.7) > 2.55, rim: { color: M.rim, dir: [-0.6, -1] } }));
  FX.dust(g, t, { count: 25, color: M.rim, a: 0.25 });
  B(g, '31 TAHUN', ease.out(prog(t, 0.4, 0.8)));
} });

// s10 — FREEZE: "Mimpi... kita tunda." Dust hangs in the air, cold tint, the guitar barely glows.
registerShot('s10', { draw(g, t, info) {
  const W = WARD(), GY = E.H * 0.68;
  const cam = { z: 1.12 + 0.04 * ease.inOut(t / info.dur), x: V(60, 80), y: V(0, -60), r: 0.01 * Math.sin(t * 0.6) };
  const { M } = kamar(g, t, cam, { mood: 'night', rain: true, frozen: true, dust: 1, gGlow: 0.5 + 0.2 * Math.sin(t * 3) });
  layer(g, cam, 1, (g) => drawFigure(g, { x: SIT_X(), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS, pose: LOOK_UP, expr: 'sad', look: [1, -0.8], rim: { color: M.rim, dir: [-0.6, -1] } }));
  FX.drops(g, 0.37 + t * 0.15, { count: 90, rMin: 2, rMax: 9, color: '#cfe0ff', drift: 4 });
  veil(g, '#4a90ff', 0.14, 'color');
  const tT = rel('tunda', info, 1.2);
  // a pause bar over the guitar: the dream "on hold"
  const a = ease.out(prog(t, tT - 0.2, tT + 0.3));
  if (a > 0) { const x = E.W / 2 + V(240, 200), y = E.H * V(0.3, 0.33); g.save(); g.globalAlpha *= a;
    rr(g, x - 46, y - 60, 32, 120, 8); g.fillStyle = S().ui.accent; g.fill(); rr(g, x + 14, y - 60, 32, 120, 8); g.fill(); g.restore(); }
} });

// s11 — the whisper: giant face, "Udah telat. Udah tua. Malu." darkness closing in
registerShot('s11', { draw(g, t, info) {
  const cam = { z: 1.15, x: 0 };
  blurLayer(g, 14, (g) => kamar(g, t, cam, { mood: 'night', rain: true, dust: 1 }), cam, 0.5);
  veil(g, '#000', 0.45);
  const [sx, sy] = shake(t, 3, 2, 7);
  const cx = E.W / 2 + sx, cy = E.H * V(0.54, 0.5) + sy, R = V(250, 280) * (1 + 0.05 * ease.inOut(t / info.dur));
  FX.rings(g, cx, cy, t, { count: 3, r0: R * 1.05, r1: R * 1.6, color: '#7dffb0', a: 0.22, speed: 0.6 });
  bigFace(g, cx, cy, R, { outfit: DIMAS, expr: 'worried', blink: (t % 2.2) > 2.05, look: [0.2, 0.7], rimColor: '#7dffb0', rimSide: 1 });
  const k = ease.inOut(prog(t, 0.6, info.dur));
  const grd = g.createRadialGradient(cx, cy, R * lerp(2.4, 1.1, k), cx, cy, R * lerp(3.6, 1.9, k));
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.92)'); g.fillStyle = grd; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  // the whispered words float around the head (serif italic, coral), inside the safe zone
  const W3 = [['telat', 'UDAH TELAT.', -0.55, 0.15], ['tua', 'UDAH TUA.', 0.5, 0.205], ['Malu', 'MALU.', 0, 0.26]];
  W3.forEach(([w, s, side, yk], i) => { const tw = rel(w, info, 0.4 + i * 0.9) - 0.15, a = ease.out(prog(t, tw, tw + 0.3));
    if (a <= 0) return; const x = E.W / 2 + side * V(420, 230), y = E.H * yk + (1 - a) * 20;
    text(g, s, x, y, { size: V(64, 60), color: S().ui.accent, font: FONTS.serif, weight: 900, italic: true, alpha: a * (0.85 + 0.15 * Math.sin(t * 9 + i)), glow: 18, glowColor: alpha(S().ui.accent, 0.5) }); });
} });

// s12 — INSERT: the guitar in the dark, light dying. "...tidak pernah selesai."
registerShot('s12', { draw(g, t, info) {
  insertGuitar(g, t, 2.0 + 0.1 * ease.inOut(t / info.dur), { dim: 0.1 + 0.45 * ease.in(prog(t, 0.4, info.dur)) });
  B(g, '12 TAHUN', 1 - ease.in(prog(t, info.dur - 0.6, info.dur)));
} });

// s13 — "Malam itu, Dimas menurunkan gitarnya." pale blue pre-dawn, standing on tiptoe, the guitar comes down, dust bursts
registerShot('s13', { draw(g, t, info) {
  const W = WARD(), GY = E.H * 0.68;
  const cam = { z: 1.25 + 0.05 * ease.inOut(t / info.dur), x: V(160, 140), y: V(-60, -120) };
  const tDown = rel('menurunkan', info, 1.3), kd = ease.inOut(prog(t, tDown, tDown + 1.0));
  const { M } = kamar(g, t, cam, { mood: 'dusk', rain: false, guitar: 'none', outline: 0.0 });
  const fx = W.x - V(10, 30);
  const pose = posesAt(t, [[0, POSES.stand], [tDown - 0.5, POSES.cheer], [tDown + 1.0, POSES.holdFront]]);
  // guitar path: wardrobe top -> into his hands
  const gx0 = W.cx, gy0 = W.top - 66, gx1 = fx + V(60, 70), gy1 = GY - V(260, 300);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: fx, y: GY, s: V(1.5, 1.75), facing: 1, outfit: DIMAS, pose, expr: kd > 0.5 ? 'neutral' : 'worried', look: [0.6, -1 + kd], rim: { color: M.rim, dir: [-0.8, -0.6] } });
  });
  layer(g, cam, 0.85, (g) => guitar(g, lerp(gx0, gx1 / 1, kd), lerp(gy0, gy1, kd), V(0.6, 0.62), lerp(-Math.PI / 2, -0.25, kd), { dust: 1 - 0.4 * kd, dark: -0.15 }));
  if (t > tDown) FX.dust(g, (t - tDown) * 2.5, { count: 70, area: [W.x - 120, W.top - 160, W.w + 240, 260], color: '#d9e6ff', a: 0.55 * clamp(1.6 - (t - tDown)), size: 3 });
} });

// s15 — DAWN, golden: sitting on the bed, guitar on the lap, first real strum. "penyesalan itu bergerak."
registerShot('s15', { draw(g, t, info) {
  const GY = E.H * 0.68;
  const cam = { z: 1.2 - 0.08 * ease.inOut(t / info.dur), x: V(-120, -120), y: V(0, -40) };
  const { M } = kamar(g, t, cam, { mood: 'golden', guitar: 'none', outline: 0.4 });
  const strum = Math.max(0, Math.sin(t * 7)) * (t > 1.0 ? 1 : 0);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: SIT_X(), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS,
      pose: { ...GUITAR_SIT, hF: [52, -92 + 10 * strum] }, expr: t > 2.2 ? 'smile' : 'neutral', look: [0.6, 0.6], blink: (t % 3) > 2.85, rim: { color: M.rim, dir: [-1, -0.4], w: 6 } });
    guitar(g, SIT_X() + V(50, 58), GY - V(110, 128), V(0.55, 0.6), -1.2, { dust: 0.15, lit: 1, dark: 0 });
  });
  FX.godRays(g, E.W / 2 - V(300, 330), GY - V(500, 760), { count: 8, angle: 0.9, spread: 0.7, len: 1500, a: 0.06, t });
  FX.dust(g, t, { count: 45, color: '#ffe9c0', a: 0.45 });
  const tg = rel('bergerak', info, 2.9);
  if (t > tg) FX.rings(g, SIT_X() + 60, GY - 200, t - tg, { count: 2, r0: 60, r1: 300, color: S().ui.gold, a: 0.4, speed: 1.2 });
} });

// s16 — signature line: golden room, empty wardrobe top with a glowing clean outline. Kinetic words.
registerShot('s16', { draw(g, t, info) {
  const W = WARD(), GY = E.H * 0.68, ui = S().ui;
  const cam = { z: 1.05 + 0.06 * ease.inOut(t / info.dur), x: V(0, 40), y: V(0, -40) };
  const { M } = kamar(g, t, cam, { mood: 'golden', guitar: 'none', outline: 1 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: SIT_X(), y: GY, s: V(1.3, 1.5), facing: 1, outfit: DIMAS, pose: { ...GUITAR_SIT, hF: [52, -92 + 10 * Math.max(0, Math.sin(t * 6))] }, expr: 'smile', look: [0.6, 0.6], rim: { color: M.rim, dir: [-1, -0.4], w: 6 } });
    guitar(g, SIT_X() + V(50, 58), GY - V(110, 128), V(0.55, 0.6), -1.2, { dust: 0.1, lit: 1, dark: 0 });
  });
  FX.dust(g, t, { count: 40, color: '#ffe9c0', a: 0.4 });
  veil(g, '#000', 0.25);
  const tA = rel('arah', info, 2.3);
  const a1 = ease.out(prog(t, 0.1, 0.5)) * (1 - 0.6 * ease.out(prog(t, tA - 0.3, tA)));
  text(g, 'BUKAN MASA LALU', E.W / 2, E.H * V(0.25, 0.27), { size: V(64, 62), color: alpha(ui.cream, 0.9), font: FONTS.ui, weight: 900, spacing: 4, alpha: a1 });
  const a2 = ease.outBack(prog(t, tA - 0.1, tA + 0.35));
  if (a2 > 0) { g.save(); g.translate(E.W / 2, E.H * V(0.36, 0.36)); g.scale(a2, a2);
    glow(g, 0, 0, 380, ui.gold, 0.3);
    text(g, 'ARAH', 0, 0, { size: V(200, 210), color: ui.gold, font: FONTS.ui, weight: 900, glow: 34, glowColor: alpha(ui.gold, 0.8) });
    text(g, 'YANG BELUM KAMU AMBIL', 0, V(130, 140), { size: V(44, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
} });

// s17 — back to the night (loop): dip, then push in until it matches s01's first frame exactly
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0, info.dur));
  insertGuitar(g, t - info.dur, lerp(1.25, 2.2, k), { dim: 0.2 * (1 - k) });   // same clock as s01 at its last frame
} });
