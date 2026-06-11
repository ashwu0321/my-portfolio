"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ParallaxImage from "./ParallaxImage";
import Placeholder from "./Placeholder";

// ── Types ─────────────────────────────────────────────────────────────

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug:        string;
  title:       string;
  description: string;
  pullQuote?:  string;
  tech:        string[];
  image:       { src: string; alt: string };
  links:       ProjectLink[];
};

// ── Shared styles ─────────────────────────────────────────────────────

const meta =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

const ctaLink =
  "font-serif italic font-light text-sm text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Card sizes ────────────────────────────────────────────────────────
//
//  large  → A: left column, full height. Full description + links.
//  small  → B, C: top-right cells. Title + tech only.
//  wide   → D: bottom-right, spans 2 cols. Title + tech + links.

type CardSize = "large" | "small" | "wide";

const SIZES: CardSize[]    = ["large", "small", "small", "wide"];

// Explicit CSS grid placement for each card index
const PLACEMENT: string[] = [
  "col-start-1 row-span-2",              // A – left col, full height
  "col-start-2 row-start-1",             // B – top centre
  "col-start-3 row-start-1",             // C – top right
  "col-start-2 col-span-2 row-start-2",  // D – bottom right wide
];

// Title sizes per card size
const TITLE_SIZE: Record<CardSize, string> = {
  large: "text-[38px] md:text-[50px]",
  small: "text-[20px] md:text-[26px]",
  wide:  "text-[28px] md:text-[36px]",
};

// ── Single card ───────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  size,
  isSpotlit,
  onEnter,
  onLeave,
  onClick,
}: {
  project:   Project;
  index:     number;
  size:      CardSize;
  isSpotlit: boolean;
  onEnter:   () => void;
  onLeave:   () => void;
  onClick:   (e: React.MouseEvent) => void;
}) {
  const letter = String.fromCharCode(65 + index);

  return (
    <motion.article
      data-cursor="readmore"
      className="h-full relative rounded-2xl border border-hairline bg-paper overflow-hidden cursor-default"
      animate={{ opacity: isSpotlit ? 1 : 0.22 }}
      transition={{ duration: 0.35, ease }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Parallax image layer — sits behind the text overlay */}
      <ParallaxImage className="absolute inset-0">
        {project.image.src ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover"
          />
        ) : (
          <Placeholder variant="crosshair" label={project.title} />
        )}
      </ParallaxImage>

      {/* Content layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-7">

        {/* ── Top: index letter + tech ── */}
        <div className="flex items-start justify-between gap-4">
          <span className={meta}>{letter}</span>
          <span className={`${meta} text-right`}>
            {/* Trim tech list on small cards to avoid overflow */}
            {project.tech
              .slice(0, size === "small" ? 2 : project.tech.length)
              .join(" · ")}
          </span>
        </div>

        {/* ── Bottom: pull quote (large only) + title + links ── */}
        <div className="flex flex-col gap-2">

          {size !== "wide" && (
            <p className={`text-xs leading-relaxed text-muted mb-1 ${size === "large" ? "max-w-[300px]" : "line-clamp-3"}`}>
              {size === "large" ? (project.pullQuote ?? project.description) : project.description}
            </p>
          )}

          <h2
            className={`font-serif italic font-light leading-none tracking-[-0.01em] text-ink
                        ${TITLE_SIZE[size]}`}
          >
            {project.title}
          </h2>

          {project.links.length > 0 && (
            <div className="flex items-center gap-5 mt-1">
              {project.links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className={ctaLink}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────

export default function Projects({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  function handleCardClick(e: React.MouseEvent, slug: string) {
    if ((e.target as Element).closest("a, button")) return;
    router.push(`/projects/${slug}`);
  }

  return (
    <section id="projects" className="max-w-screen-xl mx-auto px-8 py-16 md:py-20">

      {/* Section header */}
      <div className="flex items-end justify-between mb-6 pb-5 border-b border-hairline">
        <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink
                       text-[48px] md:text-[64px]">
          Selected Work
        </h2>
        <span className={meta}>2024–25</span>
      </div>

      {/* ── Bento grid ──────────────────────────────────────────────
           3 columns: A is wide (5 parts), B and C share the right (3+3 parts).
           2 rows: A spans both, D spans the bottom two right cells.
           Height is capped so all 4 tiles are visible without scrolling.
      ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[5fr_3fr_3fr] grid-rows-2 gap-3 h-[68vh] min-h-[480px]">
        {projects.map((project, i) => (
          <div key={project.slug} className={PLACEMENT[i]}>
            <ProjectCard
              project={project}
              index={i}
              size={SIZES[i]}
              isSpotlit={hovered === null || hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              onClick={(e) => handleCardClick(e, project.slug)}
            />
          </div>
        ))}
      </div>

    </section>
  );
}
