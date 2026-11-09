// 03_meja3d.js — 3D shot: Nara at the desk under the lamp, writing his fear on paper; camera orbits.
import { E, V, registerShot, ease, prog } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { NARA } from '../cast.js';

registerShot('s12', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(36, 50), fog: [8, 30], keyPos: [3, 6, 4], keyIntensity: 0.6, ambient: 0.5, keyColor: '#9fd0ff' });
    st.add(T.ground(40, 40, '#3a2a22', T.planks('#3a2a22', 16, [8, 8])));
    const wall = T.plane(30, 12, '#10261e', 0, 6, -2.2); st.add(wall);
    // desk
    st.add(T.box(2.0, 0.08, 0.9, '#2a1e18', 0, 1.0, -1.2));
    for (const [x, z] of [[-0.9, -0.8], [0.9, -0.8], [-0.9, -1.6], [0.9, -1.6]]) st.add(T.box(0.07, 1.0, 0.07, '#1c1410', x, 0.5, z));
    // paper + pen
    const pap = T.box(0.42, 0.01, 0.3, '#efe3c4', -0.15, 1.05, -1.05); st.add(pap);
    st.add(T.cyl(0.012, 0.012, 0.25, '#d64a33', 0.05, 1.07, -1.0));
    // lamp: base, arm, shade, glowing bulb + warm point light
    st.add(T.cyl(0.12, 0.14, 0.04, '#1b2224', 0.7, 1.06, -1.35));
    st.add(T.cyl(0.02, 0.02, 0.6, '#1b2224', 0.7, 1.36, -1.35));
    const shade = T.cone(0.18, 0.22, '#1b2224', 0.55, 1.68, -1.25, 16); shade.rotation.z = 0.7; st.add(shade);
    st.add(T.sphere(0.07, T.basic('#fff1c0'), 0.5, 1.6, -1.2));
    const L = new T.THREE.PointLight(0xffd45a, 6, 6, 1.6); L.position.set(0.45, 1.55, -1.1); L.castShadow = true; st.add(L);
    // chair + Nara sitting, writing
    st.add(T.box(0.5, 0.06, 0.5, '#1c1410', -0.15, 0.6, -0.2));
    const nara = T.figure3D(NARA, { rim: '#ffd45a', pose: POSES.sit }); nara.position.set(-0.15, 0.12, -0.2); nara.rotation.y = Math.PI / 2; st.add(nara);
    // fear notes on the wall
    for (const [x, y] of [[-0.5, 2.3], [0.1, 2.5]]) st.add(T.box(0.3, 0.36, 0.01, '#efe3c4', x, y, -2.18));
    return { stage: st, nara, L };
  },
  draw(s, t, info, T) {
    const w = Math.sin(t * 7) * 6;
    s.nara.setPose({ ...POSES.sit, hF: [POSES.sit.hF[0] + 14 + w, POSES.sit.hF[1] - 30], eF: [POSES.sit.eF[0] + 6, POSES.sit.eF[1] - 10], head: [POSES.sit.head[0] + 10, POSES.sit.head[1] + 8] });
    s.L.intensity = 6 + 0.4 * Math.sin(t * 13);
    T.orbit(s.stage.camera, t, { target: [0.1, 1.15, -0.8], radius: V(5.0, 6.2), height: [2.4, 2.0], from: 1.1, to: 0.3, dur: info.dur });
  },
  overlay(g, t, info) {},
});
