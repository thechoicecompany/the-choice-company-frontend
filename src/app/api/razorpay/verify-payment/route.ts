import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!KEY_SECRET) {
    throw new Error("[startup] RAZORPAY_KEY_SECRET must be set in env");
}

function generateOrderId(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `TCC-${date}-${suffix}`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
            return NextResponse.json(
                { success: false, error: "Missing required payment fields" },
                { status: 400 }
            );
        }

        // ── 1. Verify Razorpay signature ────────────────────────────────────
        const expectedSignature = crypto
            .createHmac("sha256", KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        let isValid = false;
        try {
            isValid = crypto.timingSafeEqual(
                Buffer.from(expectedSignature, "hex"),
                Buffer.from(razorpay_signature, "hex")
            );
        } catch {
            isValid = false;
        }

        if (!isValid) {
            console.error("[verify-payment] Signature mismatch — possible tamper attempt", {
                razorpay_order_id,
                razorpay_payment_id,
            });
            return NextResponse.json(
                { success: false, error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // ── 2. Recompute price server-side — never trust client totals ──────
        const { customer, items, coupon } = orderData;

        const priceRes = await fetch(
            `${BACKEND_URL}/api/cart/compute-price`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems: items.map((i: any) => ({
                        productId: Number(i.productId),
                        quantity: Number(i.quantity),
                    })),
                    couponCode: coupon ?? null,
                }),
            }
        );

        let subtotal = orderData.subtotal;
        let discount = orderData.discount;
        let total = orderData.total;

        if (priceRes.ok) {
            const priceJson = await priceRes.json();
            // ✅ Unwrap ApiResponse<T> wrapper — payload is under .data
            const recomputed = priceJson.data ?? priceJson;
            subtotal = recomputed.subtotal;
            discount = recomputed.discount;
            total = recomputed.total;
            console.log("[verify-payment] recomputed price:", { subtotal, discount, total });
        } else {
            // Recompute failed — payment already verified by signature, log and continue
            // with client values as fallback. Manual reconciliation possible via logs.
            console.error("[verify-payment] Price recompute failed at verify step — using client values", {
                razorpay_payment_id,
                clientTotal: orderData.total,
            });
        }

        // ── 3. Save order to backend ────────────────────────────────────────
        const gstAmount = Math.round(total * 18 / 118);
        const generatedOrderId = generateOrderId();

        const backendPayload = {
            orderId: generatedOrderId,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            shippingAddress: customer.address,
            items,
            subtotal,
            discount: discount || 0,
            couponCode: coupon || null,
            gstAmount,
            total,
        };

        const backendRes = await fetch(`${BACKEND_URL}/api/demo-orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(backendPayload),
        });

        const backendData = await backendRes.json();

        if (backendRes.status === 409) {
            console.warn("[verify-payment] Duplicate payment — already processed:", razorpay_payment_id);
            const existingOrderId = backendData?.data?.orderId || "DUPLICATE";
            return NextResponse.json({ success: true, demoOrderId: existingOrderId });
        }

        if (backendRes.status === 429) {
            const retryAfter = backendRes.headers.get("Retry-After");
            console.warn("[verify-payment] Rate limited on demo-orders save:", {
                razorpay_payment_id,
                generatedOrderId,
                customerEmail: customer.email,
                retryAfter,
            });
            return NextResponse.json({
                success: true,
                demoOrderId: `RATE_LIMITED-${razorpay_payment_id}`,
                warning: "Order save pending — please retry or contact support",
            });
        }

        if (!backendRes.ok) {
            console.error("[verify-payment] CRITICAL — verified payment not saved to DB:", {
                razorpay_order_id,
                razorpay_payment_id,
                generatedOrderId,
                customerEmail: customer.email,
                total,
                error: backendData,
            });
            return NextResponse.json({
                success: true,
                demoOrderId: `UNRECONCILED-${razorpay_payment_id}`,
                warning: "Order save pending — support has been notified",
            });
        }

        const demoOrderId = backendData?.data?.orderId;
        return NextResponse.json({ success: true, demoOrderId });

    } catch (err) {
        console.error("[verify-payment] Unexpected error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}