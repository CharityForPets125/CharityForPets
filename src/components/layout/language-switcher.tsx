"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { SUPPORTED_LOCALES, localizePath, normalizeLocale } from "@/lib/i18n/routing";

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = normalizeLocale(segments[0]);

    function switchLocale(newLocale: string) {
        if (newLocale === currentLocale) return;

        const basePath = localizePath(pathname, normalizeLocale(newLocale));
        const query = searchParams.toString();
        const nextUrl = query ? `${basePath}?${query}` : basePath;

        router.replace(nextUrl);
    }

    return (
        <div className="flex items-center gap-1" role="group" aria-label="Language selector">
            {SUPPORTED_LOCALES.map((locale) => (
                <button
                    key={locale}
                    onClick={() => switchLocale(locale)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition border ${locale === currentLocale ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-emerald-900 border-emerald-900/20 hover:bg-emerald-100"}`}
                    aria-current={locale === currentLocale ? "true" : undefined}
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
