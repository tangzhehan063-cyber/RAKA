// 03_papan.js — papan blueprint & kartu bab: s03 s09 s10 s13 s17 s24 s25 s27 s28 s29 s30 s31 s32 s34 s35 s43.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, ring, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { HINA } from '../cast.js';
import { rel, pop } from '../_util.js';
const GOOD = '#4fb3a5';
const gold = () => S().ui.gold, cream = () => S().ui.cream;
const head = (g, t, big, small, y = 420, at = 0.1) => { const ui = S().ui, a = ease.out(prog(t, at, at + 0.5)); text(g, big, E.W / 2, y, { size: big.length > 8 ? 112 : 150, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: a, glow: 22, glowColor: alpha(ui.gold, 0.4) }); if (small) text(g, small, E.W / 2, y + 100, { size: 46, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a }); };
const stamp = (g, t, at, str, x, y, col = HINA, rot = -0.12, size = 70) => { const k = ease.outBack(prog(t, at, at + 0.25)); if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(2 - k, 2 - k); g.globalAlpha *= clamp(k); rr(g, -size * 2.4, -size * 0.75, size * 4.8, size * 1.5, 12); g.strokeStyle = col; g.lineWidth = 8; g.stroke(); text(g, str, 0, size * 0.04, { size, color: col, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); };
// kartu bab
function bab(g, t, no, l1, l2) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, k = ease.out(prog(t, 0, 0.35));
  g.save(); g.globalAlpha *= k; text(g, String(no), cx, 600, { size: 460, color: alpha(ui.gold, 0.18), font: FONTS.ui, weight: 900 }); text(g, `BAB ${no}`, cx, 520, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10 });
  seg(g, [[cx - 200, 600], [cx + 200, 600]], 5, ui.gold); text(g, l1, cx, 760, { size: 88, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 22, glowColor: alpha(ui.gold, 0.45) }); text(g, l2, cx, 880, { size: 88, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, glow: 22, glowColor: alpha(ui.gold, 0.45) }); g.restore();
}
registerShot('s09', { draw(g, t) { bab(g, t, 1, 'YANG SUDAH', 'DIBAYAR'); } });
registerShot('s17', { draw(g, t) { bab(g, t, 2, 'KATA', 'ORANG'); } });
registerShot('s35', { draw(g, t) { bab(g, t, 3, 'YANG BELUM', 'DIBAYAR'); } });
// s03 4.6–7.2
registerShot('s03', { draw(g, t, info) { UI.blueprint(g); head(g, t, 'SEMESTER 5', null, 520); text(g, 'TEKNIK SIPIL', E.W / 2, 700, { size: 92, color: cream(), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.6, 1.1)) }); } });
// s10 23.3–25.84: 4 kuitansi UKT
registerShot('s10', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'UKT', null, 330);
  for (let i = 0; i < 4; i++) { const x = 255 + (i % 2) * 570, y = 640 + Math.floor(i / 2) * 400, k = pop(t, 0.2 + i * 0.35, 0.25); if (k <= 0) continue; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -230, -160, 460, 320, 18); g.fillStyle = '#efe6cf'; g.fill(); text(g, `SEMESTER ${i + 1}`, 0, -90, { size: 44, color: '#2a2f3a', font: FONTS.ui, weight: 900 }); for (let j = 0; j < 3; j++) seg(g, [[-170, -20 + j * 44], [170 - j * 50, -20 + j * 44]], 8, 'rgba(40,50,70,.35)'); g.restore(); stamp(g, t, 0.55 + i * 0.35, 'LUNAS', x + 30, y + 60, '#2f7a5a', -0.14, 40); }
} });
// s13 32.66–35.68: tiga hal hangus
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'KALAU PINDAH', null, 330);
  [['UKT 4 SEMESTER', 700], ['DIKTAT', 880], ['KEBANGGAAN IBU', 1060]].forEach(([s, y], i) => { const a = ease.out(prog(t, 0.3 + i * 0.3, 0.7 + i * 0.3)); text(g, s, E.W / 2, y, { size: 64, color: cream(), font: FONTS.ui, weight: 900, spacing: 3, alpha: a }); const k = ease.out(prog(t, 1.1 + i * 0.35, 1.4 + i * 0.35)); if (k > 0) seg(g, [[E.W / 2 - 330, y], [E.W / 2 - 330 + 660 * k, y]], 10, HINA); });
  stamp(g, t, 2.1, 'HANGUS', E.W / 2 + 40, 1170, HINA, -0.1, 84);
} });
// s24 64.3–69.2: semua orang ngitung dari yang udah lewat
registerShot('s24', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  text(g, 'YANG UDAH LEWAT', 300, 460, { size: 56, color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  seg(g, [[170, 520], [170, 1200]], 5, alpha(ui.gold, 0.5));
  [['TEMAN', 640], ['DOSEN', 800], ['BAPAK', 960], ['DIMAS', 1120]].forEach(([s, y], i) => { const k = ease.out(prog(t, 0.6 + i * 0.7, 1.1 + i * 0.7)); if (k <= 0) return; const x = lerp(820, 340, k); rr(g, x - 130, y - 44, 260, 88, 22); g.fillStyle = i === 3 ? HINA : alpha(ui.cream, 0.14); g.fill(); text(g, s, x, y + 4, { size: 44, color: i === 3 ? '#fff' : ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); seg(g, [[x - 150, y], [200, y]], 6, alpha(ui.cream, 0.55)); });
} });
// s25 69.2–72.0: 1985 Arkes & Blumer
registerShot('s25', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, '1985', null, 520); const tn = rel('Arkes', info, 1.4), ui = S().ui;
  text(g, 'HAL ARKES & CATHERINE BLUMER', E.W / 2, 700, { size: 46, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, tn - 0.1, tn + 0.3)) });
  text(g, 'Organizational Behavior and Human Decision Processes', E.W / 2, 770, { size: 28, color: alpha(UI.bpStroke(), 0.95), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tn + 0.3, tn + 0.7)) });
} });
// tiket
function tiket(g, x, y, price, label, col, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -190, -110, 380, 220, 20); g.fillStyle = col; g.fill(); circle(g, -190, 0, 26, S().ui.bpBg || '#0a1420'); circle(g, 190, 0, 26, S().ui.bpBg || '#0a1420'); seg(g, [[110, -90], [110, 90]], 3, 'rgba(0,0,0,.35)'); text(g, price, -30, -10, { size: 92, color: '#1a1a1a', font: FONTS.ui, weight: 900 }); text(g, label, -30, 66, { size: 26, color: '#1a1a1a', font: FONTS.ui, weight: 900, spacing: 2 }); text(g, 'TIKET', 150, 0, { size: 24, color: '#1a1a1a', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
// s27 75.5–79.25: tiga harga
registerShot('s27', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'TIKET MUSIM', null, 380);
  [['$15', 'HARGA PENUH', '#e8d9a0', 560], ['$13', 'DISKON $2', '#d9b88a', 820], ['$8', 'DISKON $7', '#c9967a', 1080]].forEach(([p, l, c, y], i) => { const k = pop(t, 0.3 + i * 0.5, 0.3); if (k > 0) tiket(g, E.W / 2 - 40, y, p, l, c, k); });
} });
// s28 79.25–83.81: harga diacak
registerShot('s28', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'DIACAK', null, 380);
  const cols = ['#e8d9a0', '#d9b88a', '#c9967a'], P = ['$15', '$13', '$8'], L = ['PENUH', 'DISKON $2', 'DISKON $7'], ys = [560, 820, 1080], sh = ease.inOut(prog(t, 0.4, 2.2)), ord = [0, 1, 2], tgt = [2, 0, 1];
  ord.forEach((i) => { const y = lerp(ys[i], ys[tgt[i]], sh) + Math.sin(sh * Math.PI * 3 + i) * 60 * Math.sin(sh * Math.PI); tiket(g, E.W / 2 - 40 + Math.sin(sh * Math.PI * 2 + i * 2) * 90, y, P[i], L[i], cols[i], 1); });
  const a = ease.out(prog(t, 2.4, 2.9)); text(g, 'ADA YANG BAYAR PENUH', E.W / 2, 1260, { size: 42, color: gold(), font: FONTS.ui, weight: 900, spacing: 2, alpha: a });
} });
// s29 83.81–87.4: bar tiket terpakai
registerShot('s29', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'YANG BAYAR PENUH', 'LEBIH RAJIN DATANG', 330); const ui = S().ui;
  [['PENUH', 1.0, gold()], ['DISKON $2', 0.7, alpha(ui.cream, 0.6)], ['DISKON $7', 0.62, alpha(ui.cream, 0.6)]].forEach(([s, v, c], i) => { const k = ease.out(prog(t, 0.4 + i * 0.35, 1.4 + i * 0.35)), x = 220 + i * 290, h = 560 * v * k; rr(g, x, 1150 - h, 220, h, 14); g.fillStyle = c; g.fill(); text(g, s, x + 110, 1205, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900 }); });
  text(g, 'TIKET TERPAKAI (PARUH PERTAMA)', E.W / 2, 560, { size: 30, color: alpha(UI.bpStroke(), 0.95), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.2, 0.6)) });
} });
// s30 87.4–90.1: dua kursi identik
registerShot('s30', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'SAMA', 'pertunjukan sama, kursi sama', 420); const ui = S().ui;
  [[330, '$15'], [750, '$8']].forEach(([x, p], i) => { const k = pop(t, 0.3 + i * 0.4, 0.3); if (k <= 0) return; g.save(); g.translate(x, 900); g.scale(k, k); rr(g, -110, -160, 220, 200, 22); g.fillStyle = '#8a2a2a'; g.fill(); rr(g, -130, 10, 260, 90, 22); g.fillStyle = '#a63a3a'; g.fill(); seg(g, [[-90, 100], [-90, 180]], 14, '#4a1a1a'); seg(g, [[90, 100], [90, 180]], 14, '#4a1a1a'); text(g, p, 0, 260, { size: 52, color: ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); });
  text(g, '=', 540, 900, { size: 120, color: ui.cream, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 1.0, 1.4)) });
} });
// s31 90.1–95.22: uang yang udah keluar -> keputusan
registerShot('s31', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, cx = E.W / 2, tu = rel('uang', info, 1.2);
  const a = ease.out(prog(t, tu - 0.2, tu + 0.3)); text(g, 'UANG YANG', cx, 480, { size: 78, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a }); text(g, 'UDAH KELUAR', cx, 580, { size: 100, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: a, glow: 20, glowColor: alpha(ui.gold, 0.4) });
  const ar = ease.out(prog(t, tu + 0.6, tu + 1.6)); seg(g, [[cx, 680], [cx, 680 + 340 * ar]], 8, ui.cream); if (ar > 0.9) { seg(g, [[cx - 40, 980], [cx, 1030]], 8, ui.cream); seg(g, [[cx + 40, 980], [cx, 1030]], 8, ui.cream); }
  for (let i = 0; i < 6; i++) { const p = ((t * 0.7 + i / 6) % 1), y = 700 + 330 * p * ar; if (ar > 0.1) { circle(g, cx + Math.sin(i * 2.1) * 70, y, 22, ui.gold); } }
  const b = pop(t, tu + 1.8, 0.4); if (b > 0) { g.save(); g.translate(cx, 1160); g.scale(b, b); rr(g, -280, -70, 560, 140, 30); g.fillStyle = HINA; g.fill(); text(g, 'KEPUTUSAN', 0, 8, { size: 76, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
} });
// s32 95.22–103.04: 30 dari 100 mahasiswa ganti jurusan
registerShot('s32', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, t30 = rel('persen', info, 3.6);
  text(g, 'MAHASISWA AS', E.W / 2, 330, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.2, 0.7)) });
  for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), x = 190 + c * 70, y = 520 + r * 62, k = ease.out(prog(t, 0.5 + i * 0.012, 0.8 + i * 0.012)), on = i < 30 && t > t30 + i * 0.02; g.save(); g.globalAlpha *= k; const col = on ? gold() : alpha(ui.cream, 0.3); circle(g, x, y - 16, 11, col); seg(g, [[x, y - 4], [x, y + 18]], 9, col); g.restore(); }
  const a = ease.out(prog(t, t30, t30 + 0.5)); text(g, '30%', E.W / 2, 1230, { size: 150, color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.45), alpha: a }); text(g, 'GANTI JURUSAN DALAM 3 TAHUN  ·  NCES', E.W / 2, 1130, { size: 30, color: alpha(UI.bpStroke(), 0.95), font: FONTS.ui, weight: 800, alpha: a });
} });
// s34 106.72–114.41: hening, teks diketik (dua baris)
registerShot('s34', { draw(g, t, info) {
  g.fillStyle = '#05070b'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); const ui = S().ui;
  const L1 = 'Yang udah dibayar nggak bisa balik.', L2 = 'Yang belum dibayar masih bisa dipilih.', t2 = rel('Yang', info, 2.1);
  const n1 = Math.floor(clamp((t - 0.2) / 1.6) * L1.length), n2 = Math.floor(clamp((t - 2.2) / 1.8) * L2.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L1.slice(0, n1) + (n2 === 0 ? cur : ''), E.W / 2, E.H * 0.38, { size: 58, color: ui.cream, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.cream, 0.3) });
  text(g, L2.slice(0, n2) + (n2 > 0 ? cur : ''), E.W / 2, E.H * 0.38 + 120, { size: 58, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.45) }); void t2;
} });
// s43 141.21–144.81: mata kuliah diakui / tidak
registerShot('s43', { draw(g, t, info) {
  UI.blueprint(g); head(g, t, 'KONVERSI', null, 330); const ui = S().ui;
  [['AGAMA', 1], ['BAHASA INDONESIA', 1], ['KALKULUS', 1], ['STATIKA', 0], ['BAJA', 0]].forEach(([s, ok], i) => { const y = 620 + i * 130, k = ease.out(prog(t, 0.2 + i * 0.28, 0.6 + i * 0.28)); text(g, s, 200, y, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: k }); const c = ok ? '#6fe0a0' : HINA; if (k > 0.6) { if (ok) seg(g, [[780, y], [810, y + 30], [860, y - 30]], 12, c); else { seg(g, [[780, y - 28], [850, y + 28]], 12, c); seg(g, [[850, y - 28], [780, y + 28]], 12, c); } } });
} });
