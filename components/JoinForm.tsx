"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { PROGRAMS } from "@/lib/membership";
import { site } from "@/lib/site";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "done"; welcomeSent: boolean }
  | { state: "error"; message: string };

const field =
  "rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-mist/40 focus:border-neon/50 focus:outline-none";
const label = "font-mono text-[10px] tracking-[0.25em] text-mist";

export function JoinForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          program: form.get("program"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) {
        setStatus({ state: "error", message: out.error ?? `Something went wrong. Please try again or write to ${site.email}.` });
        return;
      }
      setStatus({ state: "done", welcomeSent: out.welcomeSent !== false });
    } catch {
      setStatus({ state: "error", message: `No connection. Please try again or write to ${site.email}.` });
    }
  }

  if (status.state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl border-neon/35 p-10 text-center"
      >
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
          [ APPLICATION RECEIVED ]
        </p>
        <h2 className="font-display mt-4 text-2xl font-bold text-ink">
          Welcome aboard 🎉
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-mist">
          {status.welcomeSent
            ? "Check your inbox: we've just sent you the link to our WhatsApp community and to the member portal. Nothing there? Have a look in your spam folder."
            : "We've got your application and will send you the links to our WhatsApp community and the member portal shortly."}
        </p>
      </motion.div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form onSubmit={onSubmit} className="glass flex flex-col gap-5 rounded-2xl p-8 md:p-10">
      <label className="flex flex-col gap-2">
        <span className={label}>[ FULL NAME ]</span>
        <input type="text" name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Ada Lovelace" className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>[ STUDENT EMAIL ADDRESS ]</span>
        <input type="email" name="email" required maxLength={120} autoComplete="email" placeholder="h12345678@s.wu.ac.at" className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>[ PHONE NUMBER - FOR OUR WHATSAPP COMMUNITY ]</span>
        <input
          type="tel"
          name="phone"
          required
          maxLength={30}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+43 660 1234567"
          className={field}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>[ STUDY PROGRAM ]</span>
        <select name="program" required defaultValue="" className={`appearance-none ${field}`}>
          <option value="" disabled className="bg-panel">
            Select your program…
          </option>
          {PROGRAMS.map((program) => (
            <option key={program} value={program} className="bg-panel">
              {program}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-mist">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#a78bfa]" />
        <span>
          I agree that AI Society Vienna stores my details to manage my membership and adds my number to the
          WhatsApp community. I can ask for deletion anytime at {site.email}. Details in our{" "}
          <a href="/datenschutz" target="_blank" className="text-neon underline-offset-2 hover:underline">
            privacy policy
          </a>
          .
        </span>
      </label>

      {/* Honeypot: invisible to people, bots fill it in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {status.state === "error" && (
        <p role="alert" className="rounded-xl border border-pulse/40 bg-pulse/10 px-4 py-3 text-sm text-ink">
          {status.message}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={sending}
        whileHover={sending ? undefined : { scale: 1.02 }}
        whileTap={sending ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="glow-neon group relative mt-2 overflow-hidden rounded-full bg-neon px-8 py-3.5 text-sm font-semibold text-void disabled:opacity-70"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative">{sending ? "Sending…" : "Submit Application"}</span>
      </motion.button>

      <p className="text-center font-mono text-[10px] tracking-[0.2em] text-mist/50">
        [ FREE MEMBERSHIP · NO SPAM, EVER ]
      </p>
    </form>
  );
}
