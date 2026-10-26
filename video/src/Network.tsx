import React from "react";
import { C, FPS, H, W, type Anchor, type Box } from "./theme";
import { hash } from "./motion";

/**
 * The site's neural backdrop, deterministic per frame: drifting nodes,
 * links between neighbours, calm irregular signals, and anchors (the @
 * handles, section dots) wired into the net. Like on the website it never
 * draws through text: links crossing a keep-out box are skipped and nodes
 * inside one are hidden.
 */

const LINK = 250;
const ANCHOR_LINK = 470;
const PAD = 16;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Node = { bx: number; by: number; ax: number; ay: number; fx: number; fy: number; px: number; py: number; r: number; b: number };

// Jittered grid: spread out evenly, never clumped.
const NODES: Node[] = (() => {
  const rnd = mulberry32(11);
  const cols = 6;
  const rows = 11;
  const cw = W / cols;
  const ch = H / rows;
  const out: Node[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({
        bx: (c + 0.5 + (rnd() - 0.5) * 0.75) * cw,
        by: (r + 0.5 + (rnd() - 0.5) * 0.75) * ch,
        ax: 12 + rnd() * 18,
        ay: 12 + rnd() * 18,
        fx: 0.12 + rnd() * 0.28,
        fy: 0.12 + rnd() * 0.28,
        px: rnd() * Math.PI * 2,
        py: rnd() * Math.PI * 2,
        r: 2 + rnd() * 1.8,
        b: 0.4 + rnd() * 0.6,
      });
    }
  }
  return out;
})();

const NEIGHBOURS = NODES.map((n, i) =>
  NODES.map((m, j) => ({ j, d: Math.hypot(n.bx - m.bx, n.by - m.by) }))
    .filter((o) => o.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((o) => o.j),
);

type P = { x: number; y: number };

/** Liang-Barsky: does segment a-b cross the (padded) box? */
function crosses(a: P, b: P, box: Box) {
  const L = box.x - PAD, R = box.x + box.w + PAD, T = box.y - PAD, B = box.y + box.h + PAD;
  const dx = b.x - a.x, dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x - L, R - a.x, a.y - T, B - a.y];
  let t0 = 0, t1 = 1;
  for (let k = 0; k < 4; k++) {
    if (p[k] === 0) {
      if (q[k] < 0) return false;
    } else {
      const r = q[k] / p[k];
      if (p[k] < 0) {
        if (r > t1) return false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return false;
        if (r < t1) t1 = r;
      }
    }
  }
  return true;
}

const inside = (p: P, b: Box) => p.x > b.x - PAD && p.x < b.x + b.w + PAD && p.y > b.y - PAD && p.y < b.y + b.h + PAD;
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: P, b: P, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

