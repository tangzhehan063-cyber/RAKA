// 04_selai3d.js — s09 (shot 3D): meja cicip selai di supermarket: 24 toples, lalu tinggal 6. Kamera mengorbit pelan.
import { E, V, registerShot, ease, prog, clamp, lerp, wordTime, text, alpha, FONTS } from '/engine/core.js';

const TOP = 0.8;
const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const JAM = ['#c0392b', '#d86a2a', '#7b3a8a', '#b8325a', '#e0a23a', '#4a7a3a', '#a04030', '#6a3a6a'];

registerShot('s09', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'day', fov: V(36, 44), fog: [8, 24], keyPos: [-2.5, 3, 2.2], keyIntensity: 2.2, ambient: 3.0, shadowSize: 4 });
    st.add(T.ground(10, 10, '#e6dcc8', T.planks('#e6dcc8', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#f0e8d6', 0, 2, -1.4));
    for (const x of [-1.2, 0, 1.2]) st.add(T.box(0.9, 1.6, 0.25, '#d8cdb6', x, 0.8, -1.25));   // rak latar
    st.add(T.box(1.8, 0.06, 0.9, '#e8d8b8', 0, TOP, -0.6));                                     // meja cicip
    for (const [x, z] of [[-0.8, -0.95], [0.8, -0.95], [-0.8, -0.25], [0.8, -0.25]]) st.add(T.box(0.06, TOP, 0.06, '#bfa77a', x, TOP / 2, z));
    st.add(T.box(1.82, 0.05, 0.92, '#fff4d6', 0, TOP + 0.05, -0.6));                              // taplak
    const jars = [];
    for (let i = 0; i < 24; i++) {
      const c = i % 6, r = Math.floor(i / 6), x = -0.65 + c * 0.26, z = -0.9 + r * 0.22, g = new T.THREE.Group();
      g.position.set(x, TOP + 0.08, z); g.add(T.cyl(0.05, 0.05, 0.09, JAM[i % JAM.length], 0, 0.045, 0, 14), T.cyl(0.052, 0.052, 0.022, '#fffdf4', 0, 0.1, 0, 14), T.cyl(0.054, 0.054, 0.012, '#d64a33', 0, 0.12, 0, 14));
      st.add(g); jars.push(g);
    }
    return { stage: st, jars };
  },
  draw(s, t, info, T) {
    const t6 = rel('enam', info, 6.8), keep = new Set([2, 5, 8, 11, 14, 21]);
    s.jars.forEach((j, i) => { const gone = t > t6 && !keep.has(i); j.visible = !gone; if (t > t6 && keep.has(i)) { const k = ease.out(prog(t, t6, t6 + 0.7)); j.position.x = lerp(-0.65 + (i % 6) * 0.26, -0.65 + [0, 1, 2, 3, 4, 5][[2, 5, 8, 11, 14, 21].indexOf(i)] * 0.26, k); j.position.z = lerp(-0.9 + Math.floor(i / 6) * 0.22, -0.62, k); } });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.4, 0.3, k), r = lerp(2.2, 1.7, k), tgt = [0, TOP + 0.0, -0.62];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, TOP + 0.62 - 0.2 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) {
    const t6 = rel('enam', info, 6.8), six = t > t6, a = ease.out(prog(t, 0.2, 0.6));
    text(g, six ? '6 RASA' : '24 RASA', E.W / 2, V(300, 360), { size: 120, color: '#8a4f0c', font: FONTS.ui, weight: 900, spacing: 4, alpha: a });
    text(g, 'IYENGAR & LEPPER, 2000', E.W / 2, V(420, 470), { size: 34, color: '#2b2f3a', font: FONTS.ui, weight: 800, spacing: 3, alpha: a * 0.8 });
  },
});
