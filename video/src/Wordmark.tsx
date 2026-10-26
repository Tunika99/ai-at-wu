import React from "react";
import { interpolate } from "remotion";
import { C, GRADIENT, display, type Anchor, type Box } from "./theme";
import { easeInOut, easeOut, hash } from "./motion";

/**
 * "AI @ VIENNA" with SOCIETY riding above VIENNA - the website hero,
 * frame-driven. Positions are computed (not measured) so the network's
 * keep-out boxes match the letters exactly.
 */
export function wordmarkLayout(fs: number, cx: number, cy: number) {
  const ai = 0.62 * fs, gap = 0.18 * fs, orbit = 1.1 * fs, vienna = 2.42 * fs;
  const x0 = cx - (ai + gap + orbit + gap + vienna) / 2;
  const vx = x0 + ai + gap + orbit + gap;
  return {
    ai: { x: x0, y: cy - 0.5 * fs, w: ai, h: fs } as Box,
    at: { cx: x0 + ai + gap + orbit / 2, cy },
    vienna: { x: vx, y: cy - 0.5 * fs, w: vienna, h: fs } as Box,
    society: { x: vx, y: cy - 0.8 * fs, w: vienna * 0.95, h: 0.28 * fs } as Box,
  };
}

/** Degrees the orbit ring has turned at time t (website: one turn per 30 s). */
const ringAngle = (t: number) => t * 12;

/** The four handles on the orbit ring, as network anchors. */
export function orbitAnchors(fs: number, cx: number, cy: number, t: number, strength: number): Anchor[] {
  const R = 0.67 * fs;
  return [0, 90, 180, 270].map((deg) => {
    const a = ((ringAngle(t) + deg) * Math.PI) / 180;
    return { x: cx + R * Math.sin(a), y: cy - R * Math.cos(a), color: C.neon, strength };
  });
}

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const WORDS = ["AI", "ML", "NN", "DL", "RL", "CV", "AI"];

/** "AI" cycles through AI acronyms with a short scramble, then settles. */
function scrambled(f: number, from: number, to: number) {
  if (f < from || f >= to) return "AI";
  const step = 14;
  const k = Math.floor((f - from) / step);
  const word = WORDS[Math.min(k, WORDS.length - 1)];
  if ((f - from) % step < 5 && k > 0) {
    return word
      .split("")
      .map((_, i) => SCRAMBLE[hash(f, i + k * 3) % SCRAMBLE.length])
      .join("");
  }
  return word;
}

type Props = {
  f: number;
  t: number;
  fs: number;
  cx: number;
  cy: number;
  /** frames: when the @ starts flying in and how long the fly-in takes */
  introAt: number;
  introDur: number;
  /** how big / how much rotation the @ starts with */
  startScale: number;
  startTurns: number;
  /** frames: when AI and VIENNA are released, and for how long */
  releaseAt: number;
  releaseDur: number;
  scramble?: [number, number];
  /** degrees per second the glyph keeps turning once it has landed (0 = stays upright) */
  glyphSpin?: number;
  style?: React.CSSProperties;
};

