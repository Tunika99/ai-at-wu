"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const programs = [
  "BBE - Business & Economics",
  "WiRe / WiSo - Business Law & Socioeconomics",
  "IBW - International Business",
  "WINF - Business Informatics",
  "Master's program",
  "Other",
];

export function JoinForm() {
  // Submission is not persisted yet - the backend arrives with the
  // member-portal phase; until then this only confirms client-side.
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
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
          We&apos;ll get back to you within a few days with your personal
          invite to our Notion member portal. In the meantime, follow us on
          Instagram and LinkedIn to stay in the loop.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="glass flex flex-col gap-5 rounded-2xl p-8 md:p-10"
    >
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-mist">
          [ FULL NAME ]
        </span>
        <input
          type="text"
          name="name"
          required
          placeholder="Ada Lovelace"
          className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-mist/40 focus:border-neon/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-mist">
          [ WU EMAIL ]
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder="h12345678@s.wu.ac.at"
          className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-mist/40 focus:border-neon/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-mist">
          [ STUDY PROGRAM ]
        </span>
        <select
          name="program"
          required
          defaultValue=""
          className="appearance-none rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-ink focus:border-neon/50 focus:outline-none"
        >
          <option value="" disabled className="bg-panel">
            Select your program…
          </option>
          {programs.map((program) => (
            <option key={program} value={program} className="bg-panel">
              {program}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-mist">
          [ WHY DO YOU WANT TO JOIN? - OPTIONAL ]
        </span>
        <textarea
          name="motivation"
          rows={4}
          placeholder="I want to build…"
          className="resize-none rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-mist/40 focus:border-neon/50 focus:outline-none"
        />
      </label>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="glow-neon group relative mt-2 overflow-hidden rounded-full bg-neon px-8 py-3.5 text-sm font-semibold text-void"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative">Submit Application</span>
      </motion.button>

      <p className="text-center font-mono text-[10px] tracking-[0.2em] text-mist/50">
        [ FREE FOR WU STUDENTS · NO SPAM, EVER ]
      </p>
    </form>
  );
}
