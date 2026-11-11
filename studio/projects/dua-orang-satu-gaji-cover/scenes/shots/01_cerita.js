// 01_cerita.js — "Dua Orang, Satu Gaji": Si Cukup (dunia hangat, style retro) vs Si Kurang (dunia dingin, style arctic).
// Momen khas: layar terbelah; garis pembelah ternyata tepi layar HP, dua orang menyatu jadi satu (s10).
import { E, V, S, setStyle, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, glow, rr, seg, circle, text, FONTS, shake } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { kamar } from '../sets/kamar.js';
import { HERO } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const WARM = '#ffb36b', ICE = '#8fe8ff';
const badge = (g, str, a = 1, color) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a, color });
const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at - 0.08, at - 0.08 + d));
const withStyle = (id, fn) => { const k = E.styleId; setStyle(id); try { fn(); } finally { setStyle(k); } };

// --- props -------------------------------------------------------------------------------------------
export function martabak(g, x, y, s = 1) {   // (x, y) = bottom-centre of the box
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(4, 2, 78, 10, 0, 0, Math.PI * 2); g.fill();
  rr(g, -70, -40, 140, 40, 4); g.fillStyle = '#c99a5b'; g.fill();                       // front
  g.beginPath(); g.moveTo(-70, -40); g.lineTo(-48, -62); g.lineTo(92, -62); g.lineTo(70, -40); g.closePath(); g.fillStyle = '#e2bd84'; g.fill(); // top
  g.beginPath(); g.moveTo(70, -40); g.lineTo(92, -62); g.lineTo(92, -22); g.lineTo(70, 0); g.closePath(); g.fillStyle = '#a97c43'; g.fill();   // side
  g.strokeStyle = '#d63a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -40); g.lineTo(22, -62); g.moveTo(-59, -51); g.lineTo(81, -51); g.stroke();
  g.restore();
}
// kresek (plastic bag) hanging from a hand at (hx, hy), box visible inside
export function kresek(g, hx, hy, s = 1) {
  g.save(); g.translate(hx, hy); g.scale(s, s);
  g.strokeStyle = 'rgba(245,240,230,.9)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-26, 34); g.quadraticCurveTo(0, -14, 26, 34); g.stroke();
  martabak(g, 0, 104, 0.62);
  g.beginPath(); g.moveTo(-34, 30); g.quadraticCurveTo(-52, 70, -46, 110); g.lineTo(52, 110); g.quadraticCurveTo(56, 70, 34, 30); g.closePath();
  g.fillStyle = 'rgba(250,246,238,.38)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.5; g.stroke();
  g.restore();
}
export function phone(g, x, y, s = 1, glowA = 1, color = ICE) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (glowA > 0) glow(g, 0, 0, 150, color, 0.35 * glowA);
  rr(g, -16, -28, 32, 56, 6); g.fillStyle = '#0c0f16'; g.fill();
  rr(g, -13, -24, 26, 46, 4); g.fillStyle = alpha(color, 0.9 * glowA + 0.1); g.fill();
  g.restore();
}
function piggy(g, x, y, s, c) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.ellipse(0, 0, 150, 110, 0, 0, Math.PI * 2); g.fillStyle = '#f0a7a0'; g.fill();
  circle(g, 120, -20, 40, '#f0a7a0'); circle(g, 150, -20, 22, '#d07c78'); circle(g, 60, -40, 10, '#2a1a14');
  for (const lx of [-80, -20, 40, 90]) { rr(g, lx - 14, 80, 28, 50, 8); g.fillStyle = '#d07c78'; g.fill(); }
  rr(g, -40, -112, 80, 14, 6); g.fillStyle = '#2a1a14'; g.fill();
  if (c < 1) circle(g, 0, -260 + 150 * ease.in(c), 34, S().ui.gold);
  g.restore();
}

