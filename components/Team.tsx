import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

/**
 * The board, as one group photo. Until `site.teamPhoto` points at an
 * image (drop e.g. `team.jpg` into /public and set it to "/team.jpg"), a
 * blueprint-style frame holds its place.
 */
export function Team() {
  return (
    <section
      id="team"
      className="relative scroll-mt-28 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="OUR TEAM"
          title="The people behind the society."
          intro="A board of students from across WU's programs - united by the conviction that the best way to understand AI is to build with it."
        />

        <Reveal delay={0.1} className="mt-14">
          <figure
            data-neural-avoid=""
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-abyss/70 sm:aspect-[16/9]"
          >
            {site.teamPhoto ? (
              <Image
                src={site.teamPhoto}
                alt="The AI Society Vienna board"
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover"
              />
            ) : (
              <>
                <div className="bg-grid absolute inset-0 opacity-70" />
                <span className="absolute top-5 left-5 h-8 w-8 border-t border-l border-neon/60" />
                <span className="absolute top-5 right-5 h-8 w-8 border-t border-r border-neon/60" />
                <span className="absolute bottom-5 left-5 h-8 w-8 border-b border-l border-neon/60" />
                <span className="absolute right-5 bottom-5 h-8 w-8 border-r border-b border-neon/60" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-neon/70"
                    aria-hidden="true"
                  >
                    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
                    <circle cx="12" cy="12.8" r="3.6" />
                  </svg>
                  <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
                    [ TEAM PHOTO - COMING SOON ]
                  </p>
                </div>
              </>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
