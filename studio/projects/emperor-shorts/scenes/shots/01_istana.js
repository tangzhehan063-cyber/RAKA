// 01_istana.js — Stick.Tales: The Curse of Being the Emperor's Firstborn
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, text, FONTS, shake, rr, circle, seg, linGrad } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, headPos, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hall, classroom, garden, bedroom, scroll, crown, mask, eyes, bowl, dagger, chains, ageTag, brand, lantern, throne,
  PRINCE, PRINCE_KID, EMPEROR, NOBLE, KID, GOLD, RED, PAPER, JADE, INK } from '../sets/istana.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const RIM = '#d9b25a';
function hero(g, o) { // prince + crown
  const f = { outfit: o.kid ? PRINCE_KID : PRINCE, rim: { color: o.rim || RIM, dir: [-0.6, -0.8] }, ...o };
  drawFigure(g, f); const [hx, hy, r] = headPos(f); crown(g, hx, hy, r, { heavy: o.heavy || 0, tilt: o.tilt || 0 });
}
const push = (t, info, a = 1, b = 0.08) => ({ z: a + b * ease.inOut(clamp(t / info.dur)) });
const title = (g, str, y, a, size = 78, color = PAPER) => text(g, str, E.W / 2, y, { size, color, font: FONTS.imperial, weight: 900, alpha: a, glow: 24, glowColor: alpha(GOLD, 0.5), spacing: 2 });

