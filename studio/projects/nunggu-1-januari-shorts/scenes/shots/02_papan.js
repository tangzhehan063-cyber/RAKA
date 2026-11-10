// 02_papan.js — the research as FEED CARDS: resolutions, "not alone", Wharton diet-search spike,
// gym spikes, the dark side, effort shrinking while waiting, the free blank page, SENIN/BESOK/MALAM INI.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, text, FONTS, veil } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { shoes } from '../sets/bedroom.js';
import { marker, countCal } from '../sets/kalender.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];   // ends y=1270, above the caption band
const RED = '#d64a33';
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });

function cardAt(g, dy, draw, o = {}) {
  const [x, y, w, h] = CARD;
  g.save(); g.translate(0, dy);
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g); if (o.dark) veil(g, '#000', o.dark); draw(g, S().ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(o.edge || '#7dffb0', 0.35); g.lineWidth = 4; g.stroke();
  g.restore();
}
function page(g) { g.fillStyle = '#04100b'; g.fillRect(0, 0, E.W, E.H); rr(g, CARD[0], 1440, CARD[2], 600, 50); g.fillStyle = alpha('#1d5a44', 0.35); g.fill(); }
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
// a feed of several cards; times[i] = when card i becomes current (internal swipe up, 0.28 s)
function feed(g, t, times, draws, o = {}) {
  page(g);
  let pos = 0; times.forEach((ti, i) => { if (i > 0) pos += ease.inOut(prog(t, ti - 0.28, ti)); });
  const gap = E.H * 0.72;
  draws.forEach((d, i) => { const dy = (i - pos) * gap; if (Math.abs(dy) < E.H) cardAt(g, dy, (g, ui, bp) => d(g, ui, bp, t - (times[i] ?? 0)), o); });
}

// s03 — Mulai olahraga / nabung / jadi orang baru
function piggy(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.ellipse(0, 0, 150, 110, 0, 0, Math.PI * 2); g.fillStyle = '#e9a0a8'; g.fill();
  circle(g, 120, -20, 40, '#e9a0a8'); circle(g, 150, -20, 22, '#d07c88'); circle(g, 60, -40, 10, '#1a1622');
  for (const lx of [-80, -20, 40, 90]) { rr(g, lx - 14, 80, 28, 50, 8); g.fillStyle = '#d07c88'; g.fill(); }
  rr(g, -40, -112, 80, 14, 6); g.fillStyle = '#1a1622'; g.fill();
  circle(g, 0, -170 + 40 * (c % 1), 34, S().ui.gold); g.restore(); }
function mirror(g, x, y, s, ui) { g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.ellipse(0, 0, 150, 210, 0, 0, Math.PI * 2); g.fillStyle = alpha('#bfe4ff', 0.25); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 12; g.stroke(); g.restore();
  drawFigure(g, { x, y: y + 150 * s, s: 1.0 * s, facing: 1, outfit: { top: 'tshirt', color: '#d64a33', head: 'none' }, pose: POSES.cheer, expr: 'joy', look: [0, 0] }); }
