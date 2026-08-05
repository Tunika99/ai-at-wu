import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowUpRightIcon } from "@/components/icons";
import {
  events as defaultEvents,
  type EventItem,
  type EventType,
} from "@/lib/content";

const typeStyles: Record<EventType, string> = {
  Workshop: "border-neon/30 bg-neon/10 text-neon",
  "Speaker Night": "border-pulse/30 bg-pulse/10 text-pulse",
  Meetup: "border-signal/30 bg-signal/10 text-signal",
};

export function Events({ events = defaultEvents }: { events?: EventItem[] }) {
  return (
    <section
      id="events"
      className="relative scroll-mt-28 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="PROGRAM & EVENTS"
          title="Upcoming this semester."
          intro="Workshops, speaker nights and meetups - updated by the events team in the CMS, always current here."
        />

        <div className="mt-14 flex flex-col divide-y divide-line border-y border-line">
          {events.map((event, i) => (
            <Reveal key={`${event.day}-${event.title}`} delay={0.07 * i}>
              <article className="group flex items-center gap-6 px-2 py-6 transition-colors duration-300 hover:bg-white/[0.03] md:gap-10 md:px-6">
                <div className="flex w-14 shrink-0 flex-col items-center">
                  <span className="font-display text-3xl font-semibold text-ink">
                    {event.day}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neon">
                    {event.month}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display truncate font-semibold text-ink md:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-mist">
                    {event.time} · {event.location.toUpperCase()}
                  </p>
                </div>

                <span
                  className={`hidden shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase sm:inline-block ${
                    typeStyles[event.type]
                  }`}
                >
                  {event.type}
                </span>

                <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-mist/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon" />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.25em] text-mist/60">
            [ FULL CALENDAR AVAILABLE IN THE MEMBER PORTAL ]
          </p>
        </Reveal>
      </div>
    </section>
  );
}
