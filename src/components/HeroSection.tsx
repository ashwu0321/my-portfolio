"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticLink from "./MagneticLink";

// ── Constants ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const meta =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

const ctaClass =
  "font-serif italic font-light text-[22px] text-ink border-b border-ink pb-0.5 " +
  "hover:text-accent hover:border-accent transition-colors duration-200";

// ── Variants ───────────────────────────────────────────────────────────
//
// Every animated element accepts a `custom` prop (number = delay in s).
// Setting initial="hidden" animate={animState} custom={d} on a motion
// element keeps it in-layout (opacity:0, transform) until startAnimation
// flips animState to "visible".

const fadeRise = {
  hidden:  { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.5, ease: EASE },
  }),
};

const nameRise = {
  hidden:  { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.6, ease: EASE },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (d: number) => ({
    opacity: 1,
    transition: { delay: d, duration: 0.4, ease: EASE },
  }),
};

const drawH = {
  hidden:  { scaleX: 0 },
  visible: (d: number) => ({
    scaleX: 1,
    transition: { delay: d, duration: 0.5, ease: EASE },
  }),
};

const drawV = {
  hidden:  { scaleY: 0 },
  visible: (d: number) => ({
    scaleY: 1,
    transition: { delay: d, duration: 0.5, ease: EASE },
  }),
};

// ── useCountUp ─────────────────────────────────────────────────────────
//
// Counts 0 → target over durationMs, starting only after `start` is true
// and an initial delayS-second pause. Uses a 16 ms polling interval (≈ 60
// fps) driven by a plain setInterval — no animation libraries needed.

function useCountUp(
  target: number,
  durationMs: number,
  start: boolean,
  delayS: number,
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      const t0 = performance.now();
      intervalId = setInterval(() => {
        const p = Math.min((performance.now() - t0) / durationMs, 1);
        setCount(Math.round(p * target));
        if (p >= 1) clearInterval(intervalId);
      }, 16);
    }, delayS * 1000);

    return () => {
      clearTimeout(timeoutId);
      // intervalId may be undefined if timeout hasn't fired yet
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [start, target, durationMs, delayS]);

  return count;
}

// ── StatValue ──────────────────────────────────────────────────────────
//
// Isolated sub-component so useCountUp is called at the top level of its
// own render tree — no conditional-hook issues.

