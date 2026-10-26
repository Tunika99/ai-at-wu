/**
 * Shared by the join form (client) and /api/join (server), so the
 * options people see and the values the server accepts never drift apart.
 */

export const PROGRAMS = [
  "WiSo - Business, Economics & Social Sciences",
  "WiRe - Business Law",
  "BBE - Business & Economics",
  "Master's program",
  "Other university",
  "Other",
] as const;

export type Application = {
  name: string;
  email: string;
  phone: string;
  program: (typeof PROGRAMS)[number];
  consent: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()\-/]{6,24}$/;

/** Trims and collapses whitespace; anything that is not a string becomes "". */
export const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

/** Returns the normalised application, or the first problem as a message for the form. */
export function parseApplication(body: Record<string, unknown>): { ok: true; data: Application } | { ok: false; error: string } {
  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const phone = clean(body.phone, 30);
  const program = clean(body.program, 80);

  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Please enter a valid email address." };
  const digits = phone.replace(/\D/g, "").length;
  if (!PHONE.test(phone) || digits < 6 || digits > 15) return { ok: false, error: "Please enter a valid phone number, e.g. +43 660 1234567." };
  if (!(PROGRAMS as readonly string[]).includes(program)) return { ok: false, error: "Please select your study program." };
  if (body.consent !== true) return { ok: false, error: "Please confirm that we may store your details." };

  return { ok: true, data: { name, email, phone, program: program as Application["program"], consent: true } };
}

/** Departments people can apply to as core members (homepage, /#core-team). */
export const DEPARTMENTS = [
  {
    name: "Events & Partnerships",
    text: "Plan workshops and speaker nights, and build relationships with companies and partner clubs.",
  },
  {
    name: "Marketing",
    text: "Tell our story on Instagram, LinkedIn and beyond - content, design and video.",
  },
  {
    name: "Finance",
    text: "Budgets, sponsoring income and clean books, so every idea can actually happen.",
  },
  {
    name: "Legal",
    text: "Statutes, contracts and data protection - keeping the association on solid ground.",
  },
  {
    name: "IT",
    text: "Website, member portal and internal tools - and the tech behind our projects.",
  },
] as const;
