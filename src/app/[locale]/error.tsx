"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-red-600">Error</p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-amber-950 sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-base text-amber-900/85">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        Try Again
      </button>
    </main>
  );
}
