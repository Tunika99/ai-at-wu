import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  InstagramIcon,
  LinkedInIcon,
  LockIcon,
} from "@/components/icons";
import { site } from "@/lib/site";
import { CtaButton } from "@/components/CtaButton";
import { Wordmark } from "@/components/Wordmark";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pt-24 pb-10 md:px-8 md:pt-32">
      {/* Final CTA banner */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[28rem] w-[70rem] -translate-x-1/2 rounded-full bg-neon/10 blur-[150px]" />

      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">
          [ APPLICATIONS OPEN - WS 2026/27 ]
        </p>
        <h2 className="font-display mt-5 text-4xl font-bold tracking-tight text-ink md:text-6xl">
          Ready to build the future{" "}
          <span className="text-gradient">with us?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-mist">
          Membership is free for WU students. Join a community that turns
          curiosity about AI into real skills - and real projects.
        </p>
        <div className="mt-10">
          <CtaButton href={site.cta.joinHref} className="px-10 py-4 text-base">
            {site.cta.joinLabel}
          </CtaButton>
        </div>
      </Reveal>

      {/* Footer bar */}
      <div className="mx-auto mt-24 max-w-6xl border-t border-line pt-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <p className="text-[22px] text-ink">
              <Wordmark />
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              The student society for artificial intelligence at WU Vienna.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-mist transition-colors duration-200 hover:text-neon"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-mist transition-colors duration-200 hover:text-neon"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="font-mono text-[10px] tracking-[0.25em] text-mist/60">
              [ EXPLORE ]
            </p>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-mist transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] tracking-[0.25em] text-mist/60">
              [ CONTACT ]
            </p>
            <a
              href="mailto:hello@aisocietyvienna.tech"
              className="text-sm text-mist transition-colors duration-200 hover:text-ink"
            >
              hello@aisocietyvienna.tech
            </a>
            <a
              href={site.memberPortal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-mist transition-colors duration-200 hover:text-ink"
            >
              <LockIcon className="h-3.5 w-3.5" />
              {site.memberPortal.label}
            </a>
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-[10px] tracking-[0.2em] text-mist/40">
          © 2026 AI SOCIETY VIENNA - STUDENT SOCIETY AT WU VIENNA · MADE IN VIENNA
        </p>
      </div>
    </footer>
  );
}