function StatValue({
  target,
  padLen,
  accent,
  delayCount,
  delayFade,
  start,
  animState,
}: {
  target:     number;
  padLen:     number;
  accent:     boolean;
  delayCount: number;
  delayFade:  number;
  start:      boolean;
  animState:  "hidden" | "visible";
}) {
  const count = useCountUp(target, 800, start, delayCount);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate={animState}
      custom={delayFade}
    >
      <p
        className={`font-serif italic font-light leading-none
                    text-[52px] md:text-[64px]
                    ${accent ? "text-accent" : "text-ink"}`}
      >
        {String(count).padStart(padLen, "0")}
      </p>
    </motion.div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────

const STATS = [
  { target: 4,  padLen: 2, label: "Projects",     accent: false, delayCount: 1.35, delayFade: 1.35 },
  { target: 12, padLen: 2, label: "Technologies", accent: false, delayCount: 1.45, delayFade: 1.45 },
  { target: 3,  padLen: 2, label: "Years Coding", accent: true,  delayCount: 1.55, delayFade: 1.55 },
] as const;

// ── HeroSection ────────────────────────────────────────────────────────

export default function HeroSection({
  startAnimation,
}: {
  startAnimation: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // ── Scroll parallax ────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // ── Breathing loop — starts ~2 s after entry animation fires ───────
  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation) return;
    const t = setTimeout(() => setBreathe(true), 2000);
    return () => clearTimeout(t);
  }, [startAnimation]);

  const animState: "hidden" | "visible" = startAnimation ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-24 md:py-32"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex flex-col items-center text-center">

          {/* ── 0.00 s — Metadata ── */}
          <motion.div
            className={`${meta} flex items-center gap-3 mb-10`}
            variants={fadeRise}
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

          {/* ── 0.20 / 0.35 / 0.55 s — Name (Ashley · Wu · .) ── */}
          <motion.div
            className="select-none mb-10"
            // Breathing loop: very subtle scale pulse once the entry lands
            animate={breathe ? { scale: [1, 1.004] } : { scale: 1 }}
            transition={
              breathe
                ? {
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
                : {}
            }
          >
            <h1
              className="font-normal leading-none text-ink
                         text-[52px] sm:text-[68px] md:text-[96px] lg:text-[120px]"
              style={{ fontFamily: "var(--font-calista), serif" }}
              aria-label="Ashley Wu."
            >
              {/* "Ashley" — slides up on its own line */}
              <motion.span
                className="block"
                variants={nameRise}
                initial="hidden"
                animate={animState}
                custom={0.2}
              >
                Ashley
              </motion.span>

              {/* "Wu" + "." inline — Wu at 0.35 s, accent period at 0.55 s */}
              <span className="inline-flex items-baseline">
                <motion.span
                  className="inline-block"
                  variants={nameRise}
                  initial="hidden"
                  animate={animState}
                  custom={0.35}
                >
                  Wu
                </motion.span>
                <motion.span
                  className="inline-block text-accent"
                  variants={fadeIn}
                  initial="hidden"
                  animate={animState}
                  custom={0.55}
                >
                  .
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* ── 0.70 s — Bio ── */}
          <motion.p
            className="text-sm leading-relaxed text-muted max-w-sm mb-14"
            variants={fadeRise}
            initial="hidden"
            animate={animState}
            custom={0.7}
          >
            CS junior at the University of Virginia with a focus on systems and
            ML. I build tools that are fast, accessible, and honest about their
            complexity.
          </motion.p>

          {/* ── Bottom block: CTAs | vertical divider | stats ── */}
          <div className="w-full max-w-2xl flex flex-col items-center">

            <div className="flex items-center gap-12 md:gap-16">

              {/* ── 0.95 / 1.05 s — CTAs ── */}
              <div className="flex flex-col items-start gap-4">
                <motion.div
                  variants={fadeRise}
                  initial="hidden"
                  animate={animState}
                  custom={0.95}
                >
                  <MagneticLink>
                    <a href="#projects" className={ctaClass}>
                      View My Work
                    </a>
                  </MagneticLink>
                </motion.div>

                <motion.div
                  variants={fadeRise}
                  initial="hidden"
                  animate={animState}
                  custom={1.05}
                >
                  <MagneticLink>
                    <a href="/resume.pdf" download className={ctaClass}>
                      Download Résumé
                    </a>
                  </MagneticLink>
                </motion.div>
              </div>

              {/* ── 1.25 s — Vertical divider (draws top → bottom) ── */}
              <motion.div
                className="w-px self-stretch bg-hairline"
                variants={drawV}
                initial="hidden"
                animate={animState}
                custom={1.25}
                style={{ originY: 0 }}
              />

              {/* ── Stats column ── */}
              <div>
                {/* 1.35 / 1.45 / 1.55 s — Stat values (count-up) */}
                <div className="flex gap-8 md:gap-10">
                  {STATS.map((stat) => (
                    <StatValue
                      key={stat.label}
                      target={stat.target}
                      padLen={stat.padLen}
                      accent={stat.accent}
                      delayCount={stat.delayCount}
                      delayFade={stat.delayFade}
                      start={startAnimation}
                      animState={animState}
                    />
                  ))}
                </div>

                {/* ── 1.65 s — Stat labels (all three together) ── */}
                <motion.div
                  className="flex gap-8 md:gap-10 mt-3"
                  variants={fadeIn}
                  initial="hidden"
                  animate={animState}
                  custom={1.65}
                >
                  {STATS.map(({ label }) => (
                    <p key={label} className={`${meta} text-center flex-1`}>
                      {label}
                    </p>
                  ))}
                </motion.div>
              </div>

            </div>

            {/* ── 1.80 s — Bottom hairline (draws left → right) ── */}
            <motion.div
              className="h-px w-full bg-hairline mt-8"
              variants={drawH}
              initial="hidden"
              animate={animState}
              custom={1.8}
              style={{ originX: 0 }}
            />

          </div>
        </div>
      </motion.div>
    </section>
  );
}
