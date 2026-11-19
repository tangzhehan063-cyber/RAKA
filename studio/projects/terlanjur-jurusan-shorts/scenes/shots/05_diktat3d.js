// 05_diktat3d.js — s11 (shot 3D): menara diktat setebal bata; punggung buku menghadap kamera, kamera mengorbit pelan.
import { E, V, registerShot, ease, prog, clamp, lerp, text, alpha, FONTS } from '/engine/core.js';
const COL = ['#7a4a3a', '#3a5f7a', '#8a7a3a', '#5a3a6a', '#3f6a55', '#8a4a5a'];
const fr = (i, k) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
registerShot('s11', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'day', fov: V(36, 44), fog: [8, 24], keyPos: [-2.5, 3, 2.2], keyIntensity: 2.2, ambient: 3.0, shadowSize: 4 });
    st.add(T.ground(10, 10, '#e6dcc8', T.planks('#e6dcc8', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#f0e8d6', 0, 2, -1.4));
    const books = []; let y = 0;
    for (let i = 0; i < 16; i++) {
      const w = 0.62 + fr(i, 1) * 0.3, h = 0.07 + fr(i, 2) * 0.05, d = 0.42 + fr(i, 5) * 0.08, col = COL[(i * 5 + 1) % COL.length], grp = new T.THREE.Group();
      grp.add(T.box(w, h, d, col, 0, 0, 0));
      grp.add(T.box(w * 0.04, h * 0.82, d * 0.96, '#f1e8d2', w / 2 + 0.002, 0, 0));               // sisi halaman
      grp.add(T.box(w * 0.4, h * 0.6, 0.004, '#f6edd4', -w * 0.05, 0, d / 2 + 0.002));            // label judul di punggung
      grp.add(T.box(0.012, h * 0.9, 0.006, '#e8c872', -w / 2 + 0.05, 0, d / 2 + 0.003));          // pita emas
      y += h / 2; grp.position.set((fr(i, 3) - 0.5) * 0.08, y, -0.55); grp.rotation.y = (fr(i, 4) - 0.5) * 0.18; y += h / 2;
      st.add(grp); books.push(grp);
    }
    return { stage: st, books };
  },
  draw(s, t, info, T) {
    s.books.forEach((b, i) => { const k = ease.outBack(prog(t, 0.15 + i * 0.1, 0.4 + i * 0.1)); b.visible = k > 0.02; b.scale.setScalar(Math.max(0.01, k)); });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.45, 0.35, k), r = lerp(4.4, 3.7, k), tgt = [0, 0.7, -0.55];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, 1.0 + 0.1 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.2, 0.6)); text(g, 'DIKTAT', E.W / 2, V(230, 280), { size: 120, color: "#8a4f0c", font: FONTS.ui, weight: 900, spacing: 6, alpha: a }); },
});
