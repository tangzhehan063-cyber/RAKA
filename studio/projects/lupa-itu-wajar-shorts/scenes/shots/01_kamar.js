// 01_kamar.js — "Lupa Itu Wajar": kamar belajar Nadia (meja, kursi, tumpukan buku, stabilo, lampu, jam dinding). Warna dari TOKEN gaya (mood/S()).
import { E, V, S, registerShot, layer, blurLayer, veil, mood, backdrop, ease, prog, clamp, lerp, wordTime, alpha, shade, glow, rr, seg, circle, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, posesAt, walkPose, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { NADIA, TEMAN3, STABILO } from '../cast.js';

export const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
export const rnd = (i, seed = 1) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
const GY = () => E.H * V(0.8, 0.68);
export const TYPE = { ...POSES.sit, head: [10, -178], sh: [4, -146], eF: [34, -112], hF: [66, -118], eB: [28, -110], hB: [60, -114] };
const READ = { ...POSES.sit, head: [22, -168], sh: [12, -140], eF: [36, -108], hF: [70, -112], eB: [30, -106], hB: [62, -110] };
const WRITE = { ...POSES.sit, head: [18, -172], sh: [8, -142], eF: [40, -118], hF: [74, -108], eB: [30, -106], hB: [60, -110] };
export const SLUMP = { ...POSES.sit, head: [22, -160], sh: [14, -130], eF: [30, -100], hF: [60, -96], eB: [24, -100], hB: [54, -100] };
export const hud = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });

// masuk ke kamar dengan siklus jalan lalu duduk: kembalikan {dx, pose}
export function masuk(t, dur = 1.1, fromDx = -330, sit = READ) {
  const k = ease.out(clamp(t / dur)), dx = fromDx * (1 - k), w = walkPose(t * Math.PI * 2 * 1.5, { stride: 22 });
  return { dx, pose: t < dur - 0.35 ? w : blendPose(w, sit, prog(t, dur - 0.35, dur + 0.15)) };
}
// ---- benda --------------------------------------------------------------------------------------------------
const BUKU = ['#5a7fa8', '#7a9a62', '#b0806a'];
export function buku(g, x, y, w, h, i, label, o = {}) {   // buku tertutup tampak depan (punggung + sampul), x tengah, y dasar
  const c = BUKU[i % 3]; rr(g, x - w / 2, y - h, w, h, 5); g.fillStyle = c; g.fill();
  rr(g, x - w / 2 + 5, y - h + 5, 8, h - 10, 3); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
  rr(g, x - w / 2 + 20, y - h * 0.7, w - 40, h * 0.34, 4); g.fillStyle = 'rgba(255,253,248,.9)'; g.fill();
  text(g, label, x + 4, y - h * 0.53, { size: Math.max(14, h * 0.2), color: '#2b2f3a', font: FONTS.ui, weight: 900 });
  if (o.hi) { const k = o.hi === true ? 1 : o.hi; if (k > 0) seg(g, [[x - w / 2 + 18, y - h * 0.22], [x - w / 2 + 18 + (w - 32) * k, y - h * 0.22]], 7, alpha(STABILO, 0.85)); }   // garis stabilo
}
export function stabilo(g, x, y, s = 1, rot = 0) {   // stabilo merah-oranye (maskot)
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -46, -11, 76, 22, 8); g.fillStyle = STABILO; g.fill(); rr(g, 26, -8, 22, 16, 4); g.fillStyle = shade(STABILO, 0.5); g.fill(); rr(g, -50, -9, 12, 18, 4); g.fillStyle = shade(STABILO, -0.3); g.fill();
  g.restore();
}
export function lampu(g, x, y, M, on = 1) {
  seg(g, [[x, y], [x - 8, y - 70], [x - 52, y - 108]], 6, shade(M.dark, 0.2)); rr(g, x - 70, y - 118, 56, 24, 10); g.fillStyle = shade(M.dark, 0.1); g.fill();
  if (on > 0) { FX.lightCone(g, x - 44, y - 100, { angle: Math.PI * 0.6, spread: 0.5, len: 300, color: M.practical, a: 0.18 * on }); glow(g, x - 44, y - 98, 70, M.practical, 0.5 * on); }
}

