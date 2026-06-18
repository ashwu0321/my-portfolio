"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Placeholder from "@/components/ui/Placeholder";
export type LifePhoto = { src?: string; alt: string; caption?: string };

// ── Constants ─────────────────────────────────────────────────────────

const meta  = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`shrink-0 text-hairline ${className}`} width="13" height="13"
      viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="0.7" aria-hidden>
      <line x1="6.5" y1="0"   x2="6.5" y2="13" />
      <line x1="0"   y1="6.5" x2="13"  y2="6.5" />
      <circle cx="6.5" cy="6.5" r="2.8" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function PhotoCard({
  photo,
  sizes,
  aspect = "aspect-[4/3]",
  delay = 0,
  rm,
}: {
  photo: LifePhoto;
  sizes: string;
  aspect?: string;
  delay?: number;
  rm: boolean;
}) {
  return (
    <motion.figure
      className="flex flex-col gap-0"
      initial={rm ? {} : { opacity: 0, y: 16 }}
      whileInView={rm ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={rm ? {} : { duration: 0.7, delay, ease: EASE }}
    >
      {/* Mounted print */}
      <div className="bg-white p-3 shadow-[0_4px_24px_rgba(26,24,20,0.10),0_1px_6px_rgba(26,24,20,0.06)]">
        <div className={`relative w-full ${aspect} overflow-hidden`}>
          {photo.src
            ? <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes={sizes} />
            : <Placeholder variant="folio" label={photo.alt} />
          }
        </div>
      </div>
      {/* Label */}
      <figcaption className="pt-2">
        <span className={`${meta} block mb-1`}>{photo.alt}</span>
      </figcaption>
    </motion.figure>
  );
}

// ── Component ─────────────────────────────────────────────────────────

export default function LifeAperture({ photos }: { photos: LifePhoto[] }) {
  const rm = !!useReducedMotion();
  const [featured, second, third, fourth] = photos;

  return (
    <section id="life" aria-label="Outside the studio" className="bg-paper">

      {/* § 04 marker */}
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="flex items-center gap-4 py-12">
          <span className={meta}>§ 04</span>
          <RegMark />
          <motion.div
            className="flex-1 h-px bg-hairline origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <span className={`${meta} opacity-0 select-none`} aria-hidden>§ 04</span>
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="max-w-screen-xl mx-auto px-8 mb-12">
        <div className="flex items-end justify-between pb-5 border-b border-hairline">
          <motion.h2
            className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink text-[48px] md:text-[64px]"
            initial={rm ? {} : { opacity: 0, y: 20 }}
            whileInView={rm ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={rm ? {} : { duration: 0.8, ease: EASE }}
          >
            Outside the studio
          </motion.h2>
          <span className={meta}>Life I–{photos.length}</span>
        </div>
      </div>

      {/* ── Editorial grid ── */}
      <div className="max-w-screen-xl mx-auto px-8 pb-32">

        {/* Row 1: large featured left + two stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.52fr] gap-8 mb-16">

          {/* Featured photo — large, with pull-quote caption */}
          {featured && (
            <motion.div
              className="flex flex-col gap-0"
              initial={rm ? {} : { opacity: 0, y: 20 }}
              whileInView={rm ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={rm ? {} : { duration: 0.8, ease: EASE }}
            >
              <div className="bg-white p-4 shadow-[0_8px_40px_rgba(26,24,20,0.11),0_2px_8px_rgba(26,24,20,0.06)]">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {featured.src
                    ? <Image src={featured.src} alt={featured.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 58vw" priority />
                    : <Placeholder variant="folio" label={featured.alt} />
                  }
                </div>
              </div>
              <div className="pt-4 border-t border-hairline mt-4 grid grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  <span className={`${meta} block mb-2`}>{featured.alt}</span>
                  {featured.caption && (
                    <p className="font-serif italic font-light text-ink text-[1.05rem] leading-relaxed">
                      {featured.caption}
                    </p>
                  )}
                </div>
                <span className={`${meta} shrink-0 pt-0.5`}>01 / {photos.length}</span>
              </div>
            </motion.div>
          )}

          {/* Right column: two stacked photos */}
          <div className="flex flex-col gap-8">
            {second && (
              <PhotoCard photo={second} sizes="(max-width: 768px) 100vw, 30vw" aspect="aspect-[4/3]" delay={0.1} rm={rm} />
            )}
            {third && (
              <PhotoCard photo={third} sizes="(max-width: 768px) 100vw, 30vw" aspect="aspect-[4/3]" delay={0.2} rm={rm} />
            )}
          </div>
        </div>

        {/* Row 2: pull-quote left + photo right */}
        <div className="grid grid-cols-1 md:grid-cols-[0.55fr_1fr] gap-8 items-center">

          {/* Pull quote block */}
          {featured?.caption && (
            <motion.div
              className="flex flex-col gap-4 md:pr-8"
              initial={rm ? {} : { opacity: 0, x: -16 }}
              whileInView={rm ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={rm ? {} : { duration: 0.75, delay: 0.1, ease: EASE }}
            >
              <div className="w-6 h-px bg-hairline" />
              <blockquote>
                <p className="font-serif italic font-light text-ink text-[1.35rem] md:text-[1.6rem] leading-snug tracking-[-0.01em]">
                  &ldquo;{fourth?.caption ?? third?.caption ?? featured.caption}&rdquo;
                </p>
              </blockquote>
              <div className="flex items-center gap-3">
                <span className={meta}>{fourth?.alt ?? third?.alt}</span>
                <div className="flex-1 h-px bg-hairline" />
              </div>
            </motion.div>
          )}

          {/* Fourth photo — wide */}
          {fourth && (
            <PhotoCard photo={fourth} sizes="(max-width: 768px) 100vw, 55vw" aspect="aspect-[16/9]" delay={0.15} rm={rm} />
          )}
        </div>

      </div>
    </section>
  );
}
