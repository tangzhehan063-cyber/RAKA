// 03_ruang3d.js — HIBRID: adegan ruangan dalam 3D (kamera mengorbit/dolly), overlay 2D (badge, callout, gelembung).
// s01-s05, s07, s14, s15, s17, s18. Close-up wajah, layar HP, kartu riset tetap 2D (01_ruang.js, 02_papan.js).
import { E, V, S, registerShot, ease, prog, clamp, lerp, wordTime, alpha, circle, seg, text, FONTS, veil } from '/engine/core.js';
import { POSES, breathe, walkPose, posesAt } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { buildRoom, SEAT, DOOR, HOOK } from '../sets/ruang3d.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const hhmm = (min) => { const m = Math.round(min), h = 18 + Math.floor(m / 60); return `${h}:${String(m % 60).padStart(2, '0')}`; };
const SIT = { ...POSES.sit, sh: [-3, -146], head: [6, -178], eF: [18, -112], hF: [34, -136], eB: [8, -110], hB: [30, -132] };   // sedikit bersandar
const FOV = V(36, 46);
const SPEED = 1.0;                       // m/dtk saat masuk
const X0 = DOOR.x, Z0 = -1.75;            // titik di depan pintu
const walkPos = (d) => [X0 + d, Z0 + (SEAT.z + 0.1 - Z0) * clamp(d / 3.9)];   // d = jarak jalan dari pintu (m)

let CUR = null;                            // proyeksi 3D -> layar untuk overlay
const proj = (x, y, z) => { const v = new CUR.T.THREE.Vector3(x, y, z).project(CUR.cam); return [(v.x * 0.5 + 0.5) * E.W, (-v.y * 0.5 + 0.5) * E.H]; };
const badge = (g, str, a = 1) => UI.badge(g, { str, x: E.W - V(90, 110), y: V(110, 300), a });
const tick = (g, x, y, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); const k = ease.outBack(clamp(a)); g.translate(x, y); g.scale(k, k); circle(g, 0, 0, 34, S().ui.gold); seg(g, [[-14, 2], [-4, 13], [16, -12]], 8, '#1b1b1f'); g.restore(); };

// definisi shot 3D: opts = { mood, cam(t,info)->{pos,look,fov}, state(t,info,T)->{room, hero}, overlay(g,t,info) }
function room3d(opts) {
  return {
    kind: '3d',
    init(T) {
      const st = T.stage({ mood: opts.mood, fov: FOV, fog: [14, 40], keyPos: opts.keyPos || [-3, 6, 6], keyIntensity: opts.key ?? 1.6, ambient: opts.ambient ?? 1.4, shadowSize: 6 });
      const room = buildRoom(T, st, { mood: opts.mood });
      return { stage: st, room };
    },
    draw(s, t, info, T) {
      const c = opts.cam(t, info), cam = s.stage.camera;
      cam.position.set(...c.pos); cam.lookAt(...c.look); if (c.fov) { cam.fov = c.fov; cam.updateProjectionMatrix(); }
      const st = opts.state(t, info);
      s.room.apply(st.room); s.room.setHero(st.hero);
      CUR = { T, cam };
    },
    overlay(g, t, info) { opts.overlay?.(g, t, info); },
  };
}
// kamera: orbit mengelilingi target (sudut a, radius r)
const orb = (target, r, h, a0, a1, t, dur, fov) => { const a = lerp(a0, a1, ease.inOut(clamp(t / dur))); return { pos: [target[0] + Math.sin(a) * r, h, target[2] + Math.cos(a) * r], look: target, fov }; };

// ---- s01 / s18: masuk lewat pintu (loop: frame akhir s18 == frame awal s01) ----------------------
const wideCam = (t) => ({ pos: [0.15, 1.9, 5.8], look: [0.15, 1.35, -0.5], fov: V(42, 62) });
const arriveState = (d) => { const [x, z] = walkPos(d); return { room: { open: 1, min: 0 }, hero: { x, z, yaw: 0, pose: walkPose(d * 3.2, { stride: 22, lean: 4 }), bag: true } }; };
registerShot('s01', room3d({ mood: 'golden', cam: wideCam, state: (t) => arriveState(SPEED * t), overlay: (g) => badge(g, '18:00') }));
registerShot('s18', room3d({ mood: 'golden', cam: wideCam, state: (t, i) => arriveState(-SPEED * (i.dur - t)), overlay: (g) => badge(g, '18:00') }));

// ---- s02: tas masih di punggung, sepatu masih nempel -> duduk -------------------------------------
registerShot('s02', room3d({ mood: 'golden',
  cam: (t, i) => orb([SEAT.x - 0.15, 0.95, SEAT.z], 3.6, 1.35, -0.75, 0.05, t, i.dur, V(42, 52)),
  state: (t) => ({ room: { open: 1, min: 2 }, hero: { x: lerp(0.95, SEAT.x, ease.inOut(prog(t, 1.7, 2.5))), z: SEAT.z, yaw: Math.PI, pose: posesAt(t, [[0, POSES.stand], [1.8, SIT]], 0.7), bag: true } }),
  overlay: (g, t, i) => {
    const tb = rel('masih', i, 0.2), ts = rel('sepatu', i, 1.5), [bx, by] = proj(SEAT.x + 0.22, 1.0, SEAT.z), [fx, fy] = proj(0.95, 0.05, SEAT.z + 0.1);
    UI.callout(g, t, { at: [bx, by], to: [bx - 60, by - 190], str: 'TAS', start: tb, color: '#ff8a6a', size: 64 });
    UI.callout(g, t, { at: [fx, fy], to: [fx - 120, fy - 290], str: 'SEPATU', start: ts, color: S().ui.cream, size: 64 });
    badge(g, '18:01');
  } }));

