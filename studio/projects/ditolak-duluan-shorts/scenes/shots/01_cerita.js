// 01_cerita.js — "Ditolak Duluan": Bima kalah 1 poin dari Sandi, surat penolakan dipaku di dinding seperti piagam.
// Momen khas: papan skor 87 vs 86 (s04) + hening dengan teks diketik "harusnya itu aku" (s10).
import { E, V, S, registerShot, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { HERO, FRIEND } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const badge = (g, str, a = 1, color) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a, color });
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const RED = '#ff6f61', ICE = '#8fe8ff';
const SANDI = { ...FRIEND };

// --- props -------------------------------------------------------------------------------------------
// surat penolakan; (x,y) = pusat. frame>0 = bingkai emas seperti piagam
export function letter(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  const fr = o.frame || 0;
  if (fr > 0) { rr(g, -128, -168, 256, 336, 8); g.fillStyle = alpha('#b8862f', fr); g.fill(); rr(g, -116, -156, 232, 312, 4); g.fillStyle = alpha('#e7c46a', fr); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-100, -136, 208, 280);
  g.fillStyle = '#f4efe3'; g.fillRect(-104, -140, 208, 280);
  text(g, 'PT. MAJU JAYA', 0, -100, { size: 22, color: '#2a2a30', font: FONTS.ui, weight: 900 });
  seg(g, [[-80, -80], [80, -80]], 2, '#9a9590');
  text(g, 'MOHON MAAF,', 0, -40, { size: 21, color: '#c0392b', font: FONTS.ui, weight: 900 });
  text(g, 'ANDA BELUM LOLOS', 0, -8, { size: 18, color: '#c0392b', font: FONTS.ui, weight: 900 });
  for (let i = 0; i < 5; i++) seg(g, [[-80, 40 + i * 20], [80 - (i % 2) * 40, 40 + i * 20]], 3, '#c9c4bb');
  circle(g, 0, -134, 7, '#555'); circle(g, 0, -134, 3, '#bbb');   // paku
  g.restore();
}
function hammer(g, x, y, ang, s = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  seg(g, [[0, 0], [0, -70]], 9, '#8a5a32'); rr(g, -26, -88, 52, 22, 4); g.fillStyle = '#4a4f58'; g.fill();
  g.restore();
}
export function phone(g, x, y, s = 1, color = ICE) {
  g.save(); g.translate(x, y); g.scale(s, s); glow(g, 0, 0, 150, color, 0.3);
  rr(g, -16, -28, 32, 56, 6); g.fillStyle = '#0c0f16'; g.fill(); rr(g, -13, -24, 26, 46, 4); g.fillStyle = alpha(color, 0.9); g.fill();
  g.restore();
}
// layar HP besar (frame), callback menggambar isi layar
function bigPhone(g, draw, o = {}) {
  g.fillStyle = o.bg || '#140a10'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W / 2, 700, 900, o.glowC || '#ffb4c8', 0.18);
  rr(g, 110, 160, E.W - 220, 1110, 70); g.fillStyle = '#0c0f16'; g.fill();
  g.save(); rr(g, 130, 180, E.W - 260, 1070, 56); g.clip(); g.fillStyle = o.screen || '#f4f1f4'; g.fillRect(0, 0, E.W, E.H); draw(g); g.restore();
}

// --- kamar Bima ---------------------------------------------------------------------------------------
const WALL = [E.W * 0.66, 0];   // y diisi dari GY
function room(g, t, o = {}) {
  const r = kamar(g, t, { z: o.z ?? 1.05, x: o.cx ?? 0 }, { mood: o.mood || 'evening', clock: o.clock || '19:40', dim: o.dim || 0 });
  return r;
}
function wallLetters(g, GY, n, o = {}) {
  const y = GY - 760;
  letter(g, E.W * 0.68, y, 0.7, { frame: 0.0 });
  if (n > 1) letter(g, E.W * 0.68 + 190 * (o.k ?? 1), y + 10, 0.7 * (o.k ?? 1), { rot: 0.0 });
  return y;
}
export function hammering(g, t, info, n) {
  const r = room(g, t, { z: 1.08 + 0.03 * ease.inOut(t / info.dur) });
  const GY = r.GY, x = E.W * 0.36, s = 2.0;
  const pose = POSES.reach;
  drawFigure(g, { x, y: GY, s, facing: 1, outfit: HERO, pose: breathe(pose, t, 0.3, 1), expr: 'determined', look: [1, -0.4], blink: (t % 3) > 2.9, rim: { color: r.M.rim, dir: [1, -1] } });
  const hx = x + pose.hF[0] * s, hy = GY + pose.hF[1] * s;
  const swing = Math.sin(t * 10) > 0.6 ? -0.9 : -0.2;
  hammer(g, hx, hy, swing + 0.4, 1.4);
  letter(g, E.W * 0.68, GY - 470, 0.9, {});
  if (n > 1) letter(g, E.W * 0.68 - 250, GY - 470, 0.9, { rot: -0.03 });
  return r;
}

