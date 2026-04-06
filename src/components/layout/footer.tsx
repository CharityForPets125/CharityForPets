import Link from "next/link";
import { cookies as nextCookies } from "next/headers";

import { fetchSanity } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

type LinkItem = {
  label: string;
  href: string;
};

type NavigationDoc = {
  footerLinks?: LinkItem[];
};

type SiteSettings = {
  footerText?: string;
};

export async function Footer() {
  let locale = "en";
  try {
    const cookieStore = await nextCookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale === "en" || cookieLocale === "cs") {
      locale = cookieLocale;
    }
  } catch {
    // fallback to en
  }

  const [navigation, settings] = await Promise.all([
    fetchSanity<NavigationDoc | null>(NAVIGATION_QUERY, {}, null),
    fetchSanity<SiteSettings | null>(SITE_SETTINGS_QUERY(locale), {}, null),
  ]);

  const links = navigation?.footerLinks || [];

  return (
    <footer className="mt-14 border-t border-amber-900/10 bg-amber-50/70" role="contentinfo">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-amber-950">Stay Updated</h3>
            <p className="mt-1 text-xs text-amber-900/70">Subscribe for updates on our mission and how you can help.</p>
          </div>
          <NewsletterSignup />
        </div>

        {links.length > 0 && (
          <nav aria-label="Footer" className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} className="text-sm text-amber-900 hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <p className="text-sm text-amber-900/80">{settings?.footerText || "© Pet Charity. All rights reserved."}</p>
      </div>
    </footer>
  );
}
