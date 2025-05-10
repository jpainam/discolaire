import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { signToken, verifyToken } from "@repo/auth/session";
import { env } from "./env";

// Define which paths should skip the middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|fonts|favicon.ico|manifest.webmanifest|robots.txt).*)",
  ],
};

// These routes don't require auth
const unProtectedRoutes = [
  "/auth",
  "/gabari",
  "/invite",
  "/fonts",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/robots.txt",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");

  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const redirectToLogin = (redirectUrl: string) => {
    return NextResponse.redirect(
      new URL(
        `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`,
        env.NEXT_PUBLIC_BASE_URL,
      ),
    );
  };

  // No session & trying to access protected route
  if (isProtectedRoute && !sessionCookie) {
    return redirectToLogin(request.url);
  }

  const response = NextResponse.next();

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
      const newToken = await signToken({
        ...parsed,
        expires: expires.toISOString(),
      });

      response.cookies.set("session", newToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        expires,
      });
    } catch (error) {
      console.error("Invalid session token:", error);
      response.cookies.delete("session");
      if (isProtectedRoute) {
        return redirectToLogin(request.url);
      }
    }
  }

  return response;
}
