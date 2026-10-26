import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { C, GRADIENT, display, mono } from "../theme";
import { hash } from "../motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Punch-in on a beat: overshoot scale + chromatic split, decaying fast. */
export function punch(f: number, at: number) {
  const p = Math.max(0, f - at);
  return { scale: 1 + 0.22 * Math.exp(-p / 2.6), split: 18 * Math.exp(-p / 3.2) };
}

/** Big kinetic word with an RGB-style split in the brand colours. */
export const KineticWord: React.FC<{
  f: number;
  at: number;
  lines: string[];
  size?: number;
  y?: number;
  gradientLast?: boolean;
}> = ({ f, at, lines, size, y = 960, gradientLast = false }) => {
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = size ?? Math.min(270, 960 / (longest * 0.6));
  const { scale, split } = punch(f, at);
  const layer = (color: string | null, dx: number, blend: boolean) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${dx}px)`,
        mixBlendMode: blend ? "screen" : undefined,
        opacity: blend ? 0.85 : 1,
      }}
    >
      {lines.map((l, i) => {
        const grad = gradientLast && i === lines.length - 1 && !color;
        return (
          <div key={i} style={grad ? { background: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: "0.08em" } : { color: color ?? C.ink }}>
            {l}
          </div>
        );
      })}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        transform: `translateY(-50%) scale(${scale})`,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 700,
        fontSize: fs,
        lineHeight: 0.98,
        letterSpacing: "-0.035em",
        whiteSpace: "nowrap",
      }}
    >
      {/* invisible copy gives the block its size */}
      <div style={{ visibility: "hidden" }}>{lines.map((l, i) => <div key={i}>{l}</div>)}</div>
      {split > 0.5 && layer(C.pulse, split, true)}
      {split > 0.5 && layer(C.neon, -split, true)}
      {layer(null, 0, false)}
    </div>
  );
};

/** Short white flash on a cut. */
export const Flash: React.FC<{ f: number; at: number; strength?: number; len?: number }> = ({ f, at, strength = 0.85, len = 7 }) => {
  if (f < at || f > at + len) return null;
  const o = interpolate(f, [at, at + len], [strength, 0], clamp);
  return <AbsoluteFill style={{ background: "#f5f3ff", opacity: o, mixBlendMode: "screen" }} />;
};

/** Animated film grain - hides the upscaled phone footage's softness. */
export const Grain: React.FC<{ f: number; opacity?: number }> = ({ f, opacity = 0.09 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%" viewBox="0 0 540 960" preserveAspectRatio="none">
      <filter id={`g${f % 6}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={(f % 6) + 1} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="540" height="960" filter={`url(#g${f % 6})`} />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 65% at 50% 48%, transparent 45%, rgba(4,2,10,${strength}))`, pointerEvents: "none" }} />
);

/* ------------------------------------------------------------------ footage */

/** The LC night clip as 284 upscaled frames (60 fps source). */
const FRAMES = 284;
const SRC_FPS = 60;
export const SRC_W = 478;
export const SRC_H = 850;
export const K = 1080 / SRC_W; // source px -> canvas px

export const Footage: React.FC<{
  t: number;
  scale?: number;
  origin?: string;
  grade?: { brightness?: number; blur?: number; tint?: number };
  children?: React.ReactNode;
}> = ({ t, scale = 1, origin = "50% 50%", grade = {}, children }) => {
  const i = Math.min(FRAMES, Math.max(1, Math.round(t * SRC_FPS) + 1));
  const { brightness = 1, blur = 0, tint = 0.3 } = grade;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin }}>
        <Img
          src={staticFile(`footage/lc-night/${String(i).padStart(4, "0")}.jpg`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `brightness(${brightness}) contrast(1.12) saturate(1.1)${blur ? ` blur(${blur}px)` : ""}`,
          }}
        />
        {/* grade the warm night lights into the brand's violet */}
        <AbsoluteFill style={{ background: `rgba(109,40,217,${tint})`, mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: "rgba(167,139,250,0.10)", mixBlendMode: "screen" }} />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- AI overlays */

type Rect = { x: number; y: number; w: number; h: number };

/** Computer-vision style detection box with a typed label. */
export const DetectBox: React.FC<{ f: number; at: number; r: Rect; label: string; score: number; scale?: number }> = ({ f, at, r, label, score, scale = 1 }) => {
  if (f < at) return null;
  const p = interpolate(f, [at, at + 7], [0, 1], { ...clamp });
  const grow = 1 + (1 - p) * 0.35;
  const typed = label.slice(0, Math.ceil(interpolate(f, [at + 3, at + 15], [0, label.length], clamp)));
  const lw = 2.4 / scale;
  const c = 26 / scale;
  const corner = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", width: c, height: c, borderColor: C.neon, borderStyle: "solid", borderWidth: 0, ...s });
  return (
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, opacity: p, transform: `scale(${grow})`, transformOrigin: "center" }}>
      <div style={{ position: "absolute", inset: 0, border: `${lw * 0.6}px solid rgba(167,139,250,0.55)`, background: "rgba(167,139,250,0.06)" }} />
      <div style={corner({ left: -lw, top: -lw, borderTopWidth: lw * 2, borderLeftWidth: lw * 2 })} />
      <div style={corner({ right: -lw, top: -lw, borderTopWidth: lw * 2, borderRightWidth: lw * 2 })} />
      <div style={corner({ left: -lw, bottom: -lw, borderBottomWidth: lw * 2, borderLeftWidth: lw * 2 })} />
      <div style={corner({ right: -lw, bottom: -lw, borderBottomWidth: lw * 2, borderRightWidth: lw * 2 })} />
      <div
        style={{
          position: "absolute",
          left: -lw,
          bottom: "100%",
          marginBottom: 6 / scale,
          whiteSpace: "nowrap",
          fontFamily: mono,
          fontWeight: 600,
          fontSize: 22 / scale,
          letterSpacing: "0.08em",
          padding: `${5 / scale}px ${10 / scale}px`,
          background: C.neon,
          color: C.void,
          boxShadow: `0 0 ${18 / scale}px rgba(167,139,250,0.7)`,
        }}
      >
        {typed}
        {typed.length === label.length ? ` ${score.toFixed(2)}` : ""}
      </div>
    </div>
  );
};

/** Pseudo-random glitch offset for a frame (deterministic). */
export const jitter = (f: number, amp: number) => ((hash(f, 7) % 1000) / 1000 - 0.5) * 2 * amp;
