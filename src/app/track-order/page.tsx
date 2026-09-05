"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils/formatCurrency";

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus =
    | "PENDING" | "PAYMENT_PENDING" | "PAID" | "PROCESSING"
    | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

interface TrackingResult {
    orderId: string;
    customerName: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    city: string;
    state: string;
    pincode: string;
    trackingNumber: string;
    courierName: string;
    items: Array<{ name: string; quantity: number }>;
    total: number;
    itemCount: number;
}

const STATUS_STEPS: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_CONFIG: Record<OrderStatus, {
    label: string; desc: string; color: string; bg: string; icon: string;
}> = {
    PENDING: { label: "Pending", desc: "Order is being prepared", color: "text-gray-600", bg: "bg-gray-100", icon: "🕐" },
    PAYMENT_PENDING: { label: "Awaiting Payment", desc: "Payment not yet confirmed", color: "text-yellow-700", bg: "bg-yellow-100", icon: "💳" },
    PAID: { label: "Order Confirmed", desc: "Payment received, order confirmed", color: "text-blue-700", bg: "bg-blue-50", icon: "✅" },
    PROCESSING: { label: "Processing", desc: "Your sample is being prepared", color: "text-purple-700", bg: "bg-purple-50", icon: "🏭" },
    SHIPPED: { label: "Shipped", desc: "Your order is on the way", color: "text-orange-700", bg: "bg-orange-50", icon: "🚚" },
    DELIVERED: { label: "Delivered", desc: "Your order has been delivered", color: "text-green-700", bg: "bg-green-50", icon: "📦" },
    CANCELLED: { label: "Cancelled", desc: "This order has been cancelled", color: "text-red-700", bg: "bg-red-50", icon: "❌" },
    REFUNDED: { label: "Refunded", desc: "Refund has been initiated", color: "text-pink-700", bg: "bg-pink-50", icon: "↩️" },
};

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<TrackingResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0); // NEW
    const resultRef = useRef<HTMLDivElement>(null);

    // NEW: countdown ticker
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim() || !email.trim() || cooldown > 0) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const params = new URLSearchParams({
                orderId: orderId.trim(),
                email: email.trim(),
            });
            const res = await fetch(`${BACKEND}/api/orders/track?${params}`);

            // NEW: detect 429 distinctly, before the generic !res.ok branch
            if (res.status === 429) {
                const retryAfter = Number(res.headers.get("Retry-After") ?? "60");
                setCooldown(retryAfter);
                setError(`Too many attempts. Please wait ${retryAfter}s before trying again.`);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                setError("No order found with this ID and email. Please check and try again.");
                return;
            }

            setResult(data.data);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const sc = result ? STATUS_CONFIG[result.status] : null;
    const stepIndex = result ? STATUS_STEPS.indexOf(result.status) : -1;
    const disabled = loading || cooldown > 0; // NEW

    return (
        <div className="min-h-screen section-py" style={{ background: "var(--cream)" }}>
            <div className="container-site max-w-2xl mx-auto px-4">

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "var(--navy)" }}>
                        <span className="text-3xl">📦</span>
                    </div>
                    <h1 className="font-playfair text-3xl font-bold text-navy mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Enter your order ID and email address to get live status updates.
                    </p>
                </div>

                <div className="card p-6 mb-6">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Order ID *</label>
                            <input
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                placeholder="e.g. TCC-DEMO-2026-AB1234"
                                className="font-mono"
                                disabled={disabled}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Found in your confirmation email
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="The email used when ordering"
                                disabled={disabled}
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                <span>⚠️</span>
                                <span>{error}{cooldown > 0 && ` (${cooldown}s)`}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={disabled}
                            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
                            style={{ background: "var(--navy)" }}
                        >
                            {loading
                                ? <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Tracking…
                                </span>
                                : cooldown > 0
                                    ? `Try again in ${cooldown}s`
                                    : "🔍 Track Order"
                            }
                        </button>
                    </form>
                </div>

                {/* ── Result section unchanged below — omitted here for brevity, keep exactly as you have it ── */}

                {result && sc && (
                    <div ref={resultRef} className="space-y-4 animate-fade-up">

                        {/* Status hero */}
                        <div className={`card p-6 border-2 ${sc.bg}`} style={{ borderColor: "transparent" }}>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{sc.icon}</div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                                        Current Status
                                    </p>
                                    <h2 className={`text-xl font-bold ${sc.color}`}>{sc.label}</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">{sc.desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress bar — only for main flow */}
                        {stepIndex >= 0 && (
                            <div className="card p-5">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
                                    Order Journey
                                </h3>
                                <div className="flex items-start">
                                    {STATUS_STEPS.map((step, i) => {
                                        const done = i <= stepIndex;
                                        const current = i === stepIndex;
                                        const s = STATUS_CONFIG[step];
                                        return (
                                            <div key={step} className="flex items-start flex-1 last:flex-none">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                        ${done ? "text-white" : "bg-gray-100 text-gray-400"}
                                        ${current ? "ring-4 ring-navy/20" : ""}`}
                                                        style={done ? { background: "var(--navy)" } : {}}>
                                                        {done ? (current ? s.icon : "✓") : i + 1}
                                                    </div>
                                                    <span className={`text-[10px] mt-2 font-medium text-center leading-tight max-w-[60px]
                                        ${done ? "text-navy" : "text-gray-400"}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                                {i < STATUS_STEPS.length - 1 && (
                                                    <div className={`flex-1 h-0.5 mt-4 mx-1 transition-all
                                        ${i < stepIndex ? "bg-navy" : "bg-gray-200"}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tracking info — show only if shipped */}
                        {result.trackingNumber && (
                            <div className="card p-5 border border-orange-200 bg-orange-50">
                                <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                    <span>🚚</span> Shipping Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-orange-700">Tracking Number</span>
                                        <span className="font-mono font-bold text-orange-900">{result.trackingNumber}</span>
                                    </div>
                                    {result.courierName && (
                                        <div className="flex justify-between">
                                            <span className="text-orange-700">Courier Partner</span>
                                            <span className="font-semibold text-orange-900">{result.courierName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order summary */}
                        <div className="card p-5">
                            <h3 className="font-semibold text-navy mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                {result.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">📦</span>
                                            <span className="text-gray-700">{item.name}</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Order ID</span>
                                    <span className="font-mono text-xs text-navy font-semibold">{result.orderId}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Ordered on</span>
                                    <span>{new Date(result.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit", month: "long", year: "numeric"
                                    })}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Last updated</span>
                                    <span>{new Date(result.updatedAt).toLocaleDateString("en-IN", {
                                        day: "2-digit", month: "long", year: "numeric"
                                    })}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery to</span>
                                    <span>{result.city}, {result.state}</span>
                                </div>
                                <div className="flex justify-between font-bold text-navy border-t border-gray-200 pt-2 text-base">
                                    <span>Total Paid</span>
                                    <span style={{ color: "var(--gold)" }}>{formatINR(result.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="card p-5 text-center">
                            <p className="text-sm text-gray-500 mb-3">Need help with your order?</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <a
                                    href={`https://wa.me/916268899194?text=Hi! My order ID is ${result.orderId}. I need help.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                    style={{ background: "#25D366" }}
                                >
                                    💬 WhatsApp Support
                                </a>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    📧 Contact Us
                                </Link>
                            </div>
                        </div>

                        {/* Track another */}
                        <div className="text-center pb-4">
                            <button
                                onClick={() => { setResult(null); setOrderId(""); setEmail(""); }}
                                className="text-sm text-gray-400 hover:text-navy transition-colors"
                            >
                                ← Track a different order
                            </button>
                        </div>

                    </div>
                )}


            </div>
        </div>
    );
}