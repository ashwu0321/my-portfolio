"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion, useScroll, useTransform, useReducedMotion,
  type MotionValue,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Photo definitions ──────────────────────────────────────────────────

type Photo = {
  src:       string;
  numeral:   string;
  alt:       string;
  style: {
    top?:    string;
    right?:  string;
    bottom?: string;
    left?:   string;
    width:   number;
    height:  number;
    rotate:  string;
  };
  parallaxY: string; // final y at scrollYProgress = 1
  delay:     number; // entrance delay in seconds
};

// Photo delays: 3.4s, 3.6s, 3.8s, 4.0s (200ms stagger, after text sequence settles)
const PHOTOS: Photo[] = [
  {
    src:      "/art/c26cccab8b878003296b28596d909705.jpg",
    numeral:  "I",
    alt:      "Study in Negative Space",
    style:    { top: "4%", right: "4%", width: 190, height: 240, rotate: "2.5deg" },
    parallaxY: "-12%",
    delay:    3.4,
  },
  {
    src:      "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg",
    numeral:  "II",
    alt:      "Lotus Field",
    style:    { bottom: "8%", left: "1%", width: 260, height: 190, rotate: "-3deg" },
    parallaxY: "-18%",
    delay:    3.6,
  },
  {
    src:      "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg",
    numeral:  "III",
    alt:      "White Petals",
    style:    { top: "52%", right: "12%", width: 150, height: 185, rotate: "1deg" },
    parallaxY: "-8%",
    delay:    3.8,
  },
  {
    src:      "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg",
    numeral:  "IV",
    alt:      "Emergence",
    style:    { top: "6%", left: "3%", width: 165, height: 210, rotate: "-2deg" },
    parallaxY: "-15%",
    delay:    4.0,
  },
];

// ── PhotoCard ──────────────────────────────────────────────────────────

function PhotoCard({
  photo,
  scrollYProgress,
  photosOpacity,
  startAnimation,
  rm,
}: {
  photo:           Photo;
  scrollYProgress: MotionValue<number>;
  photosOpacity:   MotionValue<number>;
  startAnimation:  boolean;
  rm:              boolean;
}) {
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", photo.parallaxY]);
  const { style } = photo;

  return (
    // Outer: scroll-driven position + fade
    <motion.div
      className="absolute"
      style={{
        top:    style.top    ?? "auto",
        right:  style.right  ?? "auto",
        bottom: style.bottom ?? "auto",
        left:   style.left   ?? "auto",
        width:  style.width,
        rotate: style.rotate,
        y:       rm ? "0%" : parallaxY,
        opacity: rm ? 1    : photosOpacity,
      }}
    >
      {/* Inner: entrance — opacity composes multiplicatively with outer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px) saturate(0.2)" }}
        animate={
          startAnimation
            ? { opacity: 1, scale: 1, filter: "blur(0px) saturate(1)" }
            : {}
        }
        transition={{
          delay:    rm ? 0 : photo.delay,
          duration: rm ? 0.01 : 1.2,
          ease:     EASE,
        }}
      >
        <div
          className="relative overflow-hidden rounded-sm shadow-sm"
          style={{ height: style.height }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="260px"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <div className={`${meta} mt-1.5 flex items-center gap-2`}>
          <span className="text-hairline">[ {photo.numeral} ]</span>
          <span className="truncate">{photo.alt}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

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

  // Text: gentle drift + fade (longer window, softer dissolve)
  const contentY       = useTransform(scrollYProgress, [0, 1],    ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Photos: dissolve faster than text — paper re-absorbs them first
  const photosOpacity  = useTransform(scrollYProgress, [0, 0.40], [1, 0]);

  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    if (!startAnimation || rm) return;
    const t = setTimeout(() => setBreathe(true), 6000);
    return () => clearTimeout(t);
  }, [startAnimation, rm]);

  const visible = startAnimation;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative max-w-screen-xl mx-auto px-8"
      style={{ minHeight: "88vh" }}
    >

      {/* ── Scattered photos — own scroll opacity, independent of text ── */}
      <div className="hidden md:block pointer-events-none">
        {PHOTOS.map((photo) => (
          <PhotoCard
            key={photo.numeral}
            photo={photo}
            scrollYProgress={scrollYProgress}
            photosOpacity={photosOpacity}
            startAnimation={startAnimation}
            rm={rm}
          />
        ))}
      </div>

      {/* ── Central text block — its own parallax + opacity ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ y: contentY, opacity: contentOpacity, minHeight: "88vh" }}
      >

        {/* 2. 600ms — Metadata row: fade only, no y movement */}
        <motion.div
          className={`${meta} flex items-center gap-3 mb-10`}
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: rm ? 0 : 0.6, duration: rm ? 0.01 : 0.9, ease: EASE }}
        >
          <span>CS Major</span>
          <span className="text-hairline">·</span>
          <span>Univ. of Virginia</span>
          <span className="text-hairline">·</span>
          <span>Open to Offers</span>
          <span className="text-hairline">·</span>
          <span>Summer 2027</span>
        </motion.div>

        {/* 3. 400ms — Name: y movement + opacity (primary event, most motion) */}
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
            className="leading-none tracking-[-0.02em] italic font-light w-full"
            style={{ fontSize: "clamp(2.75rem, 9vw, 12rem)" }}
            aria-label="Ashley Wu."
          >
            <motion.span
              className="inline-block text-ink"
              initial={{ opacity: 0, y: rm ? 0 : 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: rm ? 0 : 20 }}
              transition={{ delay: rm ? 0 : 1.2, duration: rm ? 0.01 : 1.4, ease: EASE }}
            >
              Ashley&nbsp;Wu
            </motion.span>
            <motion.span
              className="inline-block text-accent"
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: rm ? 0 : 1.6, duration: rm ? 0.01 : 0.8, ease: EASE }}
            >
              .
            </motion.span>
          </h1>
        </motion.div>

        {/* Botanical ornament — fade only, between name and bio */}
        <motion.img
          src="/art/d59a30349f055bdb70822f24646ba973.jpg"
          alt=""
          aria-hidden
          className="w-14 opacity-25 mb-6 select-none pointer-events-none"
          style={{ mixBlendMode: "multiply" }}
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 0.25 } : { opacity: 0 }}
          transition={{ delay: rm ? 0 : 2.2, duration: rm ? 0.01 : 0.9, ease: EASE }}
        />

        {/* 4. 2600ms — Bio: fade only, no y movement */}
        <motion.p
          className="text-sm leading-relaxed text-muted max-w-sm mb-8"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: rm ? 0 : 2.6, duration: rm ? 0.01 : 0.9, ease: EASE }}
        >
          CS junior at the University of Virginia with a focus on systems and
          ML. I build tools that are fast, accessible, and honest about their
          complexity.
        </motion.p>

        {/* 5. 3000ms — CTA: fade only */}
        <motion.a
          href="#projects"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: rm ? 0 : 3.0, duration: rm ? 0.01 : 0.8, ease: EASE }}
        >
          View my work ↓
        </motion.a>

      </motion.div>
    </section>
  );
}
