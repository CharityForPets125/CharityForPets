import Link from "next/link";

import { fetchSanity } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signOutAction } from "@/app/auth/actions";

type NavLink = {
  label: string;
  href: string;
};

type NavigationDoc = {
  headerLinks?: NavLink[];
};

type SiteSettings = {
  siteName?: string;
};

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const [navigation, settings] = await Promise.all([
    fetchSanity<NavigationDoc | null>(NAVIGATION_QUERY, {}, null),
    fetchSanity<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  let user: { id: string } | null = null;

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  const links = navigation?.headerLinks?.length
    ? navigation.headerLinks
    : [
      { label: "Donate", href: "/donate" },
      { label: "Shop", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ];

  return (
    <header className="sticky top-0 z-30 border-b border-amber-950/10 bg-[var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-y-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="shrink-0 text-base font-bold tracking-tight text-amber-950 sm:text-lg">
          {settings?.siteName || "Pet Charity"}
        </Link>
        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:gap-4 sm:overflow-visible sm:pb-0">
          {links.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100 sm:px-3 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-200 sm:px-3 sm:text-sm">
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100 sm:px-3 sm:text-sm">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="whitespace-nowrap rounded-full bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 sm:px-3 sm:text-sm">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
