import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { headers } from "next/headers";
import { auth } from "./auth/server";

// Define which paths should skip the middleware
export const config = {
  runtime: "nodejs",
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { pathname } = request.nextUrl;
  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}
