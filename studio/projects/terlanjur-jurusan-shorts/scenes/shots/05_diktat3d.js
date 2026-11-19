// 05_diktat3d.js — s11 (shot 3D): tumpukan diktat setebal bata, kamera mengorbit pelan.
import { E, V, registerShot, ease, prog, clamp, lerp, text, alpha, FONTS } from '/engine/core.js';
const COL = ['#7a4a3a', '#3a5f7a', '#8a7a3a', '#5a3a6a', '#3f6a55', '#8a4a5a'];
registerShot('s11', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(36, 44), fog: [8, 24], keyPos: [-2.5, 3, 2.2], keyIntensity: 2.0, ambient: 2.2, shadowSize: 4 });
    st.add(T.ground(10, 10, '#2a3340', T.planks('#2a3340', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#1d2430', 0, 2, -1.4));
    const books = [];
    for (let i = 0; i < 22; i++) { const r = Math.floor(i / 3), c = i % 3, w = 0.5, h = 0.1, d = 0.36, x = -0.5 + c * 0.52 + (r % 2) * 0.22, y = h / 2 + r * h; const b = T.box(w, h, d, COL[(i * 5) % COL.length], x, y, -0.55); st.add(b); books.push(b); }
    return { stage: st, books };
  },
  draw(s, t, info, T) {
    s.books.forEach((b, i) => { b.visible = t > 0.2 + i * 0.1; });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.5, 0.35, k), r = lerp(2.9, 2.2, k), tgt = [0, 0.9, -0.55];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, 0.7 + 0.5 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.2, 0.6)); text(g, 'DIKTAT', E.W / 2, V(300, 360), { size: 120, color: '#ffd45a', font: FONTS.ui, weight: 900, spacing: 6, alpha: a }); },
});
