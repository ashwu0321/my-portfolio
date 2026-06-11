"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion, useScroll, useTransform,
  useMotionValue, useReducedMotion,
} from "framer-motion";
import type { Project } from "./Projects";

// ── Helpers ────────────────────────────────────────────────────────────

const eio  = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const ph    = (p: number, s: number, e: number)  => eio(clamp((p - s) / (e - s), 0, 1));

// ── Photo definitions ──────────────────────────────────────────────────
//
// Each photo has a collage position (hero) and maps to a bento card.
// Card layout: A=large-left, B=top-centre, C=top-right, D=wide-bottom.
// Photo → card mapping:  0→B, 1→D, 2→C, 3→A
// i.e. projects[0]→A→photo3, [1]→B→photo0, [2]→C→photo2, [3]→D→photo1

const PHOTOS = [
  { src: "/art/c26cccab8b878003296b28596d909705.jpg", alt: "Study in Negative Space" }, // 0 → B
  { src: "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg", alt: "Lotus Field"              }, // 1 → D
  { src: "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg", alt: "White Petals"             }, // 2 → C
  { src: "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg", alt: "Emergence"                }, // 3 → A
];

// Starting collage rotation for each photo (degrees)
const START_R = [2.5, -3, 1, -2];
// Extra swirl rotation applied at the vortex midpoint
const SWIRL_R = [8,  -9, 6, -7];

// Collage [x, y, w, h] as pixel values within the viewport
function getCollage(i: number, vw: number, vh: number): [number,number,number,number] {
  return ([
    [vw*0.72, vh*0.05, 190, 240],
    [vw*0.01, vh*0.62, 260, 190],
    [vw*0.65, vh*0.50, 150, 185],
    [vw*0.03, vh*0.06, 165, 210],
  ] as [number,number,number,number][])[i];
}

// Grid card [x, y, w, h] in viewport pixels.
// Photo-to-card: 0→cardB, 1→cardD, 2→cardC, 3→cardA
function getCard(photoIdx: number, vw: number, vh: number): [number,number,number,number] {
  const maxW = Math.min(vw, 1280);
  const px   = 32;
  const gw   = maxW - 2*px;
  const gl   = (vw - maxW) / 2 + px;
  const gt   = Math.round(vh * 0.13);   // where the grid starts inside the sticky vh
  const gh   = Math.round(vh * 0.70);
  const gap  = 12;
  const c1   = Math.round((gw - gap * 2) * 5 / 11);
  const c23  = Math.round((gw - gap * 2) * 3 / 11);
  const rh   = Math.round((gh - gap) / 2);

  return ([
    [gl + c1 + gap,              gt,           c23,         rh],  // B → photo 0
    [gl + c1 + gap,              gt + rh + gap, c23*2 + gap, rh], // D → photo 1
    [gl + c1 + gap + c23 + gap,  gt,            c23,         rh], // C → photo 2
    [gl,                          gt,            c1,          gh], // A → photo 3
  ] as [number,number,number,number][])[photoIdx];
}

// ── Shared styles ──────────────────────────────────────────────────────

const meta =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

const ctaLink =
  "font-serif italic font-light text-sm text-ink border-b border-ink pb-0.5 " +
  "hover:text-accent hover:border-accent transition-colors duration-200";

// ── Component ──────────────────────────────────────────────────────────

