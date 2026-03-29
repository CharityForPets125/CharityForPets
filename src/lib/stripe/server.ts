import Stripe from "stripe";

import { assertEnv, env } from "@/env";

let stripe: Stripe | null = null;

export function getStripeServerClient() {
  if (!stripe) {
    assertEnv(["STRIPE_SECRET_KEY"]);
    stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });
  }

  return stripe;
}
