import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;
const COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";
const LOGIN_TIMEOUT_MS = 10_000;

if (!BACKEND) {
    throw new Error(
        "[admin/auth/login] NEXT_PUBLIC_API_URL environment variable is not set."
    );
}

export async function POST(req: NextRequest) {
    // ── Parse and validate request body ───────────────────────────────────────
    let email: string;
    let password: string;

    try {
        const body = await req.json();
        email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        password = typeof body.password === "string" ? body.password : "";
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }

    if (!email || !password) {
        return NextResponse.json(
            { success: false, message: "Email and password are required." },
            { status: 400 }
        );
    }

    // ── Forward to Spring Boot ─────────────────────────────────────────────────
    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(LOGIN_TIMEOUT_MS),
        });
    } catch (err: any) {
        const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
        return NextResponse.json(
            {
                success: false,
                message: timedOut
                    ? "Authentication service timed out. Please try again."
                    : "Authentication service is unavailable. Please try again later.",
            },
            { status: 503 }
        );
    }

    // ── Pass 429 through with Retry-After ─────────────────────────────────────
    if (backendRes.status === 429) {
        let message = "Too many login attempts. Please slow down.";
        try {
            const errJson = await backendRes.json();
            message = errJson.message ?? message;
        } catch { /* non-JSON body — keep default */ }

        const res = NextResponse.json(
            { success: false, message },
            { status: 429 }
        );
        const retryAfter = backendRes.headers.get("Retry-After");
        if (retryAfter) res.headers.set("Retry-After", retryAfter);
        return res;
    }

    // ── Parse backend response ─────────────────────────────────────────────────
    let data: any;
    try {
        data = await backendRes.json();
    } catch {
        return NextResponse.json(
            { success: false, message: `Login failed (${backendRes.status}).` },
            { status: 502 }
        );
    }

    if (!backendRes.ok || !data?.success || !data?.data) {
        return NextResponse.json(
            { success: false, message: data?.message || "Invalid email or password." },
            { status: backendRes.ok ? 500 : backendRes.status }
        );
    }

    const { token, expiresIn, user } = data.data;

    if (!token || !user) {
        return NextResponse.json(
            { success: false, message: "Malformed response from authentication service." },
            { status: 502 }
        );
    }

    // ── Set httpOnly cookie — token never touches the browser ─────────────────
    const response = NextResponse.json({ success: true, user });

    response.cookies.set("tcc_admin_token", token, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: "lax",
        maxAge: typeof expiresIn === "number" && expiresIn > 0 ? expiresIn : 86400,
        path: "/",
    });

    return response;
}