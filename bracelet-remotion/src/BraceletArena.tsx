import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

const LIME = "#ccff00";

/* ─── Energy connection lines (SVG, JS-driven) ─── */
const ConnectionLines: React.FC<{ progress: number }> = ({ progress }) => {
  const { width, height } = useVideoConfig();
  const cx = width * 0.42;
  const cy = height * 0.5;

  const lines = [
    { angle: 25, length: 0.31, delay: 0 },
    { angle: -18, length: 0.27, delay: 0.12 },
    { angle: 155, length: 0.35, delay: 0.06 },
    { angle: 200, length: 0.29, delay: 0.18 },
  ];

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
      width={width}
      height={height}
    >
      {lines.map((l, i) => {
        const p = Math.max(0, (progress - l.delay) / (1 - l.delay));
        const rad = (l.angle * Math.PI) / 180;
        const maxLen = width * l.length;
        const len = maxLen * p;
        const x2 = cx + Math.cos(rad) * len;
        const y2 = cy + Math.sin(rad) * len;

        const dashLen = 12;
        const gapLen = 18;

        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={LIME}
              strokeWidth={1.5}
              strokeOpacity={0.22 * p}
              strokeDasharray={`${dashLen} ${gapLen}`}
            />
            {/* bright dot at tip */}
            {p > 0.05 && (
              <circle
                cx={x2}
                cy={y2}
                r={3}
                fill={LIME}
                fillOpacity={0.7 * p}
                filter="url(#glow)"
              />
            )}
          </g>
        );
      })}
      <defs>
        <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

/* ─── Feature label chips ─── */
const FEATURES = [
  "S'INSCRIRE À UN JEU",
  "VOIR SON SCORE",
  "LANCER UN DÉFI",
  "RÉCLAMER UN PRIX",
];

const FeatureChip: React.FC<{ label: string; visible: boolean }> = ({
  label,
  visible,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: visible ? opacity : 0,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid rgba(204,255,0,0.35)`,
        borderRadius: 24,
        padding: "8px 20px",
        whiteSpace: "nowrap",
        transition: "none",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: LIME,
          boxShadow: `0 0 8px ${LIME}`,
        }}
      />
      <span
        style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#fff",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Bracelet 3D mesh (Three.js) ─── */
const BraceletMesh: React.FC<{ rotY: number }> = ({ rotY }) => {
  const texture = useLoader(THREE.TextureLoader, staticFile("bracelet-nobg.png"));
  texture.colorSpace = THREE.SRGBColorSpace;

  // Bracelet image is 900×600 → aspect 1.5
  const W = 7.0;
  const H = W / 1.5;

  return (
    <>
      {/* Key light from upper-left */}
      <directionalLight position={[-4, 5, 6]} intensity={1.4} color="#ffffff" />
      {/* Rim light — lime tint from behind */}
      <directionalLight position={[3, -2, -5]} intensity={0.9} color={LIME} />
      {/* Ambient */}
      <ambientLight intensity={0.5} />

      {/* Bracelet plane — double sided so it shows when rotated past 90° */}
      <mesh rotation={[0.12, (rotY * Math.PI) / 180, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          side={THREE.DoubleSide}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Lime glow halo (flat ring behind the bracelet) */}
      <mesh rotation={[0.12, (rotY * Math.PI) / 180, 0]} position={[0, 0, -0.05]}>
        <ringGeometry args={[H * 0.55, H * 0.72, 64]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

/* ─── Main composition ─── */
export const BraceletArena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Full 360° rotation over the entire duration
  const rotY = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Which feature label to show (every 90°)
  const featureIdx = Math.floor(((rotY % 360) / 360) * 4) % 4;

  // Connection lines fade in
  const linesProgress = interpolate(frame, [0, fps * 1.2], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Overall fade in
  const masterOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bracelet entrance: scale from 0.7 to 1
  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
    from: 0.7,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ opacity: masterOpacity }}>
      {/* 1. Energy connection lines */}
      <ConnectionLines progress={linesProgress} />

      {/* 3. Three.js bracelet */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${scaleIn})`,
          width: "100%",
          height: "100%",
          filter: `drop-shadow(0 0 28px rgba(204,255,0,0.35)) drop-shadow(0 0 60px rgba(204,255,0,0.15))`,
        }}
      >
        <ThreeCanvas width={width} height={height}>
          <BraceletMesh rotY={rotY} />
        </ThreeCanvas>
      </div>

      {/* 4. Feature chips */}
      {FEATURES.map((label, i) => (
        <FeatureChip key={i} label={label} visible={featureIdx === i} />
      ))}

      {/* 5. Corner label: "PurInstinct Games" */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 26,
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(204,255,0,0.55)",
        }}
      >
        BRACELET PURINSTINCT
      </div>
    </AbsoluteFill>
  );
};
