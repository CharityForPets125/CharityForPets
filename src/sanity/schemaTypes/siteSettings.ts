import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "design", title: "🎨 Design & Colors" },
  ],
  fields: [
    defineField({
      name: "siteName",
      type: "localizedString",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "logo", type: "image", group: "general", options: { hotspot: true } }),
    defineField({
      name: "brandDisplayMode",
      title: "Brand Display Mode",
      type: "string",
      group: "general",
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
      group: "general",
    }),
    defineField({ name: "contactEmail", type: "string", group: "general" }),
    defineField({
      name: "socialLinks",
      type: "array",
      group: "general",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "pageBannerStartColor",
      title: "Page Banner Gradient — Start Color",
      type: "string",
      group: "design",
      description: "CSS color for the banner gradient start (top-left). Default: #d1fae5",
    }),
    defineField({
      name: "pageBannerMidColor",
      title: "Page Banner Gradient — Middle Color",
      type: "string",
      group: "design",
      description: "CSS color for the banner gradient midpoint. Default: #ecfdf5",
    }),
    defineField({
      name: "pageBannerEndColor",
      title: "Page Banner Gradient — End Color",
      type: "string",
      group: "design",
      description: "CSS color for the banner gradient end (bottom-right). Default: #fef9c3",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
