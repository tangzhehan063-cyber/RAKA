// sets/street.js — quiet residential street at dawn/morning. Low sun at the end of the road, houses, lamp posts, trees.
import { E, V, mood, layer, backdrop, linGrad, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const streetGround = () => E.H * V(0.8, 0.68);
// o: { mood: 'dusk'|'golden', sunY: 0..1 (0 = at horizon, 1 = high), lamps: true }
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = streetGround(), CX = E.W / 2, sunY = o.sunY ?? 0.2;
  layer(g, cam, 0.12, (g) => {
    backdrop(g, M.sky);
    const sx = CX + V(200, 60), sy = GY - V(250, 380) - sunY * V(300, 500);
    FX.sun(g, sx, sy, V(60, 70), '#fff3dc', M.key, 5);
    if (o.rays) FX.godRays(g, sx, sy, { count: 14, angle: Math.PI / 2, spread: Math.PI * 1.8, len: 1800, a: 0.06 * o.rays, t });
    FX.clouds(g, { y: GY - V(900, 1300), h: 220, color: '#fff3dc', a: 0.12, seed: 4 });
    FX.hills(g, { y: GY - V(160, 220), amp: 50, color: mix(M.sky[0], M.dark, 0.6), seed: 3 });
  });
  layer(g, cam, 0.45, (g) => {
    const wall = shade(M.wall, -0.35);
    for (let i = -4; i <= 4; i++) {
      const x = CX + i * V(420, 380) - 160, h = V(330, 420) + (i % 2) * 60;
      FX.facade(g, { x, y: GY - 10, w: 320, h, color: shade(wall, (i % 3) * 0.05), win: M.practical, dark: shade(wall, -0.4), cols: 3, rows: 2, lit: o.lamps === false ? 0.15 : 0.45, seed: 20 + i });
      g.fillStyle = shade(wall, -0.25); g.beginPath(); g.moveTo(x - 20, GY - 10 - h); g.lineTo(x + 160, GY - 10 - h - 110); g.lineTo(x + 340, GY - 10 - h); g.fill();
    }
    for (let i = -4; i <= 4; i++) FX.tree(g, CX + i * V(420, 380) + 70, GY, 1.3, shade(M.dark, -0.2));
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 12, 0, GY + 500, [shade(M.road, -0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W * 2, GY - 12, E.W * 5, E.H * 2);
    g.fillStyle = alpha(M.key, 0.08); g.fillRect(-E.W * 2, GY - 12, E.W * 5, 10);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.22)', 0.09);
    for (let i = -3; i <= 3; i++) FX.lampPost(g, CX + i * V(700, 620), GY, V(360, 420), { light: M.practical, on: o.lamps !== false, a: 0.18 });
    FX.pool(g, CX + V(200, 60), GY + 40, 600, 70, M.key, 0.18);
  });
  return { GY, CX, M };
}
