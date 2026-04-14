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

type SocialLink = {
  label: string;
  href: string;
};

type SiteSettings = {
  siteName?: string;
  logo?: unknown;
  brandDisplayMode?: "logo" | "text" | "both";
  footerText?: string;
  contactEmail?: string;
  socialLinks?: SocialLink[];
};

function SocialIcon({ href }: { href: string }) {
  const url = href.toLowerCase();
  if (url.includes("facebook")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    );
  }
  if (url.includes("instagram")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (url.includes("twitter") || url.includes("x.com")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (url.includes("linkedin")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (url.includes("youtube")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  // Generic external link icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

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
  const brandMode = settings?.brandDisplayMode ?? "both";
  const showLogo = settings?.logo && brandMode !== "text";
  const showText = brandMode !== "logo";
  const brandText = settings?.siteName || "Pet Charity";

  return (
    <footer className="mt-14 border-t border-emerald-900/10 bg-emerald-50/50" role="contentinfo">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-emerald-950">{t("newsletter.title", "Stay Updated")}</h3>
            <p className="mt-1 text-xs text-emerald-900/70">{t("newsletter.description", "Subscribe for updates on our mission and how you can help.")}</p>
          </div>
          <NewsletterSignup />
        </div>

        {links.length > 0 && (
          <nav aria-label="Footer" className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={localizePath(link.href, locale)} className="text-sm text-emerald-900 hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            {(showLogo || showText) && (
              <div className="flex items-center gap-2">
                {showLogo ? (
                  <SanityImage
                    image={settings.logo}
                    alt={`${brandText} logo`}
                    className="h-10 w-auto rounded-md object-contain"
                    width={220}
                    height={88}
                    sizes="220px"
                  />
                ) : null}
                {showText ? <span className="text-base font-semibold text-emerald-950">{brandText}</span> : null}
              </div>
            )}
            <p className="text-sm text-emerald-900/80">{settings?.footerText || `© Pet Charity. ${t("footer.allRightsReserved", "All rights reserved.")}`}</p>
            {settings?.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="text-sm text-emerald-700 hover:underline">
                {settings.contactEmail}
              </a>
            )}
          </div>

          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {settings.socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-emerald-900/60 transition hover:text-emerald-800"
                >
                  <SocialIcon href={social.href} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
