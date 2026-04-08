import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Footer({ trackClick }) {
  return (
    <footer data-testid="site-footer">
      {/* Final CTA */}
      <motion.div
        data-testid="footer-cta-section"
        className="border-t border-border/30 py-20 sm:py-24"
        data-track-section="footer-cta"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight mb-4 section-text-glow">
            Ready to Stop Editing the Hard Way?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto section-text-glow">
            Let RupertJolt handle the grunt work so you can focus on what actually matters — creating.
          </p>
          <Button
            data-testid="footer-cta-button"
            onClick={() => {
              if (trackClick) trackClick("waitlist-cta-footer");
              document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-primary text-primary-foreground font-heading font-semibold text-base rounded-full px-10 h-12 hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(106,155,228,0.3)]"
          >
            Join the Waitlist
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            First 500 signups get 50% off for life.
          </p>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-border/30 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://customer-assets.emergentagent.com/job_first-pass-ai/artifacts/uz0vyu96_Rupert.png" alt="RupertJolt" className="w-6 h-6 rounded-md object-contain" />
            <span className="font-heading font-medium text-sm text-foreground">
              RupertJolt
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} RupertJolt. Built for creators who'd rather create.
          </p>
        </div>
      </div>
    </footer>
  );
}
