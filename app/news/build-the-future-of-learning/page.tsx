import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const title = "Build the Future of Learning - a vibe coding hackathon with Lovable";
const description =
  "AI Society Vienna's one-day hackathon at WU Vienna on 11 December 2026: teams of 3-4 build tools that make learning better with Lovable. No coding experience needed.";

export const metadata: Metadata = {
  title: `${title} - AI Society Vienna`,
  description,
  openGraph: { title, description, images: ["/news/hackathon-cover.png"], type: "article" },
  twitter: { card: "summary_large_image", title, description, images: ["/news/hackathon-cover.png"] },
};

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <dt className="font-mono text-[10px] tracking-[0.25em] text-neon">[ {label} ]</dt>
      <dd className="mt-2 text-ink">{children}</dd>
    </div>
  );
}

export default function HackathonPost() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 pt-36 pb-24 md:px-8">
        <Link href="/news" className="text-sm text-mist transition-colors hover:text-ink">
          ← All news
        </Link>
        <p className="mt-8 font-mono text-[11px] tracking-[0.25em] text-neon">[ HACKATHON · NOVEMBER 2026 ]</p>
        <h1 className="font-display mt-4 text-4xl leading-tight font-bold tracking-tight text-ink md:text-5xl">
          Build the future <span className="text-gradient">of learning.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-mist">
          A one-day vibe coding hackathon at WU Vienna. Teams of 3-4 students build tools that make studying better -
          with Lovable, from idea to working app in a single day. No coding experience needed.
        </p>

        <Image
          src="/news/hackathon-cover.png"
          alt="AI Society Vienna vibe coding hackathon: Build the future of learning"
          width={1920}
          height={1080}
          priority
          className="mt-10 w-full rounded-2xl border border-line"
        />

        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          <Fact label="WHERE">WU Vienna, Welthandelsplatz 1, 1020 Vienna</Fact>
          <Fact label="WHEN">Thursday, 11 December 2026</Fact>
          <Fact label="WHO">50 students of all fields - teams of 3-4</Fact>
          <Fact label="TOOL">Lovable - build apps by chatting with AI</Fact>
        </dl>

        <div className="mt-12 flex flex-col gap-5 leading-relaxed text-ink/90">
          <h2 className="font-display text-2xl font-semibold text-ink">The challenge</h2>
          <p>
            Everyone studies, and everyone knows what is broken about it. Build a tool that fixes one of those problems.
            Pick a track:
          </p>
          <ul className="flex flex-col gap-2 pl-5 [list-style:square]">
            <li><b>Exam preparation</b> - turn a course into a smarter way to prepare</li>
            <li><b>Group work</b> - projects that don&apos;t end in chaos</li>
            <li><b>Studying alongside a job</b> - planning, focus and motivation</li>
            <li><b>Accessibility</b> - learning for international students and different needs</li>
          </ul>

          <h2 className="font-display mt-6 text-2xl font-semibold text-ink">How the day works</h2>
          <ol className="flex flex-col gap-2 pl-5 [list-style:decimal]">
            <li>Kick-off and a hands-on Lovable crash course</li>
            <li>Six hours of building in your team</li>
            <li>Real students test every tool - their feedback counts</li>
            <li>3-minute pitches and the jury&apos;s decision</li>
          </ol>
          <p>
            You don&apos;t need to code. Business, economics and law students are explicitly welcome - the best teams
            mix backgrounds.
          </p>
        </div>

        <div className="border-gradient mt-12">
          <div className="flex flex-col gap-5 rounded-[15px] bg-abyss/90 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-mist">[ REGISTRATION ]</p>
              <p className="mt-2 text-ink">Registration opens soon. Members hear about it first.</p>
            </div>
            <Link
              href="/join"
              className="glow-neon shrink-0 self-start rounded-full bg-neon px-6 py-3 text-sm font-semibold text-void md:self-auto"
            >
              Become a member →
            </Link>
          </div>
        </div>

        <p className="mt-8 text-sm text-mist">
          Questions or want to partner?{" "}
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("Hackathon")}`} className="text-neon hover:text-ink">
            {site.email}
          </a>
        </p>
      </article>

      <Footer />
    </main>
  );
}
