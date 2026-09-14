import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  index,
  label,
  title,
  intro,
  centered = false,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
  centered?: boolean;
}) {
  return (
    <Reveal className={centered ? "text-center" : ""}>
      <p
        className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-neon ${
          centered ? "justify-center" : ""
        }`}
      >
        {/* Each section is a node of the site's neural backdrop: signals
            from the logo reach it and ring out here. */}
        <span
          data-neural-anchor="#e879f9"
          data-neural-radius="190"
          className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-pulse shadow-[0_0_12px_rgba(232,121,249,0.7)]"
        />
        <span data-neural-avoid="">[ {index} - {label} ]</span>
      </p>
      <h2
        className={`font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight text-ink md:text-5xl ${
          centered ? "mx-auto" : ""
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 max-w-2xl leading-relaxed text-mist ${
            centered ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
