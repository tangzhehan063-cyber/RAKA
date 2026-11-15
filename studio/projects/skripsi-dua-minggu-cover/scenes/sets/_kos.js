// 01_kos.js — "Skripsi Dua Minggu": Bima di kamar kos (kasur kiri, meja + laptop kanan).
// Item maskot = kertas tempel merah-oranye "2 MINGGU" di layar laptop; tumpukannya = penghitung bisu.
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar, deskPos } from '../sets/kamar.js';
import { BIMA, TEMAN, NOTE } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const badge = (g, str, a = 1, color) => { if (color) { g.save(); rr(g, E.W - V(90, 110) - 250, V(110, 300) - 40, 270, 70, 35); g.fillStyle = alpha('#1b1b22', 0.75 * a); g.fill(); g.restore(); } UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a, color }); };
const SCREEN = '#cfe6ff';
export const TYPE = { ...POSES.sit, head: [10, -178], sh: [4, -146], eF: [34, -112], hF: [66, -118], eB: [28, -110], hB: [60, -114] };
const NOD = (t) => ({ ...TYPE, head: [10 + Math.sin(t * 9) * 2, -178 + Math.max(0, Math.sin(t * 9)) * 5] });
const REACH = { ...POSES.sit, head: [12, -180], sh: [6, -146], eF: [48, -150], hF: [80, -168], eB: [28, -110], hB: [60, -114] };
const PULL = { ...POSES.sit, head: [2, -178], sh: [-2, -146], eF: [10, -150], hF: [-30, -176], eB: [28, -110], hB: [60, -114] };
const CHEER = { ...POSES.sit, head: [6, -184], sh: [2, -150], eF: [36, -196], hF: [44, -250], eB: [-26, -194], hB: [-30, -250] };

// ---- kertas tempel -------------------------------------------------------------------------------
export function sticky(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); if (o.a != null) g.globalAlpha *= o.a;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-36, -34, 76, 76);
  g.fillStyle = o.color || NOTE; g.fillRect(-38, -38, 76, 76);
  g.fillStyle = alpha('#000', 0.12); g.fillRect(-38, -38, 76, 12);
  const [l1, l2] = o.txt || ['2', 'MINGGU'];
  text(g, l1, 0, -2, { size: o.big ? 30 : 34, color: '#fff4e8', font: FONTS.ui, weight: 900 });
  if (l2) text(g, l2, 0, 24, { size: 15, color: '#fff4e8', font: FONTS.ui, weight: 900, spacing: 1 });
  g.restore();
}
const ROT = [-0.12, 0.08, -0.05, 0.14, -0.16, 0.04, 0.11, -0.09, 0.18, -0.02];
const LBL = [['2', 'MINGGU'], ['2', 'MINGGU LAGI'], ['2', 'MINGGU LAGI'], ['2 LAGI', 'PASTI!'], ['2', 'MINGGU'], ['2', 'LAGI'], ['2', 'MINGGU LAGI'], ['2', 'MINGGU']];
// n = jumlah lapis (boleh pecahan: lapis terakhir sedang ditempel), off = lapis atas sedang dicabut (0..1)
function stack(g, x, y, n, o = {}) {
  const full = Math.floor(n), frac = n - full;
  for (let i = 0; i < Math.ceil(n); i++) {
    const k = i < full ? 1 : frac; if (k <= 0) continue;
    const px = x - 40 + ((i * 37) % 70), py = y - 20 - ((i * 23) % 50);
    const drop = (1 - ease.outBack(k)) * -60, rot = ROT[i % ROT.length] + (1 - k) * 0.4;
    sticky(g, px, py + drop, 0.62 * (1 + (1 - k) * 0.4), { rot, txt: LBL[i % LBL.length], a: clamp(k * 2) });
  }
}

