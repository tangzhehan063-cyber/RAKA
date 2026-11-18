// 04_kartu3d.js — s13 (shot 3D): dua baris kartu catatan di meja. Kiri "sekaligus" memudar cepat, kanan "berjeda" tetap segar (di-"ulang" tiga kali).
import { E, V, registerShot, ease, prog, clamp, lerp, text, alpha, FONTS, S } from '/engine/core.js';

const TOP = 0.8;
const rnd = (i, seed = 1) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };

registerShot('s13', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(36, 44), fog: [8, 24], keyPos: [-2.5, 3, 2.2], keyIntensity: 2.2, ambient: 3.0, shadowSize: 4 });
    const M = st.M || {}, W = M.wall || '#dfe6f0', F = M.floor || '#8a96a8';
    st.add(T.ground(10, 10, F, T.planks(F, 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, W, 0, 2, -1.4));
    st.add(T.box(1.8, 0.06, 0.9, '#d8c4a4', 0, TOP, -0.6));
    for (const [x, z] of [[-0.8, -0.95], [0.8, -0.95], [-0.8, -0.25], [0.8, -0.25]]) st.add(T.box(0.06, TOP, 0.06, '#a8946c', x, TOP / 2, z));
    const mk = (x, z, c) => { const m = T.box(0.15, 0.006, 0.2, c, x, TOP + 0.04, z); m.material.transparent = true; m.material.opacity = 1; st.add(m); return m; };
    const kiri = [], kanan = [];
    for (let i = 0; i < 6; i++) { kiri.push(mk(-0.45 + (i % 2) * 0.18, -0.9 + Math.floor(i / 2) * 0.24, '#e8f0ff')); kanan.push(mk(0.1 + (i % 2) * 0.18, -0.9 + Math.floor(i / 2) * 0.24, '#ffe9a8')); }
    const stab = T.box(0.16, 0.025, 0.025, '#d64a33', 0.0, TOP + 0.05, -0.38); st.add(stab);
    return { stage: st, kiri, kanan };
  },
  draw(s, t, info, T) {
    s.kiri.forEach((m, i) => { m.material.opacity = 1 - 0.92 * ease.out(prog(t, 0.6 + i * 0.12, 4.2 + i * 0.1)); });
    s.kanan.forEach((m, i) => { const base = 1 - 0.3 * ease.out(prog(t, 1 + i * 0.1, 6)); const pulse = [1.8, 3.6, 5.4].some((p) => Math.abs(t - p) < 0.25) ? 0.3 : 0; m.material.opacity = clamp(base + pulse); });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.18, 0.18, k), r = lerp(2.5, 2.2, k), tgt = [0, TOP + 0.0, -0.72];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, TOP + 0.8 - 0.12 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) {
    const ui = S().ui, a = ease.out(prog(t, 0.2, 0.6));
    text(g, 'SEKALIGUS', E.W * 0.27, V(300, 760), { size: 54, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: a, glow: 10, glowColor: 'rgba(0,0,0,.6)' });
    text(g, 'BERJEDA', E.W * 0.74, V(300, 760), { size: 54, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: a });
    text(g, '317 EKSPERIMEN', E.W / 2, V(420, 840), { size: 34, color: ui.cream, font: FONTS.ui, weight: 800, spacing: 3, alpha: a * 0.85 });
  },
});
