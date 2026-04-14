"use client";

import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const triggerEl = triggerRef.current;
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [];
    const firstFocusable = focusables[0];
    firstFocusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const nodes = menuRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (triggerEl) {
        triggerEl.focus();
      } else {
        lastFocusedRef.current?.focus();
      }
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="mobile-nav-menu"
        className="min-h-[44px] min-w-[44px] rounded-full p-2 text-emerald-900 transition hover:bg-emerald-100 flex items-center justify-center"
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
          <div
            ref={menuRef}
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-full z-40 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-emerald-900/10 bg-white p-3 shadow-lg"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={localizePath(link.href, locale)}
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center rounded-xl px-3 py-2.5 text-base font-medium text-emerald-900 transition hover:bg-emerald-50"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-1 border-emerald-900/10" />
              {user ? (
                <>
                  <Link
                    href={localizePath("/dashboard", locale)}
                    onClick={() => setIsOpen(false)}
                    className="min-h-[44px] flex items-center rounded-xl bg-emerald-100 px-3 py-2.5 text-base font-semibold text-emerald-900 hover:bg-emerald-200"
                  >
                    {labels.dashboard}
                  </Link>
                  <form action={signOutAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      onClick={() => setIsOpen(false)}
                      className="w-full min-h-[44px] rounded-xl px-3 py-2.5 text-left text-base font-medium text-emerald-900 transition hover:bg-emerald-50"
                    >
                      {labels.signOut}
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href={localizePath("/login", locale)}
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] flex items-center justify-center rounded-xl bg-emerald-700 px-3 py-2.5 text-center text-base font-semibold text-white hover:bg-emerald-800"
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