// --- worlds ------------------------------------------------------------------------------------------
// Si Cukup: jalan senja hangat, berjalan bawa martabak
function warmWorld(g, t, o = {}) {
  const cam = { z: o.z ?? 1.05, x: o.cx ?? 0 };
  const r = street(g, t, cam, { mood: 'golden', sunY: 0.15, rays: 0.6 });
  const GY = r.GY, x = o.x ?? E.W * 0.42 + (o.walk ? 40 * Math.sin(t * 0.5) : 0);
  const pose = o.pose || (o.walk ? walkPose(t * 1.6) : breathe(POSES.relaxed, t, 0.5, 2));
  drawFigure(g, { x, y: GY, s: o.s ?? 2.0, facing: o.facing ?? 1, outfit: HERO, pose, expr: o.expr || 'happy', look: o.look || [0.3, 0], blink: (t % 3.1) > 2.98, rim: { color: r.M.rim, dir: [1, -1] } });
  if (o.box !== false) { const sc = o.s ?? 2.0, fc = o.facing ?? 1; kresek(g, x + pose.hB[0] * sc * fc, GY + pose.hB[1] * sc, sc * 0.75); }
  return r;
}
// Si Kurang: kamar biru malam, duduk di kasur, martabak tak disentuh, HP menyala
function coldWorld(g, t, o = {}) {
  const cam = { z: o.z ?? 1.05, x: o.cx ?? 0 };
  const r = kamar(g, t, cam, { mood: 'night', clock: o.clock || '21:47', dim: o.dim || 0 });
  const GY = r.GY, x = o.x ?? E.W * 0.5, s = o.s ?? 2.0;
  const f = { x, y: GY - 70, s, facing: o.facing ?? -1, outfit: HERO, pose: breathe(POSES.sit, t, 0.4, 4), expr: o.expr || 'worried', look: o.look || [-0.4, 0.6], blink: (t % 2.6) > 2.5, rim: { color: ICE, dir: [-1, -1] } };
  drawFigure(g, f);
  if (o.box !== false) martabak(g, x + 100 * s, GY - 66, 0.55 * s);   // on the floor by his feet, untouched
  const px = x + 34 * s * f.facing, py = GY - 70 - 95 * s;
  if (o.phone !== false) phone(g, px, py, 1.1 * s, o.glowA ?? 1);
  return { ...r, px, py };
}

// --- split screen (garis pembelah = calon tepi layar HP) ---------------------------------------------
export function split(g, t, o = {}) {
  const mid = o.mid ?? E.W / 2, gap = o.gap ?? 0;
  g.save(); g.beginPath(); g.rect(-E.W, -E.H, mid - gap + E.W, E.H * 3); g.clip();
  g.save(); g.translate(-E.W * 0.22 + (o.shiftL || 0), 0); withStyle('ember', () => warmWorld(g, t, { s: 1.75, ...(o.L || {}) })); g.restore();
  g.restore();
  g.save(); g.beginPath(); g.rect(mid + gap, -E.H, E.W * 2, E.H * 3); g.clip();
  g.save(); g.translate(E.W * 0.22 + (o.shiftR || 0), 0); withStyle('arctic', () => coldWorld(g, t, { s: 1.75, ...(o.R || {}) })); g.restore();
  g.restore();
  // the dividing line
  const la = o.lineA ?? 1;
  if (la > 0) { glow(g, mid, E.H * 0.5, 500, '#ffffff', 0.08 * la); g.fillStyle = alpha('#f6efe2', 0.9 * la); g.fillRect(mid - 4, 0, 8, E.H); }
}
function money(g, x, y, str, color, a = 1) {
  text(g, str, x, y, { size: V(70, 86), color, font: FONTS.ui, weight: 900, glow: 22, glowColor: alpha(color, 0.6), alpha: a });
}