// ---- laptop di meja: x = tengah, y = permukaan meja -----------------------------------------------
function laptop(g, x, y, o = {}) {
  const w = 200, h = 136, on = o.on ?? 1;
  g.beginPath(); g.moveTo(x - w / 2 - 14, y); g.lineTo(x + w / 2 + 14, y); g.lineTo(x + w / 2, y - 10); g.lineTo(x - w / 2, y - 10); g.closePath(); g.fillStyle = '#1b1f24'; g.fill();
  rr(g, x - w / 2, y - 10 - h, w, h, 8); g.fillStyle = '#14181c'; g.fill();
  rr(g, x - w / 2 + 8, y - 2 - h, w - 16, h - 16, 4); g.fillStyle = on > 0 ? alpha(o.screenColor || SCREEN, 0.25 + 0.75 * on) : '#0a0c0e'; g.fill();
  if (on > 0 && o.doc != null) {   // dokumen: judul + garis teks + progress
    const sx = x - w / 2 + 18, sy = y - h + 6;
    text(g, o.title || 'BAB 2', sx, sy, { size: 16, color: '#2a3442', font: FONTS.ui, weight: 900, align: 'left' });
    const lines = Math.round(6 * o.doc); for (let i = 0; i < 6; i++) seg(g, [[sx, sy + 18 + i * 12], [sx + (i < lines ? 120 - (i % 3) * 22 : 0), sy + 18 + i * 12]], 4, alpha('#4a5868', i < lines ? 0.7 : 0));
    rr(g, sx, y - 34, w - 36, 8, 4); g.fillStyle = alpha('#4a5868', 0.25); g.fill();
    rr(g, sx, y - 34, (w - 36) * o.doc, 8, 4); g.fillStyle = o.doc >= 1 ? '#3aa86a' : '#e0913a'; g.fill();
  }
  if (on > 0) glow(g, x, y - 10 - h / 2, 220, o.screenColor || SCREEN, 0.18 * on);
  if (o.notes) stack(g, x + 10, y - 60, o.notes);
}
function chair(g, x, y) {
  seg(g, [[x - 38, y - 86], [x + 34, y - 86]], 12, '#1d2226'); seg(g, [[x - 34, y - 86], [x - 40, y - 200]], 10, '#1d2226');
  seg(g, [[x - 30, y - 80], [x - 34, y]], 7, '#1d2226'); seg(g, [[x + 28, y - 80], [x + 32, y]], 7, '#1d2226');
}
// kamar kos lengkap: o { mood, clock, lamp, notes, doc, bima:{pose,expr,look}|false, screen:on, wall }
export function kos(g, t, cam, o = {}) {
  const r = kamar(g, t, cam, { mood: o.mood || 'day', clock: o.clock || '13:00', lamp: o.lamp || 0, notes: [], rain: o.rain });
  const [dx, GY] = r.desk, top = GY - 150, lx = dx - 30, bx = dx - 150;
  layer(g, cam, 0.85, (g) => {
    if (o.wall) o.wall(g, dx, GY);
    chair(g, bx - 10, GY);
    laptop(g, lx, top, { on: o.screen ?? 1, doc: o.doc, notes: o.notes, title: o.title, screenColor: o.screenColor });
    if (o.bima !== false) {
      const b = o.bima || {};
      drawFigure(g, { x: bx, y: GY, s: 1.25, facing: 1, outfit: BIMA, pose: b.pose || breathe(TYPE, t, 0.5, 3), expr: b.expr || 'neutral', look: b.look || [0.9, -0.1],
        blink: (t % 3.4) > 3.27, rim: { color: o.rim || SCREEN, dir: [1, -0.2], w: 5 } });
    }
    if (o.after) o.after(g, dx, GY, lx, top);
  });
  return { ...r, lx, top, bx };
}
// kamera: titik dunia (fx,fy) dipetakan ke layar (sx,sy); layer meja berkedalaman 0.85
export const CAMD = (z, fx = 720, fy = 1305, sx = 540, sy = 1250) => { const zz = 1 + (z - 1) * 0.85; return { z, x: (fx - 540 - (sx - 540) / zz) / 0.85, y: (fy - 960 - (sy - 960) / zz) / 0.85 }; };

// ---- s01: siang, Bima menempel kertas pertama --------------------------------------------------
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.0, 2.3, k));
  const tp = 1.2;
  kos(g, t, cam, { mood: 'day', clock: '13:00', doc: 0, notes: ease.out(prog(t, tp, tp + 0.5)) * 1,
    bima: { pose: posesAt(t, [[0, TYPE], [0.6, REACH], [tp + 0.5, REACH], [tp + 1.1, TYPE]], 0.4), expr: t > tp + 0.4 ? 'determined' : 'smile', look: [1, -0.4] } });
  FX.dust(g, t, { count: 12, color: '#fff2d0', a: 0.12 });
} });

