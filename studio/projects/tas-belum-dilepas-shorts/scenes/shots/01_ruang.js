// 01_ruang.js — "Tas Belum Dilepas": Doni di ruang tamu (pintu kiri, sofa kanan). Item maskot = tas kerja merah-oranye.
// s01-s08 (sore -> malam, duduk berjam-jam) dan s13-s18 (ritual pintu: tas digantung, sepatu dilepas) + loop.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, headPos, walkPose, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { ruang, GY, seatX, doorBox, hookPos, sepatu, tasGantung } from '../sets/ruang.js';
import { DONI, DONI_FACE, BAG } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const SCREEN = '#bfe4ff';
const hhmm = (min) => { const m = Math.round(min), h = 18 + Math.floor(m / 60); return `${h}:${String(m % 60).padStart(2, '0')}`; };
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });
const toScreen = (cam, x, y) => [(x - E.W / 2 - (cam.x || 0)) * cam.z + E.W / 2, (y - E.H / 2 - (cam.y || 0)) * cam.z + E.H / 2];
const SIT_PHONE = { ...POSES.sit, head: [9, -176], eF: [20, -112], hF: [34, -138], eB: [10, -110], hB: [30, -134] };
const WALK0 = 165, SPEED = 225;

function bag(g, f) {
  const p = f.pose, s = f.s, fc = f.facing, mid = [(p.sh[0] + p.hip[0]) / 2, (p.sh[1] + p.hip[1]) / 2];
  const bx = f.x + fc * (mid[0] - 28) * s, by = f.y + mid[1] * s - 6 * s;
  g.save(); g.translate(bx, by); g.rotate(0.06 * fc);
  rr(g, -24 * s, -44 * s, 48 * s, 90 * s, 10 * s); const gr = g.createLinearGradient(0, -44 * s, 0, 46 * s); gr.addColorStop(0, '#e8684e'); gr.addColorStop(1, '#a3321f'); g.fillStyle = gr; g.fill();
  rr(g, -18 * s, -10 * s, 36 * s, 30 * s, 6 * s); g.fillStyle = alpha('#000', 0.2); g.fill();
  seg(g, [[-24 * s, -30 * s], [24 * s, -30 * s]], 4, alpha('#ff9a7a', 0.8)); g.restore();
  return [bx, by];
}
// Doni: o { x, y, s, facing, pose, expr, look, bag, phone, phoneOn }
function doni(g, t, o = {}) {
  const f = { x: o.x ?? 800, y: o.y ?? GY() + 8, s: o.s ?? 1.5, facing: o.facing ?? -1, outfit: DONI, pose: o.pose || breathe(SIT_PHONE, t, 0.5, 2),
    expr: o.expr || 'neutral', look: o.look || [0.6, 0.8], blink: o.blink ?? ((t % 3.6) > 3.45), rim: { color: o.rim || '#ffd49a', dir: [o.facing === 1 ? 1 : -1, -0.3], w: 5 } };
  let bp = null; if (o.bag !== false) bp = bag(g, f);
  drawFigure(g, f);
  if (o.phone) {
    const p = f.pose, fc = f.facing, px = f.x + fc * p.hF[0] * f.s + fc * 6, py = f.y + p.hF[1] * f.s - 10, on = o.phoneOn ?? 1, [hx, hy, hr] = headPos(f);
    if (on > 0) { glow(g, (px + hx) / 2, (py + hy) / 2, hr * 3, SCREEN, 0.2 * on); }
    g.save(); g.translate(px, py); g.rotate(-0.35 * fc); rr(g, -14, -26, 28, 52, 6); g.fillStyle = '#0a0f12'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.75 * on + 0.1); g.lineWidth = 3; g.stroke(); g.restore();
  }
  return { f, bp };
}
const standSitPose = (t, tSit) => posesAt(t, [[0, POSES.stand], [tSit, SIT_PHONE]], 0.7);

// ---- s01 / s18: Doni datang (s18 = loop, frame terakhir == frame pertama s01) ----------------------
const arrive = (g, t, info, xFn) => {
  const cam = { z: 1.05, x: 0, y: 60 }, { GY: G } = ruang(g, t, cam, { mood: 'golden', min: 0, door: 1 });
  const x = xFn(t, info);
  layer(g, cam, 1, (g) => doni(g, t, { x, facing: 1, pose: walkPose(x / 24, { stride: 22, lean: 4 }), expr: 'sleepy', look: [0.5, 0.2], phone: false }));
  badge(g, '18:00');
};

// ---- s02: tas masih di punggung, sepatu masih nempel -> duduk ---------------------------------------

