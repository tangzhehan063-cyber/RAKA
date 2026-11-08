// "Pengetahuan" style: clean editorial 3D. Off-white paper, dot-grid, soft grey sweep, ghost serif words, one glossy hero object.
import '@fontsource/inter/400.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import '@fontsource/playfair-display/400-italic.css'; import '@fontsource/playfair-display/700-italic.css';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useEffect} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {Brain} from './Brain';

export const PALETTE = {paper: '#f3f2ef', paper2: '#e4e3df', ink: '#1c1c1e', sub: '#8a8a8e', hero: '#ef7663', ghost: 'rgba(28,28,30,0.055)'};

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useEffect(() => { const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; return () => pm.dispose(); }, [gl, scene]);
  return null;
};

const Paper: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: `radial-gradient(120% 80% at 70% 30%, #fbfaf8 0%, ${PALETTE.paper} 45%, ${PALETTE.paper2} 100%)`}}>
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <defs>
        <pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.2" fill="#9a9a9e" /></pattern>
        <pattern id="lines" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M0 2 H44" stroke="#b5b5b8" strokeWidth="1" strokeDasharray="3 5" /></pattern>
        <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset="0.75" stopColor="#fff" stopOpacity="0.6" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <mask id="m"><rect x="0" y="0" width="720" height="1920" fill="url(#fade)" /></mask>
        <filter id="soft"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <path d={`M ${-200 + t * 30} 120 C 500 260, 820 760, 760 1260 S 980 1900, 1240 2100`} fill="none" stroke="rgba(20,20,24,0.06)" strokeWidth="230" filter="url(#soft)" />
      <path d={`M 1200 -100 C 900 300, 1000 700, 1300 900`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="180" filter="url(#soft)" />
      <g mask="url(#m)" opacity="0.55"><rect x="0" y="300" width="720" height="1360" fill="url(#lines)" /><rect x="0" y="300" width="720" height="1360" fill="url(#dots)" /></g>
    </svg>
  </AbsoluteFill>
);

export const Ghost: React.FC<{lines: string[]; y?: number; o?: number}> = ({lines, y = 1080, o = 1}) => (
  <div style={{position: 'absolute', left: 300, top: y, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 400, fontSize: 132, lineHeight: 1.05, color: PALETTE.ghost, opacity: o, whiteSpace: 'nowrap'}}>
    {lines.map((l) => <div key={l}>· {l}</div>)}
  </div>
);

export const Callout: React.FC<{from: [number, number]; to: [number, number]; label: string; sub?: string; p: number}> = ({from, to, label, sub, p}) => {
  const [x1, y1] = from, [x2, y2] = to, ex = x1 + (x2 - x1) * Math.min(1, p * 1.4), ey = y1 + (y2 - y1) * Math.min(1, p * 1.4);
  const a = interpolate(p, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <circle cx={x1} cy={y1} r={9 * Math.min(1, p * 3)} fill={PALETTE.ink} /><circle cx={x1} cy={y1} r={22 * Math.min(1, p * 3)} fill="none" stroke={PALETTE.ink} strokeWidth="2" opacity="0.4" />
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={PALETTE.ink} strokeWidth="2.5" /><line x1={x2} y1={y2} x2={x2 + 180 * a} y2={y2} stroke={PALETTE.ink} strokeWidth="2.5" />
      </svg>
      <div style={{position: 'absolute', left: x2 + 4, top: y2 - 58, opacity: a, fontFamily: 'Inter', color: PALETTE.ink, whiteSpace: 'nowrap'}}>
        <div style={{fontSize: 38, fontWeight: 700, letterSpacing: -0.5}}>{label}</div>
        {sub && <div style={{fontSize: 26, fontWeight: 400, color: PALETTE.sub, marginTop: 14}}>{sub}</div>}
      </div>
    </>
  );
};

export const PengetahuanTest: React.FC = () => {
  const f = useCurrentFrame(), {fps, width, height} = useVideoConfig(), t = f / fps;
  const intro = interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Paper t={t} />
      <Ghost lines={['Lambat', 'Sadar', 'Rasional']} />
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 6.2], fov: 30}} gl={{alpha: true, antialias: true}}>
        <Env />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -1, 2]} intensity={0.6} color="#ffe2da" />
        <group position={[-0.5 - (1 - intro) * 0.4, 0.52, 0]} rotation={[-0.02, -0.18 + t * 0.08, 0.02]} scale={0.66 * (0.9 + 0.1 * intro)}>
          <Brain />
        </group>
      </ThreeCanvas>
      <Callout from={[560, 560]} to={[700, 430]} label="Prefrontal" sub="pusat keputusan" p={interpolate(f, [20, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 1440, fontFamily: 'Inter', fontWeight: 900, fontSize: 84, lineHeight: 1.04, letterSpacing: -2, color: PALETTE.ink, opacity: intro}}>
        Otakmu punya <span style={{color: PALETTE.hero}}>dua sistem</span> berpikir.
      </div>
    </AbsoluteFill>
  );
};
