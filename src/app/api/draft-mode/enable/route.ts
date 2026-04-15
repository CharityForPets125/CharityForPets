import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { baseClient } from "@/lib/sanity/client";
import { env } from "@/env";

export const { GET } = defineEnableDraftMode({
  client: baseClient.withConfig({
    token: env.SANITY_API_READ_TOKEN,
  }),
});
