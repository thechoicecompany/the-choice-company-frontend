// POST /api/razorpay/verify-payment
// Verifies Razorpay payment signature server-side after payment success.
// CRITICAL SECURITY: Never trust client-side payment confirmation alone.
// Always verify the HMAC signature using your KEY_SECRET on the server.
//
// Flow after Razorpay modal success:
//   Browser sends { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData }
//   → We verify HMAC → save order to DB → send confirmation email → return success
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { sendOrderConfirmationEmail } from "@/lib/utils/sendOrderEmail";
import { generateDemoOrderId } from "@/lib/utils/generateRef";

const Schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  orderData: z.object({
    items:    z.array(z.any()),
    customer: z.object({
      name:  z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.object({
        line1:   z.string(),
        line2:   z.string().optional(),
        city:    z.string(),
        state:   z.string(),
        pincode: z.string(),
        country: z.string().default("India"),
      }),
    }),
    subtotal: z.number(),
    discount: z.number(),
    total:    z.number(),
    coupon:   z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = Schema.parse(body);

    // ── STEP 1: Verify HMAC signature ─────────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      console.error("[Razorpay] Signature mismatch — possible fraud attempt");
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    // ── STEP 2: Generate demo order ID ────────────────────────────────────
    const demoOrderId = generateDemoOrderId();

    // ── STEP 3: Save order to database (via Spring Boot) ──────────────────
    // In production, call your Spring Boot API to save the order
    // await springApi.post("/api/demo-orders", {
    //   ...orderData,
    //   id: demoOrderId,
    //   paymentId: razorpay_payment_id,
    //   razorpayOrderId: razorpay_order_id,
    //   status: "paid",
    // });

    // ── STEP 4: Send confirmation email ───────────────────────────────────
    await sendOrderConfirmationEmail({
      orderId:   demoOrderId,
      paymentId: razorpay_payment_id,
      customer:  orderData.customer,
      items:     orderData.items,
      total:     orderData.total,
    }).catch(err => console.error("[Email] Order confirmation failed:", err));

    return NextResponse.json({
      success:     true,
      demoOrderId,
      paymentId:   razorpay_payment_id,
      message:     "Payment verified and order confirmed",
    });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid payload", details: error.errors }, { status: 400 });
    }
    console.error("[Razorpay] Verify payment error:", error);
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 });
  }
}
