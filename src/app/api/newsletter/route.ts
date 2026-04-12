import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getResendClient } from "@/lib/resend";
import { env } from "@/env";
import { checkRateLimit } from "@/lib/security/rate-limit";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, "newsletter", { windowMs: 60_000, maxRequests: 5 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = parsed.data;

    if (!env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Newsletter subscription ignored.");
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }

    const resend = getResendClient();

    await resend.emails.send({
      from: "Newsletter <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to the Pet Charity Newsletter!",
      html: `
        <h2>Welcome to Pet Charity!</h2>
        <p>Thank you for subscribing to our newsletter. We'll keep you updated on our mission and how you can help stray animals.</p>
        <p>Best regards,<br>The Pet Charity Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
