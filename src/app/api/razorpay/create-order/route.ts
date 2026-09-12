import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyRecaptcha } from "@/lib/utils/verifyRecaptcha";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItems, couponCode, recaptchaToken } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const recaptchaOk = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaOk) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const priceRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart/compute-price`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, couponCode }),
      }
    );

    if (!priceRes.ok) {
      const errBody = await priceRes.json().catch(() => ({}));
      console.error("[create-order] compute-price failed:", errBody);
      return NextResponse.json(
        { error: "Failed to compute order price" },
        { status: 400 }
      );
    }

    const priceJson = await priceRes.json();

    // ✅ Spring wraps all responses in ApiResponse<T> — actual payload is under .data
    const priceData = priceJson.data ?? priceJson;
    const { subtotal, discount, total, finalAmountPaise } = priceData;

    console.log("[create-order] computed price:", { subtotal, discount, total, finalAmountPaise });

    if (!finalAmountPaise || finalAmountPaise < 100) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: finalAmountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmountPaise,
      subtotal,
      discount,
      total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("[create-order] Unexpected error:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}