// s01 — hook: "Gajian, bro! 5 juta. Martabak spesial, dua!"
registerShot('s01', { draw(g, t, info) {
  warmWorld(g, t, { walk: true, z: 1.05 + 0.04 * ease.inOut(t / info.dur), expr: 'joy' });
  const a = pop(t, rel('5', info, 1.2));
  if (a > 0) { g.save(); g.translate(E.W / 2, 470); g.scale(a, a); money(g, 0, 0, 'Rp5.000.000', S().ui.gold); g.restore(); }
  text(g, 'SI CUKUP', E.W * 0.3, 330, { size: 40, color: WARM, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  badge(g, 'GAJIAN', 1, WARM);
} });

// s02 — "Lima juta juga... kok rasanya kurang"
registerShot('s02', { draw(g, t, info) {
  coldWorld(g, t, { z: 1.08 - 0.03 * ease.inOut(t / info.dur) });
  const a = pop(t, rel('5', info, 0.6));
  if (a > 0) { g.save(); g.translate(E.W / 2, 470); g.scale(a, a); money(g, 0, 0, 'Rp5.000.000', ICE); g.restore(); }
  text(g, 'SI KURANG', E.W * 0.3, 330, { size: 40, color: ICE, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  const k = rel('kurang', info, 4.0);
  if (t > k) { const s = pop(t, k); g.save(); g.translate(E.W / 2, 600); g.scale(s, s); text(g, 'KURANG?', 0, 0, { size: 64, color: '#ff6f61', font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  badge(g, 'GAJIAN', 1, ICE);
} });

// s03 — "Kurang apaan? Bisa nabung, bisa traktir ibu."
registerShot('s03', { draw(g, t, info) {
  warmWorld(g, t, { x: E.W * 0.3, expr: 'smile', pose: breathe(POSES.explain, t, 0.5, 2), box: false });
  const tn = rel('nabung', info, 1.5);
  piggy(g, E.W * 0.7, 900, 0.9, clamp((t - tn) / 0.6));
  const tt = rel('traktir', info, 2.3), a = pop(t, tt);
  if (a > 0) { g.save(); g.translate(E.W * 0.7, 560); g.scale(a, a); martabak(g, 0, 20, 1.4); text(g, 'BUAT IBU ♥', 0, 80, { size: 40, color: WARM, font: FONTS.ui, weight: 900 }); g.restore(); }
  badge(g, 'CUKUP', 1, WARM);
} });

// s04 — the feed: Dito di Jepang, Raka mobil baru
function fuji(g, cx, cy) {
  g.fillStyle = '#ffb4c8'; g.fillRect(cx - 300, cy - 260, 600, 420);
  g.fillStyle = '#6d7fb8'; g.beginPath(); g.moveTo(cx - 280, cy + 160); g.lineTo(cx - 40, cy - 150); g.lineTo(cx + 40, cy - 150); g.lineTo(cx + 280, cy + 160); g.fill();
  g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(cx - 90, cy - 80); g.lineTo(cx - 40, cy - 150); g.lineTo(cx + 40, cy - 150); g.lineTo(cx + 90, cy - 80); g.lineTo(cx + 30, cy - 95); g.lineTo(cx, cy - 70); g.lineTo(cx - 35, cy - 95); g.fill();
  circle(g, cx + 180, cy - 170, 50, '#ff5a46');
}
function car(g, cx, cy) {
  g.fillStyle = '#20314a'; g.fillRect(cx - 300, cy - 260, 600, 420);
  rr(g, cx - 240, cy - 20, 480, 100, 30); g.fillStyle = '#e8e8f0'; g.fill();
  rr(g, cx - 150, cy - 90, 280, 90, 30); g.fillStyle = '#d6dbe8'; g.fill();
  rr(g, cx - 130, cy - 75, 110, 60, 12); g.fillStyle = '#6fa8dc'; g.fill(); rr(g, cx - 5, cy - 75, 110, 60, 12); g.fill();
  circle(g, cx - 140, cy + 85, 42, '#111'); circle(g, cx + 140, cy + 85, 42, '#111'); circle(g, cx - 140, cy + 85, 16, '#999'); circle(g, cx + 140, cy + 85, 16, '#999');
  FX.sparkle(g, cx + 200, cy - 40, 30, '#fff', 0.9);
}
function postCard(g, y, who, place, art, likes) {
  const x = 150, w = E.W - 300;
  rr(g, x, y, w, 820, 40); g.fillStyle = '#f4f6fb'; g.fill();
  circle(g, x + 70, y + 70, 36, '#c9d3e6'); text(g, who, x + 125, y + 58, { size: 38, color: '#1a1f2c', font: FONTS.ui, weight: 900, align: 'left' });
  text(g, place, x + 125, y + 98, { size: 26, color: '#6b7488', font: FONTS.ui, weight: 800, align: 'left' });
  g.save(); rr(g, x + 30, y + 140, w - 60, 520, 24); g.clip(); art(g, E.W / 2, y + 400); g.restore();
  text(g, '♥ ' + likes, x + 40, y + 720, { size: 36, color: '#e0453a', font: FONTS.ui, weight: 900, align: 'left' });
}
registerShot('s04', { draw(g, t, info) {
  g.fillStyle = '#05080f'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W / 2, 700, 900, ICE, 0.18);
  rr(g, 100, 150, E.W - 200, 1160, 70); g.fillStyle = '#0c0f16'; g.fill();
  g.save(); rr(g, 120, 170, E.W - 240, 1120, 56); g.clip(); g.fillStyle = '#dfe5f0'; g.fillRect(0, 0, E.W, E.H);
  const t2 = rel('Raka', info, 3.0), sh = ease.inOut(prog(t, t2 - 0.35, t2));
  g.translate(0, -sh * 900);
  postCard(g, 230, 'dito.jlnjln', 'Kyoto, Jepang', fuji, '2.481');
  postCard(g, 1130, 'raka_', 'Alhamdulillah, mobil pertama', car, '1.207');
  g.restore();
  badge(g, 'SCROLL', 1, ICE);
} });

// s05/s07/s09/s16 — layar terbelah
registerShot('s05', { draw(g, t, info) {
  split(g, t, { L: { expr: 'smile', box: true }, R: { expr: 'worried' } });
  const a = pop(t, rel('Gaji', info, 0.8));
  if (a > 0) { g.save(); g.translate(E.W * 0.25, 330); g.scale(a, a); money(g, 0, 0, '5 JUTA', WARM); g.restore();
    g.save(); g.translate(E.W * 0.75, 330); g.scale(a, a); money(g, 0, 0, '5 JUTA', ICE); g.restore();
    text(g, '=', E.W / 2, 330, { size: 90, color: '#fff', font: FONTS.ui, weight: 900, alpha: a }); }
  const r = rel('satu', info, 2.6);
  if (t > r) text(g, 'BERUBAH: Rp0', E.W / 2, 560, { size: 46, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, r, r + 0.3)) });
} });
registerShot('s06', { draw(g, t, info) {
  g.fillStyle = '#04070d'; g.fillRect(0, 0, E.W, E.H);
  const sh = 0.6 + 0.4 * Math.sin(t * 9);
  glow(g, E.W / 2, 1150, 700, ICE, 0.3);
  bigFace(g, E.W / 2 + shake(t, 3)[0], 660, V(300, 300) * (1 + 0.04 * ease.inOut(t / info.dur)), { outfit: HERO, expr: 'worried', look: [0, 0.7], blink: (t % 2.2) > 2.1, rimColor: ICE, rimSide: 1 });
  phone(g, E.W / 2, 1180, 4, 1);
  // a race the hero is losing: other people's bars run ahead
  const k = ease.out(prog(t, rel('ketinggalan', info, 1.2), info.dur));
  [['DITO', 0.92], ['RAKA', 0.8], ['KAMU', 0.18]].forEach(([n, v], i) => { const y = 230 + i * 70, w = 520;
    text(g, n, 180, y, { size: 30, color: n === 'KAMU' ? '#ff6f61' : alpha('#fff', 0.8), font: FONTS.ui, weight: 900, align: 'left' });
    rr(g, 330, y - 14, w, 28, 14); g.fillStyle = alpha('#fff', 0.12); g.fill();
    rr(g, 330, y - 14, Math.max(28, w * v * k), 28, 14); g.fillStyle = n === 'KAMU' ? '#ff6f61' : ICE; g.fill(); });
  void sh;
} });
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.2, 1.0));
  split(g, t, { L: { expr: 'thinking', facing: 1, look: [1, 0], box: true }, R: { expr: 'sad', look: [-1, 0.6] }, shiftL: 40 * k });
  const q = rel('siapa', info, 1.6);
  if (t > q) { const a = pop(t, q); g.save(); g.translate(E.W / 2, 460); g.scale(a, a); text(g, 'DARI SIAPA?', 0, 0, { size: 76, color: '#fff', font: FONTS.ui, weight: 900, spacing: 4, glow: 20, glowColor: 'rgba(255,255,255,.4)' }); g.restore(); }
} });
registerShot('s08', { draw(g, t, info) {
  const off = rel('matiin', info, 1.2), d = t > off + 0.15 ? 0.75 : 0;
  const r = coldWorld(g, t, { expr: 'angry', dim: d, glowA: 1 });
  if (d > 0) { glow(g, r.px, r.py, 520, ICE, 0.35); }
  text(g, 'KLIK.', E.W * 0.72, 520, { size: 60, color: '#fff', font: FONTS.ui, weight: 900, alpha: t > off ? clamp(1 - (t - off - 0.6) / 0.4) : 0 });
} });
registerShot('s09', { draw(g, t, info) {
  // pull back: both halves slide toward the line, revealing the same bed
  const k = ease.inOut(prog(t, 0.6, info.dur - 0.2));
  split(g, t, { L: { expr: 'smirk', box: false, pose: breathe(POSES.sit, t, 0.4, 2), look: [1, 0.2] }, R: { expr: 'confused', look: [-1, 0], box: false }, shiftL: 140 * k, shiftR: -140 * k });
  veil(g, '#000', 0.25 * k);
} });
registerShot('s16', { draw(g, t, info) {
  // loop: whisper "ada dua orang" — split reappears, then the warm side walks back into frame (-> s01)
  const k = ease.out(prog(t, 0.2, 1.4));
  split(g, t, { L: { expr: 'happy', walk: true }, R: { expr: 'worried' }, lineA: k });
  veil(g, '#000', 0.35 * (1 - k));
  const a = ease.out(prog(t, rel('dua', info, 3.0), rel('dua', info, 3.0) + 0.4));
  text(g, '2 ORANG', E.W / 2, 440, { size: 90, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: a, glow: 24, glowColor: alpha(S().ui.gold, 0.5) });
} });

