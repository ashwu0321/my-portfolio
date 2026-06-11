"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// ── Constants ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Variants ───────────────────────────────────────────────────────────

const fadeRise = (reducedMotion: boolean) => ({
  hidden:  { opacity: 0, y: reducedMotion ? 0 : 16 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: reducedMotion ? 0 : d, duration: reducedMotion ? 0.01 : 0.5, ease: EASE },
  }),
});

const nameRise = (reducedMotion: boolean) => ({
  hidden:  { opacity: 0, y: reducedMotion ? 0 : 32 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: reducedMotion ? 0 : d, duration: reducedMotion ? 0.01 : 0.7, ease: EASE },
  }),
});

const fadeIn = (reducedMotion: boolean) => ({
  hidden:  { opacity: 0 },
  visible: (d: number) => ({
    opacity: 1,
    transition: { delay: reducedMotion ? 0 : d, duration: reducedMotion ? 0.01 : 0.4, ease: EASE },
  }),
});

// ── HeroSectionSplit ───────────────────────────────────────────────────
//
// Editorial split layout: name fills the left ~60%, metadata + bio + CTA
// stack in the right column baseline-aligned to the bottom of the name.

export default function HeroSectionSplit({
  startAnimation,
}: {
  startAnimation: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // ── Scroll parallax ────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6],  [1, 0]);

  // ── Breathing loop ─────────────────────────────────────────────────
  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation || shouldReduceMotion) return;
    const t = setTimeout(() => setBreathe(true), 2200);
    return () => clearTimeout(t);
  }, [startAnimation, shouldReduceMotion]);

  const animState: "hidden" | "visible" = startAnimation ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-20 md:py-28"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>

        {/* ── Top rule + year annotation ── */}
        <motion.div
          className="flex items-center justify-between mb-10 pb-4 border-b border-hairline"
          variants={fadeRise(shouldReduceMotion)}
          initial="hidden"
          animate={animState}
          custom={0.0}
        >
          <span className={meta}>Portfolio</span>
          <span className={meta}>2024–25</span>
        </motion.div>

        {/* ── Two-column split ── */}
        <div className="flex items-end gap-8 md:gap-12">

          {/* ── Left: name (~60%) ── */}
          <div className="flex-[3] min-w-0">
            <motion.div
              animate={breathe ? { scale: [1, 1.003] } : { scale: 1 }}
              transition={
                breathe
                  ? { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                  : {}
              }
            >
              <h1
                className="leading-[0.88] text-ink select-none"
                style={{ fontFamily: "var(--font-exmouth), serif" }}
                aria-label="Ashley Wu."
              >
                <motion.span
                  className="block text-[clamp(72px,10vw,148px)]"
                  variants={nameRise(shouldReduceMotion)}
                  initial="hidden"
                  animate={animState}
                  custom={0.15}
                >
                  Ashley
                </motion.span>
                <motion.span
                  className="block text-[clamp(72px,10vw,148px)]"
                  variants={nameRise(shouldReduceMotion)}
                  initial="hidden"
                  animate={animState}
                  custom={0.28}
                >
                  Wu
                  <motion.span
                    className="text-accent"
                    variants={fadeIn(shouldReduceMotion)}
                    initial="hidden"
                    animate={animState}
                    custom={0.5}
                  >
                    .
                  </motion.span>
                </motion.span>
              </h1>
            </motion.div>
          </div>

          {/* ── Right: metadata stack (~40%), baseline-aligned to bottom of name ── */}
          <div className="flex-[2] min-w-0 pb-1 flex flex-col gap-8">

            {/* Metadata pills */}
            <motion.div
              className={`${meta} flex flex-col gap-2`}
              variants={fadeRise(shouldReduceMotion)}
              initial="hidden"
              animate={animState}
              custom={0.45}
            >
              <span>CS Major</span>
              <span>Univ. of Virginia</span>
              <span>Open to Offers · Summer 2027</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              className="text-sm leading-relaxed text-muted"
              variants={fadeRise(shouldReduceMotion)}
              initial="hidden"
              animate={animState}
              custom={0.6}
            >
              CS junior at the University of Virginia with a focus on systems and
              ML. I build tools that are fast, accessible, and honest about their
              complexity.
            </motion.p>

            {/* CTA */}
            <motion.a
              href="#projects"
              className="self-start font-mono text-[11px] uppercase tracking-[0.12em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
              variants={fadeRise(shouldReduceMotion)}
              initial="hidden"
              animate={animState}
              custom={0.75}
            >
              View my work ↓
            </motion.a>

          </div>
        </div>

      </motion.div>
    </section>
  );
}
