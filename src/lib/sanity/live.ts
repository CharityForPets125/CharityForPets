import { defineLive } from "next-sanity/live";

import { sanityClient } from "./client";
import { env } from "@/env";

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: env.SANITY_API_READ_TOKEN,
  browserToken: env.SANITY_API_READ_TOKEN,
});
