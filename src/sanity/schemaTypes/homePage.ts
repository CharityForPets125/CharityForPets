import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      type: "string",
    }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "impactCounters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "value", type: "number", validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "aboutTitle",
      type: "string",
    }),
    defineField({
      name: "aboutText",
      type: "text",
    }),
    defineField({
      name: "ctaTitle",
      type: "string",
    }),
    defineField({
      name: "ctaText",
      type: "text",
    }),
    defineField({
      name: "testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "text" }),
            defineField({ name: "author", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "showHeroSection",
      type: "boolean",
      initialValue: true,
      title: "Show Hero Section",
    }),
    defineField({
      name: "showImpactCounters",
      type: "boolean",
      initialValue: true,
      title: "Show Impact Counters Section",
    }),
    defineField({
      name: "showAboutSection",
      type: "boolean",
      initialValue: true,
      title: "Show About Section",
    }),
    defineField({
      name: "showCTASection",
      type: "boolean",
      initialValue: true,
      title: "Show CTA Section",
    }),
    defineField({
      name: "showTestimonials",
      type: "boolean",
      initialValue: true,
      title: "Show Testimonials",
    }),
    defineField({
      name: "showFeaturedProducts",
      type: "boolean",
      initialValue: true,
      title: "Show Featured Products",
    }),
    defineField({
      name: "showHowItWorks",
      type: "boolean",
      initialValue: true,
      title: "Show How It Works Section",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
