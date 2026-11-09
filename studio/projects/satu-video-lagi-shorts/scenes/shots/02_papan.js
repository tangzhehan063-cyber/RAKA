// 02_papan.js — the research, shown as FEED CARDS (blueprint inside a rounded phone-feed card):
// myth, Penn 2003, 14 nights, "2 nights without sleep", crack, the stolen clock, the signature sentence.
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS, veil, shake } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { ramalan } from '../sets/kamar.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const CARD = [60, 190, E.W - 120, 1080];   // x, y, w, h  (ends y=1270, above the caption band)
const SRC = 'Van Dongen dkk., SLEEP, 2003';

// feed card: dark page, blueprint inside a rounded card, a hint of the next card peeking below the caption band
function card(g, t, info, draw, o = {}) {
  g.fillStyle = '#04100b'; g.fillRect(0, 0, E.W, E.H);
  const [x, y, w, h] = CARD, push = o.push ?? 0.02;
  g.save(); rr(g, x, 1440, w, 600, 50); g.fillStyle = alpha('#1d5a44', 0.35); g.fill(); g.restore();
  g.save(); rr(g, x, y, w, h, 50); g.clip();
  UI.blueprint(g);
  const z = 1 + push * ease.inOut(t / info.dur); g.translate(E.W / 2, y + h / 2); g.scale(z, z); g.translate(-E.W / 2, -(y + h / 2));
  draw(g, S().ui, UI.bpStroke());
  g.restore();
  rr(g, x, y, w, h, 50); g.strokeStyle = alpha('#7dffb0', 0.35); g.lineWidth = 4; g.stroke();
}
const stamp = (g, x, y, str, s, col, rot = -0.18) => { if (s <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); const k = 1.6 - 0.6 * s; g.scale(k, k); g.globalAlpha *= clamp(s);
  g.font = `900 104px ${FONTS.ui}`; const w = g.measureText(str).width + 80; rr(g, -w / 2, -74, w, 148, 18); g.strokeStyle = col; g.lineWidth = 10; g.stroke();
  text(g, str, 0, 4, { size: 104, color: col, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); };
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));

// s04 — the myth card: TIDUR 6 JAM = CUKUP?  -> stamp MITOS?
registerShot('s04', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const t6 = rel('enam', info, 1.64), tc = rel('cukup', info, 2.28), tb = rel('terbiasa', info, 3.88);
    text(g, 'KATANYA...', E.W / 2, 330, { size: 42, color: alpha(bp, 0.85), font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, 0.1, 0.5)) });
    text(g, 'TIDUR', E.W / 2, 470, { size: 96, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.2, 0.6)) });
    const a = pop(t, t6); g.save(); g.translate(E.W / 2, 660); g.scale(a, a); text(g, '6 JAM', 0, 0, { size: 230, color: ui.gold, font: FONTS.ui, weight: 900, glow: 34, glowColor: alpha(ui.gold, 0.7) }); g.restore();
    const b = pop(t, tc); g.save(); g.translate(E.W / 2, 860); g.scale(b, b); text(g, '= CUKUP?', 0, 0, { size: 110, color: ui.cream, font: FONTS.ui, weight: 900 }); g.restore();
    text(g, 'BADAN NANTI TERBIASA', E.W / 2, 980, { size: 44, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tb - 0.9, tb - 0.5)) });
    stamp(g, E.W / 2 + 60, 1130, 'MITOS?', ease.outBack(prog(t, tb + 0.05, tb + 0.3)), ui.accent);
  });
} });

