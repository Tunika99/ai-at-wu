"use client";

import type { ReactNode } from "react";

/** Tile whose inner glow follows the cursor (see .glow-card in globals.css). */
export function GlowCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      className={`glow-card ${className}`}
    >
      {children}
    </div>
  );
}
