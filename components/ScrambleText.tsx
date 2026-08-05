"use client";

import { useEffect, useRef, useState } from "react";

/** Restrained glyph set - technical, not noisy. */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01∆⁄#%";

/**
 * Cycles through words with a character-scramble transition. Each swap
 * settles letter by letter while the text softens (blur + slight dim)
 * and snaps crisp on arrival, so the effect reads as a refined machine
 * readout rather than a glitch. Static first word under reduced motion.
 */
export function ScrambleText({
  words,
  holdMs = 3400,
  className = "",
}: {
  words: string[];
  holdMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(words[0]);
  const [settling, setSettling] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrambleIv: number | undefined;
    const cycleIv = window.setInterval(() => {
      index.current = (index.current + 1) % words.length;
      const target = words[index.current];
      const totalFrames = 16;
      let frame = 0;

      setSettling(true);
      window.clearInterval(scrambleIv);
      scrambleIv = window.setInterval(() => {
        frame++;
        // Ease the settle so the last letters lock in slightly slower.
        const progress = 1 - Math.pow(1 - frame / totalFrames, 2);
        const settled = Math.floor(progress * target.length);
        let out = "";
        for (let i = 0; i < target.length; i++) {
          out +=
            i < settled
              ? target[i]
              : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(out);
        if (frame >= totalFrames) {
          window.clearInterval(scrambleIv);
          setDisplay(target);
          setSettling(false);
        }
      }, 42);
    }, holdMs);

    return () => {
      window.clearInterval(cycleIv);
      window.clearInterval(scrambleIv);
    };
  }, [words, holdMs]);

  return (
    <span
      className={`${className} transition-[filter,opacity] duration-300 ${
        settling ? "opacity-80 blur-[1.5px]" : "opacity-100 blur-0"
      }`}
    >
      {display}
    </span>
  );
}
