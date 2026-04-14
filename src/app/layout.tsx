import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { SanityLive } from "@/lib/sanity/live";

export const metadata: Metadata = {
  title: "Druh šance",
  description: "Help stray animals through donations and charity shopping.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      {children}
      <SanityLive />
      {isDraftMode && <VisualEditing />}
    </>
  );
}
