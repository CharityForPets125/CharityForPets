import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "footerText", type: "text" }),
    defineField({ name: "contactEmail", type: "string" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [{ type: "link" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
