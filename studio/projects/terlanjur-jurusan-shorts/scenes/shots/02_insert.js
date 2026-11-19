// 02_insert.js — sisipan: s04 s05 s06 s08 s42 s46 (layar laptop), s12 (HP grup RT), s36 s37 s40 (kertas).
import { E, V, S, registerShot, layer, blurLayer, veil, mood, ease, prog, clamp, lerp, alpha, shade, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kamar } from '../sets/kamar.js';
import { HINA } from '../cast.js';
import { rel, pop, bub, hpBesar } from '../_util.js';
const SCR = '#bfe4ff', PAPER = '#efe6cf', INK = '#2a2f3a';

// laptop besar menghadap kamera; fn(g, x, y, w, h) menggambar isi layar. Mengembalikan kotak layar.
function laptopBesar(g, t, fn, o = {}) {
  const cx = E.W / 2, cy = E.H * 0.45, w = 900, h = 560, k = ease.inOut(prog(t, 0, 0.6)), s = 0.9 + 0.1 * k;
  g.save(); g.translate(cx, cy); g.scale(s, s);
  glow(g, 0, 0, 900, SCR, 0.25);
  rr(g, -w / 2 - 24, -h / 2 - 24, w + 48, h + 48, 30); g.fillStyle = '#0d1216'; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 12); g.fillStyle = o.bg || '#f4f6f8'; g.fill();
  g.save(); rr(g, -w / 2, -h / 2, w, h, 12); g.clip(); fn(g, -w / 2, -h / 2, w, h); g.restore();
  rr(g, -w / 2 - 70, h / 2 + 24, w + 140, 26, 10); g.fillStyle = '#1b2227'; g.fill();
  g.restore();
}
const bg = (g, t) => { blurLayer(g, 16, (g) => kamar(g, t, { z: 1.8, x: 60, y: 60 }, { mood: 'night', clock: '02:00' }), null, 1); veil(g, '#000', 0.62); };
const tabBar = (g, x, y, w, tabs, act, openK = 1) => {
  g.fillStyle = '#dfe4ea'; g.fillRect(x, y, w, 62); let cx = x + 14;
  tabs.forEach((s, i) => { const tw = (i === 1 ? 360 * openK : 300); if (tw < 8) return; rr(g, cx, y + 12, tw, 50, 12); g.fillStyle = i === act ? '#ffffff' : '#c8d0d9'; g.fill(); text(g, s, cx + 20, y + 38, { size: 22, color: INK, font: FONTS.ui, weight: 800, align: 'left', alpha: Math.min(1, openK * 1.2) }); cx += tw + 8; });
};
// s04 7.2–11.8: paragraf yang sama dibaca empat kali
registerShot('s04', { draw(g, t, info) {
  bg(g, t);
  laptopBesar(g, t, (g, x, y, w, h) => {
    tabBar(g, x, y, w, ['Laporan Praktikum.docx'], 0);
    for (let i = 0; i < 9; i++) { const hl = i >= 3 && i <= 5, ln = 760 - (i % 3) * 90; if (hl) { g.fillStyle = alpha('#ffd45a', 0.55 + 0.2 * Math.sin(t * 4)); g.fillRect(x + 60, y + 118 + i * 44 - 14, ln + 8, 30); } rr(g, x + 64, y + 118 + i * 44 - 8, ln, 16, 8); g.fillStyle = '#9aa3ad'; g.fill(); }
    const n = Math.min(4, 1 + Math.floor(prog(t, 0.2, 3.3) * 4));
    for (let i = 0; i < n; i++) { const a = pop(t, 0.2 + i * 0.85, 0.2); g.save(); g.globalAlpha *= a; seg(g, [[x + w - 430 + i * 48, y + h - 140], [x + w - 430 + i * 48, y + h - 60]], 10, HINA); g.restore(); }
    text(g, 'DIBACA ULANG', x + w - 340, y + h - 170, { size: 24, color: HINA, font: FONTS.ui, weight: 900, spacing: 2 });
  });
  FX.dust(g, t, { count: 20, color: SCR, a: 0.22 });
} });
// s05 11.8–15.8: tab formulir pindah jurusan terbuka
registerShot('s05', { draw(g, t, info) {
  bg(g, t); const ok = ease.outBack(prog(t, 0.2, 0.8));
  laptopBesar(g, t, (g, x, y, w, h) => {
    tabBar(g, x, y, w, ['Laporan Praktikum', 'Formulir Pindah Jurusan'], 1, ok);
    text(g, 'FORMULIR PINDAH JURUSAN', x + w / 2, y + 150, { size: 38, color: INK, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.7, 1.2)) });
    [['Nama', 'Dimas'], ['Jurusan asal', 'Teknik Sipil'], ['Jurusan tujuan', 'Desain Produk']].forEach(([a, b], i) => { const k = ease.out(prog(t, 1.0 + i * 0.5, 1.5 + i * 0.5)); text(g, a, x + 80, y + 240 + i * 90, { size: 22, color: '#6b7480', font: FONTS.ui, weight: 800, align: 'left', alpha: k }); rr(g, x + 80, y + 256 + i * 90, w - 160, 40, 8); g.fillStyle = alpha('#e8edf2', k); g.fill(); text(g, b, x + 96, y + 277 + i * 90, { size: 24, color: INK, font: FONTS.ui, weight: 800, align: 'left', alpha: k }); });
  });
  FX.dust(g, t, { count: 20, color: SCR, a: 0.22 });
} });
// s06 15.8–18.0: kursor di tombol kirim
registerShot('s06', { draw(g, t, info) {
  bg(g, t); const z = 1 + 0.12 * ease.inOut(t / info.dur), pul = 1 + 0.04 * Math.sin(t * 8);
  g.save(); g.translate(E.W / 2, E.H * 0.47); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.47);
  const cx = E.W / 2, cy = E.H * 0.47; glow(g, cx, cy, 700, HINA, 0.2 + 0.1 * Math.sin(t * 8));
  g.save(); g.translate(cx, cy); g.scale(pul, pul); rr(g, -270, -90, 540, 180, 40); g.fillStyle = '#2f7bd6'; g.fill(); text(g, 'KIRIM', 0, 6, { size: 96, color: '#fff', font: FONTS.ui, weight: 900, spacing: 6 }); g.restore();
  const k = ease.inOut(prog(t, 0.1, 1.3)), mx = lerp(cx + 360, cx + 70, k), my = lerp(cy + 360, cy + 40, k);
  g.save(); g.translate(mx, my); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.lineTo(32, 92); g.lineTo(62, 150); g.lineTo(88, 138); g.lineTo(58, 82); g.lineTo(100, 78); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#10161a'; g.stroke(); g.restore();
  g.restore(); FX.dust(g, t, { count: 20, color: SCR, a: 0.22 });
} });
// s08 19.7–21.46: tab ditutup
registerShot('s08', { draw(g, t, info) {
  bg(g, t); const cl = ease.inOut(prog(t, 0.5, 1.2));
  laptopBesar(g, t, (g, x, y, w, h) => {
    tabBar(g, x, y, w, ['Laporan Praktikum', 'Formulir Pindah Jurusan'], cl > 0.5 ? 0 : 1, 1 - cl);
    text(g, 'FORMULIR PINDAH JURUSAN', x + w / 2, y + 150, { size: 38, color: INK, font: FONTS.ui, weight: 900, alpha: 1 - cl });
    g.fillStyle = alpha('#f4f6f8', cl); g.fillRect(x, y + 62, w, h - 62);
    for (let i = 0; i < 7; i++) { rr(g, x + 64, y + 118 + i * 44 + 10, 700 - (i % 3) * 90, 16, 8); g.fillStyle = alpha('#9aa3ad', cl); g.fill(); }
    if (cl < 0.6) { const a = ease.out(prog(t, 0.2, 0.5)); text(g, '×', x + 14 + 300 + 360 - 30, y + 38, { size: 40, color: HINA, font: FONTS.ui, weight: 900, alpha: a * (1 - cl) }); }
  });
  FX.dust(g, t, { count: 18, color: SCR, a: 0.22 });
} });
// s42 138.5–141.21: tombol kirim diklik → TERKIRIM
registerShot('s42', { draw(g, t, info) {
  bg(g, t); const cx = E.W / 2, cy = E.H * 0.47, hit = ease.out(prog(t, 0.9, 1.1)), ok = pop(t, 1.1, 0.4);
  g.save(); g.translate(cx, cy); const sc = 1 - 0.06 * Math.sin(Math.PI * clamp((t - 0.85) / 0.25)); g.scale(sc, sc);
  glow(g, 0, 0, 700, hit > 0.5 ? '#6fe0a0' : '#2f7bd6', 0.25); rr(g, -270, -90, 540, 180, 40); g.fillStyle = hit > 0.5 ? '#2f9e66' : '#2f7bd6'; g.fill();
  text(g, hit > 0.5 ? 'TERKIRIM' : 'KIRIM', 0, 6, { size: hit > 0.5 ? 84 : 96, color: '#fff', font: FONTS.ui, weight: 900, spacing: 6 }); g.restore();
  if (ok > 0) { g.save(); g.translate(cx, cy - 250); g.scale(ok, ok); circle(g, 0, 0, 80, '#6fe0a0'); seg(g, [[-36, 4], [-8, 34], [40, -30]], 16, '#0b1a12'); g.restore(); }
  FX.rings(g, cx, cy, t - 0.9, { count: 2, r0: 120, r1: 520, speed: 0.8, color: '#6fe0a0', a: 0.5 * (t > 0.9 ? 1 : 0) }); FX.dust(g, t, { count: 20, color: '#6fe0a0', a: 0.22 });
} });
// s46 154.82–157.77: loop — laptop menghadap penonton, sketsa terbuka
registerShot('s46', { draw(g, t, info) {
  const cam = { z: 1.5, x: 250, y: 60 }, op = ease.out(prog(t, 0.1, 0.8));
  const { GY } = kamar(g, t, cam, { mood: 'night', clock: '02:00', lamp: 1 });
  layer(g, cam, 1, (g) => {
    const dx = E.W / 2 + 270, w = 300, h = 190 * op, y = GY - 154; rr(g, dx - w / 2, y - h, w, h, 10); g.fillStyle = '#10161a'; g.fill();
    if (op > 0.5) { rr(g, dx - w / 2 + 12, y - h + 12, w - 24, h - 24, 6); g.fillStyle = '#cfeaff'; g.fill(); g.strokeStyle = '#2a3a4a'; g.lineWidth = 5; g.beginPath(); g.moveTo(dx - 90, y - 50); g.lineTo(dx - 20, y - 130); g.lineTo(dx + 70, y - 70); g.lineTo(dx + 90, y - 120); g.stroke(); text(g, 'SKETSA 01', dx, y - 28, { size: 22, color: '#0a0f12', font: FONTS.ui, weight: 900 }); }
    rr(g, dx - w / 2 - 20, y, w + 40, 14, 6); g.fillStyle = '#1a2226'; g.fill(); glow(g, dx, GY - 280, 320, '#cfeaff', 0.22 * op);
  });
  FX.dust(g, t, { count: 26, color: '#cfeaff', a: 0.25 });
} });
// s12 28.8–32.66: HP grup RT, ibu bangga
registerShot('s12', { draw(g, t, info) {
  const M = mood('night'); blurLayer(g, 14, (g) => kamar(g, t, { z: 1.7, x: -200, y: 40 }, { mood: 'night' }), null, 1); veil(g, '#000', 0.45);
  const k = ease.inOut(prog(t, 0, 0.7)), hx = E.W * 0.5, hy = E.H * 0.5 + (1 - k) * 160, s = 1.5;
  hpBesar(g, hx, hy, s, '#17202e', (g, hx, hy, s) => {
    rr(g, hx - 116 * s, hy - 236 * s, 232 * s, 46 * s, 20 * s); g.fillStyle = '#25324a'; g.fill(); text(g, 'GRUP RT 05', hx, hy - 213 * s, { size: 20 * s, color: '#e8eef8', font: FONTS.ui, weight: 900 });
    const a = pop(t, 0.5, 0.35); if (a > 0) { g.save(); g.translate(hx - 4 * s, hy - 100 * s); g.scale(a, a); bub(g, 0, 0, 205 * s, 100 * s, '#6a5a8a', 'Bu Dimas:\nanakku anak\nteknik lho!', 1, 21 * s); g.restore(); }
    const b = pop(t, 1.6, 0.35); if (b > 0) { g.save(); g.translate(hx + 4 * s, hy + 60 * s); g.scale(b, b); bub(g, 0, 0, 190 * s, 80 * s, '#3f7a5a', 'Wah, hebat!', 1, 22 * s); g.restore(); }
    const c = pop(t, 2.5, 0.35); if (c > 0) { g.save(); g.translate(hx - 6 * s, hy + 150 * s); g.scale(c, c); bub(g, 0, 0, 160 * s, 70 * s, '#3f7a5a', 'Bangga ya', 1, 22 * s); g.restore(); }
  });
  FX.rings(g, hx, hy, t, { count: 3, r0: 200, r1: 520, speed: 0.35, color: M.rim, a: 0.25 }); FX.dust(g, t, { count: 20, color: M.rim, a: 0.25 });
} });
// ---------- kertas dua kolom ----------
function kertas(g, t, info, o = {}) {
  const cx = E.W / 2, cy = E.H * 0.43, w = 880, h = 940, k = ease.out(prog(t, 0, 0.5));
  g.save(); g.translate(cx, cy + (1 - k) * 120); g.rotate(-0.02); g.globalAlpha *= k;
  glow(g, 0, 0, 900, '#ffd45a', 0.14); rr(g, -w / 2 + 10, -h / 2 + 14, w, h, 14); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill(); rr(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = PAPER; g.fill();
  for (let i = 0; i < 12; i++) seg(g, [[-w / 2 + 20, -h / 2 + 150 + i * 62], [w / 2 - 20, -h / 2 + 150 + i * 62]], 2, 'rgba(60,80,120,.18)');
  const dv = ease.out(prog(t, 0.2, 0.8)); seg(g, [[0, -h / 2 + 40], [0, -h / 2 + 40 + (h - 80) * dv]], 6, INK);
  seg(g, [[-w / 2 + 30, -h / 2 + 120], [-w / 2 + 30 + (w - 60) * dv, -h / 2 + 120]], 6, INK);
  o.fn(g, -w / 2, -h / 2, w, h); g.restore();
}
// s36 115.9–119.74: kiri, yang udah keluar
registerShot('s36', { draw(g, t, info) {
  bg(g, t); const tk = rel('Kiri', info, 1.6);
  kertas(g, t, info, { fn: (g, x, y, w, h) => {
    const a = ease.out(prog(t, tk - 0.1, tk + 0.4)); text(g, 'UDAH KELUAR', x + w * 0.25, y + 80, { size: 40, color: HINA, font: FONTS.ui, weight: 900, spacing: 2, alpha: a });
    [['UKT 4 SEMESTER', 0.1], ['DIKTAT', 0.6], ['2 TAHUN', 1.0]].forEach(([s, d], i) => { const k = ease.out(prog(t, tk + 0.4 + d, tk + 0.9 + d)); text(g, s, x + 50, y + 190 + i * 124, { size: 32, color: INK, font: FONTS.ui, weight: 900, align: 'left', alpha: k }); });
  } });
  FX.dust(g, t, { count: 18, color: '#ffd45a', a: 0.2 });
} });
// s37 119.74–124.2: kanan, yang masih bakal keluar
registerShot('s37', { draw(g, t, info) {
  bg(g, t);
  kertas(g, t, info, { fn: (g, x, y, w, h) => {
    text(g, 'UDAH KELUAR', x + w * 0.25, y + 80, { size: 40, color: HINA, font: FONTS.ui, weight: 900, spacing: 2 });
    [['UKT 4 SEMESTER'], ['DIKTAT'], ['2 TAHUN']].forEach(([s], i) => text(g, s, x + 50, y + 190 + i * 124, { size: 32, color: INK, font: FONTS.ui, weight: 900, align: 'left' }));
    const a = ease.out(prog(t, 0.4, 0.9)); text(g, 'MASIH BAKAL', x + w * 0.75, y + 80, { size: 40, color: '#2f7a5a', font: FONTS.ui, weight: 900, spacing: 2, alpha: a });
    [['3 SEMESTER LAGI', 1.0], ['JAM TIDUR', 1.9], ['TAHUN KERJA', 2.8]].forEach(([s, d], i) => { const k = ease.out(prog(t, d, d + 0.5)); text(g, s, x + w / 2 + 40, y + 190 + i * 124, { size: 32, color: INK, font: FONTS.ui, weight: 900, align: 'left', alpha: k }); });
  } });
  FX.dust(g, t, { count: 18, color: '#ffd45a', a: 0.2 });
} });
// s40 132.2–135.97: tangan menulis catatan, badge 2 JAM
registerShot('s40', { draw(g, t, info) {
  bg(g, t); const cx = E.W / 2, cy = E.H * 0.45;
  g.save(); g.translate(cx, cy); g.rotate(-0.02); rr(g, -420 + 8, -450 + 14, 840, 900, 14); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill(); rr(g, -420, -450, 840, 900, 14); g.fillStyle = PAPER; g.fill();
  for (let i = 0; i < 10; i++) { const p = ease.out(prog(t, 0.2 + i * 0.28, 0.2 + i * 0.28 + 0.5)); seg(g, [[-360, -340 + i * 78], [-360 + (560 - (i % 3) * 110) * p, -340 + i * 78]], 7, INK); }
  const pr = clamp((t - 0.2) / 2.9), li = Math.min(9, Math.floor(pr * 10)), px = -360 + (560 - (li % 3) * 110) * ease.out(prog(pr * 10 - li, 0, 1)), py = -340 + li * 78;
  g.translate(px, py); g.rotate(0.6); seg(g, [[0, 0], [0, -230]], 22, '#d8c64a'); seg(g, [[0, 0], [0, 28]], 14, '#2a2f3a'); g.restore();
  UI.badge(g, { str: '2 JAM', x: E.W - V(110, 130), y: V(110, 300), a: ease.out(prog(t, 0.1, 0.4)) });
  FX.dust(g, t, { count: 18, color: '#ffd45a', a: 0.2 });
} });