// s05 — source card: University of Pennsylvania, 2003, 48 adults, in the lab
registerShot('s05', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    const tp = rel('Pennsylvania', info, 1.72), ty = rel('2003', info, 3.0);
    text(g, 'TAPI...', E.W / 2, 330, { size: 46, color: alpha(bp, 0.9), font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, 0.0, 0.3)) });
    const a = pop(t, tp);
    g.save(); g.translate(E.W / 2, 500); g.scale(a, a);
    text(g, 'UNIVERSITY OF', 0, -60, { size: 52, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
    text(g, 'PENNSYLVANIA', 0, 20, { size: 96, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, glow: 18, glowColor: alpha(bp, 0.6) }); g.restore();
    const b = pop(t, ty); g.save(); g.translate(E.W / 2, 720); g.scale(b, b); text(g, '2003', 0, 0, { size: 170, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) }); g.restore();
    // 48 little people in the lab
    const n0 = ty + 0.5;
    for (let i = 0; i < 48; i++) { const k = ease.outBack(prog(t, n0 + i * 0.015, n0 + 0.25 + i * 0.015)); if (k <= 0) continue;
      const c = i % 12, r = Math.floor(i / 12), x = 205 + c * 61, y = 880 + r * 62, s = 0.9 * k, col = alpha(bp, 0.9);
      circle(g, x, y - 16 * s, 9 * s, col); seg(g, [[x, y - 6 * s], [x, y + 14 * s]], 5 * s, col); seg(g, [[x - 8 * s, y + 28 * s], [x, y + 14 * s], [x + 8 * s, y + 28 * s]], 4 * s, col); }
    text(g, '48 ORANG DEWASA  ·  DI LAB', E.W / 2, 1150, { size: 38, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, n0 + 0.5, n0 + 0.9)) });
    text(g, SRC, E.W / 2, 1215, { size: 28, color: alpha(bp, 0.75), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, n0 + 0.7, n0 + 1.1)) });
  });
} });

// night box (one of the 14)
function nightBox(g, x, y, s, k, ui, bp) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -58, -58, 116, 116, 18); g.fillStyle = k > 0 ? alpha('#0b2a3a', 0.9) : 'rgba(0,0,0,0)'; g.fill(); g.strokeStyle = alpha(bp, 0.55); g.lineWidth = 4; g.stroke();
  if (k > 0) { const m = clamp(k); g.globalAlpha *= m;
    circle(g, -6, -10, 28, ui.gold); circle(g, 8, -18, 26, '#0b2a3a');
    text(g, '6j', 0, 38, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900 }); }
  g.restore();
}

// s06 — six hours a night, 14 nights: the boxes fill one by one
registerShot('s06', { draw(g, t, info) {
  card(g, t, info, (g, ui, bp) => {
    text(g, '6 JAM / MALAM', E.W / 2, 350, { size: 76, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.0, 0.3)) });
    const t0 = 0.45;
    for (let i = 0; i < 14; i++) { const c = i % 4, r = Math.floor(i / 4), x = 240 + c * 200 + (r === 3 ? 200 : 0), y = 540 + r * 160;
      nightBox(g, x, y, 1, ease.outBack(prog(t, t0 + i * 0.125, t0 + 0.2 + i * 0.125)), ui, bp); }
    const n = clamp(Math.floor((t - t0) / 0.125) + 1, 0, 14);
    const a = ease.out(prog(t, t0, t0 + 0.2));
    text(g, n + ' MALAM', E.W / 2, 1160, { size: 84, color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.6), alpha: a });
  });
} });

