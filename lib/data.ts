import { groq } from "next-sanity";
import { client } from "@/lib/sanity/client";
import { site } from "@/lib/site";
import {
  events as fallbackEvents,
  team as fallbackTeam,
  type EventItem,
  type EventType,
  type TeamMember,
} from "@/lib/content";

/**
 * Data layer for the landing page. Every getter fetches from Sanity
 * when configured and silently falls back to the placeholder content
 * in lib/site.ts / lib/content.ts otherwise - so the site works before
 * the CMS is set up and keeps working if the CMS is unreachable.
 */

export type SiteSettings = {
  mission: string;
  foundedYear: number;
  memberCount: string;
  eventsPerYear: string;
};

const fallbackSettings: SiteSettings = {
  mission: site.mission,
  foundedYear: site.foundedYear,
  memberCount: site.memberCount,
  eventsPerYear: site.eventsPerYear,
};

const FETCH_OPTIONS = { next: { revalidate: 60 } };

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return fallbackSettings;
  try {
    const doc = await client.fetch<Partial<SiteSettings> | null>(
      groq`*[_type == "siteSettings"][0]{mission, foundedYear, memberCount, eventsPerYear}`,
      {},
      FETCH_OPTIONS,
    );
    if (!doc) return fallbackSettings;
    return {
      mission: doc.mission ?? fallbackSettings.mission,
      foundedYear: doc.foundedYear ?? fallbackSettings.foundedYear,
      memberCount: doc.memberCount ?? fallbackSettings.memberCount,
      eventsPerYear: doc.eventsPerYear ?? fallbackSettings.eventsPerYear,
    };
  } catch {
    return fallbackSettings;
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!client) return fallbackTeam;
  try {
    const docs = await client.fetch<TeamMember[] | null>(
      groq`*[_type == "teamMember"] | order(order asc){name, role, "linkedin": linkedin}`,
      {},
      FETCH_OPTIONS,
    );
    return docs?.length ? docs : fallbackTeam;
  } catch {
    return fallbackTeam;
  }
}

const KNOWN_EVENT_TYPES: EventType[] = ["Workshop", "Speaker Night", "Meetup"];

type EventDoc = {
  title: string;
  type: string;
  date: string;
  location?: string;
};

export async function getEvents(): Promise<EventItem[]> {
  if (!client) return fallbackEvents;
  try {
    const docs = await client.fetch<EventDoc[] | null>(
      groq`*[_type == "event" && dateTime(date) >= dateTime(now())] | order(date asc)[0...6]{title, type, date, location}`,
      {},
      FETCH_OPTIONS,
    );
    if (!docs?.length) return fallbackEvents;
    return docs.map((doc) => {
      const date = new Date(doc.date);
      return {
        day: String(date.getDate()).padStart(2, "0"),
        month: date
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase(),
        title: doc.title,
        type: KNOWN_EVENT_TYPES.includes(doc.type as EventType)
          ? (doc.type as EventType)
          : "Meetup",
        time: date.toLocaleTimeString("de-AT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: doc.location ?? "",
      };
    });
  } catch {
    return fallbackEvents;
  }
}
