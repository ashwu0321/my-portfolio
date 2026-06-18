"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Placeholder from "@/components/ui/Placeholder";

// ── Types ────────────────────────────────────────────────────────────

export type Artwork = {
  numeral: string;
  title: string;
  medium?: string;
  src?: string;
};

// ── Shared ───────────────────────────────────────────────────────────

const meta  = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HEIGHTS = ["h-80", "h-52", "h-52", "h-80"] as const;
const DELAYS  = [0, 0.14, 0.08, 0.22] as const;

// Accent bleed colors per piece — soft risograph spot colors
const BLEEDS = [
  "rgba(204,51,51,0.07)",
  "rgba(90,80,60,0.06)",
  "rgba(204,51,51,0.05)",
  "rgba(90,80,60,0.07)",
] as const;

// ── Reveal variants per piece ─────────────────────────────────────────
// Each piece has a distinct entrance so the grid feels handmade, not templated.
//   0 — bottom curtain lift  (classic, anchors the grid)
//   1 — right-to-left horizontal curtain
//   2 — photo-placed-on-table: rotate + scale drift
//   3 — left-to-right horizontal curtain
type RevealVariant = 0 | 1 | 2 | 3;
const REVEALS: RevealVariant[] = [0, 1, 2, 3];

// ── Reveal initial/animate per variant ───────────────────────────────
function revealInitial(variant: RevealVariant) {
  if (variant === 0) return { clipPath: "inset(0 0 100% 0)", scale: 1.04 };
  if (variant === 1) return { clipPath: "inset(0 0% 0 100%)", scale: 1.02 };
  if (variant === 2) return { clipPath: "inset(0 0 0 0)", rotate: -6, scale: 0.88, opacity: 0 };
  return              { clipPath: "inset(0 100% 0 0%)", scale: 1.02 };
}
function revealAnimate(variant: RevealVariant) {
  if (variant === 0) return { clipPath: "inset(0 0 0% 0)",   scale: 1 };
  if (variant === 1) return { clipPath: "inset(0 0% 0 0%)",  scale: 1 };
  if (variant === 2) return { clipPath: "inset(0 0 0 0)",    rotate: 0, scale: 1, opacity: 1 };
  return              { clipPath: "inset(0 0% 0 0%)",  scale: 1 };
}

// ── Registration mark — analog print motif ────────────────────────────