// s01 — hook: memaku surat penolakan
registerShot('s01', { draw(g, t, info) {
  hammering(g, t, info, 1);
  badge(g, 'DITOLAK', 1, RED);
} });
// s02 — "Lurus, kayak piagam": close-up, bingkai emas muncul
registerShot('s02', { draw(g, t, info) {
  g.fillStyle = '#2a1a14'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W / 2, 700, 800, '#ffcf8a', 0.25);
  const f = ease.out(prog(t, rel('piagam', info, 1.1), rel('piagam', info, 1.1) + 0.5));
  letter(g, E.W / 2, 720, 2.3 + 0.08 * ease.inOut(t / info.dur), { frame: f });
  if (f > 0.6) text(g, '"PIAGAM"', E.W / 2, 1180, { size: 54, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: f });
} });

// s03 — ruang tunggu seleksi akhir: dua kursi, Bima & Sandi
function office(g, t) {
  g.fillStyle = '#1b2433'; g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = '#243049'; g.fillRect(0, 0, E.W, 1150);
  rr(g, 340, 260, 400, 120, 14); g.fillStyle = '#e8eef8'; g.fill();
  text(g, 'SELEKSI AKHIR', 540, 322, { size: 44, color: '#1b2433', font: FONTS.ui, weight: 900, spacing: 3 });
  glow(g, 540, 500, 700, ICE, 0.12);
  g.fillStyle = '#121822'; g.fillRect(0, 1150, E.W, E.H);
}
export function chair(g, x, y, s = 1.9, facing = 1) { const h = 72 * s, c = '#3b475e', bx = x - facing * 60;
  rr(g, x - 70, y - h, 140, 16, 6); g.fillStyle = c; g.fill(); seg(g, [[x - 58, y - h], [x - 58, y]], 8, c); seg(g, [[x + 58, y - h], [x + 58, y]], 8, c);
  rr(g, bx - 8, y - h - 150, 16, 150, 6); g.fillStyle = c; g.fill(); }
registerShot('s03', { draw(g, t, info) {
  office(g, t);
  const GY = 1150;
  chair(g, 330, GY, 1.9, 1); chair(g, 750, GY, 1.9, -1);
  drawFigure(g, { x: 330, y: GY, s: 1.9, facing: 1, outfit: HERO, pose: breathe(POSES.sit, t, 0.3, 2), expr: 'nervous', look: [1, 0], blink: (t % 2.4) > 2.3, rim: { color: ICE, dir: [1, -1] } });
  drawFigure(g, { x: 750, y: GY, s: 1.9, facing: -1, outfit: SANDI, pose: breathe(POSES.sit, t, 0.3, 5), expr: 'neutral', look: [-1, 0], blink: (t % 2.9) > 2.8, rim: { color: ICE, dir: [-1, -1] } });
  const a1 = ease.out(prog(t, rel('Bima', info, 2.0), rel('Bima', info, 2.0) + 0.4)), a2 = ease.out(prog(t, rel('Sandi.', info, 2.8), rel('Sandi.', info, 2.8) + 0.4));
  text(g, 'BIMA', 330, 620, { size: 48, color: '#ff8a6b', font: FONTS.ui, weight: 900, spacing: 4, alpha: a1 });
  text(g, 'SANDI', 750, 620, { size: 48, color: '#7fb3ff', font: FONTS.ui, weight: 900, spacing: 4, alpha: a2 });
  badge(g, '2 ORANG', 1, ICE);
} });

