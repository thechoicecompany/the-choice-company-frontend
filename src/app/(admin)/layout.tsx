"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/lib/hooks/useAdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

// Inner shell — reads auth context (must be inside AdminAuthProvider)
function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAdminAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isLogin = pathname === "/admin/login";

    // useEffect(() => {
    //     if (!isLoading && !user && !isLogin) {
    //         router.replace("/admin/login");
    //     }
    // }, [user, isLoading, isLogin, router]);

    //     useEffect(() => {
    //     const demoMode =
    //         process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";

    //     if (
    //         !demoMode &&
    //         !isLoading &&
    //         !user &&
    //         !isLogin
    //     ) {
    //         router.replace("/admin/login");
    //     }
    // }, [
    //     user,
    //     isLoading,
    //     isLogin,
    //     router,
    // ]);
    useEffect(() => {
        const demoMode =
            process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";

        if (
            !demoMode &&
            !isLoading &&
            !user &&
            !isLogin
        ) {
            router.replace("/admin/login");
        }
    }, [
        user,
        isLoading,
        isLogin,
        router,
    ]);
    // Login page — no sidebar
    if (isLogin) return <>{children}</>;

    // Loading skeleton
    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading admin panel…</p>
                </div>
            </div>
        );
    }

    // Main admin shell
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Content area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AdminTopbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Outer layout — wraps everything with auth provider
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
    );
}
