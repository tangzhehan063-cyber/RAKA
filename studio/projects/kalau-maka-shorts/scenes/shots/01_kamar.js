// 01_kamar.js — kamar Bayu (satu lokasi kaya detail, dipakai berulang): s01 s03 s06 s11 s15 s29 s32.
import { E, V, S, mood, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, deskPos, ramalan, note } from '../sets/kamar.js';
import { shoes } from '../sets/bedroom.js';
import { BAYU } from '../cast.js';
import { rel, pop, halaman, sticky } from '../_util.js';

// Bayu berbaring di tempat tidur (kepala di bantal kiri), selimut menutup badan bawah
export function tidur(g, t, GY, M, o = {}) {
  const bx = E.W / 2 - V(700, 560), hx = bx + 230;
  const pose = breathe(POSES.lie, t, 0.4, 2);
  drawFigure(g, { x: hx, y: GY + 52, s: 1.6, facing: 1, rot: -Math.PI / 2, outfit: BAYU, pose, expr: o.expr || 'sleepy', look: [0.3, 0.3], blink: (t % 3.6) > 3.45, rim: { color: M.rim, dir: [0.6, -1], w: 4 } });
  g.fillStyle = shade(M.wall, 0.02); rr(g, hx - 40, GY - 142, 260, 62, 26); g.fill();                      // selimut
  g.fillStyle = alpha('#fff', 0.06); rr(g, hx - 30, GY - 140, 240, 12, 6); g.fill();
}
// ponsel alarm di meja kecil di samping tempat tidur
export function ponselAlarm(g, t, GY, M, o = {}) {
  const x = E.W / 2 - V(700, 560) + 500, y = GY - 64, k = o.ring ?? 1, sh = Math.sin(t * 60) * 2.2 * k;
  rr(g, x - 46, y, 92, 66, 8); g.fillStyle = shade(M.wall, -0.45); g.fill();
  g.save(); g.translate(x + sh, y - 6); g.rotate(-0.06); rr(g, -34, -10, 68, 12, 3); g.fillStyle = '#0b0d14'; g.fill();
  rr(g, -30, -9, 60, 10, 2); g.fillStyle = '#ff5a46'; g.fill(); g.restore();
  if (k > 0) { glow(g, x, y - 10, 160, '#ff5a46', 0.3 * (0.6 + 0.4 * Math.sin(t * 9))); FX.rings(g, x, y - 10, t, { count: 3, r0: 30, r1: 150, color: '#ff8a6e', a: 0.5 * k }); }
}
// duduk di meja menulis (kursi digambar); o.pen: tangan menulis
export function dudukMeja(g, t, GY, M, o = {}) {
  const [dx] = deskPos(), s = o.s ?? 2.0, x = dx - 210, hipY = GY + 8 - 71 * s;
  seg(g, [[x - 62 * s * 0.55, hipY + 8], [x - 62 * s * 0.55, hipY - 120 * s * 0.55]], 12, shade(M.wall, -0.5));
  rr(g, x - 52, hipY + 6, 118, 14, 6); g.fillStyle = shade(M.wall, -0.45); g.fill();
  seg(g, [[x - 36, hipY + 18], [x - 40, GY + 8]], 8, shade(M.wall, -0.55)); seg(g, [[x + 50, hipY + 18], [x + 54, GY + 8]], 8, shade(M.wall, -0.55));
  const wr = o.pen ? Math.sin(t * 7) * 4 : 0;
  const pose = breathe({ ...POSES.sit, head: [16, -166], eF: [30, -108], hF: [58 + wr, -100], eB: [24, -104], hB: [52, -100] }, t, 0.5, 4);
  drawFigure(g, { x, y: GY + 8, s, facing: 1, outfit: BAYU, pose, expr: o.expr || 'determined', look: [0.7, 0.6], blink: (t % 3.5) > 3.38, rim: { color: o.rim || '#ffd45a', dir: [1, 0.1], w: 4 } });
  return [x, GY - 150];
}
const lampRim = '#ffd45a';

