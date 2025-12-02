import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const token = cookies.get("admin_token")?.value;
  const role = cookies.get("role")?.value;
  const pathname = nextUrl.pathname;

  // ✅ Redirect to login if no token
  if (!token) {
    const loginUrl = new URL("/administrator", request.url);
    const response = NextResponse.redirect(loginUrl);

    // Clear all existing cookies
    for (const cookie of cookies.getAll()) {
      response.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
    }

    return response;
  }

  // ✅ Define allowed routes per role
  const roleRoutes: Record<string, string[]> = {
    "1": ["/admin"], // Admin routes
    "2": ["/user"], // users routes
  };

  // ✅ If role exists, validate route access
  if (role && roleRoutes[role]) {
    const allowedPaths = roleRoutes[role];
    const isAllowed = allowedPaths.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (!isAllowed) {
      const defaultRedirect = role === "1" ? "/admin/users" : "/user/enquiry";
      return NextResponse.redirect(new URL(defaultRedirect, request.url));
    }

  } else {
    console.warn("⚠️ Missing or invalid role cookie:", role);
    const fallbackUrl = new URL("/administrator", request.url);
    return NextResponse.redirect(fallbackUrl);
  }
  return NextResponse.next();
}

// ✅ Match only protected areas
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};