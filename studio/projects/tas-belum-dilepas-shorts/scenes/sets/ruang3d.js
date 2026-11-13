// sets/ruang3d.js — ruang tamu Doni versi 3D (hibrid): dinding belakang dengan pintu (kiri) + jendela + jam,
// sofa menempel dinding kanan menghadap kiri (tokoh duduk tampak samping), jalur menyala di lantai.
// buildRoom(T, st, o) -> room { hero, apply(state), setHero(state) }
import { shade, alpha, E } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { DONI, BAG } from '../cast.js';

const U = 1 / 140;
export const SEAT = { x: 1.45, z: -0.6 };            // x = pinggul Doni saat duduk (kaki jatuh di x≈1.12, depan sofa)            // posisi Doni duduk (feet)
export const DOOR = { x: -1.9, z: -2.36 };           // tengah pintu di dinding belakang
export const HOOK = { x: -1.0, y: 1.55, z: -2.3 };
export const A = [-1.9, 0.012, -1.75], B = [1.5, 0.012, -0.6];   // jalur lantai pintu -> sofa

export function buildRoom(T, st, o = {}) {
  const TH = T.THREE, M = st.M, md = o.mood || 'golden';
  const wallC = shade(M.wall, 0.12), floorC = shade(M.floor, 0.1), dark = shade(M.wall, -0.55);
  st.add(T.ground(14, 10, floorC, T.planks(floorC, 14, [7, 5])));
  st.add(T.box(7.6, 7, 0.2, wallC, 0, 3.5, -2.5));
  for (const x of [2.55, -3.0]) { const sw = T.box(0.2, 7, 9, wallC, x, 3.5, 1.9); sw.castShadow = false; st.add(sw); }
  // hiasan dinding kanan: dua bingkai + rak
  st.add(T.box(0.04, 0.6, 0.45, shade(M.wall, -0.5), 2.44, 1.9, -1.2), T.box(0.03, 0.5, 0.35, shade(M.sky[1] || '#cfdcea', -0.1), 2.42, 1.9, -1.2));
  st.add(T.box(0.04, 0.45, 0.6, shade(M.wall, -0.5), 2.44, 1.6, 0.5), T.box(0.03, 0.35, 0.5, shade(M.practical, -0.2), 2.42, 1.6, 0.5));
  st.add(T.box(0.25, 0.04, 1.2, '#4a3028', 2.4, 1.3, -0.3));
  st.add(T.box(7.6, 0.14, 0.05, shade(wallC, -0.25), 0, 0.07, -2.38));                // lis dinding
  // pintu: kusen + cahaya lorong + daun pintu berporos di engsel
  st.add(T.box(1.2, 2.25, 0.06, dark, DOOR.x, 1.12, -2.4));
  const hall = T.plane(1.0, 2.15, T.basic(M.key), DOOR.x, 1.08, -2.39); hall.visible = false; st.add(hall);
  const pivot = new TH.Group(); pivot.position.set(DOOR.x - 0.5, 0, DOOR.z); st.add(pivot);
  const slab = T.box(1.0, 2.15, 0.07, shade(M.wall, -0.2), 0.5, 1.08, 0); pivot.add(slab);
  pivot.add(T.box(0.8, 0.9, 0.02, shade(M.wall, -0.35), 0.5, 1.6, 0.04), T.box(0.8, 0.9, 0.02, shade(M.wall, -0.35), 0.5, 0.55, 0.04), T.sphere(0.04, '#e8c26a', 0.88, 1.05, 0.07));
  // gantungan + tas gantung
  st.add(T.box(0.07, 0.07, 0.12, '#2a1a18', HOOK.x, HOOK.y + 0.05, HOOK.z - 0.04));
  const hung = new TH.Group(); hung.position.set(HOOK.x, HOOK.y, HOOK.z); st.add(hung);
  const hb = T.box(0.3, 0.46, 0.17, BAG, 0, -0.3, 0.04); hung.add(hb); hung.add(T.box(0.22, 0.14, 0.02, '#8a2a1c', 0, -0.32, 0.14)); hung.visible = false;
  // jendela
  const winTex = T.canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); M.sky.forEach((c, i) => gr.addColorStop(i / (M.sky.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  st.add(T.plane(1.3, 1.4, T.basic('#ffffff', { map: winTex }), 0.55, 1.65, -2.385));
  for (const [w, h, x, y] of [[1.42, 0.06, 0.55, 2.36], [1.42, 0.06, 0.55, 0.94], [0.06, 1.46, -0.16, 1.65], [0.06, 1.46, 1.26, 1.65], [0.04, 1.4, 0.55, 1.65], [1.3, 0.04, 0.55, 1.65]]) st.add(T.box(w, h, 0.07, dark, x, y, -2.37));
  const wl = new TH.PointLight(TH.Color ? new TH.Color(M.key) : 0xffffff, md === 'night' ? 0.4 : 1.4, 6); wl.position.set(0.55, 1.6, -1.6); st.add(wl);
  // jam dinding analog
  const cx = -0.35, cy = 2.3, cz = -2.36;
  const face = T.cyl(0.3, 0.3, 0.04, '#efe8d8', cx, cy, cz + 0.02); face.rotation.x = Math.PI / 2; st.add(face);
  const rim = T.cyl(0.33, 0.33, 0.03, shade(M.wall, -0.5), cx, cy, cz + 0.005); rim.rotation.x = Math.PI / 2; st.add(rim);
  const hH = new TH.Group(), hM = new TH.Group(); hH.position.set(cx, cy, cz + 0.06); hM.position.set(cx, cy, cz + 0.075); st.add(hH, hM);
  hH.add(T.box(0.03, 0.17, 0.01, '#1b1b1f', 0, 0.085, 0)); hM.add(T.box(0.02, 0.25, 0.01, '#1b1b1f', 0, 0.125, 0));
  st.add(T.sphere(0.02, BAG, cx, cy, cz + 0.09));
  // karpet + sofa (menghadap -x): alas lantai berdiri di depan sofa, kaki Doni di lantai depan alas sofa
  const sofaC = shade('#3f7f86', md === 'night' ? -0.35 : 0), sofaD = shade(sofaC, -0.3), sofaL = shade(sofaC, 0.22), legC = '#2a1c18';
  st.add(T.box(2.6, 0.012, 3.0, shade('#d9a441', md === 'night' ? -0.4 : -0.1), 1.1, 0.006, SEAT.z));                   // karpet kuning
  for (const dz of [-0.95, 0.95]) st.add(T.box(0.07, 0.1, 0.07, legC, 1.2, 0.05, SEAT.z + dz), T.box(0.07, 0.1, 0.07, legC, 1.65, 0.05, SEAT.z + dz));
  st.add(T.box(0.62, 0.3, 1.9, sofaD, 1.45, 0.26, SEAT.z));                                                               // dudukan (rangka)
  st.add(T.box(0.58, 0.12, 0.88, sofaL, 1.46, 0.47, SEAT.z - 0.45), T.box(0.58, 0.12, 0.88, sofaL, 1.46, 0.47, SEAT.z + 0.45)); // 2 bantal duduk
  st.add(T.box(0.2, 0.62, 1.9, sofaC, 1.86, 0.65, SEAT.z));                                                               // sandaran
  st.add(T.box(0.09, 0.36, 0.78, sofaL, 1.72, 0.7, SEAT.z - 0.45).rotateZ(0.12), T.box(0.09, 0.36, 0.78, sofaL, 1.72, 0.7, SEAT.z + 0.45).rotateZ(0.12)); // bantal sandaran
  st.add(T.box(0.78, 0.34, 0.16, sofaC, 1.5, 0.52, SEAT.z - 1.0), T.box(0.78, 0.34, 0.16, sofaC, 1.5, 0.52, SEAT.z + 1.0));  // lengan sofa
  st.add(T.box(0.8, 0.06, 0.2, sofaL, 1.5, 0.71, SEAT.z - 1.0), T.box(0.8, 0.06, 0.2, sofaL, 1.5, 0.71, SEAT.z + 1.0));
  // meja samping + lampu duduk, tanaman
  st.add(T.box(0.42, 0.5, 0.42, '#7a4a30', 1.55, 0.25, SEAT.z - 1.5), T.box(0.46, 0.04, 0.46, '#5a3220', 1.55, 0.52, SEAT.z - 1.5));
  st.add(T.cyl(0.03, 0.05, 0.34, '#2a1c18', 1.55, 0.71, SEAT.z - 1.5), T.cone(0.2, 0.26, '#f2d9a0', 1.55, 1.01, SEAT.z - 1.5, 16));
  st.add(T.cyl(0.14, 0.11, 0.26, '#a8553a', 2.3, 0.13, SEAT.z + 1.2), T.sphere(0.3, '#4f8a55', 2.3, 0.55, SEAT.z + 1.2), T.sphere(0.22, '#3d7a48', 2.4, 0.78, SEAT.z + 1.25));
  // sepatu rapi di dekat pintu
  const shoes = new TH.Group(); shoes.position.set(DOOR.x - 0.2, 0, -1.9); shoes.visible = false; st.add(shoes);
  for (const dz of [0, 0.22]) { shoes.add(T.box(0.3, 0.12, 0.11, '#23262e', 0, 0.06, dz)); shoes.add(T.box(0.3, 0.025, 0.115, '#efe8d8', 0, 0.012, dz)); }
  // jalur lantai
  const mkRail = () => { const m = T.box(1, 0.02, 0.07, T.basic(M.practical), 0, 0.012, 0); m.castShadow = false; m.visible = false; st.add(m); return m; };
  const rails = [mkRail(), mkRail()];
  const railGlow = new TH.PointLight(new TH.Color(M.practical), 0.8, 1.6); railGlow.visible = false; st.add(railGlow);
  // lampu sofa
  const lamp = new TH.PointLight(new TH.Color('#ffcf80'), 0, 5); lamp.position.set(0.8, 1.9, 0.4); st.add(lamp);
  // tokoh
  const hero = T.figure3D(DONI, { rim: '#ffd49a', pose: POSES.stand }); st.add(hero);
  const bagMesh = T.box(0.26, 0.46, 0.17, BAG, -0.22, 0.98, 0); hero.add(bagMesh);
  const phone = new TH.Group(); hero.add(phone);
  phone.add(T.box(0.012, 0.11, 0.06, '#0a0f12', 0, 0, 0)); const scr = T.box(0.004, 0.1, 0.05, T.basic('#bfe4ff'), -0.008, 0, 0); phone.add(scr);
  const phoneLight = new TH.PointLight(new TH.Color('#bfe4ff'), 0, 1.3); phone.add(phoneLight);

  const room = {
    hero, hall, pivot, hung, shoes, rails, lamp, bagMesh, phone, scr, phoneLight,
    // state: { open, min, hungBag, swing, shoes, rail (0..1), cut (0..1), lamp }
    apply(s) {
      pivot.rotation.y = -(s.open ?? 0) * 1.4; hall.visible = (s.open ?? 0) > 0.02;
      const tot = 18 * 60 + (s.min ?? 0); hH.rotation.z = -((tot % 720) / 720) * Math.PI * 2; hM.rotation.z = -((tot % 60) / 60) * Math.PI * 2;
      hung.visible = !!s.hungBag; hung.rotation.z = s.swing || 0; shoes.visible = !!s.shoes; lamp.intensity = (s.lamp || 0) * 1.6;
      const k = s.rail || 0, c = s.cut || 0, gh = c * 0.1;
      const segs = c > 0 ? [[0, Math.min(k, 0.5 - gh)], [0.5 + gh, k]] : [[0, k], [0, 0]];
      rails.forEach((m, i) => { const [f0, f1] = segs[i]; m.visible = f1 > f0 + 0.002;
        const P = (f) => [A[0] + (B[0] - A[0]) * f, A[2] + (B[2] - A[2]) * f], p0 = P(f0), p1 = P(f1), L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        m.position.set((p0[0] + p1[0]) / 2, 0.012, (p0[1] + p1[1]) / 2); m.rotation.y = -Math.atan2(p1[1] - p0[1], p1[0] - p0[0]); m.scale.x = Math.max(0.001, L); });
      railGlow.visible = k > 0; if (k > 0) railGlow.position.set(A[0] + (B[0] - A[0]) * k, 0.2, A[2] + (B[2] - A[2]) * k); railGlow.intensity = 0.9 * (1 - c * 0.8);
    },
    // state: { x, z, yaw, pose, bag, phone (0..1) }
    setHero(s) {
      hero.position.set(s.x, 0, s.z); hero.rotation.y = s.yaw ?? 0; hero.setPose(s.pose);
      bagMesh.visible = s.bag !== false; const p = s.pose; bagMesh.position.set((p.sh[0] + p.hip[0]) / 2 * U - 0.22, -(p.sh[1] + p.hip[1]) / 2 * U, 0);
      const on = s.phone ?? 0; phone.visible = on > 0; phone.position.set(p.hF[0] * U + 0.03, -p.hF[1] * U + 0.02, 0.1); phoneLight.intensity = 0.7 * on;
    },
  };
  return room;
}
