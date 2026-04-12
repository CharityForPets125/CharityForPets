"use client";

import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import type { Locale } from "@/lib/i18n/strings";
import { localizePath } from "@/lib/i18n/routing";

type MobileMenuProps = {
  links: { label: string; href: string }[];
  user: { id: string } | null;
  locale: Locale;
  labels: {
    dashboard: string;
    signOut: string;
    logIn: string;
  };
};

export function MobileMenu({ links, user, locale, labels }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="min-h-[44px] min-w-[44px] rounded-full p-2 text-amber-900 transition hover:bg-amber-100 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop to dismiss menu */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} aria-hidden="true" />

          {/* Menu dropdown - positioned relative to button, constrained to viewport */}
          <div className="absolute right-0 top-full z-40 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-amber-900/10 bg-white p-3 shadow-lg">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={localizePath(link.href, locale)}
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center rounded-xl px-3 py-2.5 text-base font-medium text-amber-900 transition hover:bg-amber-50"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-1 border-amber-900/10" />
              {user ? (
                <>
                  <Link
                    href={localizePath("/dashboard", locale)}
                    onClick={() => setIsOpen(false)}
                    className="min-h-[44px] flex items-center rounded-xl bg-amber-100 px-3 py-2.5 text-base font-semibold text-amber-900 hover:bg-amber-200"
                  >
                    {labels.dashboard}
                  </Link>
                  <form action={signOutAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      onClick={() => setIsOpen(false)}
                      className="w-full min-h-[44px] rounded-xl px-3 py-2.5 text-left text-base font-medium text-amber-900 transition hover:bg-amber-50"
                    >
                      {labels.signOut}
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href={localizePath("/login", locale)}
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center justify-center rounded-xl bg-amber-600 px-3 py-2.5 text-center text-base font-semibold text-white hover:bg-amber-700"
                >
                  {labels.logIn}
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
