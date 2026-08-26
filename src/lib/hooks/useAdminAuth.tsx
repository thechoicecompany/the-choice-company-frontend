"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { AdminUser } from "@/lib/types/admin.types";

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        expiresIn: number;
        user: AdminUser;
    };
}

interface AdminAuthContextType {
    user: AdminUser | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    hasRole: (...roles: AdminUser["role"][]) => boolean;
}

const AdminAuthContext =
    createContext<AdminAuthContextType | null>(null);

/**
 * Cookie used by Next.js middleware.
 */
function setAuthCookie(
    token: string,
    expiresInSeconds: number = 86400
) {
    const expires = new Date(
        Date.now() + expiresInSeconds * 1000
    ).toUTCString();

    document.cookie =
        `tcc_admin_token=${encodeURIComponent(token)}; ` +
        `expires=${expires}; ` +
        `path=/; ` +
        `SameSite=Lax`;
}

function deleteAuthCookie() {
    document.cookie =
        "tcc_admin_token=; " +
        "expires=Thu, 01 Jan 1970 00:00:00 GMT; " +
        "path=/";
}

export function AdminAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] =
        useState<AdminUser | null>(null);

    const [token, setToken] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    /**
     * Restore existing backend JWT session.
     */
    useEffect(() => {
        try {
            const savedToken =
                localStorage.getItem("tcc_admin_token");

            const savedUser =
                localStorage.getItem("tcc_admin_user");

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error(
                "Failed to restore admin session:",
                error
            );

            localStorage.removeItem("tcc_admin_token");
            localStorage.removeItem("tcc_admin_user");

            deleteAuthCookie();
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Login against Spring Boot backend.
     */
    const login = useCallback(
        async (
            email: string,
            password: string
        ): Promise<void> => {

            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:8089";

            const response = await fetch(
                `${apiUrl}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );

            let json: LoginResponse;

            try {
                json = await response.json();
            } catch {
                throw new Error(
                    `Login failed (${response.status})`
                );
            }

            if (
                !response.ok ||
                !json.success ||
                !json.data
            ) {
                throw new Error(
                    json.message ||
                    "Invalid email or password"
                );
            }

            const {
                token: jwt,
                expiresIn,
                user: userData,
            } = json.data;

            // Save real JWT
            localStorage.setItem(
                "tcc_admin_token",
                jwt
            );

            // Save real backend user
            localStorage.setItem(
                "tcc_admin_user",
                JSON.stringify(userData)
            );

            // Middleware cookie
            setAuthCookie(
                jwt,
                expiresIn || 86400
            );

            // React state
            setToken(jwt);
            setUser(userData);
        },
        []
    );

    /**
     * Logout.
     */
    const logout = useCallback(() => {
        localStorage.removeItem(
            "tcc_admin_token"
        );

        localStorage.removeItem(
            "tcc_admin_user"
        );

        deleteAuthCookie();

        setToken(null);
        setUser(null);

        window.location.href = "/admin/login";
    }, []);

    /**
     * Check user role.
     */
    const hasRole = useCallback(
        (...roles: AdminUser["role"][]) => {
            if (!user) {
                return false;
            }

            return roles.includes(user.role);
        },
        [user]
    );

    return (
        <AdminAuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                hasRole,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

/**
 * Hook used by admin pages.
 */
export function useAdminAuth() {
    const context =
        useContext(AdminAuthContext);

    if (!context) {
        throw new Error(
            "useAdminAuth must be used inside AdminAuthProvider"
        );
    }

    return context;
}