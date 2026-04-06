import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { SanityImage } from "@/components/sanity/sanity-image";
import { fetchSanity } from "@/lib/sanity/client";
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
    const { slug } = await params;
    const page = await fetchSanity<DynamicPageDoc | null>(PAGE_BY_SLUG_QUERY, { slug }, null);

    if (!page) {
        notFound();
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{page.title}</h1>
            {page.heroImage ? (
                <SanityImage image={page.heroImage} alt={page.title || "Page image"} className="mt-6 rounded-3xl object-cover" />
            ) : null}
            <section className="mt-8">
                <PortableTextRenderer value={page.body as never} />
            </section>
        </main>
    );
}