registerShot('s03', { draw(g, t, info) {
  const items = [['OLAHRAGA', (g, ui, k) => shoes(g, E.W / 2, 760, 3.2)], ['NABUNG', (g, ui, k) => piggy(g, E.W / 2, 760, 1.4, k)], ['ORANG BARU', (g, ui, k) => mirror(g, E.W / 2, 720, 1.2, ui)]];
  const times = [0, rel('nabung', info, 1.3) - 0.24 + 0.28, rel('jadi', info, 2.42) - 0.3 + 0.28];
  feed(g, t, times, items.map(([w, ic]) => (g, ui, bp, lt) => {
    text(g, 'MULAI 1 JAN:', E.W / 2, 330, { size: 46, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 6 });
    ic(g, ui, lt);
    const a = pop(lt, 0.15); g.save(); g.translate(E.W / 2, 1100); g.scale(a, a); text(g, w, 0, 0, { size: 120, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
  }));
} });

// s05 — "Ternyata kamu tidak sendirian." a crowd of stick people, each holding a "1 JAN" sign
registerShot('s05', { draw(g, t, info) {
  page(g);
  cardAt(g, 0, (g, ui, bp) => {
    const tt = rel('sendirian', info, 1.2);
    text(g, 'KAMU', E.W / 2, 320, { size: 70, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0, 0.3)) });
    const a = pop(t, tt); g.save(); g.translate(E.W / 2, 440); g.scale(a, a); text(g, 'TIDAK SENDIRIAN', 0, 0, { size: 92, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.5) }); g.restore();
    for (let i = 0; i < 24; i++) { const c = i % 6, r = Math.floor(i / 6), x = 190 + c * 140 + (r % 2) * 40, y = 690 + r * 150;
      const k = ease.outBack(prog(t, 0.2 + i * 0.03, 0.45 + i * 0.03)); if (k <= 0) continue;
      const col = alpha(bp, 0.9), s = k;
      circle(g, x, y - 40 * s, 14 * s, col); seg(g, [[x, y - 26 * s], [x, y + 20 * s]], 6 * s, col); seg(g, [[x - 12 * s, y + 50 * s], [x, y + 20 * s], [x + 12 * s, y + 50 * s]], 5 * s, col);
      seg(g, [[x, y - 14 * s], [x + 20 * s, y - 50 * s]], 5 * s, col);
      rr(g, x + 2 * s, y - 100 * s, 64 * s, 44 * s, 6); g.fillStyle = '#ece5d8'; g.fill();
      text(g, '1 JAN', x + 34 * s, y - 78 * s, { size: 18 * s, color: '#c4473a', font: FONTS.ui, weight: 900 }); }
  });
} });

// s06 — Wharton: Google searches for "diet" spike right after New Year (+82%)
registerShot('s06', { draw(g, t, info) {
  page(g);
  cardAt(g, 0, (g, ui, bp) => {
    const tw = rel('Wharton', info, 0.55), td = rel('diet', info, 4.0), tm = rel('melonjak', info, 4.62);
    text(g, 'PENELITI', E.W / 2, 300, { size: 44, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, 0, 0.3)) });
    const a = pop(t, tw); g.save(); g.translate(E.W / 2, 390); g.scale(a, a); text(g, 'WHARTON', 0, 0, { size: 110, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, glow: 16, glowColor: alpha(bp, 0.6) }); g.restore();
    text(g, 'PENCARIAN "DIET" DI GOOGLE', E.W / 2, 520, { size: 40, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, td - 0.6, td - 0.2)) });
    // chart
    const x0 = 140, x1 = E.W - 140, yb = 1040, xs = lerp(x0, x1, 0.62);
    seg(g, [[x0, 600], [x0, yb], [x1, yb]], 5, alpha(bp, 0.8));
    const draw = clamp((t - 1.2) / (tm - 1.2)), pts = [];
    for (let i = 0; i <= 80; i++) { const u = i / 80; if (u > draw * 1.0 + (t > tm ? 1 : 0)) break;
      const x = lerp(x0, x1, u); let y = yb - 120 - 18 * Math.sin(u * 40) - 10 * Math.sin(u * 91);
      const d = u - 0.62; if (d >= 0) y -= 260 * Math.exp(-d * 9) * ease.out(prog(t, tm - 0.1, tm + 0.25)); pts.push([x, y]); }
    if (pts.length > 1) seg(g, pts, 9, ui.gold);
    seg(g, [[xs, yb], [xs, 640]], 3, alpha(ui.accent, 0.7));
    text(g, '1 JAN', xs, yb + 50, { size: 38, color: ui.accent, font: FONTS.ui, weight: 900 });
    const b = pop(t, tm + 0.05); g.save(); g.translate(xs + 150, 700); g.scale(b, b); text(g, '+82%', 0, 0, { size: 120, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.7) }); g.restore();
    text(g, 'Dai, Milkman & Riis, Management Science, 2014', E.W / 2, 1200, { size: 26, color: alpha(bp, 0.8), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tm, tm + 0.4)) });
  });
  if (t > rel('melonjak', info, 4.62)) badge(g, '+82%');
} });

