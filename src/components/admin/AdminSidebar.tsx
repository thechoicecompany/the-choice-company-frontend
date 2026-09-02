"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { useState } from "react";

interface NavItem {
    href: string;
    label: string;
    icon: string;
    roles?: Array<"SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "CONTENT_MANAGER">;
    badge?: string;
}

const NAV: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/inquiries", label: "Inquiries", icon: "📋", roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"] },
    { href: "/admin/products", label: "Products", icon: "📦", roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
    { href: "/admin/inventory", label: "Inventory", icon: "🏭", roles: ["SUPER_ADMIN", "CONTENT_MANAGER", "SALES_MANAGER"] },
    // { href: "/admin/catalogue", label: "Catalogue Requests", icon: "📑", roles: ["SUPER_ADMIN", "SALES_MANAGER"] },
    {
        href: "/admin/contact-messages",
        label: "Contact Messages",
        icon: "💬",
        roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"]
    },
    { href: "/admin/sample-products", label: "Sample Shop", icon: "🛍️", roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
    { href: "/admin/blog", label: "Blog", icon: "📝", roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout, hasRole } = useAdminAuth();
    const [collapsed, setCollapsed] = useState(false);

    const visibleNav = NAV.filter(item =>
        !item.roles || item.roles.some(r => user?.role === r)
    );

    const isActive = (href: string) => pathname.startsWith(href);

    const roleLabel: Record<string, string> = {
        SUPER_ADMIN: "Super Admin",
        SALES_MANAGER: "Sales Manager",
        SALES_EXECUTIVE: "Sales Executive",
        CONTENT_MANAGER: "Content Manager",
    };

    return (
        <aside
            className="flex flex-col flex-shrink-0 h-full transition-all duration-300 border-r border-gray-200"
            style={{
                width: collapsed ? "72px" : "240px",
                background: "#0D1B2A",
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
                {!collapsed && (
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-base">🎁</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-xs leading-tight truncate">The Choice Co.</p>
                            <p className="text-white/40 text-[10px] truncate">Admin Panel</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-auto">
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
                {visibleNav.map(item => {
                    const active = isActive(item.href);
                    return (
                        <Link key={item.href} href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${active
                                ? "bg-gold text-white font-semibold"
                                : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}>
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            {!collapsed && (
                                <span className="text-sm truncate">{item.label}</span>
                            )}
                            {/* Active indicator dot */}
                            {active && collapsed && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="border-t border-white/10 p-3">
                {!collapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gold">
                                {user?.fullName?.[0]?.toUpperCase() ?? "A"}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
                            <p className="text-white/40 text-[10px] truncate">
                                {user?.role ? roleLabel[user.role] : ""}
                            </p>
                        </div>
                        <button onClick={logout}
                            title="Logout"
                            className="w-7 h-7 flex-shrink-0 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center justify-center text-sm">
                            ⏻
                        </button>
                    </div>
                ) : (
                    <button onClick={logout}
                        title="Logout"
                        className="w-full flex items-center justify-center py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        ⏻
                    </button>
                )}
            </div>
        </aside>
    );
}
