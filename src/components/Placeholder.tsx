"use client";

import { useId } from "react";

// ── Design tokens (hardcoded so SVG inherits them without CSS var support)
const FILL  = "#DEDAD4"; // --c-placeholder
const RULE  = "#C8C4BC"; // --c-border
const MUTED = "#6B6762"; // --c-mid

// ─────────────────────────────────────────────────────────────────────
// Crosshair — for project cards.
// Registration marks at corners + center crosshair + annotation.
// Feels like a technical proof sheet or camera viewfinder.
// ─────────────────────────────────────────────────────────────────────
function Crosshair({ label }: { label?: string }) {
  return (
    <>
      <rect width="100" height="100" fill={FILL} />

      {/* Outer hairline border */}
      <rect x="0.3" y="0.3" width="99.4" height="99.4"
        fill="none" stroke={RULE} strokeWidth="0.3" />

      {/* Corner registration marks */}
      <path d="M4,11 L4,4 L11,4"   fill="none" stroke={RULE} strokeWidth="0.5" />
      <path d="M89,4 L96,4 L96,11" fill="none" stroke={RULE} strokeWidth="0.5" />
      <path d="M4,89 L4,96 L11,96" fill="none" stroke={RULE} strokeWidth="0.5" />
      <path d="M89,96 L96,96 L96,89" fill="none" stroke={RULE} strokeWidth="0.5" />

      {/* Center crosshair arms */}
      <line x1="50" y1="24" x2="50" y2="44" stroke={RULE} strokeWidth="0.4" />
      <line x1="50" y1="56" x2="50" y2="76" stroke={RULE} strokeWidth="0.4" />
      <line x1="24" y1="50" x2="44" y2="50" stroke={RULE} strokeWidth="0.4" />
      <line x1="56" y1="50" x2="76" y2="50" stroke={RULE} strokeWidth="0.4" />

      {/* Center ring + dot */}
      <circle cx="50" cy="50" r="5"   fill="none" stroke={RULE} strokeWidth="0.4" />
      <circle cx="50" cy="50" r="0.9" fill={RULE} />

      {/* Bottom annotation */}
      {label && (
        <text
          x="50" y="93"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="3.2"
          fill={MUTED}
          style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {label}
        </text>
      )}

      {/* Top-left stamp marker */}
      <text
        x="4" y="3.8"
        fontFamily="monospace"
        fontSize="2.8"
        fill={MUTED}
        style={{ letterSpacing: "0.08em" }}
      >
        ×
      </text>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Folio — for art gallery pieces.
// Horizontal ruling lines + left margin + small glyph mark.
// Feels like manuscript paper or a naturalist's field notebook page.
// ─────────────────────────────────────────────────────────────────────
function Folio({ uid, label }: { uid: string; label?: string }) {
  const patternId = `ruled-${uid}`;

  return (
    <>
      <defs>
        <pattern id={patternId} x="0" y="0" width="100" height="9" patternUnits="userSpaceOnUse">
          <line x1="0" y1="9" x2="100" y2="9"
            stroke={RULE} strokeWidth="0.35" strokeOpacity="0.65" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="100" height="100" fill={FILL} />

      {/* Ruling lines */}
      <rect width="100" height="100" fill={`url(#${patternId})`} />

      {/* Left margin line */}
      <line x1="12" y1="0" x2="12" y2="100" stroke={RULE} strokeWidth="0.35" />

      {/* Top edge rule */}
      <line x1="0" y1="9" x2="100" y2="9" stroke={RULE} strokeWidth="0.35" strokeOpacity="0.65" />

      {/* Small asterisk glyph in the margin, midway down */}
      <text
        x="6" y="51.5"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="5"
        fill={MUTED}
        fillOpacity="0.55"
      >
        *
      </text>

      {/* Label in margin at bottom */}
      {label && (
        <text
          x="6" y="95"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="3"
          fill={MUTED}
          fillOpacity="0.7"
          style={{ letterSpacing: "0.08em", writingMode: "vertical-rl" }}
        >
          {label.toUpperCase()}
        </text>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────

export type PlaceholderVariant = "crosshair" | "folio";

export default function Placeholder({
  variant = "crosshair",
  label,
  className = "",
}: {
  variant?: PlaceholderVariant;
  label?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  return (
    <div className={`w-full h-full ${className}`} aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {variant === "crosshair" && <Crosshair label={label} />}
        {variant === "folio"     && <Folio uid={uid} label={label} />}
      </svg>
    </div>
  );
}
