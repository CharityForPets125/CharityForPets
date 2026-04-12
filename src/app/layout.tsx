import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Druh šance",
  description: "Help stray animals through donations and charity shopping.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
