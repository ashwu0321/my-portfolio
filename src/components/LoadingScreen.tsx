"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ── LoadingScreen ─────────────────────────────────────────────────────
//
// Visual sequence
//   0 ms     → full-screen ink (#1A1814) covers everything
//   0–900 ms → paper-colored wash (#F2F0EC) bleeds outward from center
//              SVG feTurbulence + feDisplacementMap gives the organic,
//              wet-ink edge — not a crisp circle
//   200 ms   → "Ashley Wu" fades in (ink on paper, letterpress feel)
//   850 ms   → name begins fading out
//   1 000 ms → bleed switches to fast-expand, flooding the viewport
//   1 700 ms → component unmounts; paper-colored bleed = page background,
//              so the removal is invisible and the hero entry begins
//
// Reduced motion: sequence is skipped, onComplete fires immediately.

type Phase = "enter" | "expand" | "done";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const FAST: [number, number, number, number] = [0.55, 0, 0.2,  1];

// Bleed radius targets (in SVG viewport pixels, circle centred at 50% 50%)
const R_POOL   = 230; // resting "ink pool" radius behind the name
const R_FILL   = 2200; // large enough to cover any viewport diagonal

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase,    setPhase]    = useState<Phase>("enter");
  const [showName, setShowName] = useState(false);
  const rm = useReducedMotion();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (rm) {
      setPhase("done");
      onCompleteRef.current();
      return;
    }

    const timers = [
      setTimeout(() => setShowName(true),   200),   // name fades in
      setTimeout(() => setShowName(false),  850),   // name fades out
      setTimeout(() => setPhase("expand"), 1000),   // bleed floods viewport
      setTimeout(() => {
        setPhase("done");
        onCompleteRef.current();
      }, 1700),
    ];

    return () => timers.forEach(clearTimeout);
  }, [rm]);

  if (phase === "done") return null;

  const expanding = phase === "expand";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: "#1A1814" }}
    >
      {/* ── Organic ink bleed ─────────────────────────────────────────── */}
      {/* SVG sits behind the name. The feTurbulence filter displaces the
          circle's edge so it looks wet and handmade rather than geometric. */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset:    0,
          width:    "100%",
          height:   "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Filter region: x/y/w/h in objectBoundingBox fractions.
              Extending 8× the bounding box on each side guarantees the
              displaced pixels have room to breathe at every circle size. */}
          <filter
            id="inkBleed"
            x="-8"   y="-8"
            width="17" height="17"
          >
            {/* Slow, chunky turbulence → big organic ink-bleed shapes */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.008 0.011"
              numOctaves="4"
              seed="11"
              result="noise"
            />
            {/* Displace the circle edge by up to ±70 px */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* The paper wash — starts as a small ink drop, grows to fill screen */}
        <motion.circle
          cx="50%"
          cy="50%"
          fill="#F2F0EC"
          filter="url(#inkBleed)"
          initial={{ r: 10 }}
          animate={{ r: expanding ? R_FILL : R_POOL }}
          transition={{
            r: expanding
              ? { duration: 0.72, ease: FAST }
              : { duration: 0.90, ease: EASE },
          }}
        />
      </svg>

      {/* ── "Ashley Wu" ────────────────────────────────────────────────── */}
      {/* Ink-colored text on the paper bleed. Natural contrast: invisible
          on ink background → visible once the paper bleed grows behind it. */}
      <div
        className="absolute inset-0 flex items-center justify-center
                   pointer-events-none select-none"
      >
        <motion.span
          style={{
            fontFamily: "var(--font-exmouth), serif",
            fontSize:   72,
            lineHeight: 1,
            color:      "#1A1814",
            position:   "relative",
            zIndex:     10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showName ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Ashley Wu
        </motion.span>
      </div>
    </div>
  );
}
