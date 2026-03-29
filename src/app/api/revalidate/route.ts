import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { env } from "@/env";

export async function POST(request: Request) {
  const { secret, paths } = (await request.json()) as { secret?: string; paths?: string[] };

  if (!env.SANITY_REVALIDATE_SECRET || secret !== env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  (paths || ["/"]).forEach((path) => revalidatePath(path));

  return NextResponse.json({ ok: true, revalidated: paths || ["/"] });
}