// ---- s03: duduk, buka HP ---------------------------------------------------------------------
const sitState = (t, min, extra = {}) => ({ room: { open: 1, min, ...(extra.room || {}) }, hero: { x: SEAT.x, z: SEAT.z, yaw: Math.PI, pose: breathe(SIT, t, 0.5, 2), bag: true, phone: 1, ...(extra.hero || {}) } });
registerShot('s03', room3d({ mood: 'golden',
  cam: (t, i) => orb([SEAT.x - 0.2, 0.9, SEAT.z], 3.4 - 0.3 * (t / i.dur), 1.25, -0.9, -0.55, t, i.dur, V(42, 52)),
  state: (t) => sitState(t, 5), overlay: (g) => badge(g, '18:05') }));

// ---- s04: gelembung pikiran (mandi, makan) ------------------------------------------------------
function iconShower(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[-24, -26], [8, -26], [24, -10]], 6, S().ink); circle(g, 26, -4, 14, S().ink); for (let i = -1; i <= 1; i++) seg(g, [[26 + i * 12, 16], [26 + i * 15, 34]], 4, '#4a8fd0'); g.restore(); }
function iconPlate(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); circle(g, 0, 4, 26, S().ink); circle(g, 0, 4, 17, '#efe8d8'); seg(g, [[-42, -18], [-42, 26]], 5, S().ink); seg(g, [[42, -18], [42, 26]], 5, S().ink); g.restore(); }
registerShot('s04', room3d({ mood: 'golden',
  cam: (t, i) => orb([SEAT.x - 0.2, 0.95, SEAT.z], 3.6, 1.3, -0.55, -0.95, t, i.dur, V(42, 52)),
  state: (t) => sitState(t, 8, { hero: { pose: breathe({ ...SIT, head: [9, -176] }, t, 0.5, 2) } }),
  overlay: (g, t, i) => {
    const [hx, hy] = proj(SEAT.x, 1.7, SEAT.z), tm = rel('mandi', i, 1.6), tk = rel('makan', i, 2.6);
    [[tm, -190, -120, iconShower], [tk, -40, -300, iconPlate]].forEach(([at, dx, dy, ic]) => { const a = ease.outBack(prog(t, at - 0.1, at + 0.25)); if (a <= 0) return;
      g.save(); g.translate(hx + dx, hy + dy); g.scale(clamp(a), clamp(a)); UI.bubble(g, 0, 0, { w: 210, h: 160, dots: false, color: '#f4efe6' }); ic(g, 0, 0, 1.6); g.restore(); });
    badge(g, '18:08');
  } }));

// ---- s05: jam melompat 18:30 -> 19:00, Doni tidak bergerak, langit sore jadi petang --------------
registerShot('s05', room3d({ mood: 'dusk',
  cam: (t, i) => orb([0.2, 1.2, -0.6], 6.0, 1.7, -0.2, 0.1, t, i.dur, V(42, 62)),
  state: (t, i) => { const t30 = rel('Setengah', i, 0.6), t7 = rel('Jam', i, 2.4); const m = t < t30 ? 8 + 22 * ease.inOut(prog(t, 0, t30)) : t < t7 ? 30 : 60; return sitState(t, m); },
  overlay: (g, t, i) => { const t30 = rel('Setengah', i, 0.6), t7 = rel('Jam', i, 2.4); badge(g, hhmm(t < t30 ? 8 + 22 * ease.inOut(prog(t, 0, t30)) : t < t7 ? 30 : 60)); if (Math.abs(t - t7) < 0.12) veil(g, '#ffffff', 0.25 * (1 - Math.abs(t - t7) / 0.12)); } }));

// ---- s07: malam, gelembung "Dari tadi ngapain aja?" ---------------------------------------------
registerShot('s07', room3d({ mood: 'night', key: 1.0, ambient: 1.0,
  cam: (t, i) => orb([SEAT.x - 0.2, 0.95, SEAT.z], 4.0, 1.2, -1.0, -0.6, t, i.dur, V(42, 52)),
  state: (t) => sitState(t, 90),
  overlay: (g, t, i) => {
    const ta = rel('Dari', i, 1.4), a = ease.outBack(prog(t, ta - 0.05, ta + 0.3));
    if (a > 0) { g.save(); g.translate(E.W / 2 - 20, 470 + Math.sin(t * 1.7) * 6); g.scale(clamp(a), clamp(a)); UI.bubble(g, 0, 0, { w: 860, h: 170, dots: false, color: '#10131c' });
      text(g, 'Dari tadi ngapain aja?', 0, 2, { size: 64, color: '#f4efe6', font: FONTS.ui, weight: 900 }); g.restore(); }
    badge(g, '19:30');
  } }));