// ---- s02: close laptop: BAB 2 0%, Bima mengangguk; HARI 1 -------------------------------------
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(3.0, 3.3, k), 770, 1160, 540, 1080);
  kos(g, t, cam, { mood: 'day', clock: '13:05', doc: 0.02, notes: 1, bima: { pose: NOD(t), expr: 'happy', look: [1, -0.2] } });
  badge(g, 'HARI 1', ease.out(prog(t, 0.2, 0.6)), '#ffcf6a');
} });

// ---- s03: HARI 14, progress baru setengah; kalender dicoret ------------------------------------
function calendar(g, x, y, crossed, ui) {
  rr(g, x - 150, y - 140, 300, 280, 12); g.fillStyle = '#f3ecdc'; g.fill(); g.fillStyle = NOTE; g.fillRect(x - 150, y - 140, 300, 44);
  text(g, 'BULAN INI', x, y - 116, { size: 22, color: '#fff4e8', font: FONTS.ui, weight: 900, spacing: 2 });
  for (let i = 0; i < 28; i++) { const c = i % 7, r = Math.floor(i / 7), cx = x - 126 + c * 42, cy = y - 66 + r * 52;
    text(g, String(i + 1), cx, cy, { size: 20, color: '#4a4048', font: FONTS.ui, weight: 800 });
    const a = clamp(crossed - i); if (a > 0) seg(g, [[cx - 14, cy - 14], [cx - 14 + 28 * a, cy + 14 * (2 * a - 1)]], 4, '#e0574a'); }
}
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.3, 2.45, k), 700, 1200, 540, 1180);
  const crossed = lerp(1, 14, ease.out(prog(t, 0.1, 1.4)));
  kos(g, t, cam, { mood: 'day', clock: '15:20', doc: 0.5, notes: 1, bima: { expr: 'thinking', look: [1, 0.1] },
    wall: (g, dx, GY) => { g.save(); g.translate(dx - 120, GY - 430); g.scale(0.5, 0.5); calendar(g, 0, 0, crossed); g.restore(); } });
  const tp = rel('setengah', info, 1.8);
  const a = ease.outBack(prog(t, tp, tp + 0.4)); if (a > 0) { g.save(); g.translate(300, 470); g.scale(a, a); text(g, '50%', 0, 0, { size: 150, color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
  badge(g, `HARI ${Math.round(crossed)}`, 1, '#ffcf6a');
} });

// ---- s04: kertas disobek, kertas baru ditempel (lapis 2) ----------------------------------------
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.6, 2.9, k), 740, 1200, 540, 1180);
  const tr = rel('disobek', info, 0.9), tn = rel('dua', info, 2.6);
  const r = kos(g, t, cam, { mood: 'day', clock: '16:00', doc: 0.5, notes: t < tn ? 1 : 1 + ease.out(prog(t, tn, tn + 0.5)),
    bima: { pose: posesAt(t, [[0, TYPE], [tr - 0.4, REACH], [tr + 0.5, PULL], [tn - 0.5, REACH], [tn + 0.6, TYPE]], 0.35), expr: t > tn ? 'determined' : 'neutral', look: [1, -0.4] },
    after: (g, dx, GY, lx, top) => {   // sobekan kertas lama melayang jatuh (kertas lama tetap: lapis baru menimpa)
      const f = prog(t, tr, tr + 1.4); if (f > 0 && f < 1) sticky(g, lx - 20 - f * 60, top - 60 + f * 160, 0.45, { rot: f * 2.4, txt: ['2', ''], a: 1 - f });
    } });
  const tl = rel('pasti', info, 4.0), a = ease.out(prog(t, tl - 0.2, tl + 0.2));
  if (a > 0) text(g, 'KALI INI PASTI.', E.W / 2, 560, { size: 74, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: a, glow: 14, glowColor: alpha('#000', 0.6) });
  badge(g, 'HARI 15', 1, '#ffcf6a');
} });

