import Link from "next/link";

import { SanityImage } from "@/components/sanity/sanity-image";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { fetchSanity } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY, SHOP_SETTINGS_QUERY, DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";

type Counter = {
    label?: string;
    value?: number;
};

type HomePageDoc = {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: unknown;
    impactCounters?: Counter[];
    showHeroSection?: boolean;
    showImpactCounters?: boolean;
    ctaTitle?: string;
    ctaText?: string;
};

type ShopSettings = {
    isShopSectionVisible?: boolean;
};

type DonationSettings = {
    isDonationSectionVisible?: boolean;
};

type HomePageProps = {
    params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
    const { locale: localeParam } = await params;
    const locale = normalizeLocale(localeParam);
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const [homePage, shopSettings, donationSettings] = await Promise.all([
        fetchSanity<HomePageDoc | null>(HOME_PAGE_QUERY(locale), {}, null),
        fetchSanity<ShopSettings | null>(SHOP_SETTINGS_QUERY, {}, null),
        fetchSanity<DonationSettings | null>(DONATION_SETTINGS_QUERY, {}, null),
    ]);

    const defaultCounters: Counter[] = [
        { value: 2410330, label: t("home.raisedFallback", "CZK raised") },
        { value: 532, label: t("home.sheltersFallback", "shelters supported") },
    ];

    const counters = homePage?.impactCounters?.length ? homePage.impactCounters : defaultCounters;

    return (
        <main className="relative overflow-hidden pb-12 sm:pb-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_5%,_#dcfce7_0%,_transparent_30%),radial-gradient(circle_at_90%_20%,_#fef3c7_0%,_transparent_28%),linear-gradient(180deg,_#fcfcf8_0%,_#f8faf4_100%)]" />
            {homePage?.showHeroSection !== false && (
                <section className="py-7 sm:py-10">
                    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-900/10 bg-white/80 px-4 py-3 backdrop-blur">
                            <p className="text-sm font-semibold text-emerald-900">{t("home.siteName", "Second Chance")}</p>
                            <p className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">{t("home.planLabel", "Homepage Visual Plan")}</p>
                        </div>

                        <article className="overflow-hidden rounded-[1.7rem] border border-emerald-900/10 bg-[#f7fbef] shadow-sm">
                            <div className="flex items-center gap-2 border-b border-emerald-900/10 bg-lime-100/70 px-5 py-3">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">1</span>
                                <p className="text-sm font-bold uppercase tracking-wide text-emerald-950">{t("home.sectionHero", "Hero section")}</p>
                                <p className="text-xs text-emerald-900/70">{t("home.sectionTopPage", "(Top of page)")}</p>
                            </div>
                            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:p-9">
                                <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-3 motion-safe:duration-500">
                                    <h1 className="max-w-lg font-heading text-3xl font-bold leading-tight text-emerald-950 sm:text-5xl">
                                        {homePage?.heroTitle || t("home.secondLifeTitle", "Give your items a second life")}
                                    </h1>
                                    <p className="mt-3 max-w-xl text-base text-emerald-900/80 sm:text-lg">
                                        {homePage?.heroSubtitle || t("home.secondLifeSubtitle", "We give them a new purpose.")}
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {donationSettings?.isDonationSectionVisible !== false && (
                                            <Link
                                                href={localizePath("/donate", locale)}
                                                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                            >
                                                {t("home.donateItems", "Donate items")}
                                            </Link>
                                        )}
                                        <Link
                                            href={localizePath("/about", locale)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-900/15 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
                                        >
                                            {t("home.learnMore", "Learn more")}
                                        </Link>
                                    </div>
                                </div>
                                <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-3 motion-safe:duration-500">
                                    {homePage?.heroImage ? (
                                        <SanityImage
                                            image={homePage.heroImage}
                                            alt={homePage.heroTitle || "Hero image"}
                                            className="h-[250px] w-full rounded-[1.4rem] border border-emerald-900/10 object-cover sm:h-[315px]"
                                            priority
                                        />
                                    ) : (
                                        <div className="h-[250px] w-full rounded-[1.4rem] border border-emerald-900/10 bg-[linear-gradient(160deg,_#e8f6cf,_#fff8e1)] sm:h-[315px]" />
                                    )}
                                </div>
                            </div>
                        </article>

                        <article className="overflow-hidden rounded-[1.7rem] border border-emerald-900/10 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-emerald-900/10 bg-lime-100/70 px-5 py-3">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">2</span>
                                <p className="text-sm font-bold uppercase tracking-wide text-emerald-950">{t("home.sectionHowItWorks", "How it works")}</p>
                            </div>
                            <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
                                <p className="text-sm font-medium text-emerald-900/75">{t("home.goalThreeSteps", "Goal: explain simply in 3 steps")}</p>
                                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
                                    <article className="rounded-2xl bg-lime-50/70 p-5 md:rounded-none md:border-r md:border-emerald-900/10">
                                        <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">01</p>
                                        <h2 className="mt-3 text-lg font-semibold text-emerald-950">{t("home.step1Title", "Donate items")}</h2>
                                        <p className="mt-1 text-sm text-emerald-900/80">{t("home.step1Body", "Bring or schedule pickup for clean, useful items.")}</p>
                                    </article>
                                    <article className="rounded-2xl bg-lime-50/70 p-5 md:rounded-none md:border-r md:border-emerald-900/10">
                                        <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">02</p>
                                        <h2 className="mt-3 text-lg font-semibold text-emerald-950">{t("home.step2Title", "We pick them up")}</h2>
                                        <p className="mt-1 text-sm text-emerald-900/80">{t("home.step2Body", "Our team sorts, prepares, and redirects value to shelters.")}</p>
                                    </article>
                                    <article className="rounded-2xl bg-lime-50/70 p-5 md:rounded-none">
                                        <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">03</p>
                                        <h2 className="mt-3 text-lg font-semibold text-emerald-950">{t("home.step3Title", "We help shelters")}</h2>
                                        <p className="mt-1 text-sm text-emerald-900/80">{t("home.step3Body", "Food, treatment, and support reach animals faster.")}</p>
                                    </article>
                                </div>
                            </div>
                        </article>

                        {homePage?.showImpactCounters !== false && (
                            <article className="overflow-hidden rounded-[1.7rem] border border-emerald-900/10 bg-[#f7fbef] shadow-sm">
                                <div className="flex items-center gap-2 border-b border-emerald-900/10 bg-lime-100/70 px-5 py-3">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">3</span>
                                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-950">{t("home.sectionImpact", "Impact / stats")}</p>
                                </div>
                                <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
                                    <p className="text-sm font-medium text-emerald-900/75">{t("home.goalBuildTrust", "Goal: build trust")}</p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {counters.slice(0, 2).map((counter, idx) => (
                                            <div key={`${counter.label}-${idx}`} className="rounded-2xl border border-emerald-900/10 bg-white p-5">
                                                <p className="text-4xl font-extrabold leading-none text-emerald-950">{(counter.value || 0).toLocaleString(locale)}</p>
                                                <p className="mt-2 text-sm font-medium text-emerald-900/80">{counter.label || t("home.impactLabel", "Lives improved")}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        )}

                        <section className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
                            <article className="overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-emerald-900/10 bg-lime-100/70 px-5 py-3">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">4</span>
                                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-950">{t("home.sectionFinalCta", "Final CTA")}</p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <h2 className="font-heading text-2xl font-bold text-emerald-950 sm:text-3xl">
                                        {homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                                    </h2>
                                    <p className="mt-2 text-emerald-900/80">
                                        {homePage?.ctaText || t("home.ctaNewText", "Simple flow: see, feel, understand, trust.")}
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {donationSettings?.isDonationSectionVisible !== false && (
                                            <Link
                                                href={localizePath("/donate", locale)}
                                                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                            >
                                                {t("home.startHelping", "Start helping")}
                                            </Link>
                                        )}
                                        {shopSettings?.isShopSectionVisible !== false && (
                                            <Link
                                                href={localizePath("/shop", locale)}
                                                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-900/15 bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
                                            >
                                                {t("home.shopForACause", "Shop for a Cause")}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </article>

                            <article className="overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white shadow-sm">
                                <div className="flex items-center gap-2 border-b border-emerald-900/10 bg-lime-100/70 px-5 py-3">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">5</span>
                                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-950">{t("home.footerCardTitle", "Footer")}</p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <p className="text-sm font-medium text-emerald-900/80">{t("home.footerCardBody", "Logo, links, contact, and socials")}</p>
                                    <h2 className="mt-5 text-lg font-semibold text-emerald-950">{t("home.simpleFlowTitle", "Simple flow")}</h2>
                                    <p className="mt-2 text-sm text-emerald-900/85">{t("home.simpleFlowBody", "Your brand is emotional and friendly, so we keep cards rounded, visual, and easy to scan.")}</p>
                                    <ul className="mt-4 space-y-2 text-sm text-emerald-900/85">
                                        <li>• {t("home.simpleFlowPoint1", "Rounded cards")}</li>
                                        <li>• {t("home.simpleFlowPoint2", "Illustration-led sections")}</li>
                                        <li>• {t("home.simpleFlowPoint3", "Less text, clearer action")}</li>
                                    </ul>
                                </div>
                            </article>
                        </section>
                    </div>
                </section>
            )}
        </main>
    );
}
