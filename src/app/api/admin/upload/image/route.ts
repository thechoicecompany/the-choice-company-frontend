// import { NextRequest, NextResponse } from "next/server";

// /**
//  * POST /api/admin/upload/image
//  *
//  * Browser → Next.js → Spring Boot → Cloudinary
//  *
//  * Request:
//  * multipart/form-data
//  * {
//  *   file: File,
//  *   folder?: string
//  * }
//  */
// export async function POST(request: NextRequest) {
//     try {
//         const authHeader = request.headers.get("Authorization");

//         if (!authHeader?.startsWith("Bearer ")) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Unauthorized",
//                 },
//                 { status: 401 }
//             );
//         }

//         const formData = await request.formData();

//         const file = formData.get("file") as File | null;
//         const folder =
//             (formData.get("folder") as string) || "tcc/products";

//         if (!file) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "No file provided",
//                 },
//                 { status: 400 }
//             );
//         }

//         // 5 MB limit
//         if (file.size > 5 * 1024 * 1024) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "File too large. Max 5MB.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const allowed = [
//             "image/jpeg",
//             "image/jpg",
//             "image/png",
//             "image/webp",
//             "image/gif",
//         ];

//         if (!allowed.includes(file.type)) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: `Invalid type: ${file.type}`,
//                 },
//                 { status: 400 }
//             );
//         }

//         // Forward file to Spring Boot
//         const forwardForm = new FormData();

//         forwardForm.append("file", file);
//         forwardForm.append("folder", folder);

//         // Server-side environment variable
//         const apiUrl =
//             process.env.BACKEND_API_URL ?? "http://localhost:8089";

//         const springRes = await fetch(
//             `${apiUrl}/api/upload/image`,
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: authHeader,
//                 },
//                 body: forwardForm,
//             }
//         );

//         const json = await springRes.json();

//         if (!springRes.ok) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: json.message ?? "Upload failed",
//                 },
//                 {
//                     status: springRes.status,
//                 }
//             );
//         }

//         return NextResponse.json(json);
//     } catch (err) {
//         console.error("[upload/image] error:", err);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Upload server error",
//             },
//             { status: 500 }
//         );
//     }
// }

// import { NextResponse } from "next/server";

// export async function POST() {
//     return NextResponse.json({
//         success: true,
//         message: "IMAGE ROUTE WORKING",
//     });
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const file = formData.get("file") as File | null;
        const folder =
            (formData.get("folder") as string) || "tcc/products";

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No file provided",
                },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                {
                    success: false,
                    message: "File too large. Max 5MB.",
                },
                { status: 400 }
            );
        }

        const allowed = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowed.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid type: ${file.type}`,
                },
                { status: 400 }
            );
        }

        const forwardForm = new FormData();

        forwardForm.append("file", file);
        forwardForm.append("folder", folder);

        const apiUrl =
            process.env.BACKEND_API_URL || "http://localhost:8089";

        const springRes = await fetch(
            `${apiUrl}/api/upload/image`,
            {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                },
                body: forwardForm,
            }
        );

        const json = await springRes.json();

        console.log(
            "[upload/image] Spring response:",
            JSON.stringify(json, null, 2)
        );

        if (!springRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: json.message || "Upload failed",
                },
                {
                    status: springRes.status,
                }
            );
        }

        return NextResponse.json(json);

    } catch (error) {
        console.error("[upload/image] error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Upload server error",
            },
            { status: 500 }
        );
    }
}