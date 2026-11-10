// 01_kamar.js — "Nunggu 1 Januari": the countdown wall calendar (52), the red marker (mascot item),
// the failed swipe, the torn page, the whisper, the signature "52 pages turn to dust", HARI 1, loop.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom } from '../sets/bedroom.js';
import { KAMU, KAMU_FACE, LAMA } from '../cast.js';
import { marker, countCal } from '../sets/kalender.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const RED = '#d64a33', PAGE = '#17201f', PAPER = '#ece5d8', INK = '#1a1622';
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });

// --- the hook frame (frame 0 and the loop): bedroom at night, giant countdown, tiny hero looking up -----
function hook(g, t, z = 1, o = {}) {
  const cam = { z: 1.1 };
  blurLayer(g, 10, (g) => bedroom(g, t, cam, { mood: 'night', day: 52 }), cam, 0.6);
  veil(g, '#000', 0.5);
  g.save(); g.translate(E.W / 2, E.H * 0.45); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.45);
  countCal(g, E.W / 2, 400, { num: o.num ?? 52, glow: 1, pop: o.pop ?? 1, h: 680, w: 600 });
  const GY = 1255;
  glow(g, 330, GY - 120, 260, S().ui.gold, 0.12);
  drawFigure(g, { x: 330, y: GY, s: 1.05, facing: 1, outfit: KAMU, pose: breathe(POSES.relaxed, t, 0.5, 1), expr: 'neutral', look: [0.5, -1], blink: (t % 3.4) > 3.27, rim: { color: S().ui.gold, dir: [1, -1] } });
  // the marker, capped, sticking out of the hero's back pocket hand
  marker(g, 330 + 22, GY - 108, 1.9, 0.42, false);
  g.restore();
}

registerShot('s01', { draw(g, t, info) {
  hook(g, t, 1 + 0.05 * ease.inOut(t / info.dur));
  badge(g, '52 HARI');
} });

// s02 — "mulai tanggal satu": a January grid, the red marker circles the 1
function janPage(g, cx, top, w, h) {
  rr(g, cx - w / 2, top, w, h, 26); g.fillStyle = PAPER; g.fill();
  g.save(); rr(g, cx - w / 2, top, w, h, 26); g.clip(); g.fillStyle = '#c4473a'; g.fillRect(cx - w / 2, top, w, h * 0.16); g.restore();
  text(g, 'JANUARI 2027', cx, top + h * 0.085, { size: 54, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 });
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'], cw = (w - 60) / 7, x0 = cx - w / 2 + 30 + cw / 2, y0 = top + h * 0.25;
  days.forEach((d, i) => text(g, d, x0 + i * cw, y0, { size: 34, color: alpha(INK, 0.55), font: FONTS.ui, weight: 900 }));
  const cells = {};
  for (let d = 1; d <= 31; d++) { const k = d + 3, c = k % 7, r = Math.floor(k / 7); const x = x0 + c * cw, y = y0 + 90 + r * 92;
    cells[d] = [x, y]; text(g, String(d), x, y, { size: d === 1 ? 58 : 40, color: d === 1 ? INK : alpha(INK, 0.6), font: FONTS.ui, weight: 900 }); }
  return cells;
}
registerShot('s02', { draw(g, t, info) {
  const cam = { z: 1.1 };
  blurLayer(g, 10, (g) => bedroom(g, t, cam, { mood: 'night', day: 52 }), cam, 0.6);
  veil(g, '#000', 0.5);
  const z = 1.0 + 0.25 * ease.inOut(prog(t, 1.6, 3.2));
  g.save();
  g.translate(E.W / 2, 520); g.scale(z, z); g.translate(-E.W / 2, -520);
  const c = janPage(g, E.W / 2, 220, 700, 840);
  const [x1, y1] = c[1], t0 = rel('mulai', info, 2.06), k = ease.inOut(prog(t, t0, t0 + 1.0));
  if (k > 0) { g.save(); g.strokeStyle = RED; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath();
    const a0 = -2.2, a1 = a0 + Math.PI * 2.15 * k; for (let a = a0; a <= a1; a += 0.05) { const rr2 = 62 + 5 * Math.sin(a * 3); const px = x1 + rr2 * Math.cos(a), py = y1 - 6 + rr2 * 0.86 * Math.sin(a); a === a0 ? g.moveTo(px, py) : g.lineTo(px, py); }
    g.stroke(); g.restore();
    const a = a0 + Math.PI * 2.15 * k; marker(g, x1 + 62 * Math.cos(a), y1 - 6 + 53 * Math.sin(a), -0.7, 0.9); }
  else marker(g, x1 + 170, y1 + 160 - 60 * ease.out(prog(t, 0.3, t0)), -0.7, 0.9);
  g.restore();
  const t1 = rel('satu', info, 2.98);
  badge(g, '1 JAN', ease.out(prog(t, t1, t1 + 0.25)));
} });