// s10 — MOMEN KHAS: dua orang menyatu; garis pembelah = tepi layar HP
registerShot('s10', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.15, 1.6)), z = ease.inOut(prog(t, 1.6, info.dur));
  // split collapses: each half slides toward the line, the line widens into the phone screen
  const gap = lerp(0, 120, z);
  split(g, t, { shiftL: 300 * k, shiftR: -300 * k, gap, L: { box: false, expr: 'neutral' }, R: { box: false, expr: 'neutral' }, lineA: 1 - z });
  if (z > 0) {
    const w = lerp(8, 380, z), h = lerp(E.H, 760, z), cy = lerp(E.H / 2, 700, z);
    rr(g, E.W / 2 - w / 2 - 14, cy - h / 2 - 14, w + 28, h + 28, 40 * z); g.fillStyle = alpha('#0c0f16', z); g.fill();
    rr(g, E.W / 2 - w / 2, cy - h / 2, w, h, 30 * z); g.fillStyle = alpha(ICE, 0.25 + 0.6 * z); g.fill();
    glow(g, E.W / 2, cy, 600, ICE, 0.25 * z);
    text(g, 'ORANG YANG SAMA', E.W / 2, 1180, { size: 60, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: z, glow: 20, glowColor: alpha(S().ui.gold, 0.5) });
  }
} });