// s04 — MOMEN KHAS: papan skor 87 vs 86
function board(g, t, info, o = {}) {
  g.fillStyle = '#070b12'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, 700, 900, ICE, 0.12);
  rr(g, 90, 230, E.W - 180, 920, 40); g.fillStyle = '#0f1724'; g.fill(); g.strokeStyle = alpha(ICE, 0.4); g.lineWidth = 4; g.stroke();
  text(g, 'NILAI AKHIR', E.W / 2, 330, { size: 44, color: alpha(ICE, 0.9), font: FONTS.ui, weight: 900, spacing: 10 });
}
registerShot('s04', { draw(g, t, info) {
  board(g, t, info);
  const t1 = rel('delapan', info, 0.3), p = ease.out(prog(t, t1, t1 + 1.4));
  const a = Math.round(87 * p), b = Math.round(86 * clamp(p * 1.0));
  const sh = t > rel('enam.', info, 2.7) ? shake(t, 6) : [0, 0];
  text(g, 'SANDI', 300, 480, { size: 46, color: '#7fb3ff', font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, 'BIMA', 780, 480, { size: 46, color: '#ff8a6b', font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, String(a), 300, 720, { size: 230, color: '#e8f2ff', font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ICE, 0.5) });
  text(g, String(b), 780 + sh[0], 720 + sh[1], { size: 230, color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(S().ui.gold, 0.5) });
  const l = ease.out(prog(t, rel('enam.', info, 2.7), rel('enam.', info, 2.7) + 0.4));
  if (l > 0) {
    rr(g, 200, 900, 200 * l, 80, 20); g.fillStyle = '#3fbf7f'; g.fill(); text(g, 'LOLOS', 300, 942, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, alpha: l });
    rr(g, 680, 900, 200 * l, 80, 20); g.fillStyle = RED; g.fill(); text(g, 'GAGAL', 780, 942, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, alpha: l });
    text(g, 'SELISIH 1 POIN', E.W / 2, 1080, { size: 50, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: l });
  }
} });
// s05 — "Kalah jauh masih bisa diterima": bar 87 vs 60 (oke) lalu 87 vs 86 (sakit)
registerShot('s05', { draw(g, t, info) {
  board(g, t, info);
  const row = (y, lab, v, col, at) => { const p = ease.out(prog(t, at, at + 0.7));
    text(g, lab, 160, y - 50, { size: 34, color: alpha('#fff', 0.85), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    rr(g, 160, y - 22, 760, 44, 22); g.fillStyle = alpha('#fff', 0.1); g.fill();
    rr(g, 160, y - 22, Math.max(44, 760 * v * p), 44, 22); g.fillStyle = col; g.fill(); };
  row(560, 'KALAH JAUH: 87 vs 60', 0.6, alpha('#7fb3ff', 0.8), 0.1);
  text(g, 'ya udah lah', 540, 680, { size: 40, color: alpha('#fff', 0.6), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.8, 1.2)) });
  row(880, 'KALAH TIPIS: 87 vs 86', 0.99, RED, 1.0);
} });

// s06 — malam: Bima rebahan, mata terbuka, "1 POIN" melayang
registerShot('s06', { draw(g, t, info) {
  const r = room(g, t, { mood: 'night', clock: '23:58', z: 1.08 - 0.03 * ease.inOut(t / info.dur) });
  const GY = r.GY;
  drawFigure(g, { x: E.W * 0.2, y: GY - 70, s: 2.0, facing: 1, outfit: HERO, pose: breathe(POSES.sit, t, 0.3, 4), expr: 'sad', look: [0.2, -0.8], blink: (t % 3.4) > 3.3, rim: { color: ICE, dir: [1, -1] } });
  const a = ease.out(prog(t, rel('poin', info, 0.7), rel('poin', info, 0.7) + 0.6));
  text(g, '1 POIN', E.W / 2, 560 - 20 * Math.sin(t * 1.5), { size: 110, color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(S().ui.gold, 0.5), alpha: a });
  badge(g, '23:58', 1, ICE);
} });

