import { defineLive } from "next-sanity/live";

import { baseClient } from "./client";
import { env } from "@/env";

export const { sanityFetch, SanityLive } = defineLive({
  client: baseClient,
  serverToken: env.SANITY_API_READ_TOKEN,
  browserToken: env.SANITY_API_READ_TOKEN,
});
