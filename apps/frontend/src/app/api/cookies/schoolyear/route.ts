// app/api/set-schoolyear/route.ts
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { caller } from "~/trpc/server";

export async function POST(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const schoolYear = await caller.schoolYear.getDefault({
    schoolId: session.user.schoolId,
  });
  if (!schoolYear) {
    return NextResponse.json(
      { error: "No default school year found for the given school ID." },
      { status: 404 },
    );
  }

  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

  (await cookies()).set("x-school-year", schoolYear.id, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
