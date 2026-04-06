"use client";

import { useRouter, usePathname } from "next/navigation";

const SUPPORTED_LOCALES = ["en", "cs"];

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = SUPPORTED_LOCALES.includes(segments[0]) ? segments[0] : "en";

    function switchLocale(newLocale: string) {
        if (newLocale === currentLocale) return;
        const rest = SUPPORTED_LOCALES.includes(segments[0]) ? segments.slice(1) : segments;
        const newPath = `/${newLocale}${rest.length ? "/" + rest.join("/") : ""}`;
        router.push(newPath);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
    }

    return (
        <div className="flex items-center gap-1" role="group" aria-label="Language selector">
            {SUPPORTED_LOCALES.map((locale) => (
                <button
                    key={locale}
                    onClick={() => switchLocale(locale)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition border ${locale === currentLocale ? "bg-amber-600 text-white border-amber-600" : "bg-white text-amber-900 border-amber-900/20 hover:bg-amber-100"}`}
                    aria-current={locale === currentLocale ? "true" : undefined}
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
