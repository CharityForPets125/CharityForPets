import { notFound } from "next/navigation";

import { sanityFetch } from "@/lib/sanity/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { getString, type Locale } from "@/lib/i18n/strings";

import { CheckoutButton } from "@/components/checkout/checkout-button";
import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { SanityImage } from "@/components/sanity/sanity-image";

type ProductDoc = {
    name?: string;
    description?: string;
    price?: number;
    stripePriceId?: string;
    images?: unknown[];
    body?: unknown[];
};

type ProductPageProps = {
    params: Promise<{ slug: string; locale: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug, locale } = await params;
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const { data: productRaw } = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY(locale), params: { slug } });
    const product = productRaw as ProductDoc | null;

    if (!product) {
        notFound();
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                <div>
                    {product.images?.[0] ? (
                        <SanityImage
                            image={product.images[0]}
                            alt={product.name || t("product.productImage")}
                            className="aspect-square w-full rounded-2xl object-cover sm:rounded-3xl"
                            priority
                            width={1000}
                            height={1000}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : null}
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl lg:text-4xl">{product.name}</h1>
                    <p className="mt-3 text-sm text-emerald-900/80 sm:mt-4 sm:text-base lg:text-lg">{product.description}</p>
                    <p className="mt-4 text-xl font-bold text-emerald-950 sm:mt-6 sm:text-2xl">${product.price}</p>
                    <div className="mt-5 sm:mt-6">
                        <CheckoutButton
                            priceId={product.stripePriceId}
                            mode="payment"
                            source="shop"
                            quantity={1}
                            cancelPath={`/shop/${slug}`}
                            className="w-full min-h-[48px] rounded-full bg-emerald-700 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs"
                            disabledLabel={t("shop.buyNowUnavailable")}
                        >
                            {t("shop.buyNow")}
                        </CheckoutButton>
                    </div>
                </div>
            </div>
            <section className="mt-8 sm:mt-10">
                <PortableTextRenderer value={product.body} />
            </section>
        </main>
    );
}

