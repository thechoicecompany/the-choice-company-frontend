"use client";
import { useState } from "react";
import type { PricingTier } from "@/lib/types/admin.types";

interface Props {
    productId: number;
    basePrice: number;
    tiers: PricingTier[];
    onSubmit: (basePrice: number, tiers: Omit<PricingTier, "id">[]) => Promise<void>;
}

const empty = (): Omit<PricingTier, "id"> => ({
    minQty: 0, maxQty: 0, price: 0, label: "", sortOrder: 0,
});

export default function PricingTierForm({ productId, basePrice: initBase, tiers: initTiers, onSubmit }: Props) {
    const [basePrice, setBasePrice] = useState(initBase);
    const [tiers, setTiers] = useState<Omit<PricingTier, "id">[]>(
        initTiers.length > 0
            ? initTiers.map(({ id, ...rest }) => rest)
            : [empty()]
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function updateTier(i: number, field: keyof Omit<PricingTier, "id">, value: string | number) {
        setTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
    }

    function addTier() {
        setTiers(prev => [...prev, { ...empty(), sortOrder: prev.length }]);
    }

    function removeTier(i: number) {
        setTiers(prev => prev.filter((_, idx) => idx !== i));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Validate tiers
        for (const t of tiers) {
            if (t.minQty >= t.maxQty) {
                setError("Each tier's Min Qty must be less than Max Qty."); return;
            }
            if (t.price <= 0) {
                setError("All tier prices must be greater than 0."); return;
            }
        }
        setError(""); setLoading(true);
        try {
            await onSubmit(basePrice, tiers);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2500);
        } catch (err: any) {
            setError(err.message ?? "Failed to update pricing");
        } finally {
            setLoading(false);
        }
    }

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-gray-50 focus:bg-white";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Base Price */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Base Price (₹ per unit — lowest MOQ tier)
                </label>
                <input type="number" min={0} step={0.01} value={basePrice}
                    onChange={e => setBasePrice(Number(e.target.value))}
                    className="w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" required />
            </div>

            {/* Tiers table */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Pricing Tiers</p>
                    <button type="button" onClick={addTier}
                        className="text-xs font-semibold text-navy border border-navy/30 px-3 py-1.5 rounded-lg hover:bg-navy hover:text-white transition-all">
                        + Add Tier
                    </button>
                </div>

                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 mb-2 px-1">
                    <div className="col-span-2">Min Qty</div>
                    <div className="col-span-2">Max Qty</div>
                    <div className="col-span-2">Price (₹)</div>
                    <div className="col-span-4">Label</div>
                    <div className="col-span-1">Order</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="space-y-2">
                    {tiers.map((tier, i) => (
                        <div key={i}
                            className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="col-span-2">
                                <input type="number" min={0} value={tier.minQty}
                                    onChange={e => updateTier(i, "minQty", Number(e.target.value))}
                                    className={inputCls} placeholder="50" />
                            </div>
                            <div className="col-span-2">
                                <input type="number" min={0} value={tier.maxQty}
                                    onChange={e => updateTier(i, "maxQty", Number(e.target.value))}
                                    className={inputCls} placeholder="200" />
                            </div>
                            <div className="col-span-2">
                                <input type="number" min={0} step={0.01} value={tier.price}
                                    onChange={e => updateTier(i, "price", Number(e.target.value))}
                                    className={inputCls} placeholder="680" />
                            </div>
                            <div className="col-span-4">
                                <input value={tier.label} placeholder="50-200 units"
                                    onChange={e => updateTier(i, "label", e.target.value)}
                                    className={inputCls} />
                            </div>
                            <div className="col-span-1">
                                <input type="number" min={0} value={tier.sortOrder ?? i}
                                    onChange={e => updateTier(i, "sortOrder", Number(e.target.value))}
                                    className={inputCls} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button type="button" onClick={() => removeTier(i)}
                                    disabled={tiers.length === 1}
                                    className="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-30 transition-colors flex items-center justify-center text-lg">
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {tiers.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                        No tiers added yet. Click "+ Add Tier" to start.
                    </p>
                )}
            </div>

            {/* Preview */}
            {tiers.length > 0 && (
                <div className="p-4 bg-navy/5 rounded-xl">
                    <p className="text-xs font-semibold text-navy mb-2">Preview</p>
                    <div className="space-y-1">
                        {tiers.map((t, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {t.label || `${t.minQty}–${t.maxQty} units`}
                                </span>
                                <span className="font-semibold text-navy">
                                    ₹{Number(t.price).toLocaleString("en-IN")}/unit
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{error}</p>}
            {success && <p className="text-green-600 text-sm bg-green-50 rounded-xl p-3">✓ Pricing updated successfully!</p>}

            <div className="flex justify-end">
                <button type="submit" disabled={loading || tiers.length === 0}
                    className="px-8 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #0D1B2A, #1A5C4A)" }}>
                    {loading ? "Saving…" : "Update Pricing"}
                </button>
            </div>
        </form>
    );
}
