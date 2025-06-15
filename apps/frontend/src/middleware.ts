import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define which paths should skip the middleware
export const config = {
  //runtime: "nodejs",
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

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const schoolYearId = request.cookies.get("x-school-year")?.value;
  if (isProtectedRoute && !schoolYearId) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: any = null;
  try {
    session = getSessionCookie(request);
  } catch (err) {
    console.error("❌ Failed to get session in middleware:", err);
    session = null;
  }
  //const session = getSessionCookie(request);
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}
