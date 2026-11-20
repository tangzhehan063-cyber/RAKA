// 08_end.js — title card (s05) dan end screen (s39 s40).
import { E, V, S, mood, registerShot, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, linGrad, rr, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { BAYU, TEMAN, SISWA } from '../cast.js';
import { rel, pop, ketik } from '../_util.js';

registerShot('s05', { draw(g, t, info) {
  const M = mood('dusk'); blurLayer(g, 10, (g) => kamar(g, t, { z: 1.25 + 0.05 * t / info.dur, x: -150, y: 40 }, { mood: 'dusk', clock: '05:10' }), null, 1); veil(g, '#000', 0.5);
  UI.titleCard(g, t, { lines: ['KALAU – MAKA'], sub: 'NIAT vs RENCANA', dur: info.dur, y: E.H * 0.4 });
  FX.dust(g, t, { count: 24, color: M.key, a: 0.3 });
} });
function akhir(g, t, info, typed) {
  const ui = S().ui, M = mood('night');
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0b1020', '#1a1530', '#2a1c2e']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.82, E.W * 0.55, '#ff9a5a', 0.25);
  const a = ease.out(prog(t, 0.1, 0.7));
  ['Momen apa yang', 'selalu bikin', 'rencanamu kalah?'].forEach((s, i) => text(g, s, E.W / 2, E.H * 0.2 + i * 120, { size: 92, font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: a, glow: 18, glowColor: 'rgba(255,170,90,.5)' }));
  const b = pop(t, 0.9, 0.35); if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.4); g.scale(b, b); UI.bubble(g, 0, 0, { w: 760, h: 150, color: '#f4efe6', dots: !typed, str: typed || null }); g.restore(); }
  const cast = [BAYU, TEMAN, SISWA, { top: 'tshirt', color: '#7a8a4f', head: 'none' }, { top: 'tshirt', color: '#b5527a', head: 'none' }];
  cast.forEach((of, i) => { const k = ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); drawFigure(g, { x: E.W / 2 + (i - 2) * 190, y: E.H * 0.6 + (1 - k) * 40, s: 1.15, facing: 1, outfit: of, pose: breathe(POSES.relaxed, t, 0.5, i), expr: 'smile', alpha: k, rim: { color: '#ffb070', dir: [0, -1], w: 4 } }); });
  FX.dust(g, t, { count: 20, color: '#ffb070', a: 0.25 });
}
registerShot('s39', { draw(g, t, info) { akhir(g, t, info, null); } });
registerShot('s40', { draw(g, t, info) { const at = rel('kalau', info, 0.8); akhir(g, t + 2.0, info, ketik('KALAU ... MAKA ...', t, at, at + 1.2)); } });