// s01 0–2.9: wide kamar 05:10, alarm bunyi, Bayu meringkuk di tempat tidur
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.05, 1.25, k), x: -190, y: lerp(300, 330, k) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '05:10', rain: true });
  layer(g, cam, 1, (g) => { tidur(g, t, GY, M, { expr: 'sleepy' }); ponselAlarm(g, t, GY, M); });
  FX.dust(g, t, { count: 24, color: M.rim, a: 0.22 });
  UI.badge(g, { str: '05:10', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.15, 0.5)) });
} });
// s03 5.6–9.6: wajah besar, baru melek, ingat janji semalam
registerShot('s03', { draw(g, t, info) {
  const M = mood('night');
  blurLayer(g, 14, (g) => kamar(g, t, { z: 1.8, x: -120, y: 80 }, { mood: 'night', clock: '05:10', rain: true }), null, 1); veil(g, '#000', 0.55);
  const cx = E.W / 2, cy = E.H * 0.46, r = 270, z = 1 + 0.08 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, M.rim, 0.28);
  bigFace(g, cx, cy, r, { outfit: BAYU, expr: t > 1.6 ? 'worried' : 'sleepy', blink: (t % 3.3) > 3.18, look: [0.1, 0.7], rimColor: M.rim, rimSide: 1, tilt: 0.03 });
  g.restore(); FX.dust(g, t, { count: 20, color: M.rim, a: 0.25 });
} });
// s06 14.6–17.4: Minggu malam, Bayu menulis di meja (lampu hangat)
registerShot('s06', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.3, k), x: 20, y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '22:30', lamp: 1, rain: true });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M, { pen: true, rim: lampRim }));
  layer(g, cam, 1.6, (g) => { g.save(); g.globalAlpha *= 0.9; blurLayer(g, 10, (h) => { rr(h, E.W * 0.78, E.H * 0.7, 190, 150, 24); h.fillStyle = shade(M.wall, -0.5); h.fill(); }); g.restore(); });
  FX.dust(g, t, { count: 24, color: lampRim, a: 0.25 });
  UI.badge(g, { str: 'MINGGU 22.30', x: E.W - V(150, 180), y: V(110, 300), a: ease.out(prog(t, 0.15, 0.5)) });
} });
// s11 27.0–29.6: Senin pagi, tombol tunda ditekan lagi
registerShot('s11', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.25, k), x: -190, y: 300 };
  const [sx, sy] = shake(t, t > 1.0 && t < 1.4 ? 8 : 0, 12);
  const { GY, M } = kamar(g, t, { ...cam, x: cam.x + sx, y: cam.y + sy }, { mood: 'dusk', clock: '05:10' });
  layer(g, { ...cam, x: cam.x + sx, y: cam.y + sy }, 1, (g) => { tidur(g, t, GY, M, { expr: t > 1.1 ? 'sleepy' : 'worried' }); ponselAlarm(g, t, GY, M, { ring: t < 1.0 ? 1 : 0 }); });
  const a = pop(t, 1.0, 0.25); if (a > 0) { g.save(); g.translate(E.W * 0.55, E.H * 0.34); g.scale(a, a); text(g, 'TUNDA', 0, 0, { size: 120, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 4, glow: 24, glowColor: alpha(S().ui.accent, 0.5) }); g.restore(); }
  FX.dust(g, t, { count: 22, color: M.key, a: 0.25 });
  UI.badge(g, { str: 'SENIN', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) });
} });
// s15 37.2–40.7: wajah besar, suara yang sama di kepala (siluet gelap di belakang)
registerShot('s15', { draw(g, t, info) {
  const M = mood('night');
  blurLayer(g, 16, (g) => kamar(g, t, { z: 1.8, x: 60, y: 80 }, { mood: 'night', clock: '23:40', lamp: 0 }), null, 1); veil(g, '#02060a', 0.7);
  const cx = E.W / 2, cy = E.H * 0.46, r = 260, z = 1 + 0.06 * ease.inOut(t / info.dur);
  const ra = ease.out(prog(t, 0.2, 0.9)); ramalan(g, t, E.W * 0.82, E.H * 0.92, 2.6, { a: 0.85 * ra, pose: POSES.point, facing: -1, look: [-1, 0.2] });
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2, '#9fb8ff', 0.2);
  bigFace(g, cx, cy, r, { outfit: BAYU, expr: 'sad', blink: (t % 3.3) > 3.18, look: [0.5, 0.6], rimColor: '#9fb8ff', rimSide: 1, tilt: -0.03 });
  g.restore();
  [[0.5, E.W * 0.28, E.H * 0.17, 1], [1.2, E.W * 0.72, E.H * 0.11, 1], [2.0, E.W * 0.5, E.H * 0.25, 1.1]].forEach(([at, x, y, s]) => {
    const a = pop(t, at, 0.3); if (a > 0) { g.save(); g.translate(x, y); g.scale(a * s, a * s); UI.bubble(g, 0, 0, { w: 480, h: 112, color: '#f4efe6', dots: true, str: 'KURANG DISIPLIN' }); g.restore(); }
  });
  FX.dust(g, t, { count: 24, color: '#9fb8ff', a: 0.25 });
} });
// s29 95.0–98.3: Malam itu, Bayu menulis satu kalimat di kertas tempel (lampu hangat)
registerShot('s29', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.3, k), x: 20, y: 20 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '22:40', lamp: 1 });
  layer(g, cam, 1, (g) => { const [px, py] = dudukMeja(g, t, GY, M, { pen: true, rim: lampRim, expr: 'determined' }); sticky(g, px + 250, py + 6, 0.16, { rot: -0.05 }); });
  FX.dust(g, t, { count: 24, color: lampRim, a: 0.28 });
} });
// s32 104.3–106.8: sepatu ditaruh di sebelah kasur, kertas tempel menempel di dinding dekat tempat tidur
registerShot('s32', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.15, 1.3, k), x: -150, y: 40 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '22:55', lamp: 1 });
  const bx = E.W / 2 - V(700, 560);
  layer(g, cam, 1, (g) => {
    const drop = ease.outBack(prog(t, 0.5, 1.1)); shoes(g, bx + 520, GY + 18 - (1 - drop) * 70, 1.3);
    drawFigure(g, { x: bx + 650, y: GY + 8, s: 1.9, facing: -1, outfit: BAYU, pose: blendPose('crouch', 'stand', ease.inOut(prog(t, 1.2, 2.0))), expr: t > 1.2 ? 'smile' : 'determined', look: [-0.5, 0.6], blink: (t % 3.4) > 3.26, rim: { color: lampRim, dir: [-1, -0.1], w: 4 } });
  });
  layer(g, cam, 0.5, (g) => note(g, bx + 560, GY - V(560, 760), V(0.8, 0.9), { color: '#f6d54a', rot: 0.06 }));
  FX.dust(g, t, { count: 22, color: lampRim, a: 0.28 });
} });
