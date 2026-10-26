import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, type Box } from "./theme";
import { ramp } from "./motion";

/** The website's corner HUD labels. */
const ITEMS: { text: string; box: Box; align: "left" | "right" }[] = [
  { text: "[ 48.2131° N - 16.4085° E ]", box: { x: 44, y: 60, w: 440, h: 28 }, align: "left" },
  { text: "● SYS.ONLINE", box: { x: 816, y: 60, w: 220, h: 28 }, align: "right" },
  { text: "[ WELTHANDELSPLATZ 1 - 1020 WIEN ]", box: { x: 44, y: 1832, w: 540, h: 28 }, align: "left" },
  { text: "[ EST. 2026 ]", box: { x: 816, y: 1832, w: 220, h: 28 }, align: "right" },
];

export const HUD_IN = 48;
export const hudBoxes = (f: number): Box[] => (f >= HUD_IN ? ITEMS.map((i) => i.box) : []);

/** `bottomRight` swaps the last label (the teaser leaves out the founding year). */
export const Hud: React.FC<{ bottomRight?: string }> = ({ bottomRight }) => {
  const f = useCurrentFrame();
  const o = ramp(f, HUD_IN, HUD_IN + 24) * 0.75;
  return (
    <>
      {ITEMS.map(({ text: label, box, align }, i) => {
        const text = i === ITEMS.length - 1 && bottomRight ? bottomRight : label;
        return (
        <div
          key={text}
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            textAlign: align,
            fontFamily: mono,
            fontSize: 19,
            letterSpacing: "0.2em",
            color: C.mist,
            opacity: o,
            whiteSpace: "nowrap",
          }}
        >
          {text.startsWith("●") ? (
            <>
              <span style={{ color: C.neon }}>●</span>
              {text.slice(1)}
            </>
          ) : (
            text
          )}
        </div>
        );
      })}
    </>
  );
};