function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 text-hairline ${className}`}
      width="13" height="13" viewBox="0 0 13 13"
      fill="none" stroke="currentColor" strokeWidth="0.7"
      aria-hidden
    >
      <line x1="6.5" y1="0"   x2="6.5" y2="13" />
      <line x1="0"   y1="6.5" x2="13"  y2="6.5" />
      <circle cx="6.5" cy="6.5" r="2.8" />
    </svg>
  );
}

// ── Piece ─────────────────────────────────────────────────────────────

function Piece({
  artwork,
  height,
  delay,
  bleed,
  inView,
  rm,
  reveal = 0,
}: {
  artwork: Artwork;
  height:  string;
  delay:   number;
  bleed:   string;
  inView:  boolean;
  rm:      boolean;
  reveal?: RevealVariant;
}) {
  return (
    <figure className="relative flex flex-col gap-3">

      {/* Risograph bleed — radial gradient halo (no blur filter cost) */}
      {!rm && (
        <div
          className="absolute -inset-4 pointer-events-none rounded"
          style={{
            background:  `radial-gradient(ellipse at center, ${bleed} 0%, transparent 70%)`,
            opacity:     inView ? 1 : 0,
            transition:  `opacity 1.4s ${delay + 0.6}s ease`,
          }}
        />
      )}

      {/* Per-piece reveal — each artwork has its own entrance character */}
      <motion.div
        className={`${height} overflow-hidden rounded`}
        initial={rm ? {} : revealInitial(reveal)}
        animate={rm ? {} : inView ? revealAnimate(reveal) : revealInitial(reveal)}
        transition={rm ? {} : { duration: reveal === 2 ? 1.1 : 1.0, delay, ease: EASE }}
      >
        <div className="w-full h-full">
          {artwork.src ? (
            <Image
              src={artwork.src}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <Placeholder variant="folio" label={artwork.title} />
          )}
        </div>
      </motion.div>

      {/* Caption — stamps in after image finishes developing */}
      <motion.figcaption
        className="flex items-baseline gap-3"
        initial={rm ? {} : { opacity: 0, y: 4 }}
        animate={rm ? {} : {
          opacity: inView ? 1 : 0,
          y:       inView ? 0 : 4,
        }}
        transition={rm ? {} : { duration: 0.45, delay: delay + 1.4, ease: EASE }}
      >
        <span className={meta}>{artwork.numeral}</span>
        <span className={`${meta} text-ink`}>{artwork.title}</span>
        {artwork.medium && (
          <span className={`${meta} ml-auto`}>{artwork.medium}</span>
        )}
      </motion.figcaption>
    </figure>
  );
}

// ── Component ─────────────────────────────────────────────────────────

export default function Art({ artworks, bio }: { artworks: Artwork[]; bio?: string }) {
  const rm = !!useReducedMotion();
  const [i1, i2, i3, i4] = artworks;

  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  // ── Two-column parallax: right column scrolls ~60px faster than left ──
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });
  const colLeftY  = useTransform(scrollYProgress, [0, 1], [0,   -30], { clamp: false });
  const colRightY = useTransform(scrollYProgress, [0, 1], [60,  -90], { clamp: false });

  return (
    <section id="about" ref={sectionRef}>

      {/* ── § 02 section marker ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="flex items-center gap-4 py-12">
          <span className={meta}>§ 02</span>
          <RegMark />
          <motion.div
            className="flex-1 h-px bg-hairline origin-left"
            initial={rm ? {} : { scaleX: 0 }}
            animate={rm ? {} : inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={rm ? {} : { duration: 1.1, ease: EASE }}
          />
          <span className={`${meta} opacity-0 select-none`} aria-hidden>§ 02</span>
        </div>
      </div>

      {/* ── Section body ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8 pb-32">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 pb-5 border-b border-hairline">
          <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink text-[48px] md:text-[64px]">
            <span className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={rm ? {} : { y: "105%" }}
                animate={rm ? {} : { y: inView ? "0%" : "105%" }}
                transition={rm ? {} : { duration: 0.85, ease: EASE }}
              >
                About
              </motion.span>
            </span>
          </h2>
          <motion.span
            className={`${meta} overflow-hidden pb-1`}
            initial={rm ? {} : { clipPath: "inset(0 0 100% 0)" }}
            animate={rm ? {} : inView ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
            transition={rm ? {} : { duration: 0.85, delay: 0.15, ease: EASE }}
          >
            Photography I–IV
          </motion.span>
        </div>

        <div className="flex gap-16">

          {/* ── Left: bio column ──────────────────────────────────── */}
          <motion.aside
            className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1"
            initial={rm ? {} : { opacity: 0 }}
            animate={rm ? {} : { opacity: inView ? 1 : 0 }}
            transition={rm ? {} : { duration: 0.6, delay: 0.5, ease: EASE }}
          >
            {bio && (
              <p className="text-sm leading-relaxed text-ink max-w-[65ch]">{bio}</p>
            )}
          </motion.aside>

          {/* ── Photography: two parallax columns ─────────────────── */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div className="flex flex-col gap-8" style={rm ? {} : { y: colLeftY }}>
              {i1 && <Piece artwork={i1} height={HEIGHTS[0]} delay={DELAYS[0]} bleed={BLEEDS[0]} inView={inView} rm={rm} reveal={REVEALS[0]} />}
              {i3 && <Piece artwork={i3} height={HEIGHTS[2]} delay={DELAYS[2]} bleed={BLEEDS[2]} inView={inView} rm={rm} reveal={REVEALS[2]} />}
            </motion.div>
            <motion.div className="flex flex-col gap-8 md:mt-16" style={rm ? {} : { y: colRightY }}>
              {i2 && <Piece artwork={i2} height={HEIGHTS[1]} delay={DELAYS[1]} bleed={BLEEDS[1]} inView={inView} rm={rm} reveal={REVEALS[1]} />}
              {i4 && <Piece artwork={i4} height={HEIGHTS[3]} delay={DELAYS[3]} bleed={BLEEDS[3]} inView={inView} rm={rm} reveal={REVEALS[3]} />}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
