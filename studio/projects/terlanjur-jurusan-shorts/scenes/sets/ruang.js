// sets/ruang.js — ruang kampus/rumah sederhana (token mood, tanpa warna pastel tetap).
// ruang(g,t,cam,{kind:'kantin'|'dosen'|'makan'|'kelas'|'teater', mood}) menggambar latar + lantai; ruangDepan() menggambar meja di depan tokoh.
import { E, V, mood, layer, rr, seg, circle, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GYr = () => E.H * V(0.8, 0.68);

export function ruang(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYr(), CX = E.W / 2, kind = o.kind || 'kantin';
  const wall = shade(M.wall, -0.15), dark = shade(M.wall, -0.5);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    if (kind === 'kantin') {
      for (let i = 0; i < 3; i++) { const x = CX - 360 + i * 360; seg(g, [[x, -E.H], [x, GY - 760]], 5, dark); g.beginPath(); g.moveTo(x - 60, GY - 700); g.lineTo(x + 60, GY - 700); g.lineTo(x + 30, GY - 760); g.lineTo(x - 30, GY - 760); g.closePath(); g.fillStyle = shade(M.practical, -0.2); g.fill(); glow(g, x, GY - 690, 330, M.practical, 0.2); }
      rr(g, CX - 420, GY - 600, 840, 230, 14); g.fillStyle = dark; g.fill(); text(g, 'MENU  KANTIN', CX, GY - 530, { size: 56, color: M.practical, font: FONTS.ui, weight: 900, spacing: 4 });
    } else if (kind === 'dosen') {
      rr(g, CX - 560, GY - 880, 420, 700, 10); g.fillStyle = dark; g.fill();
      for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { rr(g, CX - 545 + c * 45, GY - 860 + r * 170, 36, 140 - (c % 3) * 16, 4); g.fillStyle = shade(['#7a4a3a', '#3a5f7a', '#8a7a3a', '#5a3a6a'][(r + c) % 4], -0.35); g.fill(); }
      rr(g, CX + 60, GY - 760, 300, 220, 8); g.fillStyle = shade(M.practical, -0.35); g.fill(); rr(g, CX + 80, GY - 740, 260, 180, 4); g.fillStyle = shade(wall, 0.15); g.fill(); text(g, 'IJAZAH', CX + 210, GY - 650, { size: 44, color: shade(M.practical, -0.1), font: FONTS.ui, weight: 900 });
    } else if (kind === 'makan') {
      FX.windowFrame(g, { x: CX + 120, y: GY - 880, w: 380, h: 420, cols: 2, rows: 2, frame: dark, bar: 10 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); });
      seg(g, [[CX - 80, -E.H], [CX - 80, GY - 760]], 4, dark); g.beginPath(); g.arc(CX - 80, GY - 740, 90, Math.PI, 0); g.fillStyle = shade(M.practical, -0.25); g.fill(); glow(g, CX - 80, GY - 720, 520, M.practical, 0.22);
    } else if (kind === 'kelas') {
      rr(g, CX - 460, GY - 820, 920, 460, 10); g.fillStyle = shade('#e8efe6', -0.45); g.fill(); rr(g, CX - 440, GY - 800, 880, 420, 6); g.fillStyle = shade('#f1f4ee', -0.5); g.fill();
      const ink = shade(M.practical, 0.1); seg(g, [[CX - 330, GY - 690], [CX - 120, GY - 690], [CX - 120, GY - 560], [CX - 330, GY - 560], [CX - 330, GY - 690]], 6, ink); seg(g, [[CX - 330, GY - 560], [CX - 230, GY - 640], [CX - 120, GY - 560]], 6, ink); text(g, 'DESAIN PRODUK', CX + 190, GY - 640, { size: 46, color: ink, font: FONTS.ui, weight: 900 });
    } else if (kind === 'teater') {
      g.fillStyle = shade('#8a2a2a', -0.4); g.fillRect(CX - 620, GY - 1000, 1240, 900);
      for (let i = 0; i < 9; i++) seg(g, [[CX - 620 + i * 155, GY - 1000], [CX - 620 + i * 155, GY - 100]], 36, shade('#8a2a2a', -0.55 + (i % 2) * 0.12));
      glow(g, CX, GY - 320, 760, M.practical, 0.28); text(g, 'OHIO UNIVERSITY THEATER', CX, GY - 1060, { size: 50, color: M.practical, font: FONTS.ui, weight: 900, spacing: 3 });
    }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.08);
    if (kind === 'teater') for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { rr(g, CX - 520 + c * 160, GY + 20 + r * 90, 110, 70 + r * 8, 18); g.fillStyle = shade('#8a2a2a', -0.55 + r * 0.08); g.fill(); }
    if (kind === 'kelas') for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { rr(g, CX - 480 + c * 330, GY + 80 + r * 120, 230, 24, 6); g.fillStyle = shade(M.wall, -0.5); g.fill(); }
  });
  return { GY, CX, M };
}

// meja di depan tokoh (menutupi kaki). kind: 'kantin' | 'dosen' | 'makan'
export function ruangDepan(g, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYr(), CX = E.W / 2, kind = o.kind || 'kantin';
  layer(g, cam, 1, (g) => {
    const w = kind === 'makan' ? 760 : kind === 'dosen' ? 560 : 900, x = o.x ?? (kind === 'dosen' ? CX + 140 : CX), top = GY - (kind === 'dosen' ? 150 : 110);
    rr(g, x - w / 2, top, w, 18, 6); g.fillStyle = shade(M.wall, -0.2); g.fill();
    rr(g, x - w / 2 + 14, top + 18, w - 28, GY + 8 - top - 18, 6); g.fillStyle = shade(M.wall, -0.45); g.fill();
    if (kind === 'makan') for (const dx of [-250, 0, 250]) { g.beginPath(); g.ellipse(x + dx, top - 4, 70, 12, 0, 0, Math.PI * 2); g.fillStyle = shade('#e6e0d2', -0.3); g.fill(); }
    if (kind === 'kantin') for (const dx of [-250, 250]) { g.beginPath(); g.ellipse(x + dx, top - 4, 62, 11, 0, 0, Math.PI * 2); g.fillStyle = shade('#e6e0d2', -0.3); g.fill(); }
    if (kind === 'dosen') { rr(g, x - 150, top - 8, 150, 8, 2); g.fillStyle = '#e8e2d2'; g.fill(); rr(g, x + 60, top - 40, 70, 40, 4); g.fillStyle = shade(M.practical, -0.3); g.fill(); }
  });
}
