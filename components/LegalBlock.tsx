import type { ReactNode } from "react";

/** One titled section of a legal page (Impressum, Datenschutz). */
export function LegalBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-7">
      <h2 className="font-mono text-[10px] tracking-[0.25em] text-neon">[ {title} ]</h2>
      <div className="mt-3 flex flex-col gap-3 leading-relaxed text-ink/90">{children}</div>
    </section>
  );
}
