import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { springApi } from "@/lib/api/client";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = Schema.parse(await req.json());
    await springApi.post("/api/newsletter/subscribe", { email });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 400 });
  }
}
