// sets/ruang.js — ruang tamu Doni: pintu kiri (+ gantungan tas), jam dinding analog, jendela, sofa kanan.
// o: { mood:'golden'|'dusk'|'night'|'interiorWarm', min: menit sejak 18:00, door: 0..1 (buka), dim, lamp: 0..1,
//      bagOnHook: bool, shoes: bool, rail: 0..1 (garis jalur pintu->sofa), railCut: 0..1 }
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { BAG } from '../cast.js';

export const GY = () => E.H * 0.68;
export const sofaBox = () => ({ x: E.W / 2 - 10, w: 500 });
export const seatX = () => sofaBox().x + 270;
export const hookPos = () => [340, GY() - 470];
export const doorBox = () => ({ x: 40, w: 250, h: 650 });

export function clockFace(g, x, y, r, min, M, ink = '#1b1b1f') {
  glow(g, x, y, r * 2.2, M.practical, 0.12);
  circle(g, x, y, r + 10, shade(M.wall, -0.5)); circle(g, x, y, r, '#efe8d8');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; seg(g, [[x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82], [x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94]], i % 3 === 0 ? 5 : 3, ink); }
  const tot = 18 * 60 + min, ha = (tot % 720) / 720 * Math.PI * 2 - Math.PI / 2, ma = (tot % 60) / 60 * Math.PI * 2 - Math.PI / 2;
  seg(g, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], 8, ink);
  seg(g, [[x, y], [x + Math.cos(ma) * r * 0.78, y + Math.sin(ma) * r * 0.78]], 5, ink);
  circle(g, x, y, 7, BAG);
}

// tas kerja digantung di gantungan (swing: ayunan kecil)
export function tasGantung(g, x, y, s = 1, swing = 0) {
  g.save(); g.translate(x, y); g.rotate(swing);
  seg(g, [[-14 * s, 0], [-14 * s, 40 * s], [14 * s, 40 * s], [14 * s, 0]], 6, '#7a2418');
  rr(g, -52 * s, 36 * s, 104 * s, 130 * s, 16 * s); const gr = g.createLinearGradient(0, 36 * s, 0, 166 * s); gr.addColorStop(0, '#e8684e'); gr.addColorStop(1, '#a3321f'); g.fillStyle = gr; g.fill();
  rr(g, -40 * s, 70 * s, 80 * s, 46 * s, 10 * s); g.fillStyle = alpha('#000', 0.18); g.fill();
  seg(g, [[-52 * s, 62 * s], [52 * s, 62 * s]], 5, alpha('#ff9a7a', 0.7));
  g.restore();
}
export function hook(g) { const [x, y] = hookPos(); seg(g, [[x - 34, y - 10], [x + 34, y - 10]], 10, '#3a2a28'); circle(g, x, y - 2, 9, '#2a1a18'); }

export function sepatu(g, x, y, s = 1, col = '#23262e') {
  for (const dx of [0, 70]) { g.save(); g.translate(x + dx * s, y);
    g.beginPath(); g.moveTo(-30 * s, 0); g.lineTo(-30 * s, -26 * s); g.quadraticCurveTo(-4 * s, -34 * s, 8 * s, -18 * s); g.quadraticCurveTo(34 * s, -14 * s, 38 * s, 0); g.closePath(); g.fillStyle = col; g.fill();
    seg(g, [[-30 * s, -2 * s], [38 * s, -2 * s]], 5, '#efe8d8'); g.restore(); }
}

