"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getBaseUrl() {
  const fallback = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return fallback.endsWith("/") ? fallback.slice(0, -1) : fallback;
}

function encodeMessage(value: string) {
  return encodeURIComponent(value);
}

async function ensureProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    },
    { onConflict: "id" },
  );
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(`/login?error=${encodeMessage("Email and password are required")}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/login?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeMessage(error.message)}`);
  }

  await ensureProfile();

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(`/signup?error=${encodeMessage("Email and password are required")}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/signup?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const baseUrl = getBaseUrl();
  const emailRedirectTo = `${baseUrl}/auth/callback?next=/dashboard`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeMessage(error.message)}`);
  }

  if (!data.session) {
    redirect(`/login?message=${encodeMessage("Check your email to confirm your account")}`);
  }

  await ensureProfile();

  redirect("/dashboard");
}

export async function signInWithGoogleAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/login?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeMessage(error?.message ?? "Unable to start Google sign-in")}`);
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/");
  }

  await supabase.auth.signOut();
  redirect("/");
}