// s07 — the thinking bar shrinks night by night ... SETARA 2 MALAM TANPA TIDUR (flash + impact)
registerShot('s07', { draw(g, t, info) {
  const ts = rel('setara', info, 2.78), tt = rel('tanpa', info, 4.34);
  const [sx, sy] = (t > ts && t < ts + 0.35) ? (shake(t, 10, 10, 30) || [0, 0]) : [0, 0];
  g.save(); g.translate(sx || 0, sy || 0);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'KEMAMPUAN BERPIKIR', E.W / 2, 330, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
    // bar A: 6 h x 14 nights, shrinking in steps
    const steps = clamp(Math.floor(prog(t, 0.2, ts - 0.2) * 14), 0, 14), fill = lerp(1, 0.38, steps / 14);
    const bx = 130, bw = E.W - 260, bh = 90;
    text(g, '6 JAM × 14 MALAM', bx, 420, { size: 34, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
    rr(g, bx, 450, bw, bh, 20); g.strokeStyle = alpha(bp, 0.7); g.lineWidth = 5; g.stroke();
    rr(g, bx + 10, 460, (bw - 20) * fill, bh - 20, 14); g.fillStyle = ui.accent; g.fill();
    for (let i = 1; i < 14; i++) seg(g, [[bx + bw * i / 14, 552], [bx + bw * i / 14, 568]], 3, alpha(bp, 0.6));
    // bar B: 2 nights with zero sleep, the same length (appears on "setara")
    const b = ease.out(prog(t, ts, ts + 0.3));
    if (b > 0) { g.save(); g.globalAlpha *= b;
      text(g, '0 JAM × 2 MALAM', bx, 640, { size: 34, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
      rr(g, bx, 670, bw, bh, 20); g.strokeStyle = alpha(bp, 0.7); g.lineWidth = 5; g.stroke();
      rr(g, bx + 10, 680, (bw - 20) * 0.38 * b, bh - 20, 14); g.fillStyle = ui.gold; g.fill();
      const ex = bx + 10 + (bw - 20) * 0.38; g.setLineDash([12, 10]); seg(g, [[ex, 440], [ex, 780]], 4, ui.cream); g.setLineDash([]); g.restore(); }
    const h = pop(t, ts - 0.05, 0.35);
    g.save(); g.translate(E.W / 2, 860); g.scale(clamp(h, 0, 1.2), clamp(h, 0, 1.2));
    text(g, 'HINGGA SETARA', 0, 0, { size: 46, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore();
    const n = pop(t, ts + 0.45, 0.35);
    glow(g, E.W / 2, 980, 420, ui.gold, 0.3 * clamp(n));
    g.save(); g.translate(E.W / 2, 985); g.scale(n * (1 + 0.02 * Math.max(0, t - ts)), n * (1 + 0.02 * Math.max(0, t - ts)));
    text(g, '2 MALAM', 0, 0, { size: 180, color: ui.gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui.gold, 0.8) }); g.restore();
    const m = pop(t, tt);
    g.save(); g.translate(E.W / 2, 1120); g.scale(clamp(m), clamp(m)); text(g, 'TANPA TIDUR', 0, 0, { size: 74, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore();
    text(g, SRC, E.W / 2, 1215, { size: 26, color: alpha(bp, 0.7), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tt + 0.2, tt + 0.6)) });
  });
  g.restore();
  if (t > ts && t < ts + 0.3) veil(g, '#fff', 0.7 * (1 - (t - ts) / 0.3) ** 2);
} });

// s09 — "Kenapa tetap begadang? Seringnya, bukan karena malas." the card cracks, dark closes in
registerShot('s09', { draw(g, t, info) {
  const tc = rel('Seringnya', info, 1.36), tm = rel('malas', info, 3.1);
  card(g, t, info, (g, ui, bp) => {
    const a = pop(t, 0.15, 0.35);
    g.save(); g.translate(E.W / 2, 560); g.scale(clamp(a), clamp(a));
    text(g, 'KENAPA TETAP', 0, -70, { size: 80, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
    text(g, 'BEGADANG?', 0, 50, { size: 130, color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6) }); g.restore();
    const b = ease.out(prog(t, tm - 0.5, tm - 0.1));
    text(g, 'BUKAN KARENA', E.W / 2, 860, { size: 56, color: alpha(ui.cream, 0.95), font: FONTS.ui, weight: 900, spacing: 3, alpha: b });
    const c = pop(t, tm);
    g.save(); g.translate(E.W / 2, 970); g.scale(clamp(c), clamp(c)); text(g, 'MALAS', 0, 0, { size: 110, color: ui.accent, font: FONTS.ui, weight: 900, spacing: 6 }); g.restore();
  }, { push: 0.01 });
  // crack lines across the card
  const k = ease.out(prog(t, tc, tc + 0.35));
  if (k > 0) { const ox = 700, oy = 420, arms = [[-1, -0.3], [-0.6, 0.9], [0.3, 1], [1, 0.2], [0.2, -1], [-0.9, 0.4]];
    g.save(); g.strokeStyle = alpha('#e8fff2', 0.85); g.lineWidth = 4; g.lineJoin = 'round';
    arms.forEach(([dx, dy], i) => { g.beginPath(); g.moveTo(ox, oy); let x = ox, y = oy; const L = (220 + i * 60) * k;
      for (let s = 1; s <= 4; s++) { x = ox + dx * L * s / 4 + ((s * 37 + i * 13) % 30 - 15); y = oy + dy * L * s / 4 + ((s * 23 + i * 7) % 30 - 15); g.lineTo(x, y); } g.stroke(); });
    g.restore(); }
  const d = ease.inOut(prog(t, tc, info.dur));
  const grd = g.createRadialGradient(E.W / 2, E.H * 0.42, E.H * lerp(0.7, 0.32, d), E.W / 2, E.H * 0.42, E.H * lerp(0.95, 0.6, d));
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.92)'); g.fillStyle = grd; g.fillRect(0, 0, E.W, E.H);
} });

// s10 — "Seharian, waktumu milik bos, dosen, orang lain." three shadows each take a third of the clock
registerShot('s10', { draw(g, t, info) {
  g.fillStyle = '#04100b'; g.fillRect(0, 0, E.W, E.H); const ui = S().ui;
  UI.blueprint(g);
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, E.W, E.H);
  const cx = E.W / 2, cy = 640, R = 300;
  const who = [['bos', 1.64, 'BOS', [210, 1250]], ['dosen', 2.24, 'DOSEN', [540, 1250]], ['orang', 3.04, 'ORANG LAIN', [830, 1250]]];
  // hours 9 -> 1 -> 5 -> 9 : three 4-hour wedges (09.00-21.00 covers the whole face)
  const ang = (h) => (h % 12) / 12 * Math.PI * 2 - Math.PI / 2;
  circle(g, cx, cy, R + 14, '#0b1a15'); ring(g, cx, cy, R + 14, 8, alpha(ui.cream, 0.8));
  who.forEach(([w, fb, label, [fx, fy]], i) => {
    const tw = rel(w, info, fb), k = ease.inOut(prog(t, tw, tw + 0.55)), h0 = 9 + i * 4, a0 = ang(h0), a1 = a0 + Math.PI * 2 / 3;
    const mx = Math.cos((a0 + a1) / 2), my = Math.sin((a0 + a1) / 2);
    const s = lerp(1, 0.4, k), tx = fx, ty = 800;
    const px = lerp(cx, tx - mx * R * 0.55 * s, k) + mx * 14 * clamp(k * 3), py = lerp(cy, ty - my * R * 0.55 * s, k) + my * 14 * clamp(k * 3);
    g.save(); g.translate(px, py); g.scale(s, s);
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath();
    g.fillStyle = t > tw ? alpha(ui.accent, 0.85) : alpha('#1d5a44', 0.9); g.fill(); g.strokeStyle = '#04100b'; g.lineWidth = 8; g.stroke();
    g.restore();
    if (t > tw - 0.05) text(g, label, lerp(cx + mx * R * 0.55, tx, k), lerp(cy + my * R * 0.55, ty - 110, k), { size: label.length > 6 ? 46 : 60, color: ui.cream, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha('#000', 0.8) });
    // the shadow figure that takes it
    ramalan(g, t, fx, fy + 10, 1.25, { a: 0.9, pose: k > 0.1 ? POSES.cheer : POSES.stand, facing: i === 2 ? -1 : 1, look: [0, -1], expr: 'smirk' });
  });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * (R + 2), cy + Math.sin(a) * (R + 2)], [cx + Math.cos(a) * (R + 26), cy + Math.sin(a) * (R + 26)]], 6, alpha(ui.cream, 0.8)); }
  text(g, '09.00 – 21.00', cx, 230, { size: 56, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.4)) });
} });

