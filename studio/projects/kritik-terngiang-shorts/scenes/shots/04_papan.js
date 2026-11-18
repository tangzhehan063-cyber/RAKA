// 04_papan.js — s12: blueprint "bobot di otak" (ilustrasi): 9 pujian (bar kecil terbagi 9) vs 1 kritik (bar panjang menyala). Gaya blueprint GrowKaz, tanpa angka klaim.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { KRITIK, PUJI } from '../cast.js';

registerShot('s12', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = UI.bpStroke(), x0 = 150, x1 = E.W - 110;
  const row = (y, label, color, frac, segs, who) => {
    text(g, label, x0, y - 74, { size: 46, color, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    UI.lineFigure(g, { x: x1 - 40, y: y + 40, s: 0.62, pose: who, color: alpha(color, 0.9) });
    rr(g, x0, y - 30, x1 - x0 - 120, 60, 30); g.fillStyle = alpha(color, 0.1); g.fill();
    const w = Math.max(60, (x1 - x0 - 120) * frac); rr(g, x0, y - 30, w, 60, 30); g.fillStyle = color; g.fill(); glow(g, x0 + w, y, 70, color, 0.5);
    for (let i = 1; i < segs; i++) seg(g, [[x0 + (w / segs) * i, y - 30], [x0 + (w / segs) * i, y + 30]], 4, alpha('#000', 0.35));
  };
  text(g, 'BOBOT DI OTAK', E.W / 2, 330, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0, 0.4)) });
  text(g, '(ilustrasi, bukan angka)', E.W / 2, 392, { size: 28, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.2, 0.6)) });
  row(640, '9 PUJIAN', PUJI, 0.34 * ease.inOut(prog(t, 0.5, 1.5)), 9, POSES.stand);
  row(1000, '1 KRITIK', KRITIK, 0.96 * ease.inOut(prog(t, 1.4, 2.6)), 1, POSES.ready);
  UI.badge(g, { str: 'BURUK > BAIK', a: ease.out(prog(t, 2.4, 2.9)), size: 40 });
} });
