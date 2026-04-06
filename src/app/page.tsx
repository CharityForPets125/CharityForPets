import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export default async function RootPage() {
  // Determine locale from cookie or browser language
  let locale = "en";

  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale === "en" || cookieLocale === "cs") {
      locale = cookieLocale;
    } else {
      const headerList = await headers();
      const acceptLanguage = headerList.get("accept-language") || "";
      if (acceptLanguage.includes("cs")) {
        locale = "cs";
      }
    }
  } catch {
    // fallback to en
  }

  redirect(`/${locale}`);
}
