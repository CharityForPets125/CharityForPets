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

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
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
    defineField({ name: "images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "price", type: "number", validation: (rule) => rule.required().positive() }),
    defineField({
      name: "description",
      type: "localizedText",
    }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "stripePriceId", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "inStock", type: "boolean", initialValue: true }),
  ],
});
