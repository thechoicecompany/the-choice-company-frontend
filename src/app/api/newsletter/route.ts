import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAxiosError } from "axios";
import { springApi } from "@/lib/api/client";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await springApi.post("/api/newsletter/subscribe", {
      email: parsed.data.email,
      source: "footer",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isAxiosError(err)) {
      console.error("Newsletter subscribe failed:", err.response?.status, err.response?.data);

      if (err.response?.status === 409) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      return NextResponse.json(
        { error: err.response?.data?.error ?? "Subscription failed" },
        { status: err.response?.status ?? 502 }
      );
    }

    console.error("Newsletter subscribe unexpected error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}