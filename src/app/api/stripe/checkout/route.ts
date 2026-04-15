import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";

import { env } from "@/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureStripeCustomerForUser } from "@/lib/stripe/customer";
import { getStripeServerClient } from "@/lib/stripe/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const checkoutSchema = z.object({
  requestId: z.string().min(8).max(128).regex(/^[a-zA-Z0-9_-]+$/, "Invalid requestId").optional(),
  mode: z.enum(["payment", "subscription"]),
  priceId: z.string().regex(/^price_/, "Invalid Stripe price ID"),
  source: z.enum(["donation", "shop"]).optional(),
  quantity: z.number().int().min(1).max(99).optional(),
  successPath: z.string().optional(),
  cancelPath: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, "checkout", { windowMs: 60_000, maxRequests: 10 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many checkout attempts. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 });
    }

    const { requestId, mode, priceId, source: rawSource, quantity: rawQuantity, successPath, cancelPath } = parsed.data;
    const quantity = rawQuantity || 1;
    const source = rawSource === "donation" ? "donation" : "shop";
    const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const finalSuccessPath = successPath?.startsWith("/") ? successPath : "/success";
    const finalCancelPath = cancelPath?.startsWith("/") ? cancelPath : source === "donation" ? "/donate" : "/shop";
    const successType = source === "donation" ? "donation" : "order";

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase auth is not configured" }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeCustomerId = await ensureStripeCustomerForUser(user);
    const idempotencyKey = requestId
      ? createHash("sha256").update(`${user.id}:${requestId}`).digest("hex")
      : undefined;

    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.create(
      {
        mode,
        line_items: [{ price: priceId, quantity }],
        success_url: `${appUrl}${finalSuccessPath}?type=${successType}`,
        cancel_url: `${appUrl}${finalCancelPath}`,
        customer: stripeCustomerId ?? undefined,
        customer_email: stripeCustomerId ? undefined : user.email ?? undefined,
        metadata: {
          supabaseUserId: user.id,
          source,
          requestId: requestId ?? "",
        },
        shipping_address_collection: source === "shop" && mode === "payment" ? { allowed_countries: ["US", "CA", "GB", "IN"] } : undefined,
        automatic_tax: {
          enabled: source === "shop" && mode === "payment",
        },
        allow_promotion_codes: source === "shop",
      },
      idempotencyKey ? { idempotencyKey } : undefined,
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const isStripeError = error instanceof Error && error.message.startsWith("Stripe:");
    return NextResponse.json(
      { error: isStripeError ? "Payment service unavailable. Please try again." : "Unable to start checkout" },
      { status: 500 },
    );
  }
}
