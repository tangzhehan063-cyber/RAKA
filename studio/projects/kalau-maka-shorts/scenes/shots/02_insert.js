// 02_insert.js — insert/macro (tangan raksasa, layar, kertas) + freeze-frame: s02 s04 s07 s08 s09 s10 s12 s30 s31 s33 s34 s37 s38.
import { E, V, S, mood, measure, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, ring, text, FONTS, shake } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { shoes } from '../sets/bedroom.js';
import { rel, pop, ketik, tangan, penTangan, halaman, sticky, hp } from '../_util.js';

const HERO = '#d64a33';
const bgKamar = (g, t, md, o = {}, dim = 0.6, blur = 14) => { blurLayer(g, blur, (g) => kamar(g, t, { z: 1.8, x: o.x ?? -60, y: o.y ?? 80 }, { mood: md, clock: o.clock || '05:10', lamp: o.lamp || 0, rain: o.rain }), null, 1); veil(g, '#000', dim); };

// freeze-frame: jempol melayang di atas tombol TUNDA, partikel menggantung
function freezeJempol(g, t, info, o) {
  const M = mood(o.mood), ui = S().ui;
  bgKamar(g, 0.3, o.mood, { clock: '05:10', lamp: o.lamp, rain: o.mood === 'night' }, 0.62, 16); veil(g, o.tint, 0.38);
  const cx = E.W / 2 + 40, cy = E.H * 0.46, s = 1.05, k = ease.inOut(t / info.dur), z = 1 + 0.07 * k;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  hp(g, cx, cy, s, { screen: '#0e1426', glow: o.glow });
  text(g, '05:10', cx, cy - 150 * s, { size: 150 * s, color: ui.cream, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(o.glow, 0.5) });
  text(g, 'ALARM', cx, cy - 40 * s, { size: 48 * s, color: alpha(ui.cream, 0.6), font: FONTS.ui, weight: 900, spacing: 6 });
  rr(g, cx - 130 * s, cy + 170 * s, 260 * s, 96 * s, 48 * s); g.fillStyle = ui.accent; g.fill();
  text(g, 'TUNDA', cx, cy + 220 * s, { size: 56 * s, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 });
  const bob = Math.sin(t * 1.6) * 6;
  tangan(g, { x: cx - 190, y: cy + 160 + bob, ang: -0.62, s: 1.05, sleeve: HERO, kind: 'jempol' });
  g.restore();
  FX.rings(g, cx + 150 * s, cy + 220 * s, t * 0.5, { count: 2, r0: 60, r1: 170, color: o.glow, a: 0.3 });
  FX.dust(g, t * 0.25, { count: 70, color: o.glow, a: 0.5 });
  UI.badge(g, { str: o.badge, x: E.W - V(130, 160), y: V(110, 300), a: ease.out(prog(t, 0.15, 0.5)) });
}
registerShot('s02', { draw(g, t, info) { freezeJempol(g, t, info, { mood: 'night', tint: '#0a1a2f', glow: '#8fb4ff', badge: 'SENIN KE-9' }); } });
registerShot('s33', { draw(g, t, info) { freezeJempol(g, t, info, { mood: 'dusk', tint: '#3a2208', glow: '#ffd45a', badge: 'PAGI INI', lamp: 0 }); } });

