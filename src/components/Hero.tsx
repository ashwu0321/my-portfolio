"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticLink from "./MagneticLink";

// ── Animation helpers ─────────────────────────────────────────────────

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay: number, y = 16, duration = 0.6) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease },
  } as const;
}

// ── Full-name headline ────────────────────────────────────────────────
// Single centered line — letters stagger in left to right.
// After landing, a barely-perceptible breathing loop begins.

const NAME = "Ashley Wu";

function AnimatedName() {
  return (
    <motion.div
      className="select-none"
      animate={{ scale: [1, 1.004] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: 1.2,
      }}
    >
      <h1
        className="font-normal leading-none text-ink mb-14
                   text-[52px] sm:text-[68px] md:text-[96px] lg:text-[120px]"
        style={{ fontFamily: "var(--font-calista), serif" }}
        aria-label={NAME}
      >
        {NAME.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08 + i * 0.045,
              duration: 0.55,
              ease,
            }}
          >
            {/* render the space as a non-breaking space so it keeps its width */}
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  );
}

// ── Stat counter ──────────────────────────────────────────────────────

function StatCounter({ value, delay }: { value: string; delay: number }) {
  const digits = value.match(/^\d+/)?.[0] ?? "0";
  const suffix = value.slice(digits.length);
  const target = parseInt(digits, 10);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let raf: number;
    const t = setTimeout(() => {
      const start = performance.now();
      const dur = 900;
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - (1 - p) ** 3;
        setCurrent(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, delay]);

  const display =
    digits.length > 1 ? String(current).padStart(digits.length, "0") : String(current);

  return <>{display}{suffix}</>;
}

// ── Data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "04", label: "Projects" },
  { value: "12", label: "Technologies" },
  { value: "3+", label: "Years Coding" },
] as const;

const ctaClass =
  "font-serif italic font-light text-[22px] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200";

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Component ─────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-24 md:py-32"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex flex-col items-center text-center">

          {/* ── Metadata row ── */}
          <motion.div
            {...fadeUp(0, 10, 0.5)}
            className={`${meta} flex items-center gap-3 mb-10`}
          >
            <span>CS Major</span>
            <span className="text-hairline">·</span>
            <span>Univ. of Virginia</span>
            <span className="text-hairline">·</span>
            <span>Open to Offers</span>
            <span className="text-hairline">·</span>
            <span>Summer 2027</span>
          </motion.div>

          {/* ── Name — letter by letter, two-line editorial scale ── */}
          <AnimatedName />

          {/* ── Stat row — hairlines draw, numbers count up ── */}
          <div className="mb-14 w-full">
            <motion.div
              className="h-px bg-hairline"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.65, ease }}
              style={{ originX: 0 }}
            />

            <motion.div {...fadeUp(0.8, 8, 0.5)} className="py-5 flex justify-center gap-12">
              {STATS.map(({ value, label }, i) => (
                <div key={label}>
                  <p className="font-serif italic font-light text-[52px] md:text-[64px] leading-none text-ink">
                    <StatCounter value={value} delay={0.9 + i * 0.05} />
                  </p>
                  <p className={`${meta} mt-3`}>{label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="h-px bg-hairline"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.75, duration: 0.65, ease }}
              style={{ originX: 0 }}
            />
          </div>

          {/* ── CTAs ── */}
          <motion.div
            {...fadeUp(1.05, 8, 0.4)}
            className="flex items-center gap-10"
          >
            <MagneticLink>
              <a href="#projects" className={ctaClass}>
                View My Work
              </a>
            </MagneticLink>
            <MagneticLink>
              <a href="/resume.pdf" download className={ctaClass}>
                Download Résumé
              </a>
            </MagneticLink>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
