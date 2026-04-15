import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

type Locale = "en" | "cs";

const SUPPORTED_LOCALES: Locale[] = ["en", "cs"];
const DEFAULT_LOCALE: Locale = "en";

function getLocaleFromRequest(request: NextRequest): Locale {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && (SUPPORTED_LOCALES as string[]).includes(segments[0])) {
    return segments[0] as Locale;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") || "";
  if (acceptLanguage.includes("cs")) {
    return "cs";
  }

  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/studio") ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Determine locale
  let locale: Locale;
  if (firstSegment && (SUPPORTED_LOCALES as string[]).includes(firstSegment)) {
    locale = firstSegment as Locale;
  } else {
    // Redirect to localized route
    locale = getLocaleFromRequest(request);
    const newPathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(new URL(newPathname, request.url), 307);
    response.headers.set("x-locale", locale);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);

  // Supabase auth for dashboard
  if (pathname.includes("/dashboard")) {
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|api|static|favicon|manifest|studio|success).*)",
  ],
};
