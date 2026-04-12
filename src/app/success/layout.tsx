import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { headers } from "next/headers";
import "../globals.css";

async function detectLang(): Promise<"en" | "cs"> {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  if (localeHeader === "en" || localeHeader === "cs") {
    return localeHeader;
  }

  const acceptLanguage = headerStore.get("accept-language") ?? "";
  return acceptLanguage.includes("cs") ? "cs" : "en";
}

export default async function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await detectLang();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
