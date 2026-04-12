import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getResendClient } from "@/lib/resend";
import { env } from "@/env";
import { checkRateLimit } from "@/lib/security/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, "contact", { windowMs: 60_000, maxRequests: 5 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, message } = parsed.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const safeSubjectName = name.replace(/[\r\n]+/g, " ");

    // Check if Resend is configured
    if (!env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Contact form submission ignored.");
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }

    const resend = getResendClient();

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["contact@charityapp.com"],
      subject: `New contact form message from ${safeSubjectName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
