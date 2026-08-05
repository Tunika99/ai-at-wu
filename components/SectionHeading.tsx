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
      <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
        [ {index} - {label} ]
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
