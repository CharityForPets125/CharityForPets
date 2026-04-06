"use client";

import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";

type MobileMenuProps = {
  links: { label: string; href: string }[];
  user: { id: string } | null;
};

export function MobileMenu({ links, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="rounded-full p-2 text-amber-900 transition hover:bg-amber-100"
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
        <div className="absolute right-4 top-16 z-40 w-56 rounded-2xl border border-amber-900/10 bg-white p-3 shadow-lg">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-1 border-amber-900/10" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200"
                >
                  Dashboard
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-amber-900 transition hover:bg-amber-50"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-amber-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-amber-700"
              >
                Log In
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
