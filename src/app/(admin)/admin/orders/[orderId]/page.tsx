"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatINR } from "@/lib/utils/formatCurrency";
import {
    fetchAdminDemoOrder,
    updateDemoOrderStatus,
} from "@/lib/api/admin/demoOrders";
import type {
    DemoOrderDetailDto,
    DemoOrderStatus,
} from "@/lib/types/admin.types";

const STATUS_STEPS: DemoOrderStatus[] = [
    "PAYMENT_PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
];

const STATUS_CONFIG: Record<
    DemoOrderStatus,
    { label: string; color: string; bg: string }
> = {
    PAYMENT_PENDING: {
        label: "Awaiting Payment",
        color: "text-yellow-700",
        bg: "bg-yellow-100",
    },
    PAID: {
        label: "Paid",
        color: "text-blue-700",
        bg: "bg-blue-100",
    },
    PROCESSING: {
        label: "Processing",
        color: "text-purple-700",
        bg: "bg-purple-100",
    },
    SHIPPED: {
        label: "Shipped",
        color: "text-orange-700",
        bg: "bg-orange-100",
    },
    DELIVERED: {
        label: "Delivered",
        color: "text-green-700",
        bg: "bg-green-100",
    },
    CANCELLED: {
        label: "Cancelled",
        color: "text-red-700",
        bg: "bg-red-100",
    },
    REFUNDED: {
        label: "Refunded",
        color: "text-pink-700",
        bg: "bg-pink-100",
    },
};