// ---- s14: ritual: pintu ditutup, tas digantung, sepatu dilepas, baru duduk -----------------------
registerShot('s14', room3d({ mood: 'interiorWarm', key: 1.4,
  cam: (t, i) => ({ pos: [lerp(0.0, 0.3, t / i.dur), 1.9, 5.8], look: [lerp(0.0, 0.3, t / i.dur), 1.3, -0.5], fov: V(42, 62) }),
  state: (t, i) => {
    const tc = rel('ditutup', i, 0.9), tg = rel('digantung', i, 2.6), tl = rel('dilepas', i, 4.4), td = rel('duduk', i, 6.0);
    const open = 1 - ease.inOut(prog(t, tc - 0.1, tc + 0.45)), wk = ease.inOut(prog(t, tl + 0.2, Math.max(tl + 0.7, td - 0.8)));
    const px = lerp(X0 + 0.9, 0.85, wk), pz = lerp(Z0 + 0.3, SEAT.z + 0.1, wk), turn = ease.inOut(prog(t, td - 0.7, td - 0.1)), back = ease.inOut(prog(t, td - 0.1, td + 0.5));
    const sat = t >= td - 0.1, walking = wk > 0 && wk < 1;
    const pose = sat ? posesAt(t, [[0, POSES.stand], [td, SIT]], 0.5) : turn > 0 ? POSES.stand : walking ? walkPose(t * 7, { stride: 22 }) : (t > tg - 0.3 && t < tg + 0.3 ? POSES.reach : POSES.relaxed);
    return { room: { open, min: 10, hungBag: t >= tg, swing: t >= tg ? 0.1 * Math.sin((t - tg) * 9) * Math.exp(-(t - tg) * 2.2) : 0, shoes: t >= tl },
      hero: { x: lerp(px, SEAT.x, back), z: lerp(pz, SEAT.z, back), yaw: lerp(wk > 0 ? 0 : Math.PI * 0.5, Math.PI, turn), pose, bag: t < tg, phone: t >= td + 0.2 ? 0.5 : 0 } };
  },
  overlay: (g, t, i) => {
    const tc = rel('ditutup', i, 0.9), tg = rel('digantung', i, 2.6), tl = rel('dilepas', i, 4.4);
    const [a1, b1] = proj(DOOR.x + 0.1, 1.9, DOOR.z), [a2, b2] = proj(HOOK.x, HOOK.y - 0.2, HOOK.z), [a3, b3] = proj(DOOR.x + 0.1, 0.25, -1.8);
    tick(g, a1 + 120, b1, prog(t, tc + 0.4, tc + 0.7)); tick(g, a2 + 80, b2, prog(t, tg + 0.2, tg + 0.5)); tick(g, a3 + 80, b3, prog(t, tl + 0.2, tl + 0.5));
    badge(g, '18:10');
  } }));

// ---- s15: jalur lama putus, Doni bangun & pergi -----------------------------------------------
registerShot('s15', room3d({ mood: 'interiorWarm', key: 1.4,
  cam: (t, i) => ({ pos: [lerp(0.4, 0.1, t / i.dur), 1.9, 5.8], look: [lerp(0.4, 0.1, t / i.dur), 1.3, -0.5], fov: V(42, 62) }),
  state: (t, i) => { const tp = rel('putus', i, 2.4), cut = ease.inOut(prog(t, tp - 0.2, tp + 0.5)), wk = ease.inOut(prog(t, 0.7, i.dur));
    return { room: { open: 0, min: 12, hungBag: true, shoes: true, rail: ease.out(prog(t, 0.1, 0.9)), cut },
      hero: { x: t < 1.2 ? lerp(SEAT.x, 0.85, ease.inOut(prog(t, 0.5, 1.2))) : lerp(0.85, -1.7, ease.inOut(prog(t, 1.2, i.dur))), z: lerp(SEAT.z, SEAT.z + 0.2, wk), yaw: Math.PI, bag: false, pose: t < 1.3 ? posesAt(t, [[0, SIT], [0.6, POSES.stand]], 0.6) : walkPose(t * 7, { stride: 22 }) } }; },
  overlay: (g) => badge(g, '18:12') }));

// ---- s17: 19:30 santai beneran ------------------------------------------------------------------
registerShot('s17', room3d({ mood: 'night', key: 1.1, ambient: 1.2,
  cam: (t, i) => orb([0.2, 1.2, -0.6], 5.8, 1.8, -0.3, 0.05, t, i.dur, V(42, 62)),
  state: (t) => ({ room: { open: 0, min: 90, hungBag: true, shoes: true, lamp: 1 }, hero: { x: SEAT.x, z: SEAT.z, yaw: Math.PI, bag: false, phone: 0.8, pose: breathe({ ...SIT, head: [14, -176] }, t, 0.5, 4) } }),
  overlay: (g) => badge(g, '19:30') }));
