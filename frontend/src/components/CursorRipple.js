import { useState, useEffect, useCallback, useRef } from "react";

const MAX_RIPPLES = 8;
const RIPPLE_INTERVAL = 120; // ms between spawns
const RIPPLE_LIFETIME = 1200; // ms

export default function CursorRipple() {
  const [ripples, setRipples] = useState([]);
  const lastSpawn = useRef(0);
  const idCounter = useRef(0);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastSpawn.current < RIPPLE_INTERVAL) return;
    lastSpawn.current = now;

    const id = idCounter.current++;
    const newRipple = {
      id,
      x: e.clientX,
      y: e.clientY,
      born: now,
    };

    setRipples((prev) => {
      const fresh = prev.filter((r) => now - r.born < RIPPLE_LIFETIME);
      const trimmed = fresh.length >= MAX_RIPPLES ? fresh.slice(1) : fresh;
      return [...trimmed, newRipple];
    });
  }, []);

  // Cleanup old ripples periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      setRipples((prev) => prev.filter((r) => Date.now() - r.born < RIPPLE_LIFETIME));
    }, 400);
    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute ripple-ring"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Primary ring */}
          <div className="ripple-circle" />
          {/* Secondary ring — slightly delayed */}
          <div className="ripple-circle ripple-circle-delayed" />
        </div>
      ))}
    </div>
  );
}
