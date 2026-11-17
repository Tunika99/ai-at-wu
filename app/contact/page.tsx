import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LegalBlock as Block } from "@/components/LegalBlock";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact - AI Society Vienna",
  description: "Postal address, email and social channels of AI Society Vienna, Simmeringer Hauptstraße 26/1/10, 1110 Wien.",
};

export default function ContactPage() {
  const l = site.legal;
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <article className="mx-auto max-w-2xl px-5 pt-36 pb-20 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">[ CONTACT ]</p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">Get in touch.</h1>
        <p className="mt-4 leading-relaxed text-mist">
          Questions about membership, events or a partnership? Write to us - we usually answer within a few days.
        </p>

        <div className="mt-10">
          <Block title="EMAIL">
            <a href={`mailto:${site.email}`} className="text-neon transition-colors hover:text-ink">
              {site.email}
            </a>
          </Block>
          <Block title="POSTAL ADDRESS">
            <p>
              <span className="block font-semibold">{l.name}</span>
              {l.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Block>
          <Block title="SOCIAL">
            <p>
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-neon hover:text-ink">
                Instagram
              </a>{" "}
              ·{" "}
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-neon hover:text-ink">
                LinkedIn
              </a>
            </p>
          </Block>
          <Block title="REGISTER">
            <p>
              ZVR-Zahl {l.zvr} · Sitz {l.seat}
            </p>
          </Block>
        </div>

        <p className="mt-6 text-sm">
          <Link href="/about" className="text-mist transition-colors hover:text-ink">
            About the association →
          </Link>
        </p>
      </article>

      <Footer />
    </main>
  );
}
