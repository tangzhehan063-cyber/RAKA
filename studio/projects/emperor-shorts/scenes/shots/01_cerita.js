// 01_cerita.js — Stick.Tales: The Curse of Being the Emperor's Firstborn (flat storybook)
import { E, registerShot, ease, prog, clamp, lerp, wordTime, alpha, glow, veil, circle, seg, rr, text, shake } from '/engine/core.js';
import { chibi, OUT } from '../chibi.js';
import * as P from '../sets/palace.js';
const { W, H, FL, OL, GOLD, RED } = P;
const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const cam = (g, z, fx, fy, fn) => { g.save(); g.translate(fx, fy); g.scale(z, z); g.translate(-fx, -fy); fn(g); g.restore(); };
const push = (t, info, a = 1, b = 0.06) => a + b * ease.inOut(clamp(t / info.dur));
const blink = (t, s = 0) => ((t + s) % 3.3) > 3.18;
const bob = (t, s = 0) => Math.sin(t * 2.2 + s);
const pop = (t, a, d = 0.35) => ease.outBack(prog(t, a, a + d));
function guard(g, x, y, s, t, i) { const r = chibi(g, { x, y, s, out: { robe: '#7a5a3a', trim: '#3a2a1a', inner: '#c9a77a', hat: 'wusha', hair: OL }, expr: 'neutral', blink: blink(t, i), bob: bob(t, i), armL: [10, 0], armR: { to: [x + 60 * s, y - 230 * s] } }); seg(g, [[x + 60 * s, y - 380 * s], [x + 60 * s, y - 20 * s]], 6 * s, '#7a4a2a'); seg(g, [[x + 60 * s, y - 380 * s], [x + 60 * s, y - 440 * s]], 10 * s, '#c9cfd8'); }

