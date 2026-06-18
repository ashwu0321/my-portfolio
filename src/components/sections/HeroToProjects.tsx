"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion, useScroll, useTransform,
  useMotionValue, useReducedMotion, useMotionValueEvent,
} from "framer-motion";
export type ProjectLink = { label: string; href: string };
export type Project = {
  slug:       string;
  title:      string;
  description: string;
  pullQuote?: string;
  tech:       string[];
  image:      { src: string; alt: string };
  links:      ProjectLink[];
};

// ── Math helpers ───────────────────────────────────────────────────────
const eio   = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const ph    = (p: number, s: number, e: number) => eio(clamp((p - s) / (e - s), 0, 1));

// ── Photo array: order matches PROJECTS — photo[i] ends up in card[i] ──
const PHOTOS = [
  { src: "/art/c26cccab8b878003296b28596d909705.jpg", alt: "Study in Negative Space" },
  { src: "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg", alt: "Lotus Field"              },
  { src: "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg", alt: "White Petals"             },
  { src: "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg", alt: "Emergence"                },
];

// ── Decorative photos: fixed positions, fade out before scroll animation ──
// These don't participate in the collage→grid transition
const DECO_PHOTOS = [
  { src: "/art/34b6d504ac3596ccf84e839c55782d08.jpg", alt: "Formal Garden" },
  { src: "/art/8a7f6cea1dddaf2b0446461b2388214d.jpg",  alt: "Light Field"   },
  { src: "/art/4b1c0bdb2c1fe76a8bcaf825a218896f.jpg",  alt: "Marginalia"    },
  { src: "/art/1d036853ceea5beaa0543a8aa06bebba.jpg",  alt: "Peace Study"   },
];
// xl/yt are viewport fractions (negative = partially off-screen)
const DECO_POS = [
  { xl: 0.76,  yt: 0.72,  w: 210, h: 162, r:  2.8 }, // bottom-right, clipped
  { xl: 0.36,  yt: -0.20, w: 182, h: 234, r: -1.6 }, // top-center, bleeds off top
  { xl: -0.05, yt: 0.38,  w: 164, h: 204, r:  3.4 }, // left-center, bleeds off left
  { xl: 0.90,  yt: 0.22,  w: 230, h: 290, r: -2.2 }, // right edge, half off-screen
];
const KB_DECO_DUR    = [24, 19, 27, 21];
const KB_DECO_DELAY  = [-6, -13, -3, -8];
const KB_DECO_ORIGIN = ["40% 60%", "55% 45%", "48% 52%", "38% 55%"];

// Entrance drift offsets: each photo slides in from its nearest screen edge
// [translateX, translateY] in px — these are CSS transforms on top of scroll-driven left/top
const ENTER_X = [ 220, -220,  200, -180];
const ENTER_Y = [ -80,  100,   30,  -90];
const ENTER_DELAY = [0.05, 0.18, 0.30, 0.12]; // stagger relative to startAnimation

// Starting collage tilt per photo
const START_R = [2.5, -3, 1, -2];
// At the vortex stack, photos lie nearly flat
const SWIRL_R = [0.8, -0.6, 0.4, -0.3];

// ── Collage positions: pixel-exact match to HeroSectionCollage ─────────
function getCollage(i: number, vw: number, vh: number): [number, number, number, number] {
  const maxW = Math.min(vw, 1280);
  const cl   = (vw - maxW) / 2;
  return ([
    [cl + maxW * 0.96 - 190,  vh * 0.04,        190, 240],
    [cl + maxW * 0.01,        vh * 0.92 - 190,  260, 190],
    [cl + maxW * 0.88 - 150,  vh * 0.52,        150, 185],
    [cl + maxW * 0.03,        vh * 0.06,        165, 210],
  ] as [number, number, number, number][])[i];
}

