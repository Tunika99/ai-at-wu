import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FPS } from "./theme";

/** Drifting purple nebula + blueprint grid, as on the website. */
export const Background: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const d = (phase: number, speed: number, amp: number) => amp * Math.sin(t * speed + phase);
  const grid = "rgba(167, 139, 250, 0.06)";
  const mask = "radial-gradient(ellipse 95% 70% at 50% 45%, black 35%, transparent 100%)";
  return (
    <AbsoluteFill style={{ background: C.void }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(48% 26% at ${22 + d(0, 0.25, 5)}% ${18 + d(1, 0.2, 3)}%, rgba(139, 92, 246, 0.22), transparent 70%)`,
            `radial-gradient(40% 24% at ${82 + d(2, 0.22, 4)}% ${12 + d(3, 0.3, 3)}%, rgba(217, 70, 239, 0.12), transparent 70%)`,
            `radial-gradient(55% 30% at ${62 + d(4, 0.18, 5)}% ${84 + d(5, 0.24, 3)}%, rgba(109, 40, 217, 0.2), transparent 70%)`,
          ].join(", "),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${grid} 1px, transparent 1px), linear-gradient(to bottom, ${grid} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.45))" }} />
    </AbsoluteFill>
  );
};
