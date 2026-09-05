"use client";
// CHECKOUT PAGE — Razorpay payment integration
// Flow: Fill address → Click Pay → Razorpay modal opens → On success → verify → redirect
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/hooks/useCart";
import { formatINR } from "@/lib/utils/formatCurrency";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}
interface RazorpayOptions {
    key: string; amount: number; currency: string; name: string;
    description: string; order_id: string; image?: string;
    prefill: { name: string; email: string; contact: string };
    theme: { color: string };
    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
    modal: { ondismiss: () => void };
}
interface RazorpayInstance { open(): void; }

const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, discount, total, coupon, clearCart } = useCart();

    const gstAmt = Math.round(total * 0.18);
    const grandTotal = total + gstAmt;

    const [form, setForm] = useState({
        name: "", email: "", phone: "",
        line1: "", line2: "", city: "", state: "", pincode: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"address" | "paying" | "verifying">("address");

    const set = (k: string, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrors(p => ({ ...p, [k]: "" }));
    };

    // ── Validation ─────────────────────────────────────────────────────────────
    // Replace your validate() function entirely
    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";

        // Strip leading 0 before checking — handles both 9876500000 and 09876500000
        const normalizedPhone = form.phone.replace(/^(\+91|91|0)/, "");
        if (!/^[6-9]\d{9}$/.test(normalizedPhone)) e.phone = "Valid 10-digit mobile required (e.g. 9876500000)";

        if (!form.line1.trim()) e.line1 = "Address is required";
        if (!form.city.trim()) e.city = "City is required";
        if (!form.state) e.state = "State is required";
        if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Load Razorpay script ────────────────────────────────────────────────────
    const loadRazorpay = (): Promise<boolean> =>
        new Promise(resolve => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    // ── Main Pay Handler ────────────────────────────────────────────────────────
    const handlePay = async () => {
        if (!validate()) return;
        if (items.length === 0) { router.push("/shop"); return; }

        setLoading(true);
        setStep("paying");

        try {
            // 1. Load Razorpay SDK
            const sdkLoaded = await loadRazorpay();
            if (!sdkLoaded) throw new Error("Razorpay SDK failed to load");

            // 2. Create Razorpay order on server
            const receipt = `TCC-DEMO-${Date.now()}`;
            const orderRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: grandTotal,
                    receipt,
                    notes: { customerName: form.name, customerEmail: form.email },
                }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok || !orderData.success) throw new Error(orderData.error || "Order creation failed");

            // 3. Open Razorpay payment modal
            const razorpay = new window.Razorpay({
                key: orderData.keyId,
                amount: orderData.amount,
                currency: "INR",
                name: "The Choice Company",
                description: `Sample Purchase — ${items.length} item${items.length > 1 ? "s" : ""}`,
                order_id: orderData.orderId,
                image: "/logo.svg",
                prefill: { name: form.name, email: form.email, contact: `+91${form.phone}` },
                theme: { color: "#C89B3C" },

                handler: async (response) => {
                    setStep("verifying");
                    try {
                        // 4. Verify payment on server
                        const verifyRes = await fetch("/api/razorpay/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: items.map(i => ({
                                        productId: i.id,
                                        name: i.name,
                                        image: i.image,
                                        samplePrice: i.samplePrice,
                                        quantity: i.quantity,
                                        subtotal: i.samplePrice * i.quantity,
                                    })),
                                    customer: {
                                        name: form.name, email: form.email, phone: form.phone,
                                        address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: "India" },
                                    },
                                    subtotal, discount, total: grandTotal, coupon: coupon ?? undefined,
                                },
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyData.success) throw new Error(verifyData.error);

                        // 5. Success — clear cart and redirect
                        clearCart();
                        router.push(`/order-success?orderId=${verifyData.demoOrderId}&paymentId=${response.razorpay_payment_id}`);
                    } catch (err) {
                        console.error("Payment verification failed:", err);
                        alert("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
                        setLoading(false);
                        setStep("address");
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setStep("address");
                    },
                },
            });

            razorpay.open();

        } catch (err) {
            console.error("Checkout error:", err);
            alert("Something went wrong. Please try again.");
            setLoading(false);
            setStep("address");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center section-py text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="font-playfair text-2xl font-bold text-navy mb-3">Your cart is empty</h2>
                <Link href="/shop" className="btn-gold">← Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="section-py" style={{ background: "var(--cream)" }}>
            <div className="container-site max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-playfair text-3xl font-bold text-navy">Checkout</h1>
                    <p className="text-gray-500 text-sm mt-1">Sample purchase — secure payment via Razorpay</p>
                </div>

                {/* Payment status overlay */}
                {step === "verifying" && (
                    <div className="fixed inset-0 z-[600] bg-white/90 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold text-navy">Verifying your payment...</p>
                        <p className="text-sm text-gray-500 mt-1">Please do not close this window</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ── Left: Address Form ── */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Contact */}
                        <div className="card p-6">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">1</span>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { k: "name", label: "Full Name *", type: "text", placeholder: "Rajesh Kumar" },
                                    { k: "email", label: "Email Address *", type: "email", placeholder: "rajesh@company.com" },
                                    { k: "phone", label: "Mobile Number *", type: "tel", placeholder: "9876500000" },
                                ].map(({ k, label, type, placeholder }) => (
                                    <div key={k} className={`form-group ${k === "email" ? "md:col-span-2" : ""}`}>
                                        <label className="form-label">{label}</label>
                                        <input type={type} value={(form as Record<string, string>)[k]}
                                            onChange={e => set(k, e.target.value)} placeholder={placeholder}
                                            className={errors[k] ? "input-error" : ""} />
                                        {errors[k] && <p className="error-msg">{errors[k]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="card p-6">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">2</span>
                                Shipping Address
                            </h3>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Address Line 1 *</label>
                                    <input value={form.line1} onChange={e => set("line1", e.target.value)}
                                        placeholder="House no., Street name, Area"
                                        className={errors.line1 ? "input-error" : ""} />
                                    {errors.line1 && <p className="error-msg">{errors.line1}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address Line 2 (optional)</label>
                                    <input value={form.line2} onChange={e => set("line2", e.target.value)}
                                        placeholder="Landmark, Apartment, Suite" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">City *</label>
                                        <input value={form.city} onChange={e => set("city", e.target.value)}
                                            placeholder="Mumbai" className={errors.city ? "input-error" : ""} />
                                        {errors.city && <p className="error-msg">{errors.city}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pincode *</label>
                                        <input value={form.pincode} onChange={e => set("pincode", e.target.value)}
                                            placeholder="400001" maxLength={6} className={errors.pincode ? "input-error" : ""} />
                                        {errors.pincode && <p className="error-msg">{errors.pincode}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State *</label>
                                    <select value={form.state} onChange={e => set("state", e.target.value)}
                                        className={errors.state ? "input-error" : ""}>
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.state && <p className="error-msg">{errors.state}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div className="card p-5 border border-gold/30 bg-amber-50/40">
                            <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">3</span>
                                Payment
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-5 h-5" />
                                <span className="text-sm font-medium text-navy">Secure payment via Razorpay</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["💳 Credit / Debit Card", "🏦 Net Banking", "📱 UPI", "💰 Wallets", "🏧 EMI"].map(m => (
                                    <span key={m} className="badge-gray text-[11px]">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="lg:col-span-2">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-bold text-navy mb-4">Order Summary</h3>

                            {/* Items */}
                            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-navy truncate">{item.name}</p>
                                            <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-bold text-navy flex-shrink-0">
                                            {formatINR(item.samplePrice * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon ({coupon})</span><span>− {formatINR(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span><span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>GST (18%)</span><span>{formatINR(gstAmt)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-navy text-base border-t border-gray-200 pt-3">
                                    <span>Total</span>
                                    <span style={{ color: "var(--gold)" }}>{formatINR(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Pay button */}
                            <button onClick={handlePay} disabled={loading}
                                className="w-full mt-6 py-4 rounded-xl font-semibold text-base text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ background: loading ? "#888" : "var(--gold)" }}>
                                {loading
                                    ? <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                    : `🔒 Pay ${formatINR(grandTotal)} Securely`}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                                <span>🔒</span>
                                <span>256-bit SSL encrypted · Powered by Razorpay</span>
                            </div>

                            <div className="mt-4 text-center">
                                <Link href="/cart" className="text-xs text-gray-400 hover:text-gold transition-colors">
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