// s04 9.6–12.0: sembilan Senin, yang kesembilan menyala
registerShot('s04', { draw(g, t, info) {
  const ui = S().ui; bgKamar(g, t, 'night', { clock: '05:10' }, 0.7, 16);
  const cx = E.W / 2, y0 = E.H * 0.26, gap = 240, rk = rel('kesembilan', info, 1.6);
  for (let i = 0; i < 9; i++) {
    const at = i < 8 ? 0.1 + i * 0.12 : rk - 0.1, a = pop(t, at, 0.28); if (a <= 0) continue;
    const x = cx + ((i % 3) - 1) * 270, y = y0 + Math.floor(i / 3) * gap + 160, last = i === 8;
    g.save(); g.translate(x, y); g.scale(a, a);
    circle(g, 0, 0, 100, alpha('#000', 0.45)); ring(g, 0, 0, 100, last ? 10 : 5, last ? ui.gold : alpha(ui.cream, 0.7));
    text(g, 'SEN', 0, -42, { size: 34, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 3 }); text(g, String(i + 1), 0, 20, { size: 84, color: last ? ui.gold : ui.cream, font: FONTS.ui, weight: 900 });
    if (!last) { seg(g, [[-70, -70], [70, 70]], 9, ui.accent); seg(g, [[70, -70], [-70, 70]], 9, ui.accent); }
    else glow(g, 0, 0, 220, ui.gold, 0.35 + 0.15 * Math.sin(t * 6));
    g.restore();
  }
  FX.dust(g, t, { count: 18, color: ui.gold, a: 0.2 });
} });
// s07 17.4–20.6: buku catatan, tangan raksasa menulis SENIN MULAI LARI / 5 KM
registerShot('s07', { draw(g, t, info) {
  const ui = S().ui, ink = '#26304a'; bgKamar(g, t, 'night', { lamp: 1, clock: '22:30' }, 0.62, 16);
  const k = ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.42, z = 1 + 0.06 * k;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  halaman(g, cx, cy, 900, 1000, { rot: -0.04 });
  const a0 = rel('senin', info, 0.5), a1 = rel('lima', info, 1.9), s1 = ketik('SENIN MULAI LARI', t, a0, a1 - 0.1), s2 = ketik('5 KM', t, a1, a1 + 0.7);
  g.save(); g.translate(cx, cy); g.rotate(-0.04); g.translate(-cx, -cy);
  text(g, s1, cx - 340, cy - 80, { size: 78, color: ink, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  text(g, s2, cx - 340, cy + 80, { size: 170, color: ui.accent, font: FONTS.ui, weight: 900, align: 'left' });
  g.restore();
  g.restore();
  const e1 = cx - 340 + measure(g, s1, 78, FONTS.ui, 900) + s1.length * 2, e2 = cx - 340 + measure(g, s2, 170, FONTS.ui, 900);
  if (s2.length) penTangan(g, e2 + 10, cy + 130, 0.6); else penTangan(g, e1 + 10, cy - 70, 0.6);
  FX.dust(g, t, { count: 20, color: '#ffd45a', a: 0.3 });
} });
// s08 20.6–22.6: hurufnya ditebalin dua kali
registerShot('s08', { draw(g, t, info) {
  const ui = S().ui, ink = '#26304a'; bgKamar(g, t, 'night', { lamp: 1, clock: '22:31' }, 0.62, 16);
  const cx = E.W / 2, cy = E.H * 0.42, p = ease.inOut(prog(t, 0.2, 1.5));
  halaman(g, cx, cy, 900, 1000, { rot: -0.04 });
  g.save(); g.translate(cx, cy); g.rotate(-0.04); g.translate(-cx, -cy);
  text(g, 'SENIN MULAI LARI', cx - 340, cy - 80, { size: 78, color: alpha(ink, 0.6), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  text(g, '5 KM', cx - 340, cy + 80, { size: 170, color: alpha(ui.accent, 0.7), font: FONTS.ui, weight: 900, align: 'left' });
  g.save(); g.beginPath(); g.rect(cx - 360, cy - 200, 760 * p, 500); g.clip();
  for (const [dx, dy] of [[2.5, 0], [0, 2.5], [-2, 1], [2, -2]]) {
    text(g, 'SENIN MULAI LARI', cx - 340 + dx, cy - 80 + dy, { size: 78, color: ink, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
    text(g, '5 KM', cx - 340 + dx, cy + 80 + dy, { size: 170, color: ui.accent, font: FONTS.ui, weight: 900, align: 'left' });
  }
  g.restore(); g.restore();
  penTangan(g, cx - 340 + 760 * p, cy + 90, 0.6);
  FX.dust(g, t, { count: 20, color: '#ffd45a', a: 0.3 });
} });
// rak sepatu sederhana
const rak = (g, x, y, w, M) => { rr(g, x - w / 2, y, w, 22, 6); g.fillStyle = shade(M.wall, -0.5); g.fill(); rr(g, x - w / 2 + 14, y + 22, 18, 160, 5); g.fillStyle = shade(M.wall, -0.55); g.fill(); rr(g, x + w / 2 - 32, y + 22, 18, 160, 5); g.fill(); };
// s09 22.6–24.6: tangan raksasa menarik sepatu dari rak
registerShot('s09', { draw(g, t, info) {
  const M = mood('night'); bgKamar(g, t, 'night', { clock: '22:35', lamp: 1 }, 0.55, 14);
  const cx = E.W / 2, p = ease.inOut(prog(t, 0.3, 1.5)), sy = lerp(E.H * 0.66, E.H * 0.34, p);
  rak(g, cx, E.H * 0.7, 820, M); rak(g, cx, E.H * 0.7 - 380, 820, M);
  shoes(g, cx, sy + 24, 2.6);
  tangan(g, { x: cx - 330, y: sy + 120 + 110 * (1 - p), ang: -0.5, s: 1.0, sleeve: HERO, kind: 'buka' });
  FX.dust(g, t, { count: 22, color: '#ffd45a', a: 0.25 });
} });
// s10 24.6–27.0: difoto, lalu dimasukkan lagi
registerShot('s10', { draw(g, t, info) {
  const M = mood('night'), ui = S().ui; bgKamar(g, t, 'night', { clock: '22:36', lamp: 1 }, 0.6, 14);
  const cx = E.W / 2, cy = E.H * 0.42, fl = t > 1.0 ? ease.out(1 - prog(t, 1.0, 1.6)) : 0, back = ease.inOut(prog(t, 1.5, 2.3));
  rak(g, cx, E.H * 0.7, 820, M);
  if (t < 1.8) {
    rr(g, cx - 420, cy - 540, 840, 1080, 28); g.strokeStyle = alpha('#fff', 0.35); g.lineWidth = 4; g.stroke();
    for (const [sx, sy2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { seg(g, [[cx + sx * 380, cy + sy2 * 500 - sy2 * 60], [cx + sx * 380, cy + sy2 * 500], [cx + sx * 380 - sx * 60, cy + sy2 * 500]], 8, '#fff'); }
    circle(g, cx, cy, 8, ui.accent);
  }
  shoes(g, cx, lerp(cy + 60, E.H * 0.7 - 6, back), lerp(2.8, 2.4, back));
  if (fl > 0) { g.fillStyle = alpha('#fff', fl); g.fillRect(0, 0, E.W, E.H); }
  FX.dust(g, t, { count: 18, color: '#ffd45a', a: 0.2 });
} });
// s12 29.6–31.7: Senin depannya sama (tunda berulang)
registerShot('s12', { draw(g, t, info) {
  const ui = S().ui; bgKamar(g, t, 'dusk', { clock: '05:10' }, 0.72, 16);
  for (let r = 0; r < 5; r++) {
    const y = E.H * 0.2 + r * 180, dir = r % 2 ? -1 : 1, off = ((t * 220 * dir) % 520 + 520) % 520;
    g.save(); g.globalAlpha *= 0.85 - r * 0.08;
    for (let i = -1; i < 4; i++) { const x = i * 520 + off - 100; rr(g, x, y, 420, 96, 48); g.fillStyle = r === 2 ? ui.accent : alpha(ui.cream, 0.14); g.fill(); text(g, 'TUNDA', x + 210, y + 50, { size: 54, color: r === 2 ? '#fff' : alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 6 }); }
    g.restore();
  }
  const a = pop(t, rel('sama', info, 0.9), 0.3); if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.62); g.scale(a, a); text(g, 'SAMA LAGI', 0, 0, { size: 150, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 26, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
} });
// s30 98.3–102.8: kertas tempel raksasa, tangan menulis satu kalimat
registerShot('s30', { draw(g, t, info) {
  const ui = S().ui, ink = '#3a2a00'; bgKamar(g, t, 'night', { lamp: 1, clock: '22:42' }, 0.6, 16);
  const cx = E.W / 2, cy = E.H * 0.42, k = ease.inOut(t / info.dur), z = 1 + 0.05 * k;
  const a0 = rel('kalau', info, 0.7), a1 = rel('lantai', info, 3.3) + 0.5, L = ['KALAU ALARM BUNYI,', 'KAKIKU TURUN', 'KE LANTAI'], full = L.join('|'), typed = ketik(full, t, a0, a1).split('|');
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  sticky(g, cx, cy, 2.3, { rot: -0.03 });
  L.forEach((ln, i) => { const s = typed[i] ?? ''; text(g, s, cx - 400, cy - 250 + i * 210, { size: i === 0 ? 68 : 92, color: i === 0 ? '#b0301f' : ink, font: FONTS.ui, weight: 900, align: 'left', spacing: 1 }); });
  const li = Math.min(typed.length - 1, 2), tw = (typed[li] ?? '');
  penTangan(g, cx - 400 + measure(g, tw, li ? 92 : 76, FONTS.ui, 900) + tw.length, cy - 250 + li * 210 + 10, 0.6);
  g.restore();
  FX.dust(g, t, { count: 22, color: '#ffd45a', a: 0.3 });
} });
// s31 102.8–104.3: 5 KM dicoret
registerShot('s31', { draw(g, t, info) {
  const ui = S().ui; bgKamar(g, t, 'night', { lamp: 1, clock: '22:50' }, 0.62, 16);
  const cx = E.W / 2, cy = E.H * 0.42, p = ease.out(prog(t, 0.25, 0.8));
  halaman(g, cx, cy, 900, 1000, { rot: -0.04 });
  g.save(); g.translate(cx, cy); g.rotate(-0.04); g.translate(-cx, -cy);
  text(g, 'SENIN MULAI LARI', cx - 340, cy - 80, { size: 78, color: alpha('#26304a', 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  text(g, '5 KM', cx - 340, cy + 80, { size: 170, color: alpha(ui.accent, 0.8), font: FONTS.ui, weight: 900, align: 'left' });
  seg(g, [[cx - 380, cy + 160], [cx - 380 + 340 * p, cy + 160 - 170 * p]], 14, '#1b2236'); seg(g, [[cx - 40, cy + 160], [cx - 40 - 340 * Math.max(0, p - 0.5) * 2, cy + 160 - 170 * Math.max(0, p - 0.5) * 2]], 0.01, '#1b2236');
  g.restore();
  FX.dust(g, t, { count: 16, color: '#ffd45a', a: 0.25 });
} });
// s34 109.4–112.5: kaki turun duluan, menyentuh lantai
registerShot('s34', { draw(g, t, info) {
  const ui = S().ui, M = mood('dusk'); bgKamar(g, t, 'dusk', { clock: '05:10' }, 0.35, 12);
  const fy = E.H * 0.62, land = 0.9, p = ease.inOut(prog(t, 0.2, land)), x = E.W * 0.46, top = lerp(-200, fy - 330, p);
  g.fillStyle = alpha('#000', 0.28); g.fillRect(0, fy, E.W, E.H); glow(g, x, fy, 520, M.key, 0.28);
  shoes(g, E.W * 0.78, fy + 40, 2.6);
  seg(g, [[x, -200], [x, top + 100]], 150, S().ink);
  seg(g, [[x, top + 100], [x + 10, fy - 38]], 124, S().ink); seg(g, [[x + 10, fy - 38], [x + 180, fy - 24]], 90, S().ink);
  if (t > land) { FX.rings(g, x + 60, fy + 6, t - land, { count: 2, r0: 40, r1: 300, color: M.key, a: 0.55, speed: 1.6 }); FX.dust(g, t, { count: 30, color: M.key, a: 0.4 }); }
  const sh = shake(t, t > land && t < land + 0.35 ? 14 : 0, 14); g.save(); g.translate(sh[0], sh[1]); g.restore();
  FX.dust(g, t, { count: 22, color: M.key, a: 0.25 });
} });
// s37 118.4–121.0: dua minggu kemudian, kertas tempel sudah lecek
registerShot('s37', { draw(g, t, info) {
  const ui = S().ui, M = mood('golden'); bgKamar(g, t, 'golden', { clock: '05:40' }, 0.45, 16);
  const cx = E.W / 2, cy = E.H * 0.44, k = ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy); g.rotate(-0.06 + 0.02 * k); g.scale(1 + 0.05 * k, 1 + 0.05 * k); g.translate(-cx, -cy);
  sticky(g, cx, cy, 2.2, { crumple: true, color: shade('#f6d54a', -0.08) });
  ['KALAU ALARM BUNYI,', 'KAKIKU TURUN', 'KE LANTAI'].forEach((s, i) => text(g, s, cx - 380, cy - 240 + i * 190, { size: i === 0 ? 70 : 84, color: alpha('#3a2a00', 0.75), font: FONTS.ui, weight: 900, align: 'left' }));
  g.restore();
  glow(g, cx + 200, cy - 300, 700, M.key, 0.25);
  const a = pop(t, rel('minggu', info, 0.5), 0.3); if (a > 0) { g.save(); g.translate(E.W - 200, E.H * 0.14); g.scale(a, a); text(g, '2 MINGGU', 0, 0, { size: 64, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 18, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  FX.dust(g, t, { count: 30, color: M.key, a: 0.4 });
} });
// s38 121.0–123.9: rak sepatu kosong, sepatu sudah di samping kasur
registerShot('s38', { draw(g, t, info) {
  const M = mood('golden'), ui = S().ui; bgKamar(g, t, 'golden', { clock: '05:45', x: -140 }, 0.3, 12);
  const k = ease.inOut(t / info.dur), cx = E.W / 2 + lerp(80, -80, k);
  rak(g, cx - 120, E.H * 0.5, 820, M); rak(g, cx - 120, E.H * 0.5 - 360, 820, M);
  g.fillStyle = alpha('#000', 0.3); g.fillRect(0, E.H * 0.62, E.W, E.H); glow(g, cx + 250, E.H * 0.62, 600, M.key, 0.3);
  shoes(g, cx + 190, E.H * 0.62 + 30, 2.8);
  for (let i = 0; i < 9; i++) circle(g, cx + 250 + ((i * 53) % 210) - 60, E.H * 0.62 - 20 + ((i * 29) % 40), 4 + (i % 3) * 2, alpha('#5a3a1a', 0.7));
  FX.dust(g, t, { count: 34, color: M.key, a: 0.4 }); FX.lensStreak(g, E.W * 0.8, E.H * 0.3, E.W, '#ffe6cc', 0.25);
} });
