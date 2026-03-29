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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-amber-950">
          {settings?.siteName || "Pet Charity"}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-900 hover:bg-amber-200">
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="rounded-full px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
