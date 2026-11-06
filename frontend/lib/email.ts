/**
 * Loomstone Serverless Email Utility (Resend API)
 * Handles sending notification emails for Contact inquiries and Brochure requests.
 */

interface SendEmailOptions {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}

interface ResendSendResult {
  success: boolean;
  id?: string;
  error?: string;
  usedSender?: string;
}

/**
 * Sends an email using the Resend REST API with automatic sender fallback if a custom domain is not yet verified.
 */
export async function sendResendEmail(
  options: SendEmailOptions,
): Promise<ResendSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[Email Service] Missing RESEND_API_KEY environment variable",
    );
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const primaryFrom =
    options.from ||
    process.env.RESEND_FROM_WEBSITE ||
    process.env.RESEND_FROM_EMAIL ||
    "Loomstone <onboarding@resend.dev>";
  const fallbackFrom =
    process.env.RESEND_FROM_EMAIL || "Loomstone <onboarding@resend.dev>";

  const sendPayload = async (fromAddress: string) => {
    return fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        reply_to: options.replyTo ? [options.replyTo] : undefined,
        subject: options.subject,
        html: options.html,
      }),
    });
  };

  try {
    let response = await sendPayload(primaryFrom);
    let data = await response.json().catch(() => ({}));

    // If sending fails due to domain verification / authorization and primary is different from fallback, retry with fallback
    if (!response.ok && primaryFrom !== fallbackFrom) {
      console.warn(
        `[Email Service] Primary sender "${primaryFrom}" failed (${data?.message || response.status}). Retrying with fallback "${fallbackFrom}"...`,
      );
      response = await sendPayload(fallbackFrom);
      data = await response.json().catch(() => ({}));
      if (response.ok) {
        return { success: true, id: data.id, usedSender: fallbackFrom };
      }
    }

    if (!response.ok) {
      console.error("[Email Service] Resend API Error:", data);
      return { success: false, error: data?.message || "Failed to send email" };
    }

    return { success: true, id: data.id, usedSender: primaryFrom };
  } catch (err: any) {
    console.error("[Email Service] Network/execution error:", err);
    return {
      success: false,
      error: err?.message || "Unexpected error occurred",
    };
  }
}

/**
 * Generate Contact Form Email (simple text)
 */
export function generateContactEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  product?: string;
  requirements?: string;
  submittedAt?: string;
}): string {
  const timestamp =
    data.submittedAt ||
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    }) + " (IST)";
  const productText = data.product?.trim() || "Not specified";
  const requirementsText =
    data.requirements?.trim() || "No specific notes provided.";

  const labelStyle =
    "padding: 8px 16px 8px 0; font-size: 13px; color: #64748B; width: 90px; vertical-align: top;";
  const valueStyle = "padding: 8px 0; font-size: 15px; color: #0f172a;";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto;">

    <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #00355F;">New Contact Form Submission</h2>

    <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="${labelStyle}">Name</td>
        <td style="${valueStyle} font-weight: 600;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="${labelStyle}">Email</td>
        <td style="${valueStyle}"><a href="mailto:${escapeHtml(data.email)}" style="color: #00355F;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="${labelStyle}">Phone</td>
        <td style="${valueStyle}"><a href="tel:${escapeHtml(data.phone)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(data.phone)}</a></td>
      </tr>
      <tr>
        <td style="${labelStyle}">Product</td>
        <td style="${valueStyle}">${escapeHtml(productText)}</td>
      </tr>
    </table>

    <p style="margin: 20px 0 6px; font-size: 13px; color: #64748B;">Requirements</p>
    <div style="border-left: 3px solid #C5A880; padding: 4px 0 4px 14px; font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-wrap;">${escapeHtml(requirementsText)}</div>

    <p style="margin: 28px 0 0;">
      <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20Your%20Loomstone%20Inquiry" style="display: inline-block; background-color: #00355F; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 22px; border-radius: 6px;">Reply to ${escapeHtml(data.name)} &rarr;</a>
    </p>

    <p style="margin: 24px 0 0; font-size: 12px; color: #94A3B8;">${escapeHtml(timestamp)}</p>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate Brochure Request Email (simple text)
 */
export function generateBrochureEmailHtml(data: {
  name: string;
  email: string;
  mobile: string;
  submittedAt?: string;
}): string {
  const timestamp =
    data.submittedAt ||
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    }) + " (IST)";

  const labelStyle =
    "padding: 8px 16px 8px 0; font-size: 13px; color: #64748B; width: 90px; vertical-align: top;";
  const valueStyle = "padding: 8px 0; font-size: 15px; color: #0f172a;";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Brochure Request</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto;">

    <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #00355F;">New Brochure Request</h2>

    <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="${labelStyle}">Name</td>
        <td style="${valueStyle} font-weight: 600;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="${labelStyle}">Email</td>
        <td style="${valueStyle}"><a href="mailto:${escapeHtml(data.email)}" style="color: #00355F;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="${labelStyle}">Mobile</td>
        <td style="${valueStyle}"><a href="tel:${escapeHtml(data.mobile)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(data.mobile)}</a></td>
      </tr>
    </table>

    <p style="margin: 28px 0 0;">
      <a href="mailto:${escapeHtml(data.email)}?subject=Your%20Loomstone%20Brochure" style="display: inline-block; background-color: #00355F; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 22px; border-radius: 6px;">Send Brochure to ${escapeHtml(data.name)} &rarr;</a>
    </p>

    <p style="margin: 24px 0 0; font-size: 12px; color: #94A3B8;">${escapeHtml(timestamp)}</p>

  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