// ── Grid positions: bento layout ──────────────────────────────────────
//  Grid: grid-cols-[5fr 3fr 3fr] grid-rows-2 gap-3 h-[68vh]
//  Cards: A=large-left, B=top-centre, C=top-right, D=wide-bottom
//
//  gt is now computed as a fixed offset from the header layout:
//  header top(100) + h2 height(64) + pb-5(20) + gap(16) = 200px
function getCard(i: number, vw: number, vh: number): [number, number, number, number] {
  const maxW = Math.min(vw, 1280);
  const px   = 32;
  const gw   = maxW - 2 * px;
  const gl   = (vw - maxW) / 2 + px;
  const gt   = 200;
  const gh   = Math.round(vh * 0.68);
  const gap  = 12;
  const aw   = gw - gap * 2;
  const c1   = Math.round(aw * 5 / 11);
  const c23  = Math.round(aw * 3 / 11);
  const rh   = Math.round((gh - gap) / 2);

  return ([
    [gl,                          gt,            c1,            gh ],
    [gl + c1 + gap,               gt,            c23,           rh ],
    [gl + c1 + gap * 2 + c23,     gt,            c23,           rh ],
    [gl + c1 + gap,               gt + rh + gap, c23 * 2 + gap, rh ],
  ] as [number, number, number, number][])[i];
}

// ── Ken Burns: duration, staggered delay, and zoom origin per photo ────
const KB_DURATION = [22, 18, 26, 20];
const KB_DELAY    = [0, -9, -16, -5];
const KB_ORIGIN   = ["62% 38%", "38% 62%", "55% 32%", "44% 68%"];

// ── Star blink-in delays (seconds after startAnimation, randomised but stable) ──
const STAR_DELAYS = [0.6,1.4,0.9,1.8,0.4,1.1,2.0,0.7,1.6,1.3,0.5,1.9,0.8,1.2,2.3,1.0,0.3,1.7,2.1,0.2];

// ── Stars ──────────────────────────────────────────────────────────────
type Star = { x: string; y: string; s: number; r: number; o: number; sd?: number; ccw?: true };
const STARS: Star[] = [
  { x: "17%", y: "46%", s: 28, r:  0, o: 0.42, sd: 22 },        // fast cw
  { x: "82%", y: "53%", s: 24, r:  0, o: 0.38, sd: 110, ccw: true }, // slow ccw
  { x: "33%", y: "78%", s: 20, r:  0, o: 0.40, sd: 38 },        // medium cw
  { x:  "5%", y: "15%", s: 30, r: -14, o: 0.48 },
  { x: "90%", y: "17%", s: 26, r:  -7, o: 0.46 },
  { x: "37%", y: "60%", s: 22, r:  10, o: 0.50 },
  { x: "22%", y:  "8%", s: 17, r:  12, o: 0.46 },
  { x: "50%", y: "12%", s: 15, r:   8, o: 0.40 },
  { x: "97%", y: "69%", s: 16, r: -18, o: 0.38 },
  { x:  "6%", y: "50%", s: 14, r:  20, o: 0.36, sd: 65, ccw: true }, // medium ccw
  { x: "68%", y: "20%", s: 15, r:  -5, o: 0.38 },
  { x: "28%", y: "34%", s: 16, r:  18, o: 0.40 },
  { x: "21%", y: "52%", s: 13, r: -10, o: 0.38, sd: 140 },      // very slow cw
  { x: "77%", y:  "5%", s: 11, r:  25, o: 0.36 },
  { x: "28%", y: "15%", s:  9, r:  30, o: 0.48 },
  { x:  "5%", y: "77%", s:  7, r: -25, o: 0.40 },
  { x: "72%", y: "29%", s:  8, r:  15, o: 0.32, sd: 18, ccw: true }, // fast ccw
  { x: "91%", y: "80%", s:  9, r:   5, o: 0.34 },
  { x: "72%", y: "83%", s:  6, r: -12, o: 0.38 },
  { x: "62%", y: "71%", s:  8, r:  22, o: 0.36 },
];

