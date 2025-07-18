import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define which paths should skip the middleware
export const config = {
  //runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|images|avatars|fonts|favicon.ico|manifest.webmanifest|robots.txt).*)",
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

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const schoolYearId = request.cookies.get("x-school-year")?.value;
  if (isProtectedRoute && !schoolYearId) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  const session = getSessionCookie(request);
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (pathname.startsWith("/s/")) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
  if (pathname.includes("auth/login")) {
    return NextResponse.next();
  }
  const url = new URL(request.url);
  url.pathname = `/s/default${pathname}`;
  return NextResponse.rewrite(url);
  //return NextResponse.rewrite(new URL(`/s/default${pathname}`, request.url));
  //return NextResponse.next();
}
