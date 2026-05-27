"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ── Config ─────────────────────────────────────────────────────────────

const CELL   = 8;    // px per stitch (canvas grid + DOM tile)
const FONT_A = 84;   // canvas font-size for "Ashley"
const FONT_W = 138;  // canvas font-size for "Wu"  (≈ 1.64× — mirrors 54/100 ratio)
const CW     = 900;  // canvas sampling width
const ALPHA  = 55;   // minimum alpha to count as "ink here"

// ── Stitch record ──────────────────────────────────────────────────────

interface Stitch {
  id:           number;
  x:  number;
  y:  number;
  initDelay:    number; // load-in stagger (random, 0 → 1.3 s)
  scatterDelay: number; // delay when scattering out (tiny, creates burst effect)
  returnDelay:  number; // delay when springing back (random, 0 → 0.28 s)
  sx: number;           // scatter x offset
  sy: number;           // scatter y offset
}

// ── Canvas sampler ─────────────────────────────────────────────────────

function sampleText(
  text:     string,
  fontSize: number,
  yBase:    number,
  idBase:   number
): { stitches: Stitch[]; lineW: number; lineH: number } {
  const H   = Math.ceil(fontSize * 1.3);
  const cvs = document.createElement("canvas");
  cvs.width  = CW;
  cvs.height = H;

  const ctx = cvs.getContext("2d")!;
  ctx.font      = `italic 300 ${fontSize}px 'Cormorant Garamond', Georgia, serif`;
  ctx.fillStyle = "#000";
  ctx.fillText(text, 2, fontSize); // slight left pad so no clipping

  const { data } = ctx.getImageData(0, 0, CW, H);
  const raw: [number, number][] = [];
  let maxCol = 0, maxRow = 0;

  for (let r = 0; r * CELL < H; r++) {
    for (let c = 0; c * CELL < CW; c++) {
      const px = Math.min(c * CELL + (CELL >> 1), CW - 1);
      const py = Math.min(r * CELL + (CELL >> 1), H  - 1);
      if (data[(py * CW + px) * 4 + 3] > ALPHA) {
        raw.push([c, r]);
        if (c > maxCol) maxCol = c;
        if (r > maxRow) maxRow = r;
      }
    }
  }

  const stitches: Stitch[] = raw.map(([col, row], i) => ({
    id:           idBase + i,
    x:            col * CELL,
    y:            row * CELL + yBase,
    initDelay:    Math.random() * 1.3,
    scatterDelay: Math.random() * 0.06,
    returnDelay:  Math.random() * 0.28,
    sx:           (Math.random() - 0.5) * 210,
    sy:           (Math.random() - 0.5) * 160,
  }));

  return {
    stitches,
    lineW: (maxCol + 1) * CELL,
    lineH: (maxRow + 1) * CELL,
  };
}

// ── Component ──────────────────────────────────────────────────────────

export default function CrossStitchName() {
  const [stitches, setStitches]   = useState<Stitch[]>([]);
  const [box, setBox]             = useState({ w: 0, h: 0 });
  const [scattered, setScattered] = useState(false);
  const hasHovered                = useRef(false);

  useEffect(() => {
    (async () => {
      // Block until Cormorant Garamond (loaded via next/font) is available
      await document.fonts.ready;

      const { stitches: sA, lineW: wA, lineH: hA } =
        sampleText("Ashley", FONT_A, 0, 0);

      const { stitches: sW, lineW: wW, lineH: hW } =
        sampleText("Wu", FONT_W, hA + CELL, sA.length);

      // Centre each line within the wider of the two
      const W = Math.max(wA, wW);
      sA.forEach(s => (s.x += Math.round((W - wA) / 2)));
      sW.forEach(s => (s.x += Math.round((W - wW) / 2)));

      setStitches([...sA, ...sW]);
      setBox({ w: W, h: hA + CELL + hW });
    })();
  }, []);

  // Reserve the expected space before fonts load to avoid layout shift
  if (!box.w) {
    return (
      <div
        className="mb-14"
        style={{ height: 240 }}
        role="img"
        aria-label="Ashley Wu"
      />
    );
  }

  return (
    <div
      className="relative mb-14 mx-auto"
      style={{ width: box.w, height: box.h }}
      role="img"
      aria-label="Ashley Wu"
      onMouseEnter={() => { hasHovered.current = true; setScattered(true); }}
      onMouseLeave={() => setScattered(false)}
    >
      {stitches.map((s) => (
        <motion.span
          key={s.id}
          className="absolute leading-none text-ink pointer-events-none"
          style={{
            left:       s.x,
            top:        s.y,
            fontSize:   CELL,
            fontFamily: "monospace",
            // Anchor the scale transform at the stitch centre
            transformOrigin: "50% 50%",
          }}
          // Start invisible + collapsed
          initial={{ opacity: 0, scale: 0 }}
          animate={
            scattered
              ? { opacity: 0, scale: 0.25, x: s.sx, y: s.sy }
              : { opacity: 1, scale: 1,    x: 0,    y: 0    }
          }
          transition={
            scattered
              ? { type: "spring", stiffness: 520, damping: 11, delay: s.scatterDelay }
              : {
                  type:      "spring",
                  stiffness: 290,
                  damping:   22,
                  // First appearance → random load stagger; returning from scatter → staggered spring-back
                  delay: hasHovered.current ? s.returnDelay : s.initDelay,
                }
          }
        >
          ×
        </motion.span>
      ))}
    </div>
  );
}