// ---- set kamar ----------------------------------------------------------------------------------------------
const CAMD = (z, fx = 520, fy = 1130, sx = 540, sy = 1100) => { const zz = 1 + (z - 1) * 0.85; return { z, x: (fx - 540 - (sx - 540) / zz) / 0.85, y: (fy - 960 - (sy - 960) / zz) / 0.85 }; };
export { CAMD };
export function kamar(g, t, cam, o = {}) {
  const md = o.mood || 'night', M = mood(md), G = GY(), CX = E.W / 2, wall = M.wall, dark = md === 'night';
  const wx = CX - 380, wy = G - 1010, ww = 470, wh = 480;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.06), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(wall, -0.25), bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); if (dark) FX.moon(g, x + w * 0.72, y + h * 0.25, 30); else FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(shade(M.sky[0], -0.15), 0.6), windowColor: alpha(M.practical, 0.35), lit: 0.1, seed: 9 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, dark ? M.rim : M.key, dark ? 0.08 : 0.2);
    const cx = CX + 250, cy = G - 640, hr = (o.hour ?? 2) % 12;   // jam dinding
    circle(g, cx, cy, 78, shade(wall, 0.4)); g.strokeStyle = shade(M.dark, 0.3); g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, 78, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.sin(a) * 64, cy - Math.cos(a) * 64], [cx + Math.sin(a) * 72, cy - Math.cos(a) * 72]], 4, shade(M.dark, 0.3)); }
    const ah = hr / 12 * Math.PI * 2; seg(g, [[cx, cy], [cx + Math.sin(ah) * 38, cy - Math.cos(ah) * 38]], 8, M.dark); seg(g, [[cx, cy], [cx, cy - 58]], 5, M.dark);
    if (o.wall) o.wall(g, G);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.06), shade(M.floor, -0.12)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, wx + ww * 0.6, G + 60, ww * 0.7, 60, dark ? M.rim : M.key, 0.18);
    const tx = CX + 90, top = G - 150, tw = 560, tc = shade(M.floor, 0.12), lc = shade(M.floor, -0.1);
    rr(g, tx - tw / 2, top, tw, 20, 8); g.fillStyle = tc; g.fill();
    seg(g, [[tx - tw / 2 + 26, top + 14], [tx - tw / 2 + 26, G]], 12, lc); seg(g, [[tx + tw / 2 - 26, top + 14], [tx + tw / 2 - 26, G]], 12, lc);
    const bx = CX - 210, ch = shade(M.dark, 0.35);
    seg(g, [[bx - 40, G - 86], [bx + 34, G - 86]], 12, ch); seg(g, [[bx - 36, G - 86], [bx - 42, G - 200]], 10, ch); seg(g, [[bx - 30, G - 80], [bx - 34, G]], 7, ch); seg(g, [[bx + 28, G - 80], [bx + 32, G]], 7, ch);
    if (o.nadia !== false) { const r = o.nadia || {}; drawFigure(g, { x: bx + (r.dx || 0), y: G, s: 1.25, facing: 1, outfit: o.outfit || NADIA, pose: r.pose || breathe(READ, t, 0.5, 3), expr: r.expr || 'neutral', look: r.look || [0.9, 0.5], blink: (t % 3.4) > 3.27, rim: { color: M.key, dir: [1, -0.2], w: 3 } }); }
    if (o.teman) { const d = o.teman; drawFigure(g, { x: d.x, y: G, s: 1.25, facing: -1, outfit: TEMAN3, pose: d.pose || breathe(POSES.stand, t, 0.5, 7), expr: d.expr || 'smile', look: [-0.9, 0], blink: (t % 3.9) > 3.8, rim: { color: M.key, dir: [-1, -0.2], w: 3 } }); }
    if (o.items) o.items(g, top, tx, M);
  });
  return { G, top: G - 150, tx: CX + 90, bx: CX - 210, M };
}
const meja3 = (o = {}) => (g, top, tx, M) => {   // tiga buku bertumpuk berjajar + stabilo + lampu
  [0, 1, 2].forEach((i) => { const k = ease.out(clamp(((o.n ?? 3) - i))); if (k > 0) buku(g, tx - 70 + i * 74, top, 64, 92 * k, i, `BAB ${i + 1}`, { hi: o.hi }); });
  stabilo(g, tx + 160, top - 12, 0.9, -0.1); if (o.lamp !== false) lampu(g, tx + 200, top, M, o.lampOn ?? 1);
};