// ── Shared styles ──────────────────────────────────────────────────────
const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ── Component ──────────────────────────────────────────────────────────
export default function HeroToProjects({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rm      = useReducedMotion() ?? false;
  const router  = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const vw = useMotionValue(1440);
  const vh = useMotionValue(900);
  const containerTop = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      vw.set(window.innerWidth);
      vh.set(window.innerHeight);
      if (containerRef.current) {
        containerTop.set(
          containerRef.current.getBoundingClientRect().top + window.scrollY
        );
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [vw, vh, containerTop]);

  // ── Scroll progress 0→1 across the 320vh scroll travel ──────────────
  const { scrollY } = useScroll();
  const sp = useTransform(
    [scrollY, containerTop, vh] as const,
    ([sy, ct, h]: number[]) => {
      const range = Math.round(h * 3.20) - h; // 2.20 × vh — slower, more cinematic
      return range > 0 ? clamp((sy - ct) / range, 0, 1) : 0;
    }
  );

  // ── Opacity layers ───────────────────────────────────────────────────
  const heroOp = useTransform(sp, [0.06, 0.25], [1, 0]);
  const gridOp = useTransform(sp, [0.82, 0.95], [0, 1]);
  // Decorative photos converge with main photos then fade out after the stack forms
  const decoOp = useTransform(sp, [0.44, 0.58], [1, 0]);

  // ── Per-photo motion ─────────────────────────────────────────────────
  //
  //  3 phases:
  //    0.00–0.15  rest in collage layout
  //    0.15–0.52  converge to a single centered stack (all photos to center)
  //    0.52–0.88  fan outward into bento grid cards
  //    0.88–1.00  locked in card position, grid overlays fade in

  function makeX(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vw, vh] as const, ([p, w, h]: number[]) => {
      const [cx,, cw] = getCollage(i, w, h);
      const [gx]      = getCard(i, w, h);
      // Stack center: viewport center minus half photo width, with tiny per-photo stagger
      const sv = w / 2 - cw / 2 + (i - 1.5) * 5;
      if (p < 0.15) return cx;
      if (p < 0.52) return lerp(cx, sv, ph(p, 0.15, 0.52));
      return lerp(sv, gx, ph(p, 0.52, 0.88));
    });
  }
  function makeY(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vw, vh] as const, ([p, w, h]: number[]) => {
      const [, cy,, ch] = getCollage(i, w, h);
      const [, gy]      = getCard(i, w, h);
      // Stack center: viewport center minus half photo height, with tiny per-photo stagger
      const sv = h / 2 - ch / 2 + (i - 1.5) * 5;
      if (p < 0.15) return cy;
      if (p < 0.52) return lerp(cy, sv, ph(p, 0.15, 0.52));
      return lerp(sv, gy, ph(p, 0.52, 0.88));
    });
  }
  function makeW(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vw, vh] as const, ([p, w, h]: number[]) => {
      const [,, cw] = getCollage(i, w, h);
      const [,, gw] = getCard(i, w, h);
      if (p < 0.32) return cw;
      return lerp(cw, gw, ph(p, 0.32, 0.88));
    });
  }
  function makeH(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vw, vh] as const, ([p, w, h]: number[]) => {
      const [,,, ch] = getCollage(i, w, h);
      const [,,, gh] = getCard(i, w, h);
      if (p < 0.32) return ch;
      return lerp(ch, gh, ph(p, 0.32, 0.88));
    });
  }
  function makeR(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(sp, (p) => {
      if (p < 0.15) return START_R[i];
      if (p < 0.52) return lerp(START_R[i], SWIRL_R[i], ph(p, 0.15, 0.52));
      return lerp(SWIRL_R[i], 0, ph(p, 0.52, 0.88));
    });
  }

  const photos = PHOTOS.map((_, i) => ({
    x: makeX(i), y: makeY(i), w: makeW(i), h: makeH(i), r: makeR(i),
  }));

  // ── Deco photo motion: converge to center with main photos, then fade ──
  function makeDecoX(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vw] as const, ([p, w]: number[]) => {
      const pos = DECO_POS[i];
      const startX = pos.xl * w;
      const centerX = w / 2 - pos.w / 2 + (i - 1.5) * 7;
      if (p < 0.15) return startX;
      if (p < 0.52) return lerp(startX, centerX, ph(p, 0.15, 0.52));
      return centerX;
    });
  }
  function makeDecoY(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform([sp, vh] as const, ([p, h]: number[]) => {
      const pos = DECO_POS[i];
      const startY = pos.yt * h;
      const centerY = h / 2 - pos.h / 2 + (i - 1.5) * 7;
      if (p < 0.15) return startY;
      if (p < 0.52) return lerp(startY, centerY, ph(p, 0.15, 0.52));
      return centerY;
    });
  }
  function makeDecoR(i: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(sp, (p) => {
      const r0 = DECO_POS[i].r;
      if (p < 0.15) return r0;
      if (p < 0.52) return lerp(r0, r0 * 0.15, ph(p, 0.15, 0.52));
      return r0 * 0.15;
    });
  }

  const decoPhotos = DECO_PHOTOS.map((_, i) => ({
    x: makeDecoX(i), y: makeDecoY(i), r: makeDecoR(i),
  }));

  const br = useTransform(sp, (p) => lerp(2, 6, ph(p, 0.78, 0.90)));

  const [isGridPhase, setIsGridPhase] = useState(false);
  useMotionValueEvent(gridOp, "change", (v) => setIsGridPhase(v > 0.3));

  const visible = true;

  // ── Star editor (dev only, toggle with Shift+E) ──────────────────────
  const [editing, setEditing]       = useState(false);
  const [starPos, setStarPos]       = useState(STARS.map(s => ({ x: s.x, y: s.y })));
  const [copied, setCopied]         = useState(false);
  const editorContainerRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "E") setEditing(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (editing) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => { document.body.style.userSelect = ""; };
  }, [editing]);

  function copyPositions() {
    const lines = STARS.map((s, i) =>
      `  { x: "${starPos[i].x}", y: "${starPos[i].y}", s: ${s.s}, r: ${s.r}, o: ${s.o}${s.sd ? `, sd: ${s.sd}` : ""} },`
    ).join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Click handler: scroll to end of animation in hero phase ──────────
  function handleCardClick(i: number) {
    if (gridOp.get() < 0.3) {
      const container = containerRef.current;
      if (container) {
        const target = container.offsetTop + container.offsetHeight - window.innerHeight;
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
      }
    } else if (projects[i]) {
      router.push(`/projects/${projects[i].slug}`);
    }
  }

  return (
    <>
      {/* ── SCROLL CONTAINER: 320vh gives the sticky section room to animate ── */}
      <div ref={containerRef} style={{ position: "relative", minHeight: "320vh" }} id="work">

        {/* ── STICKY INNER ── */}
        <div
          style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
          className="bg-paper"
        >

          {/* ── Radial veil: very subtle fog to keep text legible ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 15,
              background: "radial-gradient(ellipse 48% 52% at 50% 50%, rgba(242,240,236,0.38) 0%, rgba(242,240,236,0.14) 50%, transparent 75%)",
            }}
          />

          {/* ── 4-point stars ── */}
          <motion.div
            ref={editorContainerRef}
            className="absolute inset-0"
            style={{ opacity: editing ? 1 : rm ? 1 : heroOp, zIndex: 18, pointerEvents: editing ? "auto" : "none" }}
            aria-hidden
          >
            {STARS.map(({ s, r, o, sd, ccw }, i) => {
              const pos = starPos[i];
              if (editing) {
                return (
                  <div
                    key={i}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      position: "absolute",
                      left: pos.x, top: pos.y,
                      transform: "translate(-50%, -50%)",
                      touchAction: "none",
                      userSelect: "none",
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const container = editorContainerRef.current!;
                      const cr = container.getBoundingClientRect();
                      const idx = i;
                      const onMove = (ev: MouseEvent) => {
                        const xPct = Math.round(((ev.clientX - cr.left) / cr.width)  * 100);
                        const yPct = Math.round(((ev.clientY - cr.top)  / cr.height) * 100);
                        setStarPos(prev => {
                          const next = [...prev];
                          next[idx] = { x: `${xPct}%`, y: `${yPct}%` };
                          return next;
                        });
                      };
                      const onUp = () => {
                        window.removeEventListener("mousemove", onMove);
                        window.removeEventListener("mouseup", onUp);
                      };
                      window.addEventListener("mousemove", onMove);
                      window.addEventListener("mouseup", onUp);
                    }}
                  >
                    <svg viewBox="-12 -12 24 24" width={Math.max(s, 18)} height={Math.max(s, 18)}
                      style={{ display: "block", color: "var(--c-accent)", filter: "drop-shadow(0 0 4px rgba(204,51,51,0.7))" }}>
                      <path d="M0,-10 L2.2,-2.2 L10,0 L2.2,2.2 L0,10 L-2.2,2.2 L-10,0 L-2.2,-2.2 Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
                    </svg>
                    <span style={{
                      position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                      fontSize: 9, fontFamily: "monospace", whiteSpace: "nowrap",
                      background: "rgba(26,24,20,0.85)", color: "#F2F0EC", padding: "1px 4px", borderRadius: 2, marginTop: 2,
                    }}>
                      {pos.x},{pos.y}
                    </span>
                  </div>
                );
              }
              const delay = STAR_DELAYS[i] ?? 0.5;
              const shown = rm ? true : visible;
              // Outer: handles absolute position + static rotation (non-spinning only)
              // Inner: handles spin (spinning only)
              // SVG:   handles blink-in scale+opacity
              const svgEl = (
                <svg
                  viewBox="-12 -12 24 24"
                  width={s}
                  height={s}
                  style={{
                    display: "block",
                    color: "var(--c-mid)",
                    opacity: shown ? o : 0,
                    animation: shown && !rm
                      ? `star-blink 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s both`
                      : undefined,
                  }}
                >
                  <path d="M0,-10 L2.2,-2.2 L10,0 L2.2,2.2 L0,10 L-2.2,2.2 L-10,0 L-2.2,-2.2 Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
                </svg>
              );
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: pos.x, top: pos.y,
                    transform: sd ? undefined : `rotate(${r}deg)`,
                  }}
                >
                  {sd && !rm ? (
                    <div style={{ animation: `${ccw ? "spin-ccw" : "spin-cw"} ${sd}s linear ${delay + 0.45}s infinite` }}>
                      {svgEl}
                    </div>
                  ) : svgEl}
                </div>
              );
            })}
          </motion.div>

          {/* ── Star editor HUD (dev only) ── */}
          {editing && (
            <div style={{
              position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, display: "flex", alignItems: "center", gap: 12,
              background: "rgba(26,24,20,0.92)", color: "#F2F0EC",
              padding: "10px 18px", borderRadius: 6, fontFamily: "monospace", fontSize: 11,
              pointerEvents: "auto",
            }}>
              <span style={{ opacity: 0.6 }}>SHIFT+E · drag red stars</span>
              <button
                onClick={copyPositions}
                style={{
                  background: copied ? "#4caf50" : "var(--c-accent)", color: "#fff",
                  border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11,
                }}
              >
                {copied ? "Copied!" : "Copy positions"}
              </button>
            </div>
          )}

          {/* ── Hero text ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center
                       text-center pointer-events-none z-20"
            style={{ opacity: rm ? 1 : heroOp }}
          >
            <div className={`${meta} flex items-center gap-3 mb-10 overflow-hidden`}>
              <motion.span
                className="inline-flex items-center gap-3"
                initial={{ y: rm ? 0 : "110%" }}
                animate={visible ? { y: "0%" } : {}}
                transition={{ delay: rm ? 0 : 0.6, duration: rm ? 0.01 : 0.7, ease: EASE }}
              >
                <span>CS Major</span>
                <span className="text-hairline">·</span>
                <span>Univ. of Virginia</span>
                <span className="text-hairline">·</span>
                <span>Open to Offers</span>
                <span className="text-hairline">·</span>
                <span>Summer 2027</span>
              </motion.span>
            </div>

            <h1
              className="leading-none tracking-[-0.02em] italic font-light select-none mb-10 w-full"
              style={{ fontSize: "clamp(2.75rem, 9vw, 12rem)" }}
              aria-label="Ashley Wu."
            >
              <span className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em]">
                <motion.span
                  className="inline-block text-ink"
                  initial={{ y: rm ? 0 : "105%" }}
                  animate={visible ? { y: "0%" } : {}}
                  transition={{ delay: rm ? 0 : 1.1, duration: rm ? 0.01 : 1.0, ease: EASE }}
                >
                  Ashley&nbsp;Wu
                </motion.span>
              </span>
              <span className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block text-accent"
                  initial={{ y: rm ? 0 : "105%" }}
                  animate={visible ? { y: "0%" } : {}}
                  transition={{ delay: rm ? 0 : 1.4, duration: rm ? 0.01 : 0.8, ease: EASE }}
                >
                  .
                </motion.span>
              </span>
            </h1>

            <div className="overflow-hidden mb-10">
              <motion.p
                className="font-serif italic font-light text-2xl md:text-3xl text-ink leading-snug"
                initial={{ y: rm ? 0 : "105%" }}
                animate={visible ? { y: "0%" } : {}}
                transition={{ delay: rm ? 0 : 1.8, duration: rm ? 0.01 : 0.9, ease: EASE }}
              >
                Honest about complexity.
              </motion.p>
            </div>

            <div className="overflow-hidden">
              <motion.span
                className={`${meta} text-ink`}
                initial={{ y: rm ? 0 : "110%" }}
                animate={visible ? { y: "0%" } : {}}
                transition={{ delay: rm ? 0 : 2.1, duration: rm ? 0.01 : 0.7, ease: EASE }}
              >
                Scroll to explore ↓
              </motion.span>
            </div>
          </motion.div>

          {/* ── "Selected Work" header ── */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            style={{
              top:          100,   // 64px nav + 36px breathing room
              left:         0,
              right:        0,
              opacity:      gridOp,
              paddingLeft:  "max(2rem, calc((100vw - 1280px)/2 + 2rem))",
              paddingRight: "max(2rem, calc((100vw - 1280px)/2 + 2rem))",
            }}
          >
            <div className="flex items-end justify-between pb-4 border-b border-hairline">
              <h2 className="font-serif italic font-light leading-none tracking-[-0.02em]
                             text-ink text-[48px] md:text-[64px]">
                Selected Work
              </h2>
              <div className="flex flex-col items-end gap-1.5 pb-1">
                <span className={meta}>2024–25</span>
                <span className={`${meta} text-right`}>
                  {projects.length} projects · full-stack &amp; systems
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Decorative photos: converge with main photos, then fade ── */}
          {DECO_PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              className="absolute pointer-events-none"
              // Deco entrance: drift in from their respective bleed edges (opacity handled by decoOp motion value)
              initial={rm ? false : { x: [-120, 80, -160, 180][i], y: [60, -100, 20, -40][i] }}
              animate={visible ? { x: 0, y: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: [0.22, 0.08, 0.35, 0.16][i] }}
              style={{
                left:    decoPhotos[i].x,
                top:     decoPhotos[i].y,
                width:   DECO_POS[i].w,
                height:  DECO_POS[i].h,
                rotate:  decoPhotos[i].r,
                opacity: rm ? 1 : decoOp,
                zIndex:  7,
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded shadow-sm">
                <div
                  className="absolute inset-0"
                  style={{
                    animation:       rm ? "none" : `kenburns ${KB_DECO_DUR[i]}s ease-in-out ${KB_DECO_DELAY[i]}s infinite alternate`,
                    transformOrigin: KB_DECO_ORIGIN[i],
                    willChange:      "transform",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="220px"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Cards: photo + gradient + border + text overlay ── */}
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              className="absolute cursor-pointer"
              data-cursor={isGridPhase ? "readmore" : "default"}
              style={{
                left:   photos[i].x,
                top:    photos[i].y,
                width:  photos[i].w,
                height: photos[i].h,
                rotate: photos[i].r,
                zIndex: 10,
              }}
              // Entrance: drift in from nearest edge, then spotlight dim
              initial={rm ? false : { x: ENTER_X[i], y: ENTER_Y[i], opacity: 0 }}
              animate={{
                x: visible ? 0 : ENTER_X[i],
                y: visible ? 0 : ENTER_Y[i],
                opacity: visible ? (hovered === null || hovered === i ? 1 : 0.22) : 0,
              }}
              transition={{
                x:       { duration: 1.1, ease: EASE, delay: ENTER_DELAY[i] },
                y:       { duration: 1.1, ease: EASE, delay: ENTER_DELAY[i] },
                opacity: { duration: 0.7, ease: EASE, delay: ENTER_DELAY[i] },
              }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE } }}
              onClick={() => handleCardClick(i)}
              onHoverStart={() => { if (gridOp.get() > 0.3) setHovered(i); }}
              onHoverEnd={() => setHovered(null)}
            >
              {/* Photo */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: br, boxShadow: "0 6px 28px rgba(26,24,20,0.13), 0 2px 8px rgba(26,24,20,0.08)" }}
              >
                {/* Ken Burns wrapper — scale only, contained by overflow-hidden above */}
                <div
                  className="absolute inset-0"
                  style={{
                    animation:       rm ? "none" : `kenburns ${KB_DURATION[i]}s ease-in-out ${KB_DELAY[i]}s infinite alternate`,
                    transformOrigin: KB_ORIGIN[i],
                    willChange:      "transform",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                {/* Bottom gradient for text legibility */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity:    gridOp,
                    background: "linear-gradient(to top, rgba(26,24,20,0.88) 0%, rgba(26,24,20,0.32) 42%, transparent 66%)",
                  }}
                />
              </motion.div>

              {/* Inset border */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity:      gridOp,
                  borderRadius: br,
                  boxShadow:    "inset 0 0 0 1px rgba(200,196,188,0.45)",
                }}
              />

              {/* Text overlay — fades in with grid */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 pointer-events-none"
                style={{ opacity: gridOp, borderRadius: br }}
              >
                {/* Top: index + tech */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60 text-right">
                    {projects[i]?.tech.slice(0, 2).join(" · ")}
                  </span>
                </div>

                {/* Bottom: title + caption + links */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif italic font-light leading-none tracking-[-0.01em]
                                 text-paper text-[22px] md:text-[26px]">
                    {projects[i]?.title}
                  </h3>
                  {projects[i]?.description && (
                    <p className="font-sans text-[11px] leading-snug text-paper/55 line-clamp-2">
                      {projects[i].description}
                    </p>
                  )}
                  {(projects[i]?.links?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-4 mt-0.5 pointer-events-auto">
                      {projects[i].links.map(({ label, href }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="default"
                          className="cta-underline font-serif italic font-light text-sm
                                     text-paper/80 hover:text-accent transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}

        </div>{/* /sticky */}
      </div>{/* /scroll container */}

      {/* ── MOBILE FALLBACK ── */}
      <div className="md:hidden max-w-screen-xl mx-auto px-8 py-16" id="projects">
        <div className="mb-6 pb-4 border-b border-hairline flex items-end justify-between">
          <h2 className="font-serif italic font-light text-[40px] leading-none text-ink">
            Selected Work
          </h2>
          <span className={meta}>2024–25</span>
        </div>
        <div className="flex flex-col gap-6">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="border border-hairline rounded p-5 cursor-pointer"
              onClick={() => router.push(`/projects/${p.slug}`)}
            >
              <span className={meta}>{p.tech.slice(0, 2).join(" · ")}</span>
              <h3 className="font-serif italic font-light text-2xl text-ink mt-2 mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{p.description}</p>
              {p.links.length > 0 && (
                <div className="flex gap-4 mt-3">
                  {p.links.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-underline font-serif italic font-light text-sm
                                 text-ink hover:text-accent transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {label}
                    </a>
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
