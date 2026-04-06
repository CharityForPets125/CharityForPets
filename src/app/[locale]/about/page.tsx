import { fetchSanity } from "@/lib/sanity/client";
import { PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { getString, type Locale } from "@/lib/i18n/strings";

import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { SanityImage } from "@/components/sanity/sanity-image";

type AboutPageDoc = {
    title?: string;
    body?: unknown[];
    heroImage?: unknown;
};

type AboutPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
    const { locale } = await params;
    const t = (path: string, defaultValue = "") => getString(locale as Locale, path, defaultValue);

    const page = await fetchSanity<AboutPageDoc | null>(PAGE_BY_SLUG_QUERY, { slug: "about" }, null);

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">{page?.title || t("about.defaultTitle")}</h1>
            {page?.heroImage ? (
                <SanityImage image={page.heroImage} alt={page.title || t("about.aboutImage")} className="mt-6 rounded-3xl object-cover" />
            ) : null}
            <section className="mt-8">
                <PortableTextRenderer value={page?.body as never} />
            </section>
        </main>
    );
}
