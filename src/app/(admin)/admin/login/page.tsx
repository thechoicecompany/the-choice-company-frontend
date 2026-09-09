"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminAuth, RateLimitError } from "@/lib/hooks/useAdminAuth";

function AdminLoginForm() {
    const { login } = useAdminAuth();
    const params = useSearchParams();
    const from = params.get("from") ?? "/admin/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Show "session expired" banner if redirected here by middleware
    const reason = params.get("reason");

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (cooldown > 0) return;
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            // Full page navigation — forces middleware to run and validate the
            // new httpOnly cookie before landing on the protected route.
            window.location.href = from;
        } catch (err: any) {
            if (err instanceof RateLimitError) {
                setCooldown(err.retryAfterSeconds);
                setError(err.message);
            } else {
                setError(err.message ?? "Login failed. Please try again.");
            }
            setLoading(false);
        }
        // Note: setLoading(false) intentionally omitted from the success path —
        // the button stays in loading state during the full-page redirect so
        // the user doesn't see a flash back to the form.
    }

    const disabled = loading || cooldown > 0;

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1A5C4A 100%)" }}
        >
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur mb-4 border border-white/20">
                        <span className="text-4xl">🎁</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        The Choice Company
                    </h1>
                    <p className="text-white/50 text-sm mt-1 tracking-wide uppercase">
                        Admin Panel · Secure Access
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-navy">Welcome back</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Sign in to manage your platform
                        </p>
                    </div>

                    {/* Session-expired banner — shown when middleware redirected here */}
                    {reason === "session_expired" && !error && (
                        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                            <span className="text-amber-500 text-lg flex-shrink-0">⏱</span>
                            <p className="text-amber-700 text-sm">
                                Your session has expired. Please sign in again.
                            </p>
                        </div>
                    )}

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                            <p className="text-red-700 text-sm">
                                {error}
                                {cooldown > 0 && ` (retry in ${cooldown}s)`}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@thechoicecompany.in"
                                disabled={disabled}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm transition-all disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={disabled}
                                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm transition-all disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                                >
                                    {showPass ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={disabled}
                            className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                            style={{
                                background: disabled
                                    ? "#6B7280"
                                    : "linear-gradient(135deg, #0D1B2A 0%, #1A5C4A 100%)",
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in…
                                </span>
                            ) : cooldown > 0 ? (
                                `Try again in ${cooldown}s`
                            ) : (
                                "Sign In to Admin Panel"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            Protected by JWT authentication · Session expires in 24 hours
                        </p>
                    </div>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    © 2026 The Choice Company · Stimulus Research Services
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="min-h-screen flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1A5C4A 100%)" }}
                >
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <AdminLoginForm />
        </Suspense>
    );
}