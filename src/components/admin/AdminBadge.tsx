interface BadgeProps { value: string; }

const STATUS_COLORS: Record<string, string> = {
    // Inquiry statuses
    NEW: "bg-blue-100 text-blue-700",
    ACKNOWLEDGED: "bg-yellow-100 text-yellow-700",
    QUOTE_SENT: "bg-purple-100 text-purple-700",
    FOLLOW_UP: "bg-orange-100 text-orange-700",
    CONVERTED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-600",
    // Stock statuses
    IN_STOCK: "bg-green-100 text-green-700",
    LOW_STOCK: "bg-amber-100 text-amber-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    // Generic
    PAID: "bg-green-100 text-green-700",
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    FEATURED: "bg-gold/20 text-amber-700",
};

export default function AdminBadge({ value }: BadgeProps) {
    const cls = STATUS_COLORS[value] ?? "bg-gray-100 text-gray-600";
    const label = value.replace(/_/g, " ");
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
}
