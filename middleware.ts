// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("tcc_admin_token")?.value;
//   const isLoginPage = pathname === "/admin/login";
//   const isAdminRoute = pathname.startsWith("/admin");

//   if (isLoginPage && token) {
//     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//   }
//   if (isAdminRoute && !isLoginPage && !token) {
//     const loginUrl = new URL("/admin/login", request.url);
//     loginUrl.searchParams.set("from", pathname);
//     return NextResponse.redirect(loginUrl);
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDemoMode =
    process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";

  const token =
    request.cookies.get("tcc_admin_token")?.value;

  const isLoginPage =
    pathname === "/admin/login";

  const isAdminRoute =
    pathname.startsWith("/admin");

  // ==========================================
  // FRONTEND DEMO MODE
  // ==========================================
  //
  // No backend authentication required.
  // Allow all admin pages.
  //
  if (isDemoMode && isAdminRoute) {
    return NextResponse.next();
  }

  // ==========================================
  // REAL AUTHENTICATION
  // ==========================================

  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL(
        "/admin/dashboard",
        request.url
      )
    );
  }

  if (
    isAdminRoute &&
    !isLoginPage &&
    !token
  ) {
    const loginUrl =
      new URL(
        "/admin/login",
        request.url
      );

    loginUrl.searchParams.set(
      "from",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};