// 02_papan.js — riset Wang, Jones & Wang 2019 (style retro) + penutup di kamar (ember) + loop.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, text, FONTS, veil } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { HERO } from '../cast.js';
import { letter, hammering } from './01_cerita.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const OR = '#ff8a5b', BL = '#7fb3ff';

function card(g, draw) {
  g.fillStyle = '#0d0504'; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD;
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g); draw(g, S().ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(S().ui.blueprint, 0.4); g.lineWidth = 4; g.stroke();
}
// titik-titik ilmuwan: 20 kolom; posisi i -> (x,y)
const DOT = (i, y0) => [150 + (i % 20) * 41, y0 + Math.floor(i / 20) * 40];

registerShot('s11', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    text(g, 'RISET', E.W / 2, 290, { size: 40, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 10 });
    const a = pop(t, rel('penelitian', info, 0.4));
    g.save(); g.translate(E.W / 2, 400); g.scale(a, a);
    text(g, 'WANG, JONES & WANG', 0, 0, { size: 62, color: ui.cream, font: FONTS.ui, weight: 900 });
    text(g, 'Nature Communications, 2019', 0, 62, { size: 34, color: alpha(ui.cream, 0.7), font: FONTS.serif, italic: true }); g.restore();
    const tc = rel('seribu', info, 1.6), p = ease.out(prog(t, tc, tc + 1.5)), n = Math.floor(200 * p);
    for (let i = 0; i < n; i++) { const [x, y] = DOT(i, 560); circle(g, x, y, 11, alpha(bp, 0.85)); }
    if (p > 0) text(g, Math.round(1184 * p).toLocaleString('id-ID') + ' ILMUWAN MUDA', E.W / 2, 1080, { size: 66, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) });
    text(g, 'Hibah riset NIH, 1990–2005', E.W / 2, 1170, { size: 32, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 2, alpha: p });
  });
  badge(g, 'DATA');
} });
// garis batas lolos; atas = lolos tipis (biru), bawah = gagal tipis (oranye)
function split(g, t, ui, bp, k, leave = 0) {
  const LY = 720;
  seg(g, [[110, LY], [E.W - 110, LY]], 6, ui.gold);
  text(g, 'BATAS LOLOS', E.W - 130, LY - 30, { size: 30, color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', spacing: 3 });
  for (let i = 0; i < 100; i++) { const [x, y] = DOT(i, 0);
    const up = [x, 400 + (y / 40) * 40 * 0.9 + 60], dn = [x, 800 + (y / 40) * 40 * 0.9 + 40];
    circle(g, up[0], lerp(LY - 10, up[1], k), 11, alpha(BL, 0.9));
    const gone = (i * 37 % 100) / 100 < 0.35 ? leave : 0;
    circle(g, dn[0] + gone * 900 * (i % 2 ? 1 : -1), lerp(LY + 10, dn[1], k), 11, alpha(OR, 0.9 * (1 - gone))); }
  text(g, 'LOLOS TIPIS', E.W / 2, 330, { size: 52, color: BL, font: FONTS.ui, weight: 900, spacing: 3, alpha: k });
  if (!leave) text(g, 'GAGAL TIPIS', E.W / 2, 1150, { size: 52, color: OR, font: FONTS.ui, weight: 900, spacing: 3, alpha: k });
}
registerShot('s12', { draw(g, t, info) {
  card(g, (g, ui, bp) => split(g, t, ui, bp, ease.inOut(prog(t, 0.2, 1.4))));
  badge(g, 'NYARIS');
} });
registerShot('s13', { draw(g, t, info) {
  card(g, (g, ui, bp) => { split(g, t, ui, bp, 1, ease.in(prog(t, 0.3, 1.6)));
    text(g, 'BANYAK YANG BERHENTI', E.W / 2, 1150, { size: 50, color: '#ff6f61', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.6, 1.0)) }); });
  badge(g, 'KELUAR');
} });
// grafik 10 tahun: gagal tipis yang bertahan menyalip
registerShot('s14', { draw(g, t, info) {
  card(g, (g, ui, bp) => {
    const x0 = 160, x1 = E.W - 160, yTop = 420, yBot = 1000;
    seg(g, [[x0, yTop - 60], [x0, yBot], [x1, yBot]], 4, alpha(bp, 0.6));
    text(g, 'DAMPAK KARYA', x0 + 10, yTop - 90, { size: 32, color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
    const ts = rel('sepuluh', info, 0.9), p = ease.inOut(prog(t, ts, ts + 2.8));
    for (let y = 0; y <= 10; y += 2) { const xx = lerp(x0, x1, y / 10); text(g, String(y), xx, yBot + 40, { size: 28, color: alpha(ui.cream, 0.6), font: FONTS.ui, weight: 900 }); }
    text(g, 'TAHUN', E.W / 2, yBot + 90, { size: 30, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 4 });
    const line = (f, col, lab) => { const N = 40, pts = []; for (let i = 0; i <= N * p; i++) { const u = i / N; pts.push([lerp(x0, x1, u), lerp(yBot, yTop, f(u))]); }
      if (pts.length > 1) { seg(g, pts, 12, col); const e = pts[pts.length - 1]; circle(g, e[0], e[1], 16, col);
        text(g, lab, e[0] - 10, e[1] + (col === BL ? 50 : -44), { size: 36, color: col, font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(p * 3 - 2) }); } };
    line(u => 0.35 + 0.3 * u, BL, 'DULU LOLOS');
    line(u => 0.25 + 0.7 * u * u, OR, 'GAGAL TIPIS, LANJUT');
    const q = ease.out(prog(t, rel('dulu', info, 4.6), rel('dulu', info, 4.6) + 0.4));
    text(g, 'MENYALIP', E.W * 0.4, 820, { size: 64, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5), alpha: q });
  });
  badge(g, '10 TAHUN');
} });

// penutup di kamar
function room(g, t, o = {}) { return kamar(g, t, { z: o.z ?? 1.05, x: 0 }, { mood: 'evening', clock: '20:15', lamp: 1 }); }
registerShot('s15', { draw(g, t, info) {
  const r = room(g, t, { z: 1.1 - 0.04 * ease.inOut(t / info.dur) });
  const GY = r.GY, x = E.W * 0.4;
  drawFigure(g, { x, y: GY, s: 2.0, facing: 1, outfit: HERO, pose: breathe(POSES.sit, t, 0.3, 3), expr: 'determined', look: [1, 0.3], blink: (t % 3) > 2.9, rim: { color: r.M.rim, dir: [1, -1] } });
  // laptop
  const lx = x + 200, ly = GY - 300;
  rr(g, lx - 110, ly - 140, 220, 140, 10); g.fillStyle = '#1b2433'; g.fill(); rr(g, lx - 100, ly - 130, 200, 120, 6); g.fillStyle = '#dfe9ff'; g.fill();
  text(g, 'LAMARAN #2', lx, ly - 70, { size: 26, color: '#1b2433', font: FONTS.ui, weight: 900 });
  rr(g, lx - 130, ly, 260, 16, 6); g.fillStyle = '#2a3446'; g.fill();
  glow(g, lx, ly - 70, 300, '#dfe9ff', 0.2);
  const a = ease.out(prog(t, rel('wajar.', info, 1.0), rel('wajar.', info, 1.0) + 0.4));
  text(g, 'SAKIT ITU WAJAR', E.W / 2, 420, { size: 64, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: a, glow: 18, glowColor: alpha(S().ui.gold, 0.4) });
} });
registerShot('s16', { draw(g, t, info) {
  g.fillStyle = '#2a1a14'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, 700, 800, '#ffcf8a', 0.22);
  letter(g, E.W / 2, 720, 2.0, { frame: 1 });
  const a = ease.out(prog(t, rel('rugi', info, 1.1), rel('rugi', info, 1.1) + 0.4));
  rr(g, 120, 1060, E.W - 240, 170, 30); g.fillStyle = alpha('#000', 0.6 * a); g.fill();
  text(g, 'YANG RUGI:', E.W / 2, 1110, { size: 44, color: alpha('#fff', 0.85), font: FONTS.ui, weight: 900, spacing: 4, alpha: a });
  const b = ease.out(prog(t, rel('berhenti.', info, 2.5), rel('berhenti.', info, 2.5) + 0.4));
  text(g, 'YANG BERHENTI', E.W / 2, 1180, { size: 62, color: '#ff6f61', font: FONTS.ui, weight: 900, spacing: 4, alpha: b });
} });
// s17 — loop: surat kedua dipaku di samping yang pertama
registerShot('s17', { draw(g, t, info) { hammering(g, t, info, 2); } });
