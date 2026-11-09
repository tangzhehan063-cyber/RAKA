// 01_kamar.js — "Satu Video Lagi": the bedroom at night, the phone glow, the blanket (red-orange mascot item),
// the freeze, the whisper, the signature "room becomes a feed card" moment, peaceful sleep, loop.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { KAMU, KAMU_FACE } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const BLANKET = '#d64a33', SCREEN = '#bfe4ff';
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });

// --- the hero sitting on the bed edge, wrapped in the blanket, phone in hand ---------------------
const SIT_PHONE = { ...POSES.sit, head: [9, -176], eF: [20, -112], hF: [34, -138], eB: [10, -110], hB: [30, -134] };
function sitter(g, t, GY, M, o = {}) {
  const f = { x: o.x ?? 400, y: GY + 10, s: o.s ?? 1.4, facing: 1, outfit: KAMU, pose: breathe(o.pose || SIT_PHONE, t, 0.5, 2),
    expr: o.expr || 'neutral', look: o.look || [0.6, 0.8], blink: o.blink ?? ((t % 3.6) > 3.45), rim: { color: o.rim || SCREEN, dir: [1, 0.2] } };
  const [hx, hy, hr] = headPos(f), by = f.y - 60 * f.s;
  // blanket: hood over the head, draping down the back onto the bed
  g.save();
  g.beginPath(); g.arc(hx - hr * 0.15, hy, hr * 1.5, Math.PI * 0.85, Math.PI * 2.12);
  g.lineTo(hx + hr * 1.3, by); g.quadraticCurveTo(hx - hr * 0.6, by + 18, hx - hr * 3.0, by + 6); g.closePath();
  const gr = g.createLinearGradient(hx - hr * 3, hy, hx + hr * 1.5, by); gr.addColorStop(0, '#7a2418'); gr.addColorStop(0.6, BLANKET); gr.addColorStop(1, '#e8684e');
  g.fillStyle = gr; g.fill();
  g.strokeStyle = alpha('#ff9a7a', 0.5); g.lineWidth = 4; g.beginPath(); g.arc(hx - hr * 0.15, hy, hr * 1.5, Math.PI * 1.55, Math.PI * 2.05); g.stroke();
  g.restore();
  drawFigure(g, f);
  if (o.phone !== false) {
    const p = f.pose, px = f.x + p.hF[0] * f.s + 6, py = f.y + p.hF[1] * f.s - 10;
    const on = o.phoneOn ?? 1;
    if (on > 0) { glow(g, (px + hx) / 2, (py + hy) / 2, hr * 3.2, SCREEN, 0.22 * on); FX.lightCone(g, px - 4, py - 10, { angle: -Math.PI * 0.62, spread: 0.5, len: hr * 2.4, color: SCREEN, a: 0.18 * on }); }
    g.save(); g.translate(px, py); g.rotate(-0.35); rr(g, -14, -26, 28, 52, 6); g.fillStyle = '#0a0f12'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.7 * on + 0.1); g.lineWidth = 3; g.stroke(); g.restore();
  }
  return [hx, hy, hr];
}

// --- lying asleep under the blanket ---------------------------------------------------------------
function sleeper(g, t, GY, M) {
  const f = { x: 170, y: GY + 18, s: 1.3, rot: -Math.PI / 2, facing: 1, outfit: KAMU, pose: breathe(POSES.lie, t, 0.4, 3), expr: 'sleepy', blink: true, look: [0, 0], rim: { color: M.rim, dir: [0.2, -1] }, shadow: false };
  drawFigure(g, f);
  const [hx, hy, hr] = headPos(f), bodyY = hy;
  const rise = 3 * Math.sin(t * 1.6);
  g.save(); rr(g, hx + hr * 0.9, bodyY - 40 - rise, 310, 74 + rise, 30);
  const gr = g.createLinearGradient(0, bodyY - 40, 0, bodyY + 34); gr.addColorStop(0, '#e8684e'); gr.addColorStop(1, '#8a2a1c'); g.fillStyle = gr; g.fill();
  seg(g, [[hx + hr * 1.3, bodyY - 30 - rise], [hx + hr * 1.3, bodyY + 30]], 5, alpha('#ff9a7a', 0.7)); g.restore();
  return [hx, hy, hr];
}

