// sets/kalender.js — video #5: the red marker (mascot item) and the dark countdown tear-off calendar.
import { E, S, alpha, glow, rr, seg, circle, text, FONTS } from '/engine/core.js';
const RED = '#d64a33', PAGE = '#17201f';
// --- the red marker (tip at x,y, body pointing along ang) -------------------------------------------
export function marker(g, x, y, ang = -0.6, s = 1, capOff = true) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(20, -9); g.lineTo(20, 9); g.closePath(); g.fillStyle = '#7a1f14'; g.fill();
  rr(g, 18, -15, 150, 30, 8); g.fillStyle = RED; g.fill();
  rr(g, 18, -15, 150, 9, 5); g.fillStyle = alpha('#ffffff', 0.25); g.fill();
  rr(g, 120, -16, 10, 32, 3); g.fillStyle = '#7a1f14'; g.fill();
  if (!capOff) { rr(g, 0, -17, 60, 34, 10); g.fillStyle = '#b23a28'; g.fill(); }
  g.restore();
}

// --- the countdown calendar: dark tear-off page, red header, giant gold number --------------------
export function countCal(g, cx, top, o = {}) {
  const w = o.w || 640, h = o.h || 740, ui = S().ui, n = o.num ?? 52;
  // page stack edges (the 52 pages left)
  for (let i = 4; i >= 1; i--) { rr(g, cx - w / 2 + i * 3, top + i * 7, w, h, 26); g.fillStyle = alpha('#0c1312', 0.9); g.fill(); g.strokeStyle = alpha(ui.cream, 0.18); g.lineWidth = 2; g.stroke(); }
  if (o.glow) glow(g, cx, top + h * 0.55, w * 1.1, ui.gold, 0.25 * o.glow);
  rr(g, cx - w / 2, top, w, h, 26); g.fillStyle = PAGE; g.fill(); g.strokeStyle = alpha(ui.cream, 0.35); g.lineWidth = 4; g.stroke();
  g.save(); rr(g, cx - w / 2, top, w, h, 26); g.clip(); g.fillStyle = '#c4473a'; g.fillRect(cx - w / 2, top, w, h * 0.17); g.restore();
  for (const dx of [-0.3, 0.3]) { circle(g, cx + dx * w, top + 10, 14, '#0c1312'); seg(g, [[cx + dx * w, top - 26], [cx + dx * w, top + 14]], 9, '#8a8f96'); }
  text(g, o.header || 'MENUJU 1 JANUARI', cx, top + h * 0.09, { size: h * 0.055, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 });
  const pop = o.pop ?? 1;
  g.save(); g.translate(cx, top + h * 0.52); g.scale(pop, pop);
  text(g, String(n), 0, 0, { size: h * 0.44, color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.55) });
  g.restore();
  text(g, o.sub || 'HARI LAGI', cx, top + h * 0.84, { size: h * 0.07, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
}

