// 03_teras3d.js — the only quiet moment: black screen (phone off), then golden afternoon on the porch.
// The hero sits on the step, blanket worn as a scarf, phone flipped face-down at "HP mati". Camera orbits.
import { E, V, registerShot, ease, prog, clamp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { KAMU } from '../cast.js';


registerShot('s13', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'dusk', fov: V(36, 48), fog: [10, 40], keyPos: [-6, 3, 4], keyIntensity: 2.4, ambient: 1.3, keyColor: '#ffc68a' });
    st.add(T.ground(40, 40, '#5a3e34', T.planks('#5a3e34', 18, [10, 10])));
    // house wall, door, window
    st.add(T.box(12, 4, 0.2, '#6a4a52', 0, 2, -1.6));
    st.add(T.box(1.0, 2.1, 0.06, '#3a2830', 1.6, 1.05, -1.48));
    st.add(T.box(1.4, 1.0, 0.06, '#ffd59a', -1.6, 1.8, -1.48));
    st.add(T.box(1.5, 0.08, 0.1, '#3a2830', -1.6, 1.28, -1.44));
    // porch step
    st.add(T.box(4.0, 0.5, 0.9, '#7a5a4e', 0, 0.25, -1.0));
    // railing posts
    for (const x of [-2.6, -1.8, 1.8, 2.6]) st.add(T.box(0.08, 0.9, 0.08, '#3a2830', x, 0.45, 0.4));
    st.add(T.box(1.0, 0.06, 0.06, '#3a2830', -2.2, 0.9, 0.4)); st.add(T.box(1.0, 0.06, 0.06, '#3a2830', 2.2, 0.9, 0.4));
    // low sun far away
    st.add(T.sphere(1.4, T.basic('#ffe2a8'), -16, 2.2, -10));
    // the hero sitting on the step, facing the camera side
    const hero = T.figure3D(KAMU, { rim: '#ffc68a', pose: POSES.sit }); hero.position.set(0, 0.0, -0.75); hero.rotation.y = 0; st.add(hero);
    // blanket worn as a scarf (red-orange mascot item)
    const scarf = T.cyl(0.13, 0.15, 0.1, '#d64a33', 0.0, 1.08, -0.75); st.add(scarf);
    const tail = T.box(0.1, 0.32, 0.04, '#d64a33', 0.08, 0.9, -0.62); st.add(tail);
    // phone on the step: glowing face up, then flipped face down
    const phone = new T.THREE.Group(); phone.position.set(0.7, 0.51, -0.8); st.add(phone);
    phone.add(T.box(0.08, 0.012, 0.16, '#0a0f12', 0, 0, 0));
    const screen = T.box(0.07, 0.004, 0.145, T.basic('#bfe4ff'), 0, 0.008, 0); phone.add(screen);
    return { stage: st, hero, phone, screen };
  },
  draw(s, t, info, T) {
    const tm = 2.44;   // "mati"
    const f = ease.inOut(prog(t, tm - 0.15, tm + 0.25));
    s.phone.rotation.z = Math.PI * f; s.phone.position.y = 0.51 + 0.12 * Math.sin(Math.PI * f);
    s.screen.visible = f < 0.5;
    const b = 2 * Math.sin(t * 1.3);
    s.hero.setPose({ ...POSES.sit, head: [POSES.sit.head[0] - 4, POSES.sit.head[1] - 4 + b * 0.3], hF: [POSES.sit.hF[0] - 6, POSES.sit.hF[1]], hB: [POSES.sit.hB[0] - 8, POSES.sit.hB[1]] });
    T.orbit(s.stage.camera, t, { target: [0.15, 0.85, -0.75], radius: V(3.6, 4.2), height: [1.5, 1.2], from: -0.5, to: 0.35, dur: info.dur });
  },
  overlay(g, t, info) {
    if (t < 0.5) { g.fillStyle = '#000'; g.globalAlpha = 1 - ease.in(prog(t, 0.3, 0.5)); g.fillRect(0, 0, E.W, E.H); g.globalAlpha = 1; }
    const tm = 1.48;  // "menit"
    UI.badge(g, { str: '15 MENIT', x: E.W - V(90, 110), y: V(110, 300), a: ease.out(prog(t, tm - 0.1, tm + 0.2)) });
  },
});