// s04 — FAILED SWIPE: "MULAI SEKARANG" card is pulled up and bounces back down. "Tapi... nanti. Bukan sekarang."
function lier(g, t, GY, M, o = {}) {
  const f = { x: 200, y: GY + 40, s: 1.25, rot: -Math.PI / 2, facing: 1, outfit: KAMU, pose: breathe(POSES.lie, t, 0.4, 3), expr: o.expr || 'smile', blink: o.blink ?? ((t % 3) > 2.85), look: [0.6, -0.6], rim: { color: o.rimC || M.rim, dir: [0.2, -1] }, shadow: false };
  drawFigure(g, f);
  const [hx, hy, hr] = headPos(f);
  if (o.phone !== false) { const px = hx + hr * 2.0, py = hy - hr * 2.2; glow(g, px, py + 30, hr * 3.5, '#bfe4ff', 0.2);
    g.save(); g.translate(px, py); g.rotate(0.3); rr(g, -18, -32, 36, 64, 7); g.fillStyle = '#0a0f12'; g.fill(); g.strokeStyle = alpha('#bfe4ff', 0.8); g.lineWidth = 3; g.stroke(); g.restore(); }
  return [hx, hy, hr];
}
registerShot('s04', { draw(g, t, info) {
  const cam = { z: 1.15, x: V(-160, -160), y: V(40, 20) };
  const { GY, M } = bedroom(g, t, cam, { mood: 'night', day: 52 });
  layer(g, cam, 1, (g) => { lier(g, t, GY, M); marker(g, E.W / 2 + 40, GY + 60, 0.15, 0.7, false); });
  FX.dust(g, t, { count: 20, color: '#bfe4ff', a: 0.2 });
  // the failed swipe card
  const k = t / 1.3; if (k < 1) {
    const up = k < 0.35 ? ease.out(k / 0.35) : Math.exp(-(k - 0.35) * 6) * Math.cos((k - 0.35) * 16);
    const y = E.H * (0.98 - 0.62 * up);
    g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40;
    rr(g, 70, y, E.W - 140, 900, 50); g.fillStyle = '#0d221a'; g.fill(); g.restore();
    rr(g, 70, y, E.W - 140, 900, 50); g.strokeStyle = alpha('#7dffb0', 0.4); g.lineWidth = 4; g.stroke();
    text(g, 'MULAI', E.W / 2, y + 150, { size: 70, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
    text(g, 'SEKARANG', E.W / 2, y + 260, { size: 110, color: S().ui.gold, font: FONTS.ui, weight: 900 });
    const tx = E.W * 0.7, ty = y + 420; seg(g, [[tx + 80, ty + 320], [tx + 20, ty + 60], [tx, ty]], 22, S().ink); circle(g, tx, ty, 20, S().ink);
  }
  const tn = rel('nanti', info, 1.22);
  if (t > tn) { const a = ease.outBack(prog(t, tn, tn + 0.3)); g.save(); g.translate(E.W / 2, 560); g.scale(a, a); g.rotate(-0.06);
    text(g, 'NANTI AJA', 0, 0, { size: 120, color: S().ui.accent, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(S().ui.accent, 0.5) }); g.restore(); }
} });

// s08 — "Tanggal baru terasa seperti halaman kosong. Diri yang lama… tertinggal di halaman sebelumnya."
registerShot('s08', { draw(g, t, info) {
  const cam = { z: 1.1 };
  blurLayer(g, 10, (g) => bedroom(g, t, cam, { mood: 'dusk', day: 1 }), cam, 0.6);
  veil(g, '#000', 0.45);
  const ui = S().ui, cx = E.W / 2, top = 230, w = 640, h = 740;
  const tt = rel('halaman', info, 1.6), k = prog(t, tt - 0.1, tt + 2.6);
  // the blank page underneath (new)
  glow(g, cx, top + h / 2, w, '#fff6dc', 0.25 * ease.out(prog(t, tt, tt + 0.8)));
  rr(g, cx - w / 2, top, w, h, 26); g.fillStyle = '#f4efe4'; g.fill();
  g.save(); rr(g, cx - w / 2, top, w, h, 26); g.clip(); g.fillStyle = '#c4473a'; g.fillRect(cx - w / 2, top, w, h * 0.17); g.restore();
  text(g, 'HALAMAN BARU', cx, top + h * 0.09, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 });
  // the old page tears off and falls, carrying the grey old self
  const fy = top + 1400 * ease.in(k), rot = 0.5 * ease.in(k) - 0.12 * Math.sin(Math.min(1, k * 3) * Math.PI);
  if (k < 1) { g.save(); g.translate(cx, fy + h / 2); g.rotate(rot); g.translate(-cx, -(fy + h / 2));
    countCal(g, cx, fy, { num: 52, header: 'TAHUN LAMA' });
    const tl = rel('lama', info, 2.9);
    drawFigure(g, { x: cx, y: fy + h - 110, s: 0.9, facing: -1, outfit: LAMA, pose: POSES.sad, expr: 'sad', alpha: 0.85, look: [-0.3, 0.4] });
    text(g, 'DIRI LAMA', cx, fy + h - 40, { size: 40, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, tl - 0.2, tl + 0.2)) });
    g.restore(); }
  if (t > tt && t < tt + 0.12) veil(g, '#fff', 0.35 * (1 - (t - tt) / 0.12), 'lighter');
  // the hero, watching the page fall
  drawFigure(g, { x: 300, y: 1260, s: 1.05, facing: 1, outfit: KAMU, pose: breathe(POSES.stand, t, 0.6, 2), expr: k > 0.2 ? 'awe' : 'neutral', look: [0.5, -0.8], blink: false, rim: { color: '#fff6dc', dir: [1, -1] } });
} });

