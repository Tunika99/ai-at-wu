"use client";

import { useId } from "react";

/**
 * The AI Society Vienna mark, in one place.
 *
 * Both letters are graphs from the same family: the A is three nodes
 * joined by two edges plus a crossbar, the I is two nodes and one edge.
 * The crossbar's intersections are open rings rather than filled dots -
 * in a network diagram, filled vs. open reads as a node's activation
 * state, which is what keeps the whole palette inside one hue family.
 *
 * Everything sizes in `em`, so a caller only sets font-size (and can do
 * that responsively with utility classes). `animated` runs the assembly
 * intro - nodes appear, edges draw themselves - as pure CSS, so the mark
 * still renders correctly if scripts stall.
 */

/** Geometry, shared by every size. Viewbox is 45 x 33. */
const A_EDGES = "M3 28.5 L16 3.5 L29 28.5";
const A_BAR = "M6.64 21.5 L25.36 21.5";
const I_STEM = "M39 3.5 L39 28.5";

const VIOLET = "#a78bfa";
const FUCHSIA = "#e879f9";
const LILAC = "#c4b5fd";

/** Assembly timing in seconds, only used when `animated`. */
const T = {
  aEdges: 0.1,
  apex: 0.72,
  footL: 0.82,
  footR: 0.89,
  bar: 0.98,
  ringL: 1.32,
  ringR: 1.39,
  iStem: 1.22,
  iTop: 1.52,
  iFoot: 1.59,
  rule: 1.8,
  society: 1.95,
  vienna: 2.05,
} as const;

/** Seconds after mount at which the lockup has finished assembling. */
export const LOGO_INTRO_END = 2.35;

function at(animated: boolean, seconds: number) {
  return animated ? { animationDelay: `${seconds}s` } : undefined;
}

/**
 * Registers a node with the site's neural backdrop (see NeuralField):
 * particles wire into it and signal pulses start and end here. Reach is
 * in px; the logo's nodes are the hub, so they reach furthest.
 */
function anchor(on: boolean, color: string, radius: number) {
  return on
    ? { "data-neural-anchor": color, "data-neural-radius": radius }
    : {};
}

