import type { InquiryFormData } from "@/lib/validations/inquiry.schema";

// Sends auto-acknowledgement email to customer via SMTP / AWS SES.
// Called server-side only — from /api/inquiry Route Handler.
export async function sendAckEmail(
  inquiry: InquiryFormData,
  refNumber: string
): Promise<void> {
  // Dynamic import of nodemailer — only available server-side
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
      <div style="background: #0D1B2A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #C89B3C; margin: 0; font-size: 22px;">The Choice Company</h1>
        <p style="color: #fff; opacity: 0.7; margin: 4px 0 0; font-size: 12px;">Making Every Gift Memorable</p>
      </div>
      <div style="padding: 28px 24px; background: #fff;">
        <h2 style="color: #0D1B2A; margin-top: 0;">Inquiry Received! 🎁</h2>
        <p style="color: #555;">Dear <strong>${inquiry.contactPerson}</strong>,</p>
        <p style="color: #555;">Thank you for reaching out to The Choice Company. We've received your bulk gifting inquiry and our team will respond within <strong>24 hours</strong>.</p>

        <div style="background: #F9F7F3; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #C89B3C;">
          <p style="margin: 0; font-size: 13px; color: #555;">Your Inquiry Reference Number:</p>
          <h3 style="margin: 8px 0 0; color: #0D1B2A; font-size: 24px;">${refNumber}</h3>
        </div>

        <h4 style="color: #0D1B2A;">Inquiry Summary:</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${[
      ["Company", inquiry.companyName],
      ["Category", inquiry.productCategory],
      ["Quantity", `${inquiry.quantityRequired} units`],
      ["Budget", inquiry.budgetRange],
      ["Location", `${inquiry.city}, ${inquiry.state}`],
    ].map(([k, v]) => `
            <tr>
              <td style="padding: 6px 8px; color: #888; width: 35%;">${k}</td>
              <td style="padding: 6px 8px; color: #333; font-weight: bold;">${v}</td>
            </tr>
          `).join("")}
        </table>

        <h4 style="color: #0D1B2A; margin-top: 20px;">What Happens Next?</h4>
        <ol style="color: #555; font-size: 13px; line-height: 1.8;">
          <li>Our team reviews your requirement (within 2 hours)</li>
          <li>We send you a detailed quotation (within 24 hours)</li>
          <li>Sample discussion and approval</li>
          <li>Production begins on your confirmation</li>
          <li>Pan-India delivery to your doorstep</li>
        </ol>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://wa.me/917067110100?text=Hi! My inquiry ref is ${refNumber}."
             style="background: #25D366; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            💬 Follow Up on WhatsApp
          </a>
        </div>

        <p style="color: #888; font-size: 12px; margin-top: 28px; text-align: center;">
          Questions? Call us at <a href="tel:+917067110100" style="color: #C89B3C;">+91 81090 00100</a>
          or email <a href="mailto:info@thechoicecompany.in" style="color: #C89B3C;">info@thechoicecompany.in</a>
        </p>
      </div>
      <div style="background: #0D1B2A; padding: 12px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: #fff; opacity: 0.4; margin: 0; font-size: 11px;">
          © ${new Date().getFullYear()} The Choice Company. Indore, Madhya Pradesh, India.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Choice Company" <${process.env.EMAIL_FROM}>`,
    to: inquiry.email,
    cc: process.env.EMAIL_SALES,
    subject: `Inquiry Received — ${refNumber} | The Choice Company`,
    html,
  });
}
