import { createClient } from "@sanity/client";

import { env } from "@/env";

const hasSanityConfig = Boolean(
  env.NEXT_PUBLIC_SANITY_PROJECT_ID && env.NEXT_PUBLIC_SANITY_DATASET,
);

export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-03-29",
  useCdn: true,
  token: env.SANITY_API_TOKEN,
});

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
) {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return fallback;
  }
}
