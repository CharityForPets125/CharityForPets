"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { localizePath, normalizeLocale } from "@/lib/i18n/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RateLimitRecord = { count: number; resetAt: number };
const authRateLimitStore = new Map<string, RateLimitRecord>();

function checkAuthRateLimit(scope: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const key = `${scope}:${Date.now() % 1000000}`; // Simplified key for server actions

  // Clean up expired entries
  for (const [k, record] of authRateLimitStore.entries()) {
    if (record.resetAt <= now) authRateLimitStore.delete(k);
  }

  const existing = authRateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    authRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= maxRequests) return false;

  existing.count += 1;
  authRateLimitStore.set(key, existing);
  return true;
}

function getBaseUrl() {
  const fallback = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return fallback.endsWith("/") ? fallback.slice(0, -1) : fallback;
}

function encodeMessage(value: string) {
  return encodeURIComponent(value);
}

async function getLocaleFromRequest(): Promise<"en" | "cs"> {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-locale");
  if (headerLocale === "en" || headerLocale === "cs") {
    return headerLocale;
  }

  const referer = requestHeaders.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const segment = refererUrl.pathname.split("/").filter(Boolean)[0];
      return normalizeLocale(segment);
    } catch {
      return "en";
    }
  }

  return "en";
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
  if (!checkAuthRateLimit("signin", 10, 60_000)) {
    const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage("Too many login attempts. Please try again later.")}`);
  }

  const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage("Email and password are required")}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage(error.message)}`);
  }

  await ensureProfile();

  redirect(localizePath("/dashboard", locale));
}

export async function signUpAction(formData: FormData) {
  if (!checkAuthRateLimit("signup", 5, 60_000)) {
    const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
    redirect(`${localizePath("/signup", locale)}?error=${encodeMessage("Too many signup attempts. Please try again later.")}`);
  }

  const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(`${localizePath("/signup", locale)}?error=${encodeMessage("Email and password are required")}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`${localizePath("/signup", locale)}?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const baseUrl = getBaseUrl();
  const emailRedirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(localizePath("/dashboard", locale))}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    redirect(`${localizePath("/signup", locale)}?error=${encodeMessage(error.message)}`);
  }

  if (!data.session) {
    redirect(`${localizePath("/login", locale)}?message=${encodeMessage("Check your email to confirm your account")}`);
  }

  await ensureProfile();

  redirect(localizePath("/dashboard", locale));
}

export async function signInWithGoogleAction(formData: FormData) {
  const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage("Supabase auth is not configured")}`);
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? getBaseUrl();
  const nextPath = localizePath("/dashboard", locale);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error || !data.url) {
    redirect(`${localizePath("/login", locale)}?error=${encodeMessage(error?.message ?? "Unable to start Google sign-in")}`);
  }

  redirect(data.url);
}

export async function signOutAction(formData: FormData) {
  const locale = normalizeLocale(String(formData.get("locale") ?? "") || await getLocaleFromRequest());
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(localizePath("/", locale));
  }

  await supabase.auth.signOut();
  redirect(localizePath("/", locale));
}
