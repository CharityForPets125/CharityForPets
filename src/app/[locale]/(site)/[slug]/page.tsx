import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { SanityImage } from "@/components/sanity/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries";

type DynamicPageDoc = {
    title?: string;
    body?: unknown[];
    heroImage?: unknown;
};

type DynamicPageProps = {
    params: Promise<{ slug: string; locale: string }>;
};

export default async function DynamicPage({ params }: DynamicPageProps) {
    const { slug, locale } = await params;
    const { data: pageRaw } = await sanityFetch({ query: PAGE_BY_SLUG_QUERY(locale), params: { slug } });
    const page = pageRaw as DynamicPageDoc | null;

    if (!page) {
        notFound();
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">{page.title}</h1>
            {page.heroImage ? (
                <SanityImage image={page.heroImage} alt={page.title || "Page image"} className="mt-6 rounded-3xl border border-emerald-900/10 object-cover shadow-sm" sizes="(max-width: 768px) 100vw, 1024px" />
            ) : null}
            <section className="mt-8 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
                <PortableTextRenderer value={page.body} />
            </section>
        </main>
    );
}
