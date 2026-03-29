import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/stripe/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mode: "payment" | "subscription";
    priceId: string;
    source?: "donation" | "shop";
    quantity?: number;
    successPath?: string;
    cancelPath?: string;
  };

  if (!body.priceId || !body.mode) {
    return NextResponse.json({ error: "Missing priceId or mode" }, { status: 400 });
  }

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

  const source = body.source === "donation" ? "donation" : "shop";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const successPath = body.successPath?.startsWith("/") ? body.successPath : "/dashboard";
  const cancelPath = body.cancelPath?.startsWith("/") ? body.cancelPath : source === "donation" ? "/donate" : "/shop";

  const stripe = getStripeServerClient();
  const session = await stripe.checkout.sessions.create({
    mode: body.mode,
    line_items: [{ price: body.priceId, quantity: body.quantity ?? 1 }],
    success_url: `${appUrl}${successPath}`,
    cancel_url: `${appUrl}${cancelPath}`,
    customer_email: user.email,
    metadata: {
      supabaseUserId: user.id,
      source,
    },
    shipping_address_collection: source === "shop" && body.mode === "payment" ? { allowed_countries: ["US", "CA", "GB", "IN"] } : undefined,
    automatic_tax: {
      enabled: source === "shop" && body.mode === "payment",
    },
  });

  return NextResponse.json({ url: session.url });
}
