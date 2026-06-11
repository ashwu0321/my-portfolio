"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ── LoadingScreen ─────────────────────────────────────────────────────
//
// Visual sequence
//   0 ms     → full-screen ink overlay covers everything (nav included)
//   0–350 ms → paper circle scales from 0 → 1 (appears from center)
//   350 ms   → "AW" fades into the circle
//   1 000 ms → "AW" fades out; circle irises to scale 30 (fills viewport)
//   1 700 ms → component returns null — paper circle = page background,
//              so the unmount is invisible → hero entry starts
//
// Why no AnimatePresence exit?
//   The expanded circle is paper-colored (same as the hero background).
//   Removing it instantly reveals an identical-looking page, so there is
//   no visible flash or transition needed.

type Phase = "enter" | "expand" | "done";

const OPEN_EASE:   [number, number, number, number] = [0.23, 1, 0.32, 1];
const EXPAND_EASE: [number, number, number, number] = [0.6,  0, 0.2,  1];

const CIRCLE_PX = 160; // resting diameter in px

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("enter");
  const shouldReduceMotion = useReducedMotion();

  // Keep a stable ref so the timeout closure always calls the latest prop
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Skip the loading sequence entirely for users who prefer reduced motion
    if (shouldReduceMotion) {
      setPhase("done");
      onCompleteRef.current();
      return;
    }
    const t1 = setTimeout(() => setPhase("expand"), 1000);
    const t2 = setTimeout(() => {
      setPhase("done");
      onCompleteRef.current();
    }, 1000 + 650 + 60);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [shouldReduceMotion]);

  // Once done, render nothing — the expanded paper circle matches the page
  // background perfectly, so the instant removal is invisible.
  if (phase === "done") return null;

  return (
    // Dark surround covers everything (nav included). The paper circle in the
    // centre matches the hero background so the iris expansion is seamless.
    <div className="fixed inset-0 z-[100] bg-ink flex items-center justify-center">

      {/* Paper circle on dark field — clearly visible, no ring needed */}
      <motion.div
        className="rounded-full bg-paper flex items-center justify-center"
        style={{ width: CIRCLE_PX, height: CIRCLE_PX }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: phase === "expand" ? 30 : 1, opacity: 1 }}
        transition={{
          scale:
            phase === "expand"
              ? { duration: 0.65, ease: EXPAND_EASE }
              : { duration: 0.35, ease: OPEN_EASE },
        }}
      >
        {/* "AW" — fades in after the circle opens, fades out before expansion.
            `display:block` + `line-height:1` ensures the text box is exactly
            cap-height tall so flexbox centres it without font-metric skew. */}
        <motion.span
          className="select-none pointer-events-none"
          style={{
            fontFamily:  "var(--font-exmouth), serif",
            fontSize:    CIRCLE_PX * 0.40,
            lineHeight:  1,
            display:     "block",
            color:       "var(--color-ink, #1a1510)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "enter" ? 1 : 0 }}
          transition={{
            opacity:
              phase === "enter"
                ? { delay: 0.25, duration: 0.45, ease: OPEN_EASE }
                : { duration: 0.15 },
          }}
        >
          AW
        </motion.span>
      </motion.div>

    </div>
  );
}
