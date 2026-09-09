import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;
const COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";
const LOGOUT_TIMEOUT_MS = 5_000;

export async function POST() {
    // ── Notify Spring Boot (best-effort — don't block logout if it fails) ──────
    if (BACKEND) {
        try {
            await fetch(`${BACKEND}/api/auth/logout`, {
                method: "POST",
                signal: AbortSignal.timeout(LOGOUT_TIMEOUT_MS),
            });
        } catch {
            // Backend logout is best-effort; we still clear the cookie
        }
    }

    // ── Clear httpOnly cookie ──────────────────────────────────────────────────
    const response = NextResponse.json({ success: true });

    response.cookies.set("tcc_admin_token", "", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return response;
}