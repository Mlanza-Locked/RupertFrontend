import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";

// Organic broad-leaf tropical plant
const BroadLeaf = ({ x, y, size = 1, rot = 0, hue = 140, lightness = 28 }) => (
  <g transform={`translate(${x},${y}) scale(${size}) rotate(${rot})`}>
    <defs>
      <radialGradient id={`bl-${x}-${y}`} cx="30%" cy="40%">
        <stop offset="0%" stopColor={`hsl(${hue}, 45%, ${lightness + 12}%)`} />
        <stop offset="60%" stopColor={`hsl(${hue}, 40%, ${lightness}%)`} />
        <stop offset="100%" stopColor={`hsl(${hue}, 35%, ${lightness - 6}%)`} />
      </radialGradient>
    </defs>
    {/* Main leaf blade */}
    <path
      d="M0 0 C-8 -20, -30 -55, -18 -90 C-10 -110, 0 -120, 0 -125 C0 -120, 10 -110, 18 -90 C30 -55, 8 -20, 0 0Z"
      fill={`url(#bl-${x}-${y})`}
    />
    {/* Mid-vein */}
    <path d="M0 -2 C0 -40, 0 -80, 0 -124" stroke={`hsl(${hue}, 30%, ${lightness - 4}%)`} strokeWidth="1" fill="none" opacity="0.5" />
    {/* Side veins */}
    <path d="M0 -30 C-8 -40, -14 -48, -16 -52" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.5" fill="none" opacity="0.3" />
    <path d="M0 -30 C8 -40, 14 -48, 16 -52" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.5" fill="none" opacity="0.3" />
    <path d="M0 -55 C-10 -65, -18 -72, -20 -76" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.5" fill="none" opacity="0.3" />
    <path d="M0 -55 C10 -65, 18 -72, 20 -76" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.5" fill="none" opacity="0.3" />
    <path d="M0 -80 C-6 -88, -12 -92, -14 -94" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.4" fill="none" opacity="0.25" />
    <path d="M0 -80 C6 -88, 12 -92, 14 -94" stroke={`hsl(${hue}, 25%, ${lightness}%)`} strokeWidth="0.4" fill="none" opacity="0.25" />
  </g>
);

