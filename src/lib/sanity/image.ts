import { createImageUrlBuilder } from "@sanity/image-url";

import { baseClient } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(baseClient);

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}
