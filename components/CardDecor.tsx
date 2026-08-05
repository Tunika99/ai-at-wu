import type { Benefit } from "@/lib/content";

/**
 * Faint background motif per benefit tile. The member-portal tile carries
 * a file-list mockup, which made the plainer tiles look empty next to it;
 * these give each one a little visual weight without competing with the
 * copy. Purely decorative - low opacity, behind the content layer.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="absolute right-0 bottom-0 h-32 w-32 text-neon/25 md:h-36 md:w-36"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Speaker Access: sound radiating from a point. */
function Waves() {
  return (
    <Frame>
      <circle cx="26" cy="72" r="4" fill="currentColor" />
      <path d="M38 58a22 22 0 0 1 0 28" {...stroke} />
      <path d="M50 48a38 38 0 0 1 0 48" {...stroke} opacity="0.7" />
      <path d="M62 38a54 54 0 0 1 0 68" {...stroke} opacity="0.45" />
      <path d="M74 28a70 70 0 0 1 0 88" {...stroke} opacity="0.25" />
    </Frame>
  );
}

/** Career Fast-Track: an ascending trajectory over faint bars. */
function Trajectory() {
  return (
    <Frame>
      <path d="M18 96l22-16 22-26 26-32" {...stroke} />
      <circle cx="18" cy="96" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="40" cy="80" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="62" cy="54" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="88" cy="22" r="4" fill="currentColor" />
      <g opacity="0.25">
        <rect x="14" y="100" width="8" height="10" rx="1" fill="currentColor" />
        <rect x="36" y="92" width="8" height="18" rx="1" fill="currentColor" />
        <rect x="58" y="78" width="8" height="32" rx="1" fill="currentColor" />
        <rect x="80" y="60" width="8" height="50" rx="1" fill="currentColor" />
      </g>
    </Frame>
  );
}

/** Global Exchange: a transatlantic hop between two points. */
function Arc() {
  return (
    <Frame>
      <path d="M18 84q42-58 84-26" {...stroke} strokeDasharray="4 5" />
      <circle cx="18" cy="84" r="4.5" fill="currentColor" />
      <circle cx="102" cy="58" r="4.5" fill="currentColor" />
      <ellipse cx="60" cy="72" rx="42" ry="42" {...stroke} opacity="0.18" />
      <path d="M18 72h84" {...stroke} opacity="0.18" />
    </Frame>
  );
}

/** Community: a small cluster of connected people-nodes. */
function Cluster() {
  return (
    <Frame>
      <g opacity="0.5">
        <path d="M34 44l28 14M62 58l30-16M62 58l-20 34M62 58l32 30" {...stroke} />
      </g>
      <circle cx="34" cy="44" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="92" cy="42" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="42" cy="92" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="94" cy="88" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="62" cy="58" r="7" fill="currentColor" />
    </Frame>
  );
}

/** Hands-on Workshops: a faded snippet of what a session builds. */
function Snippet() {
  return (
    <pre
      className="pointer-events-none absolute right-5 bottom-5 font-mono text-[10px] leading-relaxed text-neon/20 select-none"
      aria-hidden="true"
    >
      {`agent = Agent(tools=[search])
agent.run("summarise WU news")
> done in 1.2s`}
    </pre>
  );
}

export function CardDecor({ icon }: { icon: Benefit["icon"] }) {
  switch (icon) {
    case "spark":
      return <Snippet />;
    case "nodes":
      return <Waves />;
    case "rocket":
      return <Trajectory />;
    case "globe":
      return <Arc />;
    case "users":
      return <Cluster />;
    // The portal tile already has its file-list mockup.
    default:
      return null;
  }
}
