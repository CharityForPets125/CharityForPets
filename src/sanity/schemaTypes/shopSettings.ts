import { defineField, defineType } from "sanity";

export const shopSettingsType = defineType({
  name: "shopSettings",
  title: "Shop Settings",
  type: "document",
  fields: [
    defineField({
      name: "shopRateDollarsPerPet",
      title: "Shop Impact Rate ($ per pet)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "isShopSectionVisible",
      title: "Show Shop Section",
      type: "boolean",
      initialValue: true,
      description: "Toggle visibility of the shop section on the website",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Shop Settings" }),
  },
});
