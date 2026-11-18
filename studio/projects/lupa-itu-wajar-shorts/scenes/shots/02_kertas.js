// 02_kertas.js — adegan datar berwarna token: kalender, kertas ujian, wajah besar (ingatan memudar), kalender jeda, ujian lancar.
import { E, V, S, registerShot, blurLayer, veil, mood, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rel, hud, buku, stabilo, kamar, CAMD, TYPE } from './01_kamar.js';
import { NADIA, STABILO } from '../cast.js';

const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const bg = (g) => { const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H); };
function lembar(g, x, y, w, h, rot = 0) {   // lembar kertas (panel kartu)
  const ui = S().ui; g.save(); g.translate(x, y); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,.22)'; g.shadowBlur = 36; g.shadowOffsetY = 12; rr(g, -w / 2, -h / 2, w, h, 18); g.fillStyle = alpha(ui.blueprint, 0.16); g.fill(); g.shadowColor = 'transparent'; g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 4; g.stroke(); return { ...ui, text: ui.cream, sub: alpha(ui.cream, 0.7) };
}
function kalenderBaris(g, y, n, crossed, marks = {}, ujian = true) {   // baris kotak hari; crossed = jumlah hari dicoret; marks {i: label}
  const ui = S().ui, w = 96, gap = 14, N = n + (ujian ? 1 : 0), tot = N * w + (N - 1) * gap, x0 = E.W / 2 - tot / 2;
  for (let i = 0; i < N; i++) { const x = x0 + i * (w + gap), last = ujian && i === N - 1; rr(g, x, y, w, 120, 14); g.fillStyle = last ? alpha(STABILO, 0.15) : alpha(ui.blueprint, 0.14); g.fill(); g.strokeStyle = last ? STABILO : alpha(ui.blueprint, 0.55); g.lineWidth = last ? 6 : 3; g.stroke();
    text(g, last ? 'UJIAN' : String(i + 1), x + w / 2, y + 40, { size: last ? 22 : 38, color: last ? STABILO : ui.cream, font: FONTS.ui, weight: 900 });
    const c = clamp(crossed - i); if (c > 0 && !last) seg(g, [[x + 16, y + 70], [x + 16 + (w - 32) * c, y + 70 + 28 * c]], 8, ui.sub);
    if (marks[i]) { const a = ease.outBack(clamp(marks[i].k)); g.save(); g.translate(x + w / 2, y + 84); g.scale(a, a); rr(g, -34, -14, 68, 28, 10); g.fillStyle = STABILO; g.fill(); text(g, marks[i].s, 0, 2, { size: 18, color: '#fff', font: FONTS.ui, weight: 900 }); g.restore(); } }
}
// s05 9.5–11.5: soal dari bab yang sama
registerShot('s05', { draw(g, t, info) {
  bg(g); const ui = lembar(g, E.W / 2, 800, 780, 920, -0.02);
  text(g, 'UJIAN TENGAH SEMESTER', 0, -370, { size: 40, color: ui.text, font: FONTS.ui, weight: 900, spacing: 2 });
  ['BAB 1', 'BAB 2', 'BAB 3'].forEach((s, i) => { const a = pop(t, 0.2 + i * 0.4, 0.3); if (a <= 0) return; g.save(); g.translate(0, -190 + i * 190); g.scale(a, a);
    text(g, `SOAL ${i + 1}`, -300, 0, { size: 40, color: ui.sub, font: FONTS.ui, weight: 900, align: 'left' }); rr(g, -120, -44, 360, 88, 18); g.fillStyle = alpha(STABILO, 0.16); g.fill(); g.strokeStyle = STABILO; g.lineWidth = 5; g.stroke(); text(g, s, 60, 4, { size: 54, color: STABILO, font: FONTS.ui, weight: 900 }); g.restore(); });
  g.restore();
} });
// s07 14.4–17.4: ingat pernah belajar, halaman memudar
registerShot('s07', { draw(g, t, info) {
  bg(g); const ui = S().ui, cx = E.W / 2 - 20, cy = 820, r = 260, tp = rel('pernah', info, 1.9);
  glow(g, cx, cy, 700, ui.blueprint, 0.1);
  bigFace(g, cx, cy, r, { outfit: NADIA, expr: 'confused', blink: (t % 3.2) > 3.08, look: [0.2, 0.4], rimColor: ui.cream, rimSide: 1, tilt: 0.03 });
  ['BAB 1', 'BAB 2', 'BAB 3'].forEach((s, i) => { const a = ease.out(prog(t, tp - 0.4 + i * 0.2, tp + 0.1 + i * 0.2)) * (1 - ease.inOut(prog(t, tp + 0.6 + i * 0.25, tp + 1.8 + i * 0.25)) * 0.95); if (a <= 0.01) return;
    g.save(); g.globalAlpha *= a; g.translate(cx - 300 + i * 300, 300 - (i % 2) * 40 - ease.inOut(prog(t, tp + 0.6, 3)) * 30); g.rotate((i - 1) * 0.1); buku(g, 0, 0, 130, 160, i, s); g.restore(); });
} });