// s01 — title on an unrolling scroll; giant crown hangs above
registerShot('s01', { draw(g, t, info) {
  g.fillStyle = INK; g.fillRect(0, 0, E.W, E.H); FX.dust(g, t, { count: 50, color: GOLD, a: 0.4 });
  crown(g, E.W / 2, E.H * 0.3 + Math.sin(t) * 8, 150, { a: ease.out(prog(t, 0, 0.8)) });
  scroll(g, E.W / 2, E.H * 0.53, 860, 380, prog(t, 0.1, 1.0), (g, w, h) => {
    text(g, 'THE CURSE OF', w / 2, h * 0.3, { size: 56, color: INK, font: FONTS.imperial, weight: 900, spacing: 4 });
    text(g, "THE EMPEROR'S", w / 2, h * 0.52, { size: 70, color: RED, font: FONTS.imperial, weight: 900 });
    text(g, 'FIRSTBORN', w / 2, h * 0.74, { size: 84, color: INK, font: FONTS.imperial, weight: 900 }); });
  brand(g);
} });
// s02 — imagine: a baby in a cradle under a giant crown, throne hall
registerShot('s02', { draw(g, t, info) {
  const cam = push(t, info, 1.05, 0.1); const { GY } = hall(g, t, cam, { dim: 0.2 });
  layer(g, cam, 1, (g) => { rr(g, E.W / 2 - 110, GY - 90, 220, 90, 40); g.fillStyle = '#8a6420'; g.fill();
    circle(g, E.W / 2, GY - 100, 34, S().ink); glow(g, E.W / 2, GY - 100, 160, GOLD, 0.3);
    crown(g, E.W / 2, GY - 420 + Math.sin(t * 0.8) * 10, 120, { a: 0.95 }); seg(g, [[E.W / 2, -50], [E.W / 2, GY - 560]], 3, alpha(GOLD, 0.5)); });
  brand(g);
} });
// s03 — "people would say you were blessed": nobles bowing
registerShot('s03', { draw(g, t, info) {
  const cam = push(t, info, 1.0, 0.05); const { GY } = hall(g, t, cam);
  layer(g, cam, 1, (g) => { for (let i = 0; i < 6; i++) { const x = 120 + i * 170, y = GY + 40 + (i % 2) * 70;
    drawFigure(g, { x, y, s: 0.9, facing: x < E.W / 2 ? 1 : -1, pose: breathe(POSES.sad, t, 1, i), outfit: NOBLE, expr: 'happy', rim: { color: RIM } }); } });
  brand(g);
} });
// s04 — endless wealth: gold rain, prince grows into the throne
registerShot('s04', { draw(g, t, info) {
  const cam = push(t, info, 1.0, 0.12); const { GY } = hall(g, t, cam);
  layer(g, cam, 1, (g) => { const k = ease.inOut(prog(t, rel('One', info, 5), rel('One', info, 5) + 2));
    hero(g, { x: E.W / 2, y: GY - 60, s: lerp(0.9, 1.5, k), kid: k < 0.5, pose: k > 0.5 ? breathe(POSES.stand, t) : POSES.relaxed, expr: 'neutral', facing: 1 }); });
  FX.drops(g, t, { count: 60, rMin: 4, rMax: 10, color: GOLD, drift: 30 });
  for (let i = 0; i < 25; i++) { const x = (i * 211) % E.W, y = ((t * 380 + i * 160) % (E.H + 200)) - 100; circle(g, x, y, 10, GOLD); circle(g, x - 3, y - 3, 4, '#fff1b0'); }
  brand(g);
} });
// s05 — "but what they don't know": hall drains of colour, emperor's shadow looms
registerShot('s05', { draw(g, t, info) {
  const cam = push(t, info, 1.1, 0.06); const { GY } = hall(g, t, cam, { dim: 0.25 + 0.45 * prog(t, 0, info.dur) });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 + 260, y: GY + 140, s: 3.2, facing: -1, pose: POSES.crossArms, outfit: EMPEROR, ink: '#020203', expr: 'neutral', rim: { color: RED, w: 6 }, alpha: 0.95 });
    hero(g, { x: E.W / 2 - 200, y: GY + 20, s: 1.1, kid: true, pose: breathe(POSES.stand, t), expr: 'worried', look: [1, -1] }); });
  brand(g);
} });
// s06 — "Sometimes, it's a curse." red flash, crown cracks
registerShot('s06', { draw(g, t, info) {
  g.fillStyle = '#050405'; g.fillRect(0, 0, E.W, E.H); const [sx, sy] = shake(t, 0, 0.5, 14) || [0, 0];
  g.save(); g.translate(sx, sy); crown(g, E.W / 2, E.H * 0.45, 190, { color: lerp(0, 1, 1) ? '#b08a3a' : GOLD });
  seg(g, [[E.W / 2 + 10, E.H * 0.24], [E.W / 2 - 30, E.H * 0.3], [E.W / 2 + 25, E.H * 0.36], [E.W / 2 - 10, E.H * 0.42]], 7, RED); g.restore();
  veil(g, RED, 0.35 * (1 - prog(t, 0, 0.6)), 'lighter'); title(g, 'A CURSE', E.H * 0.62, ease.out(prog(t, 0.6, 1.0)), 110, RED);
  brand(g);
} });
// s07 — fate already written: a scroll writes his life while he stands tiny before it
registerShot('s07', { draw(g, t, info) {
  g.fillStyle = INK; g.fillRect(0, 0, E.W, E.H); FX.dust(g, t, { count: 30, color: GOLD, a: 0.3 });
  const lines = Math.floor(t * 3.2);
  scroll(g, E.W / 2, E.H * 0.38, 820, 760, prog(t, 0, 0.8), (g, w, h) => { for (let i = 0; i < Math.min(lines, 26); i++) { const col = i % 13, row = Math.floor(i / 13);
    for (let k = 0; k < 10; k++) rr(g, w - 70 - col * 58, 60 + k * 64 + row * 0, 30, 34, 4), g.fillStyle = alpha(INK, 0.75), g.fill(); } });
  hero(g, { x: E.W / 2, y: E.H * 0.9, s: 0.9, kid: true, pose: breathe(POSES.stand, t), expr: 'sad', look: [0, -1] });
  brand(g);
} });
// s08 — every word watched: eyes open in the dark walls
registerShot('s08', { draw(g, t, info) {
  const cam = push(t, info, 1.15, 0.1); const { GY } = hall(g, t, cam, { dim: 0.75, throne: false });
  eyes(g, t, 9 + Math.floor(t), { seed: 7 });
  layer(g, cam, 1, (g) => hero(g, { x: E.W / 2, y: GY + 60, s: 1.0, kid: true, pose: breathe(POSES.stand, t), expr: 'nervous', look: [Math.sin(t * 0.7), -0.4] }));
  brand(g);
} });
// s09 — father never saw a child: emperor's back, boy kneeling
registerShot('s09', { draw(g, t, info) {
  const cam = push(t, info, 1.05, 0.06); const { GY } = hall(g, t, cam, { dim: 0.35 });
  layer(g, cam, 1, (g) => { const ep = { x: E.W / 2 + 120, y: GY - 40, s: 2.2, facing: 1, pose: breathe(POSES.crossArms, t, 0.5), outfit: EMPEROR, expr: 'neutral', look: [1, 0], rim: { color: RED } };
    drawFigure(g, ep); const [hx, hy, r] = headPos(ep); crown(g, hx, hy, r, { heavy: 0.4 });
    hero(g, { x: E.W / 2 - 250, y: GY + 80, s: 1.0, kid: true, facing: 1, pose: POSES.kneel, expr: 'sad', look: [1, -1] });
    if (t > rel('successor', info, 3)) text(g, 'SUCCESSOR', E.W / 2 - 250, GY - 140, { size: 52, color: GOLD, font: FONTS.imperial, weight: 900, alpha: ease.out(prog(t, rel('successor', info, 3), rel('successor', info, 3) + 0.5)) }); });
  brand(g);
} });
// s10 — age 5: split — cold classroom (top) vs children playing in the garden (bottom)
registerShot('s10', { draw(g, t, info) {
  const tw = rel('While', info, 5.2), sp = ease.inOut(prog(t, tw - 0.3, tw + 0.5));
  g.save(); g.beginPath(); g.rect(0, 0, E.W, lerp(E.H, E.H * 0.5, sp)); g.clip();
  const { GY } = classroom(g, t, { z: 1.05 });
  rr(g, E.W / 2 - 220, GY - 80, 440, 30, 6); g.fillStyle = '#3a2a1a'; g.fill();
  hero(g, { x: E.W / 2, y: GY, s: 1.1, kid: true, pose: breathe(POSES.sit, t), expr: 'sad', look: [0, 0.6] });
  for (let i = 0; i < 3; i++) rr(g, E.W / 2 - 160 + i * 110, GY - 100, 80, 22, 4), g.fillStyle = PAPER, g.fill();
  g.restore();
  if (sp > 0) { g.save(); g.beginPath(); g.rect(0, lerp(E.H, E.H * 0.5, sp), E.W, E.H); g.clip(); g.translate(0, E.H * 0.25);
    const { GY: G2 } = garden(g, t, { z: 1 }); for (let i = 0; i < 3; i++) { const ph = t * 6 + i * 2; drawFigure(g, { x: 200 + ((t * 140 + i * 300) % 900), y: G2 - 300, s: 0.95, outfit: KID, pose: walkPose(ph, { run: true }), expr: 'joy', rim: { color: '#ffe0a0' } }); }
    g.restore(); seg(g, [[0, lerp(E.H, E.H * 0.5, sp)], [E.W, lerp(E.H, E.H * 0.5, sp)]], 6, GOLD); }
  ageTag(g, 5, ease.out(prog(t, 0, 0.5))); brand(g);
} });
// s11 — age 7: sword training
registerShot('s11', { draw(g, t, info) {
  const { GY } = classroom(g, t, { z: 1.1 }); veil(g, '#3a1a0a', 0.3);
  const p = Math.sin(t * 7) > 0 ? POSES.ready : POSES.point;
  hero(g, { x: E.W / 2, y: GY + 60, s: 1.4, kid: true, pose: p, expr: 'determined', facing: 1 });
  const hp = headPos({ x: E.W / 2, y: GY + 60, s: 1.4 * 0.72, pose: p }); dagger(g, hp[0] + 60, hp[1] + 80, 1.3, Math.sin(t * 7) > 0 ? -0.6 : 0);
  FX.speedLines(g, t, { a: 0.08, color: PAPER });
  ageTag(g, 7, ease.out(prog(t, 0, 0.4))); brand(g);
} });
// s12 — age 10: commanding soldiers
registerShot('s12', { draw(g, t, info) {
  const cam = push(t, info, 1.0, 0.06); const { GY } = garden(g, t, cam, 0); veil(g, '#1a0e08', 0.45);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) drawFigure(g, { x: 110 + i * 170 + r * 40, y: GY + 120 + r * 110, s: 0.8, facing: 1, pose: POSES.stand, outfit: { top: 'suit', color: '#3a2a20', head: 'none' }, expr: 'neutral', rim: { color: RIM } });
  hero(g, { x: E.W / 2 + 200, y: GY - 10, s: 1.2, kid: true, facing: -1, pose: POSES.point, expr: 'determined' });
  ageTag(g, 10, ease.out(prog(t, 0, 0.4))); brand(g);
} });
// s13 — age 12, the terrifying truth: nobody can be trusted
registerShot('s13', { draw(g, t, info) {
  const cam = push(t, info, 1.1, 0.15); const { GY } = hall(g, t, cam, { dim: 0.6, throne: true });
  layer(g, cam, 1, (g) => hero(g, { x: E.W / 2, y: GY + 80, s: 1.3, pose: breathe(POSES.stand, t), expr: 'scared', look: [0, 0] }));
  const tn = rel('nobody', info, 3.2); title(g, 'NOBODY', E.H * 0.22, ease.out(prog(t, tn, tn + 0.4)), 120, RED); title(g, 'CAN BE TRUSTED', E.H * 0.29, ease.out(prog(t, tn + 0.5, tn + 0.9)), 64);
  ageTag(g, 12, ease.out(prog(t, 0, 0.4)) * (1 - prog(t, tn - 0.5, tn))); brand(g);
} });
// s14 — brothers, nobles, smiling masks that crack
registerShot('s14', { draw(g, t, info) {
  const cam = push(t, info, 1.05, 0.08); const { GY } = hall(g, t, cam, { dim: 0.5 });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 5; i++) { const x = 130 + i * 205, y = GY + 30; drawFigure(g, { x, y, s: 1.25, facing: x < E.W / 2 ? 1 : -1, pose: breathe(POSES.crossArms, t, 1, i), outfit: NOBLE, expr: 'smirk', rim: { color: RED } });
    const [hx, hy, r] = headPos({ x, y, s: 1.25, pose: POSES.crossArms }); mask(g, hx + (x < E.W / 2 ? 6 : -6), hy, r * 1.2, { crack: prog(t, rel('smiled', info, 5) + i * 0.3, rel('smiled', info, 5) + 1 + i * 0.3) }); } });
  const tb = rel('brothers', info, 0.2), tn = rel('nobles', info, 2), td = rel('downfall', info, 8);
  if (t < tn) title(g, 'OBSTACLE', E.H * 0.2, ease.out(prog(t, tb + 0.6, tb + 1)), 96, RED);
  else if (t < td - 3) title(g, 'POLITICAL TOOL', E.H * 0.2, ease.out(prog(t, tn + 0.6, tn + 1)), 80, GOLD);
  brand(g);
} });
// s15 — attempts on his life: poison bowl glowing jade, assassins in the shadows
registerShot('s15', { draw(g, t, info) {
  const ta = rel('Assassins', info, 2.3), tc = rel('Accidents', info, 5.9);
  g.fillStyle = '#060508'; g.fillRect(0, 0, E.W, E.H);
  if (t < ta) { bowl(g, E.W / 2, E.H * 0.55, 2.4, ease.out(prog(t, 1.3, 2)), t); glow(g, E.W / 2, E.H * 0.55, 600, JADE, 0.15); }
  else { const k = prog(t, ta, ta + 1.5); for (let i = 0; i < 4; i++) drawFigure(g, { x: 160 + i * 250, y: E.H * 0.7 + (i % 2) * 60, s: 1.6, facing: i < 2 ? 1 : -1, pose: walkPose(t * 2 + i, {}), ink: '#000', outfit: { head: 'none' }, expr: 'neutral', face: { eyes: false }, rim: { color: RED, w: 5 }, alpha: 0.4 + 0.6 * k });
    if (t > tc) { veil(g, RED, 0.25 * (1 - prog(t, tc, tc + 0.4)), 'lighter'); title(g, 'NEVER ACCIDENTS', E.H * 0.25, ease.out(prog(t, tc + 0.6, tc + 1)), 70, RED); } }
  eyes(g, t, 4, { seed: 11, color: RED }); brand(g);
} });
// s16 — inspect every meal, dagger under the pillow, never turn your back
registerShot('s16', { draw(g, t, info) {
  const cam = push(t, info, 1.05, 0.1); const { GY } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => { FX.bed(g, { x: E.W / 2 - 100, y: GY, w: 520, color: '#3a1010', frame: '#1a0a06', pillow: PAPER });
    hero(g, { x: E.W / 2 - 230, y: GY - 60, s: 1.25, rot: -Math.PI / 2, pose: POSES.lie, expr: 'worried', look: [1, 0], blink: false, shadow: false });
    dagger(g, E.W / 2 - 330, GY - 70, 0.8, 0); });
  eyes(g, t, 2, { seed: 21, color: RED }); brand(g);
} });
// s17 — imagine that: big face, eyes wide open in a palace of treasures
registerShot('s17', { draw(g, t, info) {
  const cam = { z: 1.1 }; blurLayer(g, 12, (g) => hall(g, t, cam, { dim: 0.55 }), cam, 0.5); veil(g, '#000', 0.35);
  const z = 1 + 0.07 * ease.inOut(t / info.dur); g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  bigFace(g, E.W / 2, E.H * 0.5, 280, { outfit: PRINCE, expr: 'scared', blink: false, look: [Math.sin(t * 1.3) * 0.8, 0], rimColor: RIM, rimSide: -1 });
  crown(g, E.W / 2, E.H * 0.5 - 40, 280, { heavy: 0.2 }); g.restore(); brand(g);
} });
// s18 — people outside the palace envied him: commoners peering through the gate
registerShot('s18', { draw(g, t, info) {
  const cam = push(t, info, 1.0, 0.06); const { GY } = garden(g, t, cam, 0.5); veil(g, '#1a0e08', 0.3);
  for (let i = 0; i < 5; i++) drawFigure(g, { x: 140 + i * 200, y: GY + 260, s: 1.2, facing: 1, pose: i % 2 ? POSES.reach : POSES.pointUp, outfit: KID.kid ? { top: 'tshirt', color: '#6a5a4a', head: 'none' } : KID, expr: 'awe', look: [0, -1], rim: { color: '#ffd38a' } });
  for (let i = 0; i < 12; i++) seg(g, [[60 + i * 90, GY - 120], [60 + i * 90, GY + 300]], 14, '#1a0e08'); seg(g, [[0, GY - 120], [E.W, GY - 120]], 18, GOLD);
  throne(g, E.W / 2, GY - 330, 0.8); hero(g, { x: E.W / 2, y: GY - 360, s: 0.8, pose: POSES.sad, expr: 'sad' });
  brand(g);
} });
// s19 — trade everything: gold turns to ash; a warm dream of an ordinary childhood
registerShot('s19', { draw(g, t, info) {
  const tf = rel('friends', info, 6.6), dream = ease.inOut(prog(t, tf - 1, tf));
  if (dream < 1) { g.save(); g.globalAlpha = 1 - dream; const { GY } = hall(g, t, { z: 1.05 }, { dim: 0.5 * prog(t, 0, 5) });
    hero(g, { x: E.W / 2, y: GY + 60, s: 1.3, pose: POSES.sad, expr: 'sad' });
    for (let i = 0; i < 40; i++) { const x = (i * 197) % E.W, y = ((t * 120 + i * 90) % E.H); circle(g, x, y, 6, alpha(lerp(0, 1, prog(t, 1, 5)) > 0.5 ? '#6a6a6a' : GOLD, 0.8)); } g.restore(); }
  if (dream > 0) { g.save(); g.globalAlpha = dream; const { GY } = garden(g, t, { z: 1.0 + 0.04 * t / info.dur });
    const kids = [[E.W / 2 - 230, 'joy'], [E.W / 2 + 230, 'happy']]; for (const [x, ex] of kids) drawFigure(g, { x, y: GY + 120, s: 1.1, outfit: KID, pose: breathe(POSES.cheer, t, 1, x), expr: ex, rim: { color: '#ffe0a0' } });
    drawFigure(g, { x: E.W / 2, y: GY + 160, s: 1.2, outfit: { top: 'tshirt', color: '#d6c8a0', head: 'none', kid: true }, pose: breathe(POSES.cheer, t), expr: 'joy', rim: { color: '#ffe0a0' } });
    // kite
    const kx = E.W / 2 + 200 + Math.sin(t) * 40, ky = E.H * 0.2; g.fillStyle = RED; g.beginPath(); g.moveTo(kx, ky - 60); g.lineTo(kx + 40, ky); g.lineTo(kx, ky + 60); g.lineTo(kx - 40, ky); g.fill(); seg(g, [[kx, ky + 60], [E.W / 2 + 20, GY - 120]], 2, alpha(PAPER, 0.7));
    g.restore(); veil(g, '#fff4dc', 0.08); }
  brand(g);
} });
// s20 — "But I couldn't." back on the throne, alone
registerShot('s20', { draw(g, t, info) {
  const cam = push(t, info, 1.0, 0.18); const { GY } = hall(g, t, cam, { dim: 0.55, mood: 'interiorWarm' });
  layer(g, cam, 1, (g) => hero(g, { x: E.W / 2, y: GY - 100, s: 1.5, pose: POSES.sit, expr: 'sad', look: [0, 0.5], heavy: 0.5 + 0.5 * prog(t, 0, info.dur), tilt: 0.1 }));
  const tr = rel('reward', info, 5.5); if (t > tr) title(g, 'NOT A REWARD', E.H * 0.22, ease.out(prog(t, tr, tr + 0.5)), 80, GOLD);
  brand(g);
} });
// s21 — "It was a sentence." crown becomes chains -> black -> loops to title
registerShot('s21', { draw(g, t, info) {
  g.fillStyle = '#040304'; g.fillRect(0, 0, E.W, E.H); const k = ease.inOut(prog(t, 0.2, 1.6));
  hero(g, { x: E.W / 2, y: E.H * 0.72, s: 1.6, pose: POSES.sad, expr: 'sad', heavy: 0.8, rim: RED });
  for (const sx of [-1, 1]) chains(g, E.W / 2 + sx * 60, lerp(-900, E.H * 0.18, k), 14, t);
  title(g, 'A SENTENCE', E.H * 0.2, ease.out(prog(t, 0.2, 0.7)) * (1 - prog(t, info.dur - 0.6, info.dur)), 110, RED);
  veil(g, '#000', prog(t, info.dur - 1.0, info.dur - 0.1)); brand(g, 0.55 * (1 - prog(t, info.dur - 1, info.dur)));
} });