/** The A alone - the icon cut straight out of the wordmark. */
export function LogoIcon({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={id}
          x1="3"
          y1="3"
          x2="29"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={VIOLET} />
          <stop offset="1" stopColor={FUCHSIA} />
        </linearGradient>
      </defs>
      <path
        d={A_EDGES}
        stroke={`url(#${id})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={A_BAR} stroke={VIOLET} strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="16" cy="3.5" r="3.2" fill={FUCHSIA} />
      <circle cx="3" cy="28.5" r="2.8" fill={VIOLET} />
      <circle cx="29" cy="28.5" r="2.8" fill={VIOLET} />
      <circle
        cx="6.64"
        cy="21.5"
        r="1.75"
        fill="none"
        stroke={LILAC}
        strokeWidth="1.5"
      />
      <circle
        cx="25.36"
        cy="21.5"
        r="1.75"
        fill="none"
        stroke={LILAC}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** The AI pair. Height is 1em; width follows the viewbox ratio. */
export function LogoMark({
  animated = false,
  neural = false,
  className = "",
}: {
  animated?: boolean;
  /** Plug this mark's nodes into the site's neural backdrop. */
  neural?: boolean;
  className?: string;
}) {
  const id = useId();
  const node = animated ? "logo-node" : "";
  const edge = animated ? "logo-edge" : "";
  return (
    <svg
      viewBox="0 0 45 33"
      fill="none"
      aria-hidden="true"
      style={{ height: "1em", width: "auto" }}
      className={`${animated ? "logo-anim" : ""} shrink-0 ${className}`}
    >
      <defs>
        <linearGradient
          id={id}
          x1="3"
          y1="3.5"
          x2="42"
          y2="28.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={VIOLET} />
          <stop offset="1" stopColor={FUCHSIA} />
        </linearGradient>
      </defs>

      <path
        d={A_EDGES}
        pathLength="1"
        stroke={`url(#${id})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={edge}
        style={at(animated, T.aEdges)}
      />
      <path
        d={A_BAR}
        pathLength="1"
        stroke={VIOLET}
        strokeWidth="2.1"
        strokeLinecap="round"
        className={edge}
        style={at(animated, T.bar)}
      />
      <path
        d={I_STEM}
        pathLength="1"
        stroke={`url(#${id})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        className={edge}
        style={at(animated, T.iStem)}
      />

      <circle
        cx="16"
        cy="3.5"
        r="3.2"
        fill={FUCHSIA}
        className={node}
        style={at(animated, T.apex)}
        {...anchor(neural, FUCHSIA, 260)}
      />
      <circle
        cx="3"
        cy="28.5"
        r="2.8"
        fill={VIOLET}
        className={node}
        style={at(animated, T.footL)}
        {...anchor(neural, VIOLET, 230)}
      />
      <circle
        cx="29"
        cy="28.5"
        r="2.8"
        fill={VIOLET}
        className={node}
        style={at(animated, T.footR)}
        {...anchor(neural, VIOLET, 230)}
      />
      <circle
        cx="6.64"
        cy="21.5"
        r="1.75"
        fill="none"
        stroke={LILAC}
        strokeWidth="1.5"
        className={node}
        style={at(animated, T.ringL)}
        {...anchor(neural, LILAC, 180)}
      />
      <circle
        cx="25.36"
        cy="21.5"
        r="1.75"
        fill="none"
        stroke={LILAC}
        strokeWidth="1.5"
        className={node}
        style={at(animated, T.ringR)}
        {...anchor(neural, LILAC, 180)}
      />
      <circle
        cx="39"
        cy="3.5"
        r="3.2"
        fill={FUCHSIA}
        className={node}
        style={at(animated, T.iTop)}
        {...anchor(neural, FUCHSIA, 240)}
      />
      <circle
        cx="39"
        cy="28.5"
        r="2.8"
        fill={VIOLET}
        className={node}
        style={at(animated, T.iFoot)}
        {...anchor(neural, VIOLET, 220)}
      />
    </svg>
  );
}

/**
 * Mark, rule, and the rest of the name. `stacked` puts SOCIETY over
 * VIENNA (hero); otherwise they sit on one line (navbar, footer).
 *
 * Stacked, the two words carry slightly different tracking so both
 * lines come out roughly the same width beside the rule.
 *
 * `depth` stages mark, rule and words on separate Z planes, so when a
 * parent tilts the lockup in 3D the parts parallax against each other.
 * The planes sit on wrappers because the intro animations own the
 * `transform` of the rule and the words themselves.
 */
export function LogoLockup({
  stacked = false,
  animated = false,
  neural = false,
  depth = false,
  className = "",
}: {
  stacked?: boolean;
  animated?: boolean;
  neural?: boolean;
  depth?: boolean;
  className?: string;
}) {
  const plane = (z: string) =>
    depth
      ? ({ display: "inline-flex", transform: `translateZ(${z})`, transformStyle: "preserve-3d" } as const)
      : ({ display: "inline-flex" } as const);
  return (
    <span
      className={`inline-flex items-center ${className}`}
      role="img"
      aria-label="AI Society Vienna"
      style={depth ? { transformStyle: "preserve-3d" } : undefined}
    >
      <span style={plane("0.45em")}>
        <LogoMark animated={animated} neural={neural} />
      </span>
      <span style={plane("0.2em")}>
      <span
        aria-hidden="true"
        className={animated ? "logo-rule" : undefined}
        style={{
          width: "0.038em",
          height: "0.92em",
          background: "currentColor",
          flexShrink: 0,
          marginLeft: "0.19em",
          marginRight: "0.26em",
          ...at(animated, T.rule),
        }}
      />
      </span>
      <span
        className={`font-display flex ${stacked ? "flex-col" : "flex-row"}`}
        style={{
          gap: stacked ? "0.07em" : "0.16em",
          ...(depth ? { transform: "translateZ(0.12em)" } : {}),
        }}
      >
        <span
          className={animated ? "logo-word" : undefined}
          style={{
            fontSize: stacked ? "0.37em" : "0.4em",
            fontWeight: 500,
            letterSpacing: "0.08em",
            lineHeight: 1,
            ...at(animated, T.society),
          }}
        >
          SOCIETY
        </span>
        <span
          className={animated ? "logo-word" : undefined}
          style={{
            fontSize: stacked ? "0.37em" : "0.4em",
            fontWeight: 500,
            letterSpacing: stacked ? "0.14em" : "0.08em",
            lineHeight: 1,
            ...at(animated, T.vienna),
          }}
        >
          VIENNA
        </span>
      </span>
    </span>
  );
}
