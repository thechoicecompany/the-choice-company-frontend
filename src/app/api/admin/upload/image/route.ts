import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "tcc/products";

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, message: "File too large. Max 5MB." },
                { status: 400 }
            );
        }

        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: `Invalid type: ${file.type}` },
                { status: 400 }
            );
        }

        const forwardForm = new FormData();
        forwardForm.append("file", file);
        forwardForm.append("folder", folder);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    } catch (err) {
        console.error("[upload/image] error:", err);
        return NextResponse.json(
            { success: false, message: "Upload server error" },
            { status: 500 }
        );
    }
}