import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signOutAction } from "@/app/auth/actions";

type ImpactSummary = {
    donation_pets_helped: number;
    shop_pets_helped: number;
};

type Donation = {
    id: number;
    amount_cents: number;
    created_at: string;
};

type Order = {
    id: number;
    amount_cents: number;
    status: string;
    created_at: string;
};

function formatMoney(amountCents: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amountCents / 100);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value));
}

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
        redirect("/login?error=Supabase auth is not configured");
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [{ data: impact }, { data: donations }, { data: orders }] = await Promise.all([
        supabase.from("impact_summaries").select("donation_pets_helped, shop_pets_helped").eq("user_id", user.id).maybeSingle<ImpactSummary>(),
        supabase.from("donations").select("id, amount_cents, created_at").order("created_at", { ascending: false }).limit(5).returns<Donation[]>(),
        supabase.from("orders").select("id, amount_cents, status, created_at").order("created_at", { ascending: false }).limit(5).returns<Order[]>(),
    ]);

    const donationImpact = impact?.donation_pets_helped ?? 0;
    const shopImpact = impact?.shop_pets_helped ?? 0;
    const totalImpact = donationImpact + shopImpact;

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">Your Dashboard</h1>
                    <p className="mt-3 text-amber-900/80">Signed in as {user.email}</p>
                </div>
                <form action={signOutAction}>
                    <button type="submit" className="inline-flex w-full justify-center rounded-full border border-amber-900/20 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 sm:w-auto">
                        Sign Out
                    </button>
                </form>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <article className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-amber-900/70">Pets Helped (Total)</p>
                    <p className="mt-2 text-3xl font-bold text-amber-950">{totalImpact}</p>
                </article>
                <article className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-amber-900/70">From Donations</p>
                    <p className="mt-2 text-3xl font-bold text-amber-950">{donationImpact}</p>
                </article>
                <article className="rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
                    <p className="text-sm text-amber-900/70">From Shop Purchases</p>
                    <p className="mt-2 text-3xl font-bold text-amber-950">{shopImpact}</p>
                </article>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-amber-950">Recent Donations</h2>
                    <ul className="mt-4 space-y-3">
                        {(donations ?? []).map((donation) => (
                            <li key={donation.id} className="flex flex-col gap-1 rounded-2xl bg-amber-50/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-amber-900">{formatDate(donation.created_at)}</span>
                                <span className="font-semibold text-amber-950">{formatMoney(donation.amount_cents)}</span>
                            </li>
                        ))}
                        {!donations?.length ? <li className="text-sm text-amber-900/70">No donations yet.</li> : null}
                    </ul>
                </article>

                <article className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-amber-950">Recent Orders</h2>
                    <ul className="mt-4 space-y-3">
                        {(orders ?? []).map((order) => (
                            <li key={order.id} className="flex flex-col gap-2 rounded-2xl bg-amber-50/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-amber-900">{formatDate(order.created_at)}</p>
                                    <p className="text-xs uppercase tracking-wide text-amber-700/80">{order.status}</p>
                                </div>
                                <span className="font-semibold text-amber-950">{formatMoney(order.amount_cents)}</span>
                            </li>
                        ))}
                        {!orders?.length ? <li className="text-sm text-amber-900/70">No orders yet.</li> : null}
                    </ul>
                </article>
            </section>

            <div className="mt-8 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm">
                <Link href="/api/stripe/portal" className="inline-flex rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                    Open Stripe Customer Portal
                </Link>
            </div>
        </main>
    );
}
