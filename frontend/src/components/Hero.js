import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Hero({ signedUpEmail, setSignedUpEmail }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero-section"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Abstract animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large turquoise orb */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full animate-float-orb"
          style={{
            background: "radial-gradient(circle, rgba(64,224,208,0.12) 0%, transparent 70%)",
            top: "10%",
            left: "-10%",
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-float-orb-delayed"
          style={{
            background: "radial-gradient(circle, rgba(64,224,208,0.08) 0%, transparent 70%)",
            bottom: "5%",
            right: "-5%",
          }}
        />
        {/* Small accent orb */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full animate-float-orb-slow"
          style={{
            background: "radial-gradient(circle, rgba(64,224,208,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "60%",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(64,224,208,1) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      {/* Content */}
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
