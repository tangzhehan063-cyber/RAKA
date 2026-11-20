// sets/jurang.js — metafora NIAT vs AKSI: dua tebing, jurang gelap berkabut di antaranya, sepatu menyala di seberang.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { shoes } from './bedroom.js';
export const jurangGround = () => E.H * V(0.8, 0.68);
// o: { planks: 0..N papan terpasang (0..1 tiap papan nyala), label: 0..1 }
export function jurang(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = jurangGround(), CX = E.W / 2, gap = V(380, 300);
  const L = CX - gap / 2, R = CX + gap / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 90, area: [-E.W, -E.H * 0.4, E.W * 3, E.H * 0.9] }); FX.moon(g, CX + V(260, 200), GY - V(900, 1100), 46); });
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: GY - V(300, 420), amp: 120, color: shade(M.dark, -0.1), seed: 5 }); FX.hills(g, { y: GY - V(180, 260), amp: 70, color: shade(M.dark, -0.25), seed: 9 }); });
  layer(g, cam, 0.8, (g) => {
    // jurang
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 900, [shade(M.dark, -0.5), '#000']); g.fillRect(L, GY, gap, E.H * 2);
    FX.fog(g, GY + 40, 360, M.rim, 0.22); FX.fog(g, GY + 240, 400, M.rim, 0.16);
    // tebing kiri & kanan
    for (const [x0, x1] of [[-E.W, L], [R, E.W * 3]]) { g.fillStyle = linGrad(g, 0, GY - 12, 0, GY + 700, [shade(M.floor, -0.1), shade(M.dark, -0.5)]); g.fillRect(x0, GY - 12, x1 - x0, E.H * 2); }
    g.fillStyle = alpha(M.key, 0.1); g.fillRect(-E.W, GY - 12, L + E.W, 8); g.fillRect(R, GY - 12, E.W * 3 - R, 8);
    // papan jembatan (menyala satu per satu)
    const n = o.planks || 0, N = 6;
    for (let i = 0; i < N; i++) {
      const a = Math.max(0, Math.min(1, n - i)); if (a <= 0) continue; const px = L + (i + 0.5) * (gap / N), k = a;
      g.save(); g.translate(px, GY - 10 + (1 - k) * -80); g.globalAlpha *= k; rr(g, -gap / N / 2 + 3, -8, gap / N - 6, 18, 4); g.fillStyle = shade('#c8924f', 0.1); g.fill();
      glow(g, 0, 0, 90, '#ffd45a', 0.35); g.restore();
    }
    // sepatu menyala di seberang
    glow(g, R + 150, GY - 40, 260, '#ffd45a', 0.35 + 0.1 * Math.sin(t * 2));
    shoes(g, R + 150, GY - 10, 1.5);
  });
  return { GY, CX, M, L, R };
}
