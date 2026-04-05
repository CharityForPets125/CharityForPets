import Link from "next/link";

import { fetchSanity } from "@/lib/sanity/client";
import { PRODUCTS_QUERY, SHOP_SETTINGS_QUERY } from "@/lib/sanity/queries";

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

export default async function ShopPage() {
    const [products, shopSettings] = await Promise.all([
        fetchSanity<Product[]>(PRODUCTS_QUERY, {}, []),
        fetchSanity<ShopSettings | null>(SHOP_SETTINGS_QUERY, {}, null),
    ]);

    if (shopSettings?.isShopSectionVisible === false) {
        return (
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">Shop</h1>
                <p className="mt-3 text-amber-900/80">The shop is currently unavailable. Please check back soon.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">Shop</h1>
            <p className="mt-3 text-amber-900/80">Every purchase helps animals in need.</p>
            <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <Link key={product._id} href={`/shop/${product.slug?.current}`} className="group rounded-3xl border border-amber-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5">
                        {product.images?.[0] ? (
                            <SanityImage
                                image={product.images[0]}
                                alt={product.name || "Product image"}
                                className="h-44 w-full rounded-2xl object-cover sm:h-56"
                            />
                        ) : null}
                        <h2 className="mt-4 text-lg font-semibold text-amber-950 sm:text-xl">{product.name}</h2>
                        <p className="mt-1 text-sm text-amber-900/70">{product.description}</p>
                        <p className="mt-4 font-bold text-amber-950">${product.price}</p>
                    </Link>
                ))}
            </section>
        </main>
    );
}
