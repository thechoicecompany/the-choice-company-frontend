import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildAIPrompt } from "@/lib/utils/buildAIPrompt";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { products, occasion, budget, quantity } = await req.json();
    if (!products?.length || !occasion || !budget)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildAIPrompt({ products, occasion, budget, quantity: quantity || 100 }) }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";
    let parsed: Record<string, unknown>;
    try {
      const clean = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { kitName: `${occasion} Kit`, recommendation: rawText, suggestedAddonNames: [], estimatedValue: budget };
    }
    return NextResponse.json({ success: true, ...parsed });
  } catch (err) {
    console.error("AI combo error:", err);
    return NextResponse.json({ success: false, error: "AI generation failed" }, { status: 500 });
  }
}
