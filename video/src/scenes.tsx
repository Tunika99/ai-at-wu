import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FPS, GRADIENT, display, mono, sans, type Anchor, type Box } from "./theme";
import { alive, easeOut, ramp, reveal } from "./motion";
import { Wordmark, orbitAnchors, wordmarkBoxes, wordmarkLayout } from "./Wordmark";
import { MediaFill } from "./Media";
import { PHOTO_SCENES, STATS, URL } from "./content";

export type Scene = {
  id: string;
  from: number;
  dur: number;
  Component: React.FC;
  boxes: (f: number) => Box[];
  anchors: (f: number) => Anchor[];
};

const gradientText: React.CSSProperties = {
  background: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  // room for descenders: gradient text is clipped to the element box
  paddingBottom: "0.12em",
  marginBottom: "-0.12em",
};

/** "[ 01 - LABEL ]" with the pink section dot, like SectionHeading on the site. */
const SectionLabel: React.FC<{ y: number; text: string; style: React.CSSProperties }> = ({ y, text, style }) => (
  <div style={{ position: "absolute", left: 80, top: y, display: "flex", alignItems: "center", gap: 18, ...style }}>
    <div style={{ width: 11, height: 11, borderRadius: "50%", background: C.pulse, boxShadow: "0 0 16px rgba(232,121,249,0.8)" }} />
    <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: "0.25em", color: C.neon }}>{text}</div>
  </div>
);
const labelDot = (y: number, strength: number): Anchor => ({ x: 85.5, y: y + 17, color: C.pulse, strength });
const labelBox = (y: number): Box => ({ x: 110, y: y - 4, w: 880, h: 42 });

// ---------------------------------------------------------------- 1. Intro
const INTRO = { fs: 150, cx: 540, cy: 840, out: 196 };

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const o = reveal(f, -100, INTRO.out);
  const words = ["The", "AI", "student", "society"];
  return (
    <div style={{ position: "absolute", inset: 0, ...o }}>
      <Wordmark
        f={f}
        t={f / FPS}
        fs={INTRO.fs}
        cx={INTRO.cx}
        cy={INTRO.cy}
        introAt={0}
        introDur={60}
        startScale={9}
        startTurns={1.5}
        releaseAt={40}
        releaseDur={30}
        scramble={[100, 196]}
      />
      <div
        style={{
          position: "absolute",
          top: 560,
          width: "100%",
          textAlign: "center",
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: "0.3em",
          color: C.neon,
          ...reveal(f, 72),
        }}
      >
        [ THE AI SOCIETY AT WU ]
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 600,
          fontSize: 72,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        {words.map((w, i) => (
          <span key={w} style={{ display: "inline-block", marginRight: "0.25em", ...reveal(f, 84 + i * 4) }}>
            {w}
          </span>
        ))}
        <br />
        <span style={{ display: "inline-block", marginRight: "0.25em", ...reveal(f, 100) }}>at</span>
        <span style={{ display: "inline-block", ...reveal(f, 104) }}>
          <span style={gradientText}>WU Vienna.</span>
        </span>
      </div>
    </div>
  );
};

const introScene: Scene = {
  id: "intro",
  from: 0,
  dur: 212,
  Component: Intro,
  boxes: (f) => {
    if (f > INTRO.out + 12) return [];
    const b = wordmarkBoxes(INTRO.fs, INTRO.cx, INTRO.cy, f >= 44, f >= 58);
    if (f >= 72) b.push({ x: 170, y: 548, w: 740, h: 40 });
    if (f >= 84) b.push({ x: 90, y: 990, w: 900, h: 175 });
    return b;
  },
  anchors: (f) => {
    const { at } = wordmarkLayout(INTRO.fs, INTRO.cx, INTRO.cy);
    return orbitAnchors(INTRO.fs, at.cx, at.cy, f / FPS, ramp(f, 62, 84) * alive(f, INTRO.out));
  },
};

// ---------------------------------------------------------------- 2./3. Photos
const PH = { labelY: 190, photo: { x: 80, y: 252, w: 920, h: 1010 }, titleY: 1308, subY: 1402, out: 108 };

