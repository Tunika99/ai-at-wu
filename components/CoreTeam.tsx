import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowUpRightIcon } from "@/components/icons";
import { DEPARTMENTS } from "@/lib/membership";
import { site } from "@/lib/site";

const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Core team application")}&body=${encodeURIComponent(
  "Hi AI Society Vienna team,\n\nDepartment: \nWhy I want to join: \n\nMy CV is attached.\n\nBest,\n",
)}`;

/** Recruiting for the people who run the society. Applications go by email. */
export function CoreTeam() {
  return (
    <section id="core-team" className="relative scroll-mt-28 px-5 py-24 md:px-8 md:py-32">
      <div className="absolute right-0 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-pulse/8 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="CORE TEAM"
          title="Help run the society."
          intro="Want to shape what we build, host and launch? Become a core member in one of our departments."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.name} delay={0.06 * i}>
              <article className="glass flex h-full flex-col gap-3 rounded-2xl p-6 transition-colors duration-300 hover:border-neon/30">
                <span className="font-mono text-[10px] tracking-[0.25em] text-neon">[ 0{i + 1} ]</span>
                <h3 className="font-display text-lg font-semibold text-ink">{d.name}</h3>
                <p className="text-sm leading-relaxed text-mist">{d.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="border-gradient mt-6">
            <div className="flex flex-col gap-6 rounded-[15px] bg-abyss/90 p-8 backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] tracking-[0.25em] text-mist">[ HOW TO APPLY ]</p>
                <p className="mt-3 leading-relaxed text-ink">
                  Send your <b className="font-semibold">CV</b> and a <b className="font-semibold">short paragraph</b>: why
                  you want to join and which department fits you. We&apos;ll get back to you.
                </p>
              </div>
              <a
                href={mailto}
                className="glow-neon group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-neon px-6 py-3 text-sm font-semibold text-void md:self-auto"
              >
                {site.email}
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
