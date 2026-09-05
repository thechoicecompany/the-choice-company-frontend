import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/catalogue/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const json = await res.json();

    const responseHeaders: Record<string, string> = {};
    const retryAfter = res.headers.get("Retry-After");
    if (retryAfter) responseHeaders["Retry-After"] = retryAfter;

    return NextResponse.json(json, { status: res.status, headers: responseHeaders });
}