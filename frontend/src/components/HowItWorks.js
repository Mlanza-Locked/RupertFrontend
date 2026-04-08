import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Raw Footage",
    description:
      "Drop your talking-head video — podcast, vlog, course content. Any format, any length.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI First-Pass",
    description:
      "Rupert removes silence, transcribes with WhisperX, and generates chapters & summaries. One click.",
  },
  {
    icon: Download,
    step: "03",
    title: "Export & Finish",
    description:
      "Export your polished first-pass to Premiere, Final Cut Pro, or DaVinci Resolve. Fine-tune from there.",
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative py-24 sm:py-32 border-t border-border/30"
      data-track-section="how-it-works"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-heading uppercase text-xs tracking-[0.2em] text-primary mb-3">
            How it works
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-4 section-text-glow">
            Three Steps. Zero Headaches.
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto section-text-glow">
            From raw footage to a polished first-pass in minutes, not hours.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              data-testid={`step-card-${i}`}
              className="relative text-center group rounded-xl p-6 transition-all duration-300 hover:bg-card/80 hover:border hover:border-primary/20 hover:shadow-[0_0_30px_rgba(106,155,228,0.08)] border border-transparent cursor-default"
              custom={i}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Step number + icon */}
              <div className="relative inline-flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-card/95 border border-border/60 flex items-center justify-center mb-3 relative z-10 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_24px_rgba(106,155,228,0.15)]" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                  <step.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-heading text-xs tracking-[0.15em] text-muted-foreground uppercase transition-colors duration-300 group-hover:text-primary">
                  Step {step.step}
                </span>
              </div>

              <h3 className="font-heading font-semibold text-lg text-foreground mb-3 section-text-glow transition-colors duration-300 group-hover:text-primary">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto section-text-glow">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
