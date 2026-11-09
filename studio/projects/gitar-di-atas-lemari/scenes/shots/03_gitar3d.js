// 03_gitar3d.js — the 3D shot: Dimas on the bed edge, the guitar on his lap, camera orbits. "Senarnya fals. Jarinya kaku. Cuma 5 menit."
import { E, V, registerShot, mood, ease, prog, wordTime } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { DIMAS } from '../cast.js';

const rel = (w, info, fb) => (wordTime(w, info.shot.start - 0.1) ?? info.shot.start + fb) - info.shot.start;
const SIT = { ...POSES.sit, eF: [34, -112], hF: [50, -94], eB: [20, -126], hB: [46, -150] };

registerShot('s14', {
  kind: '3d',
  init(T) {
    const M = mood('dusk');
    const st = T.stage({ mood: 'dusk', fov: V(34, 50), fog: [6, 22], keyPos: [3, 5, 3], keyIntensity: 2.4, ambient: 1.1 });
    st.add(T.ground(30, 30, M.floor, T.planks(M.floor, 16, [6, 6])));
    const wall = T.plane(14, 6, M.wall); wall.position.set(-1.6, 3, 0); wall.rotation.y = Math.PI / 2; st.add(wall);
    const wall2 = T.plane(14, 6, M.wall); wall2.position.set(4, 3, -2.4); st.add(wall2);
    const win = T.windowPane(1.4, 1.2, { glowColor: '#ffe7b0', cols: 2, rows: 2, power: 0.9 }); win.position.set(-1.58, 1.7, 0.9); win.rotation.y = Math.PI / 2; st.add(win);
    // bed
    st.add(T.box(1.0, 0.42, 2.0, M.wall, -0.45, 0.21, 0.2), T.box(0.95, 0.12, 1.9, '#d9d4e8', -0.45, 0.48, 0.2));
    // wardrobe in the back corner (now empty on top)
    st.add(T.box(0.9, 2.0, 0.6, '#3a2e3e', 1.6, 1.0, -2.0));
    // Dimas
    const dimas = T.figure3D(DIMAS, { rim: M.rim, pose: SIT }); dimas.position.set(-0.2, 0.0, 0.2); st.add(dimas);
    // the guitar: lower + upper bout, sound hole, neck, headstock (face normal = +x)
    const gtr = new (dimas.constructor)();
    const wood = T.mat('#b8743f', { roughness: 0.55 }), dark = T.mat('#2a1810'), neckM = T.mat('#5a3420');
    const lo = T.cyl(0.2, 0.2, 0.1, wood, 0, 0, 0, 32); lo.rotation.z = Math.PI / 2;
    const up = T.cyl(0.155, 0.155, 0.1, wood, 0, 0.24, 0, 32); up.rotation.z = Math.PI / 2;
    const hole = T.cyl(0.055, 0.055, 0.012, dark, 0.052, 0.14, 0, 24); hole.rotation.z = Math.PI / 2;
    gtr.add(lo, up, hole, T.box(0.03, 0.5, 0.06, neckM, 0.02, 0.62, 0), T.box(0.035, 0.16, 0.08, dark, 0.02, 0.94, 0));
    gtr.rotation.x = -1.2; gtr.position.set(0.12, 0.68, 0.3); st.add(gtr);
    return { stage: st, dimas, gtr };
  },
  draw(s, t, info, T) {
    s.gtr.position.y = 0.68 + 0.004 * Math.sin(t * 9);                 // tiny strum shake
    T.orbit(s.stage.camera, t, { target: [0.1, 0.75, 0.15], radius: V(2.8, 3.6), height: [1.2, 1.7], from: 1.05, to: 1.85, dur: info.dur });
  },
  overlay(g, t, info) {
    const t5 = rel('5', info, 2.6);
    UI.badge(g, { str: '5 MENIT', x: E.W - V(90, 150), y: V(110, 280), a: ease.out(prog(t, t5 - 0.1, t5 + 0.3)) });
  },
});
