import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "brandDisplayMode",
      title: "Brand Display Mode",
      type: "string",
      initialValue: "both",
      options: {
        list: [
          { title: "Logo only", value: "logo" },
          { title: "Text only", value: "text" },
          { title: "Logo + Text", value: "both" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "footerText",
      type: "localizedText",
    }),
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
