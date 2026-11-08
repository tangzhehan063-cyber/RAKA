// Procedural glossy 3D brain (no external model): two displaced hemispheres + striped cerebellum + brainstem.
import {useMemo} from 'react';
import * as THREE from 'three';
import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise.js';

const perlin = new ImprovedNoise();
const n3 = (x: number, y: number, z: number) => perlin.noise(x, y, z);

function hemisphere(side: 1 | -1) {
  const g = new THREE.SphereGeometry(1, 320, 220);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // base lateral silhouette: long front-back (x), rounded top, flatter bottom, temporal bulge
    let x = v.x * 1.25, y = v.y * 0.86, z = v.z * 0.56;
    if (y < 0) y *= 0.78;
    const temporal = Math.exp(-((v.x - 0.25) ** 2 / 0.12 + (v.y + 0.55) ** 2 / 0.05)) * 0.18;
    y -= temporal; z += Math.sign(v.z) * temporal * 0.6;
    if (z * side < -0.02) z = side * -0.02 + (z + side * 0.02) * 0.25;   // flatten medial wall
    // gyri: narrow grooves along zero-crossings of warped noise (long sausage folds), plus Sylvian + central sulcus
    const f = 3.6;
    const wx = n3(x * 1.1, y * 1.1, z * 1.1 + 11) * 0.35, wy = n3(x * 1.1 + 7, y * 1.1, z * 1.1) * 0.35;
    const n1 = n3(x * f + wx, y * f * 1.15 + wy, z * f + side * 3);
    const n2 = n3(x * f * 2.2 + 5, y * f * 2.2, z * f * 2.2 + wx);
    const groove = Math.exp(-((n1 / 0.09) ** 2)), groove2 = Math.exp(-((n2 / 0.05) ** 2));
    const sylv = Math.exp(-(((y - (-0.18 + 0.32 * (x - 0.1))) / 0.045) ** 2)) * (x > -0.45 && x < 0.95 ? 1 : 0);
    const central = Math.exp(-(((x - (0.05 - 0.35 * y)) / 0.04) ** 2)) * (y > -0.1 ? 1 : 0);
    const plump = Math.sqrt(Math.min(1, Math.abs(n1) / 0.25));
    const d = -0.06 * groove - 0.006 * groove2 - 0.1 * sylv - 0.05 * central + 0.02 * plump;
    const len = Math.hypot(x, y, z) || 1;
    x += (x / len) * d; y += (y / len) * d; z += (z / len) * d;
    p.setXYZ(i, x, y, z + side * 0.3);
  }
  g.computeVertexNormals();
  return g;
}

function cerebellum() {
  const g = new THREE.SphereGeometry(1, 200, 140);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const s = 1 + 0.018 * Math.sin(v.y * 95 + v.x * 6);   // fine folia stripes
    p.setXYZ(i, v.x * 0.52 * s, v.y * 0.3 * s, v.z * 0.62 * s);
  }
  g.computeVertexNormals();
  return g;
}

export const Brain: React.FC<{color?: string}> = ({color = '#f27a63'}) => {
  const geo = useMemo(() => ({L: hemisphere(1), R: hemisphere(-1), C: cerebellum()}), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.32, sheen: 0.7, sheenColor: new THREE.Color('#ffd6cc'), sheenRoughness: 0.6,
  }), [color]);
  const matC = useMemo(() => { const m = mat.clone(); m.color = new THREE.Color(color).lerp(new THREE.Color('#ffd3c8'), 0.25); return m; }, [mat, color]);
  return (
    <group>
      <mesh geometry={geo.L} material={mat} />
      <mesh geometry={geo.R} material={mat} />
      <mesh geometry={geo.C} material={matC} position={[-0.82, -0.62, 0]} rotation={[0, 0, 0.18]} />
      <mesh material={mat} position={[-0.4, -0.86, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.14, 0.11, 0.42, 40]} />
      </mesh>
    </group>
  );
};
