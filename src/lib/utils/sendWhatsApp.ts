import type { InquiryFormData } from "@/lib/validations/inquiry.schema";

// Sends WhatsApp notification to sales team via Meta Cloud API.
// Called server-side only — from /api/inquiry Route Handler.
export async function sendWhatsAppAlert(
  inquiry:   InquiryFormData,
  refNumber: string
): Promise<void> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const salesNo = process.env.SALES_WHATSAPP_NUMBER;

  if (!token || !phoneId || !salesNo) {
    console.warn("[WhatsApp] Credentials not configured — skipping alert");
    return;
  }

  const message = [
    `🎁 *New Inquiry — ${refNumber}*`,
    ``,
    `*Company:*   ${inquiry.companyName}`,
    `*Contact:*   ${inquiry.contactPerson} (${inquiry.designation || "N/A"})`,
    `*Mobile:*    ${inquiry.mobile}`,
    `*Email:*     ${inquiry.email}`,
    `*Category:*  ${inquiry.productCategory}`,
    `*Quantity:*  ${inquiry.quantityRequired} units`,
    `*Budget:*    ${inquiry.budgetRange}`,
    `*Location:*  ${inquiry.city}, ${inquiry.state}`,
    `*Branding:*  ${inquiry.brandingRequired ? "Yes" : "No"}`,
    ``,
    `Reply here to follow up immediately.`,
  ].join("\n");

  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  const response = await fetch(url, {
    method:  "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to:                salesNo,
      type:              "text",
      text:              { body: message },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[WhatsApp] Failed to send alert:", err);
  }
}
