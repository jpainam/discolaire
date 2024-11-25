//export { auth as middleware } from "@repo/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { signToken, verifyToken } from "@repo/auth/session";

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
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${request.url}`, request.url),
    );
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
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  }

  return res;
}
