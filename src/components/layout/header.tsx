import Link from "next/link";
import { cookies as nextCookies } from "next/headers";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { SanityImage } from "@/components/sanity/sanity-image";

import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
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
  footerLinks?: NavLink[];
};

type SiteSettings = {
  siteName?: string;
  logo?: unknown;
};

type HeaderProps = {
  locale?: Locale;
};

export async function Header({ locale: localeProp }: HeaderProps = {}) {
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

  const supabase = await createSupabaseServerClient();
  const [navigation, settings] = await Promise.all([
    fetchSanity<NavigationDoc | null>(NAVIGATION_QUERY(locale), {}, null),
    fetchSanity<SiteSettings | null>(SITE_SETTINGS_QUERY(locale), {}, null),
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
      { label: t("nav.donate", "Donate"), href: "/donate" },
      { label: t("nav.shop", "Shop"), href: "/shop" },
      { label: t("nav.about", "About"), href: "/about" },
      { label: t("nav.contact", "Contact"), href: "/contact" },
    ];

  return (
    <header className="sticky top-0 z-30 border-b border-amber-950/10 bg-[var(--card)]/95 backdrop-blur" role="banner">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href={localizePath("/", locale)} className="shrink-0 text-base font-bold tracking-tight text-amber-950 sm:text-lg">
          {settings?.logo ? (
            <SanityImage
              image={settings.logo}
              alt={settings.siteName || "Pet Charity logo"}
              className="h-10 w-auto rounded-md object-contain sm:h-11"
              priority
            />
          ) : (
            settings?.siteName || "Pet Charity"
          )}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-2 sm:flex">
          {links.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={localizePath(link.href, locale)}
              className="min-h-[44px] flex items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={localizePath("/dashboard", locale)} className="min-h-[44px] flex items-center whitespace-nowrap rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200">
                {t("nav.dashboard", "Dashboard")}
              </Link>
              <form action={signOutAction}>
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className="min-h-[44px] flex items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
                  {t("nav.signOut", "Sign Out")}
                </button>
              </form>
            </>
          ) : (
            <Link href={localizePath("/login", locale)} className="min-h-[44px] flex items-center whitespace-nowrap rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
              {t("nav.logIn", "Log In")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {/* Mobile menu button - visible only on small screens */}
          <MobileMenu
            links={links}
            user={user}
            locale={locale}
            labels={{
              dashboard: t("nav.dashboard", "Dashboard"),
              signOut: t("nav.signOut", "Sign Out"),
              logIn: t("nav.logIn", "Log In"),
            }}
          />
        </div>
      </div>
    </header>
  );
}
