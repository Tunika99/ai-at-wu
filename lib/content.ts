/**
 * Placeholder content for the landing sections.
 *
 * Same philosophy as lib/site.ts: each export mirrors the shape of a
 * future Sanity document type (teamMember, benefit, event, partner),
 * so wiring the CMS in later is a mechanical swap. All names, dates
 * and figures below are placeholders - replace with real data.
 */

export type TeamMember = {
  name: string;
  role: string;
  linkedin?: string;
};

export const team: TeamMember[] = [
  { name: "Anna Gruber", role: "PRESIDENT" },
  { name: "Felix Wagner", role: "VP OPERATIONS" },
  { name: "Lea Steiner", role: "HEAD OF EVENTS" },
  { name: "David Novak", role: "HEAD OF PARTNERSHIPS" },
  { name: "Sophie Berger", role: "HEAD OF TECH" },
  { name: "Maximilian Hofer", role: "HEAD OF MARKETING" },
];

export type Benefit = {
  icon: "spark" | "nodes" | "lock" | "rocket" | "globe" | "users";
  title: string;
  text: string;
  highlighted?: boolean;
};

export const benefits: Benefit[] = [
  {
    icon: "spark",
    title: "Hands-on Workshops",
    text: "From prompt engineering to building agents - practical sessions where you leave with something running, not just notes.",
  },
  {
    icon: "nodes",
    title: "Speaker Access",
    text: "Founders, researchers and industry leads on stage - and within reach at the after-event meetups reserved for members.",
  },
  {
    icon: "lock",
    title: "Exclusive Member Portal",
    text: "Our entire knowledge base lives in Notion - slides, recordings, learning paths and internal announcements. One link, and members are right in.",
    highlighted: true,
  },
  {
    icon: "rocket",
    title: "Career Fast-Track",
    text: "Partner companies recruit directly from our community. Members get first access to internships and project roles.",
  },
  {
    icon: "globe",
    title: "Global Exchange",
    text: "Joint formats with AI @ Penn connect you to a transatlantic network of students building with AI.",
  },
  {
    icon: "users",
    title: "A Community that Builds",
    text: "Study groups, hackathon teams, side projects - find the people who want to build the same things you do.",
  },
];

export type EventType = "Workshop" | "Speaker Night" | "Meetup";

export type EventItem = {
  day: string;
  month: string;
  title: string;
  type: EventType;
  time: string;
  location: string;
};

export const events: EventItem[] = [
  {
    day: "30",
    month: "SEP",
    title: "Semester Kickoff - Welcome to AI @ WU",
    type: "Meetup",
    time: "18:30",
    location: "LC Forum, WU Campus",
  },
  {
    day: "14",
    month: "OCT",
    title: "Hands-on: Building Your First AI Agent",
    type: "Workshop",
    time: "17:00",
    location: "TC 3.05",
  },
  {
    day: "28",
    month: "OCT",
    title: "Speaker Night - AI in Austrian Industry",
    type: "Speaker Night",
    time: "19:00",
    location: "LC Ceremonial Hall 1",
  },
  {
    day: "11",
    month: "NOV",
    title: "AI @ WU × AI @ Penn - Global Exchange Session",
    type: "Meetup",
    time: "16:00",
    location: "Online",
  },
];
