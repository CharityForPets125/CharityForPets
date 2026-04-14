import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";

type Props = {
  image: unknown;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export function SanityImage({
  image,
  alt,
  className,
  priority = false,
  width = 1400,
  height = 900,
  sizes = "(max-width: 768px) 100vw, 1400px",
}: Props) {
  const src = urlFor(image).width(width).quality(80).auto("format").url();

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
