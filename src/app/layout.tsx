import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Charity",
  description: "Help stray animals through donations and charity shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
