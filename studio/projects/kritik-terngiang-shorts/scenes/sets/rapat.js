// sets/rapat.js — ruang rapat kantor sore (gaya GrowKaz): jendela kaca besar ke kota yang menyala, layar proyektor, plafon berlampu, tanaman; meja panjang + kursi + laptop.
// Struktur nilai: dinding gelap, aksen terang = jendela matahari terbenam + layar. Dipakai ulang oleh semua shot (zoom/blur beda).
import { E, V, mood, layer, blurLayer, backdrop, linGrad, alpha, shade, mix, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const rapatGround = () => E.H * V(0.8, 0.68);
export function rapat(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), G = rapatGround(), CX = E.W / 2, wall = shade(M.wall, -0.32), dark = shade(M.wall, -0.62);
  layer(g, cam, 0.12, (g) => {   // langit + matahari + kota jauh
    backdrop(g, M.sky); FX.sun(g, CX + 160, G - V(560, 900), 70, '#fff3dc', M.key, 5);
    FX.clouds(g, { y: G - V(900, 1400), h: 200, color: M.fog, a: 0.16, seed: 5 });
    FX.skyline(g, { x: -E.W, y: G - V(420, 700), w: E.W * 3, minH: 80, maxH: V(260, 420), color: mix(M.sky[1], dark, 0.75), windowColor: alpha(M.practical, 0.5), lit: 0.16, seed: 8 });
  });
  layer(g, cam, 0.55, (g) => {   // dinding kantor
    const top = G - V(900, 1280);
    g.fillStyle = linGrad(g, 0, top, 0, G, [shade(wall, 0.05), wall, dark]); g.fillRect(CX - 1400, top, 2800, G - top + 4);
    // jendela kaca besar (kanan): kota menyala di baliknya
    for (let i = 0; i < 2; i++) {
      const wx = CX + 30 + i * 240, wy = G - V(780, 1000), ww = 220, wh = V(560, 640);
      FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 1, rows: 2, frame: dark, bar: 12 }, (g, x, y, w, h) => {
        backdrop(g, M.sky, [x, y, w, h]); FX.sun(g, x + w * 0.5, y + h * 0.82, 44, '#fff3dc', M.key, 4);
        FX.skyline(g, { x, y: y + h, w, maxH: h * 0.55, color: alpha(dark, 0.92), windowColor: alpha(M.practical, 0.75), lit: 0.3, seed: 31 + i });
      });
      glow(g, wx + ww / 2, wy + wh / 2, 380, M.key, 0.16);
    }
    // layar proyektor (kiri) dengan slide
    const sx = CX - 520, sy = G - V(760, 900), sw = 400, sh = 290;
    FX.screen(g, { x: sx, y: sy, w: sw, h: sh, frame: shade(dark, -0.2), bg: shade(M.wall, 0.55), glowC: M.practical, a: 0.2 }, (g) => {
      text(g, o.slide || 'SLIDE 4', sx + sw / 2, sy + 70, { size: 46, color: shade(dark, -0.1), font: FONTS.ui, weight: 900, spacing: 2 });
      [0.5, 0.8, 0.35, 0.65].forEach((v, i) => { rr(g, sx + 44 + i * 82, sy + sh - 30 - v * 160, 56, v * 160, 6); g.fillStyle = i === 2 ? M.practical : shade(M.wall, -0.1); g.fill(); });
    });
    glow(g, sx + sw / 2, sy + sh / 2, 380, M.practical, 0.14 * (o.screenGlow ?? 1));
    // plafon berlampu + tanaman
    for (const lx of [-460, -140, 180]) { rr(g, CX + lx, top + 28, 220, 14, 7); g.fillStyle = shade(M.key, -0.1); g.fill(); glow(g, CX + lx + 110, top + 40, 190, M.key, 0.28); }
    for (let k = 0; k < 7; k++) { const a = -2.4 + k * 0.4; seg(g, [[CX + 500, G - 120], [CX + 500 + Math.cos(a) * 110, G - 120 + Math.sin(a) * 150]], 14, shade(M.dark, -0.1)); }
    rr(g, CX + 475, G - 128, 50, 80, 8); g.fillStyle = shade(wall, -0.3); g.fill();
  });
  layer(g, cam, 0.9, (g) => {   // lantai + genangan cahaya
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, -0.1), shade(M.dark, -0.3)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.floorLines(g, G, G + 700, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, CX + 190, G + 40, 640, 60, M.key, 0.26); FX.pool(g, CX - 340, G + 40, 460, 50, M.practical, 0.2);
  });
  return { G, CX, M };
}
// meja + laptop + kursi di depth 1 (digambar setelah tokoh agar menutup tubuh bawah): panggil sebelum/sesudah sesuai urutan
export function mejaRapat(g, G, CX, M, t = 0) {
  rr(g, CX - 40, G - 170, 600, 24, 10); g.fillStyle = shade(M.floor, 0.14); g.fill(); g.fillStyle = 'rgba(255,220,170,.35)'; g.fillRect(CX - 34, G - 170, 588, 3);
  seg(g, [[CX - 10, G - 146], [CX - 10, G]], 12, shade(M.floor, -0.3)); seg(g, [[CX + 530, G - 146], [CX + 530, G]], 12, shade(M.floor, -0.3));
  [100, 260, 420].forEach((x, i) => { FX.screen(g, { x: CX + x - 40, y: G - 250, w: 90, h: 58, frame: '#0c0c12', bg: shade(M.dark, -0.3), glowC: M.practical, a: 0.3 }); });
}
export function kursiDepan(g, cam, M, G) {
  blurLayer(g, 11, (g) => { [[120, 1.05], [E.W - 100, 1.2]].forEach(([x, s]) => { g.save(); g.translate(x, G + 80); g.scale(s, s); rr(g, -90, -430, 180, 330, 36); g.fillStyle = shade(M.dark, -0.5); g.fill(); rr(g, -110, -120, 220, 40, 14); g.fill(); g.restore(); }); }, cam, 1.7);
}
