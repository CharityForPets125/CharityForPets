import { fetchSanity } from "@/lib/sanity/client";
import { PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries";

import { PortableTextRenderer } from "@/components/sanity/portable-text";

type ContactPageDoc = {
    title?: string;
    body?: unknown[];
};

export default async function ContactPage() {
    const page = await fetchSanity<ContactPageDoc | null>(PAGE_BY_SLUG_QUERY, { slug: "contact" }, null);

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{page?.title || "Contact"}</h1>
            <section className="mt-8">
                <PortableTextRenderer value={page?.body as never} />
            </section>
        </main>
    );
}
// ...existing code from src/app/contact/page.tsx...
