// 03_timbangan3d.js — s12 (shot 3D): timbangan: sembilan bola kecil vs satu balok merah-oranye; balok menurunkan sisi timbangan. Kamera mengorbit pelan.
import { E, V, S, registerShot, ease, prog, clamp, lerp, text, alpha, FONTS } from '/engine/core.js';
import { KRITIK, PUJI } from '../cast.js';

const L = 0.55, H = 1.0;
registerShot('s12', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(36, 46), fog: [8, 24], keyPos: [-2.5, 3.2, 2.5], keyIntensity: 2.6, ambient: 1.5, shadowSize: 4, bloom: 0.25 });
    const M = st.M || {};
    st.add(T.ground(10, 10, M.floor || '#3a4060', T.tiles(M.floor || '#3a4060', 10, [5, 5])));
    st.add(T.box(0.5, 0.06, 0.3, '#2c3150', 0, 0.03, 0)); st.add(T.cyl(0.04, 0.05, H, '#8892b8', 0, H / 2, 0, 12));   // alas + tiang
    const beam = new T.THREE.Group(); beam.position.set(0, H, 0); st.add(beam); beam.add(T.box(2 * L + 0.1, 0.035, 0.05, '#aab4d8', 0, 0, 0));
    const mkPan = (col) => { const p = new T.THREE.Group(); p.add(T.cyl(0.26, 0.26, 0.02, col, 0, 0, 0, 24)); p.add(T.cyl(0.004, 0.004, 0.42, '#8892b8', 0, 0.21, 0, 6)); st.add(p); return p; };
    const panL = mkPan('#5a6490'), panR = mkPan('#5a6490');
    const kritik = T.box(0.22, 0.22, 0.22, KRITIK, 0, 0.12, 0); panL.add(kritik);
    const puji = []; for (let i = 0; i < 9; i++) { const b = T.sphere(0.055, PUJI, ((i % 3) - 1) * 0.11, 0.07 + Math.floor(i / 3) * 0.09, (Math.floor(i / 3) - 1) * 0.1); panR.add(b); puji.push(b); }
    return { stage: st, beam, panL, panR };
  },
  draw(s, t, info, T) {
    const th = ease.inOut(prog(t, 0.5, 2.6)) * 0.34;   // sisi kiri (kritik) turun
    s.beam.rotation.z = th;
    const cx = Math.cos(th) * L, sy = Math.sin(th) * L;
    s.panL.position.set(-cx, H - 0.43 + sy * -1 * -1 - sy * 2 + sy, 0); s.panR.position.set(cx, H - 0.43 + sy * -1 - 0, 0);
    s.panL.position.y = H - sy - 0.43; s.panR.position.y = H + sy - 0.43;
    const k = ease.inOut(clamp(t / info.dur)), a = lerp(-0.35, 0.3, k), r = lerp(3.6, 3.0, k), tgt = [0, 0.9, 0];
    s.stage.camera.position.set(Math.sin(a) * r, 1.0 + 0.1 * k, Math.cos(a) * r); s.stage.camera.lookAt(...tgt);
  },
  overlay(g, t, info) {
    const ui = S().ui, a = ease.out(prog(t, 0.2, 0.6));
    text(g, '1 KRITIK', E.W * 0.26, V(300, 420), { size: 54, color: '#ff8a70', font: FONTS.ui, weight: 900, spacing: 3, alpha: a });
    text(g, '9 PUJIAN', E.W * 0.76, V(300, 420), { size: 54, color: '#7fe0d2', font: FONTS.ui, weight: 900, spacing: 3, alpha: a });
  },
});