// --- big face under the blanket, lit by the phone (frame 0 of the video + the loop) ----------------
function faceHook(g, t, z, o = {}) {
  const cam = { z: 1.1 };
  blurLayer(g, 14, (g) => kamar(g, t, cam, { mood: 'night', clock: o.clock || '22:10' }), cam, 0.5);
  veil(g, '#000', 0.55);
  const cx = E.W / 2, cy = E.H * 0.47, r = 250;
  g.save(); g.translate(cx, cy + 200); g.scale(z, z); g.translate(-cx, -cy - 200);
  glow(g, cx, cy + r * 0.9, r * 2.2, SCREEN, 0.25);
  bigFace(g, cx, cy, r, { outfit: KAMU_FACE, expr: o.expr || 'neutral', blink: o.blink ?? ((t % 3.3) > 3.18), look: o.look || [0.1, 0.75], rimColor: SCREEN, rimSide: 1, tilt: 0.03 });
  // feed light scrolling up the face: one band per swipe
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.clip(); g.globalCompositeOperation = 'lighter';
  const ph = ((t + 10) % 1.0) / 1.0, by = cy + r - ph * r * 2.4;
  const bg = g.createLinearGradient(0, by - 90, 0, by + 90); bg.addColorStop(0, alpha(SCREEN, 0)); bg.addColorStop(0.5, alpha(SCREEN, 0.13)); bg.addColorStop(1, alpha(SCREEN, 0));
  g.fillStyle = bg; g.fillRect(cx - r, by - 90, r * 2, 180); g.restore();
  // the phone (back side to camera) + thumb flicking up
  const px = cx + 40, py = cy + r * 1.42;
  g.save(); g.translate(px, py); g.rotate(0.06); rr(g, -120, -170, 240, 340, 30); g.fillStyle = '#0b1013'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.85); g.lineWidth = 6; g.stroke();
  circle(g, -70, -120, 16, '#1c252a'); g.restore();
  const k = ((t + 10) % 1.0), up = ease.inOut(clamp(k / 0.35));
  const tx = px + 112, ty = py - 30 - up * 110;
  seg(g, [[tx + 70, py + 160], [tx + 26, ty + 40], [tx, ty]], 14, S().ink);
  circle(g, tx, ty, 13, S().ink);
  g.restore();
}

registerShot('s01', { draw(g, t, info) {
  faceHook(g, t, 1 + 0.06 * ease.inOut(t / info.dur));
  badge(g, '22.10');
} });

// s02 — wide: "Kamu bilang itu jam sepuluh." wall clock 22:47
registerShot('s02', { draw(g, t, info) {
  const cam = { z: 1.12 + 0.05 * ease.inOut(t / info.dur), x: V(-120, -120), y: V(40, 40) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '22:47' });
  layer(g, cam, 1, (g) => sitter(g, t, GY, M, {}));
  FX.dust(g, t, { count: 24, color: SCREEN, a: 0.25 });
} });

// s03 — "Sekarang... jam dua pagi." the clock jumps, the room drops darker, rain starts
registerShot('s03', { draw(g, t, info) {
  const tj = rel('2', info, 1.3), J = t >= tj;
  const cam = { z: 1.12 + 0.12 * ease.out(prog(t, tj, tj + 1.2)), x: V(-120, -40), y: V(40, -60) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: J ? '02:06' : '22:51', rain: J, dim: J ? 0.28 : 0 });
  layer(g, cam, 1, (g) => sitter(g, t, GY, M, { expr: J ? 'sleepy' : 'neutral', blink: J ? (t % 1.4) > 1.1 : undefined }));
  if (J && t < tj + 0.15) veil(g, '#ff5a46', 0.25 * (1 - (t - tj) / 0.15), 'lighter');
  if (J) badge(g, '02.06', ease.out(prog(t, tj, tj + 0.2)));
} });

