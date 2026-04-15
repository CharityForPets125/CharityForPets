import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      type: "localizedString",
    }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "howItWorksImages",
      title: "How It Works Images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "impactSectionImage",
      title: "Impact Section Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ctaSectionImage",
      title: "CTA Section Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "impactCounters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "localizedString", validation: (rule) => rule.required() }),
            defineField({ name: "value", type: "number", validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "aboutTitle",
      type: "localizedString",
    }),
    defineField({
      name: "aboutText",
      type: "localizedText",
    }),
    defineField({
      name: "ctaTitle",
      type: "localizedString",
    }),
    defineField({
      name: "ctaText",
      type: "localizedText",
    }),
    defineField({
      name: "testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "localizedText" }),
            defineField({ name: "author", type: "localizedString" }),
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
    defineField({
      name: "heroTitleColor",
      title: "Hero Title Color",
      type: "string",
      description: "CSS color value for the hero heading (e.g. #ffffff or rgba(255,255,255,0.9)). Defaults to white.",
    }),
    defineField({
      name: "heroSubtitleColor",
      title: "Hero Subtitle Color",
      type: "string",
      description: "CSS color value for the hero subtitle paragraph. Defaults to white/90.",
    }),
    defineField({
      name: "sectionHeadingColor",
      title: "Section Heading Color",
      type: "string",
      description: "CSS color value applied to all section h2 headings (How It Works, Testimonials, etc.).",
    }),
    defineField({
      name: "heroOverlayColor",
      title: "Hero Image Overlay Color",
      type: "string",
      description: "CSS color for the tint overlay on the hero image (e.g. #022c22). Default: dark green.",
    }),
    defineField({
      name: "heroOverlayOpacity",
      title: "Hero Image Overlay Opacity (%)",
      type: "number",
      description: "Opacity 0–100. Default: 45.",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "ctaOverlayColor",
      title: "CTA Image Overlay Color",
      type: "string",
      description: "CSS color for the tint overlay on the CTA section image. Default: dark green.",
    }),
    defineField({
      name: "ctaOverlayOpacity",
      title: "CTA Image Overlay Opacity (%)",
      type: "number",
      description: "Opacity 0–100. Default: 45.",
      validation: (rule) => rule.min(0).max(100),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
