/** News posts shown on /news. Newest first. Each post has its own page under /news/<slug>. */
export type NewsPost = {
  slug: string;
  date: string; // display text, e.g. "November 2026"
  tag: string;
  title: string;
  teaser: string;
  image: string;
};

export const news: NewsPost[] = [
  {
    slug: "build-the-future-of-learning",
    date: "November 2026",
    tag: "HACKATHON",
    title: "Build the Future of Learning - our Lovable vibe coding hackathon",
    teaser:
      "One day at WU, teams of 3-4, no coding experience needed: build a tool that makes studying better with Lovable.",
    image: "/news/hackathon-cover.png",
  },
];
