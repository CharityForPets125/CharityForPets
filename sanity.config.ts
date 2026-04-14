"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";

import { schemaTypes } from "@/sanity/schemaTypes";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const locations = {
  locations: {
    homePage: defineLocations({
      select: { title: "heroTitle.en" },
      resolve: () => ({
        locations: [
          { title: "Homepage (EN)", href: `${appUrl}/en` },
          { title: "Homepage (CS)", href: `${appUrl}/cs` },
        ],
      }),
    }),
    page: defineLocations({
      select: { title: "title.en", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: `${doc?.title ?? "Page"} (EN)`, href: `${appUrl}/en/${doc?.slug}` },
          { title: `${doc?.title ?? "Page"} (CS)`, href: `${appUrl}/cs/${doc?.slug}` },
        ],
      }),
    }),
    product: defineLocations({
      select: { title: "name.en", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: `${doc?.title ?? "Product"} (EN)`, href: `${appUrl}/en/shop/${doc?.slug}` },
          { title: `${doc?.title ?? "Product"} (CS)`, href: `${appUrl}/cs/shop/${doc?.slug}` },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [
          { title: "Homepage (EN)", href: `${appUrl}/en` },
        ],
      }),
    }),
    shopSettings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [
          { title: "Shop (EN)", href: `${appUrl}/en/shop` },
          { title: "Shop (CS)", href: `${appUrl}/cs/shop` },
        ],
      }),
    }),
  },
};

export default defineConfig({
  name: "default",
  title: "Pet Charity Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool(),
    presentationTool({
      resolve: locations,
      previewUrl: {
        origin: appUrl,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
