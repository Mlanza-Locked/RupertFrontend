import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const scrollToWaitlist = () => {
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
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-primary font-heading font-bold text-sm">R</span>
          </div>
          <span className="font-heading font-semibold text-lg text-foreground tracking-tight">
            Rupert Joel
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
