import Link from "next/link";

import { SanityImage } from "@/components/sanity/sanity-image";
import { getString, type Locale } from "@/lib/i18n/strings";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/live";
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
    howItWorksImages?: unknown[];
    impactSectionImage?: unknown;
    ctaSectionImage?: unknown;
    impactCounters?: Counter[];
    ctaTitle?: string;
    ctaText?: string;
    testimonials?: Testimonial[];
    showHeroSection?: boolean;
    showImpactCounters?: boolean;
    showCTASection?: boolean;
    showTestimonials?: boolean;
    showHowItWorks?: boolean;
    heroTitleColor?: string;
    heroSubtitleColor?: string;
    sectionHeadingColor?: string;
    heroOverlayColor?: string;
    heroOverlayOpacity?: number;
    ctaOverlayColor?: string;
    ctaOverlayOpacity?: number;
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

function FallbackImageBlock({ className = "" }: { className?: string }) {
    return <div className={`w-full bg-[linear-gradient(160deg,_#d1fae5_0%,_#ecfdf5_40%,_#fef9c3_100%)] ${className}`.trim()} />;
}

export default async function Home({ params }: HomePageProps) {
    const { locale: localeParam } = await params;
    const locale = normalizeLocale(localeParam);
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const [{ data: homePageRaw }, { data: shopSettingsRaw }, { data: donationSettingsRaw }] = await Promise.all([
        sanityFetch({ query: HOME_PAGE_QUERY(locale) }),
        sanityFetch({ query: SHOP_SETTINGS_QUERY }),
        sanityFetch({ query: DONATION_SETTINGS_QUERY }),
    ]);
    const homePage = homePageRaw as HomePageDoc | null;
    const shopSettings = shopSettingsRaw as ShopSettings | null;
    const donationSettings = donationSettingsRaw as DonationSettings | null;

    const defaultCounters: Counter[] = [
        { value: 2410330, label: t("home.raisedFallback", "CZK raised") },
        { value: 532, label: t("home.sheltersFallback", "shelters supported") },
    ];

    const counters = homePage?.impactCounters?.length ? homePage.impactCounters : defaultCounters;

    return (
        <main className="bg-[#f8fbf5]">
            {homePage?.showHeroSection !== false && (
                <section className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[620px]">
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
                        <FallbackImageBlock className="absolute inset-0" />
                    )}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: homePage?.heroOverlayColor || "#022c22",
                            opacity: (homePage?.heroOverlayOpacity ?? 45) / 100,
                        }}
                    />
                    <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
                        <div className="max-w-2xl text-left">
                            <h1
                                className="font-heading text-4xl font-bold leading-tight drop-shadow sm:text-5xl lg:text-6xl"
                                style={{ color: homePage?.heroTitleColor || "#ffffff" }}
                            >
                                {homePage?.heroTitle || t("home.secondLifeTitle", "Give your items a second life")}
                            </h1>
                            <p
                                className="mt-4 max-w-xl text-base sm:text-lg"
                                style={{ color: homePage?.heroSubtitleColor || "rgba(255,255,255,0.9)" }}
                            >
                                {homePage?.heroSubtitle || t("home.secondLifeSubtitle", "We give them a new purpose.")}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
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
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/40 bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
                                >
                                    {t("home.learnMore", "Learn more")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {homePage?.showHowItWorks !== false && (
                <section className="py-16 sm:py-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <h2
                            className="text-center font-heading text-3xl font-bold sm:text-4xl"
                            style={{ color: homePage?.sectionHeadingColor || "#022c22" }}
                        >
                            {t("home.sectionHowItWorks", "How It Works")}
                        </h2>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {[0, 1, 2].map((index) => {
                                const image = homePage?.howItWorksImages?.[index];
                                const titleKey = `home.step${index + 1}Title`;
                                const bodyKey = `home.step${index + 1}Body`;

                                return (
                                    <article key={index} className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                                        {image ? (
                                            <SanityImage
                                                image={image}
                                                alt={t(titleKey, `Step ${index + 1}`)}
                                                className="h-52 w-full object-cover"
                                                width={960}
                                                height={640}
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <FallbackImageBlock className="h-52" />
                                        )}
                                        <div className="p-5">
                                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">0{index + 1}</p>
                                            <h3 className="mt-2 text-lg font-semibold text-emerald-950">{t(titleKey, "")}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-emerald-900/75">{t(bodyKey, "")}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {homePage?.showImpactCounters !== false && (
                <section className="bg-emerald-900 py-16 sm:py-20">
                    <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                        <div>
                            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                                {t("home.impactHeadline", "Our Community Impact")}
                            </h2>
                            <div className="mt-8 grid grid-cols-2 gap-6">
                                {counters.slice(0, 4).map((counter, idx) => (
                                    <div key={`${counter.label}-${idx}`}>
                                        <p className="font-heading text-4xl font-extrabold text-white sm:text-5xl">
                                            {(counter.value || 0).toLocaleString(locale)}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-emerald-100/90">
                                            {counter.label || t("home.impactLabel", "Lives improved")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl">
                            {homePage?.impactSectionImage ? (
                                <SanityImage
                                    image={homePage.impactSectionImage}
                                    alt={t("home.impactHeadline", "Our Community Impact")}
                                    className="h-[360px] w-full object-cover"
                                    width={960}
                                    height={1200}
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                            ) : (
                                <FallbackImageBlock className="h-[360px]" />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {homePage?.showCTASection !== false && (
                <section className="py-16 sm:py-24">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
                            {homePage?.ctaSectionImage ? (
                                <SanityImage
                                    image={homePage.ctaSectionImage}
                                    alt={homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    width={1600}
                                    height={900}
                                    sizes="100vw"
                                />
                            ) : (
                                <FallbackImageBlock className="absolute inset-0" />
                            )}
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: homePage?.ctaOverlayColor || "#022c22",
                                    opacity: (homePage?.ctaOverlayOpacity ?? 45) / 100,
                                }}
                            />
                            <div className="relative z-10 p-8 text-left sm:p-12">
                                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                                    {homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                                </h2>
                                <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
                                    {homePage?.ctaText || t("home.ctaNewText", "Every item donated, every purchase made - it all adds up to real change for animals in need.")}
                                </p>
                                <div className="mt-8 flex flex-wrap gap-4">
                                    {donationSettings?.isDonationSectionVisible !== false && (
                                        <Link
                                            href={localizePath("/donate", locale)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            {t("home.startHelping", "Start helping")}
                                        </Link>
                                    )}
                                    {shopSettings?.isShopSectionVisible !== false && (
                                        <Link
                                            href={localizePath("/shop", locale)}
                                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/40 bg-white/20 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
                                        >
                                            {t("home.shopForACause", "Shop for a Cause")}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {homePage?.showTestimonials !== false && homePage?.testimonials && homePage.testimonials.length > 0 && (
                <section className="bg-white py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <h2
                            className="text-center font-heading text-2xl font-bold sm:text-3xl"
                            style={{ color: homePage?.sectionHeadingColor || "#022c22" }}
                        >
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
                                            - {testimonial.author}
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