const Bracket: React.FC<{ corner: "tl" | "tr" | "bl" | "br"; off: number; o: number }> = ({ corner, off, o }) => {
  const { x, y, w, h } = PH.photo;
  const len = 56;
  const s = `3px solid ${C.neon}`;
  const left = corner.endsWith("l") ? x - off : x + w + off - len;
  const top = corner.startsWith("t") ? y - off : y + h + off - len;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: len,
        height: len,
        opacity: o,
        borderTop: corner.startsWith("t") ? s : undefined,
        borderBottom: corner.startsWith("b") ? s : undefined,
        borderLeft: corner.endsWith("l") ? s : undefined,
        borderRight: corner.endsWith("r") ? s : undefined,
        filter: "drop-shadow(0 0 8px rgba(167,139,250,0.7))",
      }}
    />
  );
};

const chip: React.CSSProperties = {
  position: "absolute",
  fontFamily: mono,
  fontSize: 19,
  letterSpacing: "0.18em",
  color: C.ink,
  padding: "9px 14px",
  borderRadius: 8,
  background: "rgba(8,6,15,0.62)",
  border: "1px solid rgba(167,139,250,0.3)",
  backdropFilter: "blur(10px)",
};

function photoScene(i: number, from: number): Scene {
  const data = PHOTO_SCENES[i];
  const Photo: React.FC = () => {
    const f = useCurrentFrame();
    const { x, y, w, h } = PH.photo;
    const open = ramp(f, 4, 28);
    const zoom = interpolate(f, [0, 125], [1.16, 1.03]);
    const pan = interpolate(f, [0, 125], i % 2 ? [16, -16] : [-16, 16]);
    const off = 14 + (1 - ramp(f, 8, 32)) * 40;
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <SectionLabel y={PH.labelY} text={data.label} style={reveal(f, 0, PH.out)} />
        <div style={{ position: "absolute", inset: 0, ...reveal(f, -100, PH.out) }}>
          <div
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: 18,
              overflow: "hidden",
              clipPath: `inset(0 0 ${(1 - open) * 100}% 0 round 18px)`,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <MediaFill media={data.media} style={{ transform: `scale(${zoom}) translateX(${pan}px)` }} />
            {/* grade it into the site palette */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(109,40,217,0.32)", mixBlendMode: "multiply" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(8,6,15,0.35), rgba(8,6,15,0) 30%, rgba(8,6,15,0) 62%, rgba(8,6,15,0.7))",
              }}
            />
            <div style={{ ...chip, left: 26, top: 26, ...reveal(f, 24) }}>{data.media.caption}</div>
            <div style={{ ...chip, left: 26, bottom: 26, ...reveal(f, 30) }}>48.2131° N - 16.4085° E</div>
          </div>
          {open > 0 && open < 1 && (
            <div
              style={{
                position: "absolute",
                left: x - 10,
                width: w + 20,
                top: y + open * h - 1.5,
                height: 3,
                background: C.neon,
                boxShadow: `0 0 24px 4px rgba(167,139,250,0.7)`,
              }}
            />
          )}
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <Bracket key={c} corner={c} off={off} o={ramp(f, 6, 20)} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: PH.titleY,
            width: 920,
            fontFamily: display,
            fontWeight: 600,
            fontSize: 74,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: C.ink,
            ...reveal(f, 14, PH.out),
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: PH.subY,
            width: 880,
            fontFamily: sans,
            fontSize: 36,
            lineHeight: 1.4,
            color: C.mist,
            ...reveal(f, 20, PH.out),
          }}
        >
          {data.sub}
        </div>
      </div>
    );
  };
  return {
    id: `photo${i + 1}`,
    from,
    dur: 125,
    Component: Photo,
    boxes: (f) =>
      f > PH.out + 12
        ? []
        : [
            labelBox(PH.labelY),
            PH.photo,
            { x: 70, y: PH.titleY - 6, w: 940, h: 88 },
            ...(f >= 20 ? [{ x: 70, y: PH.subY - 4, w: 900, h: 110 }] : []),
          ],
    anchors: (f) => [labelDot(PH.labelY, ramp(f, 4, 22) * alive(f, PH.out))],
  };
}

// ---------------------------------------------------------------- 4. Stats
const ST = { labelY: 300, titleY: 352, rows: [700, 950, 1200], out: 108 };

