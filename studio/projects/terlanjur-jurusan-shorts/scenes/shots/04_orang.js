// 04_orang.js — adegan orang: s18 s19 s20 s21 s22 s26 s39 s41.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { ruang, ruangDepan } from '../sets/ruang.js';
import { DIMAS, TEMAN2, DOSEN, BAPAK } from '../cast.js';
import { rel, pop, bub } from '../_util.js';
const fig = (g, t, GY, M, x, o, face = 1, seed = 0) => drawFigure(g, { x, y: GY + 8, s: o.s ?? 1.85, facing: face, outfit: o.outfit, pose: o.pose ? o.pose : breathe(POSES.stand, t, 0.5, seed), expr: o.expr || 'neutral', look: o.look || [face, 0], blink: ((t + seed) % 3.4) > 3.26, rim: { color: M.rim, dir: [-face, -0.2], w: 4 } });
// s18 47.7–49.33: kantin, teman ketawa
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.25, k), x: 0, y: 20 }; const { GY, M } = ruang(g, t, cam, { kind: 'kantin', mood: 'dusk' });
  layer(g, cam, 1, (g) => { fig(g, t, GY, M, E.W / 2 - 220, { outfit: DIMAS, expr: 'worried' }, 1, 1); fig(g, t, GY, M, E.W / 2 + 230, { outfit: TEMAN2, expr: 'joy', pose: breathe(POSES.cheer, t * 3, 0.5, 2) }, -1, 2); });
  ruangDepan(g, cam, { kind: 'kantin', mood: 'dusk' }); FX.dust(g, t, { count: 18, color: M.practical, a: 0.2 });
} });
// s19 49.33–53.0: OTS Dimas, gelembung teman
registerShot('s19', { draw(g, t, info) {
  const M = ruang(g, t, { z: 1.6, x: 60, y: 60 }, { kind: 'kantin', mood: 'dusk' }).M; veil(g, '#000', 0.4);
  const cx = E.W / 2 - 60, cy = E.H * 0.55, r = 270, z = 1 + 0.07 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  bigFace(g, cx, cy, r, { outfit: DIMAS, expr: t > 1.4 ? 'sad' : 'surprised', blink: (t % 3.3) > 3.18, look: [0.8, -0.3], rimColor: M.rim, rimSide: 1, tilt: -0.04 }); g.restore();
  const a = pop(t, 0.3, 0.35); if (a > 0) { g.save(); g.translate(E.W / 2 + 90, 470); g.scale(a, a); bub(g, 0, 0, 760, 230, '#5f86b5', 'Pindah?\nDua tahun kemarin ngapain aja?', 1, 52); g.restore(); }
} });
// s20 53.0–57.6: ruang dosen, dosen bicara sopan
registerShot('s20', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.25, k), x: 0, y: 20 }; const { GY, M } = ruang(g, t, cam, { kind: 'dosen', mood: 'dusk' });
  layer(g, cam, 1, (g) => { fig(g, t, GY, M, E.W / 2 - 250, { outfit: DIMAS, expr: 'sad', s: 1.8 }, 1, 1); fig(g, t, GY, M, E.W / 2 + 200, { outfit: DOSEN, expr: 'smile', pose: breathe(POSES.explain, t, 0.6, 3), s: 1.85 }, -1, 3); });
  ruangDepan(g, cam, { kind: 'dosen', mood: 'dusk' });
  const a = pop(t, 0.6, 0.35); if (a > 0) { g.save(); g.translate(E.W / 2 + 130, 540); g.scale(a, a); bub(g, 0, 0, 600, 190, '#6a6f7a', 'Dipikirkan dulu\nbaik-baik ya, Dimas', 1, 44); g.restore(); }
  FX.dust(g, t, { count: 16, color: M.practical, a: 0.2 });
} });
// s21 57.6–60.2: meja makan malam, bapak
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.15, 1.3, k), x: 0, y: 20 }; const { GY, M } = ruang(g, t, cam, { kind: 'makan', mood: 'night' });
  layer(g, cam, 1, (g) => { fig(g, t, GY, M, E.W / 2 - 230, { outfit: DIMAS, expr: 'sad', pose: breathe(POSES.stand, t, 0.5, 1) }, 1, 1); fig(g, t, GY, M, E.W / 2 + 230, { outfit: BAPAK, expr: 'neutral', pose: breathe(POSES.talk, t, 0.5, 4) }, -1, 4); });
  ruangDepan(g, cam, { kind: 'makan', mood: 'night' }); FX.dust(g, t, { count: 16, color: M.practical, a: 0.2 });
} });
// s22 60.2–62.5: wajah bapak + pertanyaan
registerShot('s22', { draw(g, t, info) {
  const M = ruang(g, t, { z: 1.6, x: 60, y: 60 }, { kind: 'makan', mood: 'night' }).M; veil(g, '#000', 0.45);
  const cx = E.W / 2, cy = E.H * 0.5, r = 270, z = 1 + 0.07 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  bigFace(g, cx, cy, r, { outfit: BAPAK, expr: 'confused', blink: (t % 3.3) > 3.18, look: [0, 0.4], rimColor: M.rim, rimSide: -1, tilt: 0.03 }); g.restore();
  const a = pop(t, 0.2, 0.35); if (a > 0) { g.save(); g.translate(E.W / 2, 440); g.scale(a, a); bub(g, 0, 0, 800, 200, '#7a8a4f', 'Jadi selama ini\nnggak serius?', 1, 54); g.restore(); }
} });
// s26 72.0–75.5: teater kampus, loket tiket
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.0, 1.2, k), x: 0, y: 30 }; const { GY, M } = ruang(g, t, cam, { kind: 'teater', mood: 'night' });
  layer(g, cam, 1, (g) => {
    rr(g, E.W / 2 + 120, GY - 330, 330, 340, 14); g.fillStyle = shade(M.wall, -0.5); g.fill(); rr(g, E.W / 2 + 150, GY - 290, 270, 140, 8); g.fillStyle = shade(M.practical, -0.2); g.fill(); text(g, 'TIKET', E.W / 2 + 285, GY - 220, { size: 52, color: '#1a1a1a', font: FONTS.ui, weight: 900, spacing: 4 });
    [-340, -190, -60].forEach((dx, i) => { const a = ease.out(prog(t, 0.3 + i * 0.5, 0.8 + i * 0.5)); g.save(); g.globalAlpha *= a; drawFigure(g, { x: E.W / 2 + dx, y: GY + 8, s: 1.6, facing: 1, ink: '#0a1018', inkFar: '#05080c', outfit: { top: 'none', head: 'none' }, pose: breathe(POSES.stand, t, 0.5, i), expr: 'neutral', rim: { color: M.rim, dir: [1, -0.2], w: 3 }, shadow: false }); g.restore(); });
  });
  UI.badge(g, { str: '1982', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) }); FX.dust(g, t, { count: 22, color: M.practical, a: 0.22 });
} });
// s39 128.82–132.2: kelas jurusan lain, Dimas di belakang (pendengar)
registerShot('s39', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.0, 1.15, k), x: 0, y: 0 }; const { GY, M } = ruang(g, t, cam, { kind: 'kelas', mood: 'dusk' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + 270, y: GY - 80, s: 1.55, facing: -1, outfit: DOSEN, pose: breathe(POSES.explain, t, 0.6, 3), expr: 'smile', rim: { color: M.rim, dir: [-1, -0.2], w: 4 } });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const x = E.W / 2 - 420 + c * 280 + r * 70, y = GY + 90 + r * 120, me = r === 1 && c === 2; circle(g, x, y - 120, 36, me ? '#f0d2b6' : shade(M.dark, 0.35)); rr(g, x - 66, y - 82, 132, 112, 40); g.fillStyle = me ? '#d64a33' : shade(M.dark, 0.2 + (c % 2) * 0.1); g.fill(); }
  });
  UI.badge(g, { str: '2 JAM', x: E.W - V(110, 130), y: V(110, 300), a: ease.out(prog(t, 0.4, 0.8)) }); FX.dust(g, t, { count: 20, color: M.practical, a: 0.2 });
} });
// s41 135.97–138.5: ruang dosen, tabel diserahkan
registerShot('s41', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.25, k), x: 0, y: 20 }; const { GY, M } = ruang(g, t, cam, { kind: 'dosen', mood: 'dusk' });
  layer(g, cam, 1, (g) => { fig(g, t, GY, M, E.W / 2 - 250 + 70 * ease.out(prog(t, 0, 0.8)), { outfit: DIMAS, expr: 'determined', pose: POSES.reach, s: 1.8 }, 1, 1); fig(g, t, GY, M, E.W / 2 + 200, { outfit: DOSEN, expr: 'smile', pose: breathe(POSES.stand, t, 0.6, 3), s: 1.85 }, -1, 3); const p = ease.out(prog(t, 0.2, 1.0)); g.save(); g.translate(lerp(E.W / 2 - 100, E.W / 2 + 40, p), GY - 330); g.rotate(-0.08); rr(g, -50, -64, 100, 128, 6); g.fillStyle = '#efe6cf'; g.fill(); seg(g, [[0, -64], [0, 64]], 3, '#2a2f3a'); g.restore(); });
  ruangDepan(g, cam, { kind: 'dosen', mood: 'dusk' }); FX.dust(g, t, { count: 16, color: M.practical, a: 0.2 });
} });
