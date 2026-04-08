import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// SVG leaf paths for foliage decoration
const LeafCluster = ({ side, top, scale = 1, opacity = 0.07, rotate = 0 }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      [side]: "-20px",
      top,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      opacity,
    }}
  >
    <svg width="180" height="320" viewBox="0 0 180 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main fern frond */}
      <path d="M90 310 Q85 250 70 200 Q50 160 30 140 Q50 150 70 170 Q80 140 60 100 Q80 120 90 150 Q95 110 85 60 Q95 90 100 130 Q110 90 130 70 Q115 100 105 140 Q125 120 150 110 Q130 130 110 160 Q130 180 160 190 Q130 185 105 180 Q100 220 90 310Z"
        fill="currentColor" className="text-emerald-400" />
      {/* Secondary smaller frond */}
      <path d="M70 300 Q65 260 50 230 Q35 210 20 200 Q40 205 55 220 Q55 190 40 160 Q55 175 65 200 Q60 170 50 140 Q65 160 70 190 Q80 160 95 145 Q80 170 75 200 Q85 230 70 300Z"
        fill="currentColor" className="text-emerald-500" opacity="0.6" />
      {/* Small accent leaf */}
      <path d="M115 290 Q120 250 140 220 Q150 200 160 195 Q148 210 135 230 Q140 210 155 185 Q140 200 130 225 Q125 250 115 290Z"
        fill="currentColor" className="text-emerald-300" opacity="0.4" />
    </svg>
  </div>
);

// Reed/grass accent
const ReedCluster = ({ side, top, opacity = 0.05 }) => (
  <div
    className="absolute pointer-events-none"
    style={{ [side]: "10px", top, opacity }}
  >
    <svg width="80" height="200" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 200 Q28 150 25 100 Q22 60 30 20" stroke="currentColor" className="text-emerald-400" strokeWidth="2" fill="none" />
      <path d="M40 200 Q42 140 40 80 Q38 40 45 10" stroke="currentColor" className="text-emerald-500" strokeWidth="2.5" fill="none" />
      <path d="M50 200 Q48 160 50 120 Q52 80 48 40" stroke="currentColor" className="text-emerald-300" strokeWidth="1.5" fill="none" />
      {/* Cattail tops */}
      <ellipse cx="40" cy="12" rx="4" ry="12" fill="currentColor" className="text-emerald-600" opacity="0.5" />
      <ellipse cx="30" cy="22" rx="3" ry="8" fill="currentColor" className="text-emerald-500" opacity="0.4" />
    </svg>
  </div>
);

export default function RiverBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax for foliage layers
  const foliageLeftY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const foliageRightY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const riverShimmer = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* ===== RIVER — center water flow ===== */}
      <div className="absolute inset-0 flex justify-center">
        {/* Main river channel */}
        <div className="relative w-[200px] sm:w-[280px] h-full">
          {/* Water base gradient */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(60,130,200,0.6) 10%, rgba(50,120,190,0.8) 30%, rgba(40,110,180,0.7) 50%, rgba(50,120,190,0.8) 70%, rgba(60,130,200,0.6) 90%, transparent 100%)",
            }}
          />
          {/* Animated water shimmer */}
          <div className="absolute inset-0 river-shimmer opacity-[0.03]" />
          {/* Water ripple lines */}
          <div className="absolute inset-0 river-ripples opacity-[0.025]" />
        </div>
      </div>

      {/* River edge glow — left */}
      <div
        className="absolute top-0 bottom-0 opacity-[0.025]"
        style={{
          left: "calc(50% - 180px)",
          width: "80px",
          background: "linear-gradient(90deg, transparent, rgba(80,150,220,0.5), transparent)",
        }}
      />
      {/* River edge glow — right */}
      <div
        className="absolute top-0 bottom-0 opacity-[0.025]"
        style={{
          right: "calc(50% - 180px)",
          width: "80px",
          background: "linear-gradient(90deg, transparent, rgba(80,150,220,0.5), transparent)",
        }}
      />

      {/* ===== FOLIAGE — left side ===== */}
      <motion.div className="absolute left-0 top-0 bottom-0 w-48" style={{ y: foliageLeftY }}>
        <LeafCluster side="left" top="15%" scale={1} opacity={0.06} rotate={0} />
        <ReedCluster side="left" top="35%" opacity={0.04} />
        <LeafCluster side="left" top="52%" scale={0.8} opacity={0.05} rotate={10} />
        <ReedCluster side="left" top="72%" opacity={0.035} />
        <LeafCluster side="left" top="88%" scale={0.7} opacity={0.04} rotate={-5} />
      </motion.div>

      {/* ===== FOLIAGE — right side ===== */}
      <motion.div className="absolute right-0 top-0 bottom-0 w-48" style={{ y: foliageRightY }}>
        <LeafCluster side="right" top="8%" scale={0.9} opacity={0.05} rotate={180} />
        <ReedCluster side="right" top="28%" opacity={0.04} />
        <LeafCluster side="right" top="48%" scale={1.1} opacity={0.06} rotate={170} />
        <ReedCluster side="right" top="65%" opacity={0.035} />
        <LeafCluster side="right" top="82%" scale={0.75} opacity={0.045} rotate={185} />
      </motion.div>

      {/* Subtle water droplet particles scattered */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full water-droplet"
          style={{
            width: Math.random() * 3 + 2,
            height: Math.random() * 3 + 2,
            left: `${40 + Math.random() * 20}%`,
            top: `${Math.random() * 100}%`,
            background: "rgba(100, 170, 230, 0.15)",
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 4}s`,
          }}
        />
      ))}
    </div>
  );
}