// ---- s06: layar HP: grup angkatan, foto toga ----------------------------------------------------
function phoneFrame(g, draw) {
  g.fillStyle = '#05070c'; g.fillRect(0, 0, E.W, E.H);
  const px = 200, py = 190, pw = 680, ph = 1060;
  glow(g, E.W / 2, py + ph / 2, 700, SCREEN, 0.18);
  rr(g, px, py, pw, ph, 56); g.fillStyle = '#0b1013'; g.fill(); g.strokeStyle = alpha(SCREEN, 0.8); g.lineWidth = 7; g.stroke();
  g.save(); rr(g, px + 14, py + 14, pw - 28, ph - 28, 44); g.clip(); g.fillStyle = '#e9eef3'; g.fillRect(px, py, pw, ph); draw(g, px, py, pw, ph); g.restore();
}
function toga(g, x, y, s) {   // stickman bertoga
  g.save(); g.translate(x, y); g.scale(s, s);
  drawFigure(g, { x: 0, y: 0, s: 1, facing: 1, outfit: { top: 'hoodie', color: '#1f2a44', head: 'none' }, pose: POSES.cheer, expr: 'joy', rim: { color: '#ffd36a', dir: [1, -1], w: 3 } });
  g.fillStyle = '#10141c'; g.beginPath(); g.moveTo(-40, -212); g.lineTo(0, -228); g.lineTo(40, -212); g.lineTo(0, -198); g.closePath(); g.fill(); seg(g, [[30, -212], [36, -180]], 3, '#f2c21a');
  g.restore();
}
registerShot('s06', { draw(g, t, info) {
  phoneFrame(g, (g, px, py, pw, ph) => {
    g.fillStyle = '#2f6f5a'; g.fillRect(px, py, pw, 130);
    text(g, 'Angkatan 21', px + 50, py + 80, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
    const a = ease.outBack(prog(t, 0.25, 0.6));
    if (a > 0) { g.save(); g.translate(px + 70, py + 200); g.scale(a, a);
      rr(g, 0, 0, 460, 560, 26); g.fillStyle = '#fff'; g.fill();
      rr(g, 20, 20, 420, 430, 18); g.fillStyle = '#cfe0ef'; g.fill();
      g.save(); rr(g, 20, 20, 420, 430, 18); g.clip(); glow(g, 230, 200, 260, '#fff6d8', 0.6); toga(g, 230, 420, 1.35); g.restore();
      text(g, 'AKHIRNYAAA LULUS!!', 30, 500, { size: 32, color: '#1b2430', font: FONTS.ui, weight: 900, align: 'left' });
      g.restore(); }
    const b = ease.out(prog(t, 1.1, 1.4)); if (b > 0) { rr(g, px + 70, py + 800, 380, 80, 22); g.fillStyle = alpha('#fff', b); g.fill(); text(g, 'selamat broo!!', px + 100, py + 850, { size: 30, color: alpha('#1b2430', b), font: FONTS.ui, weight: 800, align: 'left' }); }
  });
} });

// ---- s07: malam, telepon Ibu: "Kapan sidang?" -> "Dua minggu lagi, Bu." ---------------------------
function bubble(g, x, y, str, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); const k = ease.outBack(clamp(a)); g.translate(x, y); g.scale(k, k);
  g.font = `900 ${o.size || 58}px ${FONTS.ui}`; const w = g.measureText(str).width + 70, h = (o.size || 58) + 50;
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = o.fill || '#f3ecdc'; g.fill();
  g.beginPath(); g.moveTo((o.tail || 0) - 18, h / 2 - 4); g.lineTo((o.tail || 0) + 18, h / 2 - 4); g.lineTo((o.tail || 0) + (o.tailDx || 0), h / 2 + 36); g.closePath(); g.fill();
  text(g, str, 0, 4, { size: o.size || 58, color: o.color || '#1b1b22', font: FONTS.ui, weight: 900 }); g.restore();
}
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.0, 2.2, k));
  const tk = rel('Kapan', info, 0.9), tj = rel('Jawabannya', info, 2.2), td = rel('Dua', info, 3.3);
  const PH = { ...POSES.sit, head: [4, -178], eF: [20, -140], hF: [10, -176], eB: [28, -110], hB: [60, -114] };
  kos(g, t, cam, { mood: 'night', clock: '21:40', doc: 0.55, notes: 3, screen: 0.6, rim: '#a9b8ff',
    bima: { pose: breathe(PH, t, 0.4, 2), expr: t < td ? 'nervous' : 'smile', look: [1, -0.3] } });
  const ring = t < tk && (t * 6 % 1) < 0.5; if (ring) text(g, 'IBU MENELEPON...', E.W / 2, 520, { size: 60, color: S().ui.cream, font: FONTS.ui, weight: 900 });
  bubble(g, E.W / 2 + 80, 520, '"Kapan sidang?"', { a: prog(t, tk, tk + 0.35) * (1 - prog(t, td - 0.3, td)), fill: '#f6d9b0', tail: -60, tailDx: -40 });
  bubble(g, E.W / 2 - 40, 640, '"Dua minggu lagi, Bu."', { a: prog(t, td, td + 0.35), size: 54, tail: 40, tailDx: 30 });
  badge(g, 'HARI 30');
} });