export default function HeroToProjects({
  projects,
  startAnimation,
}: {
  projects: Project[];
  startAnimation: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);

  // ── Viewport + container motion values ─────────────────────────────
  // Start with 0 so SSR renders nothing position-dependent; values are
  // set in the effect below after mount (client-only).
  const vw = useMotionValue(0);
  const vh = useMotionValue(0);
  // containerTop in document pixels (updates after mount and on resize)
  const containerTop = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      vw.set(window.innerWidth);
      vh.set(window.innerHeight);
      if (containerRef.current) {
        containerTop.set(containerRef.current.getBoundingClientRect().top + window.scrollY);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [vw, vh, containerTop]);

  // ── Scroll progress: 0 when container top hits viewport top,
  //                     1 when container bottom hits viewport bottom ────
  const { scrollY } = useScroll();
  const sp = useTransform(
    [scrollY, containerTop, vw, vh],
    ([sy, ct, w, h]: number[]) => {
      const containerH = Math.round(h * 2.60); // minHeight: 260vh
      const range = containerH - h;
      return range > 0 ? clamp((sy - ct) / range, 0, 1) : 0;
    }
  );

  // ── Animation phases ────────────────────────────────────────────────
  //   0.00–0.15  collage rests, startAnimation stagger plays
  //   0.15–0.48  photos swirl inward (vortex)
  //   0.48–0.82  photos fly outward to their grid positions
  //   0.82–1.00  photos locked, project labels fade in

  // Hero text fade-out
  const heroOp = useTransform(sp, [0.08, 0.30], [1, 0]);
  // Section header + project overlays fade in
  const gridOp = useTransform(sp, [0.80, 0.96], [0, 1]);

  // ── Per-photo motion values (4 photos × 5 properties) ───────────────
  // x ──────────────────────────────────────────────────────────────────
  const p0x = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [cx,,cw] = getCollage(0, w, h); const [gx] = getCard(0, w, h);
    const sw = w*0.46 + 60;
    if (p<0.15) return cx; if (p<0.48) return lerp(cx, sw, ph(p,0.15,0.48));
    return lerp(sw, gx, ph(p,0.48,0.82));
  });
  const p1x = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [cx] = getCollage(1, w, h); const [gx] = getCard(1, w, h);
    const sw = w*0.40 - 60;
    if (p<0.15) return cx; if (p<0.48) return lerp(cx, sw, ph(p,0.15,0.48));
    return lerp(sw, gx, ph(p,0.48,0.82));
  });
  const p2x = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [cx] = getCollage(2, w, h); const [gx] = getCard(2, w, h);
    const sw = w*0.52 + 40;
    if (p<0.15) return cx; if (p<0.48) return lerp(cx, sw, ph(p,0.15,0.48));
    return lerp(sw, gx, ph(p,0.48,0.82));
  });
  const p3x = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [cx] = getCollage(3, w, h); const [gx] = getCard(3, w, h);
    const sw = w*0.38 - 40;
    if (p<0.15) return cx; if (p<0.48) return lerp(cx, sw, ph(p,0.15,0.48));
    return lerp(sw, gx, ph(p,0.48,0.82));
  });

  // y ──────────────────────────────────────────────────────────────────
  const p0y = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,cy] = getCollage(0, w, h); const [,gy] = getCard(0, w, h);
    const sw = h*0.38;
    if (p<0.15) return cy; if (p<0.48) return lerp(cy, sw, ph(p,0.15,0.48));
    return lerp(sw, gy, ph(p,0.48,0.82));
  });
  const p1y = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,cy] = getCollage(1, w, h); const [,gy] = getCard(1, w, h);
    const sw = h*0.44;
    if (p<0.15) return cy; if (p<0.48) return lerp(cy, sw, ph(p,0.15,0.48));
    return lerp(sw, gy, ph(p,0.48,0.82));
  });
  const p2y = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,cy] = getCollage(2, w, h); const [,gy] = getCard(2, w, h);
    const sw = h*0.42;
    if (p<0.15) return cy; if (p<0.48) return lerp(cy, sw, ph(p,0.15,0.48));
    return lerp(sw, gy, ph(p,0.48,0.82));
  });
  const p3y = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,cy] = getCollage(3, w, h); const [,gy] = getCard(3, w, h);
    const sw = h*0.36;
    if (p<0.15) return cy; if (p<0.48) return lerp(cy, sw, ph(p,0.15,0.48));
    return lerp(sw, gy, ph(p,0.48,0.82));
  });

  // width ──────────────────────────────────────────────────────────────
  const p0w = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,cw] = getCollage(0,w,h); const [,,gw] = getCard(0,w,h);
    if (p<0.30) return cw; return lerp(cw, gw, ph(p,0.30,0.82));
  });
  const p1w = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,cw] = getCollage(1,w,h); const [,,gw] = getCard(1,w,h);
    if (p<0.30) return cw; return lerp(cw, gw, ph(p,0.30,0.82));
  });
  const p2w = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,cw] = getCollage(2,w,h); const [,,gw] = getCard(2,w,h);
    if (p<0.30) return cw; return lerp(cw, gw, ph(p,0.30,0.82));
  });
  const p3w = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,cw] = getCollage(3,w,h); const [,,gw] = getCard(3,w,h);
    if (p<0.30) return cw; return lerp(cw, gw, ph(p,0.30,0.82));
  });

  // height ─────────────────────────────────────────────────────────────
  const p0h = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,,ch] = getCollage(0,w,h); const [,,,gh] = getCard(0,w,h);
    if (p<0.30) return ch; return lerp(ch, gh, ph(p,0.30,0.82));
  });
  const p1h = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,,ch] = getCollage(1,w,h); const [,,,gh] = getCard(1,w,h);
    if (p<0.30) return ch; return lerp(ch, gh, ph(p,0.30,0.82));
  });
  const p2h = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,,ch] = getCollage(2,w,h); const [,,,gh] = getCard(2,w,h);
    if (p<0.30) return ch; return lerp(ch, gh, ph(p,0.30,0.82));
  });
  const p3h = useTransform([sp, vw, vh], ([p,w,h]: number[]) => {
    const [,,,ch] = getCollage(3,w,h); const [,,,gh] = getCard(3,w,h);
    if (p<0.30) return ch; return lerp(ch, gh, ph(p,0.30,0.82));
  });

  // rotation ───────────────────────────────────────────────────────────
  const p0r = useTransform(sp, (p) => {
    if (p<0.15) return START_R[0];
    if (p<0.48) return lerp(START_R[0], SWIRL_R[0], ph(p,0.15,0.48));
    return lerp(SWIRL_R[0], 0, ph(p,0.48,0.82));
  });
  const p1r = useTransform(sp, (p) => {
    if (p<0.15) return START_R[1];
    if (p<0.48) return lerp(START_R[1], SWIRL_R[1], ph(p,0.15,0.48));
    return lerp(SWIRL_R[1], 0, ph(p,0.48,0.82));
  });
  const p2r = useTransform(sp, (p) => {
    if (p<0.15) return START_R[2];
    if (p<0.48) return lerp(START_R[2], SWIRL_R[2], ph(p,0.15,0.48));
    return lerp(SWIRL_R[2], 0, ph(p,0.48,0.82));
  });
  const p3r = useTransform(sp, (p) => {
    if (p<0.15) return START_R[3];
    if (p<0.48) return lerp(START_R[3], SWIRL_R[3], ph(p,0.15,0.48));
    return lerp(SWIRL_R[3], 0, ph(p,0.48,0.82));
  });

  // border-radius (snaps on as photos settle into cards)
  const br = useTransform(sp, (p) => lerp(0, 16, ph(p, 0.72, 0.88)));

  const pxProps = [
    { x: p0x, y: p0y, w: p0w, h: p0h, r: p0r },
    { x: p1x, y: p1y, w: p1w, h: p1h, r: p1r },
    { x: p2x, y: p2y, w: p2w, h: p2h, r: p2r },
    { x: p3x, y: p3y, w: p3w, h: p3h, r: p3r },
  ];

  // Card-to-project mapping:
  // gridPos slot 0 (B) → projects[1], slot 1 (D) → projects[3],
  // slot 2 (C) → projects[2], slot 3 (A) → projects[0]
  const cardProject = [
    projects[1], // photo 0 (water lily) → card B
    projects[3], // photo 1 (lotus)       → card D
    projects[2], // photo 2 (white petals)→ card C
    projects[0], // photo 3 (butterflies) → card A
  ];

  const anim = startAnimation ? "visible" : "hidden";

  return (
    <>
      {/* ── SCROLL CONTAINER: provides the scroll distance ── */}
      <div ref={containerRef} style={{ position: "relative", minHeight: "260vh" }}>

        {/* ── STICKY INNER: stays in viewport while user scrolls ── */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
          className="bg-paper">

          {/* ─── Hero text (fades out as scroll begins) ─── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20"
            style={{ opacity: heroOp }}
          >
            <div className={`${meta} flex items-center gap-3 mb-10`}>
              <span>CS Major</span><span className="text-hairline">·</span>
              <span>Univ. of Virginia</span><span className="text-hairline">·</span>
              <span>Open to Offers</span><span className="text-hairline">·</span>
              <span>Summer 2027</span>
            </div>

            <h1
              className="leading-none text-ink tracking-[0.06em] select-none mb-10
                         text-[56px] sm:text-[76px] md:text-[100px] lg:text-[120px]"
              style={{ fontFamily: "var(--font-exmouth), serif" }}
              aria-label="Ashley Wu."
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={anim === "visible" ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.65, ease: [0.23,1,0.32,1] }}
              >
                Ashley&nbsp;Wu
              </motion.span>
              <motion.span
                className="inline-block text-accent"
                initial={{ opacity: 0 }}
                animate={anim === "visible" ? { opacity: 1 } : {}}
                transition={{ delay: 0.48, duration: 0.4, ease: [0.23,1,0.32,1] }}
              >
                .
              </motion.span>
            </h1>

            <motion.img
              src="/art/d59a30349f055bdb70822f24646ba973.jpg"
              alt="" aria-hidden
              className="w-14 mb-6 select-none pointer-events-none"
              style={{ mixBlendMode: "multiply", opacity: 0.25 }}
              initial={{ opacity: 0 }}
              animate={anim === "visible" ? { opacity: 0.25 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
            />

            <motion.p
              className="text-sm leading-relaxed text-muted max-w-sm mb-8"
              initial={{ opacity: 0, y: 14 }}
              animate={anim === "visible" ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.5, ease: [0.23,1,0.32,1] }}
            >
              CS junior at the University of Virginia with a focus on systems and
              ML. I build tools that are fast, accessible, and honest about their
              complexity.
            </motion.p>

            <motion.span
              className={`${meta} text-ink border-b border-ink pb-0.5`}
              initial={{ opacity: 0 }}
              animate={anim === "visible" ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Scroll to explore ↓
            </motion.span>
          </motion.div>

          {/* ─── Grid section header (fades in) ─── */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            style={{
              top: "5%", left: 0, right: 0,
              opacity: gridOp,
              paddingLeft: "max(2rem, calc((100vw - 1280px)/2 + 2rem))",
              paddingRight: "max(2rem, calc((100vw - 1280px)/2 + 2rem))",
            }}
          >
            <div className="flex items-end justify-between pb-5 border-b border-hairline">
              <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink
                             text-[48px] md:text-[64px]">
                Selected Work
              </h2>
              <span className={meta}>2024–25</span>
            </div>
          </motion.div>

          {/* ─── Project card overlays + photos: client-only (positions depend on viewport) ─── */}
          {mounted && PHOTOS.map((photo, i) => (
            <motion.div
              key={`overlay-${i}`}
              className="absolute z-30 pointer-events-none flex flex-col justify-between p-6"
              style={{
                left:    pxProps[i].x,
                top:     pxProps[i].y,
                width:   pxProps[i].w,
                height:  pxProps[i].h,
                opacity: gridOp,
                borderRadius: br,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={meta}>{String.fromCharCode(65 + [1,3,2,0][i])}</span>
                <span className={`${meta} text-right`}>
                  {cardProject[i]?.tech.slice(0, 2).join(" · ")}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif italic font-light leading-none tracking-[-0.01em] text-ink
                               text-[22px] md:text-[28px]">
                  {cardProject[i]?.title}
                </h3>
                {cardProject[i]?.links?.length > 0 && (
                  <div className="flex items-center gap-4 pointer-events-auto">
                    {cardProject[i].links.map(({ label, href }) => (
                      <a
                        key={label} href={href}
                        target="_blank" rel="noopener noreferrer"
                        className={ctaLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* ─── The photos themselves ─── */}
          {mounted && PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              className="absolute overflow-hidden shadow-sm"
              style={{
                left:         pxProps[i].x,
                top:          pxProps[i].y,
                width:        pxProps[i].w,
                height:       pxProps[i].h,
                rotate:       pxProps[i].r,
                borderRadius: br,
                zIndex: 10,
                // During swirl, raise photos above everything
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ))}

        </div>{/* /sticky */}
      </div>{/* /scroll container */}

      {/* ── MOBILE FALLBACK: shows below the sticky section on small screens ── */}
      <div className="md:hidden max-w-screen-xl mx-auto px-8 py-16">
        <div className="mb-6 pb-5 border-b border-hairline flex items-end justify-between">
          <h2 className="font-serif italic font-light text-[40px] leading-none text-ink">
            Selected Work
          </h2>
          <span className={meta}>2024–25</span>
        </div>
        <div className="flex flex-col gap-6">
          {projects.map((p) => (
            <div key={p.slug} className="border border-hairline rounded-2xl p-5">
              <div className="flex justify-between mb-3">
                <span className={meta}>{p.tech.slice(0,2).join(" · ")}</span>
              </div>
              <h3 className="font-serif italic font-light text-2xl text-ink mb-2">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.description}</p>
              {p.links.length > 0 && (
                <div className="flex gap-4 mt-3">
                  {p.links.map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={ctaLink}>{label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
