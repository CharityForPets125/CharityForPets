import { fetchSanity } from "@/lib/sanity/client";
import { DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";

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

export default async function DonatePage() {
    const settings = await fetchSanity<DonationSettings | null>(DONATION_SETTINGS_QUERY, {}, null);

    if (settings?.isDonationSectionVisible === false) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">Donate</h1>
                <p className="mt-3 text-amber-900/80">The donation section is currently unavailable. Please check back soon.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">Donate</h1>
            <p className="mt-3 text-amber-900/80">Choose an amount to support stray animals.</p>
            <section className="mt-8 grid gap-4 sm:grid-cols-2">
                {settings?.presetAmounts?.map((tier, idx) => (
                    <article key={`${tier.amount}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
                        <p className="text-2xl font-bold text-amber-950">${tier.amount}</p>
                        <p className="mt-2 text-sm text-amber-900/80">{tier.achievement}</p>
                        <div className="mt-5 grid gap-2">
                            <CheckoutButton
                                priceId={tier.oneTimePriceId}
                                mode="payment"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel="One-time unavailable"
                            >
                                Donate Once
                            </CheckoutButton>
                            <CheckoutButton
                                priceId={tier.monthlyPriceId}
                                mode="subscription"
                                source="donation"
                                cancelPath="/donate"
                                className="w-full rounded-full border border-amber-900/20 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                disabledLabel="Monthly unavailable"
                            >
                                Donate Monthly
                            </CheckoutButton>
                        </div>
                    </article>
                ))}
                {!settings?.presetAmounts?.length ? (
                    <p className="text-sm text-amber-900/70">Add donation presets in Sanity Studio.</p>
                ) : null}
            </section>
        </main>
    );
}
