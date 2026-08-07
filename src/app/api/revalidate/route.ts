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
