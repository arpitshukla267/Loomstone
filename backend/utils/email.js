export const sendOtpEmail = async (email, otp) => {
  console.log("\n");
  console.log("┌──────────────────────────────────────────────────────────────┐");
  console.log("│                  [CMS PASSWORD RESET OTP]                   │");
  console.log("├──────────────────────────────────────────────────────────────┤");
  console.log(`│  Email:       ${(email || "").padEnd(46)} │`);
  console.log(`│  OTP Code:    ${otp.padEnd(46)} │`);
  console.log("│  Valid For:   10 minutes                                     │");
  console.log("│  Status:      Ready to use in CMS Reset Form                 │");
  console.log("└──────────────────────────────────────────────────────────────┘");
  console.log("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: true, mode: "terminal_only" };
  }

  try {
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Loomstone <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: "LoomStone CMS - Your Password Reset OTP",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #0B1C30; margin-top: 0;">LoomStone CMS Password Reset</h2>
            <p style="color: #475569; font-size: 15px;">Your 6-digit verification code is:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #00355F; background-color: #f1f5f9; padding: 10px 20px; border-radius: 8px; display: inline-block;">
                ${otp}
              </span>
            </div>
            <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`[AUTH] Resend OTP email delivered to ${email} (ID: ${data.id})`);
    } else {
      console.warn("[AUTH] Resend email warning:", data);
    }
  } catch (err) {
    console.error("[AUTH] Resend sending error:", err.message);
  }

  return { success: true, mode: "terminal_and_email" };
};