// ---- s08: wajah besar cemas, tumpukan kertas di latar; "PEMALAS?" ---------------------------------
registerShot('s08', { draw(g, t, info) {
  const cam = { z: 2.2, x: 230, y: 250 };
  blurLayer(g, 12, (g) => kos(g, t, cam, { mood: 'night', clock: '23:10', doc: 0.55, notes: 7, bima: false, screen: 0.8 }), null, 1);
  veil(g, '#05060c', 0.45);
  const cx = E.W / 2 - 40, cy = 780, r = 260, tp = rel('pemalas', info, 4.4), tm = rel('mikir', info, 3.0);
  glow(g, cx + r, cy, r * 2, SCREEN, 0.2);
  bigFace(g, cx, cy, r, { outfit: BIMA, expr: t > tp ? 'sad' : 'worried', blink: (t % 3.2) > 3.08, look: [0.8, 0.3], rimColor: SCREEN, rimSide: 1, tilt: 0.04 });
  // kertas-kertas melayang pelan di sekitar kepala
  for (let i = 0; i < 6; i++) { const a = prog(t, 0.3 + i * 0.35, 1.0 + i * 0.35); if (a <= 0) continue; const ang = i * 1.1 + t * 0.15;
    sticky(g, cx + Math.cos(ang) * (r + 130), cy + Math.sin(ang) * (r + 90), 0.9, { rot: ROT[i], txt: LBL[i], a: 0.85 * a }); }
  const a = ease.outBack(prog(t, tp - 0.1, tp + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 1150); g.scale(a, a); text(g, 'PEMALAS?', 0, 0, { size: 120, color: S().ui.accent || '#ff6a50', font: FONTS.ui, weight: 900, spacing: 6, glow: 24, glowColor: alpha('#ff6a50', 0.6) }); g.restore(); }
  FX.dust(g, t, { count: 14, color: SCREEN, a: 0.14 });
  badge(g, 'HARI 42', ease.out(prog(t, tm - 0.5, tm)));
} });

// ---- s13: HENING freeze-frame: teks diketik -----------------------------------------------------
registerShot('s13', { draw(g, t, info) {
  g.fillStyle = '#04070b'; g.fillRect(0, 0, E.W, E.H);
  FX.dust(g, 0.7, { count: 40, color: '#bfe4ff', a: 0.25 });     // partikel beku (waktu tetap)
  const ui = S().ui, L1 = 'skenario terburukmu', L2 = 'pun masih', L3 = 'terlalu optimis.';
  const all = L1.length + L2.length + L3.length, n = Math.floor(clamp((t - 0.25) / 1.9) * all), cur = (t * 2 % 1) < 0.6 ? '|' : '';
  const parts = [[L1, 600], [L2, 700], [L3, 800]]; let used = 0;
  parts.forEach(([L, y], i) => { const m = clamp(n - used, 0, L.length); const last = n >= used && n <= used + L.length; used += L.length;
    if (m > 0 || last) text(g, L.slice(0, m) + (last ? cur : ''), E.W / 2, y, { size: 74, color: i === 2 ? ui.gold : ui.cream, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.4) }); });
  const tb = rel('Bima', info, 2.3); if (t > tb) sticky(g, E.W / 2, 1020, 2.2 * (1 + 0.04 * Math.sin(t * 3)), { rot: -0.08, txt: ['2', 'MINGGU'], a: ease.out(prog(t, tb, tb + 0.4)) });
} });

