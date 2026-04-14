import { redirect } from "next/navigation";

type StudioRedirectProps = {
    params: Promise<{ tool?: string[] }>;
};

export default async function StudioRedirectPage({ params }: StudioRedirectProps) {
    const { tool = [] } = await params;
    const suffix = tool.length ? `/${tool.join("/")}` : "";
    redirect(`/en/studio${suffix}`);
}
