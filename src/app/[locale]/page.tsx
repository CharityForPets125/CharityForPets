import Link from "next/link";

import { SanityImage } from "@/components/sanity/sanity-image";
import { fetchSanity } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY, PRODUCTS_QUERY, SHOP_SETTINGS_QUERY, DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";

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
    aboutTitle?: string;
    aboutText?: string;
    ctaTitle?: string;
    ctaText?: string;
    testimonials?: Testimonial[];
    showHeroSection?: boolean;
    showImpactCounters?: boolean;
    showAboutSection?: boolean;
    showCTASection?: boolean;
    showTestimonials?: boolean;
    showFeaturedProducts?: boolean;
};

type ShopSettings = {
    isShopSectionVisible?: boolean;
};

type DonationSettings = {
    isDonationSectionVisible?: boolean;
};

type Product = {
    _id: string;
    name?: string;
    slug?: { current?: string };
    price?: number;
    images?: unknown[];
};

export default async function Home() {
    const [homePage, products, shopSettings, donationSettings] = await Promise.all([
        fetchSanity<HomePageDoc | null>(HOME_PAGE_QUERY, {}, null),
        fetchSanity<Product[]>(PRODUCTS_QUERY, {}, []),
        fetchSanity<ShopSettings | null>(SHOP_SETTINGS_QUERY, {}, null),
        fetchSanity<DonationSettings | null>(DONATION_SETTINGS_QUERY, {}, null),
    ]);

    return (
        <main className="pb-12 sm:pb-16">
            {homePage?.showHeroSection !== false && (
                <section className="relative isolate overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#fed7aa_0%,_transparent_35%),radial-gradient(circle_at_20%_80%,_#bbf7d0_0%,_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#fffbeb_100%)]" />
                    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-14 md:grid-cols-2 md:items-center lg:px-8 lg:py-20">
                        <div>
                            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-amber-950 sm:text-5xl">
                                {homePage?.heroTitle || "Help Stray Animals Today"}
                            </h1>
                            <p className="mt-4 max-w-xl text-base text-amber-900/85 sm:text-lg">
                                {homePage?.heroSubtitle || "Every donation and purchase makes a difference in the lives of animals in need."}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                {donationSettings?.isDonationSectionVisible !== false && (
                                    <Link href="/donate" className="inline-flex w-full justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 sm:w-auto">
                                        Donate Now
                                    </Link>
                                )}
                                {shopSettings?.isShopSectionVisible !== false && (
                                    <Link href="/shop" className="inline-flex w-full justify-center rounded-full border border-amber-700/20 bg-white px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 sm:w-auto">
                                        Shop for a Cause
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div>
                            {homePage?.heroImage ? (
                                <SanityImage
                                    image={homePage.heroImage}
                                    alt={homePage.heroTitle || "Help stray animals"}
                                    className="w-full rounded-[2rem] border border-amber-900/10 object-cover shadow-lg"
                                    priority
                                />
                            ) : (
                                <div className="h-[360px] rounded-[2rem] border border-amber-900/10 bg-white/80" />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {homePage?.showImpactCounters !== false && homePage?.impactCounters && homePage.impactCounters.length > 0 && (
                <section className="mx-auto mt-6 grid w-full max-w-6xl gap-4 px-4 sm:mt-8 sm:px-6 sm:grid-cols-3 lg:px-8">
                    {homePage.impactCounters.map((counter, idx) => (
                        <article key={`${counter.label}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                            <p className="text-3xl font-extrabold text-amber-950">{counter.value || 0}</p>
                            <p className="mt-2 text-sm text-amber-900/80">{counter.label}</p>
                        </article>
                    ))}
                </section>
            )}

            {homePage?.showAboutSection !== false && (
                <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:mt-12 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="font-heading text-2xl font-bold text-amber-950 sm:text-3xl">{homePage?.aboutTitle || "About Our Mission"}</h2>
                        <p className="mt-4 text-amber-900/85">{homePage?.aboutText || "We are dedicated to helping stray animals find safe homes and providing care for those in need."}</p>
                    </div>
                </section>
            )}

            {homePage?.showFeaturedProducts !== false && shopSettings?.isShopSectionVisible !== false && products.length > 0 && (
                <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:mt-12 sm:px-6 lg:px-8">
                    <h2 className="font-heading text-2xl font-bold text-amber-950 sm:text-3xl">Featured Products</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.slice(0, 3).map((product) => (
                            <Link key={product._id} href={`/shop/${product.slug?.current}`} className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
                                {product.images?.[0] ? (
                                    <SanityImage
                                        image={product.images[0]}
                                        alt={product.name || "Product image"}
                                        className="h-44 w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="h-44 w-full rounded-2xl bg-amber-100" />
                                )}
                                <h3 className="mt-4 text-lg font-semibold text-amber-950">{product.name}</h3>
                                <p className="mt-2 font-bold text-amber-700">${product.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {homePage?.showCTASection !== false && (
                <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:mt-12 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] bg-amber-100 p-6 sm:p-8">
                        <h2 className="font-heading text-2xl font-bold text-amber-950 sm:text-3xl">{homePage?.ctaTitle || "Ready to Make a Difference?"}</h2>
                        <p className="mt-3 text-amber-900/80">{homePage?.ctaText || "Your support helps us care for stray animals and find them loving homes."}</p>
                        <Link href="/donate" className="mt-6 inline-flex w-full justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto">
                            Make an Impact
                        </Link>
                    </div>
                </section>
            )}

            {homePage?.showTestimonials !== false && homePage?.testimonials && homePage.testimonials.length > 0 && (
                <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:mt-12 sm:px-6 lg:px-8">
                    <h2 className="font-heading text-2xl font-bold text-amber-950 sm:text-3xl">Testimonials</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {homePage.testimonials.map((item, idx) => (
                            <article key={`${item.author}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                                <p className="text-amber-900/90">&ldquo;{item.quote}&rdquo;</p>
                                <p className="mt-3 text-sm font-semibold text-amber-800">— {item.author}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
