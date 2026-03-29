import Stripe from "stripe";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { getStripeServerClient } from "@/lib/stripe/server";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing Stripe webhook signature", { status: 400 });
  }

  const stripe = getStripeServerClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: exists } = await admin
    .from("stripe_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (exists) {
    return new Response("Event already processed", { status: 200 });
  }

  await admin.from("stripe_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabaseUserId;
    const source = session.metadata?.source === "donation" ? "donation" : "shop";

    if (userId && session.amount_total) {
      if (source === "donation") {
        await admin.from("donations").insert({
          user_id: userId,
          amount_cents: session.amount_total,
          currency: session.currency || "usd",
          source: session.mode === "subscription" ? "donation_subscription" : "donation",
          stripe_session_id: session.id,
        });
      } else {
        await admin.from("orders").insert({
          user_id: userId,
          stripe_session_id: session.id,
          amount_cents: session.amount_total,
          currency: session.currency || "usd",
          status: "paid",
        });
      }

      if (session.customer_email) {
        try {
          await getResendClient().emails.send({
            from: "Pet Charity <noreply@resend.dev>",
            to: session.customer_email,
            subject: source === "donation" ? "Thank you for your donation" : "Thank you for your order",
            html:
              source === "donation"
                ? "<p>Your donation was successful. Thank you for helping more animals get care.</p>"
                : "<p>Your order was successful. Thank you for supporting stray animals through your purchase.</p>",
          });
        } catch {
          // Do not fail webhook on email delivery issues.
        }
      }
    }
  }

  return new Response("OK", { status: 200 });
}
