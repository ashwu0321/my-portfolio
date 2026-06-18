"use client";

import { useReducedMotion } from "framer-motion";

const ITEMS =
  "Python · Kafka · React · Next.js · TypeScript · Go · Docker · " +
  "AWS · PostgreSQL · C++ · Java · FastAPI · PyTorch · Linux · ";

export default function Marquee() {
  const rm = useReducedMotion();

  return (
    <div
      className="border-y border-hairline overflow-hidden"
      aria-hidden
    >
      <div
        className="flex py-3"
        style={{
          animation: rm ? "none" : "marquee 40s linear infinite",
          willChange: "transform",
        }}
      >
        {/* Two identical copies — animation moves -50% of total width for seamless loop */}
        {[0, 1].map((k) => (
          <span
            key={k}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted whitespace-nowrap shrink-0 px-12"
          >
            {ITEMS}
          </span>
        ))}
      </div>
    </div>
  );
}