// s08 — FREEZE. "Yang paling seram? Mereka sendiri... hampir tidak sadar." smiling in front of an almost empty bar
registerShot('s08', { draw(g, t, info) {
  const cam = { z: 1.15, x: V(-60, -60) };
  blurLayer(g, 8, (g) => kamar(g, t, cam, { mood: 'night', clock: '02:06', rain: true, frozen: true }), cam, 0.6);
  veil(g, '#000', 0.4);
  const ui = S().ui, GY = E.H * 0.68;
  // the giant "thinking" bar on the wall, almost empty
  const bx = 150, bw = 780, byy = 470, bh = 120;
  text(g, 'KEMAMPUAN BERPIKIR', E.W / 2, byy - 60, { size: 40, color: alpha(ui.cream, 0.9), font: FONTS.ui, weight: 900, spacing: 4 });
  rr(g, bx, byy, bw, bh, 24); g.strokeStyle = alpha(ui.cream, 0.85); g.lineWidth = 8; g.stroke();
  rr(g, bx + 14, byy + 14, bw * 0.16, bh - 28, 14); g.fillStyle = ui.accent; g.fill();
  // the hero smiling, unaware
  drawFigure(g, { x: E.W / 2 - 40, y: GY + 120, s: 1.75, facing: 1, outfit: KAMU, pose: POSES.relaxed, expr: 'smile', look: [0.2, 0], blink: false, rim: { color: '#a9c8ff', dir: [1, -0.3], w: 6 } });
  g.save(); g.translate(E.W / 2 - 40, GY + 120); const s = 1.75;
  // the blanket hung over one shoulder like a cape
  g.beginPath(); g.moveTo(-14 * s, -176 * s); g.quadraticCurveTo(-60 * s, -120 * s, -46 * s, -60 * s); g.lineTo(-8 * s, -98 * s); g.closePath(); g.fillStyle = BLANKET; g.fill(); g.restore();
  FX.drops(g, t * 0.2, { count: 70, rMin: 3, rMax: 12, color: '#a9c8ff', drift: 5 });
  veil(g, '#4a90ff', 0.14, 'color');
  const ts = rel('sadar', info, 2.96), a = ease.outBack(prog(t, ts - 0.1, ts + 0.25));
  if (a > 0) { g.save(); g.translate(E.W / 2, 850); g.scale(clamp(a), clamp(a)); text(g, 'TIDAK SADAR', 0, 0, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 24, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
  const grd = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.35, E.W / 2, E.H / 2, E.H * 0.75); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.8)'); g.fillStyle = grd; g.fillRect(0, 0, E.W, E.H);
} });

// s11 — giant face, whispering: "Ini satu-satunya waktu punyaku." the phone reflected in the eyes
registerShot('s11', { draw(g, t, info) {
  g.fillStyle = '#05080a'; g.fillRect(0, 0, E.W, E.H);
  const z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.5, r = 330;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  glow(g, cx, cy + r, r * 2.4, SCREEN, 0.28);
  bigFace(g, cx, cy, r, { outfit: KAMU_FACE, expr: 'sad', blink: false, look: [0, 0.35], rimColor: SCREEN, rimSide: 1, tilt: -0.04 });
  // tiny phone rectangles reflected in both eyes
  for (const dx of [-0.34, 0.34]) { const ex = cx + dx * r * Math.cos(-0.04), ey = cy - r * 0.12 + dx * r * Math.sin(-0.04) + r * 0.06;
    g.save(); g.translate(ex + r * 0.02, ey); rr(g, -r * 0.035, -r * 0.055, r * 0.07, r * 0.11, 3); g.fillStyle = alpha(SCREEN, 0.95); g.fill(); g.restore(); }
  g.restore();
  FX.dust(g, t, { count: 20, color: SCREEN, a: 0.2 });
} });

