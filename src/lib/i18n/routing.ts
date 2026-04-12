import type { Locale } from "@/lib/i18n/strings";

export const SUPPORTED_LOCALES: Locale[] = ["en", "cs"];

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "cs" ? "cs" : "en";
}

export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments[0] && SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return normalizedPath;
}

export function localizePath(pathname: string, locale: Locale): string {
  if (!pathname) {
    return `/${locale}`;
  }

  if (pathname.startsWith("http://") || pathname.startsWith("https://") || pathname.startsWith("mailto:") || pathname.startsWith("tel:")) {
    return pathname;
  }

  const pathWithoutLocale = stripLocalePrefix(pathname);
  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
}