export default function AdminOrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const [order, setOrder] = useState<DemoOrderDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [newStatus, setNewStatus] = useState<DemoOrderStatus | "">("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminDemoOrder(orderId);

                setOrder(data);
                setNewStatus(data.status);

                if (data.shippingAddress?.trackingNumber) {
                    setTrackingNumber(
                        data.shippingAddress.trackingNumber
                    );
                }

                if (data.notes) {
                    setNotes(data.notes);
                }
            } catch {
                setError("Order not found.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [orderId]);

    const handleUpdateStatus = async () => {
        if (!newStatus || !order) return;

        setUpdating(true);
        setUpdateSuccess("");
        setError("");

        try {
            const updated = await updateDemoOrderStatus(order.orderId, {
                status: newStatus,
                trackingNumber: trackingNumber || undefined,
                note: notes || undefined,
            });

            setOrder(updated);

            if (updated.shippingAddress?.trackingNumber) {
                setTrackingNumber(
                    updated.shippingAddress.trackingNumber
                );
            }

            setUpdateSuccess("Order updated successfully");

            setTimeout(() => {
                setUpdateSuccess("");
            }, 3000);
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Update failed"
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>{error || "Order not found"}</p>

                <Link
                    href="/admin/orders"
                    className="text-navy underline mt-2 inline-block"
                >
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const sc =
        STATUS_CONFIG[order.status] ??
        STATUS_CONFIG.PAYMENT_PENDING;

    const currentStepIndex = STATUS_STEPS.indexOf(order.status);

    const city = order.shippingAddress?.city;
    const state = order.shippingAddress?.state;
    const orderTrackingNumber =
        order.shippingAddress?.trackingNumber;

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Back + Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/admin/orders"
                    className="text-gray-400 hover:text-navy transition-colors text-sm"
                >
                    ← Orders
                </Link>

                <span className="text-gray-300">/</span>

                <span className="font-mono text-sm font-semibold text-navy">
                    {order.orderId}
                </span>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-navy">
                        {order.orderId}
                    </h1>

                    <p className="text-xs text-gray-400 mt-0.5">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}
                    </p>
                </div>

                <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${sc.bg} ${sc.color}`}
                >
                    {sc.label}
                </span>
            </div>

            {/* Progress */}
            {currentStepIndex >= 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
                    <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                        Order Progress
                    </h2>

                    <div className="flex items-center">
                        {STATUS_STEPS.map((step, i) => {
                            const done = i <= currentStepIndex;
                            const current = i === currentStepIndex;
                            const stepConfig = STATUS_CONFIG[step];

                            return (
                                <div
                                    key={step}
                                    className="flex items-center flex-1 last:flex-none"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done
                                                ? "bg-navy text-white"
                                                : "bg-gray-100 text-gray-400"
                                                } ${current
                                                    ? "ring-4 ring-navy/20"
                                                    : ""
                                                }`}
                                        >
                                            {done ? "✓" : i + 1}
                                        </div>

                                        <span
                                            className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${done
                                                ? "text-navy"
                                                : "text-gray-400"
                                                }`}
                                        >
                                            {stepConfig.label}
                                        </span>
                                    </div>

                                    {i < STATUS_STEPS.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStepIndex
                                                ? "bg-navy"
                                                : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Order Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="font-semibold text-navy mb-4">
                            Order Info
                        </h2>

                        <div className="space-y-3 text-sm">

                            {/* Items */}
                            {order.items?.map((item, index) => (
                                <div
                                    key={`${item.name}-${index}`}
                                    className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <span className="text-gray-500">
                                        {item.name}{" "}
                                        <span className="text-gray-400">
                                            × {item.quantity}
                                        </span>
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {formatINR(item.subtotal)}
                                    </span>
                                </div>
                            ))}

                            {/* Phone */}
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">
                                    Phone
                                </span>

                                <span className="font-medium text-gray-900">
                                    {order.customerPhone}
                                </span>
                            </div>

                            {/* Company */}
                            {order.companyName && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">
                                        Company
                                    </span>

                                    <span className="font-medium text-gray-900 text-right">
                                        {order.companyName}
                                    </span>
                                </div>
                            )}

                            {/* Location */}
                            {city && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">
                                        Location
                                    </span>

                                    <span className="font-medium text-gray-900 text-right">
                                        {city}
                                        {state ? `, ${state}` : ""}
                                    </span>
                                </div>
                            )}

                            {/* Message */}
                            {order.message && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">
                                        Message
                                    </span>

                                    <span className="font-medium text-gray-900 text-right max-w-[60%]">
                                        {order.message}
                                    </span>
                                </div>
                            )}

                            {/* Tracking Number */}
                            {orderTrackingNumber && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">
                                        Tracking No.
                                    </span>

                                    <span className="font-medium text-gray-900 text-right">
                                        {orderTrackingNumber}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">

                    {/* Customer */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="font-semibold text-navy mb-4">
                            Customer
                        </h2>

                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-gray-900">
                                {order.customerName}
                            </p>

                            <a
                                href={`mailto:${order.customerEmail}`}
                                className="text-navy hover:underline block truncate"
                            >
                                {order.customerEmail}
                            </a>

                            <a
                                href={`tel:${order.customerPhone}`}
                                className="text-gray-600 block"
                            >
                                {order.customerPhone}
                            </a>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="font-semibold text-navy mb-4">
                            Update Status
                        </h2>

                        <div className="space-y-3">

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                    Status
                                </label>

                                <select
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(
                                            e.target
                                                .value as DemoOrderStatus
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                                >
                                    {Object.entries(
                                        STATUS_CONFIG
                                    ).map(([value, { label }]) => (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tracking Number */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                    Tracking Number
                                </label>

                                <input
                                    value={trackingNumber}
                                    onChange={(e) =>
                                        setTrackingNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 1Z999AA10123456784"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                                />
                            </div>

                            {/* Internal Note */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                    Internal Note
                                </label>

                                <textarea
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    placeholder="Optional note visible only to admins"
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                                />
                            </div>

                            {/* Success */}
                            {updateSuccess && (
                                <p className="text-xs text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                                    ✓ {updateSuccess}
                                </p>
                            )}

                            {/* Error */}
                            {error && (
                                <p className="text-xs text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}

                            {/* Update Button */}
                            <button
                                onClick={handleUpdateStatus}
                                disabled={
                                    updating ||
                                    newStatus === order.status
                                }
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: "var(--navy)",
                                }}
                            >
                                {updating
                                    ? "Updating…"
                                    : "Update Order"}
                            </button>

                            {newStatus === order.status && (
                                <p className="text-xs text-center text-gray-400">
                                    Change the status above to enable update
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
