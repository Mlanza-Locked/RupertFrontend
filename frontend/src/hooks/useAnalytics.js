import { useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Generate a session ID once per page load
const SESSION_ID = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function useAnalytics() {
  const sectionTimes = useRef({});
  const visibleSections = useRef(new Set());
  const lastTick = useRef(Date.now());
  const hasSentVisit = useRef(false);

  // Track page visit once
  useEffect(() => {
    if (hasSentVisit.current) return;
    hasSentVisit.current = true;
    axios.post(`${API}/analytics/visit`, { page: "landing" }).catch(() => {});
  }, []);

  // Section time tracking via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("[data-track-section]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const name = entry.target.getAttribute("data-track-section");
          if (entry.isIntersecting) {
            visibleSections.current.add(name);
          } else {
            visibleSections.current.delete(name);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((el) => observer.observe(el));

    // Tick every second to accumulate time
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTick.current) / 1000;
      lastTick.current = now;
      visibleSections.current.forEach((name) => {
        sectionTimes.current[name] = (sectionTimes.current[name] || 0) + delta;
      });
    }, 1000);

    // Send on page unload
    const flush = () => {
      if (Object.keys(sectionTimes.current).length > 0) {
        navigator.sendBeacon(
          `${API}/analytics/section-time`,
          JSON.stringify({ session_id: SESSION_ID, sections: sectionTimes.current })
        );
      }
    };
    window.addEventListener("beforeunload", flush);

    // Also flush every 30s
    const flushInterval = setInterval(() => {
      if (Object.keys(sectionTimes.current).length > 0) {
        axios
          .post(`${API}/analytics/section-time`, {
            session_id: SESSION_ID,
            sections: { ...sectionTimes.current },
          })
          .catch(() => {});
      }
    }, 30000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearInterval(flushInterval);
      window.removeEventListener("beforeunload", flush);
    };
  }, []);

  // Track click
  const trackClick = useCallback((element) => {
    axios.post(`${API}/analytics/click`, { element }).catch(() => {});
  }, []);

  return { trackClick };
}
