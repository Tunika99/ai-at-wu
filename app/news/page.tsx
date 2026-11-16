import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { news } from "@/lib/news";

export const metadata: Metadata = {
  title: "News - AI Society Vienna",
  description: "Announcements, events and updates from AI Society Vienna.",
};

export default function NewsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <section className="mx-auto max-w-4xl px-5 pt-36 pb-24 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">[ NEWS ]</p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">What&apos;s new.</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-mist">Announcements, events and updates from AI Society Vienna.</p>

        <div className="mt-12 flex flex-col gap-6">
          {news.map((post) => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="glass group overflow-hidden rounded-2xl transition-colors duration-300 hover:border-neon/40"
            >
              <Image src={post.image} alt="" width={1920} height={1080} className="aspect-video w-full object-cover" />
              <div className="p-7 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.25em] text-neon">
                  [ {post.tag} · {post.date.toUpperCase()} ]
                </p>
                <h2 className="font-display mt-3 text-2xl font-semibold text-ink md:text-3xl">{post.title}</h2>
                <p className="mt-3 leading-relaxed text-mist">{post.teaser}</p>
                <p className="mt-5 text-sm font-semibold text-neon">Read more →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