// s15 — the signature sentence: NOT the night that lacks discipline ... BUT the day that isn't yours
registerShot('s15', { draw(g, t, info) {
  const td = rel('disiplin', info, 1.84), tt = rel('Tapi', info, 2.72);
  card(g, t, info, (g, ui, bp) => {
    text(g, 'BEGADANG BUKAN SOAL', E.W / 2, 330, { size: 48, color: alpha(bp, 0.95), font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.0, 0.3)) });
    const a = pop(t, 0.5);
    g.save(); g.translate(E.W / 2, 500); g.scale(clamp(a), clamp(a));
    text(g, 'MALAM', 40, 0, { size: 140, color: alpha(ui.cream, t > td ? 0.45 : 1), font: FONTS.ui, weight: 900, spacing: 4 });
    const x = ease.out(prog(t, td, td + 0.3)); if (x > 0) seg(g, [[-180, 10], [-180 + 440 * x, 10]], 14, ui.accent);
    g.restore();
    text(g, 'yang kurang disiplin', E.W / 2, 620, { size: 44, color: alpha(ui.cream, t > td ? 0.45 : 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 1.0, 1.4)) });
    const b = pop(t, tt, 0.35);
    glow(g, E.W / 2, 840, 400, ui.gold, 0.25 * clamp(b));
    g.save(); g.translate(E.W / 2, 840); g.scale(clamp(b, 0, 1.2), clamp(b, 0, 1.2));
    text(g, 'TAPI SIANG', 30, 0, { size: 130, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.7) }); g.restore();
    const c = ease.out(prog(t, tt + 0.6, tt + 1.0));
    text(g, 'YANG BUKAN MILIKMU', E.W / 2, 990, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: c });
  }, { push: 0.04 });
} });
