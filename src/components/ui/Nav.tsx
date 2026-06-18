"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const LINKS = [
  { href: "/",        label: "Home",    section: "home"    },
  { href: "#work",    label: "Work",    section: "work"    },
  { href: "#about",   label: "About",   section: "about"   },
  { href: "#contact", label: "Contact", section: "contact" },
];

const SECTIONS = LINKS.map((l) => l.section);

const PAD       = "clamp(16px, 1.6vw, 28px)";
const LINK_SIZE = "clamp(9px, 0.75vw, 12px)";
const LOGO_SIZE = "clamp(13px, 1.1vw, 18px)";
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const rm = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      if (window.scrollY < window.innerHeight * 0.3) {
        setActive("home");
        return;
      }
      let found = "home";
      for (const id of SECTIONS.filter((s) => s !== "home")) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (mid >= top && mid < top + el.offsetHeight) {
          found = id;
          break;
        }
      }
      setActive(found);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const show = true;

  return (
    <>
      {/* ── Logo — top left ── */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="hidden md:block"
        initial={rm ? false : { y: -48, opacity: 0 }}
        animate={show ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        style={{
          position:      "fixed",
          left:          PAD,
          top:           PAD,
          zIndex:        100,
          fontFamily:    "var(--font-display)",
          fontStyle:     "italic",
          fontWeight:    300,
          fontSize:      LOGO_SIZE,
          letterSpacing: "0.05em",
          // White + difference blend = auto-inverts over any background
          color:         "white",
          mixBlendMode:  "difference",
          background:    "none",
          border:        "none",
          padding:       0,
          cursor:        "pointer",
          lineHeight:    1,
          userSelect:    "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.4")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        AW
      </motion.button>

      {/* ── Nav links — top right ── */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex"
        style={{
          position:      "fixed",
          right:         PAD,
          top:           PAD,
          zIndex:        100,
          flexDirection: "column",
          alignItems:    "flex-end",
          gap:           "clamp(10px, 0.9vw, 16px)",
          // Blend entire nav column together
          mixBlendMode:  "difference",
        }}
      >
        {LINKS.map(({ href, label, section }, i) => {
          const isActive = active === section;
          return (
            <motion.div
              key={href}
              initial={rm ? false : { y: -48, opacity: 0 }}
              animate={show ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width:        4,
                  height:       4,
                  borderRadius: "50%",
                  background:   "white",
                  flexShrink:   0,
                  opacity:      isActive ? 1 : 0,
                  transition:   "opacity 0.3s",
                }}
              />
              <Link
                href={href}
                style={{
                  fontFamily:     "var(--font-mono)",
                  fontSize:       LINK_SIZE,
                  textTransform:  "uppercase",
                  letterSpacing:  "0.1em",
                  color:          "white",
                  opacity:        isActive ? 1 : 0.55,
                  textDecoration: "none",
                  transition:     "opacity 0.3s",
                  display:        "block",
                  lineHeight:     1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = isActive ? "1" : "0.55")
                }
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </>
  );
}
