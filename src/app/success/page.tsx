import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: "Thank You - Pet Charity",
  description: "Your donation or order has been processed successfully.",
};

type SuccessPageProps = {
  searchParams: Promise<{
    type?: "donation" | "order";
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  let locale: Locale = "en";
  try {
    const headerList = await headers();
    const headerLocale = headerList.get("x-locale");
    if (headerLocale && (headerLocale === "en" || headerLocale === "cs")) {
      locale = headerLocale as Locale;
    }
  } catch {
    // fallback to en
  }

  const t = (path: string, defaultValue = "") => getString(locale, path, defaultValue);

  const query = await searchParams;
  const type = query.type || "donation";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-amber-900/10 bg-white p-8 shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-amber-950 sm:text-3xl">
          {type === "order" ? t("success.orderTitle") : t("success.donationTitle")}
        </h1>
        <p className="mt-4 text-amber-900/85">
          {type === "order" ? t("success.orderMessage") : t("success.donationMessage")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={localizePath("/dashboard", locale)}
            className="inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            {t("success.backToDashboard")}
          </Link>
          <Link
            href={localizePath("/", locale)}
            className="inline-flex rounded-full border border-amber-900/20 bg-white px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-50"
          >
            {t("success.backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
