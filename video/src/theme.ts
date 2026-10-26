import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

/** Vertical 9:16 for Reels / TikTok / LinkedIn mobile. */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Same tokens as the website (app/globals.css). */
export const C = {
  void: "#08060f",
  abyss: "#0d0a19",
  panel: "#131022",
  neon: "#a78bfa",
  pulse: "#e879f9",
  ink: "#eae7f4",
  mist: "#a09aba",
};

export const GRADIENT = "linear-gradient(100deg, #eae7f4 10%, #a78bfa 55%, #e879f9 90%)";

export const display = loadDisplay("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const sans = loadSans("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

/** A keep-out rectangle: the neural network never draws through it (like the site). */
export type Box = { x: number; y: number; w: number; h: number };
/** A network node that belongs to the content (the @ handles, section dots). */
export type Anchor = { x: number; y: number; color: string; strength: number };
