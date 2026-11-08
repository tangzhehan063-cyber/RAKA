// 03_street.js — day 10 jog at dawn, day 66 in 3D, the fall, getting back up.
import { E, V, S, registerShot, mood, layer, ease, prog, clamp, lerp, wordTime, alpha, glow } from '/engine/core.js';
import { drawFigure, POSES, posesAt, blendPose, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { RAKA } from '../cast.js';

// s15 — "Pelan. Tanpa semangat." slow, sleepy jog under still-lit lamps
registerShot('s15', { draw(g, t, info) {
  const runX = E.W / 2 - V(260, 180) + t * V(120, 90);
  const cam = { z: 1.1, x: (runX - E.W / 2) * 0.6 };
  const { GY, M } = street(g, t, cam, { mood: 'dusk', sunY: 0.05, lamps: true });
  layer(g, cam, 1, (g) => drawFigure(g, { x: runX, y: GY + 20, s: V(1.3, 1.5), facing: 1, outfit: RAKA,
    pose: walkPose(t * Math.PI * 2 * 1.1, { run: true, stride: 30 }), expr: 'sleepy', blink: (t % 1.6) > 1.3, rim: { color: M.rim, dir: [0.6, -0.8] } }));
  FX.fog(g, GY - 160, 260, M.fog, 0.3);
  FX.dust(g, t, { count: 25, color: '#ffe9c0', a: 0.3 });
} });

// s16 — DAY 66 in 3D: golden morning, smooth effortless running, camera orbits
registerShot('s16', {
  kind: '3d',
  init(T) {
    const M = mood('golden');
    const st = T.stage({ mood: 'golden', fov: V(36, 54), fog: [12, 50], keyPos: [10, 6, -4], keyIntensity: 3, ambient: 1.2 });
    st.add(T.ground(200, 60, M.road || M.floor, T.tiles(M.floor, 40, [40, 12])));
    for (let i = -8; i <= 8; i++) {
      const b = T.building(4.5, 4 + (i % 3), 4, { color: M.wall, win: M.practical, lit: 0.25, seed: 30 + i }); b.position.set(i * 6, 0, -9); st.add(b);
      st.add(T.tree3D(i * 6 + 3, -5.5, 1, '#1c2a20'));
      if (i % 2 === 0) st.add(T.cyl(0.06, 0.08, 4, '#15121c', i * 6, 2, 3));
    }
    const raka = T.figure3D(RAKA, { rim: M.rim, pose: POSES.stand }); st.add(raka);
    return { stage: st, raka };
  },
  draw(s, t, info, T) {
    const x = -2 + t * 3.2;
    s.raka.position.set(x, 0, 0);
    s.raka.setPose(walkPose(t * Math.PI * 2 * 1.6, { run: true }));
    T.orbit(s.stage.camera, t, { target: [x, 1.0, 0], radius: V(5.5, 6.5), height: [1.4, 2.4], from: -1.2, to: 0.2, dur: info.dur });
  },
  overlay(g, t, info) {
    UI.badge(g, { str: 'HARI 66', x: E.W - V(90, 110), y: V(110, 250), a: ease.out(prog(t, 0.2, 0.6)) });
  },
});

// s17 — running ... then a stumble and fall to the knees
registerShot('s17', { draw(g, t, info) {
  const tFall = 1.0, run = t < tFall;
  const x = E.W / 2 - V(300, 220) + Math.min(t, tFall + 0.25) * V(420, 300);
  const cam = { z: 1.12, x: (x - E.W / 2) * 0.5, r: run ? 0 : 0.015 * Math.sin((t - tFall) * 4) * Math.exp(-(t - tFall) * 2) };
  const { GY, M } = street(g, t, cam, { mood: 'golden', sunY: 0.35, lamps: false });
  const pose = run ? walkPose(t * Math.PI * 2 * 1.6, { run: true })
    : posesAt(t, [[tFall, POSES.fall], [tFall + 0.35, POSES.kneel], [tFall + 0.9, POSES.crouch]]);
  layer(g, cam, 1, (g) => drawFigure(g, { x, y: GY + 20, s: V(1.3, 1.5), facing: 1, outfit: RAKA, pose, expr: run ? 'determined' : 'shocked',
    trail: run ? { count: 3, dx: -30, a: 0.15 } : null, rim: { color: M.rim, dir: [0.6, -0.8] } }));
  if (!run) FX.dust(g, (t - tFall) * 3, { count: 30, area: [x - 150, GY - 80, 300, 120], color: '#ffe0a8', a: 0.6 * clamp(1 - (t - tFall)), size: 3 });
  FX.lensStreak(g, E.W / 2 + V(200, 60), GY - V(400, 560), E.W, '#ffe6cc', 0.2);
} });

// s18 — gets back up and runs, the sun rises behind him
registerShot('s18', { draw(g, t, info) {
  const tUp = 0.9, x0 = E.W / 2 - V(40, 30);
  const x = x0 + Math.max(0, t - tUp) * V(380, 280);
  const cam = { z: 1.15 - 0.07 * ease.inOut(t / info.dur), x: (x - E.W / 2) * 0.4 };
  const { GY, M } = street(g, t, cam, { mood: 'golden', sunY: 0.35 + 0.35 * ease.inOut(t / info.dur), lamps: false, rays: 1 + ease.inOut(t / info.dur) });
  const pose = t < tUp ? posesAt(t, [[0, POSES.crouch], [0.45, POSES.ready], [0.8, POSES.stand]]) : walkPose((t - tUp) * Math.PI * 2 * 1.6, { run: true });
  layer(g, cam, 1, (g) => drawFigure(g, { x, y: GY + 20, s: V(1.3, 1.5), facing: 1, outfit: RAKA, pose, expr: 'determined', rim: { color: M.rim, dir: [0.4, -1], w: 6 } }));
  glow(g, E.W / 2 + V(200, 60), GY - V(500, 700), V(500, 700), M.key, 0.12 * ease.inOut(t / info.dur));
  FX.dust(g, t, { count: 40, color: '#ffe9c0', a: 0.45 });
} });
