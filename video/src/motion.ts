import { Easing, interpolate } from "remotion";

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.7, 0, 0.3, 1);
const easeIn = Easing.bezier(0.4, 0, 1, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0..1 between frames a and b. */
export const ramp = (f: number, a: number, b: number, easing = easeOut) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });

/**
 * Fade up + unblur in at `inAt`, drift up + blur out at `outAt` -
 * the site's reveal language. Returns a style object.
 */
export function reveal(f: number, inAt: number, outAt = Infinity, dist = 30) {
  const i = ramp(f, inAt, inAt + 20);
  const o = Number.isFinite(outAt) ? ramp(f, outAt, outAt + 15, easeIn) : 0;
  return {
    opacity: i * (1 - o),
    transform: `translateY(${(1 - i) * dist - o * 50}px)`,
    filter: `blur(${(1 - i) * 8 + o * 10}px)`,
  };
}

/** Multiplier that is 1 while visible and 0 after the scene's exit. */
export const alive = (f: number, outAt: number) => 1 - ramp(f, outAt, outAt + 15, easeIn);

/** Deterministic integer hash. */
export const hash = (a: number, b: number) => (((a * 73856093) ^ (b * 19349663)) >>> 0) % 1_000_003;
