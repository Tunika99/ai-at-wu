"use client";

import { useEffect, useRef } from "react";

/**
 * Animated "neural network" canvas behind the whole site.
 *
 * Drifting particles link up into faint synapses. On top of that, any
 * element carrying `data-neural-anchor="<hex colour>"` becomes a fixed
 * node of the network: particles wire themselves to the nearest anchor,
 * drift into a loose halo around it, and signal pulses travel out from
 * anchors along the synapses - hopping particle to particle and often
 * ending at another anchor, where they ring out. The AI logo's nodes and
 * the section-heading nodes are anchors, so the logo is literally plugged
 * into the site's network.
 *
 * Anchors follow their element every frame (scroll, parallax) and fade
 * with its effective opacity, so the logo's assembly intro and the
 * sections' reveal animations drive when each anchor comes alive.
 * `data-neural-after` (ms) keeps an anchor dormant until an intro has
 * landed - the @ must not be wired while it is still spinning in.
 *
 * Text stays clean: text-bearing elements (headings, paragraphs, links,
 * cards, and anything marked `data-neural-avoid`) are keep-out zones. No
 * synapse, wire or signal is drawn across them, particles inside them
 * are hidden, and a final erase pass clears any glow that bleeds in.
 */

type RGB = [number, number, number];
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  glow: number;
};
type Anchor = {
  el: Element;
  x: number;
  y: number;
  rgb: RGB;
  radius: number;
  alpha: number;
  visible: boolean;
  fired: boolean;
  lastPing: number;
  after: number;
};
type End = { p: number } | { a: Element };
type Pulse = {
  from: End;
  to: End;
  t: number;
  hops: number;
  rgb: RGB;
  prev: number;
  /** px per ms - lively during the intro, slow and varied afterwards */
  speed: number;
  /** brightness multiplier - calmer after the intro */
  k: number;
};
type Ripple = { el: Element | null; x: number; y: number; t: number; rgb: RGB; max: number };

const LINK_DIST = 130;
const MOUSE_DIST = 170;
/** Former CSS opacity of the canvas, baked in so wired links can run brighter. */
const BASE = 0.6;
/** The logo's assembly burst runs this long; afterwards the network calms down. */
const INTRO_MS = 4500;
const MAX_PULSES = 48;
const SEPARATION = 38; // px - particles closer than this drift apart
const HOVER_DIST = 46;

/**
 * Keep-out zones. An element that contains an anchor is skipped - its
 * text parts carry `data-neural-avoid` instead - so a section label never
 * blocks its own node and the hero headline can still host the @.
 */
const AVOID_SELECTOR =
  "h1,h2,h3,h4,p,dt,dd,li,label,input,textarea,select,button,a,article,figure,.glass,.glow-card,[data-neural-avoid]";
const AVOID_PAD = 8;
type Box = { l: number; t: number; r: number; b: number };

/** Does the segment (x1,y1)-(x2,y2) touch box b? Slab test, no allocation. */
function segHitsBox(x1: number, y1: number, x2: number, y2: number, b: Box) {
  if (
    (x1 < b.l && x2 < b.l) ||
    (x1 > b.r && x2 > b.r) ||
    (y1 < b.t && y2 < b.t) ||
    (y1 > b.b && y2 > b.b)
  )
    return false;
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0) {
    if (x1 < b.l || x1 > b.r) return false;
  } else {
    const ta = (b.l - x1) / dx;
    const tb = (b.r - x1) / dx;
    t0 = Math.max(t0, Math.min(ta, tb));
    t1 = Math.min(t1, Math.max(ta, tb));
    if (t0 > t1) return false;
  }
  if (dy === 0) {
    if (y1 < b.t || y1 > b.b) return false;
  } else {
    const ta = (b.t - y1) / dy;
    const tb = (b.b - y1) / dy;
    t0 = Math.max(t0, Math.min(ta, tb));
    t1 = Math.min(t1, Math.max(ta, tb));
    if (t0 > t1) return false;
  }
  return true;
}

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/** Opacity as the viewer sees it: the element's own times its ancestors'. */
function chainOpacity(el: Element) {
  let o = 1;
  let n: Element | null = el;
  for (let k = 0; n && k < 8; k++) {
    o *= parseFloat(getComputedStyle(n).opacity);
    if (o < 0.02) return 0;
    n = n.parentElement;
  }
  return o;
}

