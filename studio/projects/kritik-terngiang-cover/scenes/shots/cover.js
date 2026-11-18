// cover.js — cover #13: satu gelembung kritik merah-oranye raksasa menindih sembilan gelembung pujian kecil; teks di pita tengah (aman crop 3:4).
import { E, V, S, registerShot, mood, backdrop, alpha, shade, glow, text, circle, rr, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { KRITIK, PUJI } from '../cast.js';
import { bub } from '../_util.js';

registerShot('c01', { draw(g, t) {
  const M = mood('night'), ui = S().ui; backdrop(g, M.sky); FX.stars(g, 0, { count: 60 }); glow(g, E.W / 2, E.H * 0.7, 900, M.rim, 0.18); FX.dust(g, 0.5, { count: 30, color: M.rim, a: 0.3 });
  [[150, 1250], [350, 1420], [560, 1280], [780, 1450], [960, 1300], [220, 1560], [520, 1600], [820, 1580], [120, 1400]].forEach(([x, y], i) => bub(g, x, y, 190, 88, PUJI, ['BAGUS', 'RAPI', 'JELAS', 'KEREN', 'OKE', 'MANTAP', 'PAS', 'SIP', 'JOSS'][i], 0.8));
  bub(g, E.W / 2 + 30, 1000, 700, 310, KRITIK, 'KURANG\nMEYAKINKAN', 1, 80);
  const cy = E.H * 0.3, grd = g.createLinearGradient(0, cy - 380, 0, cy + 380); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(12,8,28,.78)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = grd; g.fillRect(0, cy - 380, E.W, 760);
  text(g, '1 KRITIK', E.W / 2, cy - 90, { size: 190, color: '#ff8a70', font: FONTS.ui, weight: 900, spacing: 4, glow: 22, glowColor: 'rgba(214,74,51,.5)' });
  text(g, '9 PUJIAN', E.W / 2, cy + 110, { size: 150, color: '#7fe0d2', font: FONTS.ui, weight: 900, spacing: 4 });
}});