// s11 — "Bedanya cuma lima menit buka Instagram": half-warm / half-cold face + 5:00 timer
registerShot('s11', { draw(g, t, info) {
  g.fillStyle = '#0b0605'; g.fillRect(0, 0, E.W, E.H);
  const cx = E.W / 2, cy = 640, r = 300;
  g.save(); g.beginPath(); g.rect(0, 0, cx, E.H); g.clip(); glow(g, cx - 250, cy, 700, WARM, 0.3);
  withStyle('ember', () => bigFace(g, cx, cy, r, { outfit: HERO, expr: 'happy', look: [0, 0], blink: false, rimColor: WARM, rimSide: -1 })); g.restore();
  g.save(); g.beginPath(); g.rect(cx, 0, E.W, E.H); g.clip(); glow(g, cx + 250, cy, 700, ICE, 0.3);
  withStyle('arctic', () => bigFace(g, cx, cy, r, { outfit: HERO, expr: 'worried', look: [0, 0], blink: false, rimColor: ICE, rimSide: 1 })); g.restore();
  g.fillStyle = alpha('#fff', 0.8); g.fillRect(cx - 3, cy - r * 1.2, 6, r * 2.4);
  const tm = rel('lima', info, 2.6), p = clamp((t - tm) / (info.dur - tm - 0.3));
  if (t > tm) { const sec = Math.round(300 * p), str = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    rr(g, cx - 210, 1040, 420, 150, 36); g.fillStyle = alpha('#000', 0.6); g.fill();
    text(g, str, cx, 1115, { size: 110, color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(S().ui.gold, 0.6) });
    text(g, 'SCROLL', cx, 1000, { size: 34, color: alpha('#fff', 0.8), font: FONTS.ui, weight: 900, spacing: 8 }); }
  badge(g, '5 MENIT');
} });
