import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "mission",
      title: "Mission statement",
      description: "The sentence shown under the AI @ WU headline.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "foundedYear",
      title: "Founded (year)",
      type: "number",
    }),
    defineField({
      name: "memberCount",
      title: "Member count",
      description: 'Shown in the hero stats, e.g. "250+".',
      type: "string",
    }),
    defineField({
      name: "eventsPerYear",
      title: "Events per year",
      description: 'Shown in the hero stats, e.g. "30+".',
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
