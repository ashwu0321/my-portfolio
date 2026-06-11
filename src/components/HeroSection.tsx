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
  hidden:  { opacity: 0, y: reducedMotion ? 0 : 24 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: reducedMotion ? 0 : d, duration: reducedMotion ? 0.01 : 0.6, ease: EASE },
  }),
});

const fadeIn = (reducedMotion: boolean) => ({
  hidden:  { opacity: 0 },
  visible: (d: number) => ({
    opacity: 1,
    transition: { delay: reducedMotion ? 0 : d, duration: reducedMotion ? 0.01 : 0.4, ease: EASE },
  }),
});

// ── HeroSection ────────────────────────────────────────────────────────

export default function HeroSection({
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
  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // ── Breathing loop (~2 s after entry completes) ────────────────────
  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation || shouldReduceMotion) return;
    const t = setTimeout(() => setBreathe(true), 2000);
    return () => clearTimeout(t);
  }, [startAnimation, shouldReduceMotion]);

  const animState: "hidden" | "visible" = startAnimation ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-24 md:py-32"
    >
      {/* ── Scroll-parallax content wrapper ── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex flex-col items-center text-center">

          {/* ── 0.00 s — Metadata row ── */}
          <motion.div
            className={`${meta} flex items-center gap-3 mb-10`}
            variants={fadeRise(shouldReduceMotion)}
            initial="hidden"
            animate={animState}
            custom={0.0}
          >
            <span>CS Major</span>
            <span className="text-hairline">·</span>
            <span>Univ. of Virginia</span>
            <span className="text-hairline">·</span>
            <span>Open to Offers</span>
            <span className="text-hairline">·</span>
            <span>Summer 2027</span>
          </motion.div>

          {/* ── 0.20 / 0.35 / 0.55 s — Name ── */}
          <motion.div
            className="select-none mb-12"
            animate={breathe ? { scale: [1, 1.004] } : { scale: 1 }}
            transition={
              breathe
                ? {
                    duration:   2.5,
                    repeat:     Infinity,
                    repeatType: "reverse",
                    ease:       "easeInOut",
                  }
                : {}
            }
          >
            <h1
              className="leading-none text-ink tracking-[0.06em]
                         text-[56px] sm:text-[76px] md:text-[100px] lg:text-[120px]"
              style={{ fontFamily: "var(--font-exmouth), serif" }}
              aria-label="Ashley Wu."
            >
              <motion.span
                className="inline-block"
                variants={nameRise(shouldReduceMotion)}
                initial="hidden"
                animate={animState}
                custom={0.2}
              >
                Ashley&nbsp;Wu
              </motion.span>
              <motion.span
                className="inline-block text-accent"
                variants={fadeIn(shouldReduceMotion)}
                initial="hidden"
                animate={animState}
                custom={0.45}
              >
                .
              </motion.span>
            </h1>
          </motion.div>

          {/* ── 0.70 s — Bio ── */}
          <motion.p
            className="text-sm leading-relaxed text-muted max-w-sm"
            variants={fadeRise(shouldReduceMotion)}
            initial="hidden"
            animate={animState}
            custom={0.7}
          >
            CS junior at the University of Virginia with a focus on systems and
            ML. I build tools that are fast, accessible, and honest about their
            complexity.
          </motion.p>

          {/* ── 0.85 s — Botanical ornament ── */}
          <motion.img
            src="/art/d59a30349f055bdb70822f24646ba973.jpg"
            alt=""
            aria-hidden
            className="w-16 opacity-30 my-4 select-none pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
            variants={fadeRise(shouldReduceMotion)}
            initial="hidden"
            animate={animState}
            custom={0.85}
          />

          {/* ── 0.90 s — CTA ── */}
          <motion.a
            href="#projects"
            className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
            variants={fadeRise(shouldReduceMotion)}
            initial="hidden"
            animate={animState}
            custom={0.9}
          >
            View my work ↓
          </motion.a>

        </div>
      </motion.div>
    </section>
  );
}
