"use client";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import type { DashboardStats } from "@/lib/types/admin.types";

const COLORS = ["#0D1B2A", "#1A5C4A", "#C89B3C", "#D4540A", "#7C3AED", "#16A34A"];

interface Props { stats: DashboardStats }
export function InquiryStatusChart({ stats }: Props) {
    const data = [
        { name: "New", value: stats.newInquiries },
        { name: "Acknowledged", value: stats.acknowledgedInquiries },
        { name: "Quote Sent", value: stats.quoteSentInquiries },
        { name: "Converted", value: stats.convertedInquiries },
        { name: "Closed", value: stats.closedInquiries },
    ].filter(d => d.value > 0);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-navy mb-1">Inquiry Pipeline</h3>
            <p className="text-xs text-gray-400 mb-5">Status breakdown — total {stats.totalInquiries}</p>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                        paddingAngle={3}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v ?? 0, "inquiries"]} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
export function InquiryTrendChart({ stats }: Props) {
    const data = [
        { name: "Today", value: stats.inquiriesToday },
        { name: "Week", value: stats.inquiriesThisWeek },
        { name: "Month", value: stats.inquiriesThisMonth },
        { name: "Total", value: stats.totalInquiries },
    ];
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-navy mb-1">Inquiry Volume</h3>
            <p className="text-xs text-gray-400 mb-5">Across time periods</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Inquiries" fill="#0D1B2A" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CatalogueMonthlyChart({ stats }: Props) {
    const data = (stats.catalogueMonthlyTrend ?? []).map(t => ({
        name: t.month,
        value: t.count,
    }));
    if (!data.length) return null;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-navy mb-1">Catalogue Downloads</h3>
            <p className="text-xs text-gray-400 mb-5">Monthly trend — last 6 months</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Downloads" fill="#1A5C4A" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopStatesChart({ stats }: Props) {
    const data = (stats.topStatesByInquiry ?? []).slice(0, 5).map(s => ({
        name: s.label,
        value: s.count,
    }));
    if (!data.length) return null;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-navy mb-1">Top States</h3>
            <p className="text-xs text-gray-400 mb-5">By inquiry volume</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#374151" }} width={90} />
                    <Tooltip />
                    <Bar dataKey="value" name="Inquiries" fill="#C89B3C" radius={[0, 6, 6, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
