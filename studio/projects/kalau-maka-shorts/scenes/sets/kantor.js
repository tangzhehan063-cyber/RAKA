// sets/kantor.js — kantor/pantry kecil: jendela kota sore, sekat meja, monitor menyala, tanaman, dispenser.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
export const kantorGround = () => E.H * V(0.8, 0.68);
// o: { mood:'dusk'|'night'|'golden', dim }
export function kantor(g, t, cam, o = {}) {
  const md = o.mood || 'dusk', M = mood(md), GY = kantorGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  const wx = CX - V(520, 300), wy = GY - V(660, 1020), ww = V(820, 640), wh = V(460, 600);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 3, rows: 2, frame: wallDark, bar: 14 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.55, color: alpha(wallDark, 0.9), windowColor: alpha(M.practical, 0.75), lit: 0.35, seed: 31 });
      FX.sun(g, x + w * 0.78, y + h * 0.7, 34, '#fff3dc', M.key, 4);
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.8, M.key, 0.16);
    // sekat meja jauh + monitor menyala
    for (let i = 0; i < 3; i++) {
      const px = CX + V(-120, -60) + i * V(300, 270), py = GY - V(330, 380);
      rr(g, px - 120, py, 240, 250, 10); g.fillStyle = shade(wall, -0.18); g.fill();
      rr(g, px - 80, py + 40, 160, 100, 8); g.fillStyle = '#0a0f18'; g.fill();
      rr(g, px - 72, py + 48, 144, 84, 6); g.fillStyle = alpha(i === 1 ? M.practical : '#9fc4ff', 0.55); g.fill();
      glow(g, px, py + 90, 160, '#9fc4ff', 0.12);
    }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww * 0.5, GY + 60, ww * 0.8, 60, M.key, 0.2);
    // dispenser
    const dx = CX + V(520, 380); rr(g, dx - 50, GY - 260, 100, 260, 10); g.fillStyle = shade(wall, 0.08); g.fill();
    rr(g, dx - 32, GY - 330, 64, 80, 20); g.fillStyle = alpha('#9fd8ff', 0.5); g.fill();
    // tanaman
    const px = CX - V(640, 460); rr(g, px - 36, GY - 80, 72, 80, 8); g.fillStyle = shade(M.wall, -0.2); g.fill();
    for (let i = 0; i < 6; i++) seg(g, [[px, GY - 80], [px + (i - 2.5) * 22, GY - 200 - (i % 2) * 40]], 14, shade(M.grass || '#3f6a55', -0.2 - (i % 3) * 0.05));
  });
  if (o.dim) { g.fillStyle = alpha('#000', o.dim); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  return { GY, CX, M };
}
