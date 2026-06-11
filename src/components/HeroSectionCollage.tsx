"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Scattered image cards ──────────────────────────────────────────────
//
// Each photo sits in an absolute position with a fixed rotation.
// On mobile the collage collapses — images stack naturally below the name.

const PHOTOS = [
  {
    src:     "/art/c26cccab8b878003296b28596d909705.jpg",
    numeral: "I",
    alt:     "Study in Negative Space",
    // upper-right, tall portrait
    style: {
      top: "4%", right: "4%",
      width: 190, height: 240,
      rotate: "2.5deg",
    },
    delay: 0.3,
  },
  {
    src:     "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg",
    numeral: "II",
    alt:     "Lotus Field",
    // lower-left, landscape
    style: {
      bottom: "8%", left: "1%",
      width: 260, height: 190,
      rotate: "-3deg",
    },
    delay: 0.45,
  },
  {
    src:     "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg",
    numeral: "III",
    alt:     "White Petals",
    // mid-right, small, slight tilt
    style: {
      top: "52%", right: "12%",
      width: 150, height: 185,
      rotate: "1deg",
    },
    delay: 0.6,
  },
  {
    src:     "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg",
    numeral: "IV",
    alt:     "Emergence",
    // upper-left, peeking in
    style: {
      top: "6%", left: "3%",
      width: 165, height: 210,
      rotate: "-2deg",
    },
    delay: 0.5,
  },
] as const;

// ── HeroSectionCollage ─────────────────────────────────────────────────

export default function HeroSectionCollage({
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
  const contentY       = useTransform(scrollYProgress, [0, 1],   ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation || rm) return;
    const t = setTimeout(() => setBreathe(true), 2400);
    return () => clearTimeout(t);
  }, [startAnimation, rm]);

  const anim: "hidden" | "visible" = startAnimation ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative max-w-screen-xl mx-auto px-8"
      style={{ minHeight: "88vh" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ y: contentY, opacity: contentOpacity, minHeight: "88vh" }}
      >

        {/* ── Scattered photos — hidden on small screens ── */}
        <div className="hidden md:block">
          {PHOTOS.map((photo) => (
            <motion.div
              key={photo.numeral}
              className="absolute"
              style={{
                top:    (photo.style as Record<string,unknown>).top    as string ?? "auto",
                right:  (photo.style as Record<string,unknown>).right  as string ?? "auto",
                bottom: (photo.style as Record<string,unknown>).bottom as string ?? "auto",
                left:   (photo.style as Record<string,unknown>).left   as string ?? "auto",
                rotate: photo.style.rotate,
                width:  photo.style.width,
              }}
              initial={{ opacity: 0, y: rm ? 0 : 18 }}
              animate={anim === "visible" ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ delay: rm ? 0 : photo.delay, duration: rm ? 0.01 : 0.6, ease: EASE }}
            >
              {/* Photo */}
              <div
                className="relative overflow-hidden rounded-sm shadow-sm"
                style={{ height: photo.style.height }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>

              {/* Annotation below */}
              <div className={`${meta} mt-1.5 flex items-center gap-2`}>
                <span className="text-hairline">[ {photo.numeral} ]</span>
                <span className="truncate">{photo.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Central text block — absolutely centered ── */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center"
          style={{ minHeight: "88vh" }}>

          {/* Metadata */}
          <motion.div
            className={`${meta} flex items-center gap-3 mb-10`}
            initial={{ opacity: 0, y: rm ? 0 : 12 }}
            animate={anim === "visible" ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ delay: rm ? 0 : 0.1, duration: 0.5, ease: EASE }}
          >
            <span>CS Major</span>
            <span className="text-hairline">·</span>
            <span>Univ. of Virginia</span>
            <span className="text-hairline">·</span>
            <span>Open to Offers</span>
            <span className="text-hairline">·</span>
            <span>Summer 2027</span>
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
              className="leading-none text-ink tracking-[0.06em]
                         text-[56px] sm:text-[76px] md:text-[100px] lg:text-[120px]"
              style={{ fontFamily: "var(--font-exmouth), serif" }}
              aria-label="Ashley Wu."
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: rm ? 0 : 28 }}
                animate={anim === "visible" ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ delay: rm ? 0 : 0.2, duration: 0.65, ease: EASE }}
              >
                Ashley&nbsp;Wu
              </motion.span>
              <motion.span
                className="inline-block text-accent"
                initial={{ opacity: 0 }}
                animate={anim === "visible" ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: rm ? 0 : 0.48, duration: 0.4, ease: EASE }}
              >
                .
              </motion.span>
            </h1>
          </motion.div>

          {/* Botanical ornament */}
          <motion.img
            src="/art/d59a30349f055bdb70822f24646ba973.jpg"
            alt=""
            aria-hidden
            className="w-14 opacity-25 mb-6 select-none pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
            initial={{ opacity: 0 }}
            animate={anim === "visible" ? { opacity: 0.25 } : { opacity: 0 }}
            transition={{ delay: rm ? 0 : 0.7, duration: 0.5, ease: EASE }}
          />

          {/* Bio */}
          <motion.p
            className="text-sm leading-relaxed text-muted max-w-sm mb-8"
            initial={{ opacity: 0, y: rm ? 0 : 14 }}
            animate={anim === "visible" ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ delay: rm ? 0 : 0.75, duration: 0.5, ease: EASE }}
          >
            CS junior at the University of Virginia with a focus on systems and
            ML. I build tools that are fast, accessible, and honest about their
            complexity.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#projects"
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
            initial={{ opacity: 0, y: rm ? 0 : 12 }}
            animate={anim === "visible" ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ delay: rm ? 0 : 0.9, duration: 0.5, ease: EASE }}
          >
            View my work ↓
          </motion.a>
        </div>

      </motion.div>
    </section>
  );
}