// s07 — gym visits rise at every fresh start: Monday, the 1st, a new semester
registerShot('s07', { draw(g, t, info) {
  page(g);
  cardAt(g, 0, (g, ui, bp) => {
    text(g, 'KUNJUNGAN GYM', E.W / 2, 330, { size: 70, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0, 0.3)) });
    text(g, '±12.000 anggota gym kampus', E.W / 2, 410, { size: 34, color: alpha(bp, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.3, 0.6)) });
    const marks = [['SENIN', rel('minggu', info, 2.1), 0.2], ['TGL 1', rel('bulan', info, 3.15), 0.5], ['SEMESTER', rel('semester', info, 4.1), 0.8]];
    const x0 = 140, x1 = E.W - 140, yb = 1000, pts = [];
    for (let i = 0; i <= 90; i++) { const u = i / 90, x = lerp(x0, x1, u); let y = yb - 140 - 14 * Math.sin(u * 50);
      for (const [, tm, at] of marks) y -= 210 * Math.exp(-Math.abs(u - at) * 30) * ease.out(prog(t, tm - 0.1, tm + 0.25)); pts.push([x, y]); }
    seg(g, [[x0, 560], [x0, yb], [x1, yb]], 5, alpha(bp, 0.8));
    seg(g, pts, 9, ui.gold);
    for (const [w, tm, at] of marks) { const a = pop(t, tm); if (a <= 0) continue; const x = lerp(x0, x1, at);
      g.save(); g.translate(x, yb + 60); g.scale(a, a); text(g, w, 0, 0, { size: 46, color: ui.accent, font: FONTS.ui, weight: 900 }); g.restore();
      circle(g, x, yb - 350, 14 * a, ui.gold); }
    text(g, 'Dai, Milkman & Riis, 2014', E.W / 2, 1200, { size: 28, color: alpha(bp, 0.8), font: FONTS.ui, weight: 800 });
  });
} });

// s09 — "Tapi ada sisi gelapnya." the card goes dark and cracks
registerShot('s09', { draw(g, t, info) {
  page(g);
  const tc = rel('gelapnya', info, 1.3);
  cardAt(g, 0, (g, ui, bp) => {
    const a = pop(t, 0.3); g.save(); g.translate(E.W / 2, 700); g.scale(a, a);
    text(g, 'SISI', 0, -90, { size: 110, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10 });
    text(g, 'GELAP', 0, 60, { size: 200, color: ui.accent, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.accent, 0.6) }); g.restore();
    const k = ease.out(prog(t, tc - 0.1, tc + 0.15));
    if (k > 0) { const cr = [[[520, 190], [560, 420], [500, 600], [590, 820]], [[560, 420], [760, 520]], [[500, 600], [300, 700], [220, 980]], [[590, 820], [640, 1270]]];
      for (const c of cr) { const n = Math.max(2, Math.ceil(c.length * k)); seg(g, c.slice(0, n), 5, alpha('#ffffff', 0.8)); } }
  }, { dark: 0.45 * ease.out(prog(t, 0, 1.0)), edge: '#ff7a5a' });
  const v = ease.in(prog(t, 0.6, info.dur));
  const grd = g.createRadialGradient(E.W / 2, E.H * 0.38, E.H * 0.2, E.W / 2, E.H * 0.38, E.H * 0.7); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, `rgba(0,0,0,${0.85 * v})`); g.fillStyle = grd; g.fillRect(0, 0, E.W, E.H);
} });

// s10 — follow-up study: while we wait for a fresh start, today's effort drops
registerShot('s10', { draw(g, t, info) {
  page(g);
  cardAt(g, 0, (g, ui, bp) => {
    text(g, 'PENELITIAN LANJUTAN', E.W / 2, 320, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0, 0.3)) });
    text(g, 'Koo, Dai dkk., 2020', E.W / 2, 390, { size: 32, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 0.3, 0.6)) });
    const tw = rel('menunggu', info, 2.62), tu = rel('turun', info, 5.86);
    // small countdown calendar ticking down while "waiting"
    const n = Math.max(1, 52 - Math.floor(clamp((t - tw) / (tu - tw)) * 51));
    const ca = ease.outBack(prog(t, tw - 0.1, tw + 0.2));
    if (ca > 0) { g.save(); g.translate(E.W / 2, 600); g.scale(ca, ca); g.translate(-E.W / 2, -600); countCal(g, E.W / 2, 460, { num: n, w: 260, h: 300, header: 'NUNGGU 1 JAN' }); g.restore(); }
    // effort bar
    const bx = 160, bw = E.W - 320, by = 900, bh = 110, lvl = 1 - 0.78 * ease.inOut(prog(t, tw + 0.2, tu));
    text(g, 'USAHA HARI INI', E.W / 2, by - 50, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.8, 1.2)) });
    rr(g, bx, by, bw, bh, 24); g.strokeStyle = alpha(ui.cream, 0.85); g.lineWidth = 7; g.stroke();
    rr(g, bx + 14, by + 14, (bw - 28) * lvl, bh - 28, 14); g.fillStyle = lvl > 0.5 ? ui.gold : ui.accent; g.fill();
    const a = pop(t, tu); g.save(); g.translate(E.W / 2, 1150); g.scale(a, a); text(g, 'JUSTRU TURUN', 0, 0, { size: 90, color: ui.accent, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.accent, 0.5) }); g.restore();
  });
} });

