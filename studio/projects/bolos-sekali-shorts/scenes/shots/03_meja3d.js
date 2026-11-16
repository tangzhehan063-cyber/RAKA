// 03_meja3d.js — s08 (shot 3D): meja pantri sore hari; kotak bekal merah-oranye tertutup, berdebu; bungkus gorengan menumpuk.
import { E, V, registerShot, ease, prog, clamp, lerp, wordTime } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { BEKAL } from '../cast.js';

const TOP = 0.76;
registerShot('s08', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'golden', fov: V(36, 44), fog: [6, 20], keyPos: [-3, 3, 2], keyIntensity: 2.4, ambient: 2.4, shadowSize: 4 });
    st.add(T.ground(10, 10, '#c9bfae', T.planks('#c9bfae', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#d9cdb8', 0, 2, -1.2));
    const win = T.windowPane(1.1, 0.9, { glowColor: '#f2a27a', cols: 2, rows: 2, power: 0.9 }); win.position.set(-1.3, 1.6, -1.14); st.add(win);
    st.add(T.box(1.4, 0.05, 0.7, '#a07858', 0, TOP, -0.6));
    for (const [x, z] of [[-0.65, -0.9], [0.65, -0.9], [-0.65, -0.3], [0.65, -0.3]]) st.add(T.box(0.05, TOP, 0.05, '#7a5a40', x, TOP / 2, z));
    st.add(T.box(0.17, 0.07, 0.115, BEKAL, -0.25, TOP + 0.055, -0.6), T.box(0.18, 0.022, 0.125, '#e86a50', -0.25, TOP + 0.101, -0.6));   // kotak bekal tertutup
    const wads = [];
    for (let i = 0; i < 9; i++) { const w = T.sphere(0.04, '#efe2c4', 0.12 + ((i * 37) % 60) / 300, TOP + 0.07 + ((i * 23) % 30) / 500, -0.7 + ((i * 17) % 40) / 200); w.visible = false; st.add(w); wads.push(w); }
    st.add(T.box(0.45, 0.05, 0.45, '#8a8f9a', -0.55, 0.45, 0.05), T.box(0.45, 0.5, 0.05, '#8a8f9a', -0.55, 0.72, 0.27));   // kursi kosong
    return { stage: st, wads };
  },
  draw(s, t, info, T) {
    s.wads.forEach((m, i) => { m.visible = t > 0.2 + i * 0.25; });
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.6, 0.4, k), r = lerp(2.1, 1.6, k), tgt = [-0.15, TOP + 0.1, -0.65];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, TOP + 0.7 - 0.15 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) { UI.badge(g, { str: 'HARI 12', x: E.W - V(90, 110), y: V(110, 300) }); },
});
