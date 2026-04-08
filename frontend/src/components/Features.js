import { motion } from "framer-motion";
import { Mic, Scissors, BookOpen } from "lucide-react";

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

        {/* Bento grid */}
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
      </div>
    </section>
  );
}
