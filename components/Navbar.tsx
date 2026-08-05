"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import {
  InstagramIcon,
  LinkedInIcon,
  LockIcon,
} from "@/components/icons";
import { CtaButton } from "@/components/CtaButton";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /**
   * Two identical glowing CTAs competing for attention reads as noise, so
   * while the hero's own "Become a Member" is on screen this one stays a
   * quiet outline and only lights up once the hero CTA scrolls away.
   * Seeded from the pathname so the first paint is already correct: the
   * landing page opens with the hero CTA in view, every other route has
   * no hero CTA at all and therefore owns the only button on screen.
   */
  const [heroCtaVisible, setHeroCtaVisible] = useState(pathname === "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    if (!heroCta) {
      setHeroCtaVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      // Ignore the strip under the navbar: the hero CTA sliding beneath it
      // counts as gone, which is when this button should take over.
      { rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-500 md:px-8 ${
          scrolled
            ? "glass mt-3 rounded-2xl py-3 shadow-[0_8px_40px_rgba(8,6,15,0.6)] md:mx-6 lg:mx-auto"
            : "mt-0 bg-transparent py-5"
        }`}
      >
        {/* Wordmark + inline nav */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight"
          >
            AI&nbsp;<span className="text-neon">@</span>&nbsp;WU
          </Link>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-5">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-xs text-mist transition-colors duration-200 hover:text-ink sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.memberPortal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center gap-1.5 text-xs font-medium text-neon transition-colors duration-200 hover:text-ink sm:text-sm"
            >
              <LockIcon className="h-3.5 w-3.5" />
              {site.memberPortal.label}
            </a>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden text-mist transition-colors duration-200 hover:text-neon md:block"
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hidden text-mist transition-colors duration-200 hover:text-neon md:block"
          >
            <LinkedInIcon className="h-[18px] w-[18px]" />
          </a>
          <CtaButton
            href={site.cta.joinHref}
            size="sm"
            variant={heroCtaVisible ? "outline" : "primary"}
          >
            {site.cta.joinLabel}
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
