import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { LinkedInIcon } from "@/components/icons";
import { team, type TeamMember } from "@/lib/content";

const avatarGradients = [
  "from-neon/70 to-pulse/70",
  "from-pulse/70 to-signal/70",
  "from-signal/70 to-neon/70",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function Team({ members = team }: { members?: TeamMember[] }) {
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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <Reveal key={member.name} delay={0.08 * i}>
              <article className="glass group flex items-center gap-5 rounded-2xl p-6 transition-colors duration-300 hover:border-neon/30">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                    avatarGradients[i % avatarGradients.length]
                  } font-display text-lg font-semibold text-void`}
                >
                  {initials(member.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display truncate font-semibold text-ink">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-mist">
                    [ {member.role} ]
                  </p>
                </div>
                <a
                  href={member.linkedin ?? "#"}
                  aria-label={`${member.name} on LinkedIn`}
                  className="text-mist/50 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-neon"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
