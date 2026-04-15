import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (or an authorised caller)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, reason: "Supabase not configured" }, { status: 200 });
  }

  try {
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Lightweight ping — just checks the DB is alive
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      console.error("[keep-alive] Supabase ping failed:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log("[keep-alive] Supabase pinged successfully at", new Date().toISOString());
    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[keep-alive] Unexpected error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
