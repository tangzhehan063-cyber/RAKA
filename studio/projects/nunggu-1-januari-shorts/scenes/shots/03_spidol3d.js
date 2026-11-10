// 03_spidol3d.js — "Ambil spidol. Lingkari hari ini." The only 3D shot: the hero lifts the red marker
// toward the wall calendar under a warm desk lamp; the camera orbits.
import { E, V, registerShot, ease, prog } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { KAMU } from '../cast.js';

const REACH = { ...POSES.stand, eF: [24, -160], hF: [44, -190] };

registerShot('s15', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(44, 52), fog: [8, 30], keyPos: [3, 3.5, 3], keyIntensity: 2.2, ambient: 1.1, keyColor: '#ffd59a' });
    st.add(T.ground(30, 30, '#3a3440', T.planks('#3a3440', 16, [10, 10])));
    st.add(T.box(10, 4, 0.2, '#2f3a44', 0, 2, -1.2));
    // wall calendar: cream page, red header, big date block
    st.add(T.box(0.62, 0.78, 0.04, '#ece5d8', 0.35, 1.75, -1.08));
    st.add(T.box(0.62, 0.14, 0.05, '#c4473a', 0.35, 2.08, -1.07));
    st.add(T.box(0.22, 0.22, 0.05, '#1a1622', 0.35, 1.7, -1.07));
    const ring = new T.THREE.Mesh(new T.THREE.TorusGeometry(0.2, 0.018, 8, 40), T.basic('#d64a33'));
    ring.position.set(0.35, 1.7, -1.04); ring.scale.set(0.001, 0.001, 1); st.add(ring);
    // desk + lamp glow
    st.add(T.box(1.2, 0.06, 0.6, '#5a4638', -1.3, 0.75, -0.85));
    st.add(T.sphere(0.12, T.basic('#ffe2a8'), -1.6, 1.15, -0.85));
    const hero = T.figure3D(KAMU, { rim: '#ffd59a', pose: POSES.stand }); hero.position.set(0.0, 0, -0.55); hero.rotation.y = 0.5; st.add(hero);
    const pen = new T.THREE.Group(); st.add(pen);
    pen.add(T.cyl(0.022, 0.022, 0.18, '#d64a33', 0, 0, 0));
    pen.add(T.cyl(0.024, 0.024, 0.05, '#7a1f14', 0, 0.06, 0));
    return { stage: st, hero, pen, ring };
  },
  draw(s, t, info, T) {
    const tl = 1.0;   // "Lingkari"
    const lift = ease.inOut(prog(t, 0.1, 0.9));
    const pose = { ...POSES.stand };
    for (const k of ['eF', 'hF']) pose[k] = [POSES.stand[k][0] + (REACH[k][0] - POSES.stand[k][0]) * lift, POSES.stand[k][1] + (REACH[k][1] - POSES.stand[k][1]) * lift];
    s.hero.setPose(pose);
    const c = ease.inOut(prog(t, tl, tl + 0.9)), a = c * Math.PI * 2;
    if (c > 0) s.pen.position.set(0.35 + 0.2 * Math.cos(a), 1.7 + 0.2 * Math.sin(a), -0.98);
    else s.pen.position.set(0.18 + 0.12 * lift, 0.75 + 0.9 * lift, -0.45);
    s.pen.rotation.z = -0.6;
    s.ring.scale.set(Math.max(0.001, c), Math.max(0.001, c), 1); s.ring.rotation.z = -Math.PI / 2;
    T.orbit(s.stage.camera, t, { target: [0.2, 1.25, -0.8], radius: V(5.2, 5.6), height: [1.9, 1.6], from: -0.45, to: 0.25, dur: info.dur });
  },
  overlay(g, t, info) {
    UI.badge(g, { str: 'HARI INI', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, 1.0, 1.3)) });
  },
});
