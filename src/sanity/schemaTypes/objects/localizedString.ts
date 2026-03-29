import { defineField, defineType } from "sanity";

export const localizedStringType = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "en",
      type: "string",
      title: "English",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cs",
      type: "string",
      title: "Czech (Čeština)",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      en: "en",
      cs: "cs",
    },
    prepare: ({ en, cs }) => ({
      title: `EN: ${en || "—"} | CS: ${cs || "—"}`,
    }),
  },
});
