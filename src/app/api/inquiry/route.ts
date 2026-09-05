import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { InquirySchema } from "@/lib/validations/inquiry.schema";
import { springApi, ApiError } from "@/lib/api/client";
import { sendWhatsAppAlert } from "@/lib/utils/sendWhatsApp";
import { sendAckEmail } from "@/lib/utils/sendEmail";
import { generateRef } from "@/lib/utils/generateRef";
import { verifyRecaptcha } from "@/lib/utils/verifyRecaptcha";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recaptchaOk = await verifyRecaptcha(body.recaptchaToken);
    if (!recaptchaOk) return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });

    const validated = InquirySchema.parse(body);
    const refNumber = generateRef();

    await springApi.post("/api/inquiries", { ...validated, refNumber, source: "WEBSITE_FORM" });

    Promise.allSettled([
      sendWhatsAppAlert(validated, refNumber),
      sendAckEmail(validated, refNumber),
    ]).catch(console.error);

    return NextResponse.json({ success: true, refNumber }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError)
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });

    // FIX: now this actually works, since ApiError carries status/retryAfter
    if (error instanceof ApiError) {
      const headers: Record<string, string> = {};
      if (error.retryAfter) headers["Retry-After"] = error.retryAfter;
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status ?? 502, headers }
      );
    }

    console.error("Inquiry error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}