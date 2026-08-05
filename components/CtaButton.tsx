"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Premium call-to-action: the button is magnetically drawn toward the
 * cursor, a light sheen sweeps across on hover, and it presses inward
 * on click. Pointer effects are progressive - with no pointer or
 * reduced motion it stays a plain, fully working link.
 */
export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  // Label drifts a touch further than the button for a parallax feel.
  const labelX = useTransform(sx, (v) => v * 0.35);
  const labelY = useTransform(sy, (v) => v * 0.35);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.22);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  // Every variant carries a border so switching between them (the navbar
  // CTA morphs outline -> primary on scroll) never shifts layout.
  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full border font-semibold transition-[background-color,color,border-color,box-shadow] duration-500 ease-out";
  const sizing =
    size === "sm"
      ? "px-4 py-2 text-xs sm:px-5 sm:text-sm"
      : "px-8 py-3.5 text-sm";
  const skin =
    variant === "primary"
      ? "glow-neon border-neon bg-neon text-void"
      : variant === "outline"
        ? "border-neon/45 bg-transparent text-neon hover:border-neon hover:bg-neon/10"
        : "glass border-white/10 text-ink hover:border-neon/40";

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.955 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onBlur={reset}
        className={`${base} ${sizing} ${skin} ${className}`}
      >
        {/* Sheen sweep */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full ${
            variant === "primary" ? "bg-white/25" : "bg-neon/10"
          }`}
        />
        <motion.span style={{ x: labelX, y: labelY }} className="relative">
          {children}
        </motion.span>
      </Link>
    </motion.div>
  );
}
