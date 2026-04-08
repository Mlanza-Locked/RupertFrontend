import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Header({ trackClick }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const scrollToWaitlist = () => {
    if (trackClick) trackClick("waitlist-cta-header");
    const el = document.getElementById("hero-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/40"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
          <img src="https://customer-assets.emergentagent.com/job_first-pass-ai/artifacts/uz0vyu96_Rupert.png" alt="RupertJolt" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-heading font-semibold text-lg text-foreground tracking-tight">
            RupertJolt
          </span>
        </a>

        <Button
          data-testid="header-cta-button"
          onClick={scrollToWaitlist}
          className="bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-full px-6 h-9 hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(64,224,208,0.25)]"
        >
          Join Waitlist
        </Button>
      </div>
    </motion.header>
  );
}
