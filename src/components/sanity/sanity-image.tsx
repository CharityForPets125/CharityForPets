import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";

type Props = {
  image: unknown;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function SanityImage({ image, alt, className, priority = false }: Props) {
  const src = urlFor(image).width(1400).quality(80).auto("format").url();

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1400}
      height={900}
      priority={priority}
      className={className}
    />
  );
}
