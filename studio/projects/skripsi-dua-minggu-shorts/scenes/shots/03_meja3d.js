// 03_meja3d.js — s05 (shot 3D): meja kos saat senja, laptop dengan tumpukan kertas merah-oranye yang bertambah.
// Kamera mengorbit pelan; badge HARI 28 sebagai overlay 2D.
import { E, V, registerShot, ease, prog, clamp, lerp, wordTime } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { NOTE } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const TOP = 0.76;   // tinggi permukaan meja (m)

registerShot('s05', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'golden', fov: V(36, 44), fog: [6, 20], keyPos: [-3, 3, 2], keyIntensity: 2.6, ambient: 2.2, shadowSize: 4 });
    const M = st.M;
    st.add(T.ground(10, 10, '#3a2e38', T.planks('#3a2e38', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#3b3450', 0, 2, -1.2));                                  // dinding
    const win = T.windowPane(1.1, 0.9, { glowColor: '#f2a27a', cols: 2, rows: 2, power: 0.9 }); win.position.set(-1.3, 1.6, -1.14); st.add(win);
    st.add(T.box(1.4, 0.05, 0.7, '#5a4034', 0, TOP, -0.6));                             // meja
    for (const [x, z] of [[-0.65, -0.9], [0.65, -0.9], [-0.65, -0.3], [0.65, -0.3]]) st.add(T.box(0.05, TOP, 0.05, '#3a2a22', x, TOP / 2, z));
    st.add(T.box(0.42, 0.02, 0.3, '#1b1f24', -0.05, TOP + 0.035, -0.55));               // alas laptop
    const lid = new T.THREE.Group(); lid.position.set(-0.05, TOP + 0.045, -0.7); lid.rotation.x = -0.25; st.add(lid);
    lid.add(T.box(0.42, 0.28, 0.015, '#14181c', 0, 0.14, 0));
    const scr = T.plane(0.39, 0.25, T.basic('#cfe6ff'), 0, 0.14, 0.009); lid.add(scr);
    // tumpukan kertas di layar (menghadap kamera)
    const notes = [];
    for (let i = 0; i < 6; i++) { const n = T.box(0.085, 0.085, 0.003, NOTE, -0.12 + ((i * 37) % 70) / 700, 0.16 - ((i * 23) % 50) / 900, 0.012 + i * 0.002); n.rotation.z = [-0.12, 0.08, -0.05, 0.14, -0.16, 0.04][i]; n.visible = false; lid.add(n); notes.push(n); }
    // lampu meja (mati) + buku
    st.add(T.cyl(0.07, 0.09, 0.02, '#1b2224', 0.5, TOP + 0.035, -0.75), T.cyl(0.012, 0.012, 0.35, '#1b2224', 0.5, TOP + 0.2, -0.75), T.cone(0.08, 0.1, '#1b2224', 0.45, TOP + 0.38, -0.72));
    st.add(T.box(0.22, 0.05, 0.3, '#3a6ea5', 0.42, TOP + 0.05, -0.45), T.box(0.2, 0.04, 0.28, '#e8c26a', 0.43, TOP + 0.095, -0.46));
    st.add(T.box(0.45, 0.05, 0.45, '#1d2226', -0.05, 0.45, 0.05), T.box(0.45, 0.5, 0.05, '#1d2226', -0.05, 0.72, 0.27));   // kursi kosong
    return { stage: st, notes };
  },
  draw(s, t, info, T) {
    const tg = rel('diganti', info, 1.6), n = 2 + (t > tg + 0.3 ? 1 : 0);
    s.notes.forEach((m, i) => { m.visible = i < n; });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.55, 0.35, k), r = lerp(2.1, 1.7, k);
    const tgt = [-0.05, TOP + 0.17, -0.65];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, TOP + 0.75 - 0.15 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) { UI.badge(g, { str: 'HARI 28', x: E.W - V(90, 110), y: V(110, 300) }); },
});