// s01 0–2.3: Nadia berjalan masuk, duduk, belajar; jam dinding berputar 22:00 -> 02:00
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), m = masuk(t, 1.0, -340, READ), hr = lerp(22, 26, ease.inOut(prog(t, 0.6, info.dur)));
  kamar(g, t, CAMD(lerp(1.4, 1.75, k), 520 + 30 * k), { mood: 'night', hour: hr, items: (g, top, tx, M) => { meja3({ n: 3 })(g, top, tx, M);
      for (let i = 0; i < 5; i++) { const u = (t * 0.9 + i * 0.37) % 1; if (t > 1.0) { g.save(); g.globalAlpha *= (1 - u) * 0.8; g.translate(tx - 120 + i * 60, top - 70 - u * 130); g.rotate(u * 3 + i); rr(g, -14, -10, 28, 20, 3); g.fillStyle = '#fffdf8'; g.fill(); g.restore(); } } },
    nadia: { dx: m.dx, pose: t < 1.1 ? m.pose : posesAt(t, [[1.1, READ], [1.7, WRITE]], 0.4), expr: t < 1 ? 'neutral' : 'determined' } });
  FX.dust(g, t, { count: 12, color: '#fff2d0', a: 0.1 }); hud(g, `${String(Math.floor(hr) % 24).padStart(2, '0')}:00`, ease.out(prog(t, 0.3, 0.7)));
} });
// s02 2.3–3.9: tiga bab sekaligus: stabilo menandai buku satu per satu
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  kamar(g, t, CAMD(lerp(1.9, 2.15, k), 540, 1130, 540, 1060), { mood: 'night', hour: 2, items: (g, top, tx, M) => { [0, 1, 2].forEach((i) => { const a = ease.outBack(prog(t, 0.0 + i * 0.1, 0.25 + i * 0.1)); g.save(); g.translate(tx - 70 + i * 74, top); g.scale(1, a || 0.01); buku(g, 0, 0, 64, 92, i, `BAB ${i + 1}`, { hi: ease.out(prog(t, 0.1 + i * 0.35, 0.45 + i * 0.35)) }); g.restore(); });
      const sx = tx - 70 + Math.min(2, Math.floor(t / 0.35)) * 74 + 10, sy = top - 22; stabilo(g, sx + 40, sy - 6 + Math.sin(t * 18) * 3, 0.9, -0.5); lampu(g, tx + 200, top, M, 1); },
    nadia: { pose: { ...WRITE, hF: [74 + Math.sin(t * 9) * 8, -108 + Math.cos(t * 9) * 4] }, expr: 'determined' } });
  hud(g, '3 BAB', ease.out(prog(t, 0.6, 1.0)));
} });
// s18 64.2–67.0 & s19 67.0–69.63: kamar sebelah (loop)
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), m = masuk(t, 1.2, -340, READ), hr = lerp(1.5, 2, ease.inOut(prog(t, 0.6, info.dur)));
  kamar(g, t, CAMD(lerp(1.4, 1.75, k), 520 + 30 * k), { outfit: TEMAN3, mood: 'night', hour: 2, items: meja3({ n: 3 }),
    nadia: { dx: m.dx, pose: t < 1.3 ? m.pose : posesAt(t, [[1.3, READ], [2.0, WRITE]], 0.4), expr: t < 1.2 ? 'neutral' : 'determined' } });
  FX.dust(g, t, { count: 10, color: '#fff2d0', a: 0.1 });
} });
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tj = rel('Jam', info, 0.1);
  kamar(g, t, CAMD(lerp(1.7, 1.9, k)), { outfit: TEMAN3, mood: 'night', hour: 2, items: meja3({ n: 3 }), nadia: { pose: WRITE, expr: 'determined' } });
  hud(g, '02:00', ease.out(prog(t, tj, tj + 0.4)));
} });