// ---- s15: malam, lampu menyala, semua kertas dicabut -------------------------------------------
registerShot('s15', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.5, 2.2, k), 730);
  const tc = rel('dicabut', info, 1.6), off = ease.out(prog(t, tc - 0.2, tc + 0.6));
  kos(g, t, cam, { mood: 'night', clock: '22:15', lamp: ease.out(prog(t, 0.1, 0.6)), doc: 0.55, notes: off > 0 ? 0 : 7,
    bima: { pose: posesAt(t, [[0, TYPE], [tc - 0.6, REACH], [tc + 0.2, PULL], [tc + 1.2, TYPE]], 0.3), expr: t > tc ? 'determined' : 'neutral', look: [1, -0.3] },
    after: (g, dx, GY, lx, top) => { if (off <= 0) return;
      for (let i = 0; i < 7; i++) { const f = clamp(off * 1.4 - i * 0.05), ang = -2.4 + i * 0.5; sticky(g, lx - 20 + Math.cos(ang) * 260 * f, top - 70 + Math.sin(ang) * 160 * f + f * f * 260, 0.6, { rot: ROT[i] + f * 3 * (i % 2 ? 1 : -1), txt: LBL[i], a: 1 - prog(f, 0.7, 1) }); } } });
  badge(g, 'HARI 45');
} });

// ---- s16: layar laptop penuh: folder BAB 1, tanggal, = 5 MINGGU ----------------------------------
registerShot('s16', { draw(g, t, info) {
  const ui = S().ui; g.fillStyle = '#0b0d10'; g.fillRect(0, 0, E.W, E.H);
  const z = 1 + 0.03 * ease.inOut(t / info.dur); g.save(); g.translate(E.W / 2, 700); g.scale(z, z); g.translate(-E.W / 2, -700);
  const x = 80, y = 260, w = E.W - 160, h = 880;
  rr(g, x - 20, y - 20, w + 40, h + 40, 30); g.fillStyle = '#16191d'; g.fill();
  rr(g, x, y, w, h, 14); g.fillStyle = '#eef2f6'; g.fill();
  g.fillStyle = '#d9e0e7'; g.fillRect(x, y, w, 70); text(g, 'Skripsi / BAB 1 (lama)', x + 40, y + 40, { size: 30, color: '#3a4450', font: FONTS.ui, weight: 900, align: 'left' });
  const tc = rel('catatan', info, 0.6), tb = rel('lima', info, 2.6);
  const rows = [['Mulai', '3 Maret'], ['Selesai', '7 April'], ['Revisi', '4 kali']];
  rows.forEach(([a, b], i) => { const k = ease.out(prog(t, tc + 0.2 + i * 0.35, tc + 0.5 + i * 0.35)); if (k <= 0) return;
    const yy = y + 190 + i * 120; text(g, a, x + 60, yy, { size: 46, color: alpha('#5a6470', k), font: FONTS.ui, weight: 800, align: 'left' });
    text(g, b, x + w - 60, yy, { size: 54, color: alpha('#1b2430', k), font: FONTS.ui, weight: 900, align: 'right' }); seg(g, [[x + 60, yy + 44], [x + w - 60, yy + 44]], 2, alpha('#9aa6b2', 0.5 * k)); });
  const a = ease.outBack(prog(t, tb - 0.1, tb + 0.35)); if (a > 0) { g.save(); g.translate(E.W / 2, y + 690); g.scale(a, a);
    rr(g, -330, -100, 660, 200, 30); g.fillStyle = '#1b2430'; g.fill(); text(g, '= 5 MINGGU', 0, 6, { size: 104, color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
  g.restore();
} });

// ---- s17: dinding penuh 35 kertas kecil, dicoret satu per satu; malam -> pagi emas ---------------
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(1.9, 1.75, k), 720, 1305, 540, 1270);
  const day = Math.floor(lerp(1, 35, ease.inOut(prog(t, 1.0, info.dur - 0.3))));
  kos(g, t, cam, { mood: t < info.dur * 0.45 ? 'night' : 'golden', clock: t < info.dur * 0.45 ? '21:00' : '07:30', lamp: t < info.dur * 0.45 ? 1 : 0, doc: lerp(0.5, 0.95, day / 35), notes: 0,
    bima: { pose: breathe(TYPE, t, 0.6, 4), expr: 'determined', look: [1, -0.1] },
    wall: (g, dx, GY) => {   // grid 7x5 di dinding atas meja
      rr(g, dx - 345, GY - 590, 370, 270, 14); g.fillStyle = '#8a6040'; g.fill(); g.strokeStyle = '#4a3020'; g.lineWidth = 8; g.stroke();
      for (let i = 0; i < 35; i++) { const c = i % 7, r = Math.floor(i / 7), x = dx - 315 + c * 52, y = GY - 560 + r * 52, a = ease.outBack(prog(t, 0.1 + i * 0.02, 0.35 + i * 0.02)); if (a <= 0) continue;
        g.save(); g.translate(x, y); g.scale(a * 0.46, a * 0.46); g.rotate(ROT[i % 10] * 0.4); g.fillStyle = '#f2c38a'; g.fillRect(-40, -40, 80, 80);
        text(g, String(i + 1), 0, 4, { size: 34, color: '#5a3a28', font: FONTS.ui, weight: 900 });
        if (i < day) { seg(g, [[-30, 0], [-8, 26], [32, -30]], 9, '#3aa86a'); } g.restore(); } } });
  badge(g, `HARI ${day}/35`);
} });

