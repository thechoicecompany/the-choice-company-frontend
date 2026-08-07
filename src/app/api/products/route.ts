import { NextRequest, NextResponse } from "next/server";
import { springApi } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const { search } = new URL(req.url);
    const res = await springApi.get(`/api/products${search}`);
    return NextResponse.json(res.data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
