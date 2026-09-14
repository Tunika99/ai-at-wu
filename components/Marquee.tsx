const items = [
  "WU VIENNA · EST. 2026",
  "WORKSHOPS",
  "SPEAKER NIGHTS",
  "HACKATHONS",
  "AI @ WHARTON EXCHANGE",
  "MEMBER PORTAL",
];

function Strip() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-mist/60">
            {item}
          </span>
          <span className="text-[9px] text-neon/70">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Infinite ticker along the bottom edge of the hero. */
export function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-line bg-void/40 py-3 backdrop-blur-sm"
    >
      <div className="marquee-track">
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
