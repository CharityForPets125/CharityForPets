import { defineArrayMember, defineField, defineType } from "sanity";

export const donationSettingsType = defineType({
  name: "donationSettings",
  title: "Donation Settings",
  type: "document",
  fields: [
    defineField({
      name: "presetAmounts",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "amount", type: "number", validation: (rule) => rule.required().positive() }),
            defineField({ name: "achievement", type: "string" }),
            defineField({ name: "oneTimePriceId", type: "string" }),
            defineField({ name: "monthlyPriceId", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "donationRateDollarsPerPet",
      title: "Donation Impact Rate ($ per pet)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Donation Settings" }),
  },
});
