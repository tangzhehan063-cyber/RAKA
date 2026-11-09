// sets/kamar.js — Dimas' adult bedroom: window left, bed, a TALL WARDROBE on the right with an acoustic guitar lying on top.
import { E, V, mix, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const roomGround = () => E.H * V(0.8, 0.68);
// wardrobe geometry (character plane), shared by shots
export const WARD = () => { const GY = roomGround(); const w = V(300, 300), h = V(480, 480), x = E.W / 2 + V(330, 120); return { x, y: GY - h, w, h, top: GY - h, cx: x + w / 2 }; };

// Acoustic guitar. (x,y) = body centre; rot in radians (0 = neck pointing up). dust 0..1 greys it out.
export function guitar(g, x, y, s = 1, rot = 0, o = {}) {
  const dust = o.dust ?? 0, wood = shade('#b8743f', o.dark ?? -0.15), edge = shade('#3a2214', 0), neck = shade('#5a3420', -0.1);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  if (o.glow) glow(g, 0, -60, 260, o.glowColor || '#ffd45a', 0.25 * o.glow);
  // neck + headstock
  rr(g, -13, -330, 26, 250, 6); g.fillStyle = neck; g.fill();
  for (let i = 0; i < 9; i++) seg(g, [[-13, -300 + i * 24], [13, -300 + i * 24]], 2, alpha('#e6d6b8', 0.35));
  rr(g, -20, -380, 40, 58, 8); g.fillStyle = shade(neck, -0.2); g.fill();
  for (const yy of [-368, -350, -334]) { circle(g, -24, yy, 5, '#d9c9a8'); circle(g, 24, yy, 5, '#d9c9a8'); }
  // body (upper bout + lower bout)
  g.fillStyle = wood; g.strokeStyle = edge; g.lineWidth = 6;
  g.beginPath(); g.ellipse(0, -40, 78, 70, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(0, 55, 100, 90, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.fillStyle = wood; g.beginPath(); g.ellipse(0, -40, 74, 66, 0, 0, Math.PI * 2); g.fill();
  circle(g, 0, -12, 30, '#1a100a'); g.strokeStyle = alpha('#f3e3c3', 0.5); g.lineWidth = 3; g.beginPath(); g.arc(0, -12, 36, 0, Math.PI * 2); g.stroke();
  rr(g, -34, 60, 68, 14, 4); g.fillStyle = '#2a1810'; g.fill();                 // bridge
  for (let i = 0; i < 6; i++) { const xx = -10 + i * 4; seg(g, [[xx, -360], [xx * 1.6, 66]], 1.2, alpha('#f5f0e0', o.strings ?? 0.7)); }
  // highlight
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffd9a0', 0.08 + 0.12 * (o.lit ?? 0)); g.beginPath(); g.ellipse(-30, 30, 40, 60, -0.3, 0, Math.PI * 2); g.fill(); g.restore();
  // dust: grey film + specks + a cobweb from the headstock
  if (dust > 0) {
    g.fillStyle = alpha('#9aa0a6', 0.35 * dust); g.beginPath(); g.ellipse(0, -40, 78, 70, 0, 0, Math.PI * 2); g.ellipse(0, 55, 100, 90, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 40; i++) { const a = i * 2.4, r = 20 + (i * 37) % 80; circle(g, Math.cos(a) * r, 20 + Math.sin(a) * r * 0.9, 2.2, alpha('#d8dde0', 0.5 * dust)); }
    g.strokeStyle = alpha('#e8eef0', 0.35 * dust); g.lineWidth = 1.5;
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(20, -380); g.quadraticCurveTo(60 + k * 14, -350 + k * 18, 90 + k * 10, -300 + k * 30); g.stroke(); }
  }
  g.restore();
}

export function wardrobe(g, o = {}) {
  const W = WARD(), M = o.M, body = mix(M.wall, '#6b4a33', 0.55), panel = shade(body, 0.12), line = shade(body, -0.45);
  rr(g, W.x, W.y, W.w, W.h, 6); g.fillStyle = body; g.fill();
  rr(g, W.x - 12, W.y - 16, W.w + 24, 22, 4); g.fillStyle = shade(body, -0.15); g.fill();          // crown
  for (const dx of [14, W.w / 2 + 4]) { rr(g, W.x + dx, W.y + 18, W.w / 2 - 18, W.h - 70, 6); g.fillStyle = panel; g.fill(); }
  seg(g, [[W.cx, W.y + 10], [W.cx, W.y + W.h - 40]], 4, line);
  circle(g, W.cx - 16, W.y + W.h * 0.45, 7, '#c9a46a'); circle(g, W.cx + 16, W.y + W.h * 0.45, 7, '#c9a46a');
  rr(g, W.x + 8, W.y + W.h - 40, W.w - 16, 40, 4); g.fillStyle = shade(body, -0.2); g.fill();
  // rim light on the edge facing the window
  g.strokeStyle = alpha(M.rim, 0.5); g.lineWidth = 3; g.strokeRect(W.x, W.y, W.w, W.h);
  return W;
}

// o: { mood:'night'|'dusk'|'golden', rain, frozen, guitar: 'top'|'none'|false, dust:1, gGlow:0, dim:0, phone:0, outline:0 }
export function kamar(g, t, cam, o = {}) {
  const md = o.mood || 'night', M = mood(md), GY = roomGround(), CX = E.W / 2, night = md === 'night';
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  const wx = CX - V(560, 470), wy = GY - V(640, 980), ww = V(520, 420), wh = V(420, 520);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 12 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]);
      if (night) { FX.moon(g, x + w * 0.7, y + h * 0.25, 30); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.45, color: alpha(wallDark, 0.9), windowColor: alpha(M.practical, 0.7), lit: 0.15, seed: 21 }); }
      else { FX.sun(g, x + w * 0.45, y + h * (md === 'golden' ? 0.55 : 0.9), 44, '#fff3dc', M.key, 4); FX.skyline(g, { x, y: y + h, w, maxH: h * 0.35, color: alpha(wallDark, 0.85), windowColor: alpha(M.practical, 0.4), lit: 0.1, seed: 21 }); }
      if (o.rain) FX.rain(g, o.frozen ? 0.37 : t, { area: [x - 40, y - 40, w + 80, h + 80], count: 120, a: 0.4, color: M.rim, speed: 1700 });
      g.fillStyle = alpha('#9fb8ff', night ? 0.06 : 0.03); g.fillRect(x, y, w, h);
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, night ? M.rim : M.key, night ? 0.08 : 0.2);
    // a poster frame (old band poster) above the bed
    rr(g, CX - V(120, 20), GY - V(560, 860), V(150, 140), V(190, 180), 6); g.fillStyle = shade(wall, -0.25); g.fill();
    circle(g, CX + V(-45, 50), GY - V(480, 770), V(36, 34), alpha(M.rim, 0.25));
  });
  let W;
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww * 0.6, GY + 60, ww * 0.7, 60, night ? M.rim : M.key, night ? 0.12 : 0.25);
    FX.bed(g, { x: CX - V(760, 640), y: GY, w: V(560, 470), color: shade(M.wall, 0.15), frame: wallDark, pillow: shade('#e8e4f4', night ? -0.45 : -0.2) });
    W = wardrobe(g, { M });
    if (o.outline) {   // clean rectangle in the dust where the guitar used to lie
      g.save(); g.globalCompositeOperation = 'lighter'; rr(g, W.cx - 190, W.top - 34, 380, 30, 14); g.strokeStyle = alpha('#ffd45a', 0.6 * o.outline); g.lineWidth = 4; g.stroke();
      glow(g, W.cx, W.top - 20, 260, '#ffd45a', 0.25 * o.outline); g.restore();
    }
    if ((o.guitar ?? 'top') === 'top') guitar(g, W.cx, W.top - V(66, 66), V(0.6, 0.62), -Math.PI / 2, { dust: o.dust ?? 1, glow: o.gGlow || 0, dark: night ? -0.35 : -0.1 });
    if (o.phone) { const px = CX - V(330, 260), py = GY - 10; rr(g, px - 26, py - 8, 52, 12, 3); g.fillStyle = '#0e1116'; g.fill(); glow(g, px, py - 20, 160, '#bcd6ff', 0.35 * o.phone); }
  });
  if (o.dim) { g.fillStyle = alpha('#000', o.dim); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  return { GY, CX, M, W, win: [wx, wy, ww, wh] };
}
