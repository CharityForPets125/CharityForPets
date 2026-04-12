import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripeServerClient } from "@/lib/stripe/server";

type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
  } | null;
};

type ProfileRow = {
  stripe_customer_id: string | null;
  full_name: string | null;
};

export async function ensureStripeCustomerForUser(user: AuthUserLike): Promise<string | null> {
  if (!user.email) {
    return null;
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_customer_id, full_name")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      console.error("Failed to fetch profile:", profileError);
      return null;
    }

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    const fullName = profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
    const stripe = getStripeServerClient();

    let customer;
    try {
      customer = await stripe.customers.create({
        email: user.email,
        name: fullName ?? undefined,
        metadata: {
          supabaseUserId: user.id,
        },
      });
    } catch (error) {
      console.error("Failed to create Stripe customer:", error);
      throw new Error(`Stripe customer creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    const { error: upsertError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        stripe_customer_id: customer.id,
      },
      { onConflict: "id" },
    );

    if (upsertError) {
      console.error("Failed to save Stripe customer ID:", upsertError);
      throw new Error(`Failed to save customer: ${upsertError.message}`);
    }

    return customer.id;
  } catch (error) {
    console.error("ensureStripeCustomerForUser error:", error);
    throw error;
  }
}

export async function syncStripeCustomerOnProfile(userId: string, customerId: string | null | undefined) {
  if (!customerId) {
    return;
  }

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("profiles").upsert(
      {
        id: userId,
        stripe_customer_id: customerId,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Failed to sync Stripe customer on profile:", error);
      throw new Error(`Failed to sync customer: ${error.message}`);
    }
  } catch (error) {
    console.error("syncStripeCustomerOnProfile error:", error);
    throw error;
  }
}
