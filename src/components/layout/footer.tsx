import Link from "next/link";

import { fetchSanity } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

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
  const [navigation, settings] = await Promise.all([
    fetchSanity<NavigationDoc | null>(NAVIGATION_QUERY, {}, null),
    fetchSanity<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  const links = navigation?.footerLinks || [];

  return (
    <footer className="mt-14 border-t border-amber-900/10 bg-amber-50/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} className="text-sm text-amber-900 hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
        <p className="text-sm text-amber-900/80">{settings?.footerText || "Update footer text in Sanity Studio."}</p>
      </div>
    </footer>
  );
}
