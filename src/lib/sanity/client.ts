import { createClient } from "@sanity/client";

import { env } from "@/env";

const hasSanityConfig = Boolean(
  env.NEXT_PUBLIC_SANITY_PROJECT_ID && env.NEXT_PUBLIC_SANITY_DATASET,
);

export const baseClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-03-29",
  useCdn: true,
  token: env.SANITY_API_TOKEN,
});

export function sanityClient({ stega }: { stega?: boolean } = {}) {
  return baseClient.withConfig({
    stega: stega
      ? {
          enabled: true,
          studioUrl: "/en/studio",
        }
      : { enabled: false },
  });
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
) {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    return await baseClient.fetch<T>(query, params);
  } catch (error) {
    console.error("Sanity query failed:", { query, error: error instanceof Error ? error.message : String(error) });
    return fallback;
  }
}
