// 05_jalan.js — adegan jalan (gaya GrowKaz): tokoh berjalan memakai siklus jalan, kamera mengikuti, lapisan parallax berlapis (langit, gedung, jalan, tiang lampu), kabut dan debu.
import { E, V, S, registerShot, mood, layer, ease, prog, clamp, lerp, alpha, glow, rr, seg, circle, text, FONTS, wordTime } from '/engine/core.js';
import { drawFigure, POSES, walkPose, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { street } from '../sets/street.js';
import { NADIA, STABILO } from '../cast.js';
import { rel, hud } from './01_kamar.js';

const SC = () => V(1.5, 1.85);
// o { mood, sunY, speed, lamps, z, expr, down (0..1 kepala menunduk), props(g, GY, runX, t) -> depth 1, over(g, GY, sx, sy) -> overlay layar }
function jalan(g, t, info, o = {}) {
  const speed = o.speed ?? 260, runX = E.W / 2 - 200 + t * speed, cam = { z: o.z ?? 1.3, x: (runX - E.W / 2) * (o.follow ?? 1), y: o.camY ?? 0 };
  const { GY, M } = street(g, t, cam, { mood: o.mood || 'golden', sunY: o.sunY ?? 0.25, lamps: o.lamps ?? true, rays: o.rays });
  const ph = t * Math.PI * 2 * (o.step ?? 1.35), pose = walkPose(ph, { stride: o.stride ?? 26, lift: 12, arm: 16 }), d = o.down ?? 0;
  if (d) { pose.head = [pose.head[0] + 12 * d, pose.head[1] + 16 * d]; pose.sh = [pose.sh[0] + 6 * d, pose.sh[1] + 8 * d]; }
  layer(g, cam, 1, (g) => {
    if (o.props) o.props(g, GY, runX, t);
    drawFigure(g, { x: runX, y: GY + 20, s: SC(), facing: 1, outfit: NADIA, pose, expr: o.expr || 'neutral', look: [0.9, d * 0.5], blink: (t % 3.1) > 2.98, rim: { color: M.rim, dir: [0.6, -0.8], w: 3 } });
  });
  FX.fog(g, GY - 160, 260, M.fog, o.fog ?? 0.28); FX.dust(g, t, { count: 22, color: '#ffe9c0', a: 0.22 });
  const sx = E.W / 2, sy = GY + 20 - 210 * SC() * 0.9;   // posisi kepala di layar (kamera mengikuti)
  if (o.over) o.over(g, GY, sx, sy, M);
  return { GY, M, runX, sx, sy };
}
const tanda = (g, x, GY, str, a = 1, col = STABILO) => { if (a <= 0) return; g.save(); g.globalAlpha *= a; seg(g, [[x, GY + 12], [x, GY - 220]], 8, 'rgba(60,64,80,.8)'); rr(g, x - 70, GY - 300, 140, 86, 14); g.fillStyle = col; g.fill(); text(g, str, x, GY - 256, { size: 32, color: '#fff', font: FONTS.ui, weight: 900, spacing: 1 }); g.restore(); };

// s03 3.9–7.0: pagi, berjalan percaya diri ke kampus, kuis lancar
registerShot('s03', { draw(g, t, info) {
  jalan(g, t, info, { mood: 'golden', sunY: 0.35, speed: 250, expr: 'happy', rays: 1,
    props: (g, GY, runX) => { const gx = runX + 1.9 * 250 - 400 + 900; rr(g, gx - 150, GY - 330, 300, 330, 10); g.fillStyle = 'rgba(180,170,160,.9)'; g.fill(); rr(g, gx - 60, GY - 200, 120, 200, 8); g.fillStyle = 'rgba(40,44,60,.8)'; g.fill(); text(g, 'KAMPUS', gx, GY - 290, { size: 40, color: '#2b2f3a', font: FONTS.ui, weight: 900, spacing: 3 }); } });
  hud(g, 'KUIS ✓', ease.out(prog(t, 1.6, 2.0)));
} });
// s04 7.0–9.5: seminggu kemudian: berjalan melewati hari-hari, matahari berpindah tiap hari
registerShot('s04', { draw(g, t, info) {
  const day = Math.min(7, 1 + Math.floor(t / info.dur * 7)), sun = 0.45 - 0.4 * ((t / info.dur * 7) % 1);
  jalan(g, t, info, { mood: 'golden', sunY: Math.max(0.02, sun), speed: 360, step: 1.7, z: 1.18,
    props: (g, GY, runX) => { for (let i = 0; i < 8; i++) { const x = runX - 540 + 120 + i * 360; tanda(g, x, GY, i < 7 ? `HARI ${i + 1}` : 'UJIAN', 1, i < 7 ? 'rgba(90,100,130,.92)' : STABILO); } },
    over: (g) => { const ui = S().ui; text(g, 'SEMINGGU KEMUDIAN', E.W / 2, 420, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.0, 0.4)) * (1 - prog(t, 1.6, 2.2)) }); } });
  hud(g, `HARI ${day}`, 1);
} });
// s08 17.4–22.6: pulang sambil mikir, kepala menunduk, otak "bocor"
registerShot('s08', { draw(g, t, info) {
  const tb = rel('bocor', info, 1.9), tn = rel('pintar', info, 4.6);
  jalan(g, t, info, { mood: 'night', sunY: 0.03, speed: 190, step: 1.1, stride: 20, down: 1, expr: t > tn - 0.8 ? 'sad' : 'worried', fog: 0.4,
    over: (g, GY, sx, sy, M) => { const ui = S().ui;
      for (let i = 0; i < 7; i++) { const k = ((t - tb) * 0.8 + i * 0.17) % 1; if (t > tb - 0.2) circle(g, sx - 30 + (i % 3) * 22, sy - 20 + k * 220, 10 * (1 - k * 0.5), alpha(ui.blueprint, 0.9 * (1 - k))); }
      const a = ease.outBack(prog(t, tb - 0.1, tb + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 640); g.scale(a, a); text(g, 'OTAKKU BOCOR?', 0, 0, { size: 86, color: ui.gold, font: FONTS.ui, weight: 900, glow: 12, glowColor: 'rgba(0,0,0,.5)' }); g.restore(); }
      const b = ease.outBack(prog(t, tn - 0.1, tn + 0.3)); if (b > 0) { g.save(); g.translate(E.W / 2, 790); g.scale(b, b); text(g, 'NGGAK PINTAR?', 0, 0, { size: 76, color: ui.cream, font: FONTS.ui, weight: 900, glow: 12, glowColor: 'rgba(0,0,0,.5)' }); g.restore(); } } });
} });
// s15 52.5–56.0: Nadia nggak bodoh, berjalan ringan pagi hari
registerShot('s15', { draw(g, t, info) {
  jalan(g, t, info, { mood: 'golden', sunY: 0.4, speed: 210, step: 1.25, expr: 'smile', rays: 1.4 });
  hud(g, 'WAJAR', ease.out(prog(t, 0.5, 0.9)));
} });
// s16 56.0–60.5: tiga sesi pendek di hari yang berbeda (langit berganti tiap sesi)
registerShot('s16', { draw(g, t, info) {
  const t3 = rel('tiga', info, 1.8), sk = [0.1, 0.45, 0.25], k = t < 1.5 ? 0 : t < 2.9 ? 1 : 2;
  const ks = [1.2, 2.5, 3.8], sp = 250;
  jalan(g, t, info, { mood: 'golden', sunY: sk[k], speed: sp, step: 1.3, expr: 'determined',
    props: (g, GY, runX) => { ks.forEach((tt, i) => tanda(g, E.W / 2 - 200 + tt * sp + 60, GY, `SESI ${i + 1}`, ease.out(prog(t, tt - 1.6, tt - 1.0)))); },
    over: (g) => { const ui = S().ui; text(g, 'HARI YANG BERBEDA', E.W / 2, 440, { size: 56, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 2.6, 3.1)) }); } });
} });
