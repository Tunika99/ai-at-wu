import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Event type",
      type: "string",
      options: {
        list: ["Workshop", "Speaker Night", "Meetup"],
        layout: "radio",
      },
      initialValue: "Meetup",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date & time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: 'e.g. "LC Forum, WU Campus" or "Online".',
      type: "string",
    }),
  ],
  orderings: [
    {
      title: "Date, upcoming first",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
