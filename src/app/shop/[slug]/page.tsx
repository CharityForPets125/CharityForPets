import { notFound } from "next/navigation";

import { fetchSanity } from "@/lib/sanity/client";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries";

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

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchSanity<ProductDoc | null>(PRODUCT_BY_SLUG_QUERY, { slug }, null);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <div>
          {product.images?.[0] ? (
            <SanityImage image={product.images[0]} alt={product.name || "Product image"} className="rounded-3xl object-cover" priority />
          ) : null}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base text-amber-900/80 sm:text-lg">{product.description}</p>
          <p className="mt-6 text-2xl font-bold text-amber-950">${product.price}</p>
          <div className="mt-6 w-full max-w-xs">
            <CheckoutButton
              priceId={product.stripePriceId}
              mode="payment"
              source="shop"
              quantity={1}
              cancelPath={`/shop/${slug}`}
              className="w-full rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabledLabel="Checkout unavailable"
            >
              Buy Now
            </CheckoutButton>
          </div>
        </div>
      </div>
      <section className="mt-10">
        <PortableTextRenderer value={product.body as never} />
      </section>
    </main>
  );
}
