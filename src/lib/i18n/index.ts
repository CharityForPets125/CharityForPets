import { headers } from "next/headers";

export type Locale = "en" | "cs";

export const SUPPORTED_LOCALES: Locale[] = ["en", "cs"];
export const DEFAULT_LOCALE: Locale = "en";

export async function getLocale(): Promise<Locale> {
  try {
    const headerList = await headers();
    const locale = headerList.get("x-locale");
    if (locale && (SUPPORTED_LOCALES as string[]).includes(locale)) {
      return locale as Locale;
    }
  } catch {
    // fallback
  }
  return DEFAULT_LOCALE;
}
