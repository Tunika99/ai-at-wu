import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { GlowCard } from "@/components/GlowCard";
import { CardDecor } from "@/components/CardDecor";
import {
  ArrowUpRightIcon,
  GlobeIcon,
  LockIcon,
  NodesIcon,
  RocketIcon,
  SparkIcon,
  UsersIcon,
} from "@/components/icons";
import { benefits, type Benefit } from "@/lib/content";
import { site } from "@/lib/site";

const iconMap: Record<Benefit["icon"], typeof SparkIcon> = {
  spark: SparkIcon,
  nodes: NodesIcon,
  lock: LockIcon,
  rocket: RocketIcon,
  globe: GlobeIcon,
  users: UsersIcon,
};

/** Bento spans per benefit; the portal tile is the tall feature. */
const spanMap: Record<Benefit["icon"], string> = {
  lock: "md:col-span-3 md:row-span-2",
  spark: "md:col-span-3",
  nodes: "md:col-span-3",
  rocket: "md:col-span-2",
  globe: "md:col-span-2",
  users: "md:col-span-2",
};

const portalFiles = [
  { name: "building-ai-agents.pdf", meta: "SLIDES" },
  { name: "speaker-night-oct.mp4", meta: "RECORDING" },
  { name: "learning-path-llm.md", meta: "GUIDE" },
  { name: "internal-announcements", meta: "BOARD" },
];

function TileHeader({
  benefit,
  index,
}: {
  benefit: Benefit;
  index: number;
}) {
  const Icon = iconMap[benefit.icon];
  return (
    <div className="flex items-start justify-between">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          benefit.highlighted
            ? "glow-neon bg-gradient-to-br from-neon to-pulse text-void"
            : "bg-neon/10 text-neon"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-mono text-[10px] tracking-[0.25em] text-mist/50">
        [ 0{index + 1} ]
      </span>
    </div>
  );
}

export function Benefits() {
  const portal = benefits.find((b) => b.icon === "lock");
  const ordered = portal
    ? [portal, ...benefits.filter((b) => b !== portal)]
    : benefits;

  return (
    <section
      id="benefits"
      className="relative scroll-mt-28 overflow-hidden px-5 py-24 md:px-8 md:py-32"
    >
      <div className="absolute top-1/4 -left-64 -z-10 h-[26rem] w-[26rem] rounded-full bg-neon/10 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          label="MEMBER BENEFITS"
          title="What membership unlocks."
          intro="Free for WU students. One application, a whole semester of access."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {ordered.map((benefit, i) => (
            <Reveal
              key={benefit.title}
              delay={0.07 * i}
              className={spanMap[benefit.icon]}
            >
              <div className="border-gradient h-full transition-transform duration-300 hover:-translate-y-1">
                <GlowCard className="h-full rounded-[15px] bg-abyss/90 backdrop-blur-md">
                  <CardDecor icon={benefit.icon} />

                  {/* Content sits above the decorative layer */}
                  <div className="relative z-10 flex h-full flex-col gap-4 p-7">
                  <TileHeader benefit={benefit} index={i} />

                  <h3 className="font-display text-lg font-semibold text-ink">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">
                    {benefit.text}
                  </p>

                  {benefit.highlighted && (
                    <>
                      {/* Mini portal mock */}
                      <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-line bg-void/70 p-4">
                        {portalFiles.map((file, j) => (
                          <div
                            key={file.name}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[11px] ${
                              j === 0
                                ? "border border-neon/25 bg-neon/10 text-ink"
                                : "text-mist/80"
                            }`}
                          >
                            <LockIcon className="h-3.5 w-3.5 shrink-0 text-neon/70" />
                            <span className="truncate">{file.name}</span>
                            <span className="ml-auto shrink-0 text-[9px] tracking-[0.2em] text-mist/50">
                              {file.meta}
                            </span>
                          </div>
                        ))}
                      </div>
                      <a
                        href={site.memberPortal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-auto inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-neon transition-colors hover:text-ink"
                      >
                        [ OPEN MEMBER PORTAL ]
                        <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </>
                  )}
                  </div>
                </GlowCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