// Fern with individual leaflets
const FernFrond = ({ x, y, size = 1, rot = 0, hue = 145 }) => {
  const leaflets = [];
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const py = -t * 140;
    const leafSize = (1 - t * 0.6) * 12;
    const angle = 55 - t * 15;
    leaflets.push(
      <g key={i} transform={`translate(0, ${py})`}>
        <path d={`M0 0 C${leafSize * 0.4} ${-leafSize * 0.3}, ${leafSize * 0.8} ${-leafSize * 0.5}, ${leafSize} ${-leafSize * 0.2}`}
          fill={`hsl(${hue}, 40%, ${26 + i * 1.5}%)`} opacity={0.8 - t * 0.2}
          transform={`rotate(${-angle})`} />
        <path d={`M0 0 C${-leafSize * 0.4} ${-leafSize * 0.3}, ${-leafSize * 0.8} ${-leafSize * 0.5}, ${-leafSize} ${-leafSize * 0.2}`}
          fill={`hsl(${hue + 5}, 38%, ${24 + i * 1.5}%)`} opacity={0.8 - t * 0.2}
          transform={`rotate(${angle})`} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y}) scale(${size}) rotate(${rot})`}>
      {/* Stem */}
      <path d="M0 0 C1 -40, -1 -90, 0 -140" stroke={`hsl(${hue}, 30%, 22%)`} strokeWidth="1.5" fill="none" />
      {leaflets}
    </g>
  );
};

// Hanging vine
const Vine = ({ x, y, length = 150, rot = 0, hue = 135 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path
      d={`M0 0 C5 ${length * 0.2}, -8 ${length * 0.5}, 3 ${length * 0.75} S-4 ${length * 0.9}, 0 ${length}`}
      stroke={`hsl(${hue}, 35%, 25%)`} strokeWidth="1.2" fill="none"
    />
    {/* Small leaves along vine */}
    {[0.15, 0.35, 0.55, 0.75, 0.9].map((t, i) => (
      <ellipse
        key={i}
        cx={Math.sin(t * 6) * 6}
        cy={t * length}
        rx={4 + Math.random() * 2}
        ry={6 + Math.random() * 3}
        fill={`hsl(${hue + i * 3}, 38%, ${24 + i * 2}%)`}
        opacity={0.6}
        transform={`rotate(${20 + i * 15}, ${Math.sin(t * 6) * 6}, ${t * length})`}
      />
    ))}
  </g>
);

// Grass blades cluster
const GrassCluster = ({ x, y, blades = 7, height = 80, hue = 138 }) => (
  <g transform={`translate(${x},${y})`}>
    {Array.from({ length: blades }, (_, i) => {
      const spread = (i - blades / 2) * 4;
      const h = height * (0.6 + Math.sin(i * 1.7) * 0.4);
      const sway = Math.sin(i * 2.3) * 8;
      return (
        <path
          key={i}
          d={`M${spread} 0 Q${spread + sway * 0.5} ${-h * 0.5}, ${spread + sway} ${-h}`}
          stroke={`hsl(${hue + i * 2}, 35%, ${22 + i * 2}%)`}
          strokeWidth={1.8 - i * 0.1}
          fill="none"
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

// Left-side foliage composition
const LeftFoliage = () => (
  <svg className="absolute left-0 top-0 w-56 h-full" viewBox="0 0 220 1000" preserveAspectRatio="xMinYMin slice" style={{ filter: "blur(0.4px)" }}>
    {/* Top cluster */}
    <BroadLeaf x={40} y={120} size={1.1} rot={25} hue={142} lightness={26} />
    <BroadLeaf x={20} y={140} size={0.85} rot={40} hue={148} lightness={30} />
    <FernFrond x={60} y={200} size={0.7} rot={15} hue={140} />
    <GrassCluster x={15} y={180} blades={5} height={60} />
    <Vine x={80} y={60} length={130} rot={5} />

    {/* Mid cluster */}
    <BroadLeaf x={30} y={380} size={1.0} rot={30} hue={138} lightness={24} />
    <FernFrond x={50} y={440} size={0.8} rot={20} hue={146} />
    <BroadLeaf x={15} y={420} size={0.7} rot={50} hue={150} lightness={32} />
    <GrassCluster x={10} y={460} blades={6} height={70} />
    <Vine x={70} y={340} length={110} rot={8} />

    {/* Lower cluster */}
    <FernFrond x={45} y={650} size={0.9} rot={18} hue={142} />
    <BroadLeaf x={25} y={680} size={0.95} rot={35} hue={136} lightness={25} />
    <GrassCluster x={12} y={700} blades={8} height={75} />
    <BroadLeaf x={55} y={720} size={0.6} rot={55} hue={152} lightness={30} />
    <Vine x={65} y={600} length={120} rot={3} />

    {/* Bottom cluster */}
    <BroadLeaf x={35} y={880} size={0.8} rot={28} hue={144} lightness={27} />
    <FernFrond x={20} y={920} size={0.65} rot={25} hue={148} />
    <GrassCluster x={8} y={940} blades={6} height={55} />
  </svg>
);

// Right-side foliage composition (mirrored feel)
const RightFoliage = () => (
  <svg className="absolute right-0 top-0 w-56 h-full" viewBox="0 0 220 1000" preserveAspectRatio="xMaxYMin slice" style={{ filter: "blur(0.4px)", transform: "scaleX(-1)" }}>
    {/* Top cluster */}
    <BroadLeaf x={35} y={80} size={0.9} rot={20} hue={140} lightness={28} />
    <FernFrond x={55} y={150} size={0.75} rot={12} hue={146} />
    <BroadLeaf x={18} y={130} size={1.0} rot={45} hue={136} lightness={24} />
    <GrassCluster x={10} y={160} blades={6} height={65} />
    <Vine x={75} y={40} length={140} rot={6} />

    {/* Mid cluster */}
    <FernFrond x={40} y={370} size={0.85} rot={22} hue={142} />
    <BroadLeaf x={20} y={400} size={0.8} rot={38} hue={150} lightness={30} />
    <GrassCluster x={15} y={430} blades={7} height={70} />
    <BroadLeaf x={60} y={350} size={0.65} rot={55} hue={138} lightness={26} />
    <Vine x={80} y={310} length={100} rot={10} />

    {/* Lower cluster */}
    <BroadLeaf x={30} y={620} size={1.05} rot={32} hue={144} lightness={25} />
    <FernFrond x={50} y={680} size={0.7} rot={16} hue={148} />
    <BroadLeaf x={15} y={660} size={0.75} rot={48} hue={140} lightness={30} />
    <GrassCluster x={8} y={710} blades={5} height={60} />
    <Vine x={70} y={580} length={115} rot={4} />

    {/* Bottom cluster */}
    <FernFrond x={45} y={860} size={0.6} rot={20} hue={146} />
    <BroadLeaf x={25} y={900} size={0.85} rot={30} hue={142} lightness={26} />
    <GrassCluster x={12} y={920} blades={7} height={65} />
  </svg>
);

export default function RiverBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  const foliageLeftY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const foliageRightY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Memoize random droplets so they don't re-render
  const droplets = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      w: 2 + (i % 3),
      h: 2 + (i % 3),
      left: 42 + (i * 1.3) % 16,
      top: (i * 7.3) % 100,
      delay: (i * 0.6) % 8,
      dur: 4 + (i % 4),
    })), []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* ===== RIVER — organic flowing water ===== */}
      <div className="absolute inset-0">
        {/* Wide soft river glow — organic shape */}
        <div className="absolute inset-0 flex justify-center">
          <div className="relative w-[400px] sm:w-[500px] h-full">
            {/* Soft water base — wide and diffused */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 40% 100% at 50% 50%, rgba(45,100,170,0.06) 0%, rgba(35,85,155,0.03) 40%, transparent 70%)",
              }}
            />
            {/* Animated flow layer 1 */}
            <div className="absolute inset-0 river-flow-organic opacity-[0.025]" />
            {/* Animated flow layer 2 — offset */}
            <div className="absolute inset-0 river-flow-organic-alt opacity-[0.018]" />
          </div>
        </div>

        {/* Soft riverbank edges — left */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: "calc(50% - 240px)",
            width: "120px",
            background: "radial-gradient(ellipse 100% 50% at 100% 50%, rgba(55,110,175,0.035) 0%, transparent 100%)",
          }}
        />
        {/* Soft riverbank edges — right */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            right: "calc(50% - 240px)",
            width: "120px",
            background: "radial-gradient(ellipse 100% 50% at 0% 50%, rgba(55,110,175,0.035) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ===== FOLIAGE — left ===== */}
      <motion.div className="absolute left-0 top-0 bottom-0" style={{ y: foliageLeftY, opacity: 0.14 }}>
        <LeftFoliage />
      </motion.div>

      {/* ===== FOLIAGE — right ===== */}
      <motion.div className="absolute right-0 top-0 bottom-0" style={{ y: foliageRightY, opacity: 0.12 }}>
        <RightFoliage />
      </motion.div>

      {/* Water droplets */}
      {droplets.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full water-droplet"
          style={{
            width: d.w,
            height: d.h,
            left: `${d.left}%`,
            top: `${d.top}%`,
            background: "rgba(90, 155, 220, 0.12)",
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
