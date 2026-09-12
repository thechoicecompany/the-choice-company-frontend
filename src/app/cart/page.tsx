"use client";
// CART PAGE — client component (cart state from localStorage)
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { formatINR } from "@/lib/utils/formatCurrency";

export default function CartPage() {
    const { items, itemCount, subtotal, discount, coupon, total,
        removeItem, updateQty, clearCart, applyCoupon, removeCoupon } = useCart();
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponError("");
        const ok = await applyCoupon(couponInput.trim());
        if (!ok) setCouponError("Invalid coupon code. Try SAMPLE10, FIRST15, or TCC20");
        setCouponLoading(false);
    };

    if (itemCount === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center section-py text-center px-4">
                <div className="text-7xl mb-6">🛒</div>
                <h1 className="font-playfair text-3xl font-bold text-navy mb-3">Your cart is empty</h1>
                <p className="text-gray-500 text-sm mb-8 max-w-sm">
                    Add sample products to your cart to evaluate quality before placing a bulk order.
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                    <Link href="/shop" className="btn-gold btn-lg">🛍 Browse Sample Products</Link>
                    <Link href="/bulk-orders#inquiry-form" className="btn-outline-navy btn-lg">📋 Go Straight to Bulk Order</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section-py" style={{ background: "var(--cream)" }}>
            <div className="container-site">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="font-playfair text-3xl font-bold text-navy">Your Sample Cart</h1>
                        <p className="text-gray-500 text-sm mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""} · Sample purchase only</p>
                    </div>
                    <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 hover:underline">
                        🗑 Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="card p-5 flex gap-4 items-start">
                                {/* Image */}
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-navy text-sm">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                                            <span className="badge-gold text-[10px] mt-1 inline-block">Sample Unit</span>
                                        </div>
                                        <button onClick={() => removeItem(item.id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1">
                                            ✕
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                                        {/* Qty control */}
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-gold transition-colors disabled:opacity-30">
                                                −
                                            </button>
                                            <span className="text-sm font-semibold text-navy w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.maxSampleQty}
                                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-gold transition-colors disabled:opacity-30">
                                                +
                                            </button>
                                            <span className="text-xs text-gray-400">(max {item.maxSampleQty})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-navy">{formatINR(item.samplePrice * item.quantity)}</div>
                                            <div className="text-xs text-gray-400">{formatINR(item.samplePrice)}/unit</div>
                                        </div>
                                    </div>

                                    {/* Bulk upsell hint */}
                                    <div className="mt-3 px-3 py-2 rounded-lg bg-teal/5 border border-teal/20 flex items-center gap-2">
                                        <span className="text-xs text-teal">📦</span>
                                        <span className="text-xs text-teal">
                                            Bulk price: <strong>{formatINR(item.moq * item.bulkPrice)}</strong> — order {item.moq}+ units for best rates
                                        </span>
                                        <Link href="/bulk-orders#inquiry-form" className="text-xs text-teal font-semibold ml-auto hover:underline">
                                            Get Quote →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <div className="text-center pt-2">
                            <Link href="/shop" className="text-sm text-gold hover:underline font-medium">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    <div>
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-bold text-navy text-base mb-5">Order Summary</h3>

                            {/* Coupon */}
                            <div className="mb-5">
                                <label className="form-label">Coupon Code</label>
                                {coupon ? (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                                        <span className="text-xs font-bold text-green-700 flex-1">✓ {coupon} applied!</span>
                                        <button onClick={removeCoupon} className="text-xs text-red-400 hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-2 mt-1">
                                            <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                                                placeholder="Enter coupon code" className="flex-1 text-sm"
                                                onKeyDown={e => e.key === "Enter" && handleApplyCoupon()} />
                                            <button onClick={handleApplyCoupon} disabled={couponLoading}
                                                className="btn-sm btn-outline-navy flex-shrink-0 disabled:opacity-50">
                                                {couponLoading ? "..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                                        <p className="text-[11px] text-gray-400 mt-1">Try: SAMPLE10, FIRST15, TCC20</p>
                                    </>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>{formatINR(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Coupon discount</span>
                                        <span>− {formatINR(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>GST (18%)</span>
                                    <span>{formatINR(Math.round(total * 0.18))}</span>
                                </div>
                                <div className="flex justify-between font-bold text-navy text-base border-t border-gray-200 pt-3">
                                    <span>Total (incl. GST)</span>
                                    <span style={{ color: "var(--gold)" }}>
                                        {formatINR(Math.round(total * 1.18))}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <Link href="/checkout" className="btn-gold w-full text-center mt-6 py-3.5 text-base font-semibold block">
                                Proceed to Checkout →
                            </Link>

                            {/* Trust signals */}
                            <div className="mt-4 space-y-2">
                                {["🔒 Secure payment via Razorpay", "🚚 Free shipping on all sample orders", "↩ Easy returns within 7 days", "📞 24/7 support at +91 62688 99194"].map(t => (
                                    <div key={t} className="text-[11px] text-gray-400 flex items-center gap-1">{t}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
