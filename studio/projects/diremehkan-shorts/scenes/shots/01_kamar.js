// 01_kamar.js — kamar kerja malam Rizal: s01 (bigFace HP), s02 (wide), s04 (tujuh malam sama), s06 (tutup laptop), s07 (pesanan nol), s21 (HP telungkup), s22 (loop, laptop menghadap penonton).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, deskPos } from '../sets/kamar.js';
import { RIZAL, HINA } from '../cast.js';
import { rel, pop } from '../_util.js';
const SCR = '#bfe4ff';

// Rizal duduk di meja (menghadap kanan ke laptop). lap = 0..1 laptop terbuka
function dudukMeja(g, t, GY, M, o = {}) {
  const [dx] = deskPos(), x = dx - 30, s = o.s ?? 1.35;
  const pose = breathe({ ...POSES.sit, head: [14, -170], eF: [30, -108], hF: [58, -112], eB: [24, -104], hB: [52, -108] }, t, 0.5, 4);
  drawFigure(g, { x, y: GY + 8, s, facing: 1, outfit: RIZAL, pose, expr: o.expr || 'neutral', look: o.look || [0.7, 0.5], blink: (t % 3.5) > 3.38, rim: { color: o.rim || SCR, dir: [1, 0.1], w: 4 } });
  return [x, GY - 150];
}
function layar(g, x, y, open, col, str) {   // layar laptop menghadap penonton (loop): rect + tulisan
  const w = 300, h = 190 * open; rr(g, x - w / 2, y - h, w, h, 10); g.fillStyle = '#10161a'; g.fill();
  if (open > 0.5) { rr(g, x - w / 2 + 12, y - h + 12, w - 24, h - 24, 6); g.fillStyle = col; g.fill(); text(g, str, x, y - h / 2, { size: 30, color: '#0a0f12', font: FONTS.ui, weight: 900 }); }
  rr(g, x - w / 2 - 20, y, w + 40, 14, 6); g.fillStyle = '#1a2226'; g.fill();
}

// s01 0–2.5: wajah besar diterangi layar HP (loop = penutup yang sama)
registerShot('s01', { draw(g, t, info) {
  const cam = { z: 1.8, x: 60, y: 60 };
  blurLayer(g, 14, (g) => kamar(g, t, cam, { mood: 'night', clock: '23:00' }), null, 1); veil(g, '#000', 0.55);
  const cx = E.W / 2, cy = E.H * 0.46, r = 260, z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, SCR, 0.28);
  bigFace(g, cx, cy, r, { outfit: RIZAL, expr: 'neutral', blink: (t % 3.3) > 3.18, look: [0.1, 0.8], rimColor: SCR, rimSide: 1, tilt: 0.03 });
  g.restore(); FX.dust(g, t, { count: 22, color: SCR, a: 0.25 });
} });
// s02 2.5–4.2: wide, 23.00
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.3, k), x: V(-40, -40), y: 30 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:00', lamp: 1 });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M));
  FX.dust(g, t, { count: 26, color: SCR, a: 0.22 });
  UI.badge(g, { str: '23.00', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) });
} });
// s04 8.5–10.0: tujuh malam, tangkapan layar yang sama
registerShot('s04', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'].forEach((d, i) => {
    const k = pop(t, 0.05 + i * 0.14, 0.25); if (k <= 0) return; const x = 150 + (i % 4) * 215, y = 560 + Math.floor(i / 4) * 330;
    g.save(); g.translate(x + 90, y); g.scale(k, k); rr(g, -90, -125, 180, 250, 16); g.fillStyle = '#0f1722'; g.fill(); g.strokeStyle = alpha(ui.cream, 0.6); g.lineWidth = 4; g.stroke();
    rr(g, -66, -60, 132, 56, 14); g.fillStyle = HINA; g.fill(); text(g, 'GA SANGGUP', 0, -32, { size: 17, color: '#fff', font: FONTS.ui, weight: 900 }); text(g, d, 0, 90, { size: 30, color: ui.gold, font: FONTS.ui, weight: 900 }); g.restore();
  });
} });
// s06 12.5–15.0: laptop ditutup, lampu padam
registerShot('s06', { draw(g, t, info) {
  const lampOff = ease.inOut(prog(t, 1.2, 1.9)), cam = { z: lerp(1.25, 1.1, ease.inOut(t / info.dur)), x: V(-40, -40), y: 30 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:40', lamp: 1 - lampOff, dim: 0.25 * lampOff });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M, { expr: t > 1.2 ? 'sleepy' : 'sad', rim: lampOff > 0.5 ? M.rim : SCR }));
  if (lampOff > 0.3) veil(g, '#000', 0.3 * lampOff);
} });
// s07 15.0–18.4: pagi, meja yang sama, pesanan nol
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.1, 1.25, k), x: V(-40, -40), y: 30 };
  const { GY, M } = kamar(g, t, cam, { mood: 'dusk', clock: '09:00', lamp: 0 });
  layer(g, cam, 1, (g) => dudukMeja(g, t, GY, M, { expr: 'sad', rim: M.rim }));
  const a = ease.out(prog(t, 0.6, 1.0)); UI.readout(g, { label: 'PESANAN', value: '0', x: E.W / 2, y: V(380, 330), align: 'center', a });
  FX.dust(g, t, { count: 20, color: '#ffe9c0', a: 0.2 });
} });
// s21 69.3–72.3: malam ini, HP telungkup
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.3, 1.1, k), x: V(-40, -40), y: 30 };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:00', lamp: 1 });
  layer(g, cam, 1, (g) => { const [x, y] = dudukMeja(g, t, GY, M, { expr: 'determined', rim: '#ffd45a' }); const p = ease.out(prog(t, 0.2, 0.9)); g.save(); g.translate(x - 160, y - 8 - (1 - p) * 40); g.rotate(0.05); rr(g, -22, -5, 44, 9, 3); g.fillStyle = '#0a0f12'; g.fill(); g.restore(); });
  FX.dust(g, t, { count: 22, color: '#ffd45a', a: 0.2 });
} });
// s22 72.3–74.24: loop — laptop menghadap penonton, kerjaannya terbuka
registerShot('s22', { draw(g, t, info) {
  const cam = { z: 1.5, x: V(-60, -60), y: 90 }, op = ease.out(prog(t, 0.1, 0.8));
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '23:00', lamp: 1 });
  layer(g, cam, 1, (g) => { const [dx] = deskPos(); layar(g, dx, GY - 154, op, '#cfeaff', 'PESANAN #1'); glow(g, dx, GY - 280, 320, '#cfeaff', 0.22 * op); });
  FX.dust(g, t, { count: 26, color: '#cfeaff', a: 0.25 });
} });
