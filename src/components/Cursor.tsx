"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ── Three cursor modes ────────────────────────────────────────────────
//
//  dot   — default 6 px filled circle
//  ring  — 36 px outlined ring (hovered over any interactive element)
//  label — 96 × 28 px filled pill showing "Read More →"
//          triggered when hovering over [data-cursor="readmore"] regions.
//          Individual links inside those regions can opt back out with
//          [data-cursor="default"].
//
// Only mounts on pointer:fine (mouse) devices.

type CursorMode = "dot" | "ring" | "label";

export default function Cursor() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode]       = useState<CursorMode>("dot");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springCfg = { stiffness: 600, damping: 40, mass: 0.5 } as const;
  const springX   = useSpring(mouseX, springCfg);
  const springY   = useSpring(mouseY, springCfg);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    function onMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    function onOver(e: MouseEvent) {
      const el = e.target as Element;

      // Explicit opt-out → always show ring (e.g. GitHub / Demo links inside a readmore zone)
      if (el.closest('[data-cursor="default"]')) {
        setMode("ring");
      // Readmore region → expand to pill
      } else if (el.closest('[data-cursor="readmore"]')) {
        setMode("label");
      // Standard interactive elements → ring
      } else if (
        el.closest('a, button, [role="button"], label, input, textarea, select')
      ) {
        setMode("ring");
      // Bare canvas → dot
      } else {
        setMode("dot");
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center overflow-hidden"
      initial={false}
      style={{
        left:      springX,
        top:       springY,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        width:           mode === "label" ? 96  : mode === "ring" ? 36  : 6,
        height:          mode === "label" ? 28  : mode === "ring" ? 36  : 6,
        backgroundColor: mode === "ring"  ? "transparent" : "#1A1814",
        boxShadow:       mode === "ring"  ? "0 0 0 1.5px #1A1814" : "0 0 0 0px #1A1814",
      }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* "Read More →" label — fades in only in label mode */}
      <motion.span
        className="font-mono text-[8px] uppercase tracking-[0.1em] text-paper whitespace-nowrap"
        animate={{ opacity: mode === "label" ? 1 : 0 }}
        transition={{
          duration: mode === "label" ? 0.12 : 0.06,
          delay:    mode === "label" ? 0.08 : 0,
        }}
      >
        Read More →
      </motion.span>
    </motion.div>
  );
}
