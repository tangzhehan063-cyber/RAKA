// cover.js — cover video #8: Doni duduk di sofa masih bertas, HP menyala, senja. Teks "BELUM PULANG" di pita tengah (aman crop 3:4).
import { E, V, S, registerShot, layer, alpha, glow, rr, seg, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, headPos } from '/engine/rig2d.js';
import { ruang, GY, seatX } from '../sets/ruang.js';
import { DONI } from '../cast.js';

const SIT = { ...POSES.sit, head: [9, -176], eF: [20, -112], hF: [34, -138], eB: [10, -110], hB: [30, -134] };
registerShot('c01', { draw(g, t) {
  const cam = { z: 1.5, x: 240, y: 20 };
  const { GY: G } = ruang(g, 0.4, cam, { mood: 'dusk', min: 75, door: 1, dim: 0.12 });
  layer(g, cam, 1, (g) => {
    const f = { x: seatX(), y: G + 8, s: 1.5, facing: -1, outfit: DONI, pose: SIT, expr: 'sleepy', look: [-0.6, 0.8], blink: false, rim: { color: '#ffd49a', dir: [-1, -0.3], w: 5 } };
    const p = f.pose, mid = [(p.sh[0] + p.hip[0]) / 2, (p.sh[1] + p.hip[1]) / 2], bx = f.x + f.facing * (mid[0] - 28) * f.s, by = f.y + mid[1] * f.s - 6 * f.s;
    g.save(); g.translate(bx, by); rr(g, -24 * f.s, -44 * f.s, 48 * f.s, 90 * f.s, 10 * f.s); const gr = g.createLinearGradient(0, -44 * f.s, 0, 46 * f.s); gr.addColorStop(0, '#e8684e'); gr.addColorStop(1, '#a3321f'); g.fillStyle = gr; g.fill(); g.restore();
    drawFigure(g, f);
    const px = f.x + f.facing * p.hF[0] * f.s + f.facing * 6, py = f.y + p.hF[1] * f.s - 10, [hx, hy, hr] = headPos(f);
    glow(g, (px + hx) / 2, (py + hy) / 2, hr * 3, '#bfe4ff', 0.3);
    g.save(); g.translate(px, py); g.rotate(0.35); rr(g, -14, -26, 28, 52, 6); g.fillStyle = '#0a0f12'; g.fill(); g.strokeStyle = '#bfe4ff'; g.lineWidth = 3; g.stroke(); g.restore();
  });
  const cy = E.H * 0.34, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.66)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  glow(g, E.W / 2, cy - 60, 540, ui.gold, 0.3);
  text(g, 'SUDAH DI RUMAH, TAPI', E.W / 2 + 120, cy - 330, { size: 52, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: 0.95 });
  text(g, 'BELUM', E.W / 2, cy - 120, { size: 290, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'PULANG', E.W / 2, cy + 140, { size: 190, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
}});
