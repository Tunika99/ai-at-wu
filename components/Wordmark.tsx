/**
 * The AI @ Society Vienna brand, back to the "@" idea: the @ is both the
 * mark and the word "at" - AI at Vienna. SOCIETY always rides directly
 * above VIENNA, so the name reads "AI @ Society Vienna".
 */

type AnchorAttrs = Record<string, string | number>;

/** Registers an element as a node of the site's neural backdrop (NeuralField). */
function anchor(on: boolean, color: string, radius: number, after: number): AnchorAttrs {
  return on
    ? {
        "data-neural-anchor": color,
        "data-neural-radius": radius,
        "data-neural-after": after,
      }
    : {};
}

/**
 * The rotating "@" - a spinning glyph inside counter-rotating blueprint
 * construction circles with handle dots. All rotation is CSS.
 *
 * With `neural`, the @ and its four handles are plugged into the network:
 * particles wire into them and signals fire from them. They stay dormant
 * until the giant intro spin has landed (~2s), so the wiring never chases
 * the @ while it is still flying in.
 */
export function AtOrbit({ neural = false }: { neural?: boolean }) {
  const handle = anchor(neural, "#a78bfa", 190, 2100);
  return (
    <span className="relative inline-flex h-[1.05em] w-[1.1em] items-center justify-center">
      <span className="spin-30 pointer-events-none absolute inset-[-12%] rounded-full border border-dashed border-neon/35">
        <span {...handle} className="absolute top-0 left-1/2 h-[0.055em] w-[0.055em] -translate-x-1/2 -translate-y-1/2 bg-neon" />
        <span {...handle} className="absolute bottom-0 left-1/2 h-[0.055em] w-[0.055em] -translate-x-1/2 translate-y-1/2 bg-neon" />
        <span {...handle} className="absolute top-1/2 left-0 h-[0.055em] w-[0.055em] -translate-x-1/2 -translate-y-1/2 bg-neon" />
        <span {...handle} className="absolute top-1/2 right-0 h-[0.055em] w-[0.055em] translate-x-1/2 -translate-y-1/2 bg-neon" />
      </span>
      <span className="spin-48-rev pointer-events-none absolute inset-[-28%] rounded-full border border-dotted border-pulse/25" />
      {/* Gradient text is only painted inside the element box, so the padding
          gives the spinning @ room. Space Grotesk's @ ink sits 0.09em below
          the centre of its line box, so the padding is 0.09em heavier at the
          bottom while the margins stay symmetric: the ink lands exactly in the
          middle of the rings and the spin turns around the ink's own centre.
          tracking-normal: the heading's negative letter-spacing would trim the
          box on the right and nudge the ink off-centre. */}
      <span
        {...anchor(neural, "#e879f9", 280, 2000)}
        className="spin-18 text-gradient -mx-[0.1em] -my-[0.22em] inline-block px-[0.1em] pt-[0.13em] pb-[0.31em] leading-none tracking-normal"
      >
        @
      </span>
    </span>
  );
}

/**
 * Static text wordmark for navbar, footer and the join page. Size it with
 * font-size on the parent; everything else is in em.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="AI Society Vienna"
      className={`font-display inline-flex items-end gap-[0.22em] leading-none font-semibold tracking-tight ${className}`}
    >
      <span>AI</span>
      {/* padding + equal negative margin: room for the @ ink below its box
          (gradient text is clipped to the box) without moving the layout */}
      <span className="text-gradient -m-[0.2em] inline-block p-[0.2em]">@</span>
      <span className="inline-flex flex-col items-start">
        <span className="mb-[0.16em] text-[0.36em] font-medium tracking-[0.34em] text-mist">
          SOCIETY
        </span>
        <span>VIENNA</span>
      </span>
    </span>
  );
}
