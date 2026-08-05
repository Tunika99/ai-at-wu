"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/site";
import type { SiteSettings } from "@/lib/data";
import { ScrambleText } from "@/components/ScrambleText";
import { CtaButton } from "@/components/CtaButton";
import { Marquee } from "@/components/Marquee";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Entrance choreography timing (seconds). The @ intro and all reveals
 * run as pure CSS animations so the landing sequence works even if the
 * JS animation loop stalls; framer-motion only adds progressive extras
 * (cursor parallax, count-up).
 */
const CONTENT_DELAY = 2.1;

/**
 * Renders the final value in markup and only counts up when the JS
 * animation loop is actually running - if it never ticks, the real
 * number is already on screen.
 */
function CountUp({
  from = 0,
  to,
  suffix = "",
}: {
  from?: number;
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(from, to, {
      duration: 1.8,
      ease,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, from, to, suffix]);

  return <span ref={ref}>{`${to}${suffix}`}</span>;
}

/**
 * The rotating "@" - the brand mark. A spinning glyph inside
 * counter-rotating blueprint construction circles with handle dots,
 * borrowed from the Oryzo intro aesthetic. All rotation is CSS.
 */
function AtOrbit() {
  return (
    <span className="relative inline-flex h-[1.05em] w-[1.1em] items-center justify-center">
      <span className="spin-30 pointer-events-none absolute inset-[-12%] rounded-full border border-dashed border-neon/35">
        <span className="absolute top-0 left-1/2 h-[0.055em] w-[0.055em] -translate-x-1/2 -translate-y-1/2 bg-neon" />
        <span className="absolute bottom-0 left-1/2 h-[0.055em] w-[0.055em] -translate-x-1/2 translate-y-1/2 bg-neon" />
        <span className="absolute top-1/2 left-0 h-[0.055em] w-[0.055em] -translate-x-1/2 -translate-y-1/2 bg-neon" />
        <span className="absolute top-1/2 right-0 h-[0.055em] w-[0.055em] translate-x-1/2 -translate-y-1/2 bg-neon" />
      </span>
      <span className="spin-48-rev pointer-events-none absolute inset-[-28%] rounded-full border border-dotted border-pulse/25" />
      <span className="spin-18 text-gradient inline-block leading-none">@</span>
    </span>
  );
}

export function Hero({
  settings = {
    mission: site.mission,
    foundedYear: site.foundedYear,
    memberCount: site.memberCount,
    eventsPerYear: site.eventsPerYear,
  },
}: {
  settings?: SiteSettings;
}) {
  const memberValue = parseInt(settings.memberCount, 10);
  const memberSuffix = settings.memberCount.replace(/[0-9]/g, "");
  const eventsValue = parseInt(settings.eventsPerYear, 10);
  const eventsSuffix = settings.eventsPerYear.replace(/[0-9]/g, "");

  // Cursor parallax: auras drift with the pointer, headline drifts subtly.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 15 });
  const sy = useSpring(my, { stiffness: 40, damping: 15 });
  const auraX = useTransform(sx, [-1, 1], [-40, 40]);
  const auraY = useTransform(sy, [-1, 1], [-25, 25]);
  const auraX2 = useTransform(sx, [-1, 1], [30, -30]);
  const auraY2 = useTransform(sy, [-1, 1], [20, -20]);
  const headX = useTransform(sx, [-1, 1], [-10, 10]);
  const headY = useTransform(sy, [-1, 1], [-6, 6]);

  return (
    <section
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
      }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-24 text-center md:px-8"
    >
      {/* Parallax auras above the global backdrop */}
      <motion.div
        style={{ x: auraX, y: auraY }}
        className="absolute -top-40 left-1/2 -z-10 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-neon/15 blur-[140px]"
      />
      <motion.div
        style={{ x: auraX2, y: auraY2 }}
        className="absolute -right-40 -bottom-56 -z-10 h-[30rem] w-[30rem] rounded-full bg-pulse/15 blur-[140px]"
      />

      {/* HUD corner annotations */}
      <span
        style={{ animationDelay: "2.8s" }}
        className="hero-reveal absolute top-24 left-6 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ 48.2131° N - 16.4085° E ]
      </span>
      <span
        style={{ animationDelay: "2.8s" }}
        className="hero-reveal absolute top-24 right-6 hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-mist/50 md:flex"
      >
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
        SYS.ONLINE
      </span>
      <span
        style={{ animationDelay: "3s" }}
        className="hero-reveal absolute bottom-16 left-6 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ WELTHANDELSPLATZ 1 - 1020 WIEN ]
      </span>
      <span
        style={{ animationDelay: "3s" }}
        className="hero-reveal absolute right-6 bottom-16 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ V1.0 // OPEN BETA ]
      </span>

      {/* Headline: the @ lands from its giant intro spin and releases AI / WU */}
      <motion.h1
        style={{ x: headX, y: headY }}
        className="font-display flex items-center gap-[0.18em] text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
      >
        <span className="word-release-left relative z-0 inline-block">
          <ScrambleText
            words={["AI", "ML", "NN", "AI", "DL", "RL", "AI", "CV"]}
            className="inline-block w-[1.42em] text-center"
          />
        </span>
        <span className="at-intro relative z-10 inline-block">
          <AtOrbit />
        </span>
        <span className="word-release-right relative z-0 inline-block">
          WU
        </span>
      </motion.h1>

      {/* Mission statement */}
      <p
        style={{ animationDelay: `${CONTENT_DELAY + 0.15}s` }}
        className="hero-reveal mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg"
      >
        {settings.mission}
      </p>

      {/* CTAs - the navbar watches this to decide when to light up its own */}
      <div
        id="hero-cta"
        style={{ animationDelay: `${CONTENT_DELAY + 0.3}s` }}
        className="hero-reveal mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <CtaButton href={site.cta.joinHref}>{site.cta.joinLabel}</CtaButton>
        <CtaButton href="/#events" variant="ghost">
          Explore the Program
        </CtaButton>
      </div>

      {/* Stats with count-up */}
      <dl
        style={{ animationDelay: `${CONTENT_DELAY + 0.45}s` }}
        className="hero-reveal mt-16 flex items-stretch gap-0 divide-x divide-line"
      >
        <div className="flex flex-col gap-1.5 px-8 md:px-12">
          <dd className="font-display text-3xl font-semibold text-ink md:text-4xl">
            <CountUp from={1990} to={settings.foundedYear} />
          </dd>
          <dt className="font-mono text-[10px] tracking-[0.2em] text-mist">
            [ FOUNDED ]
          </dt>
        </div>
        <div className="flex flex-col gap-1.5 px-8 md:px-12">
          <dd className="font-display text-3xl font-semibold text-ink md:text-4xl">
            <CountUp to={memberValue} suffix={memberSuffix} />
          </dd>
          <dt className="font-mono text-[10px] tracking-[0.2em] text-mist">
            [ MEMBERS ]
          </dt>
        </div>
        <div className="flex flex-col gap-1.5 px-8 md:px-12">
          <dd className="font-display text-3xl font-semibold text-ink md:text-4xl">
            <CountUp to={eventsValue} suffix={eventsSuffix} />
          </dd>
          <dt className="font-mono text-[10px] tracking-[0.2em] text-mist">
            [ EVENTS / YEAR ]
          </dt>
        </div>
      </dl>

      {/* Scroll cue */}
      <div
        style={{ animationDelay: "3s" }}
        className="hero-reveal absolute bottom-16 flex flex-col items-center gap-2"
      >
        <span className="cue-bob h-8 w-px bg-gradient-to-b from-neon/80 to-transparent" />
      </div>

      <div style={{ animationDelay: "2.9s" }} className="hero-reveal">
        <Marquee />
      </div>
    </section>
  );
}
