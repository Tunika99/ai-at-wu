/**
 * Central site configuration.
 *
 * In the production build these values come from the headless CMS
 * (Sanity, `siteSettings` document) so non-technical members can edit
 * them without touching code. Placeholder values below - replace with
 * real figures.
 */
export const site = {
  name: "AI @ WU",
  mission:
    "We make artificial intelligence tangible for every student at WU - through hands-on workshops, world-class speakers and a community that builds.",
  foundedYear: 2024,
  memberCount: "250+",
  eventsPerYear: "30+",
  partner: "AI @ Penn",
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
    url: "https://www.notion.so/ai-at-wu/member-portal",
  },
  socials: {
    instagram: "https://www.instagram.com/ai.at.wu",
    linkedin: "https://www.linkedin.com/company/ai-at-wu",
  },
  /**
   * Root-relative hashes, not bare "#about": the navbar also renders on
   * /join, where a bare hash would look for a section that isn't there.
   */
  nav: [
    { label: "About", href: "/#about" },
    { label: "Team", href: "/#team" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Events", href: "/#events" },
    { label: "Partners", href: "/#partners" },
  ],
} as const;