// ---- s18: pagi emas, layar laptop "ACC", Bima bersorak -------------------------------------------
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.3, 2.6, k)), ta = rel('ACC', info, 3.4);
  kos(g, t, cam, { mood: 'golden', clock: '09:10', doc: 1, notes: 0, title: 'BAB 2', screenColor: '#e8f6e8', rim: '#ffcf8f',
    bima: { pose: t > ta ? breathe(CHEER, t, 1.2, 5) : breathe(TYPE, t, 0.5, 3), expr: t > ta ? 'joy' : 'thinking', look: [1, -0.2] } });
  FX.godRays(g, 140, 380, { a: 0.18 });
  const a = ease.outBack(prog(t, ta - 0.05, ta + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, 600); g.rotate(-0.08); g.scale(a * 1.1, a * 1.1);
    rr(g, -230, -110, 460, 220, 24); g.strokeStyle = '#3aa86a'; g.lineWidth = 14; g.stroke(); text(g, 'ACC', 0, 10, { size: 170, color: '#3aa86a', font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha('#3aa86a', 0.5) }); g.restore(); }
  const tm = rel('Minggu', info, 0.2); badge(g, 'MINGGU 5', ease.out(prog(t, tm, tm + 0.4)));
  if (t > ta) for (let i = 0; i < 8; i++) { const ph = (t * 1.3 + i * 0.37) % 1, an = i * 0.79; FX.sparkle(g, E.W / 2 + Math.cos(an) * (260 + ph * 80), 600 + Math.sin(an) * (170 + ph * 60), 26 * (1 - ph), '#fff3c0', 0.9 * (1 - ph)); }
} });

// ---- s19: LOOP: kamar sebelah, teman kos menempel kertas "2 MINGGU" (framing = s01) ---------------
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = CAMD(lerp(2.3, 2.0, k));
  const tp = rel('nempel', info, 1.2), tw = rel('Tulisannya', info, 3.4);
  const r = kos(g, t, cam, { mood: 'day', clock: '13:00', doc: 0, notes: 0, bima: false,
    after: (g, dx, GY, lx, top) => {
      const bx = dx - 150;
      drawFigure(g, { x: bx, y: GY, s: 1.25, facing: 1, outfit: TEMAN, pose: posesAt(t, [[0, TYPE], [tp - 0.5, REACH], [tp + 0.6, REACH], [tp + 1.2, TYPE]], 0.4), expr: 'determined', look: [1, -0.4], blink: (t % 3.1) > 2.98, rim: { color: SCREEN, dir: [1, -0.2], w: 5 } });
      stack(g, lx + 10, top - 60, ease.out(prog(t, tp, tp + 0.5)));
    } });
  const a = ease.out(prog(t, tw + 0.4, tw + 0.8)); if (a > 0) text(g, '2 MINGGU.', E.W / 2, 560, { size: 90, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a, glow: 14, glowColor: alpha('#000', 0.5) });
  badge(g, 'HARI 1', ease.out(prog(t, tw, tw + 0.4)), '#ffcf6a');
} });
