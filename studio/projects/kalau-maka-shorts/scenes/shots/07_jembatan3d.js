// 07_jembatan3d.js — s24 (shot 3D): KALAU di satu tebing, MAKA di seberang; papan jembatan terpasang, Bayu menyeberang.
import { E, V, S, registerShot, ease, prog, clamp, lerp, alpha, text, FONTS } from '/engine/core.js';
import { walkPose } from '/engine/rig2d.js';
import { BAYU } from '../cast.js';
import { rel } from '../_util.js';
const N = 6;
registerShot('s24', {
  kind: '3d',
  init(T) {
    const st = T.stage({ mood: 'night', fov: V(34, 42), fog: [14, 40], keyPos: [-3, 6, 5], keyIntensity: 2.2, ambient: 1.6, shadowSize: 8 });
    st.add(T.box(2.6, 1.4, 3.0, '#3a3f58', -2.5, -0.7, 0)); st.add(T.box(2.6, 1.4, 3.0, '#3a3f58', 2.5, -0.7, 0));
    st.add(T.box(2.0, 0.04, 2.0, '#ffd45a', -2.5, 0.03, 0)); st.add(T.box(2.0, 0.04, 2.0, '#8fd0ff', 2.5, 0.03, 0));
    const planks = [];
    for (let i = 0; i < N; i++) { const p = T.box(2.4 / N - 0.06, 0.1, 1.2, '#c8924f', -1.2 + (i + 0.5) * (2.4 / N), -0.05, 0); p.visible = false; st.add(p); planks.push(p); }
    const fig = T.figure3D(BAYU, { s: 1.15, rim: '#ffd45a' }); fig.position.set(-2.2, 0, 0.2); st.add(fig);
    return { stage: st, planks, fig, T };
  },
  draw(s, t, info) {
    const a0 = rel('kalau', info, 1.8);
    s.planks.forEach((p, i) => { const k = ease.outBack(prog(t, a0 + 0.15 * i, a0 + 0.15 * i + 0.35)); p.visible = k > 0.02; p.scale.setScalar(Math.max(0.01, k)); p.position.y = -0.05 + (1 - Math.min(1, k)) * 0.8; });
    const walk = prog(t, a0 + 1.6, info.dur - 0.1), x = lerp(-2.2, 2.2, ease.inOut(walk));
    s.fig.position.x = x; s.fig.setPose(walk > 0 && walk < 1 ? walkPose(t * 9, { stride: 22 }) : (walk >= 1 ? 'stand' : 'stand'));
    const kk = ease.inOut(clamp(t / info.dur)), ang = lerp(-0.07, 0.07, kk), r = 12.8;
    s.stage.camera.position.set(Math.sin(ang) * r, 2.8, Math.cos(ang) * r); s.stage.camera.lookAt(0, 0.9, 0);
  },
  overlay(g, t, info) {
    const ui = S().ui, at = rel('kalau', info, 1.8), bt = rel('maka', info, 3.3);
    const a = ease.out(prog(t, at - 0.1, at + 0.3)), b = ease.out(prog(t, bt - 0.1, bt + 0.3));
    text(g, 'KALAU', E.W * 0.27, V(260, 330), { size: 110, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: a, glow: 22, glowColor: alpha(ui.gold, 0.5) });
    text(g, 'MAKA', E.W * 0.73, V(260, 330), { size: 110, color: '#8fd0ff', font: FONTS.ui, weight: 900, spacing: 4, alpha: b, glow: 22, glowColor: alpha('#8fd0ff', 0.5) });
    text(g, 'pemicu', E.W * 0.27, V(350, 430), { size: 44, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 3, alpha: a });
    text(g, 'aksi', E.W * 0.73, V(350, 430), { size: 44, color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 3, alpha: b });
  },
});
