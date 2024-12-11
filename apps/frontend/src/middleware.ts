//export { auth as middleware } from "@repo/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { signToken, verifyToken } from "@repo/auth/session";

import { env } from "./env";

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images directory in /public (public static images)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};

const unProtectedRoutes = ["/auth", "/gabari", "/invite", "/fonts"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  //const isProtectedRoute = pathname.startsWith(protectedRoutes);
  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !sessionCookie) {
    // Temporary fix due to https://github.com/vercel/next.js/issues/54450
    if (env.NODE_ENV === "production") {
      let newUrl = request.url;
      if (newUrl.includes("localhost")) {
        newUrl = env.NEXT_PUBLIC_BASE_URL;
      }
      return NextResponse.redirect(
        new URL(
          `/auth/login?redirect=${newUrl}`,
          new URL(env.NEXT_PUBLIC_BASE_URL),
        ),
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/auth/login?redirect=${request.url}`,
          new URL(env.NEXT_PUBLIC_BASE_URL),
        ),
      );
    }
  }

  const res = NextResponse.next();

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: "session",
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiresInOneDay,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(
          new URL("/auth/login", new URL(env.NEXT_PUBLIC_BASE_URL)),
        );
      }
    }
  }

  return res;
}
