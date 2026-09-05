import { NextRequest, NextResponse } from "next/server";

const KEY_ID     = process.env.RAZORPAY_KEY_ID!;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

if (!KEY_ID || !KEY_SECRET) {
  throw new Error("[startup] RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in env");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = body;

    // Server-side guard — amount must be a positive number
    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Razorpay requires paise (₹1 = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Public + Secret together for Basic Auth — this runs server-side only
        Authorization:
          "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        amount:   amountInPaise,
        currency: "INR",
        receipt:  receipt || `TCC-${Date.now()}`,
        notes:    notes   || {},
      }),
    });

    const data = await razorpayRes.json();

    if (!razorpayRes.ok) {
      console.error("[create-order] Razorpay API error:", data);
      return NextResponse.json(
        { success: false, error: data?.error?.description || "Order creation failed" },
        { status: razorpayRes.status }
      );
    }

    return NextResponse.json({
      success:  true,
      orderId:  data.id,       // "order_xxxxxxxxxxxx" — passed to Razorpay modal
      amount:   data.amount,   // in paise — pass as-is to modal, do NOT re-multiply
      currency: data.currency,
      keyId:    KEY_ID,        // public key — safe to send to browser
    });

  } catch (err) {
    console.error("[create-order] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}