import { defineField, defineType } from "sanity";

const RESERVED_SLUGS = [
  "about",
  "contact",
  "dashboard",
  "donate",
  "shop",
  "studio",
  "api",
  "login",
  "signup",
  "success",
  "cancel",
];

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().custom((value) => {
          const slug = value?.current?.toLowerCase();
          if (!slug) {
            return true;
          }

          return RESERVED_SLUGS.includes(slug)
            ? "This slug is reserved by app routes."
            : true;
        }),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "showHeroImage",
      type: "boolean",
      initialValue: true,
      title: "Show Hero Image",
    }),
    defineField({
      name: "showBody",
      type: "boolean",
      initialValue: true,
      title: "Show Page Content",
    }),
  ],
});
