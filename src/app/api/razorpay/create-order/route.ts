// POST /api/razorpay/create-order
// Creates a Razorpay order server-side.
// SECURITY: RAZORPAY_KEY_SECRET is server-only — never exposed to browser.
//
// Flow:
//   Browser (checkout) → POST /api/razorpay/create-order
//   → Razorpay API creates order → returns { orderId, amount, currency, keyId }
//   → Browser opens Razorpay payment modal
//   → On success → POST /api/razorpay/verify-payment
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const Schema = z.object({
  amount:  z.number().min(1, "Amount must be at least ₹1"),
  receipt: z.string().min(1),
  notes:   z.record(z.string()).optional(),
});

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = Schema.parse(body);

    // Create Razorpay order — amount must be in paise (₹1 = 100 paise)
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // convert ₹ to paise
      currency: "INR",
      receipt,
      notes:    notes ?? {},
    });

    return NextResponse.json({
      success:   true,
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      receipt:   order.receipt,
      // Return key_id to browser (this is public — only secret stays server-side)
      keyId:     process.env.RAZORPAY_KEY_ID,
    });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid request", details: error.errors }, { status: 400 });
    }
    console.error("[Razorpay] Create order error:", error);
    return NextResponse.json({ success: false, error: "Failed to create payment order" }, { status: 500 });
  }
}
