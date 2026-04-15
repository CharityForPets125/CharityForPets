import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { PRODUCTS_QUERY, SHOP_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { getString, type Locale } from "@/lib/i18n/strings";

import { SanityImage } from "@/components/sanity/sanity-image";

type Product = {
    _id: string;
    name?: string;
    slug?: { current?: string };
    price?: number;
    images?: unknown[];
    description?: string;
};

type ShopSettings = {
    isShopSectionVisible?: boolean;
};

type ShopPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function ShopPage({ params }: ShopPageProps) {
    const { locale } = await params;
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const [{ data: productsRaw }, { data: shopSettingsRaw }] = await Promise.all([
        sanityFetch({ query: PRODUCTS_QUERY(locale) }),
        sanityFetch({ query: SHOP_SETTINGS_QUERY }),
    ]);
    const products = (productsRaw as Product[] | null) ?? [];
    const shopSettings = shopSettingsRaw as ShopSettings | null;

    if (shopSettings?.isShopSectionVisible === false) {
        return (
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">{t("shop.title")}</h1>
                <p className="mt-3 text-emerald-900/80">{t("shop.unavailable")}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl lg:text-4xl">{t("shop.title")}</h1>
            <p className="mt-2 text-sm text-emerald-900/80 sm:mt-3 sm:text-base">{t("shop.description")}</p>
            <section className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {products.map((product) => (
                    <Link key={product._id} href={`/shop/${product.slug?.current}`} className="group flex flex-col rounded-2xl border border-emerald-900/10 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 sm:rounded-3xl sm:p-4">
                        {product.images?.[0] ? (
                            <SanityImage
                                image={product.images[0]}
                                alt={product.name || t("product.productImage")}
                                className="h-36 w-full rounded-xl object-cover sm:h-44 sm:rounded-2xl md:h-52"
                                width={640}
                                height={640}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : null}
                        <div className="mt-3 flex flex-1 flex-col">
                            <h2 className="text-sm font-semibold text-emerald-950 sm:text-lg sm:text-xl">{product.name}</h2>
                            <p className="mt-1 line-clamp-2 text-xs text-emerald-900/70 sm:text-sm">{product.description}</p>
                            <p className="mt-3 font-bold text-emerald-950 sm:mt-4">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}

