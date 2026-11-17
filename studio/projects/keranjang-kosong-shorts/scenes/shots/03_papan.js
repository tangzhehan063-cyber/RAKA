// 03_papan.js — riset sebagai kartu feed (blueprint): Iyengar & Lepper 2000 (3% vs 30%), catatan "hasil campur", hening.
import { E, V, S, registerShot, ease, prog, clamp, lerp, seg, circle, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { rel } from './01_kamar.js';

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
const BASE = 1080;
function meja(g, x, k, ui, label, rasa, persen, col) {   // satu meja cicip: tiang pembeli
  if (k <= 0) return; const h = persen * 20 * ease.out(clamp(k)), w = 230;
  g.save(); rr(g, x - w / 2, BASE - h, w, h, 14); g.fillStyle = alpha(col, 0.28); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke(); g.restore();
  glow(g, x, BASE - h, 120, col, 0.22 * clamp(k));
  text(g, `${Math.round(persen * clamp(k))}%`, x, BASE - h - 56, { size: 96, color: col, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(col, 0.5) });
  text(g, label, x, BASE + 48, { size: 32, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(k * 2) });
  text(g, rasa, x, BASE + 90, { size: 28, color: alpha(col, 0.95), font: FONTS.ui, weight: 800, alpha: clamp(k * 2) });
}
// s10 39.5–45.3: meja 24 rasa lebih ramai, tapi cuma ~3% yang beli
registerShot('s10', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t3 = rel('tiga', info, 4.3);
    text(g, 'YANG AKHIRNYA BELI', E.W / 2, 310, { size: 46, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4 });
    seg(g, [[130, BASE], [950, BASE]], 5, alpha(bp, 0.8));
    meja(g, 330, prog(t, t3 - 0.4, t3 + 0.9), ui, 'MEJA', '24 RASA', 3, ui.gold);
    text(g, 'LEBIH RAMAI', 330, 540, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.6)) });
  });
} });
// s11 45.3–48.8: meja 6 rasa ~30%
registerShot('s11', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t30 = rel('30', info, 1.8);
    text(g, 'YANG AKHIRNYA BELI', E.W / 2, 310, { size: 46, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4 });
    seg(g, [[130, BASE], [950, BASE]], 5, alpha(bp, 0.8));
    meja(g, 330, 1, ui, 'MEJA', '24 RASA', 3, alpha(ui.gold, 0.55));
    meja(g, 750, prog(t, t30 - 0.4, t30 + 0.9), ui, 'MEJA', '6 RASA', 30, ui.good || '#2f8a57');
    text(g, '±', 540, 880, { size: 20, color: 'rgba(0,0,0,0)' });
  });
} });
// s12 48.8–56.6: hasil studi lain campur; syarat muncul efeknya
registerShot('s12', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tc = rel('campur', info, 2.6), tb = rel('banyak', info, 5.0), tk = rel('maunya', info, 6.6);
    text(g, 'STUDI LAIN', E.W / 2, 330, { size: 52, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.1, 0.5)) });
    const a = pop(t, tc, 0.4); if (a > 0) { g.save(); g.translate(E.W / 2, 520); g.scale(a, a); text(g, 'HASILNYA CAMPUR', 0, 0, { size: 90, color: ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
    text(g, 'EFEKNYA PALING SERING MUNCUL KALAU:', E.W / 2, 700, { size: 36, color: alpha(bp, 0.95), font: FONTS.ui, weight: 800, spacing: 1, alpha: ease.out(prog(t, tb - 0.6, tb - 0.2)) });
    const b = pop(t, tb, 0.35); if (b > 0) { g.save(); g.translate(E.W / 2, 830); g.scale(b, b); rr(g, -380, -56, 760, 112, 30); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke(); text(g, 'PILIHANNYA BANYAK', 0, 4, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900 }); g.restore(); }
    const c = pop(t, tk, 0.35); if (c > 0) { g.save(); g.translate(E.W / 2, 990); g.scale(c, c); rr(g, -380, -56, 760, 112, 30); g.strokeStyle = ui.cream; g.lineWidth = 6; g.stroke(); text(g, 'BELUM TAHU MAUNYA', 0, 4, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900 }); g.restore(); }
  });
} });
// s13 55.95–57.55: hening, teks diketik
registerShot('s13', { draw(g, t, info) {
  g.fillStyle = '#10131c'; g.fillRect(0, 0, E.W, E.H);
  const ui = S().ui, L = 'pilihannya kebanyakan', n = Math.floor(clamp((t - 0.1) / 1.0) * L.length), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  text(g, L.slice(0, n) + cur, E.W / 2, 780, { size: 86, color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.4) });
} });
