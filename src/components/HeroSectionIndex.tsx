"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// ── Constants ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Variants ───────────────────────────────────────────────────────────

const fadeRise = (rm: boolean) => ({
  hidden:  { opacity: 0, y: rm ? 0 : 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { delay: rm ? 0 : d, duration: rm ? 0.01 : 0.5, ease: EASE },
  }),
});

const nameRise = (rm: boolean) => ({
  hidden:  { opacity: 0, y: rm ? 0 : 28 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { delay: rm ? 0 : d, duration: rm ? 0.01 : 0.65, ease: EASE },
  }),
});

const fadeIn = (rm: boolean) => ({
  hidden:  { opacity: 0 },
  visible: (d: number) => ({
    opacity: 1,
    transition: { delay: rm ? 0 : d, duration: rm ? 0.01 : 0.4, ease: EASE },
  }),
});

// ── HeroSectionIndex ───────────────────────────────────────────────────
//
// Asymmetric layout: narrow left column holds a large faint section index
// ("01") that anchors the vertical rhythm carried into subsequent sections.
// Wide right column holds name, metadata, bio, and CTA.

export default function HeroSectionIndex({
  startAnimation,
}: {
  startAnimation: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6],  [1, 0]);

  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation || rm) return;
    const t = setTimeout(() => setBreathe(true), 2200);
    return () => clearTimeout(t);
  }, [startAnimation, rm]);

  const anim: "hidden" | "visible" = startAnimation ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-20 md:py-28"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex gap-8 md:gap-12">

          {/* ── Left index column (~10%) ── */}
          <div className="hidden md:flex flex-col justify-between pt-1" style={{ width: "8%" }}>
            {/* Large faint numeral */}
            <motion.span
              className="font-serif font-light leading-none select-none text-hairline"
              style={{ fontSize: "clamp(48px, 6vw, 88px)" }}
              variants={fadeIn(rm)}
              initial="hidden"
              animate={anim}
              custom={0.0}
            >
              01
            </motion.span>
          </div>

          {/* ── Right content column (~90%) ── */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Top rule with metadata */}
            <motion.div
              className={`${meta} flex items-center justify-between mb-10 pb-4 border-b border-hairline`}
              variants={fadeRise(rm)}
              initial="hidden"
              animate={anim}
              custom={0.05}
            >
              <span>CS Major · Univ. of Virginia</span>
              <span>Open to Offers · Summer 2027</span>
            </motion.div>

            {/* Name */}
            <motion.div
              className="select-none mb-10"
              animate={breathe ? { scale: [1, 1.003] } : { scale: 1 }}
              transition={
                breathe
                  ? { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                  : {}
              }
            >
              <h1
                className="leading-[0.9] text-ink"
                style={{ fontFamily: "var(--font-exmouth), serif" }}
                aria-label="Ashley Wu."
              >
                <motion.span
                  className="block text-[clamp(64px,9.5vw,140px)]"
                  variants={nameRise(rm)}
                  initial="hidden"
                  animate={anim}
                  custom={0.2}
                >
                  Ashley
                </motion.span>
                <motion.span
                  className="block text-[clamp(64px,9.5vw,140px)]"
                  variants={nameRise(rm)}
                  initial="hidden"
                  animate={anim}
                  custom={0.32}
                >
                  Wu
                  <motion.span
                    className="text-accent"
                    variants={fadeIn(rm)}
                    initial="hidden"
                    animate={anim}
                    custom={0.52}
                  >
                    .
                  </motion.span>
                </motion.span>
              </h1>
            </motion.div>

            {/* Bio + CTA — right-aligned to mirror the index column rhythm */}
            <div className="flex items-end justify-between gap-8">
              <motion.p
                className="text-sm leading-relaxed text-muted max-w-xs"
                variants={fadeRise(rm)}
                initial="hidden"
                animate={anim}
                custom={0.65}
              >
                CS junior at the University of Virginia with a focus on systems
                and ML. I build tools that are fast, accessible, and honest about
                their complexity.
              </motion.p>

              <motion.a
                href="#projects"
                className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
                variants={fadeRise(rm)}
                initial="hidden"
                animate={anim}
                custom={0.8}
              >
                View my work ↓
              </motion.a>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