// ---- s03: duduk, buka HP -----------------------------------------------------------------------

// ---- s04: "lima menit dulu... mandi... makan" (gelembung pikiran) --------------------------------
function iconShower(g, x, y, s, a) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); seg(g, [[-24, -26], [8, -26], [24, -10]], 6, S().ink); circle(g, 26, -4, 14, S().ink);
  for (let i = -1; i <= 1; i++) seg(g, [[26 + i * 12, 16], [26 + i * 15, 34]], 4, '#4a8fd0'); g.restore(); }
function iconPlate(g, x, y, s, a) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); circle(g, 0, 4, 26, S().ink); circle(g, 0, 4, 17, '#efe8d8'); seg(g, [[-42, -18], [-42, 26]], 5, S().ink); seg(g, [[42, -18], [42, 26]], 5, S().ink); g.restore(); }

// ---- s05: jam melompat 18:30 -> 19:00, Doni tidak bergerak ----------------------------------------

// ---- s06: wajah besar, perut bunyi, capek ----------------------------------------------------------
registerShot('s06', { draw(g, t, info) {
  const cam = { z: 1.2, x: 200, y: 120 };
  blurLayer(g, 14, (g) => ruang(g, t, cam, { mood: 'night', min: 75, door: 1 }), cam, 0.5);
  veil(g, '#000', 0.5);
  const cx = E.W / 2, cy = 800, r = 270, tg = rel('bunyi', info, 1.6), tc = rel('capeknya', info, 4.4);
  glow(g, cx, cy + r * 0.9, r * 2.3, SCREEN, 0.22);
  bigFace(g, cx, cy, r, { outfit: DONI_FACE, expr: t > tc ? 'sad' : 'worried', blink: (t % 3.3) > 3.18, look: [0.1, 0.8], rimColor: SCREEN, rimSide: 1, tilt: 0.03 });
  const k = prog(t, tg, tg + 0.9), wob = Math.sin((t - tg) * 38) * 7 * (1 - k);
  if (k > 0) { g.save(); g.translate(cx + wob, 1190); g.scale(ease.outBack(clamp(k * 3)), ease.outBack(clamp(k * 3))); g.globalAlpha *= 1 - clamp((k - 0.7) / 0.3);
    text(g, 'GRUUUK...', 0, 0, { size: 110, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 24, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
  const tl = rel('lengket', info, 3.4); for (let i = 0; i < 3; i++) { const a = prog(t, tl + i * 0.25, tl + 0.6 + i * 0.25); if (a > 0 && a < 1) circle(g, cx - r * 0.78 + i * 14, cy - r * 0.4 + a * 150 + i * 30, 12 * (1 - a * 0.4), alpha('#9fd0ff', 0.8 * (1 - a))); }
  FX.dust(g, t, { count: 16, color: SCREEN, a: 0.18 });
  badge(g, '19:15');
} });

// ---- s07: suara kecil di kepala: "Dari tadi ngapain aja?" ------------------------------------------

// ---- s08: layar HP: mengetik jawaban, menghapus, scroll lagi ---------------------------------------
registerShot('s08', { draw(g, t, info) {
  g.fillStyle = '#05070c'; g.fillRect(0, 0, E.W, E.H);
  const px = 200, py = 190, pw = 680, ph = 1060;
  glow(g, E.W / 2, py + ph / 2, 700, SCREEN, 0.2);
  rr(g, px, py, pw, ph, 56); g.fillStyle = '#0b1013'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.8); g.lineWidth = 7; g.stroke();
  g.save(); rr(g, px + 14, py + 14, pw - 28, ph - 28, 44); g.clip(); g.fillStyle = '#e9eef3'; g.fillRect(px, py, pw, ph);
  const full = 'tadi cuma mau lima menit', tScr = rel('scroll', info, 3.0);
  if (t < tScr) {
    text(g, 'Catatan', E.W / 2, py + 100, { size: 40, color: '#5a6470', font: FONTS.ui, weight: 900 });
    const n = Math.floor(clamp((t - 0.25) / 1.5) * full.length) - Math.floor(clamp((t - 2.1) / 0.8) * full.length);
    const shown = full.slice(0, Math.max(0, n)); const cur = (t * 2 % 1) < 0.6 ? '|' : '';
    text(g, shown + cur, px + 50, py + 250, { size: 44, color: '#1b2430', font: FONTS.ui, weight: 800, align: 'left' });
  } else {
    const sc = (t - tScr) * 520;
    for (let i = 0; i < 6; i++) { const yy = py + 60 + ((i * 330 - sc) % 1980 + 1980) % 1980 - 330; rr(g, px + 40, yy, pw - 80, 280, 28); g.fillStyle = ['#c9d6e4', '#e2cbc0', '#cbe0d2'][i % 3]; g.fill(); circle(g, px + 90, yy + 56, 24, '#8fa0b2'); seg(g, [[px + 130, yy + 56], [px + 420, yy + 56]], 10, '#8fa0b2'); }
  }
  g.restore();
} });

// ---- s13: hening + teks diketik; jalur pintu -> sofa -----------------------------------------------
registerShot('s13', { draw(g, t, info) {
  g.fillStyle = '#05070c'; g.fillRect(0, 0, E.W, E.H);
  const L1 = 'Tubuhmu udah hafal', L2 = 'jalurnya.', n = Math.floor(clamp((t - 0.5) / 2.2) * (L1.length + L2.length)), ui = S().ui;
  const cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L1.slice(0, n) + (n <= L1.length ? cur : ''), E.W / 2, 640, { size: 72, color: ui.cream, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5) });
  text(g, n > L1.length ? L2.slice(0, n - L1.length) + cur : '', E.W / 2, 740, { size: 72, color: ui.cream, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5) });
  const k = ease.inOut(prog(t, 1.2, 3.6)), y = 1000, x0 = 220, x1 = 860;
  rr(g, x0 - 70, y - 60, 90, 130, 8); g.strokeStyle = alpha(ui.cream, 0.7); g.lineWidth = 6; g.stroke();
  rr(g, x1 - 20, y - 20, 150, 80, 22); g.stroke();
  seg(g, [[x0 + 40, y + 40], [lerp(x0 + 40, x1 - 40, k), y + 40]], 8, ui.gold); glow(g, lerp(x0 + 40, x1 - 40, k), y + 40, 90, ui.gold, 0.4);
  text(g, 'PINTU', x0 - 25, y + 120, { size: 30, color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
  text(g, 'SOFA', x1 + 55, y + 120, { size: 30, color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
} });

// ---- s14: ritual: pintu ditutup, tas digantung, sepatu dilepas, baru duduk --------------------------
const tick = (g, x, y, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); const k = ease.outBack(clamp(a)); g.translate(x, y); g.scale(k, k); circle(g, 0, 0, 34, S().ui.gold); seg(g, [[-14, 2], [-4, 13], [16, -12]], 8, '#1b1b1f'); g.restore(); };

// ---- s15: jalur lama putus, Doni bangun & pergi ke dapur -------------------------------------------

// ---- s16: mandi + makan: wajah besar rambut basah, nasi hangat ---------------------------------
registerShot('s16', { draw(g, t, info) {
  const cam = { z: 1.2, x: 200, y: 120 };
  blurLayer(g, 12, (g) => ruang(g, t, cam, { mood: 'interiorWarm', min: 48, door: 0, bagOnHook: true, shoes: true }), cam, 0.5);
  veil(g, '#2a1408', 0.35);
  const cx = E.W / 2, cy = 760, r = 260; glow(g, cx, cy + 200, r * 2.4, '#ffcf90', 0.25);
  bigFace(g, cx, cy, r, { outfit: DONI_FACE, expr: 'happy', blink: (t % 3) > 2.88, look: [0, 0.4], rimColor: '#ffcf90', rimSide: -1, tilt: -0.02 });
  for (let i = 0; i < 4; i++) { const a = prog((t + i * 0.45) % 1.8, 0, 1.8); circle(g, cx - r * 0.7 + i * r * 0.46, cy - r * 0.9 + a * r * 0.5, 9, alpha('#9fd0ff', 0.7 * (1 - a))); }
  const by = 1130; g.save(); g.translate(cx, by);
  g.beginPath(); g.ellipse(0, 0, 150, 26, 0, 0, Math.PI * 2); g.fillStyle = '#efe8d8'; g.fill();
  g.beginPath(); g.moveTo(-130, 0); g.quadraticCurveTo(0, -150, 130, 0); g.closePath(); g.fillStyle = '#f7f2e6'; g.fill();
  for (let i = 0; i < 3; i++) { const k = ((t * 0.7 + i / 3) % 1); seg(g, [[(i - 1) * 50 + Math.sin(k * 6) * 14, -100 - k * 130], [(i - 1) * 50 + Math.sin(k * 6 + 1) * 14, -150 - k * 130]], 8, alpha('#ffffff', 0.5 * (1 - k))); }
  g.restore();
  badge(g, '18:55');
} });

// ---- s17: 19:30, santai beneran: tas di gantungan, sepatu rapi, HP ---------------------------------
