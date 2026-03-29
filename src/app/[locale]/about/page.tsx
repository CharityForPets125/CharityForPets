import { fetchSanity } from "@/lib/sanity/client";
import { PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries";

import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { SanityImage } from "@/components/sanity/sanity-image";

type AboutPageDoc = {
    title?: string;
    body?: unknown[];
    heroImage?: unknown;
};

export default async function AboutPage() {
    const page = await fetchSanity<AboutPageDoc | null>(PAGE_BY_SLUG_QUERY, { slug: "about" }, null);

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{page?.title || "About"}</h1>
            {page?.heroImage ? (
                <SanityImage image={page.heroImage} alt={page.title || "About image"} className="mt-6 rounded-3xl object-cover" />
            ) : null}
            <section className="mt-8">
                <PortableTextRenderer value={page?.body as never} />
            </section>
        </main>
    );
}
// ...existing code from src/app/about/page.tsx...