export function NeuralField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let frame = 0;
    let nodes: Particle[] = [];
    let pulses: Pulse[] = [];
    let ripples: Ripple[] = [];
    const anchors = new Map<Element, Anchor>();
    const mouse = { x: -9999, y: -9999 };
    const born = performance.now();
    let last = born;
    let lastQuery = 0;
    let nextSpawn = born + 900;

    // Keep-out zones: candidates are re-queried with the anchors; only
    // those near the viewport (IntersectionObserver) are measured per frame.
    let avoidEls = new Set<Element>();
    const nearView = new Set<Element>();
    let boxes: Box[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) nearView.add(e.target);
          else nearView.delete(e.target);
        }
      },
      { rootMargin: "200px" },
    );

    const queryAvoid = () => {
      const found = new Set<Element>();
      document.querySelectorAll(AVOID_SELECTOR).forEach((el) => {
        if (
          el.hasAttribute("data-neural-avoid") ||
          !el.querySelector("[data-neural-anchor]")
        )
          found.add(el);
      });
      // A paragraph inside a card adds nothing the card doesn't cover.
      const next = new Set<Element>();
      for (const el of found) {
        let up = el.parentElement;
        while (up && !found.has(up)) up = up.parentElement;
        if (!up) next.add(el);
      }
      for (const el of avoidEls)
        if (!next.has(el)) {
          io.unobserve(el);
          nearView.delete(el);
        }
      for (const el of next) if (!avoidEls.has(el)) io.observe(el);
      avoidEls = next;
    };

    const measureAvoid = () => {
      boxes = [];
      for (const el of nearView) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) continue;
        boxes.push({
          l: r.left - AVOID_PAD,
          t: r.top - AVOID_PAD,
          r: r.right + AVOID_PAD,
          b: r.bottom + AVOID_PAD,
        });
      }
    };

    const blocked = (x1: number, y1: number, x2: number, y2: number) => {
      for (const b of boxes) if (segHitsBox(x1, y1, x2, y2, b)) return true;
      return false;
    };

    const inBox = (x: number, y: number) => {
      for (const b of boxes)
        if (x > b.l && x < b.r && y > b.t && y < b.b) return true;
      return false;
    };

    /** Last pass: clear anything (glows, ripples) that bled over text. */
    const eraseText = () => {
      if (!boxes.length) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000";
      for (const b of boxes) ctx.fillRect(b.l, b.t, b.r - b.l, b.b - b.t);
      ctx.restore();
    };

    /** Anchor reach shrinks on small screens so the wiring stays legible. */
    const scale = () => Math.min(1, Math.max(0.6, w / 1280));
    const inIntro = () => performance.now() - born < INTRO_MS;

    /**
     * Signal character: a quick, bright burst while the logo assembles;
     * afterwards slow, each pulse at its own pace and dimmer, so the
     * background stays alive without pulling focus from the content.
     */
    const character = (lively: boolean) =>
      lively
        ? { speed: 0.24, k: 1 }
        : { speed: 0.055 + Math.random() * 0.075, k: 0.7 };

    const queryAnchors = () => {
      const seen = new Set<Element>();
      document.querySelectorAll("[data-neural-anchor]").forEach((el) => {
        seen.add(el);
        if (!anchors.has(el)) {
          anchors.set(el, {
            el,
            x: 0,
            y: 0,
            rgb: hexToRgb(el.getAttribute("data-neural-anchor") || "#a78bfa"),
            radius: Number(el.getAttribute("data-neural-radius")) || 180,
            alpha: 0,
            visible: false,
            fired: false,
            lastPing: 0,
            after: Number(el.getAttribute("data-neural-after")) || 0,
          });
        }
      });
      for (const el of anchors.keys()) if (!seen.has(el)) anchors.delete(el);
    };

    const measure = (a: Anchor, readAlpha: boolean) => {
      if (performance.now() - born < a.after) {
        a.visible = false;
        a.alpha = 0;
        return;
      }
      const r = a.el.getBoundingClientRect();
      a.x = r.left + r.width / 2;
      a.y = r.top + r.height / 2;
      a.visible =
        r.width > 0 && a.x > -40 && a.x < w + 40 && a.y > -40 && a.y < h + 40;
      if (!a.visible) a.alpha = 0;
      else if (readAlpha) a.alpha = chainOpacity(a.el);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Jittered grid instead of pure random: random placement clumps,
      // this spreads the network evenly across the screen.
      const count = Math.min(90, Math.max(30, Math.floor((w * h) / 18000)));
      const cols = Math.max(1, Math.round(Math.sqrt((count * w) / h)));
      const rows = Math.ceil(count / cols);
      const cw = w / cols;
      const ch = h / rows;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: ((i % cols) + 0.5 + (Math.random() - 0.5) * 0.8) * cw,
        y: (Math.floor(i / cols) + 0.5 + (Math.random() - 0.5) * 0.8) * ch,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.5,
        glow: 0,
      }));
      pulses = [];

      // Seed a couple of particles around the hub anchors so the wiring
      // shows from the first frame without clumping the network there.
      queryAnchors();
      const s = scale();
      let k = 0;
      for (const a of anchors.values()) {
        measure(a, false);
        if (!a.visible || a.radius < 200) continue;
        for (let j = 0; j < 2 && k < nodes.length; j++, k++) {
          const ang = Math.random() * Math.PI * 2;
          const d = a.radius * s * (0.55 + Math.random() * 0.4);
          nodes[k].x = Math.min(w, Math.max(0, a.x + Math.cos(ang) * d));
          nodes[k].y = Math.min(h, Math.max(0, a.y + Math.sin(ang) * d));
        }
      }
    };

    const pos = (e: End) => {
      if ("p" in e) return nodes[e.p] ?? null;
      const a = anchors.get(e.a);
      return a && a.visible && a.alpha > 0.05 ? a : null;
    };

    const ripple = (a: Anchor, max: number) =>
      ripples.push({ el: a.el, x: a.x, y: a.y, t: 0, rgb: a.rgb, max });

    /** Launch pulses from an anchor to particles within its reach. */
    const fireFrom = (
      a: Anchor,
      count: number,
      hops: number,
      lively = inIntro(),
    ) => {
      const reach = a.radius * scale();
      const cand: number[] = [];
      nodes.forEach((n, i) => {
        if (Math.hypot(n.x - a.x, n.y - a.y) < reach && !blocked(a.x, a.y, n.x, n.y))
          cand.push(i);
      });
      for (let c = 0; c < count && cand.length && pulses.length < MAX_PULSES; c++) {
        const i = cand.splice(Math.floor(Math.random() * cand.length), 1)[0];
        pulses.push({
          from: { a: a.el },
          to: { p: i },
          t: 0,
          hops,
          rgb: a.rgb,
          prev: -1,
          ...character(lively),
        });
      }
    };

    /** A pulse reached its target: glow, then hop on or ring out. */
    const arrive = (pl: Pulse) => {
      if ("a" in pl.to) {
        const a = anchors.get(pl.to.a);
        if (a) ripple(a, 22);
        return;
      }
      const here = pl.to.p;
      const n = nodes[here];
      if (!n) return;
      n.glow = 1;
      if (pl.hops <= 0 || pulses.length >= MAX_PULSES) return;

      // Anchors in reach pull the signal home - always on the last hop.
      const s = scale();
      const near: Anchor[] = [];
      for (const a of anchors.values()) {
        if (
          a.visible &&
          a.alpha > 0.5 &&
          Math.hypot(a.x - n.x, a.y - n.y) < a.radius * s * 0.9 &&
          !blocked(a.x, a.y, n.x, n.y)
        )
          near.push(a);
      }
      if (near.length && (pl.hops === 1 || Math.random() < 0.3)) {
        const a = pick(near);
        pulses.push({
          from: { p: here },
          to: { a: a.el },
          t: 0,
          hops: 0,
          rgb: a.rgb,
          prev: here,
          speed: pl.speed * (0.85 + Math.random() * 0.3),
          k: pl.k,
        });
        return;
      }

      const opts: number[] = [];
      nodes.forEach((m, i) => {
        if (
          i !== here &&
          i !== pl.prev &&
          Math.hypot(m.x - n.x, m.y - n.y) < LINK_DIST &&
          !blocked(n.x, n.y, m.x, m.y)
        )
          opts.push(i);
      });
      if (!opts.length) return;
      pulses.push({
        from: { p: here },
        to: { p: pick(opts) },
        t: 0,
        hops: pl.hops - 1,
        rgb: pl.rgb,
        prev: here,
        speed: pl.speed * (0.85 + Math.random() * 0.3),
        k: pl.k,
      });
    };

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    const dot = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      frame++;
      const step = reduced ? 0 : dt / 16.7;
      const intro = now - born < INTRO_MS;
      const s = scale();

      if (now - lastQuery > 400) {
        queryAnchors();
        queryAvoid();
        lastQuery = now;
      }
      measureAvoid();
      const readAlpha = intro || frame % 5 === 0;
      const live: Anchor[] = [];
      for (const a of anchors.values()) {
        measure(a, readAlpha);
        if (!a.visible || a.alpha < 0.02) continue;
        live.push(a);
        // Each node fires the moment it has assembled.
        if (!a.fired && a.alpha > 0.9 && !reduced) {
          a.fired = true;
          ripple(a, a.radius >= 200 ? 34 : 26);
          fireFrom(a, a.radius >= 200 ? 3 : 2, 5);
        }
      }

      // The network is dim until the logo has assembled, then wakes up.
      const wake = reduced
        ? 1
        : Math.min(1, 0.35 + (Math.max(0, now - born - 1400) / 1600) * 0.65);

      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx * step;
        n.y += n.vy * step;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (n.glow > 0) n.glow = Math.max(0, n.glow - dt / 700);
      }

      // Hub gravity: particles drift toward a loose halo around anchors.
      for (const a of live) {
        const reach = a.radius * s;
        const ring = reach * 0.72;
        for (const n of nodes) {
          const dx = a.x - n.x;
          const dy = a.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 1) {
            const f = ((d - ring) / d) * 0.00035 * a.alpha * step;
            n.x += dx * f;
            n.y += dy * f;
          }
        }
      }

      ctx.lineWidth = 1;

      // Synapses between particles.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < SEPARATION && dist > 0.5) {
            const push = (1 - dist / SEPARATION) * 0.02 * step;
            const ux = (a.x - b.x) / dist;
            const uy = (a.y - b.y) / dist;
            a.x += ux * push;
            a.y += uy * push;
            b.x -= ux * push;
            b.y -= uy * push;
          }
          if (dist < LINK_DIST && !blocked(a.x, a.y, b.x, b.y)) {
            const alpha = (1 - dist / LINK_DIST) * 0.22 * BASE * wake;
            ctx.strokeStyle =
              (i + j) % 5 === 0
                ? `rgba(232, 121, 249, ${alpha})`
                : `rgba(167, 139, 250, ${alpha})`;
            line(a.x, a.y, b.x, b.y);
          }
        }
      }

      // Wiring: every particle in reach plugs into its nearest anchor.
      for (const n of nodes) {
        let best: Anchor | null = null;
        let bestD = Infinity;
        for (const a of live) {
          const d = Math.hypot(n.x - a.x, n.y - a.y);
          if (d < a.radius * s && d < bestD) {
            best = a;
            bestD = d;
          }
        }
        if (best && !blocked(best.x, best.y, n.x, n.y)) {
          const k = 1 - bestD / (best.radius * s);
          ctx.strokeStyle = rgba(best.rgb, Math.pow(k, 1.1) * 0.8 * best.alpha * wake);
          ctx.lineWidth = 1.15;
          line(best.x, best.y, n.x, n.y);
          ctx.lineWidth = 1;
        }
      }

      // Cursor links.
      for (const n of nodes) {
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < MOUSE_DIST) {
          if (!blocked(n.x, n.y, mouse.x, mouse.y)) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - mdist / MOUSE_DIST) * 0.27})`;
            line(n.x, n.y, mouse.x, mouse.y);
          }
          if (!reduced) {
            n.x -= mdx * 0.003;
            n.y -= mdy * 0.003;
          }
        }
      }

      // Particles.
      for (const n of nodes) {
        if (inBox(n.x, n.y)) continue;
        if (n.glow > 0.02) {
          ctx.fillStyle = `rgba(232, 121, 249, ${n.glow * 0.45 * wake})`;
          dot(n.x, n.y, n.r * 2 + 8 * n.glow);
        }
        ctx.fillStyle = `rgba(234, 231, 244, ${(0.55 * BASE + n.glow * 0.4) * wake})`;
        dot(n.x, n.y, n.r + n.glow * 1.2);
      }

      if (reduced) {
        eraseText();
        return;
      }

      // Background firing, weighted toward the hub (logo) anchors.
      const ready = live.filter((a) => a.alpha > 0.9);
      if (now > nextSpawn && ready.length) {
        const total = ready.reduce((sum, a) => sum + a.radius, 0);
        let r = Math.random() * total;
        const a = ready.find((x) => (r -= x.radius) < 0) ?? ready[0];
        if (intro) {
          fireFrom(a, 1, 3 + Math.floor(Math.random() * 4));
          nextSpawn = now + 260 + Math.random() * 320;
        } else {
          // Irregular: exponential gaps (mean ~1.5 s) give quiet stretches
          // and the odd quick pair instead of a metronome.
          fireFrom(a, Math.random() < 0.18 ? 2 : 1, 2 + Math.floor(Math.random() * 3));
          const gap = -Math.log(1 - Math.random()) * 1500;
          nextSpawn = now + Math.min(5200, Math.max(350, gap));
        }
      }

      // Touch the AI: hovering a node makes it fire.
      for (const a of ready) {
        if (
          Math.hypot(mouse.x - a.x, mouse.y - a.y) < HOVER_DIST &&
          now - a.lastPing > 140
        ) {
          a.lastPing = now;
          fireFrom(a, 1, 5, true);
          if (Math.random() < 0.3) ripple(a, 20);
        }
      }

      // Pulses: survivors and newly spawned hops land back in `pulses`.
      const current = pulses;
      pulses = [];
      for (const pl of current) {
        const A = pos(pl.from);
        const B = pos(pl.to);
        if (!A || !B || blocked(A.x, A.y, B.x, B.y)) continue;
        const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        pl.t += (pl.speed * dt) / len;
        if (pl.t >= 1) {
          arrive(pl);
          continue;
        }
        const x = A.x + (B.x - A.x) * pl.t;
        const y = A.y + (B.y - A.y) * pl.t;
        // Emerge from an anchor and dissolve into one, so signals never
        // pile up as dots on top of the logo's letterforms.
        const fade =
          pl.k *
          ("a" in pl.from ? Math.min(1, pl.t / 0.15) : 1) *
          ("a" in pl.to ? Math.min(1, (1 - pl.t) / 0.25) : 1);
        const t0 = Math.max(0, pl.t - Math.min(0.5, 36 / len));
        const tx = A.x + (B.x - A.x) * t0;
        const ty = A.y + (B.y - A.y) * t0;
        const trail = ctx.createLinearGradient(tx, ty, x, y);
        trail.addColorStop(0, rgba(pl.rgb, 0));
        trail.addColorStop(1, rgba(pl.rgb, 0.95 * wake * fade));
        ctx.strokeStyle = trail;
        ctx.lineWidth = 2;
        line(tx, ty, x, y);
        ctx.fillStyle = rgba(pl.rgb, 0.3 * wake * fade);
        dot(x, y, 6);
        ctx.fillStyle = `rgba(250, 245, 255, ${0.95 * wake * fade})`;
        dot(x, y, 2);
        pulses.push(pl);
      }

      // Ripples ring out where a signal lands on an anchor.
      ctx.lineWidth = 1.4;
      ripples = ripples.filter((rp) => {
        rp.t += dt / 900;
        if (rp.t >= 1) return false;
        const a = rp.el ? anchors.get(rp.el) : null;
        const cx = a?.visible ? a.x : rp.x;
        const cy = a?.visible ? a.y : rp.y;
        const e = 1 - Math.pow(1 - rp.t, 3);
        ctx.strokeStyle = rgba(rp.rgb, (1 - rp.t) * 0.55 * wake);
        ctx.beginPath();
        ctx.arc(cx, cy, 4 + rp.max * e, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      eraseText();
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    // Also under reduced motion: particles stay frozen (step 0), but the
    // keep-out zones must follow the text while the page scrolls.
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
