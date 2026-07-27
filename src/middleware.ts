// REDBOX middleware — protect admin routes.
// Public: everything except /admin/* (excluding /admin/login) and admin APIs.

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Determine if route is protected
  const isAdminPage = path === "/admin" || (path.startsWith("/admin/") && path !== "/admin/login");
  const isAdminApi =
    path.startsWith("/api/admin/settings") ||
    path.startsWith("/api/admin/categories") ||
    path.startsWith("/api/admin/banners") ||
    path.startsWith("/api/admin/blog") ||
    path.startsWith("/api/admin/faq") ||
    path.startsWith("/api/products");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized. Silakan login terlebih dahulu.", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("redirect", path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/products/:path*",
  ],
};