// s13 — "Padahal halaman kosong itu tidak harus menunggu kalender." a blank page breaks free; the calendar gets crossed out
registerShot('s13', { draw(g, t, info) {
  page(g);
  cardAt(g, 0, (g, ui, bp) => {
    const tk = rel('kalender', info, 3.04), free = ease.inOut(prog(t, 0.4, 2.2));
    countCal(g, E.W / 2 - 150 * free, 330, { num: 52, w: 340, h: 400, header: 'MENUJU 1 JAN' });
    // the blank page floating free to the right
    const px = E.W / 2 + 40 + 180 * free, py = 330 + 20 * Math.sin(t * 2) - 60 * free;
    g.save(); g.translate(px, py + 200); g.rotate(0.12 * free); glow(g, 0, 0, 300, '#fff6dc', 0.25 * free);
    rr(g, -170, -200, 340, 400, 20); g.fillStyle = '#f4efe4'; g.fill(); text(g, 'HALAMAN', 0, -20, { size: 46, color: '#1a1622', font: FONTS.ui, weight: 900, spacing: 3 }); text(g, 'BARU', 0, 40, { size: 46, color: '#c4473a', font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
    const x = ease.out(prog(t, tk - 0.1, tk + 0.35)), cx = E.W / 2 - 150 * free, cy = 530;
    if (x > 0) { seg(g, [[cx - 170, cy - 200], [lerp(cx - 170, cx + 170, x), lerp(cy - 200, cy + 200, x)]], 18, RED);
      const x2 = ease.out(prog(t, tk + 0.2, tk + 0.55)); if (x2 > 0) seg(g, [[cx + 170, cy - 200], [lerp(cx + 170, cx - 170, x2), lerp(cy - 200, cy + 200, x2)]], 18, RED); }
    text(g, 'TIDAK HARUS NUNGGU', E.W / 2, 1060, { size: 58, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, 1.2, 1.6)) });
    text(g, 'KALENDER', E.W / 2, 1150, { size: 76, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tk - 0.2, tk + 0.1)) });
  });
} });

// s14 — Senin / Besok pagi / Malam ini: each a fresh page, swiped like a feed
registerShot('s14', { draw(g, t, info) {
  const items = [['SENIN', 'halaman baru'], ['BESOK PAGI', 'halaman baru'], ['MALAM INI', 'halaman baru']];
  const times = [0, rel('Besok', info, 1.56) - 0.2 + 0.28, rel('malam', info, 3.56) - 0.2 + 0.28];
  feed(g, t, times, items.map(([w, s], i) => (g, ui, bp, lt) => {
    glow(g, E.W / 2, 700, 420, '#fff6dc', 0.18);
    rr(g, E.W / 2 - 280, 420, 560, 560, 30); g.fillStyle = '#f4efe4'; g.fill();
    g.save(); rr(g, E.W / 2 - 280, 420, 560, 560, 30); g.clip(); g.fillStyle = '#c4473a'; g.fillRect(E.W / 2 - 280, 420, 560, 90); g.restore();
    text(g, s.toUpperCase(), E.W / 2, 465, { size: 34, color: '#fff', font: FONTS.ui, weight: 900, spacing: 6 });
    const a = pop(lt, 0.1); g.save(); g.translate(E.W / 2, 740); g.scale(a, a);
    text(g, w, 0, 0, { size: w.length > 6 ? 78 : 140, color: i === 2 ? '#c4473a' : '#1a1622', font: FONTS.ui, weight: 900 }); g.restore();
    if (i === 2) marker(g, E.W / 2 + 200, 930 - 30 * ease.out(prog(lt, 0.3, 0.8)), -0.7, 0.9);
    text(g, ['1', '2', '3'][i] + ' / 3', E.W / 2, 1150, { size: 34, color: alpha(bp, 0.8), font: FONTS.ui, weight: 900, spacing: 4 });
  }));
} });
