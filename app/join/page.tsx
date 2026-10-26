import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { JoinForm } from "@/components/JoinForm";
import { Wordmark } from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Become a Member - AI Society Vienna",
  description:
    "Join AI Society Vienna, the student society for artificial intelligence at WU Vienna. Free membership.",
};

export default function JoinPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <div className="absolute -top-40 left-1/2 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-neon/12 blur-[140px]" />

      <section className="mx-auto max-w-xl px-5 pt-36 pb-24 md:px-8">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
            [ MEMBERSHIP APPLICATION ]
          </p>
          <h1 className="font-display mt-5 flex items-end justify-center gap-[0.3em] text-4xl leading-none font-bold tracking-tight md:text-5xl">
            Join <Wordmark />
          </h1>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-mist">
            Free membership. Fill in the form and you&apos;ll get an email
            right away with the link to our WhatsApp community and the member
            portal.
          </p>
        </div>

        <JoinForm />

        <p className="mt-8 text-center text-sm text-mist">
          Want to help run the society?{" "}
          <Link href="/#core-team" className="font-semibold text-neon transition-colors duration-200 hover:text-ink">
            Become a core member →
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-mist transition-colors duration-200 hover:text-ink"
          >
            ← Back to homepage
          </Link>
        </p>
      </section>
    </main>
  );
}
