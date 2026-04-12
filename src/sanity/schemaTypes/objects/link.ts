import { defineField, defineType } from "sanity";

export const linkType = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "labelI18n",
      title: "Localized Label",
      type: "localizedString",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL or Path",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
