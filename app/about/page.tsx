import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LegalBlock as Block } from "@/components/LegalBlock";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About - AI Society Vienna",
  description:
    "Who we are: AI Society Vienna is a registered non-profit association (ZVR 1989830120) and the student society for artificial intelligence at WU Vienna.",
};

const activities = [
  {
    title: "Workshops",
    text: "Hands-on sessions where members learn to use AI tools for studying, research and their future jobs - no technical background needed.",
  },
  {
    title: "Speaker nights",
    text: "Talks and open discussions with researchers, founders and practitioners about what AI can and cannot do.",
  },
  {
    title: "Hackathons & projects",
    text: "Teams build real prototypes, for example tools that make learning better, and present them to the community.",
  },
];

export default function AboutPage() {
  const l = site.legal;
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 pt-36 pb-16 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">[ ABOUT US ]</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-5xl">
          A non-profit association that makes AI tangible for students.
        </h1>
        <p className="mt-6 max-w-2xl leading-relaxed text-mist">
          {site.name} was founded in {site.foundedYear} by students of WU Vienna (Wirtschaftsuniversität Wien). It is
          registered as an association under Austrian law as <span className="text-ink">{l.name}</span> (ZVR-Zahl{" "}
          {l.zvr}). Membership is free. The association does not aim to make a profit. Its purpose
          is to help students engage with artificial intelligence in an informed, practical and critical way.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/about/wu-lc-front.jpg"
              alt="The Library & Learning Center at WU Vienna, where our members study"
              width={1129}
              height={1500}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="px-5 py-3 text-xs text-mist">
              Library & Learning Center, WU Campus - where most of our members study.
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/about/wu-walkway.jpg"
              alt="Walkway on the WU Vienna campus"
              width={1506}
              height={2000}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="px-5 py-3 text-xs text-mist">WU Campus, Vienna - home of our events.</figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 md:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">What we do</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {activities.map((a) => (
            <article key={a.title} className="glass rounded-2xl p-7">
              <h3 className="font-display text-lg font-semibold text-ink">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{a.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-20 md:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">The association</h2>
        <div className="mt-6">
          <Block title="REGISTERED NAME">
            <p>{l.name}</p>
          </Block>
          <Block title="ADDRESS">
            <p>
              {l.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Block>
          <Block title="REGISTER">
            <p>
              ZVR-Zahl {l.zvr} · Sitz {l.seat} · {l.authority}
            </p>
          </Block>
          <Block title="BOARD">
            {l.board.map((m) => (
              <p key={m.name}>
                {m.name} - {m.role}
              </p>
            ))}
          </Block>
          <Block title="CONTACT">
            <a href={`mailto:${site.email}`} className="text-neon transition-colors hover:text-ink">
              {site.email}
            </a>
          </Block>
        </div>
        <p className="mt-8 flex gap-6 text-sm">
          <Link href="/contact" className="text-neon transition-colors hover:text-ink">
            Contact us →
          </Link>
          <Link href="/join" className="text-neon transition-colors hover:text-ink">
            Become a member →
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
