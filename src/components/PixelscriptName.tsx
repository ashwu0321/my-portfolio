"use client";

import { motion } from "framer-motion";

// Uses PF Pixelscript from Adobe Fonts (loaded via Typekit in layout.tsx).
// Mirrors the original two-line layout: "Ashley" smaller → "Wu" larger.

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LINES = [
  {
    text: "Ashley",
    startDelay: 0.1,
    stagger: 0.045,
    className: "text-[40px] md:text-[54px]",
  },
  {
    text: "Wu",
    startDelay: 0.38,
    stagger: 0.09,
    className: "text-[76px] md:text-[100px]",
  },
] as const;

export default function PixelscriptName() {
  return (
    <h1
      className="mb-14 select-none leading-[0.9] text-ink"
      aria-label="Ashley Wu"
      style={{ fontFamily: '"pf-pixelscript", monospace' }}
    >
      {LINES.map(({ text, startDelay, stagger, className }) => (
        <span key={text} className={`block ${className}`}>
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: startDelay + i * stagger,
                duration: 0.55,
                ease,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}
