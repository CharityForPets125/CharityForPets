import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";

import { signInAction, signInWithGoogleAction } from "@/app/auth/actions";

type LoginPageProps = {
    searchParams: Promise<{
        error?: string;
        message?: string;
    }>;
    params: Promise<{ locale: string }>;
};

export default async function LoginPage({ searchParams, params }: LoginPageProps) {
    const { locale: localeParam } = await params;
    const locale = normalizeLocale(localeParam);
    const supabase = await createSupabaseServerClient();
    const user = supabase
        ? (
            await supabase.auth.getUser()
        ).data.user
        : null;

    if (user) {
        redirect(localizePath("/dashboard", locale));
    }

    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const query = await searchParams;
    const error = query.error;
    const message = query.message;

    return (
        <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{t("auth.logIn")}</h1>
            <p className="mt-3 text-base text-amber-900/80">{t("auth.welcomeBack")}</p>
            <div className="mt-8 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                {error && (
                    <p role="alert" className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">{error}</p>
                )}
                {message && (
                    <p role="status" className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-base text-emerald-700">{message}</p>
                )}
                {!supabase ? (
                    <p className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-base text-amber-900">
                        {t("auth.supabaseWarning")}
                    </p>
                ) : null}

                <form action={signInAction} className="space-y-6">
                    <input type="hidden" name="locale" value={locale} />
                    <div>
                        <label className="block text-base font-semibold text-amber-950" htmlFor="email">
                            {t("auth.email")}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-2 min-h-[44px] w-full rounded-2xl border border-amber-900/20 px-4 py-3 text-base text-amber-950 outline-none ring-0 placeholder:text-amber-900/40 focus:border-amber-600"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-amber-950" htmlFor="password">
                            {t("auth.password")}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-2 min-h-[44px] w-full rounded-2xl border border-amber-900/20 px-4 py-3 text-base text-amber-950 outline-none ring-0 placeholder:text-amber-900/40 focus:border-amber-600"
                            placeholder={t("auth.password_min")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!supabase}
                        className="w-full min-h-[44px] rounded-full bg-amber-600 px-5 py-3 text-base font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {t("auth.logIn")}
                    </button>
                </form>

                <form action={signInWithGoogleAction} className="mt-4">
                    <input type="hidden" name="locale" value={locale} />
                    <button
                        type="submit"
                        disabled={!supabase}
                        className="w-full min-h-[44px] rounded-full border border-amber-900/20 bg-white px-5 py-3 text-base font-semibold text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {t("auth.continueGoogle")}
                    </button>
                </form>

                <Link href={localizePath("/signup", locale)} className="mt-4 inline-block text-base font-semibold text-amber-700 hover:underline">
                    {t("auth.needAccount")}
                </Link>
            </div>
        </main>
    );
}
