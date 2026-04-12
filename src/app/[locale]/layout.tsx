import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/accessibility/skip-to-content";
import "../globals.css";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SkipToContent />
        <Header locale={isCs ? "cs" : "en"} />
        <div id="main-content" className="flex-1" tabIndex={-1}>{children}</div>
        <Footer locale={isCs ? "cs" : "en"} />
      </body>
    </html>
  );
}