export const Wordmark: React.FC<Props> = ({ f, t, fs, cx, cy, introAt, introDur, startScale, startTurns, releaseAt, releaseDur, scramble, glyphSpin = 20, style }) => {
  const L = wordmarkLayout(fs, cx, cy);

  // @ intro: opens huge, holds a beat (18%), then spins down into place
  const hold = introAt + introDur * 0.18;
  const appear = interpolate(f, [introAt, hold], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const land = interpolate(f, [hold, introAt + introDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut });
  const scale = startScale + (1 - startScale) * land;
  const turn = startTurns * 360 * (1 - land);
  // the slow idle spin counts from the landing, so the @ always lands upright
  const idle = (glyphSpin * Math.max(0, f - (introAt + introDur))) / 30;

  // AI / VIENNA released from behind the @ with a slight overshoot
  const p = interpolate(f, [releaseAt, releaseAt + releaseDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordOpacity = interpolate(p, [0, 0.55], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const shift = interpolate(p, [0, 0.8, 1], [85, -3, 0], { easing: easeOut });
  const wordScale = interpolate(p, [0, 0.8, 1], [0.6, 1.01, 1], { easing: easeOut });

  const word: React.CSSProperties = {
    position: "absolute",
    fontFamily: display,
    fontWeight: 700,
    fontSize: fs,
    lineHeight: 1,
    letterSpacing: "-0.025em",
    color: C.ink,
    whiteSpace: "nowrap",
    opacity: wordOpacity,
  };

  const ring = (size: number, border: string, deg: number): React.CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${size}em`,
    height: `${size}em`,
    borderRadius: "50%",
    border,
    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
  });
  const handle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: "0.055em",
    height: "0.055em",
    background: C.neon,
    boxShadow: `0 0 0.06em ${C.neon}`,
    ...pos,
  });
  const line = Math.max(2, fs * 0.012);

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {/* flex-end: a wider scrambled word (MW, DL...) grows to the left, never into the @ */}
      <div style={{ ...word, left: L.ai.x, top: L.ai.y, width: L.ai.w, display: "flex", justifyContent: "flex-end", transform: `translateX(${shift}%) scale(${wordScale})` }}>
        {scramble ? scrambled(f, scramble[0], scramble[1]) : "AI"}
      </div>

      <div style={{ ...word, left: L.vienna.x, top: L.vienna.y, transform: `translateX(${-shift}%) scale(${wordScale})` }}>
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            fontSize: "0.26em",
            fontWeight: 500,
            letterSpacing: "0.42em",
            color: C.mist,
          }}
        >
          SOCIETY
        </div>
        VIENNA
      </div>

      <div
        style={{
          position: "absolute",
          left: L.at.cx,
          top: L.at.cy,
          width: 0,
          height: 0,
          fontSize: fs,
          opacity: appear,
          transform: `scale(${scale}) rotate(${turn}deg)`,
        }}
      >
        <div style={ring(1.34, `${line}px dashed rgba(167,139,250,0.4)`, ringAngle(t))}>
          <div style={handle({ top: 0, left: "50%", transform: "translate(-50%, -50%)" })} />
          <div style={handle({ bottom: 0, left: "50%", transform: "translate(-50%, 50%)" })} />
          <div style={handle({ left: 0, top: "50%", transform: "translate(-50%, -50%)" })} />
          <div style={handle({ right: 0, top: "50%", transform: "translate(50%, -50%)" })} />
        </div>
        <div style={ring(1.72, `${line}px dotted rgba(232,121,249,0.3)`, -t * 7.5)} />
        {/* Space Grotesk's @ ink sits 0.09em below its line box centre:
            heavier bottom padding puts the ink - and the spin axis - dead centre. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(-50%, -50%) rotate(${idle}deg)`,
            fontFamily: display,
            fontWeight: 700,
            lineHeight: 1,
            padding: "0.13em 0.1em 0.31em",
            background: GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 0.1em rgba(232,121,249,0.35))",
          }}
        >
          @
        </div>
      </div>
    </div>
  );
};

/**
 * Keep-out boxes of the visible words (once released) and of the @ glyph
 * itself (once landed), so no link ever cuts through the letters. The @ box
 * stays inside the orbit ring, so the handles can still wire outwards.
 */
export function wordmarkBoxes(fs: number, cx: number, cy: number, released: boolean, landed = released): Box[] {
  const L = wordmarkLayout(fs, cx, cy);
  const at: Box = { x: L.at.cx - 0.45 * fs, y: L.at.cy - 0.45 * fs, w: 0.9 * fs, h: 0.9 * fs };
  return [...(released ? [L.ai, L.vienna, L.society] : []), ...(landed ? [at] : [])];
}
