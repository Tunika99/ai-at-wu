import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowUpRightIcon, GlobeIcon } from "@/components/icons";

const jointFormats = [
  "JOINT SPEAKER SESSIONS",
  "SHARED RESOURCE LIBRARY",
  "TRANSATLANTIC NETWORK",
];

export function Partners() {
  return (
    <section
      id="partners"
      className="relative scroll-mt-28 overflow-hidden px-5 py-24 md:px-8 md:py-32"
    >
      <div className="absolute top-0 -right-52 -z-10 h-[24rem] w-[24rem] rounded-full bg-pulse/10 blur-[130px]" />
      <div className="absolute bottom-0 -left-52 -z-10 h-[24rem] w-[24rem] rounded-full bg-neon/10 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="PARTNERS"
          title="Stronger together."
          intro="We collaborate with student societies and companies that share our mission."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured: AI @ Wharton */}
          <Reveal>
            <article className="glass relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border-pulse/30 p-8 md:p-10">
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-pulse/20 blur-[90px]" />

              <p className="font-mono text-[10px] tracking-[0.25em] text-pulse">
                [ FEATURED PARTNERSHIP ]
              </p>

              <h3 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                AI <span className="text-gradient">@</span> Penn
              </h3>

              <p className="max-w-xl leading-relaxed text-mist">
                Our flagship partnership connects WU with the AI club at the
                University of Pennsylvania. Members join shared speaker
                sessions, exchange resources and plug into a network of
                students building with AI on both sides of the Atlantic.
              </p>

              <ul className="mt-auto flex flex-wrap gap-3">
                {jointFormats.map((format) => (
                  <li
                    key={format}
                    className="rounded-full border border-pulse/25 bg-pulse/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.15em] text-pulse"
                  >
                    {format}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          {/* Partner CTA */}
          <Reveal delay={0.15}>
            <article className="glass flex h-full flex-col gap-5 rounded-2xl p-8 transition-colors duration-300 hover:border-neon/30 md:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon/10 text-neon">
                <GlobeIcon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                Partner with us
              </h3>
              <p className="text-sm leading-relaxed text-mist">
                Reach an engaged community of WU students building with AI -
                through workshops, recruiting formats or event sponsoring.
              </p>
              <a
                href="mailto:partners@aisocietyvienna.tech"
                className="group mt-auto inline-flex items-center gap-2 text-sm font-semibold text-neon"
              >
                partners@aisocietyvienna.tech
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
