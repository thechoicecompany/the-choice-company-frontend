"use client";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";

const PAGE_TITLES: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/inquiries": "Inquiries",
    "/admin/products": "Products",
    "/admin/products/new": "Add New Product",
    "/admin/inventory": "Inventory",
    "/admin/catalogue": "Catalogue Requests",
};

function getTitle(pathname: string): string {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.match(/\/admin\/products\/\d+\/pricing/)) return "Manage Pricing";
    if (pathname.match(/\/admin\/products\/\d+/)) return "Edit Product";
    if (pathname.match(/\/admin\/inquiries\/\d+/)) return "Inquiry Details";
    return "Admin Panel";
}

export default function AdminTopbar() {
    const pathname = usePathname();
    const { user, logout } = useAdminAuth();
    const title = getTitle(pathname);
    const now = new Date().toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "long", year: "numeric"
    });

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0">
            {/* Left — title */}
            <div>
                <h1 className="text-lg font-bold text-navy leading-tight">{title}</h1>
                <p className="text-xs text-gray-400">{now}</p>
            </div>

            {/* Right — user + logout */}
            <div className="flex items-center gap-4">
                {/* Public site link */}
                <a href="/" target="_blank" rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
                    <span>🌐</span>
                    <span>View Site</span>
                </a>

                {/* User badge */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                        style={{ background: "linear-gradient(135deg, #0D1B2A, #1A5C4A)" }}>
                        {user?.fullName?.[0]?.toUpperCase() ?? "A"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-xs font-semibold text-navy leading-tight">{user?.fullName}</p>
                        <p className="text-[10px] text-gray-400">{user?.email}</p>
                    </div>
                </div>

                {/* Logout */}
                <button onClick={logout}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                    <span>⏻</span>
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
