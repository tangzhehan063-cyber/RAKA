// 01_rapat.js — s01 (establishing wide) dan s04 (medium two-shot dengan gelembung komentar). Gaya GrowKaz: set kaya detail, rim light, latar depan buram, atmosfer.
import { E, V, S, registerShot, layer, ease, prog, clamp, lerp, alpha, shade, glow, rr, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rapat, mejaRapat, kursiDepan } from '../sets/rapat.js';
import { BAYU, TEMAN4, KRITIK, PUJI } from '../cast.js';

const SEAT = [CXs => CXs + 120, CXs => CXs + 330, CXs => CXs + 540];
const ink = () => ({ top: 'tshirt', color: S().ink, head: 'none' });
function peserta(g, t, G, CX, M, n = 3, s = 1.25) {
  [100, 260, 420].slice(0, n).forEach((x, i) => { FX.chair(g, CX + x + 36, G, s, shade(M.dark, -0.4)); drawFigure(g, { x: CX + x, y: G - 6, s, facing: -1, outfit: i === 1 ? TEMAN4 : ink(), pose: breathe(POSES.sit, t, 0.6, i + 2), expr: 'neutral', look: [-0.9, 0], blink: (t % 3.3 + i) > 3.2, rim: { color: M.rim, dir: [0.7, -0.5], w: 4 } }); });
}
// s01 0–2.3: establishing wide
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.18, 1.3, k), x: lerp(-20, 20, k), y: 40 };
  const { G, CX, M } = rapat(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX - 300, y: G + 6, s: 1.3, facing: 1, outfit: BAYU, pose: breathe(posesAt(t, [[0, POSES.relaxed], [1.2, POSES.explain]]), t, 0.7, 4), expr: 'smile', rim: { color: M.rim, dir: [0.2, -1], w: 5 } });
    peserta(g, t, G, CX, M, 3, 1.15); mejaRapat(g, G, CX, M, t);
  });
  kursiDepan(g, cam, M, G); FX.dust(g, t, { count: 30, color: '#ffe9c0', a: 0.3 }); FX.lensStreak(g, CX - 200, G - V(700, 900), E.W, M.key, 0.18, 3); FX.fog(g, G - 120, 260, M.fog, 0.2);
} });
// s04 7.3–10.5 (moodboard: 8.5): medium two-shot, 10 gelembung komentar, satu merah-oranye besar
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: lerp(1.22, 1.34, k), x: lerp(-30, 10, k), y: 20 };
  const { G, CX, M } = rapat(g, t, cam, { mood: 'golden', slide: 'SLIDE 4' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX - 250, y: G + 6, s: 1.55, facing: 1, outfit: BAYU, pose: breathe(posesAt(t, [[0, POSES.explain], [1.6, POSES.shrug]]), t, 0.6, 4), expr: t > 1.4 ? 'worried' : 'smile', rim: { color: M.rim, dir: [0.4, -1], w: 5 } });
    peserta(g, t, G, CX, M, 3, 1.35); mejaRapat(g, G, CX, M, t);
    const pu = ['BAGUS', 'RAPI', 'JELAS', 'KEREN', 'OKE', 'MANTAP', 'PAS', 'SIP', 'JOSS'];
    pu.forEach((s, i) => { const a = ease.outBack(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)); if (a <= 0) return; const x = CX + 50 + (i % 3) * 125 + (Math.floor(i / 3) % 2) * 30, y = G - 420 - Math.floor(i / 3) * 78 + Math.sin(t * 1.5 + i) * 6; g.save(); g.translate(x, y); g.scale(a, a); UI.bubble(g, 0, 0, { w: 112, h: 50, color: PUJI, str: s, dots: false }); g.restore(); });
    const ak = ease.outBack(prog(t, 1.5, 1.9)); if (ak > 0) { g.save(); g.translate(CX + 200, G - 700 + Math.sin(t * 2) * 8); g.scale(ak * 1.0, ak * 1.0); glow(g, 0, 0, 260, KRITIK, 0.35); rr(g, -150, -66, 300, 132, 62); g.fillStyle = KRITIK; g.fill(); g.beginPath(); g.moveTo(-60, 62); g.lineTo(-96, 112); g.lineTo(-10, 64); g.closePath(); g.fill(); text(g, 'KURANG', 0, -22, { size: 46, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 }); text(g, 'MEYAKINKAN', 0, 26, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, spacing: 1 }); g.restore(); }
  });
  kursiDepan(g, cam, M, G); FX.dust(g, t, { count: 24, color: '#ffe9c0', a: 0.28 });
} });
