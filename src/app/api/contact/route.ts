import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getResendClient } from "@/lib/resend";
import { env } from "@/env";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, message } = parsed.data;

    // Check if Resend is configured
    if (!env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Contact form submission ignored.");
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }

    const resend = getResendClient();

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["contact@charityapp.com"],
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
