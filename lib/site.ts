/**
 * Central site configuration.
 *
 * In the production build these values come from the headless CMS
 * (Sanity, `siteSettings` document) so non-technical members can edit
 * them without touching code. Placeholder values below - replace with
 * real figures.
 */
export const site = {
  name: "AI Society Vienna",
  mission:
    "We make artificial intelligence tangible for every student at WU - through hands-on workshops, world-class speakers and a community that builds.",
  foundedYear: 2026,
  memberCount: "50+",
  eventsPerYear: "30+",
  partner: "AI @ Penn",
  /** The one public address for members, partners and core-team applications. */
  email: "info@aisocietyvienna.tech",
  /** Registered association details (Bescheid LPD Wien, GZ XV-19.161) - used by /impressum. */
  legal: {
    name: "AI Society Vienna - Verein zur Förderung der Auseinandersetzung mit künstlicher Intelligenz",
    zvr: "1989830120",
    seat: "Wien",
    address: ["Simmeringer Hauptstraße 26/1/10", "1110 Wien", "Österreich"],
    authority: "Landespolizeidirektion Wien, Vereinsbehörde",
    board: [
      { name: "Paul Dobringer", role: "President" },
      { name: "Edward Dimapilis", role: "Vice President" },
    ],
    purpose: "Förderung der Auseinandersetzung mit künstlicher Intelligenz",
  },
  cta: {
    joinLabel: "Become a Member",
    joinHref: "/join",
  },
  /**
   * The member portal is a Notion workspace. Access control happens on
   * Notion's side: member emails get invited to the page, so anyone
   * who is a member lands signed-in; everyone else hits Notion's
   * request-access wall. Placeholder URL - replace with the real page.
   */
  memberPortal: {
    label: "Member Portal",
    url: "https://www.notion.so/ai-society-vienna/member-portal",
  },
  socials: {
    instagram: "https://www.instagram.com/aisocietyvienna",
    linkedin: "https://www.linkedin.com/company/ai-society-vienna",
  },
  /**
   * Root-relative hashes, not bare "#about": the navbar also renders on
   * /join, where a bare hash would look for a section that isn't there.
   */
  nav: [
    { label: "About", href: "/#about" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Events", href: "/#events" },
    { label: "Partners", href: "/#partners" },
  ],
} as const;
