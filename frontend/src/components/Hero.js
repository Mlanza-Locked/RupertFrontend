import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import WaitlistForm from "@/components/WaitlistForm";
import { Badge } from "@/components/ui/badge";

const HEADLINES = [
  "Cut Hours of Editing in One Click with AI First-Pass",
  "Automate Silence Removal & Summaries Instantly",
  "The First-Pass Video Editor for Smart Creators",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1758336011136-343678e4fc05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY3JlYXRvciUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwwfHx8fDE3NzU2MDgzNzR8MA&ixlib=rb-4.1.0&q=85&w=80&h=80",
  "https://images.unsplash.com/photo-1758691737387-a89bb8adf768?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwY3JlYXRvciUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwwfHx8fDE3NzU2MDgzNzR8MA&ixlib=rb-4.1.0&q=85&w=80&h=80",
  "https://images.unsplash.com/photo-1714976326861-dd180a8a57b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxkaXZlcnNlJTIwY3JlYXRvciUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwwfHx8fDE3NzU2MDgzNzR8MA&ixlib=rb-4.1.0&q=85&w=80&h=80",
  "https://images.unsplash.com/photo-1758874384842-7e79ce77ed1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxkaXZlcnNlJTIwY3JlYXRvciUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwwfHx8fDE3NzU2MDgzNzR8MA&ixlib=rb-4.1.0&q=85&w=80&h=80",
];

// Small twinkling stars
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 70}%`,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
}));

export default function Hero({ signedUpEmail, setSignedUpEmail, trackClick }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms — elements move at different rates on scroll
  const moonY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const moonScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const cloudFrontX = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cloudBackX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const cloudMidY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const accentLeftY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const accentRightY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      data-track-section="hero"
    >
      {/* ===== Night Sky Background ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep night gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #080b14 0%, #0e1222 35%, #131a2e 65%, #0f1420 100%)",
          }}
        />

        {/* Twinkling stars — scroll parallax */}
        <motion.div className="absolute inset-0" style={{ y: starsY }}>
          {STARS.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: 0.4,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* Moon — bright, glowing, parallax on scroll */}
        <motion.div
          className="absolute"
          style={{
            top: "8%",
            right: "15%",
            y: moonY,
            scale: moonScale,
          }}
        >
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full animate-moon-pulse relative"
            style={{
              background: "radial-gradient(circle at 40% 40%, #f0f4ff 0%, #dce6ff 40%, #b8ccf0 70%, #8aa8d8 100%)",
            }}
          >
            {/* Moon craters (subtle) */}
            <div className="absolute w-5 h-5 rounded-full bg-white/10" style={{ top: "25%", left: "50%" }} />
            <div className="absolute w-3 h-3 rounded-full bg-white/8" style={{ top: "55%", left: "30%" }} />
            <div className="absolute w-4 h-4 rounded-full bg-white/6" style={{ top: "40%", left: "65%" }} />
          </div>
          {/* Moon halo */}
          <div
            className="absolute inset-0 -m-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(180,200,255,0.08) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Cloud layers with scroll parallax + idle drift */}

        {/* Back cloud — far, slow */}
        <motion.div
          className="absolute animate-drift-cloud"
          style={{
            x: cloudBackX,
            top: "15%",
            left: "-5%",
          }}
        >
          <div
            className="w-[500px] h-[120px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(ellipse, rgba(140,170,220,1) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        </motion.div>

        {/* Mid cloud — medium depth */}
        <motion.div
          className="absolute animate-drift-cloud-reverse"
          style={{
            y: cloudMidY,
            top: "55%",
            right: "-8%",
          }}
        >
          <div
            className="w-[600px] h-[100px] rounded-full opacity-[0.07]"
            style={{
              background: "radial-gradient(ellipse, rgba(120,150,210,1) 0%, transparent 65%)",
              filter: "blur(35px)",
            }}
          />
        </motion.div>

        {/* Front cloud — close, fast parallax */}
        <motion.div
          className="absolute animate-drift-cloud"
          style={{
            x: cloudFrontX,
            bottom: "10%",
            left: "10%",
          }}
        >
          <div
            className="w-[450px] h-[80px] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(ellipse, rgba(160,185,230,1) 0%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />
        </motion.div>

        {/* Wispy top-right cloud */}
        <motion.div
          className="absolute animate-drift-cloud-reverse"
          style={{
            x: cloudBackX,
            y: cloudMidY,
            top: "30%",
            right: "5%",
          }}
        >
          <div
            className="w-[350px] h-[60px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(ellipse, rgba(150,175,225,1) 0%, transparent 65%)",
              filter: "blur(28px)",
            }}
          />
        </motion.div>

        {/* ===== Light dark-blue accent orbs — parallax on scroll ===== */}

        {/* Left accent */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            y: accentLeftY,
            background: "radial-gradient(circle, rgba(90,130,200,0.1) 0%, transparent 70%)",
            top: "60%",
            left: "-5%",
          }}
        />

        {/* Right accent */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            y: accentRightY,
            background: "radial-gradient(circle, rgba(80,120,190,0.08) 0%, transparent 70%)",
            top: "20%",
            right: "-8%",
          }}
        />

        {/* Bottom center glow */}
        <motion.div
          className="absolute w-[600px] h-[300px] rounded-full"
          style={{
            y: accentLeftY,
            background: "radial-gradient(ellipse, rgba(70,110,185,0.06) 0%, transparent 70%)",
            bottom: "-5%",
            left: "30%",
          }}
        />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge
            data-testid="urgency-badge"
            className="bg-primary/10 text-primary border-primary/20 font-heading uppercase text-xs tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 inline-flex"
          >
            First 500 signups get 50% off for life
          </Badge>
        </motion.div>

        {/* Rotating headline */}
        <div className="h-[120px] sm:h-[140px] lg:h-[160px] flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              data-testid="hero-headline"
              className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {HEADLINES[headlineIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subheadline — objection handling */}
        <motion.p
          data-testid="hero-subheadline"
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          No robotic cuts. No missing context. Rupert surgically removes dead air
          and filler words while keeping your natural rhythm &mdash; you stay in
          full creative control.
        </motion.p>

        {/* Waitlist form / Confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <WaitlistForm
            signedUpEmail={signedUpEmail}
            setSignedUpEmail={setSignedUpEmail}
            trackClick={trackClick}
          />
        </motion.div>

        {/* Social proof */}
        <motion.div
          data-testid="social-proof"
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex -space-x-2">
            {AVATARS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Creator ${i + 1}`}
                className="w-8 h-8 rounded-full border-2 border-background object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Join <span className="text-foreground font-semibold">400+</span> creators waiting for Rupert
          </span>
        </motion.div>
      </div>
    </section>
  );
}
