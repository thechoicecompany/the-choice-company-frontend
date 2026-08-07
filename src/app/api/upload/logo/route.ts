import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/utils/uploadToS3";

const ALLOWED = ["image/png","image/jpeg","image/jpg","image/svg+xml","image/webp"];
const MAX_MB  = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("logo") as File | null;
    if (!file)                         return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED.includes(file.type))  return NextResponse.json({ error: "Invalid file type. PNG, JPG, SVG only." }, { status: 400 });
    if (file.size > MAX_MB)            return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });

    const buffer   = Buffer.from(await file.arrayBuffer());
    const fileName = `logos/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const url      = await uploadToS3(buffer, fileName, file.type);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("Logo upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
