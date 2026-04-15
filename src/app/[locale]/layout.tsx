import type { Metadata } from "next";
import { Barlow, DM_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import "../globals.css";
import { fetchSanity } from "@/lib/sanity/client";
import { SanityLive } from "@/lib/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Barlow({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }];
}

const siteName = "Pet Charity";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isCs = locale === "cs";

  const title = isCs ? "Pet Charity - Pomozte toulavým zvířatům" : "Pet Charity - Help Stray Animals";
  const description = isCs
    ? "Pomozte toulavým zvířatům prostřednictvím darů a charitativního nakupování."
    : "Help stray animals through donations and charity shopping.";

  const alternates: Metadata["alternates"] = {
    languages: {
      en: `${siteUrl}/en`,
      cs: `${siteUrl}/cs`,
    },
    canonical: `${siteUrl}/${locale}`,
  };

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      siteName,
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isCs = locale === "cs";
  const { isEnabled: isDraftMode } = await draftMode();

  const bannerSettings = await fetchSanity<{
    pageBannerStartColor?: string;
    pageBannerMidColor?: string;
    pageBannerEndColor?: string;
  } | null>(SITE_SETTINGS_QUERY(locale), {}, null);

  const bannerVars = {
    "--page-banner-start": bannerSettings?.pageBannerStartColor || "#d1fae5",
    "--page-banner-mid": bannerSettings?.pageBannerMidColor || "#ecfdf5",
    "--page-banner-end": bannerSettings?.pageBannerEndColor || "#fef9c3",
  } as React.CSSProperties;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteName,
    description: isCs
      ? "Pomozte toulavým zvířatům prostřednictvím darů a charitativního nakupování."
      : "Help stray animals through donations and charity shopping.",
    url: `${siteUrl}/${locale}`,
    sameAs: [],
  };

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" style={bannerVars}>
        {children}
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
