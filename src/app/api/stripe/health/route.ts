import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/stripe/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const rateLimit = checkRateLimit(request, "stripe-health", { windowMs: 60_000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase auth is not configured" }, { status: 503 });
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
  }

  try {
    const stripe = getStripeServerClient();
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      connected: true,
      accountId: account.id,
      country: account.country,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Stripe connection check failed",
      },
      { status: 500 },
    );
  }
}
