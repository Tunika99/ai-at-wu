import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum - AI Society Vienna",
  description: "Legal notice of AI Society Vienna (Impressum and Offenlegung according to Austrian law).",
};

/**
 * Legal notice for an Austrian association: information duties under
 * § 5 E-Commerce-Gesetz and the Offenlegung under § 25 Mediengesetz.
 * The data lives in site.legal.
 */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-7">
      <h2 className="font-mono text-[10px] tracking-[0.25em] text-neon">[ {title} ]</h2>
      <div className="mt-3 leading-relaxed text-ink/90">{children}</div>
    </section>
  );
}

export default function ImpressumPage() {
  const l = site.legal;
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <article className="mx-auto max-w-2xl px-5 pt-36 pb-20 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">[ LEGAL NOTICE ]</p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">Impressum</h1>
        <p className="mt-4 text-sm text-mist">
          Information according to § 5 E-Commerce-Gesetz (ECG) and disclosure according to § 25 Mediengesetz (MedienG).
        </p>

        <div className="mt-10">
          <Block title="MEDIENINHABER & HERAUSGEBER">
            <p className="font-semibold">{l.name}</p>
            <p className="mt-2">
              {l.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Block>

          <Block title="VEREINSREGISTER">
            <p>ZVR-Zahl: {l.zvr}</p>
            <p>Sitz: {l.seat}</p>
            <p>Vereinsbehörde: {l.authority}</p>
          </Block>

          <Block title="VERTRETUNGSBEFUGTE ORGANE">
            {l.board.map((m) => (
              <p key={m.name}>
                {m.name} - {m.role}
              </p>
            ))}
          </Block>

          <Block title="KONTAKT">
            <a href={`mailto:${site.email}`} className="text-neon transition-colors hover:text-ink">
              {site.email}
            </a>
          </Block>

          <Block title="GRUNDLEGENDE RICHTUNG (§ 25 ABS. 4 MEDIENG)">
            <p>
              Vereinszweck: {l.purpose}. Die Website informiert über den Verein, seine Veranstaltungen, Workshops und
              die Mitgliedschaft.
            </p>
          </Block>

          <Block title="HAFTUNG & URHEBERRECHT">
            <p>
              Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
              Aktualität können wir jedoch keine Gewähr übernehmen. Für Inhalte verlinkter externer Websites sind
              ausschließlich deren Betreiber verantwortlich. Texte, Grafiken und das Logo dieser Website sind
              urheberrechtlich geschützt.
            </p>
          </Block>

          <Block title="ONLINE-STREITBEILEGUNG">
            <p>
              Der Verein ist nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Block>
        </div>

        <p className="mt-6">
          <Link href="/" className="text-sm text-mist transition-colors duration-200 hover:text-ink">
            ← Back to homepage
          </Link>
        </p>
      </article>

      <Footer />
    </main>
  );
}
