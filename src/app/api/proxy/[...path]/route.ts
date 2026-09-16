import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { verifyAdminJwt } from "@/lib/auth/jwt";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 60_000;

// This proxy exists ONLY so the browser can call authenticated admin
// endpoints without the JWT (stored in an httpOnly cookie) ever touching
// client JS. It is NOT a general passthrough. Every path segment must
// match one of these prefixes or the request is rejected outright —
// nothing else on the backend is reachable through this route.
const ALLOWED_PREFIXES: readonly string[][] = [
    ["api", "admin"],
    ["api", "upload"],
    ["api", "inquiries"],
];

// Statuses that must never carry a body (HTTP spec forbids it — passing a
// body, even an empty one, to Response/NextResponse for these throws
// "Invalid response status code 204/304" at runtime).
const NO_BODY_STATUSES = new Set([204, 205, 304]);

// Mutating admin calls under these path prefixes invalidate the public
// hero-banner cache so the homepage never serves a deleted/stale banner.
const REVALIDATE_RULES: { prefix: string[]; methods: string[]; tag: string }[] = [
    {
        prefix: ["api", "admin", "hero-banners"],
        methods: ["POST", "PUT", "PATCH", "DELETE"],
        tag: "hero-banners",
    },
];

function isAllowedPath(segments: string[]): boolean {
    if (segments.length === 0) return false;
    if (segments.some((s) => !s || s === ".." || s.includes("%2e"))) return false;
    return ALLOWED_PREFIXES.some((prefix) =>
        prefix.every((seg, i) => segments[i] === seg)
    );
}

function tagsToRevalidate(segments: string[], method: string): string[] {
    return REVALIDATE_RULES.filter(
        (rule) =>
            rule.methods.includes(method) &&
            rule.prefix.every((seg, i) => segments[i] === seg)
    ).map((rule) => rule.tag);
}

// Every response leaving this proxy carries no-store: these are all
// authenticated admin API responses and must never be cached by a CDN,
// intermediary proxy, or the browser (including bfcache-adjacent caching).
function withNoStore(headers: Headers): Headers {
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return headers;
}

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    if (!BACKEND) {
        return NextResponse.json(
            { success: false, message: "Backend URL not configured." },
            { status: 500 }
        );
    }

    const { path } = await params;

    if (!isAllowedPath(path)) {
        // 404, not 403 — don't confirm/deny that a given internal path exists
        return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
    }

    // Every allowed prefix here is an authenticated admin surface.
    // Reject bad/missing tokens here instead of trusting the backend alone.
    const token = req.cookies.get("tcc_admin_token")?.value;
    if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const payload = await verifyAdminJwt(token);
    if (!payload) {
        return NextResponse.json({ success: false, message: "Session expired." }, { status: 401 });
    }

    const targetUrl = `${BACKEND}/${path.join("/")}${req.nextUrl.search}`;

    const headers = new Headers();
    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);
    headers.set("Authorization", `Bearer ${token}`); // never trust a client-supplied one — we never read it

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    let backendRes: Response;
    try {
        backendRes = await fetch(targetUrl, {
            method,
            headers,
            body: hasBody ? req.body : undefined,
            // @ts-expect-error -- duplex is valid at runtime, missing from TS lib types
            duplex: hasBody ? "half" : undefined,
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch (err: any) {
        const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
        return NextResponse.json(
            { success: false, message: timedOut ? "Backend timed out." : "Backend unavailable." },
            { status: 503 }
        );
    }

    // Bodiless statuses (204/205/304) must be returned with a null body —
    // passing even an empty ArrayBuffer here throws at the Response layer.
    if (NO_BODY_STATUSES.has(backendRes.status)) {
        const resHeaders = new Headers();
        const resContentType = backendRes.headers.get("content-type");
        if (resContentType) resHeaders.set("Content-Type", resContentType);
        withNoStore(resHeaders);

        // The backend succeeded (2xx) — invalidate downstream caches now,
        // before returning, so the very next homepage request is fresh.
        if (backendRes.status < 300) {
            for (const tag of tagsToRevalidate(path, method)) revalidateTag(tag);
        }

        return new NextResponse(null, { status: backendRes.status, headers: resHeaders });
    }

    const buffer = await backendRes.arrayBuffer();
    const resHeaders = new Headers();
    const resContentType = backendRes.headers.get("content-type");
    if (resContentType) resHeaders.set("Content-Type", resContentType);
    withNoStore(resHeaders);

    if (backendRes.status >= 200 && backendRes.status < 300) {
        for (const tag of tagsToRevalidate(path, method)) revalidateTag(tag);
    }

    return new NextResponse(buffer, { status: backendRes.status, headers: resHeaders });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };