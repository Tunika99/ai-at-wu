import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, display, mono, type Anchor, type Box } from "../theme";
import { easeOut, ramp } from "../motion";
import { Background } from "../Background";
import { Network } from "../Network";
import { Hud, hudBoxes } from "../Hud";
import { Wordmark, orbitAnchors, wordmarkBoxes, wordmarkLayout } from "../Wordmark";
import { DetectBox, Flash, Footage, Grain, K, KineticWord, Vignette, jitter, punch } from "./fx";
import { DROP, T, lastDropBeat } from "./timing";

/**
 * Announcement teaser, 15.5 s vertical: a hook in kinetic type, the LC at
 * night through an "AI vision" overlay, GET READY in the silence, the @
 * slamming in on the drop, what we do (one word per beat), end card.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ------------------------------------------------------------------ hook
const HOOK: [string, number][] = [
  ["SOMETHING", 8],
  ["NEW", 23],
  ["IS", 38],
  ["COMING", 53],
  ["TO", 68],
  ["WU.", 83],
];

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const cur = [...HOOK].reverse().find(([, at]) => f >= at);
  if (!cur) return null;
  const [word, at] = cur;
  return <KineticWord f={f} at={at} lines={[word]} gradientLast={word === "WU."} size={word === "WU." ? 330 : undefined} />;
};

// --------------------------------------------------------- footage + AI eyes
/** Where the person walking across the square is, in source pixels, by source time. */
const PERSON: [number, number, number, number, number][] = [
  [0.1, 222, 558, 42, 112],
  [1.2, 280, 573, 44, 116],
  [2.4, 358, 578, 50, 136],
  [3.3, 436, 585, 46, 144],
];
function personAt(t: number) {
  const i = Math.max(0, PERSON.findIndex(([pt]) => pt > t) - 1);
  const a = PERSON[Math.min(i, PERSON.length - 2)];
  const b = PERSON[Math.min(i + 1, PERSON.length - 1)];
  const p = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
  return { x: lerp(a[1], b[1], p) * K, y: lerp(a[2], b[2], p) * K, w: lerp(a[3], b[3], p) * K, h: lerp(a[4], b[4], p) * K };
}

function camera(f: number) {
  if (f < 143) return { scale: lerp(1.14, 1, ramp(f, 98, 130)), origin: "50% 50%" };
  // origin high enough that the building's label stays clear of the terminal
  if (f < 173) return { scale: lerp(1.55, 1.63, (f - 143) / 30), origin: "16% 16%" };
  if (f < 203) return { scale: lerp(1.42, 1.5, (f - 173) / 30), origin: "72% 74%" };
  return { scale: lerp(1, 1.12, ramp(f, 203, 225)), origin: "50% 52%" };
}

const Terminal: React.FC<{ f: number }> = ({ f }) => {
  const type = (text: string, at: number, speed = 1.6) => text.slice(0, Math.max(0, Math.floor((f - at) * speed)));
  const progress = interpolate(f, [170, 216], [0, 1], clamp);
  const bar = 18;
  const filled = Math.round(progress * bar);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        top: 232,
        padding: "26px 30px",
        borderRadius: 18,
        background: "rgba(8,6,15,0.62)",
        border: "1px solid rgba(167,139,250,0.35)",
        fontFamily: mono,
        fontSize: 30,
        lineHeight: 1.55,
        color: C.ink,
        opacity: ramp(f, 104, 110),
      }}
    >
      <div>{type("> scanning campus ...", 106)}</div>
      {f >= 148 && <div style={{ color: C.pulse }}>{type("> future member detected", 148)}</div>}
      {f >= 166 && <div>{type("> loading ai_society_vienna", 166)}</div>}
      {f >= 170 && (
        <div style={{ color: progress >= 1 ? C.pulse : C.neon }}>
          [{"█".repeat(filled)}
          <span style={{ opacity: 0.3 }}>{"░".repeat(bar - filled)}</span>] {Math.round(progress * 100)}%
        </div>
      )}
    </div>
  );
};

const LiveChip: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 66, top: 150, fontFamily: mono, fontSize: 24, letterSpacing: "0.2em", color: C.ink, opacity: ramp(f, 100, 106) }}>
    <span style={{ color: C.pulse, opacity: Math.floor(f / 12) % 2 ? 0.25 : 1 }}>●</span> LIVE  WU CAMPUS
  </div>
);

