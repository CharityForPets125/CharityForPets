import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signInWithGoogleAction, signUpAction } from "@/app/auth/actions";

export default function Page() {
    const supabase = createSupabaseServerClient();

    const { data: { user } } = supabase.auth.getUser();

    if (user) {
        return redirect("/");
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account?{" "}
                <Link href="/login">Login</Link>
            </p>
        </div>
    );
}
