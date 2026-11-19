// cover.js — cover #14: gelembung hinaan merah-oranye raksasa terbakar jadi bahan bakar; teks di pita tengah (aman crop 3:4).
import { E, V, S, registerShot, mood, backdrop, alpha, shade, glow, text, circle, rr, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { KRITIK } from '../cast.js';
import { bub } from '../_util.js';

registerShot('c01', { draw(g, t) {
  const M = mood('night'); backdrop(g, M.sky); FX.stars(g, 0, { count: 60 }); glow(g, E.W / 2, E.H * 0.72, 1000, KRITIK, 0.22); FX.dust(g, 0.5, { count: 34, color: '#ff8a70', a: 0.3 });
  glow(g, E.W / 2, 1180, 700, '#ffb07a', 0.18);
  bub(g, E.W / 2 + 20, 1160, 760, 340, KRITIK, 'KAMU NGGAK\nBAKAL SANGGUP', 1, 68);
  const cy = E.H * 0.3, grd = g.createLinearGradient(0, cy - 380, 0, cy + 380); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(12,8,28,.78)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = grd; g.fillRect(0, cy - 380, E.W, 760);
  text(g, 'HINAAN', E.W / 2, cy - 90, { size: 200, color: '#ff8a70', font: FONTS.ui, weight: 900, spacing: 4, glow: 22, glowColor: 'rgba(214,74,51,.5)' });
  text(g, 'JADI BENSIN?', E.W / 2, cy + 110, { size: 122, color: '#ffd45a', font: FONTS.ui, weight: 900, spacing: 3 });
}});
