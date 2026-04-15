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
    heroImageMobile?: unknown;
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
    heroTextAlign?: string;
    heroContentWidth?: string;
    heroHeightMobile?: number;
    heroHeightDesktop?: number;
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

    const heroTextAlign = (homePage?.heroTextAlign ?? "left") as "left" | "center";
    const heroContentWidth = (homePage?.heroContentWidth ?? "medium") as "narrow" | "medium" | "wide";
    const heroHeightMobile = homePage?.heroHeightMobile ?? 560;
    const heroHeightDesktop = homePage?.heroHeightDesktop ?? 700;
    const contentMaxWidth = { narrow: "max-w-sm", medium: "max-w-xl", wide: "max-w-2xl" }[heroContentWidth] ?? "max-w-xl";
    const justifyClass = heroTextAlign === "center" ? "justify-center" : "justify-start";
    const textAlignClass = heroTextAlign === "center" ? "text-center" : "text-left";
    const buttonRowAlign = heroTextAlign === "center" ? "justify-center" : "";

    return (
        <main className="bg-[#f8fbf5]">
            {homePage?.showHeroSection !== false && (
                <>
                    {/* eslint-disable-next-line react/no-danger */}
                    <style>{`.hero-section{min-height:${heroHeightMobile}px}@media(min-width:640px){.hero-section{min-height:${heroHeightDesktop}px}}`}</style>
                    <section className="hero-section relative isolate overflow-hidden">
                        {homePage?.heroImageMobile ? (
                            <>
                                <SanityImage
                                    image={homePage.heroImageMobile}
                                    alt={homePage.heroTitle || "Hero image"}
                                    className="absolute inset-0 h-full w-full object-cover block sm:hidden"
                                    width={800}
                                    height={900}
                                    sizes="100vw"
                                    priority
                                />
                                <SanityImage
                                    image={homePage.heroImage}
                                    alt={homePage.heroTitle || "Hero image"}
                                    className="absolute inset-0 h-full w-full object-cover hidden sm:block"
                                    width={1920}
                                    height={1080}
                                    sizes="100vw"
                                    priority
                                />
                            </>
                        ) : homePage?.heroImage ? (
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
                                opacity: (homePage?.heroOverlayOpacity ?? 40) / 100,
                            }}
                        />
                        <div className={`relative z-10 mx-auto flex w-full max-w-6xl items-center ${justifyClass} px-4 py-14 sm:px-6 sm:py-20 lg:px-8`}>
                            <div className={`w-full ${contentMaxWidth} ${textAlignClass}`}>
                                <h1
                                    className="font-heading text-3xl font-bold leading-tight drop-shadow-lg sm:text-5xl lg:text-6xl"
                                    style={{ color: homePage?.heroTitleColor || "#ffffff" }}
                                >
                                    {homePage?.heroTitle || t("home.secondLifeTitle", "Give your items a second life")}
                                </h1>
                                <p
                                    className="mt-3 text-base drop-shadow sm:mt-4 sm:text-lg"
                                    style={{ color: homePage?.heroSubtitleColor || "rgba(255,255,255,0.9)" }}
                                >
                                    {homePage?.heroSubtitle || t("home.secondLifeSubtitle", "We give them a new purpose.")}
                                </p>
                                <div className={`mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap ${buttonRowAlign}`}>
                                    {donationSettings?.isDonationSectionVisible !== false && (
                                        <Link
                                            href={localizePath("/donate", locale)}
                                            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 sm:w-auto"
                                        >
                                            {t("home.donateItems", "Donate items")}
                                        </Link>
                                    )}
                                    <Link
                                        href={localizePath("/about", locale)}
                                        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-white/40 bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30 sm:w-auto"
                                    >
                                        {t("home.learnMore", "Learn more")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {homePage?.showHowItWorks !== false && (
                <section className="py-12 sm:py-16 sm:py-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <h2
                            className="text-center font-heading text-2xl font-bold sm:text-3xl sm:text-4xl"
                            style={{ color: homePage?.sectionHeadingColor || "#022c22" }}
                        >
                            {t("home.sectionHowItWorks", "How It Works")}
                        </h2>
                        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 md:grid-cols-3">
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
                <section className="relative overflow-hidden bg-[#0a1f14] py-16 sm:py-24">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-700/10" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-600/10" aria-hidden="true" />

                    <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                            {/* Left: headline + stats + CTA */}
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    {t("home.impactLabel", "Our Impact")}
                                </span>

                                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                                    {t("home.impactHeadline", "Together, we've changed thousands of lives.")}
                                </h2>

                                <p className="mt-4 text-base leading-relaxed text-emerald-100/70 sm:text-lg">
                                    {t("home.impactSubheadline", "Every donation becomes food, shelter, and a second chance. Here's the difference we've made together.")}
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
                                    {counters.slice(0, 4).map((counter, idx) => (
                                        <div key={`${counter.label}-${idx}`} className="rounded-2xl border border-emerald-700/40 bg-emerald-900/40 p-4 sm:p-5">
                                            <p className="font-heading text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                                                {(counter.value || 0).toLocaleString(locale)}
                                                <span className="text-emerald-400">+</span>
                                            </p>
                                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-300/80 sm:text-sm">
                                                {counter.label || t("home.impactLabel", "Lives improved")}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {donationSettings?.isDonationSectionVisible !== false && (
                                    <div className="mt-8">
                                        <Link
                                            href={localizePath("/donate", locale)}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/60 transition hover:bg-emerald-400 active:scale-95"
                                        >
                                            {t("home.makeADifference", "Make a difference today")}
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Right: image with floating badge */}
                            <div className="relative">
                                <div className="overflow-hidden rounded-3xl shadow-2xl shadow-emerald-950/60">
                                    {homePage?.impactSectionImage ? (
                                        <SanityImage
                                            image={homePage.impactSectionImage}
                                            alt={t("home.impactHeadline", "Community Impact")}
                                            className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[520px]"
                                            width={960}
                                            height={1200}
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <FallbackImageBlock className="h-[380px] sm:h-[460px] lg:h-[520px]" />
                                    )}
                                </div>
                                {/* Floating badge */}
                                <div className="absolute -bottom-5 -left-3 rounded-2xl bg-emerald-500 px-4 py-3 shadow-xl sm:-bottom-6 sm:-left-5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">❤️ {t("home.realChange", "Real Change")}</p>
                                    <p className="mt-0.5 text-sm font-semibold text-white">{t("home.animalsWeekly", "50+ animals helped weekly")}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            )}

            {homePage?.showCTASection !== false && (
                <section className="py-16 sm:py-24">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-3xl shadow-sm lg:grid lg:grid-cols-2">
                            {/* Image */}
                            <div className="relative h-64 lg:h-auto">
                                {homePage?.ctaSectionImage ? (
                                    <SanityImage
                                        image={homePage.ctaSectionImage}
                                        alt={homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                                        className="h-full w-full object-cover"
                                        width={960}
                                        height={900}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                ) : (
                                    <FallbackImageBlock className="h-full w-full min-h-64" />
                                )}
                            </div>
                            {/* Text */}
                            <div className="flex flex-col justify-center bg-[#0a1f14] p-8 sm:p-12">
                                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                                    {homePage?.ctaTitle || t("home.ctaNewTitle", "Start helping today")}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-emerald-100/70 sm:mt-4 sm:text-base">
                                    {homePage?.ctaText || t("home.ctaNewText", "Every item donated, every purchase made - it all adds up to real change for animals in need.")}
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    {donationSettings?.isDonationSectionVisible !== false && (
                                        <Link
                                            href={localizePath("/donate", locale)}
                                            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 sm:w-auto"
                                        >
                                            {t("home.startHelping", "Start helping")}
                                        </Link>
                                    )}
                                    {shopSettings?.isShopSectionVisible !== false && (
                                        <Link
                                            href={localizePath("/shop", locale)}
                                            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-8 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 sm:w-auto"
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
