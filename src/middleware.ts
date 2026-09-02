// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Verify JWT by asking the backend — no secret needed on the frontend ──
async function verifyJwt(token: string): Promise<boolean> {
  try {
    const backendUrl = process.env.BACKEND_API_URL ?? "http://localhost:8089";
    const res = await fetch(`${backendUrl}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ── Legacy /products?category=X → /products/category/X (SEO redirect) ──
  if (pathname === "/products" && searchParams.has("category")) {
    const category = searchParams.get("category")!;
    const url = request.nextUrl.clone();
    url.pathname = `/products/category/${category}`;
    url.searchParams.delete("category");
    return NextResponse.redirect(url, 301);
  }

  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const tokenValue = request.cookies.get("tcc_admin_token")?.value;
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage && tokenValue) {
    const valid = await verifyJwt(tokenValue);
    if (valid) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    const res = NextResponse.next();
    res.cookies.delete("tcc_admin_token");
    return res;
  }

  if (!isLoginPage && !tokenValue) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isLoginPage && tokenValue) {
    const valid = await verifyJwt(tokenValue);
    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      loginUrl.searchParams.set("reason", "session_expired");
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("tcc_admin_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/products"],
};