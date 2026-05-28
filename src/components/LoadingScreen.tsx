"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── LoadingScreen ─────────────────────────────────────────────────────
//
// Timeline
//   0 ms    → ink circle opens (0 → 80 px radius, 250 ms)
//   150 ms  → "AW" initials fade in (500 ms)
//   900 ms  → initials fade out; circle irises to full viewport (600 ms)
//   1 700 ms → element exits via opacity (250 ms)
//   1 950 ms → onExitComplete fires → onComplete() → hero entry begins
//
// The ink overlay fills the screen before fading, so the hero starts
// animating on a clean paper page.

type Phase = "enter" | "expand" | "done";

const OPEN_EASE:   [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const EXPAND_EASE: [number, number, number, number] = [0.6,  0,   0.2,  1];

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase,        setPhase]        = useState<Phase>("enter");
  const [targetRadius, setTargetRadius] = useState(2600);
  const phaseRef = useRef<Phase>("enter");
  phaseRef.current = phase;

  useEffect(() => {
    // Compute radius large enough to cover any viewport diagonal
    setTargetRadius(Math.hypot(window.innerWidth, window.innerHeight) + 120);

    const t1 = setTimeout(() => setPhase("expand"), 900);
    const t2 = setTimeout(() => setPhase("done"),   1700); // triggers exit anim

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "done" && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[100] bg-ink flex items-center justify-center"
          initial={{ clipPath: "circle(0px at 50% 50%)" }}
          animate={{
            clipPath:
              phase === "expand"
                ? `circle(${targetRadius}px at 50% 50%)`
                : "circle(80px at 50% 50%)",
          }}
          exit={{ opacity: 0 }}
          transition={{
            clipPath:
              phase === "expand"
                ? { duration: 0.6,  ease: EXPAND_EASE }
                : { duration: 0.25, ease: OPEN_EASE },
            opacity: { duration: 0.25, ease: "easeOut" },
          }}
        >
          {/* Initials — visible during "enter", fade out on "expand" */}
          <motion.span
            className="font-normal leading-none select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-calista), serif",
              fontSize:   "clamp(38px, 5vw, 60px)",
              // Use the paper token; fallback to a warm off-white
              color: "var(--color-paper, #f6f3ec)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "enter" ? 1 : 0 }}
            transition={{
              opacity:
                phase === "enter"
                  ? { delay: 0.15, duration: 0.5,  ease: OPEN_EASE }
                  : { duration:  0.2 },
            }}
          >
            AW
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
