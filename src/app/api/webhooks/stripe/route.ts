import Stripe from "stripe";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { syncStripeCustomerOnProfile } from "@/lib/stripe/customer";
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

  try {
    const { error: insertErr } = await admin.from("stripe_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });

    if (insertErr) {
      console.error("Failed to insert stripe event:", insertErr);
      return new Response(`Failed to record event: ${insertErr.message}`, { status: 500 });
    }
  } catch (error) {
    console.error("Error recording stripe event:", error);
    return new Response(`Error recording event: ${(error as Error).message}`, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabaseUserId;
      const source = session.metadata?.source === "donation" ? "donation" : "shop";

      if (userId && typeof session.customer === "string") {
        try {
          await syncStripeCustomerOnProfile(userId, session.customer);
        } catch (error) {
          console.error("Failed to sync Stripe customer:", error);
          // Continue processing even if customer sync fails
        }
      }

      if (userId && session.amount_total) {
        const sourceType = source === "donation" ? "donations" : "orders";
        const insertData =
          source === "donation"
            ? {
                user_id: userId,
                amount_cents: session.amount_total,
                currency: session.currency || "usd",
                source: session.mode === "subscription" ? "donation_subscription" : "donation",
                stripe_session_id: session.id,
              }
            : {
                user_id: userId,
                stripe_session_id: session.id,
                amount_cents: session.amount_total,
                currency: session.currency || "usd",
                status: "paid",
              };

        const { error: insertError } = await admin.from(sourceType).insert(insertData);

        if (insertError) {
          console.error(`Failed to insert ${sourceType}:`, insertError);
          return new Response(`Failed to record ${source}: ${insertError.message}`, { status: 500 });
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
          } catch (error) {
            console.error("Failed to send receipt email:", error);
            // Do not fail webhook on email delivery issues
          }
        }
      }
    } catch (error) {
      console.error("Error processing checkout.session.completed event:", error);
      return new Response(`Error processing event: ${(error as Error).message}`, { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
