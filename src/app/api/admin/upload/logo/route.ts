// import { NextRequest, NextResponse } from "next/server";
// import { uploadToS3 } from "@/lib/utils/uploadToS3";

// const ALLOWED = ["image/png","image/jpeg","image/jpg","image/svg+xml","image/webp"];
// const MAX_MB  = 5 * 1024 * 1024;

// export async function POST(req: NextRequest) {
//   try {
//     const form = await req.formData();
//     const file = form.get("logo") as File | null;
//     if (!file)                         return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     if (!ALLOWED.includes(file.type))  return NextResponse.json({ error: "Invalid file type. PNG, JPG, SVG only." }, { status: 400 });
//     if (file.size > MAX_MB)            return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });

//     const buffer   = Buffer.from(await file.arrayBuffer());
//     const fileName = `logos/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//     const url      = await uploadToS3(buffer, fileName, file.type);
//     return NextResponse.json({ success: true, url });
//   } catch (err) {
//     console.error("Logo upload error:", err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/upload/image
 *
 * Proxies image upload from browser → Spring Boot → Cloudinary.
 * Returns Cloudinary secure_url to the ProductForm.
 *
 * Request:  multipart/form-data { file: File, folder?: string }
 * Response: { success: true, data: { url: "https://res.cloudinary.com/..." } }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "tcc/products";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File too large. Max 5MB." }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, message: `Invalid type: ${file.type}` }, { status: 400 });
    }

    const forwardForm = new FormData();
    forwardForm.append("file", file);
    forwardForm.append("folder", folder);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8089";
    const springRes = await fetch(`${apiUrl}/api/upload/image`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: forwardForm,
    });

    const json = await springRes.json();

    if (!springRes.ok) {
      return NextResponse.json(
        { success: false, message: json.message ?? "Upload failed" },
        { status: springRes.status }
      );
    }

    return NextResponse.json(json);

  } catch (err: any) {
    console.error("[upload/image] error:", err);
    return NextResponse.json({ success: false, message: "Upload server error" }, { status: 500 });
  }
}
