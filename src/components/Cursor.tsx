"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Single morphing element:
//   default  → 6 px filled dot  (#1A1814)
//   hovering → 36 px outlined ring (transparent fill, 1.5 px stroke)
// Only mounts on pointer:fine devices; invisible on touch screens.

export default function Cursor() {
  const [mounted, setMounted]   = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springCfg = { stiffness: 600, damping: 40, mass: 0.5 } as const;
  const springX = useSpring(mouseX, springCfg);
  const springY = useSpring(mouseY, springCfg);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    function onMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    function onOver(e: MouseEvent) {
      setHovering(
        !!(e.target as Element).closest(
          'a, button, [role="button"], label, input, textarea, select'
        )
      );
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
      className="fixed pointer-events-none z-[9999] rounded-full"
      initial={false}
      style={{
        // left/top position the element; translate(-50%,-50%) centres it on the cursor
        left: springX,
        top:  springY,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        width:           hovering ? 36 : 6,
        height:          hovering ? 36 : 6,
        backgroundColor: hovering ? "transparent" : "#1A1814",
        boxShadow:       hovering
          ? "0 0 0 1.5px #1A1814"
          : "0 0 0 0px #1A1814",
      }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
