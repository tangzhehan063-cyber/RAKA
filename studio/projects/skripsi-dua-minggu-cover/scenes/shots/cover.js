// cover.js — cover video #9: Bima di meja malam, laptop tertutup tumpukan kertas "2 MINGGU". Teks di pita tengah (aman crop 3:4).
import { E, S, registerShot, alpha, glow, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { kos, CAMD, TYPE } from '../sets/_kos.js';

registerShot('c01', { draw(g, t) {
  kos(g, 0.4, CAMD(2.4, 720, 1305, 540, 1520), { mood: 'night', clock: '23:40', lamp: 0.8, doc: 0.5, notes: 8, screen: 0.8, rim: '#a9b8ff',
    bima: { pose: { ...POSES.sit, head: [14, -170], sh: [6, -142], eF: [30, -150], hF: [16, -176], eB: [28, -110], hB: [60, -114] }, expr: 'worried', look: [1, -0.2] } });
  const cy = E.H * 0.34, ui = S().ui;
  const grd = g.createLinearGradient(0, cy - 430, 0, cy + 430);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, 'rgba(0,0,0,.66)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, cy - 430, E.W, 860);
  glow(g, E.W / 2, cy - 60, 540, ui.gold, 0.3);
  text(g, 'SKRIPSI KELAR DALAM', E.W / 2, cy - 330, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: 0.95 });
  text(g, '2 MINGGU', E.W / 2, cy - 120, { size: 210, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) });
  text(g, 'LAGI...', E.W / 2, cy + 120, { size: 170, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, stroke: 18, strokeColor: 'rgba(0,0,0,.85)' });
}});
