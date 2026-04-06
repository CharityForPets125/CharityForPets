import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "cs"];
  const routes = [
    "",
    "/about",
    "/contact",
    "/donate",
    "/shop",
    "/login",
    "/signup",
    "/dashboard",
    "/success",
  ];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}${route ? `/${locale}${route}` : `/${locale}`}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : route === "/shop" ? "weekly" : "monthly" as const,
      priority: route === "" ? 1 : route === "/donate" ? 0.9 : route === "/shop" ? 0.8 : 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}/en${route}`,
          cs: `${siteUrl}/cs${route}`,
        },
      },
    }))
  );
}