// s07 — feed: Sandi + ID card
registerShot('s07', { draw(g, t, info) {
  bigPhone(g, (g) => {
    const y0 = 230;
    circle(g, 230, y0 + 50, 38, '#7fb3ff'); text(g, 'sandi.p', 290, y0 + 40, { size: 38, color: '#1a1f2c', font: FONTS.ui, weight: 900, align: 'left' });
    text(g, 'first day! 🙏', 290, y0 + 82, { size: 28, color: '#6b7488', font: FONTS.ui, weight: 800, align: 'left' });
    rr(g, 170, y0 + 140, E.W - 340, 640, 24); g.fillStyle = '#ffd9e4'; g.fill();
    drawFigure(g, { x: E.W / 2, y: y0 + 760, s: 2.0, facing: 1, outfit: SANDI, pose: POSES.cheer, expr: 'joy', look: [0, 0], blink: false });
    const a = pop(t, rel('ID', info, 1.8));
    if (a > 0) { g.save(); g.translate(E.W / 2 + 150, y0 + 520); g.rotate(0.12); g.scale(a, a);
      rr(g, -90, -120, 180, 240, 14); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#3a6ea5'; g.lineWidth = 6; g.stroke();
      circle(g, 0, -40, 40, '#c9d3e6'); text(g, 'SANDI', 0, 40, { size: 30, color: '#1a1f2c', font: FONTS.ui, weight: 900 }); text(g, 'STAF', 0, 80, { size: 22, color: '#3a6ea5', font: FONTS.ui, weight: 900 }); g.restore(); }
    text(g, '♥ 248', 190, y0 + 850, { size: 38, color: '#e0453a', font: FONTS.ui, weight: 900, align: 'left' });
  });
  
} });

// s08/s09 — chat grup keluarga
function chatScreen(g, t, info, typed, sent) {
  bigPhone(g, (g) => {
    g.fillStyle = '#e9e1d8'; g.fillRect(0, 0, E.W, E.H);
    rr(g, 130, 180, E.W - 260, 120, 0); g.fillStyle = '#2f6f5e'; g.fill();
    text(g, 'KELUARGA BESAR ❤', 200, 245, { size: 34, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
    const msg = (y, who, str, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= a;
      rr(g, 170, y, 640, 130, 26); g.fillStyle = '#fff'; g.fill();
      text(g, who, 200, y + 36, { size: 26, color: '#c0392b', font: FONTS.ui, weight: 900, align: 'left' });
      text(g, str, 200, y + 88, { size: 34, color: '#1a1f2c', font: FONTS.ui, weight: 800, align: 'left' }); g.restore(); };
    msg(360, 'Om Darto', 'Selamat ya Sandi 👏', 1);
    msg(530, 'Tante Rina', 'Bima udah kerja belum? 😊', sent);
    // kotak ketik di bawah
    rr(g, 150, 1130, E.W - 300, 90, 45); g.fillStyle = '#fff'; g.fill();
    const cur = (t * 2) % 1 < 0.5 ? '|' : '';
    text(g, typed + cur, 200, 1176, { size: 32, color: '#1a1f2c', font: FONTS.ui, weight: 800, align: 'left' });
  }, { glowC: '#ffb4c8' });
}
registerShot('s08', { draw(g, t, info) {
  const a = ease.out(prog(t, rel('tante', info, 1.1), rel('tante', info, 1.1) + 0.4));
  chatScreen(g, t, info, '', a);
  
} });
const typeOut = (str, t, a, b) => str.slice(0, Math.round(str.length * clamp((t - a) / (b - a))));
registerShot('s09', { draw(g, t, info) {
  // ngetik (0.2-1.0), hapus (1.1-1.6), ngetik lagi (1.7-2.6), lalu diam
  const A = 'udah kok tan, lagi', B = 'belum tan, doain ya';
  let s = '';
  if (t < 1.0) s = typeOut(A, t, 0.2, 1.0);
  else if (t < 1.7) s = A.slice(0, Math.round(A.length * (1 - clamp((t - 1.1) / 0.5))));
  else s = typeOut(B, t, 1.7, 2.6);
  chatScreen(g, t, info, s, 1);
  if (t > 3.3) veil(g, '#000', 0.6 * clamp((t - 3.3) / 0.7));
} });

// s10 — HENING: layar gelap, "harusnya itu aku" diketik lalu dihapus
registerShot('s10', { draw(g, t, info) {
  g.fillStyle = '#020306'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W / 2, 760, 500, ICE, 0.08);
  const S1 = 'harusnya itu aku';
  let s = t < 1.3 ? typeOut(S1, t, 0.15, 1.2) : S1.slice(0, Math.round(S1.length * (1 - clamp((t - 1.5) / 0.6))));
  const cur = (t * 2) % 1 < 0.5 ? '|' : ' ';
  text(g, s + cur, E.W / 2, 760, { size: 72, color: alpha('#e8f2ff', 0.92), font: FONTS.ui, weight: 800 });
} });
