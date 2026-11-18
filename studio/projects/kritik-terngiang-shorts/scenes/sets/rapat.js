// sets/rapat.js — ruang rapat sore: jendela besar bermatahari, meja panjang, layar proyektor, kursi (latar depan buram). Semua warna dari token mood/style.
import { E, V, mood, layer, blurLayer, backdrop, linGrad, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const rapatGround = () => E.H * V(0.8, 0.68);
// o { mood, slide: string|null, slideA }
export function rapat(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), G = rapatGround(), CX = E.W / 2, wall = shade(M.wall, -0.15);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.35), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H * 2);
    FX.windowFrame(g, { x: CX - 470, y: G - 1020, w: 640, h: 560, cols: 3, rows: 2, frame: shade(wall, -0.45), bar: 14 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.62, y + h * 0.78, 54, '#fff3dc', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.4, color: alpha(shade(M.sky[0], -0.45), 0.85), windowColor: alpha(M.practical, 0.5), lit: 0.14, seed: 13 });
    });
    glow(g, CX - 150, G - 740, 640, M.key, 0.28); FX.godRays(g, CX - 150, G - 740, { count: 10, angle: Math.PI * 0.5, spread: 1.1, len: 1500, a: 0.06, t });
    const sx = CX + 150, sy = G - 900, sw = 380, sh = 260;   // layar proyektor
    rr(g, sx, sy, sw, sh, 10); g.fillStyle = shade(M.wall, 0.35); g.fill(); rr(g, sx + 10, sy + 10, sw - 20, sh - 20, 6); g.fillStyle = shade(M.wall, 0.6); g.fill();
    glow(g, sx + sw / 2, sy + sh / 2, 260, M.practical, 0.12 * (o.slideA ?? 1));
    if (o.slide) text(g, o.slide, sx + sw / 2, sy + sh / 2, { size: 36, color: shade(M.dark, -0.2), font: FONTS.ui, weight: 900, alpha: o.slideA ?? 1 });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, 0.04), shade(M.floor, -0.35)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.pool(g, CX - 150, G + 50, 600, 70, M.key, 0.28);
    rr(g, CX - 560, G - 120, 1120, 22, 8); g.fillStyle = shade(M.floor, 0.1); g.fill();   // meja panjang
    seg(g, [[CX - 500, G - 100], [CX - 500, G]], 12, shade(M.floor, -0.3)); seg(g, [[CX + 500, G - 100], [CX + 500, G]], 12, shade(M.floor, -0.3));
  });
  return { G, CX, M };
}
// kursi latar depan buram (siluet): dipanggil di luar layer 1
export function kursiDepan(g, cam, M, G) {
  blurLayer(g, 11, (g) => { [[160, 1.0], [E.W - 120, 1.15]].forEach(([x, s]) => { g.save(); g.translate(x, G + 60); g.scale(s, s); rr(g, -90, -430, 180, 330, 36); g.fillStyle = shade(M.dark, -0.45); g.fill(); rr(g, -110, -120, 220, 40, 14); g.fill(); g.restore(); }); }, cam, 1.7);
}
