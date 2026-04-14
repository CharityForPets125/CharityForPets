import { PortableText, type PortableTextBlock } from "@portabletext/react";

type Props = {
  value: unknown;
};

function normalizePortableText(value: unknown): PortableTextBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is PortableTextBlock => {
    return typeof item === "object" && item !== null && "_type" in item;
  });
}

export function PortableTextRenderer({ value }: Props) {
  const normalizedValue = normalizePortableText(value);

  if (!normalizedValue.length) {
    return null;
  }

  return (
    <div className="prose prose-emerald prose-sm max-w-none break-words sm:prose-base">
      <PortableText value={normalizedValue} />
    </div>
  );
}
