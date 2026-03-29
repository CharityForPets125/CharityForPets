import { defineField, defineType } from "sanity";

export const localizedTextType = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      type: "text",
      title: "English",
      rows: 3,
    }),
    defineField({
      name: "cs",
      type: "text",
      title: "Czech (Čeština)",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      en: "en",
      cs: "cs",
    },
    prepare: ({ en, cs }) => ({
      title: `EN: ${(en || "—").substring(0, 30)}... | CS: ${(cs || "—").substring(0, 30)}...`,
    }),
  },
});