// s12 — SIGNATURE MOMENT: the room itself becomes a feed card and gets swiped away; tomorrow morning slides in
// and is dragged up as well ("harimu makin bukan milikmu").
function roomCard(g, t, cy, sc, o) {
  const W = E.W, H = E.H;
  g.save(); g.translate(W / 2, cy); g.scale(sc, sc); g.translate(-W / 2, -H / 2);
  g.save(); rr(g, 0, 0, W, H, 70); g.clip();
  const cam = { z: 1.12, x: -120, y: 40 };
  const { GY, M } = kamar(g, t, cam, { mood: o.mood, clock: o.clock, rain: o.rain, dim: o.dim || 0 });
  layer(g, cam, 1, (g) => o.morning
    ? drawFigure(g, { x: 560, y: GY + 10, s: 1.4, facing: -1, outfit: KAMU, pose: breathe(POSES.stand, t, 1, 4), expr: 'sleepy', blink: (t % 1.6) > 1.2, look: [-0.5, 0.3], rim: { color: M.key, dir: [-1, -0.3] } })
    : sitter(g, t, GY, M, {}));
  g.restore();
  rr(g, 0, 0, W, H, 70); g.strokeStyle = alpha('#ffffff', 0.25); g.lineWidth = 6 / sc; g.stroke();
  UI.badge(g, { str: o.badge, x: W - 110, y: 300, size: 52 });
  g.restore();
}
registerShot('s12', { draw(g, t, info) {
  g.fillStyle = '#05080a'; g.fillRect(0, 0, E.W, E.H);
  const tc = rel('curi', info, 0.76), tb = rel('besok', info, 2.72);
  const shrink = ease.inOut(prog(t, tc - 0.3, tc + 0.4)), sc = lerp(1, 0.6, shrink);
  const s1 = ease.inOut(prog(t, tb - 0.5, tb)), s2 = ease.in(prog(t, tb + 1.4, info.dur));
  const gap = E.H * 0.66;
  const y1 = E.H / 2 - s1 * gap - s2 * gap * 0.6;
  roomCard(g, t, y1, sc, { mood: 'night', clock: '02:06', rain: true, badge: '02.06' });
  roomCard(g, t, y1 + gap, sc, { mood: 'day', clock: '09:00', morning: true, dim: 0.15, badge: '09.00' });
  if (s2 > 0) roomCard(g, t, y1 + gap * 2, sc, { mood: 'night', clock: '02:06', rain: true, dim: 0.2, badge: '02.06' });
  // the thumb dragging the feed
  const tx = E.W * 0.78, ty = E.H * 0.62 - 260 * ease.inOut(((t * 1.25) % 1)) ;
  if (shrink > 0.5) { g.save(); g.globalAlpha = 0.9; seg(g, [[tx + 90, E.H * 0.9], [tx + 30, ty + 60], [tx, ty]], 22, S().ink); circle(g, tx, ty, 20, S().ink); g.strokeStyle = alpha('#ffffff', 0.5); g.lineWidth = 3; g.beginPath(); g.arc(tx, ty, 21, 0, Math.PI * 2); g.stroke(); g.restore(); }
} });

// s14 — "Malamnya, kamu tidak perlu balas dendam." asleep, phone face-down on the desk, clock 22:30
registerShot('s14', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.04 * ease.inOut(t / info.dur), x: V(-60, -60) };
  const { GY, M } = kamar(g, t, cam, { mood: 'night', clock: '22:30' });
  layer(g, cam, 1, (g) => { sleeper(g, t, GY, M);
    const dx = E.W / 2 + 270; rr(g, dx - 30, GY - 162, 60, 10, 4); g.fillStyle = '#0a0f12'; g.fill(); });
  FX.dust(g, t * 0.5, { count: 24, color: '#cfe0ff', a: 0.22 });
  for (let i = 0; i < 2; i++) { const k = ((t + i * 1.1) % 2.2) / 2.2;
    text(g, 'z', 330 + 30 * Math.sin((t + i) * 2), GY - 230 - k * 160, { size: 48 + i * 10, color: alpha('#cfe0ff', 0.6 * Math.sin(k * Math.PI)), font: FONTS.ui, weight: 900 }); }
  badge(g, '22.30', ease.out(prog(t, 0.1, 0.4)));
} });

// s16 — loop: the night comes back, zoom lands exactly on frame 0 of s01
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  faceHook(g, t - info.dur, 1 + 0.1 * (1 - k));
  if (t < info.dur * 0.55) { const a = 1 - ease.inOut(prog(t, 0, info.dur * 0.55)); veil(g, '#000', 0.6 * a); }
  badge(g, '22.10', ease.out(prog(t, info.dur - 1.0, info.dur - 0.3)));
} });
