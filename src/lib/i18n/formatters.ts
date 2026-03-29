export type Locale = "en" | "cs";

const localeMap: Record<Locale, string> = {
  en: "en-US",
  cs: "cs-CZ",
};

export function formatMoney(amountCents: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: "medium",
  }).format(new Date(value));
}
