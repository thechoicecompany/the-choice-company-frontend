import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { secret, path } = await req.json();
    if (secret !== process.env.REVALIDATE_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!path)
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ success: false, message: "Missing ?path=" }, { status: 400 });
  }
  revalidatePath(path);
  return NextResponse.json({ success: true, revalidated: path, now: Date.now() });
}
