"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rm = useReducedMotion();

  useEffect(() => {
    if (rm) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [rm]);

  return <>{children}</>;
}
