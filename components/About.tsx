import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const pillars = [
  {
    label: "VISION",
    title: "AI fluency for every student",
    text: "A WU where every graduate - regardless of major - can work confidently with artificial intelligence and judge it critically.",
  },
  {
    label: "MISSION",
    title: "Make it tangible",
    text: "We lower the barrier to entry with hands-on formats, honest discussion beyond the hype, and a community that ships real projects.",
  },
  {
    label: "APPROACH",
    title: "Learn by building",
    text: "Every semester: workshops, speaker nights and partner projects where theory immediately turns into something you can demo.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden px-5 py-24 md:px-8 md:py-32"
    >
      <div className="absolute top-1/3 -right-64 -z-10 h-[26rem] w-[26rem] rounded-full bg-pulse/10 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="01"
          label="ABOUT US"
          title="AI should be something you can do - not just talk about."
          intro="AI Society Vienna is the student society for artificial intelligence at WU Vienna. We turn curiosity into capability, one workshop, speaker night and project at a time."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.label} delay={0.12 * i}>
              <article className="glass flex h-full flex-col gap-3 rounded-2xl p-7 transition-colors duration-300 hover:border-neon/30">
                <p className="font-mono text-[10px] tracking-[0.25em] text-neon">
                  [ {pillar.label} ]
                </p>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  {pillar.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
