"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Wraps any interactive element with a subtle magnetic pull.
// On mouse-over it nudges toward the cursor; on leave it springs back to rest.

interface Props {
  children: React.ReactNode;
  className?: string;
  /** 0–1. How strongly the element follows the cursor. Default: 0.35 */
  strength?: number;
}

export default function MagneticLink({
  children,
  className,
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springCfg = { stiffness: 300, damping: 22, mass: 0.5 } as const;
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left - width  / 2) * strength);
    rawY.set((e.clientY - top  - height / 2) * strength);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
