"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MagneticLink from "./MagneticLink";

// ── Styles ─────────────────────────────────────────────────────────────

const linkClass =
  "font-mono text-[11px] uppercase tracking-[0.12em] text-ink " +
  "hover:text-accent transition-colors duration-200";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ── Logo circle ────────────────────────────────────────────────────────
//
// Rests as a small filled circle. On hover it expands and reveals
// the "AW" initials. Absolute-positioned so it never affects nav layout.

function LogoCircle() {
  const [hovered, setHovered] = useState(false);

  return (
    // 44×44 tap target wraps the visually-small circle
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="relative flex items-center justify-center bg-transparent border-0 p-0"
      style={{ width: 44, height: 44 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="absolute rounded-full bg-ink flex items-center justify-center overflow-hidden z-50 cursor-pointer"
        animate={{ width: hovered ? 80 : 12, height: hovered ? 80 : 12 }}
        transition={{ duration: 0.38, ease: EASE }}
        // translateX/Y keep the circle centered on its anchor as it grows
        style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
      >
        <motion.span
          className="select-none pointer-events-none whitespace-nowrap"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle:  "italic",
            fontWeight: 300,
            fontSize:   17,
            color:      "var(--color-paper, #F2F0EC)",
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18, delay: hovered ? 0.18 : 0 }}
        >
          AW
        </motion.span>
      </motion.div>
    </button>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper">
      <nav
        className="flex items-center h-16 px-8"
        aria-label="Primary navigation"
      >
        <ul className="w-full flex items-center justify-between" role="list">

          <li>
            <MagneticLink>
              <Link href="#projects" className={linkClass}>work</Link>
            </MagneticLink>
          </li>

          <li>
            <MagneticLink>
              <Link href="#about" className={linkClass}>about</Link>
            </MagneticLink>
          </li>

          {/* ── Centre: expanding logo circle ── */}
          <li>
            <LogoCircle />
          </li>

          <li>
            <MagneticLink>
              <Link href="#art" className={linkClass}>art</Link>
            </MagneticLink>
          </li>

          <li>
            <MagneticLink>
              <Link href="#contact" className={linkClass}>contact</Link>
            </MagneticLink>
          </li>

        </ul>
      </nav>
    </header>
  );
}
