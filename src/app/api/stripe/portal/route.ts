import { NextResponse } from "next/server";

import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureStripeCustomerForUser } from "@/lib/stripe/customer";
import { getStripeServerClient } from "@/lib/stripe/server";

function getLocaleFromRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const queryLocale = requestUrl.searchParams.get("locale");
  if (queryLocale === "en" || queryLocale === "cs") {
    return queryLocale;
  }

  const headerLocale = request.headers.get("x-locale");
  if (headerLocale === "en" || headerLocale === "cs") {
    return headerLocale;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      return normalizeLocale(url.pathname.split("/").filter(Boolean)[0]);
    } catch {
      return "en";
    }
  }

  return "en";
}

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL(`${localizePath("/login", locale)}?error=Supabase auth is not configured`, appUrl));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(localizePath("/login", locale), appUrl));
  }

  let stripeCustomerId: string | null = null;
  try {
    stripeCustomerId = await ensureStripeCustomerForUser(user);
  } catch {
    return NextResponse.redirect(new URL(`${localizePath("/dashboard", locale)}?error=Unable to open Stripe portal`, appUrl));
  }

  if (!stripeCustomerId) {
    return NextResponse.redirect(new URL(`${localizePath("/dashboard", locale)}?error=No email on your account for Stripe portal`, appUrl));
  }

  try {
    const stripe = getStripeServerClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${appUrl}${localizePath("/dashboard", locale)}`,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.redirect(new URL(`${localizePath("/dashboard", locale)}?error=Failed to open Stripe portal`, appUrl));
  }
}
