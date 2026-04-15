import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "design", title: "🎨 Design & Colors" },
    { name: "visibility", title: "👁 Visibility" },
  ],
  fields: [
    // ── Content ────────────────────────────────────────────────
    defineField({
      name: "heroTitle",
      type: "localizedString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      type: "localizedString",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageMobile",
      title: "Hero Image (Mobile)",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Optional mobile hero image. Falls back to the main hero image if not set.",
    }),
    defineField({
      name: "howItWorksImages",
      title: "How It Works Images",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "impactSectionImage",
      title: "Impact Section Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "ctaSectionImage",
      title: "CTA Section Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "impactCounters",
      type: "array",
      group: "content",
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
      group: "content",
    }),
    defineField({
      name: "aboutText",
      type: "localizedText",
      group: "content",
    }),
    defineField({
      name: "ctaTitle",
      type: "localizedString",
      group: "content",
    }),
    defineField({
      name: "ctaText",
      type: "localizedText",
      group: "content",
    }),
    defineField({
      name: "testimonials",
      type: "array",
      group: "content",
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

    // ── Design & Colors ────────────────────────────────────────
    defineField({
      name: "heroTitleColor",
      title: "Hero Title Color",
      type: "string",
      group: "design",
      description: "CSS color for the hero heading (e.g. #ffffff). Default: white.",
    }),
    defineField({
      name: "heroSubtitleColor",
      title: "Hero Subtitle Color",
      type: "string",
      group: "design",
      description: "CSS color for the hero subtitle. Default: rgba(255,255,255,0.9).",
    }),
    defineField({
      name: "sectionHeadingColor",
      title: "Section Heading Color",
      type: "string",
      group: "design",
      description: "CSS color applied to all section h2 headings (How It Works, Testimonials, etc.).",
    }),
    defineField({
      name: "heroTextAlign",
      title: "Hero Text Alignment",
      type: "string",
      group: "design",
      initialValue: "left",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "heroContentWidth",
      title: "Hero Content Width",
      type: "string",
      group: "design",
      initialValue: "medium",
      description: "Controls how wide the text block is in the hero.",
      options: {
        list: [
          { title: "Narrow", value: "narrow" },
          { title: "Medium", value: "medium" },
          { title: "Wide", value: "wide" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "heroHeightMobile",
      title: "Hero Height — Mobile (px)",
      type: "number",
      group: "design",
      initialValue: 560,
      description: "Minimum height of the hero on mobile screens. Default: 560.",
      validation: (rule) => rule.min(200).max(900),
    }),
    defineField({
      name: "heroHeightDesktop",
      title: "Hero Height — Desktop (px)",
      type: "number",
      group: "design",
      initialValue: 700,
      description: "Minimum height of the hero on desktop screens. Default: 700.",
      validation: (rule) => rule.min(300).max(1200),
    }),

    // ── Visibility ─────────────────────────────────────────────
    defineField({
      name: "showHeroSection",
      type: "boolean",
      initialValue: true,
      title: "Show Hero Section",
      group: "visibility",
    }),
    defineField({
      name: "showHowItWorks",
      type: "boolean",
      initialValue: true,
      title: "Show How It Works Section",
      group: "visibility",
    }),
    defineField({
      name: "showImpactCounters",
      type: "boolean",
      initialValue: true,
      title: "Show Impact Counters Section",
      group: "visibility",
    }),
    defineField({
      name: "showAboutSection",
      type: "boolean",
      initialValue: true,
      title: "Show About Section",
      group: "visibility",
    }),
    defineField({
      name: "showCTASection",
      type: "boolean",
      initialValue: true,
      title: "Show CTA Section",
      group: "visibility",
    }),
    defineField({
      name: "showTestimonials",
      type: "boolean",
      initialValue: true,
      title: "Show Testimonials",
      group: "visibility",
    }),
    defineField({
      name: "showFeaturedProducts",
      type: "boolean",
      initialValue: true,
      title: "Show Featured Products",
      group: "visibility",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