// s01 0–3.07 TITLE: prince in throne hall, title card
registerShot('s01', { draw(g, t, info) {
  cam(g, push(t, info, 1.08, -0.06), W / 2, 1100, (g) => { P.hall(g, t); chibi(g, { x: W / 2, y: 1640, s: 1.7, out: OUT.prince, expr: 'neutral', blink: blink(t), bob: bob(t), armL: [8, 0], armR: [8, 0] }); });
  veil(g, '#000', 0.1);
  const a = ease.out(prog(t, 0.05, 0.4)); P.titleCard(g, 'THE CURSE', "of the Emperor's Firstborn", a, 640); P.brand(g);
}, captions: false });
// s02 3.07–7.5 Imagine… first son of the most powerful emperor: emperor holds baby up
registerShot('s02', { draw(g, t, info) {
  cam(g, push(t, info), W / 2, 1100, (g) => { P.hall(g, t);
    const ex = W / 2 + 40, hy = lerp(1420, 1340, ease.inOut(prog(t, 0.3, 1.6)));
    const r = chibi(g, { x: ex, y: 1660, s: 1.9, out: OUT.emperor, expr: 'happy', blink: blink(t), bob: bob(t), armL: { to: [ex - 60, hy] }, armR: { to: [ex + 60, hy] } });
    rr(g, ex - 95, hy - 60, 190, 90, 44); g.fillStyle = '#e8b33a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke(); circle(g, ex, hy - 80, 50, '#fff'); g.beginPath(); g.arc(ex, hy - 80, 50, 0, 7); g.stroke(); circle(g, ex - 14, hy - 82, 6, OL); circle(g, ex + 14, hy - 82, 6, OL); glow(g, ex, hy - 60, 160, '#fff2b0', 0.4); });
  P.brand(g);
} });
// s03 7.5–9.17 blessed: officials bowing, cheering
registerShot('s03', { draw(g, t, info) {
  cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.hall(g, t);
    [[200, OUT.official], [880, OUT.brother]].forEach(([x, o], i) => chibi(g, { x, y: 1650, s: 1.55, out: o, expr: 'happy', blink: blink(t, i), facing: 1, armL: [150 + 10 * Math.sin(t * 8 + i), 0], armR: [150 + 10 * Math.sin(t * 8 + i + 1), 0] }));
    chibi(g, { x: W / 2, y: 1700, s: 1.5, kid: true, out: OUT.prince, expr: 'neutral', blink: blink(t, 2), bob: bob(t) }); });
  for (let i = 0; i < 18; i++) { const u = (t * 0.6 + i / 18) % 1; P.coin(g, (i * 157) % W, -40 + u * 900, 14); }
  P.brand(g);
} });
// s04 9.17–19.01 wealth, gold, servants, luxury → one day inherit throne & rule empire
registerShot('s04', { draw(g, t, info) {
  const tOne = rel('One', info, 4.8), k = ease.inOut(prog(t, tOne - 0.2, tOne + 0.8));
  cam(g, push(t, info, 1.0, 0.08), W / 2, 1100, (g) => { P.hall(g, t);
    if (k < 1) { g.save(); g.globalAlpha = 1 - k;
      // servants carrying treasure
      for (let i = 0; i < 2; i++) { const x = (i ? 860 : 220), cx = x; chibi(g, { x, y: 1650, s: 1.3, out: { robe: '#d9cbb0', trim: '#7a5a3a', inner: '#fff', hat: 'bun', hair: OL }, expr: 'happy', blink: blink(t, i), legs: 'walk', armL: { to: [cx - 50, 1240] }, armR: { to: [cx + 50, 1240] } });
        rr(g, cx - 80, 1160, 160, 90, 10); g.fillStyle = '#8a4a26'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke(); for (let j = 0; j < 5; j++) P.coin(g, cx - 56 + j * 28, 1156 - (j % 2) * 14, 16); }
      chibi(g, { x: W / 2, y: 1680, s: 1.6, kid: true, out: OUT.prince, expr: 'happy', blink: blink(t), bob: bob(t), armL: [40, 20], armR: [40, -20] }); g.restore(); }
    if (k > 0) { g.save(); g.globalAlpha = k; chibi(g, { x: W / 2, y: FL - 70, s: 1.55, out: OUT.prince, expr: 'neutral', blink: blink(t), armL: [25, 10], armR: [25, -10] }); g.restore(); } });
  if (k < 1) for (let i = 0; i < 16; i++) { const u = (t * 0.5 + i / 16) % 1; P.coin(g, (i * 211) % W, -40 + u * 1000, 13); }
  if (k > 0.5) P.titleCard(g, 'HEIR', 'to the throne', ease.out(prog(t, tOne + 0.8, tOne + 1.3)), 640);
  P.brand(g);
} });
// s05 19.01–24.32 But what they don't know: palace dims, prince alone, lanterns sway
registerShot('s05', { draw(g, t, info) {
  const d = prog(t, 0, 2.5);
  P.blurBG(g, (g) => cam(g, 1.1, W / 2, 1100, (g) => P.hall(g, t)), 0.4 * d, 0.3 * d);
  chibi(g, { x: W / 2, y: 2000, s: 2.6, out: OUT.prince, expr: d > 0.6 ? 'worried' : 'neutral', blink: blink(t), bob: bob(t), look: [Math.sin(t * 0.8) * 0.8, 0] });
  P.brand(g);
} });
// s06 24.32–26.68 Sometimes, it's a curse: shock face, red flash, title
registerShot('s06', { draw(g, t, info) {
  const [sx, sy] = shake(t, 0, 0.5, 12) || [0, 0]; g.save(); g.translate(sx, sy);
  P.blurBG(g, (g) => P.hall(g, t), 0.7, 0.4, '#3a0a0a');
  chibi(g, { x: W / 2, y: 2050, s: 2.7, out: OUT.prince, expr: 'shock', sweat: true, blink: false }); g.restore();
  veil(g, '#ff3020', 0.4 * (1 - prog(t, 0, 0.5)), 'lighter');
  const tc = rel('curse', info, 1.1); P.titleCard(g, 'CURSE', null, pop(t, tc), 640); P.brand(g);
} });
// s07 26.68–35.34 fate decided / not my own life / born to be next emperor: scroll unrolls a life plan
registerShot('s07', { draw(g, t, info) {
  cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.study(g, t);
    const tn = rel('next', info, 7.5), lines = [['MY FATE', RED, 76], ['Study', OL, 60, prog(t, 1.2, 1.6)], ['Train', OL, 60, prog(t, 2.2, 2.6)], ['Rule', OL, 60, prog(t, 3.2, 3.6)], ['NO CHOICE', RED, 64, prog(t, 4.6, 5)]];
    P.board(g, 170, 460, 740, 520, lines);
    if (t > tn - 0.3) P.titleCard(g, 'NEXT EMPEROR', null, pop(t, tn), 1060);
    chibi(g, { x: W / 2, y: 1680, s: 1.7, kid: true, out: OUT.prince, expr: 'sad', blink: blink(t), bob: bob(t), look: [0, -0.8] }); });
  P.brand(g);
} });
// s08 35.34–44.77 future written; every word watched: officials with brushes taking notes around him
registerShot('s08', { draw(g, t, info) {
  cam(g, push(t, info, 1.0, 0.07), W / 2, 1100, (g) => { P.palace(g, t);
    [[190, -1], [890, 1]].forEach(([x, f], i) => { const hx = x - f * 80, hy = 1300 + Math.sin(t * 9 + i) * 8; chibi(g, { x, y: 1660, s: 1.45, out: OUT.official, expr: 'neutral', look: [-f, 0.4], blink: blink(t, i), armL: { to: [x - 70, 1330] }, armR: { to: [hx + 70, hy - 20] } });
      rr(g, x - 90, 1300, 120, 80, 6); g.fillStyle = '#f3ead2'; g.fill(); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); for (let j = 0; j < 3; j++) seg(g, [[x - 70, 1320 + j * 18], [x - 70 + ((t * 40 + j * 30) % 80), 1320 + j * 18]], 4, OL); });
    chibi(g, { x: W / 2, y: 1700, s: 1.7, kid: true, out: OUT.prince, expr: 'worried', sweat: t > 4, blink: blink(t, 1), bob: bob(t), look: [Math.sin(t * 0.9), 0] }); });
  // eyes motif
  const tw = rel('watched', info, 8.5); if (t > tw - 0.2) P.titleCard(g, 'WATCHED', null, pop(t, tw), 640);
  P.brand(g);
} });
// s09 44.77–50.71 father never saw a child, saw his successor
registerShot('s09', { draw(g, t, info) {
  const ts = rel('successor', info, 3.6);
  cam(g, push(t, info, 1.05, 0.06), W / 2, 1100, (g) => { P.hall(g, t);
    chibi(g, { x: 720, y: 1660, s: 2.0, out: OUT.emperor, expr: 'angry', look: [1, 0], blink: blink(t), armL: [20, 10], armR: [20, -10] });
    chibi(g, { x: 280, y: 1700, s: 1.55, kid: true, out: OUT.prince, expr: 'sad', look: [1, -0.6], blink: blink(t, 1), armL: [70, 40], armR: [8, 0] }); });
  if (t > ts - 0.3) P.titleCard(g, 'SUCCESSOR', null, pop(t, ts), 640);
  P.brand(g);
} });
// s10 50.71–63.24 AGE 5 study vs other children playing in gardens; memorizing kings & wars
registerShot('s10', { draw(g, t, info) {
  const tw = rel('While', info, 5.2), tg = rel('sat', info, 8.2), inG = t > tw - 0.15 && t < tg - 0.15;
  if (!inG) cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.study(g, t);
    P.board(g, 170, 460, 740, 480, [['AGE 5', RED, 90], ['History', OL, 60, prog(t, 1.4, 1.7)], ['Politics', OL, 60, prog(t, 2.3, 2.6)], ['War', OL, 60, prog(t, 3.2, 3.5)]]);
    rr(g, 230, 1420, 620, 50, 10); g.fillStyle = '#7a4a2a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke();
    const r = chibi(g, { x: W / 2, y: 1650, s: 1.9, kid: true, out: OUT.prince, expr: t > tg ? 'sad' : 'worried', sweat: t > tg, blink: blink(t), look: [0, 0.8], armL: { to: [W / 2 - 110, 1410] }, armR: { to: [W / 2 + 110, 1410 + Math.sin(t * 7) * 6] } });
    rr(g, W / 2 - 150, 1386, 300, 28, 6); g.fillStyle = '#f3ead2'; g.fill(); g.stroke(); });
  else { P.garden(g, t);
    for (let i = 0; i < 3; i++) { const x = 180 + i * 340 + Math.sin(t * 2 + i) * 50; chibi(g, { x, y: 1660 - Math.abs(Math.sin(t * 6 + i)) * 40, s: 1.45, kid: true, out: i === 1 ? { ...OUT.kid, robe: '#e88a8a' } : OUT.kid, expr: 'happy', legs: 'walk', blink: blink(t, i), armL: [140, 0], armR: [140, 0] }); }
    // kite
    const kx = 760 + Math.sin(t) * 40, ky = 420; g.fillStyle = RED; g.beginPath(); g.moveTo(kx, ky - 70); g.lineTo(kx + 50, ky); g.lineTo(kx, ky + 70); g.lineTo(kx - 50, ky); g.closePath(); g.fill(); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); seg(g, [[kx, ky + 70], [520, 1300]], 2, alpha(OL, 0.5)); }
  P.brand(g);
} });
// s11 63.24–65.54 AGE 7 sword training
registerShot('s11', { draw(g, t, info) {
  cam(g, 1.0, W / 2, 1100, (g) => { P.yard(g, t);
    const sw = Math.sin(t * 6), x = W / 2, hx = x + 140, hy = 1200 + sw * 90;
    chibi(g, { x, y: 1680, s: 1.8, kid: true, out: OUT.prince, expr: 'angry', blink: false, armL: [30, 30], armR: { to: [hx, hy] } });
    P.blade(g, hx, hy, -0.9 + sw * 0.6, 260); });
  P.titleCard(g, 'AGE 7', null, pop(t, 0.05), 640); P.brand(g);
} });
// s12 65.54–69.97 AGE 10 command soldiers, identify enemies
registerShot('s12', { draw(g, t, info) {
  cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.yard(g, t);
    for (let i = 0; i < 3; i++) guard(g, 600 + i * 190, 1560 + (i % 2) * 40, 1.1, t, i);
    chibi(g, { x: 260, y: 1700, s: 1.75, kid: true, out: OUT.prince, expr: 'angry', blink: blink(t), facing: 1, armL: [10, 0], armR: { to: [470, 1230] } }); });
  P.titleCard(g, 'AGE 10', null, pop(t, 0.05), 640); P.brand(g);
} });
// s13 69.97–76.82 AGE 12 terrifying truth: nobody can be trusted (blur title card)
registerShot('s13', { draw(g, t, info) {
  const tn = rel('nobody', info, 3.3);
  P.blurBG(g, (g) => P.hall(g, t), 0.3, 0.3);
  if (t < tn - 0.2) chibi(g, { x: W / 2, y: 2000, s: 2.5, out: OUT.prince, expr: 'scared', sweat: true, blink: blink(t), look: [Math.sin(t * 2) * 0.9, 0] });
  P.titleCard(g, 'AGE 12', null, pop(t, 0.05) * (t < tn - 0.2 ? 1 : 0), 640);
  if (t >= tn - 0.2) P.titleCard(g, 'NOBODY', 'can be trusted', pop(t, tn - 0.2), 700);
  P.brand(g);
} });
// s14 76.82–86.36 brothers (obstacle), nobles (tool), smiles waiting for downfall: daggers behind backs
registerShot('s14', { draw(g, t, info) {
  const tn = rel('nobles', info, 2.0), ts = rel('smiled', info, 5);
  cam(g, push(t, info, 1.0, 0.06), W / 2, 1100, (g) => { P.palace(g, t);
    const L = t < tn ? OUT.brother : OUT.official, R = t < tn ? OUT.brother2 : { ...OUT.official, robe: '#8a5a2a' };
    chibi(g, { x: 220, y: 1660, s: 1.6, out: L, expr: 'smirk', look: [1, 0], blink: blink(t), armL: [-25, -25], armR: [20, 10] });
    chibi(g, { x: 860, y: 1660, s: 1.6, out: R, expr: 'smirk', look: [-1, 0], blink: blink(t, 1), armL: [20, 10], armR: [-25, -25] });
    if (t > ts) { P.blade(g, 120, 1300, Math.PI + 0.4, 110); P.blade(g, 960, 1300, -0.4, 110); }
    chibi(g, { x: W / 2, y: 1720, s: 1.75, out: OUT.prince, expr: 'worried', sweat: t > ts, look: [Math.sin(t * 1.2), 0], blink: blink(t, 2), bob: bob(t) }); });
  P.titleCard(g, t < tn ? 'OBSTACLE' : 'TOOL', null, t < tn ? pop(t, 0.9) : pop(t, tn + 0.8), 480);
  P.brand(g);
} });
// s15 86.36–96.21 attempts on my life: poison bowl / assassins / accidents
registerShot('s15', { draw(g, t, info) {
  const ta = rel('Assassins', info, 2.3), tc = rel('Accidents', info, 5.9);
  if (t < ta) { P.blurBG(g, (g) => P.palace(g, t), 0.6, 0.35);
    const bx = W / 2, by = 1560; chibi(g, { x: W / 2, y: 2080, s: 2.6, out: OUT.prince, expr: 'scared', sweat: true, blink: false, look: [0, 0.6], armL: { to: [bx - 130, by + 10] }, armR: { to: [bx + 130, by + 10] } }); P.bowl(g, bx, by, 1, ease.out(prog(t, 1.0, 1.6)), t); }
  else if (t < tc) { P.bedroom(g, t); veil(g, '#0a0e1a', 0.35);
    for (let i = 0; i < 2; i++) { const x = lerp(i ? 1200 : -150, i ? 760 : 320, ease.out(prog(t, ta, ta + 1.4))); chibi(g, { x, y: 1660, s: 1.6, out: OUT.assassin, expr: 'angry', facing: i ? -1 : 1, legs: 'walk', look: [i ? -1 : 1, 0], armL: [10, 0], armR: { to: [x + (i ? -110 : 110), 1300] } }); P.blade(g, x + (i ? -110 : 110), 1300, i ? Math.PI + 0.3 : -0.3, 110); } }
  else { P.blurBG(g, (g) => P.palace(g, t), 0.5, 0.3, '#3a0a0a');
    // falling lantern accident
    const u = ease.in(prog(t, tc, tc + 0.8)), ly = lerp(-100, 1250, u); P.lantern(g, W / 2 + 200, ly, 1.3, 0);
    chibi(g, { x: W / 2 - 160, y: 1700, s: 1.9, out: OUT.prince, expr: u > 0.8 ? 'shock' : 'neutral', sweat: u > 0.8, blink: false, look: [1, -0.6] });
    if (u >= 1) veil(g, '#ffffff', 0.5 * (1 - prog(t, tc + 0.8, tc + 1.2)), 'lighter');
    P.titleCard(g, 'NOT', 'an accident', pop(t, tc + 1.4), 640); }
  if (t < ta) P.titleCard(g, 'POISON', null, pop(t, 0.9), 640);
  P.brand(g);
} });
// s16 96.21–104.81 inspect meals, dagger under pillow, never turn back
registerShot('s16', { draw(g, t, info) {
  const td = rel('sleep', info, 1.9), tb = rel('never', info, 5.1);
  if (t < td) { cam(g, 1.05, W / 2, 1100, (g) => { P.palace(g, t); rr(g, 200, 1440, 680, 50, 10); g.fillStyle = '#7a4a2a'; g.fill(); g.strokeStyle = OL; g.lineWidth = 5; g.stroke();
    P.bowl(g, 640, 1420, 0.7, 0, t); const nx = 600 + Math.sin(t * 5) * 30; chibi(g, { x: 420, y: 1680, s: 1.8, out: OUT.prince, expr: 'worried', look: [1, 0.8], blink: false, armL: [10, 0], armR: { to: [nx, 1380] } }); seg(g, [[nx, 1380], [nx + 30, 1440]], 6, '#c9cfd8'); }); }
  else if (t < tb) { P.bedroom(g, t); P.bed(g, W / 2, 1520);
    const hx = 320, hy = 1310; circle(g, hx, hy, 70, '#fff'); g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.arc(hx, hy, 70, 0, 7); g.stroke(); circle(g, hx, hy - 30, 72 * 0.3, OL);
    for (const s of [-1, 1]) { circle(g, hx + s * 24, hy, 8, OL); } seg(g, [[hx - 10, hy + 30], [hx + 10, hy + 30]], 5, OL);
    P.blade(g, 330, 1350, 0.05, 140); glow(g, 400, 1350, 120, '#dfe8ff', 0.3 + 0.2 * Math.sin(t * 4)); }
  else { cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.palace(g, t);
    chibi(g, { x: 380, y: 1680, s: 1.9, out: OUT.prince, expr: 'angry', look: [1, 0], blink: blink(t), armL: [10, 0], armR: [10, 0] });
    chibi(g, { x: 830, y: 1680, s: 1.6, out: OUT.official, expr: 'smirk', look: [-1, 0], blink: blink(t, 1) }); }); }
  P.brand(g);
} });
// s17 104.81–111.49 Imagine that: palace of treasure, can't close your eyes (big face close-up)
registerShot('s17', { draw(g, t, info) {
  P.blurBG(g, (g) => cam(g, 1.2, W / 2, 900, (g) => P.hall(g, t)), 0.5, 0.45, '#101830');
  for (let i = 0; i < 12; i++) { P.coin(g, 120 + (i * 97) % 860, 300 + (i * 151) % 900, 12); }
  chibi(g, { x: W / 2, y: 2500, s: 3.4, out: OUT.prince, expr: 'scared', blink: false, sweat: true, look: [Math.sin(t * 1.5) * 0.9, 0] });
  P.brand(g);
} });
// s18 111.49–119.25 people outside the palace envied me
registerShot('s18', { draw(g, t, info) {
  cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.gate(g, t);
    // prince behind the bars
    chibi(g, { x: W / 2, y: 1240, s: 1.0, out: OUT.prince, expr: 'sad', blink: blink(t), look: [0, 0.5] });
    for (let i = 0; i < 14; i++) { const x = -30 + i * 85; rr(g, x - 9, 380, 18, FL - 380, 4); g.fillStyle = '#7a1a14'; g.fill(); }
    const peo = [[180, { ...OUT.kid, robe: '#a08a6a' }, 'happy'], [480, { ...OUT.kid, robe: '#6a8aa8', hat: 'bun' }, 'happy'], [800, { ...OUT.kid, robe: '#c98a5a' }, 'happy']];
    peo.forEach(([x, o, e], i) => chibi(g, { x, y: 1720, s: 1.6, out: o, expr: e, look: [0, -1], blink: blink(t, i), armL: [150, 10], armR: [100 + 20 * Math.sin(t * 3 + i), 20] })); });
  P.titleCard(g, 'ENVIED', null, pop(t, 0.9), 640); P.brand(g);
} });
// s19 119.25–136.01 trade gold, palace, throne → ordinary childhood, friends, laugh, sleep
registerShot('s19', { draw(g, t, info) {
  const tc = rel('ordinary', info, 4.6), tf = rel('friends', info, 6.6), tl = rel('laugh', info, 9.3), ts = rel('peacefully', info, 12.8);
  if (t < tc) { cam(g, push(t, info, 1.0, 0.05), W / 2, 1100, (g) => { P.hall(g, t);
      const x = W / 2; chibi(g, { x, y: 1700, s: 1.9, out: OUT.prince, expr: 'sad', blink: blink(t), armL: { to: [x - 150, 1200] }, armR: { to: [x + 150, 1200] } });
      for (let i = 0; i < 8; i++) { const u = (t * 0.7 + i / 8) % 1; P.coin(g, x - 140 + i * 40, 1200 + u * 450, 16); } }); }
  else if (t < ts) { P.garden(g, t);
    const n = t < tl ? 2 : 3;
    chibi(g, { x: 300, y: 1700, s: 1.6, out: { ...OUT.prince, hat: 'bun', robe: '#d9cbb0', trim: '#8a6a4a' }, expr: 'happy', blink: blink(t), bob: bob(t), armL: [140 + 10 * Math.sin(t * 6), 0], armR: [60, 30] });
    for (let i = 0; i < n; i++) chibi(g, { x: 620 + i * 230, y: 1700 - Math.abs(Math.sin(t * 5 + i)) * 30, s: 1.5, kid: true, out: i ? { ...OUT.kid, robe: '#e88a8a' } : OUT.kid, expr: 'happy', blink: blink(t, i), armL: [140, 0], armR: [150, 0] });
    veil(g, '#fff4dc', 0.1, 'lighter'); }
  else { P.bedroom(g, t); veil(g, '#0a0e1a', 0.1); P.bed(g, W / 2, 1520);
    const hx = 320, hy = 1310; circle(g, hx, hy, 70, '#fff'); g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.arc(hx, hy, 70, 0, 7); g.stroke();
    for (const s of [-1, 1]) seg(g, [[hx + s * 24 - 12, hy], [hx + s * 24 + 12, hy]], 5, OL); g.beginPath(); g.arc(hx, hy + 26, 14, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    for (let i = 0; i < 3; i++) { const u = (t * 0.4 + i / 3) % 1; text(g, 'z', hx + 90 + u * 120, hy - 80 - u * 200, { size: 50 + i * 10, font: 'Fredoka', weight: 700, color: '#fff', alpha: 1 - u }); } }
  P.brand(g);
} });
// s20 136.01–143.33 But I couldn't. firstborn son of the emperor. crown not a reward
registerShot('s20', { draw(g, t, info) {
  const tr = rel('reward', info, 5.6);
  P.blurBG(g, (g) => cam(g, 1.05, W / 2, 1100, (g) => P.hall(g, t)), 0.35 + 0.3 * prog(t, 0, 6), 0.2 + 0.2 * prog(t, 0, 6));
  P.throne(g, W / 2, 1640, 1.3);
  chibi(g, { x: W / 2, y: 1530, s: 1.9, out: OUT.prince, expr: 'sad', blink: blink(t), look: [0, 0.6], armL: [20, 10], armR: [20, -10] });
  if (t > tr - 0.3) P.titleCard(g, 'NOT A REWARD', null, pop(t, tr), 640);
  P.brand(g);
} });
// s21 143.33–148.45 It was a sentence: chains lock onto his wrists; ends on the hall (loops to s01)
registerShot('s21', { draw(g, t, info) {
  P.blurBG(g, (g) => cam(g, 1.05, W / 2, 1100, (g) => P.hall(g, t)), 0.8, 0.5, '#2a0808'); veil(g, '#7a1010', 0.15, 'multiply');
  P.throne(g, W / 2, 1640, 1.3);
  const r = chibi(g, { x: W / 2, y: 1530, s: 1.9, out: OUT.prince, expr: 'sad', blink: blink(t), look: [0, 0.6], armL: { to: [W / 2 - 170, 1120] }, armR: { to: [W / 2 + 170, 1120] } });
  const k = ease.out(prog(t, 0.1, 0.8)); for (const [hx, hy] of r.hands) chain(g, hx, lerp(-200, -60, k), hx, hy - 20, 12);
  P.titleCard(g, 'A SENTENCE', null, pop(t, 0.2), 640);
  veil(g, '#000', 0.6 * prog(t, info.dur - 0.8, info.dur));
  P.brand(g);
} });
function chain(g, x0, y0, x1, y1, n) { P.chain(g, x0, y0, x1, y1, n); }
