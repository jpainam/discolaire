import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { getSubdomainFromHost } from "./lib/tenant";

export const config = {
  //runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|images|avatars|fonts|favicon.ico|manifest.webmanifest|robots.txt).*)",
  ],
};

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
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  const existingTenant = requestHeaders.get("discolaire-tenant");

  if (!existingTenant) {
    const host = request.headers.get("host");
    const tenant = getSubdomainFromHost(host);
    if (tenant) requestHeaders.set("discolaire-tenant", tenant);
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // allow auth routes
  if (pathname.startsWith("/auth")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const isProtectedRoute = !unProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const schoolYearId = request.cookies.get("x-school-year")?.value;
  const session = getSessionCookie(request);
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  if (isProtectedRoute && (!schoolYearId || !session)) {
    const res = NextResponse.redirect(new URL("/auth/login", request.url), {
      headers: requestHeaders,
    });
    return res;
  }
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
