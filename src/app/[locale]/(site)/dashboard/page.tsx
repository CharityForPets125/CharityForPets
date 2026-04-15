import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { fetchSanity } from "@/lib/sanity/client";
import { IMPACT_SETTINGS_QUERY } from "@/lib/sanity/queries";

import { signOutAction } from "@/app/auth/actions";

type Donation = {
    id: number;
    amount_cents: number;
    created_at: string;
};

type Order = {
    id: number;
    amount_cents: number;
    status: string;
    created_at: string;
};

function formatMoney(amountCents: number, locale: Locale): string {
    const localeMap: Record<Locale, string> = { en: "en-US", cs: "cs-CZ" };
    return new Intl.NumberFormat(localeMap[locale], {
        style: "currency",
        currency: "USD",
    }).format(amountCents / 100);
}

function formatDate(value: string, locale: Locale): string {
    const localeMap: Record<Locale, string> = { en: "en-US", cs: "cs-CZ" };
    return new Intl.DateTimeFormat(localeMap[locale], {
        dateStyle: "medium",
    }).format(new Date(value));
}

type DashboardPageProps = {
    params: Promise<{ locale: string }>;
};

type ImpactSettings = {
    donationUsdPerSavedAnimal?: number;
    shopUsdPerSavedAnimal?: number;
    catSharePercent?: number;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { locale: localeParam } = await params;
    const locale = normalizeLocale(localeParam);

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
        redirect(`${localizePath("/login", locale)}?error=Supabase auth is not configured`);
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(localizePath("/login", locale));
    }

    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const [{ data: donationTotals }, { data: orderTotals }, { data: recentDonations }, { data: recentOrders }, impactSettings] = await Promise.all([
        supabase
            .from("donations")
            .select("amount_cents")
            .eq("user_id", user.id)
            .returns<Array<Pick<Donation, "amount_cents">>>(),
        supabase
            .from("orders")
            .select("amount_cents")
            .eq("user_id", user.id)
            .returns<Array<Pick<Order, "amount_cents">>>(),
        supabase
            .from("donations")
            .select("id, amount_cents, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)
            .returns<Donation[]>(),
        supabase
            .from("orders")
            .select("id, amount_cents, status, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)
            .returns<Order[]>(),
        fetchSanity<ImpactSettings | null>(IMPACT_SETTINGS_QUERY, {}, null),
    ]);

    const donationTotalCents = (donationTotals ?? []).reduce((sum, donation) => sum + donation.amount_cents, 0);
    const shopTotalCents = (orderTotals ?? []).reduce((sum, order) => sum + order.amount_cents, 0);

    const donationRate = impactSettings?.donationUsdPerSavedAnimal ?? 25;
    const shopRate = impactSettings?.shopUsdPerSavedAnimal ?? 40;

    const donationImpact = Math.floor((donationTotalCents / 100) / donationRate);
    const shopImpact = Math.floor((shopTotalCents / 100) / shopRate);
    const totalImpact = donationImpact + shopImpact;

    const catShare = Math.max(0, Math.min(100, impactSettings?.catSharePercent ?? 50)) / 100;
    const catsSaved = Math.round(totalImpact * catShare);
    const dogsSaved = Math.max(totalImpact - catsSaved, 0);
    const recentDonationsList = recentDonations ?? [];
    const recentOrdersList = recentOrders ?? [];

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--page-banner-start) 0%, var(--page-banner-mid) 40%, var(--page-banner-end) 100%)' }} />
                <div className="relative flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">{t("dashboard.yourDashboard")}</h1>
                        <p className="mt-3 text-base text-emerald-900/80">{t("dashboard.signedInAs")} {user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" alt="Pet Charity" width={72} height={72} className="h-12 w-12 rounded-xl object-contain sm:h-14 sm:w-14" />
                        <form action={signOutAction}>
                            <input type="hidden" name="locale" value={locale} />
                            <button type="submit" className="min-h-[44px] w-full rounded-full border border-emerald-900/20 bg-white px-5 py-2 text-base font-semibold text-emerald-900 hover:bg-emerald-50 sm:w-auto">
                                {t("dashboard.signOut")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.petsHelpedTotal")}</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-950">{totalImpact}</p>
                </article>
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.catsSaved", "Cats Saved")}</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-950">{catsSaved}</p>
                </article>
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.dogsSaved", "Dogs Saved")}</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-950">{dogsSaved}</p>
                </article>
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.fromDonations")}</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-950">{donationImpact}</p>
                </article>
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.fromShopPurchases")}</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-950">{shopImpact}</p>
                </article>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.totalDonated", "Total Donated")}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-950">{formatMoney(donationTotalCents, locale as Locale)}</p>
                </article>
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-emerald-900/70">{t("dashboard.totalShopPurchases", "Total Shop Purchases")}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-950">{formatMoney(shopTotalCents, locale as Locale)}</p>
                </article>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-emerald-950">{t("dashboard.recentDonations")}</h2>
                    <ul className="mt-4 space-y-3">
                        {recentDonationsList.map((donation) => (
                            <li key={donation.id} className="flex flex-col gap-1 rounded-2xl bg-emerald-50/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-emerald-900">{formatDate(donation.created_at, locale as Locale)}</span>
                                <span className="font-semibold text-emerald-950">{formatMoney(donation.amount_cents, locale as Locale)}</span>
                            </li>
                        ))}
                        {!recentDonationsList.length && <li className="text-sm text-emerald-900/70">{t("dashboard.noDonationsYet")}</li>}
                    </ul>
                </article>

                <article className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-emerald-950">{t("dashboard.recentOrders")}</h2>
                    <ul className="mt-4 space-y-3">
                        {recentOrdersList.map((order) => (
                            <li key={order.id} className="flex flex-col gap-2 rounded-2xl bg-emerald-50/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-emerald-900">{formatDate(order.created_at, locale as Locale)}</p>
                                    <p className="text-xs uppercase tracking-wide text-emerald-700/80">{order.status}</p>
                                </div>
                                <span className="font-semibold text-emerald-950">{formatMoney(order.amount_cents, locale as Locale)}</span>
                            </li>
                        ))}
                        {!recentOrdersList.length && <li className="text-sm text-emerald-900/70">{t("dashboard.noOrdersYet")}</li>}
                    </ul>
                </article>
            </section>

            <div className="mt-8 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
                <Link href={`/api/stripe/portal?locale=${locale}`} className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-800 sm:w-auto">
                    {t("dashboard.openStripePortal")}
                </Link>
            </div>
        </main>
    );
}

