"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { getString, type Locale } from "@/lib/i18n/strings";

export function NewsletterSignup() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "subscribing" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("subscribing");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-emerald-700">
        {t("newsletter.success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-2 sm:flex-row sm:items-center">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("newsletter.title")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletter.emailPlaceholder")}
        className="min-h-[44px] flex-1 rounded-full border border-amber-900/20 bg-white px-4 py-2.5 text-sm text-amber-950 outline-none ring-0 placeholder:text-amber-900/40 focus:border-amber-600"
      />
      <button
        type="submit"
        disabled={status === "subscribing"}
        className="min-h-[44px] rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "subscribing" ? t("newsletter.subscribing") : t("newsletter.subscribe")}
      </button>
      {status === "error" && (
        <p role="alert" className="text-xs text-red-700">
          {t("newsletter.error")}
        </p>
      )}
    </form>
  );
}
