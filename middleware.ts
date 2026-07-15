import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // If logged-in admin visits login page, redirect to dashboard
  if (pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Add headers to prevent caching (fixes back button after logout)
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
