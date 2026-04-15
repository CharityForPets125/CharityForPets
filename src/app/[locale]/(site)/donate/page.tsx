import { fetchSanity } from "@/lib/sanity/client";
import Image from "next/image";
import { DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { getString, type Locale } from "@/lib/i18n/strings";

import { CheckoutButton } from "@/components/checkout/checkout-button";

type DonationTier = {
    amount?: number;
    achievement?: string;
    oneTimePriceId?: string;
    monthlyPriceId?: string;
};

type DonationSettings = {
    presetAmounts?: DonationTier[];
    isDonationSectionVisible?: boolean;
};

type DonatePageProps = {
    params: Promise<{ locale: string }>;
};

export default async function DonatePage({ params }: DonatePageProps) {
    const { locale } = await params;
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const settings = await fetchSanity<DonationSettings | null>(DONATION_SETTINGS_QUERY, {}, null);

    if (settings?.isDonationSectionVisible === false) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">{t("donate.title")}</h1>
                <p className="mt-3 text-base text-emerald-900/80">{t("donate.unavailable")}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--page-banner-start) 0%, var(--page-banner-mid) 40%, var(--page-banner-end) 100%)' }} />
                <div className="relative flex items-center justify-between gap-4 p-6 sm:p-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">{t("donate.title")}</h1>
                        <p className="mt-3 text-base text-emerald-900/80">{t("donate.description")}</p>
                    </div>
                    <Image src="/logo.png" alt="Pet Charity" width={96} height={96} className="h-16 w-16 rounded-xl object-contain sm:h-20 sm:w-20" />
                </div>
            </div>
            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {settings?.presetAmounts?.map((tier, idx) => (
                    <article key={`${tier.amount}-${idx}`} className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
                        <p className="text-2xl font-bold text-emerald-950">${tier.amount}</p>
                        <p className="mt-2 text-sm text-emerald-900/80">{tier.achievement}</p>
                        <div className="mt-5 grid gap-3">
                            <CheckoutButton
                                priceId={tier.oneTimePriceId}
                                mode="payment"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full min-h-[44px] rounded-full bg-emerald-700 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel={t("donate.oneTimeUnavailable")}
                            >
                                {t("donate.donateOnce")}
                            </CheckoutButton>
                            <CheckoutButton
                                priceId={tier.monthlyPriceId}
                                mode="subscription"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full min-h-[44px] rounded-full border border-emerald-900/20 bg-white px-4 py-3 text-base font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel={t("donate.monthlyUnavailable")}
                            >
                                {t("donate.donateMonthly")}
                            </CheckoutButton>
                        </div>
                    </article>
                ))}
                {!settings?.presetAmounts?.length ? (
                    <p className="text-sm text-emerald-900/70">{t("donate.addPresets")}</p>
                ) : null}
            </section>
        </main>
    );
}

