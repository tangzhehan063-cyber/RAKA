// sets/bedroom.js — Raka's small bedroom. Big window (rain at night / pale dawn), bed left, running shoes right, wall calendar.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const roomGround = () => E.H * V(0.8, 0.68);

export function shoes(g, x, y, s = 1, c = '#e9e2d6') {
  for (const [dx, k] of [[-40, 0], [36, 1]]) {
    g.save(); g.translate(x + dx * s, y); g.scale(s, s);
    rr(g, -34, -26, 68, 26, 12); g.fillStyle = c; g.fill();
    rr(g, -34, -6, 72, 8, 4); g.fillStyle = '#d64a33'; g.fill();          // sole stripe
    seg(g, [[-10, -24], [6, -16]], 3, alpha('#2a2230', 0.6)); seg(g, [[-4, -26], [12, -18]], 3, alpha('#2a2230', 0.6));
    g.restore();
  }
}

export function calendar(g, x, y, day, o = {}) {
  const w = o.w || 150, h = o.h || 170, c = o.glow ?? 0;
  if (c > 0) glow(g, x, y + h / 2, w * 1.6, o.glowColor || '#ffd45a', 0.35 * c);
  rr(g, x - w / 2, y, w, h, 10); g.fillStyle = '#e9e2d6'; g.fill();
  rr(g, x - w / 2, y, w, h * 0.24, 10); g.fillStyle = '#c4473a'; g.fill(); g.fillRect(x - w / 2, y + h * 0.14, w, h * 0.1);
  text(g, 'HARI', x, y + h * 0.12, { size: h * 0.13, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 });
  text(g, String(day), x, y + h * 0.62, { size: h * 0.5, color: '#1a1622', font: FONTS.ui, weight: 900 });
}

// o: { mood: 'night'|'dusk', rain: true, day: 9, calGlow: 0, frozen: false, dim: 0 }
export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = roomGround(), CX = E.W / 2, night = (o.mood || 'night') === 'night';
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  const wx = CX - V(380, 250), wy = GY - V(640, 1010), ww = V(560, 500), wh = V(420, 560);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]);
      if (night) { FX.moon(g, x + w * 0.72, y + h * 0.25, 34); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.45, color: alpha(wallDark, 0.9), windowColor: alpha(M.practical, 0.7), lit: 0.2, seed: 12 }); }
      else { FX.sun(g, x + w * 0.5, y + h * 0.85, 46, '#fff3dc', M.key, 4); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(wallDark, 0.85), windowColor: alpha(M.practical, 0.4), lit: 0.1, seed: 12 }); }
      if (o.rain) FX.rain(g, o.frozen ? 0.37 : t, { area: [x - 40, y - 40, w + 80, h + 80], count: 140, a: 0.45, color: M.rim, speed: 1800 });
      g.fillStyle = alpha('#9fb8ff', night ? 0.06 : 0.03); g.fillRect(x, y, w, h);
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, night ? M.rim : M.key, night ? 0.08 : 0.18);
    calendar(g, CX + V(380, 330), GY - V(560, 860), o.day ?? 9, { w: V(130, 150), h: V(150, 170), glow: o.calGlow || 0 });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww * 0.6, GY + 60, ww * 0.7, 60, night ? M.rim : M.key, night ? 0.12 : 0.22);
    FX.bed(g, { x: CX - V(700, 560), y: GY, w: V(560, 470), color: shade(M.wall, 0.15), frame: wallDark, pillow: shade('#e8e4f4', night ? -0.45 : -0.2) });
    if (o.blanket) { g.fillStyle = shade(M.wall, 0.05); g.beginPath(); g.ellipse(CX - V(420, 300), GY - 100, V(240, 200), 60, 0, Math.PI, 0); g.fill(); }
    shoes(g, CX + V(300, 300), GY + 40, 1.1);
  });
  if (o.dim) { g.fillStyle = alpha('#000', o.dim); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  return { GY, CX, M, win: [wx, wy, ww, wh] };
}
