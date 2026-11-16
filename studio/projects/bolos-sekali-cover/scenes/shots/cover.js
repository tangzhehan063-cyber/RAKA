// cover.js — cover video #10: Rani menyantap gorengan, kotak bekal merah-oranye tertutup di belakang. Teks di pita tengah (aman crop 3:4).
import { E, S, registerShot, alpha, glow, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { pantri, kotak, boxGorengan, bungkus } from './01_pantri.js';

const CAMD = (z, fx = 520, fy = 1130, sx = 540, sy = 1100) => { const zz = 1 + (z - 1) * 0.85; return { z, x: (fx - 540 - (sx - 540) / zz) / 0.85, y: (fy - 960 - (sy - 960) / zz) / 0.85 }; };
const EAT = { ...POSES.sit, head: [14, -178], sh: [6, -146], eF: [40, -160], hF: [34, -200], eB: [28, -110], hB: [60, -114] };

registerShot('c01', { draw(g, t) {
  pantri(g, 0.4, CAMD(2.2, 500, 1130, 540, 1330), { mood: 'day', rani: { pose: EAT, expr: 'joy', look: [0.7, -0.1] },
    items: (g, top, tx) => { kotak(g, tx - 160, top, 0.46, { dust: 0.5 }); boxGorengan(g, tx + 10, top, 0.62, 6); bungkus(g, tx + 70, top, 4, 0.7); } });
  const cy = E.H * 0.34, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(255,250,240,0)'); grd.addColorStop(0.5, 'rgba(255,250,240,.88)'); grd.addColorStop(1, 'rgba(255,250,240,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  text(g, 'BOLOS SEKALI, BERARTI?', E.W / 2, cy - 330, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: 0.95 });
  text(g, 'SUDAH', E.W / 2, cy - 140, { size: 190, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, 'TELANJUR', E.W / 2, cy + 90, { size: 190, color: '#c0392b', font: FONTS.ui, weight: 900, spacing: 2 });
}});
