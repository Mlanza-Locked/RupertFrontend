import { motion } from "framer-motion";
import { Mic, Scissors, BookOpen, BrainCircuit, Captions, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Scissors,
    title: "One-Click Silence Removal",
    description:
      "Dead air, awkward pauses, and filler words vanish instantly. Your content flows like it was scripted — because Rupert knows what to keep.",
    span: "md:col-span-4 lg:col-span-5",
  },
  {
    icon: Mic,
    title: "High-Accuracy WhisperX Transcription",
    description:
      "Word-level precision powered by WhisperX. Get timestamped transcripts you can actually trust — no more garbled auto-captions.",
    span: "md:col-span-4 lg:col-span-7",
  },
  {
    icon: BookOpen,
    title: "Automated Chapter & Summary Generation",
    description:
      "Stop drifting through hour-long recordings. Rupert generates chapter markers and concise summaries so you and your audience find the good stuff fast.",
    span: "md:col-span-8 lg:col-span-12",
  },
];

const MORE_FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Analysis for Future Improvement",
    description:
      "Rupert studies your pacing, filler-word habits, and engagement patterns across uploads — then surfaces actionable insights so every video you make is sharper than the last.",
    span: "md:col-span-4 lg:col-span-4",
  },
  {
    icon: Captions,
    title: "Auto Captions",
    description:
      "Burn-in or export perfectly timed captions in seconds. Styled, synced, and ready for any platform — no manual alignment needed.",
    span: "md:col-span-4 lg:col-span-4",
  },
  {
    icon: Layers,
    title: "Adaptive to Each Channel's Style",
    description:
      "YouTube, TikTok, podcast RSS — Rupert learns your formatting rules per channel and auto-adjusts aspect ratio, pacing, and export settings to match.",
    span: "md:col-span-4 lg:col-span-4",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section
      id="features-section"
      data-testid="features-section"
      className="relative py-24 sm:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-heading uppercase text-xs tracking-[0.2em] text-primary mb-3">
            Features
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-4">
            Otterly Effortless Editing
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Three powerful tools working together so you never have to scrub a
            timeline again.
          </p>
        </motion.div>

        {/* Bento grid — core features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              data-testid={`feature-card-${i}`}
              className={`feature-card ${feature.span} bg-card border border-border/50 rounded-lg p-8 group`}
              variants={cardVariants}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* "And more" divider */}
        <motion.div
          className="text-center mt-20 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-heading uppercase text-xs tracking-[0.2em] text-primary mb-3">
            And more
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-4">
            Tools That Get Smarter with You
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Rupert doesn't just edit — it learns your style and adapts to every platform you publish on.
          </p>
        </motion.div>

        {/* "And more" grid — equal 3-column */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {MORE_FEATURES.map((feature, i) => (
            <motion.div
              key={`more-${i}`}
              data-testid={`more-feature-card-${i}`}
              className={`feature-card ${feature.span} bg-card border border-border/50 rounded-lg p-8 group`}
              variants={cardVariants}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA after tools */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <Button
            data-testid="features-cta-button"
            onClick={() => document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-primary-foreground font-heading font-semibold text-base rounded-full px-10 h-12 hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(106,155,228,0.3)]"
          >
            Join the Waitlist
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            First 500 signups get 50% off for life.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
