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
    defineField({
      name: "pageBannerStartColor",
      title: "Page Banner Gradient Start",
      type: "string",
      description: "CSS color for the banner gradient start (top-left). Default: #d1fae5",
    }),
    defineField({
      name: "pageBannerMidColor",
      title: "Page Banner Gradient Middle",
      type: "string",
      description: "CSS color for the banner gradient midpoint. Default: #ecfdf5",
    }),
    defineField({
      name: "pageBannerEndColor",
      title: "Page Banner Gradient End",
      type: "string",
      description: "CSS color for the banner gradient end (bottom-right). Default: #fef9c3",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
