// 03_papan.js — riset sebagai kartu feed (blueprint, warna token): Ebbinghaus 1880-an, Murre & Dros 2015, 70 jam, kurva lupa menetes, hening.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { rel, rnd } from './01_kamar.js';

const CARD = [60, 190, E.W - 120, 1080];
function card(g, t, info, draw) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD;
  g.save(); rr(g, x, 1440, w, 600, 50); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill(); g.restore();
  g.save(); rr(g, x, y, w, h, 50); g.clip(); UI.blueprint(g);
  const z = 1 + 0.02 * ease.inOut(t / info.dur); g.translate(E.W / 2, y + h / 2); g.scale(z, z); g.translate(-E.W / 2, -(y + h / 2));
  draw(g, ui, UI.bpStroke()); g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 4; g.stroke();
}
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const SUKU = ['ZOF', 'MIB', 'KAT', 'DUR', 'WEL', 'PUZ', 'NEK', 'RIG', 'HOM', 'SAV', 'TEB', 'LUF'];
// s09 22.6–30.5: Ebbinghaus 1880-an menghafal suku kata tanpa arti
registerShot('s09', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const te = rel('Hermann', info, 2.4), ts = rel('suku', info, 4.6), tl = rel('lagi', info, 6.4);
    text(g, '1880-an', E.W / 2, 320, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.05, 0.4)) });
    text(g, 'EBBINGHAUS', E.W / 2, 420, { size: 66, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, te - 0.1, te + 0.3)) });
    SUKU.forEach((s, i) => { const c = i % 4, r = Math.floor(i / 4), x = 210 + c * 220, y = 640 + r * 130, k = pop(t, ts + i * 0.12, 0.25); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -80, -44, 160, 88, 16); g.strokeStyle = bp; g.lineWidth = 4; g.stroke(); text(g, s, 0, 4, { size: 48, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); });
    const a = pop(t, ts + 0.4, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 1060); g.scale(a, a); text(g, 'SUKU KATA TANPA ARTI', 0, 0, { size: 50, color: ui.gold, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.gold, 0.4) }); g.restore(); }
    const b = ease.out(prog(t, tl - 0.3, tl + 0.2)); text(g, 'DIUJI BERKALI-KALI', E.W / 2, 1140, { size: 36, color: alpha(bp, 0.95), font: FONTS.ui, weight: 800, spacing: 2, alpha: b });
  });
} });
// s10 30.5–36.6: Murre & Dros 2015 mengulang percobaan
registerShot('s10', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t1 = rel('Jaap', info, 2.6), t2 = rel('mengulang', info, 4.6);
    text(g, '130+ TAHUN KEMUDIAN', E.W / 2, 310, { size: 50, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.05, 0.45)) });
    text(g, '2015', E.W / 2, 450, { size: 140, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.2, 0.6)) });
    text(g, 'MURRE & DROS', E.W / 2, 600, { size: 74, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, t1 - 0.1, t1 + 0.3)) });
    text(g, 'PLoS ONE, 2015', E.W / 2, 670, { size: 32, color: alpha(bp, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, t1 + 0.2, t1 + 0.6)) });
    const a = pop(t, t2, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 900); g.scale(a, a); text(g, 'MENGULANG', 0, -30, { size: 84, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5) }); text(g, 'PERCOBAANNYA', 0, 60, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
  });
} });
// s11 36.6–39.5: satu orang, 70 jam
registerShot('s11', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t1 = rel('orang', info, 0.8), t70 = rel('70', info, 1.7), n = Math.round(70 * ease.out(prog(t, t70 - 0.2, t70 + 1.0)));
    const a = pop(t, t1, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 560); g.scale(a, a); circle(g, 0, -90, 44, ui.cream); seg(g, [[0, -46], [0, 90]], 18, ui.cream); seg(g, [[-66, -10], [0, 20], [66, -10]], 14, ui.cream); seg(g, [[-50, 190], [0, 90], [50, 190]], 14, ui.cream); g.restore(); }
    text(g, '1 ORANG', E.W / 2, 840, { size: 70, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, t1, t1 + 0.4)) });
    const b = pop(t, t70, 0.4); if (b > 0) { g.save(); g.translate(E.W / 2, 1020); g.scale(b, b); text(g, `${n} JAM`, 0, 0, { size: 150, color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
  });
} });
// s12 39.5–45.0: kurva lupa menetes: turun tajam di awal lalu melandai (tanpa angka persen)
registerShot('s12', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tt = rel('tajam', info, 2.0), tl = rel('melandai', info, 4.0);
    const X0 = 170, X1 = 940, Y0 = 440, Y1 = 1000;
    seg(g, [[X0, Y0 - 60], [X0, Y1], [X1, Y1]], 5, alpha(bp, 0.85));
    text(g, 'INGATAN', X0 + 20, Y0 - 90, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, align: 'left' }); text(g, 'WAKTU', X1, Y1 + 90, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, align: 'right' });
    ['20 MNT', '1 JAM', '9 JAM', '1 HARI', '2 HARI', '31 HARI'].forEach((s, i) => { const x = X0 + 70 + i * 135, a = ease.out(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)); seg(g, [[x, Y1], [x, Y1 + 14]], 4, alpha(bp, 0.85)); text(g, s, x, Y1 + 44, { size: 22, color: alpha(bp, 0.95), font: FONTS.ui, weight: 800, alpha: a }); });
    const f = (u) => Y0 + (Y1 - Y0) * (1 - Math.exp(-4.2 * u)) * 0.86 + (Y1 - Y0) * 0.02;   // eksponensial menurun
    const k = ease.inOut(prog(t, 0.5, tl + 0.7)), pts = []; for (let i = 0; i <= 80 * k; i++) { const u = i / 80; pts.push([X0 + 20 + u * (X1 - X0 - 60), f(u)]); }
    if (pts.length > 1) { seg(g, pts, 12, ui.gold); const e = pts[pts.length - 1]; circle(g, e[0], e[1], 16, ui.gold); glow(g, e[0], e[1], 100, ui.gold, 0.3);
      for (let i = 0; i < 4; i++) { const kk = (t * 0.9 + i * 0.25) % 1; if (pts.length > 10) { const p = pts[Math.floor(pts.length * (0.15 + i * 0.2) )] || e; circle(g, p[0], p[1] + 14 + kk * 70, 7 * (1 - kk * 0.5), alpha(ui.blueprint, 0.9 * (1 - kk))); } } }
    const a = pop(t, tt, 0.4); if (a > 0) { g.save(); g.translate(430, 400); g.scale(a, a); text(g, 'TURUN TAJAM', 0, 0, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
    const b = pop(t, tl, 0.4); if (b > 0) { g.save(); g.translate(760, 800); g.scale(b, b); text(g, 'LALU MELANDAI', 0, 0, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
  });
} });
// s14 51.15–52.5: hening, teks diketik
registerShot('s14', { draw(g, t, info) {
  g.fillStyle = S().ui.bpBg; g.fillRect(0, 0, E.W, E.H); const ui = S().ui, L = 'lupa itu wajar.', n = Math.floor(clamp((t - 0.05) / 0.95) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, 780, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.gold, 0.3) });
} });