export function ruang(g, t, cam, o = {}) {
  const md = o.mood || 'golden', M = mood(md), G = GY(), CX = E.W / 2, night = md === 'night';
  const wall = shade(M.wall, -0.1), wallDark = shade(M.wall, -0.5);
  const wx = CX + 40, wy = G - 780, ww = 420, wh = 470;
  const d = doorBox(), open = o.door ?? 0;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, G, [shade(wall, -0.25), wall]); g.fillRect(-E.W, -E.H, E.W * 3, G + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]);
      if (night) { FX.moon(g, x + w * 0.7, y + h * 0.25, 28); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.42, color: alpha(wallDark, 0.9), windowColor: alpha(M.practical, 0.7), lit: 0.25, seed: 7 }); }
      else FX.sun(g, x + w * 0.35, y + h * (md === 'golden' ? 0.8 : 0.93), 44, '#fff3dc', M.key, 4), FX.skyline(g, { x, y: y + h, w, maxH: h * 0.32, color: alpha(wallDark, 0.85), windowColor: alpha(M.practical, 0.5), lit: 0.18, seed: 7 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, night ? M.rim : M.key, night ? 0.06 : 0.22);
    clockFace(g, CX - 200, G - 900, 84, o.min ?? 0, M);
    // pintu + kusen
    const top = G - d.h; rr(g, d.x - 14, top - 14, d.w + 28, d.h + 14, 8); g.fillStyle = shade(M.wall, -0.65); g.fill();
    if (open > 0) { g.fillStyle = linGrad(g, 0, top, 0, G, [alpha(M.key, 0.55), alpha(M.fog, 0.45)]); g.fillRect(d.x, top, d.w, d.h); glow(g, d.x + d.w / 2, G - 80, 260, M.key, 0.25 * open); }
    const wdt = d.w * (1 - 0.72 * open), sk = 46 * open;
    g.beginPath(); g.moveTo(d.x, top); g.lineTo(d.x + wdt, top + sk); g.lineTo(d.x + wdt, G - sk * 0.6); g.lineTo(d.x, G); g.closePath();
    g.fillStyle = shade(M.wall, -0.35); g.fill();
    if (open < 0.5) { rr(g, d.x + 28, top + 40, wdt - 56, 230, 8); g.strokeStyle = alpha('#000', 0.25); g.lineWidth = 4; g.stroke(); rr(g, d.x + 28, top + 310, wdt - 56, 260, 8); g.stroke(); circle(g, d.x + wdt - 34, G - 330, 11, '#e8c26a'); }
    hook(g);
    if (o.bagOnHook) { const [hx, hy] = hookPos(); tasGantung(g, hx, hy, 1, o.bagSwing || 0); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, G, 0, G + 500, [shade(M.floor, -0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, G, E.W * 3, E.H * 2);
    FX.floorLines(g, G, G + 700, 'rgba(0,0,0,.22)', 0.08);
    FX.pool(g, wx + ww * 0.5, G + 70, ww * 0.9, 60, night ? M.rim : M.key, night ? 0.1 : 0.25);
    if (o.shoes) sepatu(g, d.x + 70, G + 60, 1.5);
    // jalur pintu -> sofa di lantai
    if (o.rail > 0) {
      const x0 = d.x + 130, x1 = seatX(), y = G + 40, cut = o.railCut || 0, gap = cut * 240, mid = (x0 + x1) / 2;
      const col = alpha(M.practical, 0.9);
      const seg2 = (a, b) => { if (b > a) { seg(g, [[a, y], [b, y]], 10, col); for (let k = a; k < b; k += 60) seg(g, [[k, y - 12], [k, y + 12]], 4, alpha(col, 0.7)); } };
      const L = x0 + (x1 - x0) * o.rail; if (cut > 0) { seg2(x0, Math.min(L, mid - gap / 2)); seg2(Math.min(L, mid + gap / 2), L); } else seg2(x0, L);
      glow(g, L, y, 120, M.practical, 0.35 * (1 - cut * 0.8));
    }
    // sofa
    const s = sofaBox(), night2 = night ? -0.35 : 0, sc = shade('#5c7088', night2), sd = shade(sc, -0.3), sl = shade(sc, 0.18);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(s.x + s.w / 2, G + 6, s.w * 0.55, 18, 0, 0, Math.PI * 2); g.fill();
    rr(g, s.x + 10, G - 360, s.w - 20, 250, 44); g.fillStyle = sd; g.fill();
    rr(g, s.x + 30, G - 130, s.w - 60, 100, 26); g.fillStyle = sc; g.fill();
    rr(g, s.x + 30, G - 134, s.w - 60, 26, 13); g.fillStyle = sl; g.fill();
    rr(g, s.x - 16, G - 250, 76, 230, 32); g.fillStyle = sc; g.fill(); rr(g, s.x + s.w - 60, G - 250, 76, 230, 32); g.fillStyle = sc; g.fill();
    seg(g, [[s.x + 20, G - 20], [s.x + 20, G + 8]], 12, '#2a1c18'); seg(g, [[s.x + s.w - 20, G - 20], [s.x + s.w - 20, G + 8]], 12, '#2a1c18');
  });
  if (o.lamp) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, sofaBox().x + 250, G - 380, 520, '#ffcf80', 0.16 * o.lamp); g.restore(); }
  if (o.dim) { g.fillStyle = alpha('#000', o.dim); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  return { GY: G, CX, M };
}
