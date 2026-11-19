// sets/kamar.js — Nara's bedroom at 3 AM. Window (rain/night or dawn), bed left, desk + lamp right,
// digital clock on the wall (03:00), fear notes pinned above the desk.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import { RAMALAN_INK } from '../cast.js';

export const roomGround = () => E.H * V(0.8, 0.68);
export const deskPos = () => [E.W / 2 + V(330, 270), roomGround()];

export function digiClock(g, x, y, str = '03:00', o = {}) {
  const w = o.w || 230, h = o.h || 100, c = o.color || '#ff5a46';
  rr(g, x - w / 2, y - h / 2, w, h, 14); g.fillStyle = '#06090a'; g.fill();
  g.strokeStyle = alpha('#7dffb0', 0.25); g.lineWidth = 3; g.stroke();
  glow(g, x, y, w * 0.9, c, 0.25 * (o.glow ?? 1));
  text(g, str, x, y + 4, { size: h * 0.62, color: c, font: FONTS.ui, weight: 900, spacing: 4, glow: 18, glowColor: alpha(c, 0.8) });
}

// a pinned paper note; crossed: 0..1 draws a coral X stroke
export function note(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-52, -58, 110, 124);
  g.fillStyle = o.color || '#efe3c4'; g.fillRect(-56, -62, 110, 124);
  for (let i = 0; i < 5; i++) seg(g, [[-40, -36 + i * 18], [34 - (i % 2) * 18, -36 + i * 18]], 4, alpha('#3a3040', 0.55));
  circle(g, 0, -60, 7, '#d64a33');
  const k = o.crossed || 0;
  if (k > 0) {
    const a = Math.min(1, k * 2), b = Math.max(0, k * 2 - 1);
    seg(g, [[-44, -46], [-44 + 88 * a, -46 + 92 * a]], 9, '#ff6a50');
    if (b > 0) seg(g, [[44, -46], [44 - 88 * b, -46 + 92 * b]], 9, '#ff6a50');
  }
  g.restore();
}

export function desk(g, x, y, M, lamp = 0) {
  const w = V(300, 250);
  rr(g, x - w / 2, y - 150, w, 18, 6); g.fillStyle = shade(M.wall, -0.4); g.fill();
  seg(g, [[x - w / 2 + 20, y - 135], [x - w / 2 + 20, y]], 10, shade(M.wall, -0.55));
  seg(g, [[x + w / 2 - 20, y - 135], [x + w / 2 - 20, y]], 10, shade(M.wall, -0.55));
  // paper on the desk
  g.fillStyle = '#efe3c4'; g.beginPath(); g.moveTo(x - 70, y - 152); g.lineTo(x + 10, y - 152); g.lineTo(x + 20, y - 160); g.lineTo(x - 60, y - 160); g.fill();
  // lamp
  const lx = x + w / 2 - 60, ly = y - 150;
  seg(g, [[lx, ly], [lx - 10, ly - 90], [lx - 60, ly - 130]], 7, '#14181a');
  g.save(); g.translate(lx - 60, ly - 130); g.rotate(-0.5); rr(g, -34, -14, 68, 30, 10); g.fillStyle = '#1b2224'; g.fill(); g.restore();
  if (lamp > 0) {
    FX.lightCone(g, lx - 70, ly - 118, { angle: Math.PI * 0.62, spread: 0.55, len: 420, color: '#ffd45a', a: 0.22 * lamp });
    glow(g, lx - 70, ly - 118, 90, '#fff1c0', 0.6 * lamp);
    FX.pool(g, x - 20, y - 150, 200, 26, '#ffd45a', 0.35 * lamp);
  }
}

// Si Ramalan — tall thin shadow stickman. x,y = feet; s = scale; lean -1..1
export function ramalan(g, t, x, y, s = 1.6, o = {}) {
  g.save(); g.translate(x, y); g.scale(0.8, 1.32); g.translate(-x, -y);
  if (o.a != null) g.globalAlpha *= o.a;
  drawFigure(g, { x, y, s, facing: o.facing ?? 1, ink: RAMALAN_INK, inkFar: '#010403', outfit: { top: 'none', head: 'none' },
    pose: o.pose || POSES.point, expr: o.expr || 'smirk', blink: (t % 3.1) > 2.95, look: o.look || [1, 0.3],
    rim: { color: '#7dffb0', dir: [-0.6, -0.8], w: o.rimW || 5 }, shadow: false });
  g.restore();
}

// o: { mood:'night'|'dusk', rain, frozen, clock:'03:00', lamp:0..1, notes:[{crossed}], dim, figure(g,GY,M) }
export function kamar(g, t, cam, o = {}) {
  const md = o.mood || 'night', M = mood(md), GY = roomGround(), CX = E.W / 2, night = md === 'night';
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  const wx = CX - V(380, 250), wy = GY - V(640, 1010), ww = V(560, 470), wh = V(420, 540);
  const [dx, dy] = deskPos();
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]);
      if (night) { FX.moon(g, x + w * 0.72, y + h * 0.25, 30); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.45, color: alpha(wallDark, 0.9), windowColor: alpha(M.practical, 0.7), lit: 0.12, seed: 21 }); }
      else { FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(wallDark, 0.85), windowColor: alpha(M.practical, 0.4), lit: 0.1, seed: 21 }); }
      if (o.rain) FX.rain(g, o.frozen ? 0.41 : t, { area: [x - 40, y - 40, w + 80, h + 80], count: 140, a: 0.45, color: M.rim, speed: 1800 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, night ? M.rim : M.key, night ? 0.08 : 0.2);
    digiClock(g, CX - V(560, 330), GY - V(560, 780), o.clock || '03:00', { w: V(200, 230), h: V(86, 100), glow: night ? 1 : 0.3, color: night ? '#ff5a46' : '#ffb07a' });
    (o.notes || []).forEach((n, i) => note(g, dx - V(90, 80) + (i % 3) * V(110, 105), GY - V(470, 720) - Math.floor(i / 3) * V(140, 140), V(0.75, 0.8), { rot: [-0.08, 0.06, -0.03, 0.09, -0.06, 0.04][i % 6], crossed: n.crossed || 0 }));
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww * 0.6, GY + 60, ww * 0.7, 60, night ? M.rim : M.key, night ? 0.12 : 0.22);
    FX.bed(g, { x: CX - V(700, 560), y: GY, w: V(560, 470), color: shade(M.wall, 0.15), frame: wallDark, pillow: shade('#e8e4f4', night ? -0.45 : -0.2) });
    desk(g, dx, GY, M, o.lamp || 0);
  });
  if (o.lamp) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, dx, GY - 300, V(700, 800), '#ffd45a', 0.12 * o.lamp); g.restore(); }
  if (o.dim) { g.fillStyle = alpha('#000', o.dim); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  return { GY, CX, M, win: [wx, wy, ww, wh], desk: [dx, GY] };
}
