// cover.js — cover video #12: kurva lupa menetes dengan buku yang memudar di sepanjang kurva; teks di pita tengah (aman crop 3:4).
import { E, S, registerShot, alpha, glow, text, rr, seg, circle, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { buku, stabilo } from './01_kamar.js';

registerShot('c01', { draw(g, t) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H); UI.blueprint(g);
  const f = (u) => 120 + 1500 * (1 - Math.exp(-3.4 * u)) / (1 - Math.exp(-3.4));   // kurva eksponensial menurun (y)
  const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push([90 + u * 900, f(u)]); }
  seg(g, pts, 14, ui.gold);
  [[0.06, 0], [0.3, 1], [0.62, 2], [0.9, 0]].forEach(([u, i], k) => { const p = pts[Math.round(u * 80)]; g.save(); g.globalAlpha *= 1 - 0.78 * (k / 3); g.translate(p[0], p[1] - 40); g.rotate(-0.12 + k * 0.1); buku(g, 0, 0, 120, 150, i, `BAB ${i + 1}`); g.restore(); });
  for (let i = 0; i < 7; i++) circle(g, pts[56][0] + (i % 3) * 18 - 10, pts[56][1] + 30 + i * 36, 9 - i * 0.6, alpha(ui.blueprint, 0.9 - i * 0.1));
  stabilo(g, 200, 1700, 2.2, -0.3);
  const cy = E.H * 0.34;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, alpha(ui.bpBg, 0.9)); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  text(g, 'LUPA', E.W / 2, cy - 130, { size: 230, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, 'ITU WAJAR', E.W / 2, cy + 100, { size: 170, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 2, glow: 22, glowColor: alpha(ui.gold, 0.5) });
}});
