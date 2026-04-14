import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/accessibility/skip-to-content";

export default async function SiteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const isCs = locale === "cs";

    return (
        <>
            <SkipToContent />
            <Header locale={isCs ? "cs" : "en"} />
            <div id="main-content" className="flex-1" tabIndex={-1}>{children}</div>
            <Footer locale={isCs ? "cs" : "en"} />
        </>
    );
}
