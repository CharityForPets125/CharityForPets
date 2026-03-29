import { PortableText, type PortableTextBlock } from "@portabletext/react";

type Props = {
  value: PortableTextBlock[] | undefined;
};

export function PortableTextRenderer({ value }: Props) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="prose prose-amber max-w-none">
      <PortableText value={value} />
    </div>
  );
}
