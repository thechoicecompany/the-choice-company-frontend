"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { AdminUser } from "@/lib/types/admin.types";

// ── Single source of truth for rate-limit errors ───────────────────────────────
export class RateLimitError extends Error {
    retryAfterSeconds: number;
    constructor(message: string, retryAfterSeconds: number) {
        super(message);
        this.name = "RateLimitError";
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

// ── Context shape ──────────────────────────────────────────────────────────────
// Note: `token` is intentionally absent — the httpOnly cookie carries it
// automatically on every request; components never need to read it.
interface AdminAuthContextType {
    user: AdminUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (...roles: AdminUser["role"][]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const SESSION_KEY = "tcc_admin_user";

// ── Provider ───────────────────────────────────────────────────────────────────
export function AdminAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore non-sensitive user profile from sessionStorage on mount.
    // The JWT itself lives only in the httpOnly cookie — never in JS.
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                setUser(JSON.parse(saved) as AdminUser);
            }
        } catch (err) {
            console.error("[AdminAuth] Failed to restore session:", err);
            sessionStorage.removeItem(SESSION_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────────
    const login = useCallback(async (email: string, password: string): Promise<void> => {
        let response: Response;
        try {
            response = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
        } catch {
            throw new Error("Network error — please check your connection and try again.");
        }

        // ── Rate limit ─────────────────────────────────────────────────────────
        if (response.status === 429) {
            const retryAfter = Number(response.headers.get("Retry-After") ?? "60");
            let message = "Too many login attempts. Please slow down.";
            try {
                const body = await response.json();
                message = body.message ?? message;
            } catch { /* empty body */ }
            throw new RateLimitError(message, retryAfter);
        }

        // ── Parse ──────────────────────────────────────────────────────────────
        let json: { success: boolean; message?: string; user?: AdminUser };
        try {
            json = await response.json();
        } catch {
            throw new Error(`Login failed (${response.status}).`);
        }

        if (!response.ok || !json.success || !json.user) {
            throw new Error(json.message || "Invalid email or password.");
        }

        // Only the non-sensitive user profile is stored in sessionStorage.
        // It is scoped to the tab and cleared when the tab is closed.
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(json.user));
        setUser(json.user);
    }, []);

    // ── Logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(async (): Promise<void> => {
        try {
            await fetch("/api/admin/auth/logout", { method: "POST" });
        } catch {
            // Even if the request fails, clear client state and redirect
        } finally {
            sessionStorage.removeItem(SESSION_KEY);
            setUser(null);
            window.location.href = "/admin/login";
        }
    }, []);

    // ── Role check ─────────────────────────────────────────────────────────────
    const hasRole = useCallback(
        (...roles: AdminUser["role"][]): boolean => {
            if (!user) return false;
            return roles.includes(user.role);
        },
        [user]
    );

    return (
        <AdminAuthContext.Provider
            value={{ user, isLoading, login, logout, hasRole }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useAdminAuth(): AdminAuthContextType {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth must be used inside <AdminAuthProvider>.");
    }
    return context;
}