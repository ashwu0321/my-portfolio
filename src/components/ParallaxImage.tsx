"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ── ParallaxImage ─────────────────────────────────────────────────────
//
// Wraps any image or placeholder and makes its inner content scroll at
// 85% of page speed — creating a depth / "floating behind glass" effect.
//
// How it works
//   The motion.div is 60px taller than its container (30px above + below)
//   and starts with a -30px static offset so it is perfectly centred at
//   rest. As the card travels through the viewport useScroll drives the
//   y transform from -30 px → +30 px:
//
//     scroll = 0  (card entering from bottom) → y = -30  → lower portion visible
//     scroll = 1  (card exiting at top)       → y = +30  → upper portion visible
//
//   The container's overflow:hidden clips the 60px overhang, so the image
//   never bleeds outside the card boundary.
//
// Mobile
//   Below 640 px no transform is applied — images render normally.
//   The useScroll / useTransform hooks always run (no conditional hooks)
//   but the y value is ignored on mobile.
//
// Usage
//   Pass className for ALL sizing and shape styles (rounded, height, etc.)
//   that would normally go on the image wrapper — this component's outer
//   div becomes that wrapper.
//
//   // Art gallery placeholder
//   <ParallaxImage className="rounded-2xl h-80">
//     <div className="w-full h-full bg-placeholder" />
//   </ParallaxImage>
//
//   // Project card — fill image (position absolute)
//   <ParallaxImage className="absolute inset-0">
//     <Image src={src} alt={alt} fill className="object-cover" />
//   </ParallaxImage>

export default function ParallaxImage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Breakpoint gate ──────────────────────────────────────────────────
  // Initialise after mount to avoid hydration mismatch.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Scroll tracking ──────────────────────────────────────────────────
  // Progress 0 → 1 as the card travels from entering the bottom of the
  // viewport to fully exiting the top.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // y: -30 px when entering, +30 px when exiting → image drifts upward
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        // 60 px taller than container, centred via -30 px static offset.
        // The overflow-hidden above clips the overhang perfectly.
        // `relative` is required so that Next.js <Image fill> can anchor to it.
        className="relative will-change-transform"
        style={{
          height:    "calc(100% + 60px)",
          marginTop: "-30px",
          y:         isDesktop ? y : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
