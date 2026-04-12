import { defineField, defineType } from "sanity";

export const impactSettingsType = defineType({
  name: "impactSettings",
  title: "Impact Settings",
  type: "document",
  fields: [
    defineField({
      name: "donationUsdPerSavedAnimal",
      title: "Donation USD Per Saved Animal",
      type: "number",
      initialValue: 25,
      validation: (rule) => rule.required().positive(),
      description: "How many donated USD equal one animal saved.",
    }),
    defineField({
      name: "shopUsdPerSavedAnimal",
      title: "Shop USD Per Saved Animal",
      type: "number",
      initialValue: 40,
      validation: (rule) => rule.required().positive(),
      description: "How many shop USD equal one animal saved.",
    }),
    defineField({
      name: "catSharePercent",
      title: "Cat Share Percent",
      type: "number",
      initialValue: 50,
      validation: (rule) => rule.required().min(0).max(100),
      description: "How total saved animals are split between cats and dogs.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Impact Settings" }),
  },
});