const FootageScene: React.FC<{ f: number }> = ({ f }) => {
  const t = 0.1 + ((f - T.footage) / FPS) * 0.75;
  const cam = camera(f);
  const person = personAt(t);
  const scanY = interpolate(f, [98, 132], [-60, 1980], clamp);
  return (
    <AbsoluteFill>
      <Footage t={t} scale={cam.scale} origin={cam.origin} grade={{ brightness: 1.05, tint: 0.28 }}>
        <DetectBox f={f} at={106} r={{ x: 10, y: 452, w: 535, h: 405 }} label="LIBRARY & LEARNING CENTER" score={0.99} scale={cam.scale} />
        {t < 3.25 && (
          <DetectBox
            f={f}
            at={118}
            r={person}
            label="FUTURE MEMBER"
            score={interpolate(f, [118, 150], [0.31, 0.98], clamp)}
            scale={cam.scale}
          />
        )}
      </Footage>
      {/* scan line sweeping down as the AI "looks" */}
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 3, background: C.neon, boxShadow: "0 0 40px 10px rgba(167,139,250,0.55)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY - 260, height: 260, background: "linear-gradient(180deg, transparent, rgba(167,139,250,0.14))" }} />
      <LiveChip f={f} />
      <Terminal f={f} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ break
const Break: React.FC<{ f: number }> = ({ f }) => {
  const shake = f >= T.hit && f < T.hit + 6 ? { x: jitter(f, 16), y: jitter(f + 3, 10) } : { x: 0, y: 0 };
  const out = ramp(f, 236, 241, easeOut);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px) scale(${1 + out * 2.2})`, opacity: 1 - out, filter: `blur(${out * 12}px)` }}>
      {f < 225 ? (
        <KineticWord f={f} at={T.brk} lines={["GET"]} size={250} />
      ) : (
        <KineticWord f={f} at={f >= T.hit ? T.hit : 225} lines={["GET", "READY."]} size={250} gradientLast />
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------- drop
const D = { fs: 150, cx: 540, cy: 900 };
const bump = (f: number) => {
  const b = lastDropBeat(f);
  return 1 + 0.045 * Math.exp(-(f - b) / 4);
};

const DropScene: React.FC<{ f: number }> = ({ f }) => {
  const t = 0.6 + ((f - DROP) / FPS) * 0.5;
  const tagline = "[ THE NEW AI SOCIETY AT WU ]";
  const typed = tagline.slice(0, Math.max(0, Math.floor((f - 271) * 1.4)));
  return (
    <AbsoluteFill>
      <Footage t={t} scale={1.08 * bump(f)} grade={{ brightness: 0.36, blur: 4, tint: 0.5 }} />
      <AbsoluteFill style={{ transform: `scale(${bump(f)})`, transformOrigin: `${D.cx}px ${D.cy}px` }}>
        <Wordmark f={f} t={f / FPS} fs={D.fs} cx={D.cx} cy={D.cy} introAt={DROP} introDur={18} startScale={8} startTurns={1.25} releaseAt={253} releaseDur={18} scramble={[283, 328]} glyphSpin={0} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1074, width: "100%", textAlign: "center", fontFamily: mono, fontSize: 30, letterSpacing: "0.28em", color: C.neon }}>{typed}</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ words
const WORDS: { at: number; lines: string[]; shot: { t: number; s: number; o: string } }[] = [
  { at: 331, lines: ["WORKSHOPS."], shot: { t: 0.4, s: 1.55, o: "16% 30%" } },
  { at: 346, lines: ["SPEAKER", "NIGHTS."], shot: { t: 1.5, s: 1.35, o: "86% 48%" } },
  { at: 361, lines: ["REAL", "PROJECTS."], shot: { t: 2.2, s: 1.7, o: "62% 72%" } },
  { at: 376, lines: ["ONE", "COMMUNITY."], shot: { t: 3.0, s: 1.25, o: "40% 40%" } },
  { at: 391, lines: ["JOIN", "US."], shot: { t: 0.9, s: 1.6, o: "30% 28%" } },
];

const WordsScene: React.FC<{ f: number }> = ({ f }) => {
  const cur = [...WORDS].reverse().find((w) => f >= w.at) ?? WORDS[0];
  const p = (f - cur.at) / 15;
  return (
    <AbsoluteFill>
      <Footage t={cur.shot.t + p * 0.25} scale={cur.shot.s + p * 0.08} origin={cur.shot.o} grade={{ brightness: 0.62, tint: 0.4 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 40% at 50% 52%, rgba(8,6,15,0.65), rgba(8,6,15,0.15) 80%)" }} />
      <KineticWord f={f} at={cur.at} lines={cur.lines} gradientLast={cur.lines.length > 1} />
      <Wordmark f={f} t={f / FPS} fs={58} cx={540} cy={232} introAt={-100} introDur={1} startScale={1} startTurns={0} releaseAt={-100} releaseDur={1} glyphSpin={0} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ outro
const O = { fs: 124, cx: 540, cy: 820 };
const OutroScene: React.FC<{ f: number }> = ({ f }) => {
  const reveal = (at: number) => {
    const p = ramp(f, at, at + 14);
    return { opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 6}px)` };
  };
  return (
    <AbsoluteFill>
      <Wordmark f={f} t={f / FPS} fs={O.fs} cx={O.cx} cy={O.cy} introAt={T.outro} introDur={22} startScale={3.2} startTurns={0.75} releaseAt={416} releaseDur={18} glyphSpin={0} />
      <div style={{ position: "absolute", top: 985, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 600, fontSize: 58, letterSpacing: "-0.02em", color: C.ink, ...reveal(424) }}>
        The new AI Society at WU.
      </div>
      <div style={{ position: "absolute", top: 1080, width: "100%", textAlign: "center", fontFamily: mono, fontSize: 40, letterSpacing: "0.05em", color: C.neon, ...reveal(430) }}>
        aisocietyvienna.tech
      </div>
      <div style={{ position: "absolute", top: 1160, width: "100%", textAlign: "center", fontFamily: mono, fontSize: 24, letterSpacing: "0.3em", color: C.mist, ...reveal(436) }}>
        [ FOLLOW FOR THE LAUNCH ]
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------- main
function keepOuts(f: number): Box[] {
  const b = hudBoxes(f);
  if (f >= T.drop && f < T.words) {
    b.push(...wordmarkBoxes(D.fs, D.cx, D.cy, f >= 256, f >= 259), { x: 120, y: 1060, w: 840, h: 54 });
  }
  if (f >= T.outro) {
    b.push(...wordmarkBoxes(O.fs, O.cx, O.cy, f >= 420, f >= 428), { x: 90, y: 975, w: 900, h: 80 }, { x: 160, y: 1070, w: 760, h: 60 }, { x: 200, y: 1150, w: 680, h: 46 });
  }
  return b;
}

function anchors(f: number): Anchor[] {
  if (f >= T.drop && f < T.words) {
    const { at } = wordmarkLayout(D.fs, D.cx, D.cy);
    return orbitAnchors(D.fs, at.cx, at.cy, f / FPS, ramp(f, 259, 275));
  }
  if (f >= T.outro) {
    const { at } = wordmarkLayout(O.fs, O.cx, O.cy);
    return orbitAnchors(O.fs, at.cx, at.cy, f / FPS, ramp(f, 428, 444));
  }
  return [];
}

function networkOpacity(f: number) {
  if (f >= T.drop && f < T.words) return ramp(f, T.drop, T.drop + 10);
  if (f >= T.outro) return 0.9 * ramp(f, T.outro, T.outro + 16);
  return 0;
}

export const Announcement: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.void }}>
      <Audio src={staticFile("audio/music.mp3")} />
      <Background />
      {f >= T.footage && f < T.brk && <FootageScene f={f} />}
      {f >= T.drop && f < T.words && <DropScene f={f} />}
      {f >= T.words && f < T.outro && <WordsScene f={f} />}
      <Network frame={f} boxes={keepOuts(f)} anchors={anchors(f)} opacity={networkOpacity(f)} />
      {f < T.footage && <Hook f={f} />}
      {f >= T.brk && f < T.drop && <Break f={f} />}
      {f >= T.outro && <OutroScene f={f} />}
      <Hud bottomRight="[ GET READY ]" />
      <Vignette strength={f >= T.footage && f < T.outro ? 0.55 : 0.4} />
      <Grain f={f} opacity={0.1} />
      <Flash f={f} at={T.footage} strength={0.7} />
      {[143, 173, 203].map((at) => <Flash key={at} f={f} at={at} strength={0.3} len={5} />)}
      <Flash f={f} at={T.drop} strength={1} len={11} />
      {[346, 361, 376, 391].map((at) => <Flash key={at} f={f} at={at} strength={0.35} len={5} />)}
      <Flash f={f} at={T.words} strength={0.5} len={6} />
      <Flash f={f} at={T.outro} strength={0.3} len={8} />
    </AbsoluteFill>
  );
};

