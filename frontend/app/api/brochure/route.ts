import { NextResponse } from "next/server";
import { generateBrochureEmailHtml, sendResendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { name, email, mobile } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 422 }
      );
    }

    const cleanMobile = typeof mobile === "string" ? mobile.replace(/\D/g, "") : "";
    if (!cleanMobile || cleanMobile.length < 10 || cleanMobile.length > 15) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid mobile number." },
        { status: 422 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 422 }
      );
    }

    const recipient = process.env.RECIPIENT_EMAIL || "shuklaarpit440@gmail.com";
    const subject = ` New Brochure Request: ${name.trim()}`;
    const html = generateBrochureEmailHtml({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
    });

    const result = await sendResendEmail({
      to: recipient,
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject,
      html,
    });

    if (!result.success) {
      console.error("[API Brochure] Failed to send brochure request email:", result.error);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brochure request received successfully.",
      emailId: result.id,
    });
  } catch (error: any) {
    console.error("[API Brochure] Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
