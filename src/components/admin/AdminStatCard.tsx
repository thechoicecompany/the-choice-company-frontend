interface AdminStatCardProps {
    label: string;
    value: string | number;
    icon: string;
    sub?: string;
    color?: "navy" | "teal" | "gold" | "orange" | "green" | "red" | "purple";
    trend?: {
        value: number;
        label: string;
    };
}

const COLOR_MAP = {
    navy: {
        bg: "bg-navy/10",
        icon: "bg-navy",
        text: "text-navy",
    },
    teal: {
        bg: "bg-teal/10",
        icon: "bg-teal",
        text: "text-teal",
    },
    gold: {
        bg: "bg-gold/10",
        icon: "bg-gold",
        text: "text-amber-700",
    },
    orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-500",
        text: "text-orange-700",
    },
    green: {
        bg: "bg-green-50",
        icon: "bg-green-600",
        text: "text-green-700",
    },
    red: {
        bg: "bg-red-50",
        icon: "bg-red-500",
        text: "text-red-700",
    },
    purple: {
        bg: "bg-purple-50",
        icon: "bg-purple-600",
        text: "text-purple-700",
    },
} as const;

export default function AdminStatCard({
    label,
    value,
    icon,
    sub,
    color = "navy",
    trend,
}: AdminStatCardProps) {

    // Runtime-safe fallback
    const c = COLOR_MAP[color] ?? COLOR_MAP.navy;

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

                <div
                    className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-xl`}
                >
                    {icon}
                </div>

                {trend && (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.value >= 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                            }`}
                    >
                        {trend.value >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(trend.value)}%
                    </span>
                )}

            </div>

            <p className="text-2xl font-bold text-navy mb-0.5">
                {value}
            </p>

            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>

            {sub && (
                <p className="text-xs text-gray-400 mt-1">
                    {sub}
                </p>
            )}
        </div>
    );
}