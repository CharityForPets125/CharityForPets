import Link from "next/link";
import { cookies as nextCookies } from "next/headers";
import { SanityImage } from "@/components/sanity/sanity-image";

import { fetchSanity } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

type LinkItem = {
  label: string;
  href: string;
};

type NavigationDoc = {
  footerLinks?: LinkItem[];
};

type SiteSettings = {
  siteName?: string;
  logo?: unknown;
  footerText?: string;
};

type FooterProps = {
  locale?: Locale;
};

export async function Footer({ locale: localeProp }: FooterProps = {}) {
  let locale: Locale = localeProp ?? "en";
  try {
    if (!localeProp) {
      const cookieStore = await nextCookies();
      locale = normalizeLocale(cookieStore.get("NEXT_LOCALE")?.value);
    }
  } catch {
    // fallback to en
  }

  const t = (path: string, defaultValue = "") => getString(locale, path, defaultValue);

  const [navigation, settings] = await Promise.all([
    fetchSanity<NavigationDoc | null>(NAVIGATION_QUERY(locale), {}, null),
    fetchSanity<SiteSettings | null>(SITE_SETTINGS_QUERY(locale), {}, null),
  ]);

  const links = navigation?.footerLinks || [];

  return (
    <footer className="mt-14 border-t border-amber-900/10 bg-amber-50/70" role="contentinfo">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-amber-950">{t("newsletter.title", "Stay Updated")}</h3>
            <p className="mt-1 text-xs text-amber-900/70">{t("newsletter.description", "Subscribe for updates on our mission and how you can help.")}</p>
          </div>
          <NewsletterSignup />
        </div>

        {links.length > 0 && (
          <nav aria-label="Footer" className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={localizePath(link.href, locale)} className="text-sm text-amber-900 hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        {settings?.logo != null && (
          <div>
            <SanityImage
              image={settings.logo}
              alt={settings.siteName || "Pet Charity logo"}
              className="h-10 w-auto rounded-md object-contain"
              width={220}
              height={88}
              sizes="220px"
            />
          </div>
        )}
        <p className="text-sm text-amber-900/80">{settings?.footerText || `© Pet Charity. ${t("footer.allRightsReserved", "All rights reserved.")}`}</p>
      </div>
    </footer>
  );
}