export const Network: React.FC<{ frame: number; boxes: Box[]; anchors: Anchor[]; opacity: number }> = ({
  frame,
  boxes,
  anchors,
  opacity,
}) => {
  const t = frame / FPS;
  const pts = NODES.map((n) => ({
    x: n.bx + Math.sin(t * n.fx + n.px) * n.ax,
    y: n.by + Math.cos(t * n.fy + n.py) * n.ay,
  }));
  const vis = pts.map((p) => !boxes.some((b) => inside(p, b)));
  const free = (a: P, b: P) => !boxes.some((box) => crosses(a, b, box));

  const links: React.ReactElement[] = [];
  for (let i = 0; i < pts.length; i++) {
    if (!vis[i]) continue;
    for (let j = i + 1; j < pts.length; j++) {
      if (!vis[j]) continue;
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d > LINK || !free(pts[i], pts[j])) continue;
      const a = Math.pow(1 - d / LINK, 1.4) * 0.45;
      links.push(
        <line key={`l${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={`rgba(167,139,250,${a})`} strokeWidth={1.3} />,
      );
    }
  }

  // Anchors wire into their three nearest free nodes; signals leave from them.
  const wires: React.ReactElement[] = [];
  const signals: React.ReactElement[] = [];
  anchors.forEach((an, k) => {
    if (an.strength <= 0.01) return;
    const near = pts
      .map((p, i) => ({ i, d: Math.hypot(p.x - an.x, p.y - an.y) }))
      .filter((o) => vis[o.i] && o.d < ANCHOR_LINK && free(an, pts[o.i]))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    near.forEach(({ i, d }, m) => {
      const a = (1 - d / ANCHOR_LINK) * 0.7 * an.strength;
      wires.push(
        <line key={`w${k}-${m}`} x1={an.x} y1={an.y} x2={pts[i].x} y2={pts[i].y} stroke={an.color} strokeOpacity={a} strokeWidth={1.6} />,
      );
      // signal: anchor -> node (24f), then one hop on to a neighbour (20f)
      const period = 64 + ((k * 13 + m * 17) % 40);
      const local = (frame + k * 11 + m * 23) % period;
      const hop = NEIGHBOURS[i][hash(k * 7 + m, Math.floor((frame + k * 11 + m * 23) / period)) % 3];
      let pos: P | null = null;
      if (local < 24) pos = lerp(an, pts[i], smooth(local / 24));
      else if (local < 44 && vis[hop] && free(pts[i], pts[hop])) pos = lerp(pts[i], pts[hop], smooth((local - 24) / 20));
      if (pos) signals.push(<Signal key={`s${k}-${m}`} p={pos} pink={an.color === C.pulse} a={an.strength} />);
    });
    wires.push(<circle key={`ag${k}`} cx={an.x} cy={an.y} r={22} fill={`url(#${an.color === C.pulse ? "gP" : "gN"})`} opacity={0.5 * an.strength} />);
  });

  // Calm ambient signals hopping between neighbours, irregular periods.
  const ambient: React.ReactElement[] = [];
  for (let s = 0; s < 7; s++) {
    const period = 72 + ((s * 29) % 56);
    const shifted = frame + s * 37;
    const cycle = Math.floor(shifted / period);
    const local = shifted % period;
    const a = hash(s, cycle) % NODES.length;
    const b = NEIGHBOURS[a][hash(s + 50, cycle) % 3];
    if (!vis[a] || !vis[b] || !free(pts[a], pts[b])) continue;
    if (local < 32) {
      ambient.push(<Signal key={`a${s}`} p={lerp(pts[a], pts[b], smooth(local / 32))} pink={s % 3 === 0} a={0.85} />);
    } else if (local < 54) {
      const r = (local - 32) / 22;
      ambient.push(
        <circle key={`r${s}`} cx={pts[b].x} cy={pts[b].y} r={5 + r * 30} fill="none" stroke={C.neon} strokeOpacity={(1 - r) * 0.5} strokeWidth={1.5} />,
      );
    }
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <radialGradient id="gP">
          <stop offset="0" stopColor="#fdf4ff" />
          <stop offset="0.22" stopColor={C.pulse} stopOpacity={0.85} />
          <stop offset="1" stopColor={C.pulse} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gN">
          <stop offset="0" stopColor="#f5f3ff" />
          <stop offset="0.22" stopColor={C.neon} stopOpacity={0.85} />
          <stop offset="1" stopColor={C.neon} stopOpacity={0} />
        </radialGradient>
      </defs>
      {links}
      {wires}
      {pts.map((p, i) =>
        vis[i] ? <circle key={`n${i}`} cx={p.x} cy={p.y} r={NODES[i].r} fill={C.neon} fillOpacity={NODES[i].b * 0.75} /> : null,
      )}
      {ambient}
      {signals}
    </svg>
  );
};

const Signal: React.FC<{ p: P; pink: boolean; a: number }> = ({ p, pink, a }) => (
  <circle cx={p.x} cy={p.y} r={16} fill={`url(#${pink ? "gP" : "gN"})`} opacity={a} />
);
