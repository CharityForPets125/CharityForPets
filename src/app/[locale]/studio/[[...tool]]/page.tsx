import { redirect } from "next/navigation";

type StudioRedirectProps = {
    params: Promise<{ tool?: string[] }>;
};

export default async function LocaleStudioRedirectPage({ params }: StudioRedirectProps) {
    const { tool = [] } = await params;
    const suffix = tool.length ? `/${tool.join("/")}` : "";
    redirect(`/studio${suffix}`);
}
