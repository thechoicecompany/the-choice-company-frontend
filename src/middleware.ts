// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJwt as verifyJwt } from "@/lib/auth/jwt";

// ── No-store helper: applied to every /admin/* response so neither a CDN/
// edge cache nor the browser's back-forward cache can serve a stale,
// possibly-authenticated page without middleware re-running. ─────────────────
function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

// ── Cookie helper: clear tcc_admin_token and redirect ─────────────────────────
function clearTokenAndRedirect(destination: URL): NextResponse {
  const res = NextResponse.redirect(destination);
  res.cookies.set("tcc_admin_token", "", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE !== "false",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return withNoStore(res);
}

// ── Middleware ─────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Legacy /products?category=X → /products/category/X (301 — SEO)
  // Not an /admin path — no no-store needed, this should stay cacheable.
  if (pathname === "/products" && searchParams.has("category")) {
    const url = request.nextUrl.clone();
    url.pathname = `/products/category/${searchParams.get("category")!}`;
    url.searchParams.delete("category");
    return NextResponse.redirect(url, 301);
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("tcc_admin_token")?.value;
  const isLoginPage = pathname === "/admin/login";

  // ── No token ───────────────────────────────────────────────────────────────
  if (!token) {
    if (isLoginPage) return withNoStore(NextResponse.next());

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return withNoStore(NextResponse.redirect(loginUrl));
  }

  // ── Has token — verify once ────────────────────────────────────────────────
  const payload = await verifyJwt(token);

  if (isLoginPage) {
    if (payload) {
      // Already authenticated — go to dashboard
      return withNoStore(NextResponse.redirect(new URL("/admin/dashboard", request.url)));
    }
    // Stale / tampered token on login page — clear and proceed
    return clearTokenAndRedirect(new URL("/admin/login", request.url));
  }

  // ── Protected route ────────────────────────────────────────────────────────
  if (!payload) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("reason", "session_expired");
    return clearTokenAndRedirect(loginUrl);
  }

  return withNoStore(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/products"],
};