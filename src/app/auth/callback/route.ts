import { NextResponse, type NextRequest } from "next/server";

import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isSafeRelativePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const parsedLocale = normalizeLocale(next?.split("/").filter(Boolean)[0]);
  const defaultNext = localizePath("/dashboard", parsedLocale);
  const safeNext = next && isSafeRelativePath(next) ? next : defaultNext;

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        const fallbackUrl = new URL(`${localizePath("/login", parsedLocale)}?error=Supabase auth is not configured`, request.url);
        return NextResponse.redirect(fallbackUrl);
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error("OAuth code exchange failed:", exchangeError);
        const fallbackUrl = new URL(`${localizePath("/login", parsedLocale)}?error=Authentication failed`, request.url);
        return NextResponse.redirect(fallbackUrl);
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError);
        const fallbackUrl = new URL(`${localizePath("/login", parsedLocale)}?error=Authentication failed`, request.url);
        return NextResponse.redirect(fallbackUrl);
      }

      if (user) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          },
          { onConflict: "id" },
        );

        if (profileError) {
          console.error("Failed to upsert profile:", profileError);
          // Continue anyway - this is non-critical
        }
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      const fallbackUrl = new URL(`${localizePath("/login", parsedLocale)}?error=Authentication failed`, request.url);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  const redirectUrl = new URL(safeNext, request.url);
  return NextResponse.redirect(redirectUrl);
}
