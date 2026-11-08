import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';

// Contoh caption (nanti bisa diganti hasil transkripsi audio / file .json)
const captions: Caption[] = [
  {text: 'Halo,', startMs: 0, endMs: 600, timestampMs: 300, confidence: 1},
  {text: ' ini', startMs: 600, endMs: 1100, timestampMs: 850, confidence: 1},
  {text: ' video', startMs: 1100, endMs: 1700, timestampMs: 1400, confidence: 1},
  {text: ' 3D', startMs: 1700, endMs: 2500, timestampMs: 2100, confidence: 1},
  {text: ' pertamamu!', startMs: 2500, endMs: 5000, timestampMs: 3700, confidence: 1},
];
const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 1200});

const Box: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.04;
  const scale = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <mesh rotation={[rot, rot * 1.3, 0]} scale={scale}>
      <torusKnotGeometry args={[1, 0.35, 200, 32]} />
      <meshStandardMaterial color="#ff6b35" metalness={0.4} roughness={0.25} />
    </mesh>
  );
};

export const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(#1b2a4a, #05070d)'}}>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 5], fov: 50}}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <pointLight position={[-4, -2, 2]} color="#4cc9f0" intensity={30} />
        <Box />
      </ThreeCanvas>
      {page && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120}}>
          <div style={{fontFamily: 'sans-serif', fontSize: 80, fontWeight: 900, color: 'white', textShadow: '0 6px 20px #000'}}>
            {page.tokens.map((t) => (
              <span key={t.fromMs} style={{color: ms >= t.fromMs && ms < t.toMs ? '#ffd166' : 'white'}}>
                {t.text}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
