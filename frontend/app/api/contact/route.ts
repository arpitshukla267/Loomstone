import { NextResponse } from "next/server";
import { generateContactEmailHtml, sendResendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { name, email, phone, product, requirements } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name." },
        { status: 422 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 422 }
      );
    }

    const cleanPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number." },
        { status: 422 }
      );
    }

    const recipient = process.env.RECIPIENT_EMAIL || "shuklaarpit440@gmail.com";
    const subject = `New Contact Form Submission: ${name.trim()}`;
    const html = generateContactEmailHtml({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      product: product?.trim(),
      requirements: requirements?.trim(),
    });

    const result = await sendResendEmail({
      to: recipient,
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject,
      html,
    });

    if (!result.success) {
      console.error("[API Contact] Failed to send contact email:", result.error);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      emailId: result.id,
    });
  } catch (error: any) {
    console.error("[API Contact] Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
