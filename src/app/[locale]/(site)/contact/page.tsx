"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getString, type Locale } from "@/lib/i18n/strings";

export default function ContactPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm sm:rounded-3xl">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--page-banner-start) 0%, var(--page-banner-mid) 40%, var(--page-banner-end) 100%)' }} />
                <div className="relative flex items-center justify-between gap-4 p-5 sm:p-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl lg:text-4xl">{t("contact.title")}</h1>
                        <p className="mt-2 text-sm text-emerald-900/80 sm:mt-3 sm:text-base">{t("contact.formDescription")}</p>
                    </div>
                    <Image src="/logo.png" alt="Pet Charity" width={96} height={96} className="h-14 w-14 shrink-0 rounded-xl object-contain sm:h-20 sm:w-20" />
                </div>
            </div>

            <div className="mt-8 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
                {status === "success" && (
                    <p role="status" className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-base text-emerald-700">
                        {t("contact.success")}
                    </p>
                )}
                {status === "error" && (
                    <p role="alert" className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">
                        {t("contact.error")}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="contact-name" className="block text-base font-semibold text-amber-950">
                            {t("contact.name")}
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 min-h-[44px] w-full rounded-2xl border border-emerald-900/20 px-4 py-3 text-base text-emerald-950 outline-none ring-0 placeholder:text-emerald-900/40 focus:border-emerald-600"
                            placeholder={t("contact.namePlaceholder")}
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-email" className="block text-base font-semibold text-emerald-950">
                            {t("contact.email")}
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 min-h-[44px] w-full rounded-2xl border border-emerald-900/20 px-4 py-3 text-base text-emerald-950 outline-none ring-0 placeholder:text-emerald-900/40 focus:border-emerald-600"
                            placeholder={t("contact.emailPlaceholder")}
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="block text-base font-semibold text-emerald-950">
                            {t("contact.message")}
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-emerald-900/20 px-4 py-3 text-base text-emerald-950 outline-none ring-0 placeholder:text-emerald-900/40 focus:border-emerald-600"
                            placeholder={t("contact.messagePlaceholder")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="min-h-[44px] w-full rounded-full bg-emerald-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {status === "sending" ? t("contact.sending") : t("contact.send")}
                    </button>
                </form>
            </div>
        </main>
    );
}
