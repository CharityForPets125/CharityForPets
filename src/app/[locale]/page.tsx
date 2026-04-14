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

type Testimonial = {
    quote?: string;
    author?: string;
};

type HomePageDoc = {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: unknown;
    impactCounters?: Counter[];
    ctaTitle?: string;
    ctaText?: string;
    testimonials?: Testimonial[];
    showHeroSection?: boolean;
    showImpactCounters?: boolean;
    showCTASection?: boolean;
    showTestimonials?: boolean;
    showHowItWorks?: boolean;
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
        <main>
            {/* â”€â”€ Hero â”€â”€ */}
            {homePage?.showHeroSection !== false && (
                <section className="relative isolate h-[480px] overflow-hidden sm:h-[560px]">
                    {homePage?.heroImage ? (
                        <SanityImage
                            image={homePage.heroImage}
                            alt={homePage.heroTitle || "Hero image"}
                            className="absolute inset-0 h-full w-full object-cover"
                            width={1920}
                            height={1080}
                            sizes="100vw"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(160deg,_#d1fae5_0%,_#ecfdf5_40%,_#fef9c3_100%)]" />
                    )}
                    {homePage?.heroImage != null && <div className="absolute inset-0 bg-emerald-950/45" />}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6">
                        <h1 className={`max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${homePage?.heroImage ? "text-white drop-shadow" : "text-emerald-950"}`}>
                            {homePage?.heroTitle || t("home.secondLifeTitle", "Give your items a second life")}
                        </h1>
                        <p className={`mt-4 max-w-xl text-base sm:text-lg ${homePage?.heroImage ? "text-white/85" : "text-emerald-900/80"}`}>
                            {homePage?.heroSubtitle || t("home.secondLifeSubtitle", "We give them a new purpose.")}
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {donationSettings?.isDonationSectionVisible !== false && (
                                <Link
                                    href={localizePath("/donate", locale)}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
                                >
                                    {t("home.donateItems", "Donate items")}
                                </Link>
                            )}
                            <Link
                                href={localizePath("/about", locale)}
                                className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition ${homePage?.heroImage ? "border border-white/40 bg-white/20 text-white backdrop-blur hover:bg-white/30" : "border border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50"}`}
                            >
                                {t("home.learnMore", "Learn more")}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ How It Works â”€â”€ */}
            {homePage?.showHowItWorks !== false && (
                <section className="bg-[#f8fbf5] py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center font-heading text-2xl font-bold text-emerald-950 sm:text-3xl">
                            {t("home.sectionHowItWorks", "How It Works")}
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600">01</p>
                                <h3 className="mt-2 text-lg font-semibold text-emerald-950">{t("home.step1Title", "Donate items")}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-emerald-900/70">{t("home.step1Body", "Bring or schedule pickup for clean, useful items.")}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600">02</p>
                                <h3 className="mt-2 text-lg font-semibold text-emerald-950">{t("home.step2Title", "We pick them up")}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-emerald-900/70">{t("home.step2Body", "Our team sorts, prepares, and redirects value to shelters.")}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600">03</p>
                                <h3 className="mt-2 text-lg font-semibold text-emerald-950">{t("home.step3Title", "We help shelters")}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-emerald-900/70">{t("home.step3Body", "Food, treatment, and support reach animals faster.")}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ Impact Counters â”€â”€ */}
            {homePage?.showImpactCounters !== false && (
                <section className="bg-emerald-800 py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
                            {t("home.impactHeadline", "Our Community Impact")}
                        </h2>
                        <div className="mt-10 grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4">
                            {counters.map((counter, idx) => (
                                <div key={`${counter.label}-${idx}`} className="text-center">
                                    <p className="font-heading text-4xl font-extrabold text-white sm:text-5xl">
                                        {(counter.value || 0).toLocaleString(locale)}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-emerald-200">
                                        {counter.label || t("home.impactLabel", "Lives improved")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ CTA â”€â”€ */}
            {homePage?.showCTASection !== false && (
                <section className="bg-[#f8fbf5] py-16 sm:py-24">
                    <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
                        <h2 className="font-heading text-3xl font-bold text-emerald-950 sm:text-4xl">
                            {homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                        </h2>
                        <p className="mt-4 text-base text-emerald-900/75 sm:text-lg">
                            {homePage?.ctaText || t("home.ctaNewText", "Every item donated, every purchase made \u2014 it all adds up to real change for animals in need.")}
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {donationSettings?.isDonationSectionVisible !== false && (
                                <Link
                                    href={localizePath("/donate", locale)}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-800"
                                >
                                    {t("home.startHelping", "Start helping")}
                                </Link>
                            )}
                            {shopSettings?.isShopSectionVisible !== false && (
                                <Link
                                    href={localizePath("/shop", locale)}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-900/15 bg-white px-8 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
                                >
                                    {t("home.shopForACause", "Shop for a Cause")}
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* â”€â”€ Testimonials â”€â”€ */}
            {homePage?.showTestimonials !== false && homePage?.testimonials && homePage.testimonials.length > 0 && (
                <section className="bg-white py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center font-heading text-2xl font-bold text-emerald-950 sm:text-3xl">
                            {t("home.testimonials", "What people are saying")}
                        </h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {homePage.testimonials.map((testimonial, idx) => (
                                <figure key={idx} className="rounded-2xl border border-emerald-900/10 bg-[#f8fbf5] p-6">
                                    <blockquote className="text-sm italic leading-relaxed text-emerald-900/80">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </blockquote>
                                    {testimonial.author && (
                                        <figcaption className="mt-4 text-sm font-semibold text-emerald-950">
                                            &mdash; {testimonial.author}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

