"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ── Animation helpers ─────────────────────────────────────────────────

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay: number, y = 16, duration = 0.6) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease },
  } as const;
}

// ── Letter-by-letter name ─────────────────────────────────────────────
// "Ashley" enters small + quick · "Wu" enters large + deliberate

function AnimatedName() {
  const lines = [
    {
      text: "Ashley",
      startDelay: 0.1,
      stagger: 0.04,
      className: "text-[40px] md:text-[54px]",
    },
    {
      text: "Wu",
      startDelay: 0.36,
      stagger: 0.08,
      className: "text-[76px] md:text-[100px]",
    },
  ] as const;

  return (
    <h1
      className="font-serif italic font-light leading-[0.88] text-ink mb-14 select-none"
      aria-label="Ashley Wu"
    >
      {lines.map(({ text, startDelay, stagger, className }) => (
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
  "font-serif italic font-light text-[18px] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200";

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Component ─────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="max-w-screen-xl mx-auto px-8 py-24 md:py-32"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <div className="flex gap-16">

          {/* ── Left: 160px index column ── */}
          <motion.aside
            {...fadeUp(0, 10, 0.5)}
            className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-4"
          >
            <div className="flex flex-col gap-1.5">
              <span className={meta}>CS Major</span>
              <span className={meta}>Univ. of Virginia</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={meta}>Open to Offers</span>
              <span className={meta}>Summer 2027</span>
            </div>
          </motion.aside>

          {/* ── Right: main content ── */}
          <div className="flex-1 min-w-0">

            {/* Name — letter by letter, two-line editorial scale */}
            <AnimatedName />

            {/* Stat row — hairlines draw, numbers count up */}
            <div className="mb-14">
              <motion.div
                className="h-px bg-hairline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.65, ease }}
                style={{ originX: 0 }}
              />

              <motion.div {...fadeUp(0.8, 8, 0.5)} className="py-5 flex gap-12">
                {STATS.map(({ value, label }, i) => (
                  <div key={label}>
                    <p className="font-serif italic font-light text-[36px] leading-none text-ink">
                      <StatCounter value={value} delay={0.9 + i * 0.05} />
                    </p>
                    <p className={`${meta} mt-2`}>{label}</p>
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

            {/* CTAs */}
            <motion.div
              {...fadeUp(1.05, 8, 0.4)}
              className="flex items-center gap-10"
            >
              <a href="#projects" className={ctaClass}>
                View My Work
              </a>
              <a href="/resume.pdf" download className={ctaClass}>
                Download Résumé
              </a>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