// s11 — giant face, whispering, relaxed smile: "Toh sebentar lagi mulai dari nol."
registerShot('s11', { draw(g, t, info) {
  g.fillStyle = '#07090b'; g.fillRect(0, 0, E.W, E.H);
  const z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.45, r = 330;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  glow(g, cx, cy + r, r * 2.4, '#bfe4ff', 0.22);
  bigFace(g, cx, cy, r, { outfit: KAMU_FACE, expr: 'smirk', blink: (t % 2.2) > 2.05, look: [0.3, 0.5], rimColor: '#bfe4ff', rimSide: 1, tilt: 0.05 });
  g.restore();
  // a tiny "0" floating like a thought
  const a = ease.out(prog(t, 1.3, 1.8)); text(g, '0', cx + 300, 330 - 30 * t, { size: 120, color: alpha(S().ui.gold, 0.7 * a), font: FONTS.ui, weight: 900 });
  FX.dust(g, t, { count: 18, color: '#bfe4ff', a: 0.2 });
} });

// s12 — SIGNATURE: 52 pages fly off the countdown one by one and burst into dust; the hero scrolls on the bed.
registerShot('s12', { draw(g, t, info) {
  const cam = { z: 1.15, x: V(-160, -160), y: V(40, 20) };
  const tf = rel('sadar', info, 3.3), frozen = t >= tf;
  const tt = frozen ? tf : t;
  const { GY, M } = bedroom(g, tt, cam, { mood: 'night', day: 52, dim: 0.25 });
  layer(g, cam, 1, (g) => lier(g, tt, GY, M, { expr: 'smile' }));
  const t0 = 0.3, t1 = rel('buang', info, 2.32), n = Math.round(52 * clamp((tt - t0) / (t1 - t0)));
  const cx = E.W / 2 + 120, top = 400, w = 420, h = 480;
  countCal(g, cx, top, { num: Math.max(0, 52 - n), w, h, header: 'MENUJU 1 JAN' });
  // flying pages + dust
  for (let i = 0; i < n; i++) { const ti = t0 + (t1 - t0) * i / 52, a = tt - ti; if (a > 1.4) continue;
    const dx = Math.sin(i * 12.9898) * 260, k = clamp(a / 1.4), px = cx + dx * k - 100 * k, py = top + h / 2 + 600 * k * k - 200 * k;
    if (k < 0.45) { g.save(); g.translate(px, py); g.rotate((i % 2 ? 1 : -1) * k * 3); g.globalAlpha = 1 - k / 0.45 * 0.3;
      rr(g, -w * 0.2, -h * 0.2, w * 0.4, h * 0.4, 10); g.fillStyle = PAGE; g.fill(); g.strokeStyle = alpha(S().ui.gold, 0.5); g.lineWidth = 2; g.stroke(); g.restore(); }
    else for (let j = 0; j < 7; j++) { const q = (k - 0.45) / 0.55; circle(g, px + Math.sin(i * 7 + j * 3.1) * 90 * q, py + Math.cos(i * 3 + j * 1.7) * 60 * q - 40 * q, 4 * (1 - q) + 1, alpha(S().ui.gold, 0.7 * (1 - q))); }
  }
  if (frozen) { veil(g, '#4a90ff', 0.16, 'color'); veil(g, '#000', 0.2);
    const a = ease.outBack(prog(t, tf - 0.05, tf + 0.25)); g.save(); g.translate(E.W / 2, 900); g.scale(a, a);
    text(g, 'DENGAN SADAR', 0, 0, { size: 96, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 24, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
} });

// s16 — close-up: the marker writes HARI 1 on today's date
registerShot('s16', { draw(g, t, info) {
  g.fillStyle = '#0b0f10'; g.fillRect(0, 0, E.W, E.H);
  const ui = S().ui, cx = E.W / 2, top = 200, w = 800, h = 1020;
  glow(g, cx, top + h / 2, w, '#fff6dc', 0.2);
  rr(g, cx - w / 2, top, w, h, 30); g.fillStyle = PAPER; g.fill();
  g.save(); rr(g, cx - w / 2, top, w, h, 30); g.clip(); g.fillStyle = '#c4473a'; g.fillRect(cx - w / 2, top, w, h * 0.15); g.restore();
  text(g, 'NOVEMBER', cx, top + h * 0.075, { size: 60, color: '#fff', font: FONTS.ui, weight: 900, spacing: 8 });
  text(g, '10', cx, top + h * 0.36, { size: 300, color: INK, font: FONTS.ui, weight: 900 });
  text(g, 'HARI INI', cx, top + h * 0.56, { size: 50, color: alpha(INK, 0.6), font: FONTS.ui, weight: 900, spacing: 8 });
  // circle around "10" (already drawn) + writing HARI 1 with a reveal
  g.save(); g.strokeStyle = RED; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.ellipse(cx, top + h * 0.34, 220, 150, -0.1, 0, Math.PI * 2); g.stroke(); g.restore();
  const k = ease.inOut(prog(t, 0.1, 1.2)), wx = cx - 300, ww = 600, yy = top + h * 0.78;
  g.save(); g.beginPath(); g.rect(wx, yy - 140, ww * k, 260); g.clip();
  text(g, 'HARI 1', cx, yy, { size: 190, color: RED, font: FONTS.ui, weight: 900 });
  g.restore();
  if (k < 1) marker(g, wx + ww * k, yy + 20 + 30 * Math.sin(t * 40), -0.7, 1.1);
  else marker(g, wx + ww + 40, yy + 120, -0.5, 1.1, false);
  const ts = 1.3; if (t > ts) glow(g, cx, yy, 420, ui.gold, 0.25 * ease.out(prog(t, ts, ts + 0.4)));
  badge(g, 'HARI 1', ease.out(prog(t, 1.2, 1.5)));
} });

// s17 — morning: the room is bright, the wall calendar says HARI 1, the hero ties the running shoes
registerShot('s17', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.08 * ease.inOut(t / info.dur), x: V(80, 80), y: V(0, 0) };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'dusk', day: 1, calGlow: 1 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX + 60, y: GY + 20, s: 1.35, facing: 1, outfit: KAMU, pose: breathe(POSES.ready, t, 0.8, 5), expr: 'determined', look: [0.6, 0], blink: (t % 3) > 2.85, rim: { color: M.key, dir: [-1, -0.4] } });
    marker(g, CX - 60, GY + 70, 0.1, 0.6, false);
  });
  FX.godRays(g, E.W * 0.25, 300, { color: M.key, a: 0.12 });
  const tm = rel('tahunnya', info, 4.48), a = ease.outBack(prog(t, tm - 0.1, tm + 0.25));
  if (a > 0) { g.save(); g.translate(E.W / 2, 560); g.scale(a, a);
    text(g, 'KAMU YANG', 0, -70, { size: 70, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
    text(g, 'MENGUBAHNYA', 0, 40, { size: 110, color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
  badge(g, 'HARI 1');
} });

// s18 — loop: night falls back, the zoom lands exactly on frame 0 of s01
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  hook(g, t - info.dur, 1 + 0.12 * (1 - k));
  if (t < info.dur * 0.5) veil(g, '#000', 0.7 * (1 - ease.inOut(prog(t, 0, info.dur * 0.5))));
  badge(g, '52 HARI', ease.out(prog(t, info.dur - 1.0, info.dur - 0.3)));
} });
