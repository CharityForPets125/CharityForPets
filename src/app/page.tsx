import Link from "next/link";

import { SanityImage } from "@/components/sanity/sanity-image";
import { fetchSanity } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY, PRODUCTS_QUERY } from "@/lib/sanity/queries";

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
};

type Product = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  price?: number;
};

export default async function Home() {
  const [homePage, products] = await Promise.all([
    fetchSanity<HomePageDoc | null>(HOME_PAGE_QUERY, {}, null),
    fetchSanity<Product[]>(PRODUCTS_QUERY, {}, []),
  ]);

  return (
    <main className="pb-16">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#fed7aa_0%,_transparent_35%),radial-gradient(circle_at_20%_80%,_#bbf7d0_0%,_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#fffbeb_100%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center lg:px-8 lg:py-20">
          <div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-amber-950 sm:text-5xl">
              {homePage?.heroTitle || "Add Home Hero Title in Sanity"}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-amber-900/85">
              {homePage?.heroSubtitle || "Add Home Hero Subtitle in Sanity"}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/donate" className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700">
                Donate Now
              </Link>
              <Link href="/shop" className="rounded-full border border-amber-700/20 bg-white px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100">
                Shop for a Cause
              </Link>
            </div>
          </div>
          <div>
            {homePage?.heroImage ? (
              <SanityImage
                image={homePage.heroImage}
                alt={homePage.heroTitle || "Hero"}
                className="w-full rounded-[2rem] border border-amber-900/10 object-cover shadow-lg"
                priority
              />
            ) : (
              <div className="h-[360px] rounded-[2rem] border border-amber-900/10 bg-white/80" />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-4 px-4 sm:px-6 sm:grid-cols-3 lg:px-8">
        {(homePage?.impactCounters || []).map((counter, idx) => (
          <article key={`${counter.label}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
            <p className="text-3xl font-extrabold text-amber-950">{counter.value || 0}</p>
            <p className="mt-2 text-sm text-amber-900/80">{counter.label}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-amber-900/10 bg-white p-8 shadow-sm">
          <h2 className="font-heading text-3xl font-bold text-amber-950">{homePage?.aboutTitle || "Add About Title in Sanity"}</h2>
          <p className="mt-4 text-amber-900/85">{homePage?.aboutText || "Add About Text in Sanity"}</p>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-amber-950">Featured Products</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <Link key={product._id} href={`/shop/${product.slug?.current}`} className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold text-amber-950">{product.name}</h3>
              <p className="mt-2 font-bold text-amber-700">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-amber-100 p-8">
          <h2 className="font-heading text-3xl font-bold text-amber-950">{homePage?.ctaTitle || "Add CTA Title in Sanity"}</h2>
          <p className="mt-3 text-amber-900/80">{homePage?.ctaText || "Add CTA Text in Sanity"}</p>
          <Link href="/donate" className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Make an Impact
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-amber-950">Testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(homePage?.testimonials || []).map((item, idx) => (
            <article key={`${item.author}-${idx}`} className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-amber-900/90">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-3 text-sm font-semibold text-amber-800">{item.author}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
