import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signInWithGoogleAction, signUpAction } from "@/app/auth/actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const supabase = await createSupabaseServerClient();
  const user = supabase
    ? (
      await supabase.auth.getUser()
    ).data.user
    : null;

  if (user) {
    redirect("/dashboard");
  }

  const query = await searchParams;

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-amber-950">Create Account</h1>
      <p className="mt-3 text-amber-900/80">Create your account to donate, shop, and watch your impact grow.</p>
      <div className="mt-8 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
        {query.error ? <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{query.error}</p> : null}
        {!supabase ? (
          <p className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
            Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your local env file.
          </p>
        ) : null}

        <form action={signUpAction} className="space-y-4">
          <label className="block text-sm font-semibold text-amber-950" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-amber-900/20 px-4 py-2.5 text-sm text-amber-950 outline-none ring-0 placeholder:text-amber-900/40 focus:border-amber-600"
            placeholder="you@example.com"
          />

          <label className="block text-sm font-semibold text-amber-950" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-amber-900/20 px-4 py-2.5 text-sm text-amber-950 outline-none ring-0 placeholder:text-amber-900/40 focus:border-amber-600"
            placeholder="At least 8 characters"
          />

          <button
            type="submit"
            disabled={!supabase}
            className="w-full rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create Account
          </button>
        </form>

        <form action={signInWithGoogleAction} className="mt-3">
          <button
            type="submit"
            disabled={!supabase}
            className="w-full rounded-full border border-amber-900/20 bg-white px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>
        </form>

        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
}
