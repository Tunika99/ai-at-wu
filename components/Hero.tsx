"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/site";
import type { SiteSettings } from "@/lib/data";
import { ScrambleText } from "@/components/ScrambleText";
import { AtOrbit } from "@/components/Wordmark";
import { CtaButton } from "@/components/CtaButton";
import { Marquee } from "@/components/Marquee";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Entrance choreography timing (seconds). The @ intro and all reveals
 * run as pure CSS animations so the landing sequence works even if the
 * JS animation loop stalls; framer-motion only adds progressive extras
 * (cursor parallax, hover tilt, count-up).
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

  // Logo hover: while the pointer is over the mark it tilts toward it in
  // 3D, is pulled a little further (magnetic) and grows slightly. The
  // lockup's parts sit on separate depth planes, so the tilt parallaxes.
  const reduced = useReducedMotion();
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const hover = useMotionValue(0);
  const slx = useSpring(lx, { stiffness: 120, damping: 13, mass: 0.6 });
  const sly = useSpring(ly, { stiffness: 120, damping: 13, mass: 0.6 });
  const shover = useSpring(hover, { stiffness: 160, damping: 18 });
  const logoX = useTransform([sx, slx], ([a, b]: number[]) => a * 10 + b * 18);
  const logoY = useTransform([sy, sly], ([a, b]: number[]) => a * 6 + b * 12);
  const logoRotY = useTransform(slx, [-1, 1], [-15, 15]);
  const logoRotX = useTransform(sly, [-1, 1], [12, -12]);
  const logoScale = useTransform(shover, [0, 1], [1, 1.05]);

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
        data-neural-avoid=""
        className="hero-reveal absolute top-24 left-6 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ 48.2131° N - 16.4085° E ]
      </span>
      <span
        style={{ animationDelay: "2.8s" }}
        data-neural-avoid=""
        className="hero-reveal absolute top-24 right-6 hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-mist/50 md:flex"
      >
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
        SYS.ONLINE
      </span>
      <span
        style={{ animationDelay: "3s" }}
        data-neural-avoid=""
        className="hero-reveal absolute bottom-16 left-6 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ WELTHANDELSPLATZ 1 - 1020 WIEN ]
      </span>
      <span
        style={{ animationDelay: "3s" }}
        data-neural-avoid=""
        className="hero-reveal absolute right-6 bottom-16 hidden font-mono text-[10px] tracking-[0.2em] text-mist/50 md:block"
      >
        [ V1.0 // OPEN BETA ]
      </span>

      {/* Headline: the @ lands from its giant intro spin and releases AI and
          VIENNA. SOCIETY rides directly above VIENNA, so the name reads
          "AI @ Society Vienna". The parts sit on separate depth planes, so
          the hover tilt parallaxes - the @ floats in front. */}
      <motion.h1
        aria-label="AI Society Vienna"
        onPointerMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          lx.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)));
          ly.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)));
          hover.set(1);
        }}
        onPointerLeave={() => {
          lx.set(0);
          ly.set(0);
          hover.set(0);
        }}
        style={{
          x: logoX,
          y: logoY,
          rotateX: logoRotX,
          rotateY: logoRotY,
          scale: logoScale,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        }}
        className="font-display -m-8 flex items-center gap-[0.18em] p-8 text-[2.6rem] leading-none font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
      >
        <span className="inline-block" style={{ transform: "translateZ(0.12em)" }}>
          <span data-neural-avoid="" className="word-release-left relative z-0 inline-block">
            <ScrambleText
              words={["AI", "ML", "NN", "AI", "DL", "RL", "AI", "CV"]}
              className="inline-block w-[1.42em] text-center"
            />
          </span>
        </span>
        <span className="inline-block" style={{ transform: "translateZ(0.45em)" }}>
          <span className="at-intro relative z-10 inline-block">
            <AtOrbit neural />
          </span>
        </span>
        <span className="inline-block" style={{ transform: "translateZ(0.12em)" }}>
          <span data-neural-avoid="" className="word-release-right relative z-0 inline-block">
            <span data-neural-avoid="" className="absolute bottom-full left-[0.06em] mb-[0.02em] text-[0.26em] font-medium tracking-[0.42em] whitespace-nowrap text-mist">
              SOCIETY
            </span>
            VIENNA
          </span>
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
        data-neural-avoid=""
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