const Stats: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SectionLabel y={ST.labelY} text="[ 03 - COMMUNITY ]" style={reveal(f, 0, ST.out)} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: ST.titleY,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: C.ink,
          ...reveal(f, 6, ST.out),
        }}
      >
        A community
        <br />
        that <span style={gradientText}>builds.</span>
      </div>
      {STATS.map((s, k) => {
        const at = 20 + k * 9;
        const n = Math.round(s.from + (s.to - s.from) * ramp(f, at, at + 34, easeOut));
        return (
          <div key={s.label} style={{ position: "absolute", left: 0, top: ST.rows[k], width: "100%", ...reveal(f, at, ST.out) }}>
            <div
              style={{
                position: "absolute",
                left: 96,
                top: 72,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: C.pulse,
                boxShadow: "0 0 16px rgba(232,121,249,0.8)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 150,
                top: 0,
                fontFamily: display,
                fontWeight: 600,
                fontSize: 150,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: C.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {n}
              {s.suffix}
            </div>
            <div style={{ position: "absolute", left: 154, top: 166, fontFamily: mono, fontSize: 26, letterSpacing: "0.22em", color: C.mist }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const statsScene: Scene = {
  id: "stats",
  from: 452,
  dur: 125,
  Component: Stats,
  boxes: (f) => {
    if (f > ST.out + 12) return [];
    const b: Box[] = [labelBox(ST.labelY), { x: 70, y: ST.titleY - 4, w: 720, h: 225 }];
    ST.rows.forEach((y, k) => {
      if (f >= 20 + k * 9) b.push({ x: 140, y: y + 8, w: 520, h: 140 }, { x: 144, y: y + 160, w: 470, h: 40 });
    });
    return b;
  },
  anchors: (f) => [
    labelDot(ST.labelY, ramp(f, 2, 20) * alive(f, ST.out)),
    ...ST.rows.map((y, k) => ({ x: 102, y: y + 78, color: C.pulse, strength: ramp(f, 24 + k * 9, 44 + k * 9) * alive(f, ST.out) })),
  ],
};

// ---------------------------------------------------------------- 5. Call to action
const CTA = { fs: 128, cx: 540, cy: 790, button: { x: 230, y: 1010, w: 620, h: 128 }, urlY: 1186 };

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.2 * Math.sin((f / FPS) * 3);
  const { x, y, w, h } = CTA.button;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Wordmark
        f={f}
        t={f / FPS}
        fs={CTA.fs}
        cx={CTA.cx}
        cy={CTA.cy}
        introAt={0}
        introDur={36}
        startScale={5}
        startTurns={1}
        releaseAt={22}
        releaseDur={26}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 999,
          background: C.neon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: display,
          fontWeight: 600,
          fontSize: 46,
          color: C.abyss,
          boxShadow: `0 0 40px rgba(167,139,250,${glow}), 0 0 120px rgba(139,92,246,${glow * 0.45})`,
          ...reveal(f, 40),
        }}
      >
        Become a member
      </div>
      <div
        style={{
          position: "absolute",
          top: CTA.urlY,
          width: "100%",
          textAlign: "center",
          fontFamily: mono,
          fontSize: 38,
          letterSpacing: "0.06em",
          color: C.neon,
          ...reveal(f, 48),
        }}
      >
        {URL}
      </div>
    </div>
  );
};

const ctaScene: Scene = {
  id: "cta",
  from: 574,
  dur: 136,
  Component: Cta,
  boxes: (f) => [
    ...wordmarkBoxes(CTA.fs, CTA.cx, CTA.cy, f >= 26, f >= 34),
    ...(f >= 40 ? [CTA.button] : []),
    ...(f >= 48 ? [{ x: 170, y: CTA.urlY - 4, w: 740, h: 56 }] : []),
  ],
  anchors: (f) => {
    const { at } = wordmarkLayout(CTA.fs, CTA.cx, CTA.cy);
    return orbitAnchors(CTA.fs, at.cx, at.cy, f / FPS, ramp(f, 36, 58));
  },
};

export const SCENES: Scene[] = [introScene, photoScene(0, 208), photoScene(1, 330), statsScene, ctaScene];
export const TOTAL = ctaScene.from + ctaScene.dur;
