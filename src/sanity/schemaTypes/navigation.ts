import { defineField, defineType } from "sanity";

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "headerLinks",
      title: "Header Links",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      of: [{ type: "link" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
