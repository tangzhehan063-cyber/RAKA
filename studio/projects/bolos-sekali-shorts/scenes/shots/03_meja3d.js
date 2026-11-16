// 03_meja3d.js — s08 (shot 3D): meja pantri sore hari. Kotak bekal merah-oranye tertutup berdebu, bungkus gorengan menumpuk,
// boks ayam geprek, nampan gorengan, debu melayang di cahaya jendela. Kamera mengorbit pelan.
import { E, V, registerShot, ease, prog, clamp, lerp } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { BEKAL } from '../cast.js';

const TOP = 0.76;
const rnd = (i, seed = 1) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };

registerShot('s08', {
  kind: '3d',
  init(T) {
    const TH = T.THREE, st = T.stage({ mood: 'golden', fov: V(36, 44), fog: [8, 24], keyPos: [-2.5, 3, 2.2], keyIntensity: 2.2, ambient: 3.0, shadowSize: 4 });
    st.add(T.ground(10, 10, '#e2cfb0', T.planks('#e2cfb0', 12, [5, 5])));
    st.add(T.box(8, 4, 0.1, '#f0e4cf', 0, 2, -1.2));                                         // dinding krem
    const win = T.windowPane(1.0, 0.8, { glowColor: '#fff0cc', frame: '#c9b79a', cols: 2, rows: 2, power: 2.2 }); win.position.set(0.05, 1.5, -1.14); st.add(win);
    // meja kayu terang
    st.add(T.box(1.4, 0.05, 0.7, '#dcbc92', 0, TOP, -0.6));
    st.add(T.box(1.4, 0.015, 0.7, '#e8cda6', 0, TOP + 0.03, -0.6));
    for (const [x, z] of [[-0.65, -0.9], [0.65, -0.9], [-0.65, -0.3], [0.65, -0.3]]) st.add(T.box(0.05, TOP, 0.05, '#bf9d74', x, TOP / 2, z));
    // kursi kosong
    st.add(T.box(0.45, 0.05, 0.45, '#b9b6c6', -0.7, 0.45, 0.05), T.box(0.45, 0.5, 0.05, '#b9b6c6', -0.7, 0.72, 0.27));
    for (const [x, z] of [[-0.9, -0.15], [-0.5, -0.15], [-0.9, 0.2], [-0.5, 0.2]]) st.add(T.cyl(0.015, 0.015, 0.45, '#a9a6b6', x, 0.22, z, 8));

    // kotak bekal merah-oranye (tertutup): badan, tutup, kait, lapisan debu
    const kx = -0.26, kz = -0.58, ky = TOP + 0.03;
    st.add(T.box(0.2, 0.055, 0.13, BEKAL, kx, ky + 0.0275, kz));
    st.add(T.box(0.21, 0.025, 0.14, '#e06a50', kx, ky + 0.0675, kz));
    st.add(T.box(0.05, 0.012, 0.02, '#f2a090', kx, ky + 0.085, kz + 0.065));
    const dustLid = T.box(0.205, 0.004, 0.135, '#d9d2c4', kx, ky + 0.082, kz); dustLid.material.transparent = true; dustLid.material.opacity = 0.55; st.add(dustLid);

    // nampan gorengan (cokelat) + isi: pisang, bakwan, tahu
    st.add(T.box(0.22, 0.035, 0.12, '#c79a66', 0.08, ky + 0.0175, -0.82));
    const pis = T.cyl(0.014, 0.014, 0.1, '#e3a843', 0.03, ky + 0.045, -0.82, 10); pis.rotation.z = Math.PI / 2 - 0.2; st.add(pis);
    st.add(T.sphere(0.03, T.mat('#d6923a', { flat: true }), 0.1, ky + 0.052, -0.8), T.box(0.05, 0.04, 0.05, '#dca048', 0.15, ky + 0.055, -0.84));

    // boks ayam geprek (2): styrofoam putih + nasi + ayam + sambal
    const geprek = (x, z, rot) => {
      const g = new TH.Group(); g.position.set(x, ky, z); g.rotation.y = rot;
      g.add(T.box(0.2, 0.04, 0.13, '#f4f1ea', 0, 0.02, 0));
      const rice = T.sphere(0.05, T.mat('#fffdf5'), -0.05, 0.04, 0); rice.scale.set(1, 0.7, 1); g.add(rice);
      g.add(T.box(0.08, 0.02, 0.06, '#c98a36', 0.05, 0.05, 0), T.sphere(0.016, T.mat('#c0301c'), 0.06, 0.066, 0));
      st.add(g); return g;
    };
    geprek(0.2, -0.5, 0.3); geprek(0.14, -0.76, -0.2);

    // debu melayang
    const dust = []; for (let i = 0; i < 16; i++) { const d = T.sphere(0.006, T.basic('#fff6e0'), 0, 0, 0); st.add(d); dust.push(d); }
    return { stage: st, dust };
  },
  draw(s, t, info, T) {
    s.dust.forEach((d, i) => d.position.set(-0.7 + rnd(i, 3) * 1.4 + Math.sin(t * 0.5 + i) * 0.04, TOP + 0.1 + rnd(i, 5) * 0.6 + Math.sin(t * 0.7 + i * 2) * 0.03, -0.9 + rnd(i, 7) * 0.9));
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.4, 0.12, k), r = lerp(1.85, 1.45, k), tgt = [-0.06, TOP - 0.1, -0.64];
    s.stage.camera.position.set(tgt[0] + Math.sin(a) * r, TOP + 0.5 - 0.15 * k, tgt[2] + Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) { UI.badge(g, { str: 'HARI 12', x: E.W - V(90, 110), y: V(110, 300) }); },
});
