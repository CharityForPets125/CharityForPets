import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signOutAction } from "@/app/auth/actions";

import { getServerSession } from "@supabase/auth-helpers-nextjs";

const PAGE_TITLE = "Dashboard";

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { code } = searchParams;

    const session = await getServerSession();

    if (!session) {
        return redirect("/login");
    }

    return new Response(JSON.stringify({ message: "Hello, World!" }), {
        status: 200,
    });
};

export const POST = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { code } = searchParams;

    const session = await getServerSession();

    if (!session) {
        return redirect("/login");
    }

    return new Response(JSON.stringify({ message: "Hello, World!" }), {
        status: 200,
    });
};
