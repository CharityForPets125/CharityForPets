import { fetchSanity } from "@/lib/sanity/client";
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
                <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{t("donate.title")}</h1>
                <p className="mt-3 text-base text-amber-900/80">{t("donate.unavailable")}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{t("donate.title")}</h1>
            <p className="mt-3 text-base text-amber-900/80">{t("donate.description")}</p>
            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {settings?.presetAmounts?.map((tier, idx) => (
                    <article key={`${tier.amount}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
                        <p className="text-2xl font-bold text-amber-950">${tier.amount}</p>
                        <p className="mt-2 text-sm text-amber-900/80">{tier.achievement}</p>
                        <div className="mt-5 grid gap-3">
                            <CheckoutButton
                                priceId={tier.oneTimePriceId}
                                mode="payment"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full min-h-[44px] rounded-full bg-amber-600 px-4 py-3 text-base font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel={t("donate.oneTimeUnavailable")}
                            >
                                {t("donate.donateOnce")}
                            </CheckoutButton>
                            <CheckoutButton
                                priceId={tier.monthlyPriceId}
                                mode="subscription"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full min-h-[44px] rounded-full border border-amber-900/20 bg-white px-4 py-3 text-base font-semibold text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel={t("donate.monthlyUnavailable")}
                            >
                                {t("donate.donateMonthly")}
                            </CheckoutButton>
                        </div>
                    </article>
                ))}
                {!settings?.presetAmounts?.length ? (
                    <p className="text-sm text-amber-900/70">{t("donate.addPresets")}</p>
                ) : null}
            </section>
        </main>
    );
}
