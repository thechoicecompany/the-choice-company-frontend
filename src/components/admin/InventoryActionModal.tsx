"use client";
import { useState } from "react";
import AdminModal from "./AdminModal";
import type { InventoryAction, InventoryResponse } from "@/lib/types/admin.types";

interface Props {
    open: boolean;
    onClose: () => void;
    inventory: InventoryResponse | null;
    onSubmit: (action: InventoryAction, qty: number, note: string, absolute?: number) => Promise<void>;
}

const ACTIONS: { value: InventoryAction; label: string; icon: string; desc: string; color: string }[] = [
    { value: "RESTOCK", label: "Restock", icon: "📦", desc: "Add units to warehouse", color: "bg-green-50 border-green-200 text-green-700" },
    { value: "ADJUSTMENT", label: "Adjustment", icon: "🔧", desc: "Set absolute stock level", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { value: "RESERVED", label: "Reserve", icon: "🔒", desc: "Lock units for pending order", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { value: "RELEASED", label: "Release", icon: "🔓", desc: "Free reserved units", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { value: "DISPATCHED", label: "Dispatched", icon: "🚚", desc: "Units shipped — reduce stock", color: "bg-orange-50 border-orange-200 text-orange-700" },
    { value: "DAMAGED", label: "Damaged", icon: "⚠️", desc: "Write off damaged / lost units", color: "bg-red-50 border-red-200 text-red-700" },
    { value: "RETURNED", label: "Returned", icon: "↩️", desc: "Customer returned units to stock", color: "bg-teal/10 border-teal/30 text-teal" },
];

export default function InventoryActionModal({ open, onClose, inventory, onSubmit }: Props) {
    const [action, setAction] = useState<InventoryAction>("RESTOCK");
    const [qty, setQty] = useState(0);
    const [absolute, setAbsolute] = useState(0);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const selected = ACTIONS.find(a => a.value === action)!;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (qty < 0) { setError("Quantity cannot be negative"); return; }
        setError(""); setLoading(true);
        try {
            await onSubmit(action, qty, note, action === "ADJUSTMENT" ? absolute : undefined);
            onClose();
            setQty(0); setNote(""); setAbsolute(0);
        } catch (err: any) {
            setError(err.message ?? "Failed to update inventory");
        } finally {
            setLoading(false);
        }
    }

    if (!inventory) return null;

    return (
        <AdminModal open={open} onClose={onClose} title="Update Inventory" width="max-w-xl">
            {/* Product info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-5">
                <img src={inventory.productImage} alt={inventory.productName}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div>
                    <p className="font-semibold text-navy text-sm">{inventory.productName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>Stock: <b className="text-navy">{inventory.stockQty}</b></span>
                        <span>Reserved: <b className="text-navy">{inventory.reservedQty}</b></span>
                        <span>Available: <b className={inventory.availableQty <= 0 ? "text-red-600" : "text-green-600"}>{inventory.availableQty}</b></span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Action selector */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Action Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {ACTIONS.map(a => (
                            <button key={a.value} type="button"
                                onClick={() => setAction(a.value)}
                                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${action === a.value
                                    ? `${a.color} border-2 font-semibold`
                                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}>
                                <span className="text-lg">{a.icon}</span>
                                <div>
                                    <p className="text-xs font-semibold">{a.label}</p>
                                    <p className="text-[10px] opacity-70 hidden sm:block">{a.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quantity */}
                {action === "ADJUSTMENT" ? (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Set Absolute Stock Level
                        </label>
                        <input type="number" min={0} value={absolute}
                            onChange={e => setAbsolute(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
                            placeholder="Enter new stock total"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity (units)
                        </label>
                        <input type="number" min={0} required value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
                            placeholder="Enter number of units"
                        />
                    </div>
                )}

                {/* Note */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Note <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
                        placeholder="e.g. Received from supplier, Festival order"
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #0D1B2A, #1A5C4A)" }}>
                        {loading ? "Updating…" : `Apply ${selected.label}`}
                    </button>
                </div>
            </form>
        </AdminModal>
    );
}
